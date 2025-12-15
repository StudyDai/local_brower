import requests
# 这个是多进程
# 进程 =》 任务 =》 指定形式的操作（执行步骤）
from multiprocessing import Process
# session 去发送请求的话 ，他会自动将服务器传递给浏览器保存的Cookies保存
# header = {
#     "Agent": "233"
# }
# 创建空对象
# session = requests.Session()
# 发送请求
# first_url = 'https://xueqiu.com/'
# session.get(url=first_url, headers=header)
# url = 'http://baidu.com'
# 可以使用保存了cookie的session对后续发请求进行操作
# ret = session.get(url=url, headers=header).json()
# 这整个python文件算一个主进程
# 然后我们Process出来的属于子进程
def func():
    print("我是新建进程绑定的任务")

if __name__ == '__main__':
    # 新建进程，然后给他绑定一个具体的任务
    p = Process(target=func)
    # 启动进程
    p.start()
    # 会先走完主进程的代码
    print("主进程执行结束")