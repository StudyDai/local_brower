import win32gui
import win32con
import win32api
import time

def 找到句柄(文本):
    句柄 = win32gui.FindWindow(None, 文本)
    print('找到句柄', 句柄)
    tup = win32gui.GetWindowPlacement(句柄)
    if tup[1] != win32con.SW_SHOWNORMAL:
        # 按道理会进来的
        print('进来了吧', win32gui.GetForegroundWindow())
        win32gui.SendMessage(句柄, win32con.WM_SYSCOMMAND, win32con.SC_RESTORE, 0)
        time.sleep(0.1)
    # 激活下
    if win32gui.GetForegroundWindow() != 句柄:
        print('已定位并且打开钉钉')
        win32gui.SetForegroundWindow(句柄)
        鼠标向上滑动(句柄, (200, 400), 200)

def 鼠标向上滑动(句柄, 起始坐标, 滑动距离):
    # 滑动之前先定位过去
    轨迹坐标 = (起始坐标[0], 起始坐标[1])
    桌面坐标 = win32gui.ClientToScreen(句柄, 轨迹坐标)
    win32api.SetCursorPos(桌面坐标)
    time.sleep(0.01)
    # 鼠标左键
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0,0,0,0)
    time.sleep(0.1)
    # 可以用for循环来模拟移动
    for i in range(1, 滑动距离+1, 1):
        # 算窗口的轨迹坐标
        轨迹坐标 = (起始坐标[0], 起始坐标[1] - i)
        桌面坐标 = win32gui.ClientToScreen(句柄, 轨迹坐标)
        win32api.SetCursorPos(桌面坐标)
        time.sleep(0.01)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0,0,0,0)

if __name__ == '__main__':
    # 找谷歌浏览器得用这个
    找到句柄("钉钉")