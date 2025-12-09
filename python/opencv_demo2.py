import cv2 as cv
import numpy as np
import opencv_demo
import win32api
import win32gui
import win32con
import win32ui
import time
def 是彩色图片(图片):
    if 图片 is None:
        print("图片是空的,不合理")
        return False
    
    if len(图片.shape) > 2:
        print("是彩色图片")
        return True
    else:
        return False
    

def 查找图片(大图, 小图, 相似度 = 0.8):
    if 是彩色图片(大图):
        大图 = cv.cvtColor(大图, cv.COLOR_BGR2GRAY)
    if 是彩色图片(小图):
        小图 = cv.cvtColor(小图, cv.COLOR_BGR2GRAY)
    # 模板匹配
    res = cv.matchTemplate(大图, 小图, cv.TM_CCOEFF_NORMED) # 找到相似度最大的
    loc = np.where(res >= 相似度) # 这里是过滤
    for pt in zip(*loc[::-1]):
        left = int(pt[0])
        top = int(pt[1])
        right = int(pt[0] + 小图.shape[1])
        bottom = int(pt[1] + 小图.shape[0])
        area = ((left, top), (right, bottom))
        return area
    
if __name__ == '__main__':
    句柄 = win32gui.FindWindow(None, '微信')
    # 判断下当前是否是最小化先,如果是就先打开
    tup = win32gui.GetWindowPlacement(句柄)
    if tup[1] != win32con.SW_SHOWNORMAL:
        # 证明就是隐藏了,所以要打开
        win32gui.SendMessage(句柄, win32con.WM_SYSCOMMAND, win32con.SC_RESTORE, 0)
        time.sleep(0.1)
    # 接着判断
    if win32gui.GetForegroundWindow() != 句柄:
        win32gui.SetForegroundWindow(句柄)
        time.sleep(1)
        # 点击
        # 点击((174, 160), 句柄)
    # 位图 = _截图_(句柄)
    截图 = opencv_demo._截图_(句柄)
    # cv.imwrite("python/wechet.png", 截图)
    林北图片 = cv.imread("python/find.png", 0)
    if 查找图片(截图, 林北图片):
        print("找到了哈~")
    else:
        # 无错误的退出本次代码
        exit(0)
