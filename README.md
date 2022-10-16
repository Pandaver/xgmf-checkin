# **xgmf-checkin**

⚙️学工魔方健康日报自动填报

## 📖使用说明

## 1️⃣第一步：获取参数

#### 🍪获取cookie

[微信扫码登陆](http://login.b8n.cn/qr/weixin/student/8)

登陆成功后，键盘 `F12` 打开 `开发者工具`

打开后切换到 `网络(Network)`

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/devtools_network.png">
</div>


刷新一下网页，`网络(Network)` 里找到 `student/`  请求，点击该请求右侧会弹出详细信息，找到 `请求标头(Request Headers)` 中的 Cookie ，复制保存下来

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/get_cookie.png">
</div>


#### 🧾获取班级号和表单号

打开学工魔方公众号，进入 `防疫专项` - `健康日报` 页面

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/checkin_page.png">
</div>


点击右上角 `···`

点击 `复制链接`

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/copy_checkin_page_url.png">
</div>

复制出来的内容就包含了 `班级号` 和 `表单号` 

> 𝗁𝗍𝗍𝗉://𝗑𝗀𝗆𝖿.𝗀𝟪𝗇.𝖼𝗇/𝗌𝗍𝗎𝖽𝖾𝗇𝗍/𝖼𝗈𝗎𝗋𝗌𝖾/**这段数字是班级号**/𝗉𝗋𝗈𝖿𝗂𝗅𝖾/**这段数字是表单号**

#### 🌐获取填报地点经纬度

##### 方法一

在学工魔方公众号内填报时，当前位置里“|”后面的内容就是当前位置的经纬度

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/get_crood_from_checkin_page.png">
</div>


##### 方法二

[点击打开坐标拾取](https://lbs.qq.com/getPoint/)

左上角选择城市后输入地点搜索，点击弹出的地点项，右侧会显示地点的经纬度

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/get_crood_from_lbs.png">
</div>


#### ✉️获取pushplusToken（非必填）

填写后每日填报成功后，pushplus公众号会推送通知给你，**强烈建议填写此参数**

微信扫码关注pushplus公众号

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/pushplus_QR_code.jpg">
</div>


关注后发送 “**token**” 即可获取

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/get_pushplus_token.png">
</div>


配置后推送效果：

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/checkin_success_push.png">
</div>


### 2️⃣第二步：Fork此仓库

点击仓库右上角的 ⭐**Star** 和 🔱**Fork**

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/create_new_fork.png">
</div>


**注意：接下来的步骤都是在你自己 Fork 后的仓库下进行操作**

### 3️⃣第三步：设置参数

依次点击 `⚙️ Settings` ` ✴️ Secrets` `Actions`  `New repository secret`

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/add_secrets_page.png">
</div>


Name必须为大写**CONFIG**

Secret填完一个参数回车换一行

至少要填四个参数[cookie](#获取cookie)、[course(班级号)](#获取班级号和表单号)、[profile(表单号)](#获取班级号和表单号)、[coordinate1(填报经纬度)](#获取填报地点经纬度)

示例：

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/add_secrets_example.png">
</div>


填完后点击 `Add secret`

### 4️⃣第四步：启用Action

点击 Actions，再点击 `I understand my workflows, go ahead and enable them`

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/enable_actions.png">
</div>
再点击仓库右上角的⭐**Star** 代码就会运行一次了

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/star_on.png">
</div>


### 5️⃣第五步：查看运行结果

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/workflow_runs_list.png">
</div>


任务一共包含两步，`Sync latest commits from upstream repo ` 这步是为了确保每次运行的都是最新代码，不用管

主要看 `XGMF Checkin` 这步

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/first_run_details.png">
</div>


绿勾就表示 **代码运行成功**

点开 **XGMF Checkin** 中的 **Run checkin** 可以看到运行日志，此处因为当日已经填报过所以显示填报失败

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/first_run_details.png">
</div>



如果在 [第三步：设置参数](#3%EF%B8%8F⃣第三步设置参数) 时有填写 [pushplusToken](#%EF%B8%8F获取pushplustoken非必填) 参数，填报失败了也会推送结果到微信

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/checkin_repeat_push.png">
</div>


## 其他参数

### coordinate2（非必填）

填写后填报位置会在coordinate1与coordinate2形成的矩形中随机取点

例如：当coordinate1为图中点①坐标，coordinate2为图中点②坐标，则每次填报地点会取红框中任意一点的经纬度

<div align=center>
	<img src="https://cdn.jsdelivr.net/gh/Pandaver/xgmf-checkin/images/two_coord_example.png">
</div>




## 全部参数

| 参数          | 说明                                                | 必填项 | 可选值                                               | 默认值              | 示例                                                |
| ------------- | --------------------------------------------------- | :----: | ---------------------------------------------------- | ------------------- | :-------------------------------------------------- |
| cookie        | [cookie](#获取cookie)                               |   ✔️    | —                                                    | —                   | yxktmf=\*\*\*\*;remember_student_\*\*\*\*=\*\*\*\*; |
| course        | [班级号](#获取班级号和表单号)                       |   ✔️    | —                                                    | —                   | 54321                                               |
| profile       | [表单号](#获取班级号和表单号)                       |   ✔️    | —                                                    | —                   | 30                                                  |
| coordinate1   | [填报地点经纬度](获取填报地点经纬度)                |   ✔️    | —                                                    | —                   | 39.90882,116.39747                                  |
| pushplusToken | [pushplus Token](#%EF%B8%8F获取pushplustoken非必填) |        | —                                                    | —                   | 32位英文数字组合                                    |
| coordinate2   | [经纬度2](#coordinate2非必填)                       |        | —                                                    | —                   | 39.90693,116.39757                                  |
| temperature   | 填报体温                                            |        | —                                                    | 36.0~36.9<br>随机值 | 37                                                  |
| symptom       | 表现症状                                            |        | 0:无异常<br>1:发烧<br>2:咳嗽<br>3:乏力<br>4:呼吸困难 | 0                   | 0                                                   |
| medical       | 就医情况                                            |        | 0:未就医<br>1:已就医                                 | 0                   | 0                                                   |
| quarantine    | 隔离情况                                            |        | 0:未隔离<br>1:已被隔离                               | 0                   | 0                                                   |
| contact       | 最新接触                                            |        | —                                                    | 无接触              | 无最新接触                                          |
