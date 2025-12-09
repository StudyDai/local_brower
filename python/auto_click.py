# 自动化刷视频
# 这个是用来找应用程序的
import win32gui
import time
import win32con
# 这个用来对页面进行操作
import win32api
# 桌面截图
def 桌面截图(句柄):
    # 根据句柄获取设备上下文DC
    desktop = win32gui.GetDesktopWindow(句柄)
    dc = win32gui.GetWindowDC(desktop)
    # 根据窗口的dc获取mfcDc
    mfc_dc = win32gui.CreateDCFromHandle(dc)
    # mfcDc创建可兼容的DC
    save_dc = mfc_dc.CreateCompatibleDC()
    # 创建bitmap准备保存图片
    save_bit_map = win32gui.CreateBitmap()
    left, top, right, bottom = win32gui.GetWindowRect()
    # 获取尺寸
    w, h = right - left, bottom - top
    # 为bit开辟空间
    save_bit_map.CreateCompatibleBitmap(mfc_dc, w, h)
    # 高度saveDC, 将截图保存在map中
    save_dc.SelectObject(save_bit_map)
    # 截图左上角00,长款为wh图片
    save_dc.BitBlt((0,0),(w,h), mfc_dc, (left, top), win32con.SRCCOPY)
    signed_ints_array = save_bit_map.GetBitmapBits(True)
    im_opencv = np.frombuffer(signed_ints_array, dtype='uint8')
    im_opencv.shape = (h,w,4)
    save_dc.DeleteDC()
    win32gui.DeleteObject(save_bit_map.GetHandle())
    win32gui.ReleaseDC(句柄, dc)
# 激活窗口
def 激活窗口():
    # 查找句柄 也就是程序的身份证
    句柄 = win32gui.FindWindow(None, '钉钉')
    # 获取当前窗口布局 最大化还是最小化还是咋样
    tup = win32gui.GetWindowPlacement(句柄)
    # 这个win32con定义了很多常量,这个的意思就是显示不是正常尺寸,证明已经最大化或者最小化
    # tup[1] 等于1的时候 证明是关掉了
    # tup[1] 等于2的时候 证明是最大化和最小化了
    if tup[1] != win32con.SW_SHOWNORMAL:
        # 给句柄发消息,让他回复正常
        # win32con.WM_SYSCOMMAND代表系统消息\
        # SC_RESTORE 是恢复的意思,restore
        # 后面的0暂时不用管
        # 做完这一步就是让他回复正常化,还没有置顶呢,这个时候去激活他 他才会来到最顶部
        win32gui.SendMessage(句柄, win32con.WM_SYSCOMMAND, win32con.SC_RESTORE, 0)
    # 找到了句柄就是一串数字,找不到就是0
    print('查找应用程序结果:', 句柄)
    # 这个就是把窗口激活,并且弹窗到最顶层
    if win32gui.GetForegroundWindow() != 句柄:
        # 这个能做到的只能是没有最小化的状态下,例如我先开了钉钉,然后我开浏览器
        # 如上这种覆盖的,可以让钉钉顶到最上面, 其他的情况不会弹
        win32gui.SetForegroundWindow(句柄)
        time.sleep(2)
        print('233')

# 桌面点击
def 桌面点击(桌面坐标):
    # 设置鼠标位置
    win32api.SetCursorPos(桌面坐标)
    time.sleep(2)
    # 设置鼠标按下
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
    # 设置鼠标谈起
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)

# 应用坐标转化成桌面坐标
# 例如我在应用里面是(0,2) 然后通过那个api可以换算成我桌面要去点哪个地方的坐标
def 点击窗口坐标(句柄, 坐标):
    桌面坐标 = win32gui.ClientToScreen(句柄, 坐标) 
    桌面点击(桌面坐标)
if __name__ == '__main__':
    # 激活窗口()
    桌面点击((10, 10))
    # print('启动了')