const axios = require('axios')
const querystring = require('querystring')
const fs = require('fs')
const path = require('path')
const propertiesReader  = require('properties-reader')
const properties = propertiesReader().read(process.env.CONFIG || process.argv[2])
const HttpsProxyAgent = require('https-proxy-agent')

// Cookie
const cookie = properties.get('cookie')
// 班级号
const course = properties.get('course')
// 表单号
const profile = properties.get('profile')
// 经纬度1
const coordinate1 = properties.get('coordinate1')
// 经纬度2
const coordinate2 = properties.get('coordinate2')||''
// https://www.pushplus.plus/
const pushplusToken = properties.get('pushplusToken')||''
// 当天体温 36°-37°
const temperature = properties.get('temperature')||(36 + Math.random()).toFixed(1)
// 表现症状 0:无异常 1:发烧 2:咳嗽 3:乏力 4:呼吸困难
const symptom = properties.get('symptom')||'0'
// 就医情况 0:未就医 1:已就医
const medical = properties.get('medical')||'0'
// 隔离情况 0:未隔离 1:已被隔离
const quarantine = properties.get('quarantine')||'0'
// 最新接触
const contact = properties.get('contact')||'无接触'
// 403重试延迟
const delayWhen403 = +properties.get('delayWhen403')||60000
// 经纬度偏离量
const coordOffset = +properties.get('coordOffset')||0.00005

let coord = coordinate1
const checkinURL = `http://xgmf.g8n.cn/student/course/${course}/profiles/${profile}`

async function main() {
  if (!cookie || !course || !profile || !coordinate1) {
    console.error('有必填项为空，请检查！')
    return
  }
  coordShift()
  const address = await getAddrByCoord(coord)
  console.log('地址：' + address + '|' + coord)
  console.log('当天体温：' + temperature)
  const data = {
    'form_id': '45',
    'formid': '58',
    'formdata[fn_1]': temperature,
    'formdata[fn_2]': symptom,
    'formdata[fn_3]': medical,
    'formdata[fn_4]': quarantine,
    'formdata[fn_5]': contact,
    'formdata[fn_6]': `${address}|${coord}`,
    'formdata[gps_addr]': `${address}|${coord}`,
    'formdata[gps_xy]': coord,
    '_score': '0'
  }
  let html = await checkin(data)

  if (html.indexOf('新增成功') >= 0) {
    console.info('填报成功')
    const successContent = fs.readFileSync(path.resolve(__dirname, './success.html'), 'utf-8').toString()
    await pushplus(pushplusToken, successContent)
  } else {
    console.error('填报失败')
    let desc = html.match(/<div class="desc">(.*?)<\/div>/)[1]
    desc = desc.replace(/<br>/g, '\n')
    console.log(desc)
    // 返回上一页
    html = html.replace('href="javascript:history.go(-1);"', `href="${checkinURL}"`)
    // 返回学生中心
    html = html.replace('href="/student"', 'href="http://xgmf.g8n.cn/student"')
    // 直接使用学工魔方图片有防盗链
    let svg404 = fs.readFileSync(path.resolve(__dirname, './404.svg'), 'utf-8').toString()
    svg404 = encodeSvg(svg404)
    html = html.replace('<img src="//c.d8n.cn/res/img/icon/404.svg', '<img src="' + svg404)
    await pushplus(pushplusToken, html)
  }
}

/**
 * 坐标偏移
 */
function coordShift() {
  if (coordinate2) {
    const coord1 = coordinate1.split(',')
    const coord2 = coordinate2.split(',')
    const lat = [+coord1[0], +coord2[0]].sort()
    const long = [+coord1[1], +coord2[1]].sort()
    coord = randomRangeNum(lat[1], lat[0], 5) + ',' + randomRangeNum(long[1], long[0], 5)
  } else {
    // 经纬度浮动0.00005°
    // 0.00001° ≈ 1米
    const coordinate = coordinate1.split(',')
    for (let i = 0; i < coordinate.length; i++) {
      coordinate[i] = +coordinate[i] + randomRangeNum(coordOffset, -coordOffset, 5)
      coordinate[i] = coordinate[i].toFixed(5)
    }
    coord = coordinate.join()
  }
}

