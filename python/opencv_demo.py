import win32gui
import win32ui
import win32con
import win32api
import time
import numpy as np
import cv2 as cv
# 截图功能
def _截图_(hwnd):
    # 获取桌面的DC 也就是绘图的设备
    dc = win32gui.GetWindowDC(hwnd)
    # 将系统的DC转化为MFC框架的DC 方便操作 相当于画笔
    mfc_dc = win32ui.CreateDCFromHandle(dc)
    # 用这个mfc创建可以兼容的设备
    save_dc = mfc_dc.CreateCompatibleDC() # 创建与mfc_dc兼容的内存DC（临时绘图缓冲区）

    # 获取目标窗口的坐标 
    left, top, right, bottom = win32gui.GetWindowRect(hwnd) 
    w = right - left  # 计算窗口宽度
    h = bottom - top  # 计算窗口高度

    # 为bit_map 申请空间
    # 创建与mfc_dc兼容的位图（尺寸=窗口大小）
    save_bit_map = win32ui.CreateBitmap()
    save_bit_map.CreateCompatibleBitmap(mfc_dc, w, h)
    # 选择savedc将图存放到savebit上面 将空位图绑定到内存DC
    save_dc.SelectObject(save_bit_map)
    # 截图从0到wh作为图片 从哪到哪 然后用啥绘画设备,left和top是目标放在页面的哪个地方,复制的方式:win32con.SRCCOPY 直接拷贝
    # 这个地方第二个坐标要写00,因为如下
    # (left, top) 是 窗口在屏幕上的绝对坐标（相对于屏幕左上角）；
    # 但 mfc_dc 是 目标窗口自己的 DC（坐标原点是窗口内部左上角）
    # 窗口自己的 DC 中，坐标原点是窗口左上角（(0, 0)），因此应将 (left, top) 改为 (0, 0)，表示从窗口内部的左上角开始复制：
    # 因为mfc_dc是用的原目标的dc 而不是桌面的dc
    # 而通过Rect拿到的是应用距离桌面左侧和上测的距离,也就是说,例如我距离左侧100,距离上侧100,我如果要截图的话
    # 我肯定是从我应用的上册100,左侧100的地方开始截图,这就会导致我截图的内容缺失
    save_dc.BitBlt((0, 0), (w, h), mfc_dc, (0, 0),win32con.SRCCOPY)

    # 将位图转为opencv格式 获取位图的原始像素数据
    signed_ints_array = save_bit_map.GetBitmapBits(True)
    # 转为numpy数组
    im_opencv = np.frombuffer(signed_ints_array, dtype='uint8')
    # 设置数组形状
    im_opencv.shape = (h, w, 4)
    # 释放资源
    save_dc.DeleteDC()
    win32gui.DeleteObject(save_bit_map.GetHandle())
    win32gui.ReleaseDC(hwnd, dc)
    return im_opencv

def 点击(窗口坐标, 句柄):
    桌面坐标 = win32gui.ClientToScreen(句柄, 窗口坐标)
    win32api.SetCursorPos(桌面坐标)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0,0,0,0)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP,0,0,0,0)
    print('点击完成')
    return True

if __name__ == "__main__":
    # 弄个句柄给他
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
    # 最好就是展示下然后再截图好点
    # cv.imwrite("python/wechet.png", 位图)

