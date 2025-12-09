import uiautomator2 as u2
import time

# 先通过adb获取已连接的设备列表，再连接
d = u2.connect("172.19.0.1:33869")  # 改用connect_adb_wifi

# 验证连接是否成功
if d.alive:
    print("设备已连接")
else:
    print("连接失败，需重新配对")

# 滑动逻辑（修正之前的9.8为0.8）
screen_width, screen_height = d.window_size()
while True:
    # 左滑
    d.swipe(screen_width*0.8, screen_height*0.5, screen_width*0.2, screen_height*0.5, 0.5)
    time.sleep(0.5)
    # 右滑
    d.swipe(screen_width*0.2, screen_height*0.5, screen_width*0.8, screen_height*0.5, 0.5)
    time.sleep(0.5)