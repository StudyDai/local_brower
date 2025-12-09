import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
# 导入 webdriver-manager 的 ChromeDriverManager
from webdriver_manager.chrome import ChromeDriverManager
# By类用来查找在网页上的元素标签的
from selenium.webdriver.common.by import By
# 要选择选择框的时候要单独导入这个
from selenium.webdriver.support.select import Select
# 这个类是让机器人模拟人用鼠标去点击的效果
from selenium.webdriver.common.action_chains import ActionChains
# 要进行键盘操作的时候 如果导入下面这个
from selenium.webdriver.common.keys import Keys
# 这个是设置等待对象用的
from selenium.webdriver.support.wait import WebDriverWait
# 导入判断条件 这个ec有超级多 需要的时候再查 里面有很多的判断常量
from selenium.webdriver.support import expected_conditions as ec

# 这个就是谷歌浏览器的driver自动下载模式 无须手动下载driver并且导入的操作
s = Service(ChromeDriverManager().install())

# 打开浏览器
browser = webdriver.Chrome(service=s)

# 对浏览器进行鼠标操作
# 第一个参数就是浏览器,你要对哪个浏览器操作,你就写哪个,因为可能不止一个浏览器
# context_click 这个是要点击的对象 绑定在一起 这个方法就是右键
# double_click 这个是要点击的对象 绑定在一起 这个方法就是双击
# drag_and_drop 就是实现了一个拖拽效果
# move_to_element 就是把鼠标悬停在元素上 hover
# perform方法就是执行的意思
right_click = browser.find_element(By.TAG_NAME, 'div')
ActionChains(browser).context_click(right_click).perform()
ActionChains(browser).move_to_element(right_click).perform()
# 拖拽操作 反正就是传递俩通过id或者css拿到的元素进去
ActionChains.drag_and_drop('移动的元素','最终位置的元素')


# 选择框的选择方式一:  索引选择 索引也是从0开始的
# Select(browser.find_element(By.NAME, "训练营")).select_by_index("1")
# 选择框的选择方式二:  值选择 通过元素的value来定
# Select(browser.find_element(By.NAME, "训练营")).select_by_value("价值1")
# 选择框的选择方式二:  文本值选择 就是你的前端展示的文本内容如<opyion value="价值1">选项1</option>
# Select(browser.find_element(By.NAME, "训练营")).select_by_visible_text("选项1")

# 输入网页
browser.get(r'http://baidu.com')
# 查看Cookie
print(browser.get_cookie())
# 添加cookie
browser.add_cookie({ 'name': 'daidai', 'value': 'handsome' })
# 删除cookie
browser.delete_all_cookies()

# 打开一个新窗口 这里面好像就是js代码诶 哈哈 这里面可以直接写js代码
browser.execute_script('alert("脚本已运行)')
browser.execute_script("console.log('脚本已关闭')")
# browser.execute_script('window.open()')
# browser.window_handles 是当前浏览器开了多少个窗口 打印一个列表,里面是窗口句柄,类似身份证
# 跳转新的选项卡 因为tab栏是位置是固定的,所以1就代表第二个tab栏标签
# browser.switch_to.window(browser.window_handles[1])
# browser.switch_to.frame(iframe的id名称)

# 第一个查找元素的方法就是通过id 第一个参数是固定的 第二个参数就是元素的id值
element = browser.find_element(By.ID, 'chat-textarea') 
# 这个是根据元素的name属性的值来进行抓取
# element = browser.find_element(By.NAME, 'chat-textarea') 
# 注意,抓取的class类名,是不需要加.的,直接写字符串就行
# element = browser.find_element(By.CLASS_NAME, 'chat-textarea') 
# 这个就是标签名称,字符串写input/div等等 但是这种是一个列表来的 所以需要选择索引第几个去操作,否则会报错
# 如果是存在多个的情况下,得用find_elements 多了个s的后缀
# element = browser.find_elements(By.TAG_NAME, 'chat-textarea') 
# 通过超链接的文本快速定位
# element = browser.find_element(By.LINE_TEXT, '新闻') 
# 模糊查找，只要超链接的文本包含了新闻的就可以被点击
# element = browser.find_element(By.PARTIAL_LINE_TEXT, '新闻') 

# xpath的使用规则 有自己特殊的语法 其实也是拿元素,只不过这种是对于那种比较难拿到的元素操作方便一点
# browser.find_element(By.XPATH, '//*[@id="kw"]')
# 通过css定位法 其实就是多了那个前缀,没别的
# browser.find_element(By.CSS_SELECTOR, '#dw')
#  get_attribute可以获取到元素的属性值,拿到就可以操作
#  text方法可以获取元素的innerText
# browser.find_element(By.CSS_SELECTOR, '#dw') 元素可以直接拿text、id、tag_name、location位置，size大小
browser.find_element(By.CSS_SELECTOR, '#dw').get_attribute('src')

# 接下来是键盘的操作  其实就是导入了键盘的一些常量
browser.find_element(By.ID, 'dw').send_keys(Keys.ENTER)
# 例如要全选
browser.find_element(By.ID, 'dw').send_keys(Keys.CONTROL, 'a')
# 例如要按键盘F1
browser.find_element(By.ID, 'dw').send_keys(Keys.F1)


# 元素点击事件如下
# element.click()
if element is not None:
    print('我找到了元素', element)
    # 我们可以通过send_keys往输入框发送内容如下
    element.send_keys('广州今天的天气如何')
    # 我们可以通过调用提交方法,来模拟回车
    element.submit()
    # 还有清除输入框的功能
    element.clear()

# 设置分辨率
# browser.set_window_size(1920, 1080)
# 截图预览 后面传递的只有名称的话,他会存放在相对路径
# browser.get_screenshot_as_file('截图.png')

# 打开淘宝
# browser.get(r'http://taobao.com')

# 后退
# browser.back()
# 查看浏览器标题
# print(browser.title)
# 当前网站的网址是
# print(browser.current_url)
# 当前浏览器名称
# print(browser.name)
# 当前网站的源代码
# print(browser.page_source)
# 等待一秒
# time.sleep(1)
# 前进
# browser.forward()

# 有点像js的try和catch
# try:
#     browser.refresh()
#     time.sleep(2)
#     print('刷新成功')
# except Exception as e:
#     print('刷新失败', e)

input("按下任意键退出浏览器")
# 强制等待2秒
# time.sleep(2)

# 关闭当前浏览器的标签页,仅限一个标签页的时候使用
# browser.close()

#  场景题 这个是隐式等待 就是我最多等你十秒,你十秒内要给我完成,不然就不走下面的代码了
browser.implicitly_wait(10)
#  场景题 显式等待 第一个参数就是启动的浏览器驱动 第二个参数就是超时时间 第三个参数就是每过多少秒就轮训
# 第四个参数就是是否要忽略掉报错的消息
wait = WebDriverWait(browser, 10)
# 设置判断条件,等待id=kw的元素加载完成 ec是条件的意思 如上导入的
# 反正就是这个判断条件不出现之前,就会一直等待, 但是因为设置了超时时间,所以如果十秒没出来就会抛出错误
input = wait.until(ec.presence_of_element_located(By.ID, 'kw'))
# 这个是kw元素什么时候消失才是True
input = wait.until_not(ec.presence_of_element_located(By.ID, 'kw'))

# 关闭当前浏览器
browser.quit()