/**
 * 区间随机数（支持小数）
 * @param maxNum 区间最大值
 * @param minNum 区间最小值
 * @param decimalNum 保留小数位数
 * @returns {number}
 */
function randomRangeNum(maxNum, minNum, decimalNum) {
  let max = 0, min = 0
  minNum <= maxNum ? (min = minNum, max = maxNum) : (min = maxNum, max = minNum)
  switch (arguments.length) {
    case 1:
      return Math.floor(Math.random() * (max + 1))
    case 2:
      return Math.floor(Math.random() * (max - min + 1) + min)
    case 3:
      return +(Math.random() * (max - min) + min).toFixed(decimalNum)
    default:
      return Math.random()
  }
}

async function checkin(data) {
  const headers = {
    'Host': 'xgmf.g8n.cn',
    'Proxy-Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Origin': 'http://xgmf.g8n.cn',
    'Upgrade-Insecure-Requests': '1',
    'DNT': '1',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.42',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Referer': 'http://xgmf.g8n.cn/student/course/53961/profiles/29',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Cookie': cookie
  }

  try {
    const res = await axios({
      method: 'post',
      url: checkinURL,
      headers,
      data: querystring.encode(data),
      proxy: false,
      httpAgent: new HttpsProxyAgent('http://xgmf:xgmf@140.249.73.234:15031')
    })
    return res.data
  } catch (e) {
    if (e.response.status === 403) {
      console.log('403重试')
      await new Promise(resolve => setTimeout(() => resolve(), delayWhen403))
      return checkin(data)
    }
  }
}

/**
 * pushplus推送
 * @param token pushplus token
 * @param content 推送内容
 * @returns {Promise<void>}
 */
async function pushplus(token, content) {
  if (token) {
    const res = await axios({
      method: 'post',
      url: 'http://www.pushplus.plus/send',
      data: {
        token,
        title: '学工魔方签到',
        content: content
      }
    })
    if (res.data.code !== 200) {
      console.error(`pushplus推送失败`)
      console.error(res.data)
    }
    console.log(`pushplus已推送，流水号${res.data.data}`)
  }
}

/**
 * 腾讯地图逆地址解析
 * @param coord 经纬度
 * @returns {Promise<string>}
 */
async function getAddrByCoord(coord) {
  const res = await axios({
    url: 'https://apis.map.qq.com/ws/geocoder/v1',
    method: 'get',
    params: {
      // 学工魔方腾讯地图KEY http://c.d8n.cn/res/app.js
      key: 'E6LBZ-RJJCK-TBAJY-A5XM3-6ZR32-SIFZH',
      location: coord,
      get_poi: 0
    }
  })
  return geoParse(res.data)
}

/**
 * 解析腾讯地图逆地址返回数据
 * @param _geodata 腾讯地图接口返回数据
 * @returns {string}
 */
function geoParse(_geodata) {
  const _ac = _geodata.result.address_component
  let _addr = _ac.province + ',' + _ac.city + ',' + _ac.district + ',' + _ac.street + _ac.street_number.replace(_ac.street, '')

  if (typeof (_geodata.result['formatted_addresses']) != 'undefined' && typeof (_geodata.result['formatted_addresses']['recommend']) != 'undefined')
    _addr += _geodata.result['formatted_addresses']['recommend']

  return _addr
}

/**
 * svg转义方便嵌入HTML中使用
 * @param svg
 * @returns {string}
 */
function encodeSvg(svg) {
  return 'data:image/svg+xml,' + svg.replace(/"/g,`'`).replace(/%/g,'%25').replace(/#/g,'%23').replace(/{/g,'%7B').replace(/}/g,'%7D').replace(/</g,'%3C').replace(/>/g,'%3E')
}


~(async () => {
  await main()
})()
