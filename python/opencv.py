import cv2 as cv
import os
# 查看版本
# print(cv.version.opencv_version)
# 查看当前文件位置 绝对路径
# print(os.path.abspath(__file__))
# 当前文件夹所在绝对路径
# print(os.path.dirname(__file__))
# 路径不支持中文!!!
# img_path = os.path.join(os.path.dirname(__file__), "01.png")
# 读取图片 第二个参数传0,得到的就是灰度图
# 读取结果 = cv.imread(img_path)
# 切片1 = 读取结果[150:300, 150:300] # 小图像 = 大图像[上边:下边. 左边:右边] [y, x]
# cv.imshow("img1", 切片1)
# cv.waitKey(0)
# 展示图片
# cv.imshow('img1', 读取结果)
# 展示持续时间 单位是毫秒 3s === 3000 输入0的话就是无限等待,只有我们点击键盘任意键才会消失
# keycode = cv.waitKey(0)
# 如果你的毫秒是0, 那么这个keycode 返回的就是你按下的键盘字母的ASCIIC码,a就是97
# chr(87) 可以得到a 然后 ord('a')可以得到97
# 按下键盘s就是保存
# if keycode == ord('s'):
    # 其实就是复制
    # cv.imwrite('python/02.png', 读取结果)
# 销毁窗口 现在不需要用了 自动会调用这个
# cv.destroyAllWindows()

# 打印图片的尺寸和通道数
# print(读取结果.shape)
# 彩色图解包
# h, w = 读取结果.shape[: 2]
# 如果是灰度图,就没办法直接 因为灰度图只有尺寸,没有通道数
# h, w, c = 读取结果.shape

# 彩色图片转灰色图片的操作如下
# img = cv.imread("python/01.png")
# 第一个传递图片路径,第二个传递要咋换是rgb转灰度图就用如下的
# 他是复制了img,然后转化成灰度返回给我们的,并不是原来的图片直接改动
# gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
# score_img = cv.imread("python/score.png", 0)
# h, w = score_img.shape[: 2]
# 第一个图片匹配: 模板匹配,要使用灰度图,去查找的也得灰度图
# res = cv.matchTemplate(gray, score_img, cv.TM_CCOEFF_NORMED)
# 拿到位置
# min_val, max_val, min_loc, max_loc = cv.minMaxLoc(res)
# 如果使用TM_SQDIFF或者TM_SQDIFF_NORMED TOP_LEFT = MIN_LOC 是最小值,其他都是取最大值
# 如果使用TM_SQDIFF或者TM_SQDIFF_NORMED TOP_LEFT = MIN_LOC
# 如上的含义就是 最小误差,所以要用min_loc，上面用的是误差，肯定是越小越准，下面是准确度，肯定 越高越准
# 而我们代码使用的TM_CCOEFF_NORMED采用的是最高匹配度 所以用max
# 左上角
# top_left = max_loc
# 右下角的位置
# bottom_right = (top_left[0] + w, top_left[1] + h)
# 在原图上画矩形
# cv.rectangle(img, top_left, bottom_right, (0,0,255), 2)
# cv.rectangle(gray, top_left, bottom_right, (0,0,0), 2)

# 显示
# cv.imshow("temp", score_img)
# cv.imshow("img", img)
# cv.imshow("gray_img", gray)
# cv.waitKey(0)

# 图像二值化 就是图像变成纯黑白,非黑即白 转化原理: 默认是阈值: 低于127的自动变白 高于127的全部变黑
# 二值化只能传入灰度图哦
# 第二个参数是阈值
# 第三个参数是最大值
# 第四个是转化模式
# THRESH_BINARY_INV 这个是反转 默认是要显示的是白色的不要的是黑色的 用了这个之后, 要显示的变黑了就是不显示了
# ret, res = cv.threshold(gray, 240, 255, cv.THRESH_BINARY)
# cv.imshow('erzhi', gray)
# cv.waitKey(0)


# 图片轮廓查询法则
img = cv.imread("python/01.png")
img_gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
ret, thresh = cv.threshold(img_gray, 180, 255, 0)
cv.imshow('thresh', thresh)
# 第二个参数是用树状结构去找 然后以简单形式存储
contours, hierarchy = cv.findContours(thresh, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
# 对所有轮廓进行计算面积,太小的直接不要
for cnt in contours:
    area = cv.contourArea(cnt)
    if 100 < area < 500:
        # 找到的轮廓画出来 第二个参数是裂变来的
        # cv.drawContours(img, contours, -1, (0,0,0), 1)
        # cv.drawContours(img, [cnt], -1, (0,0,0), 1)
        # 不过我们不是要轮廓,我们是要那个产品本图,就是一个框框
        x, y, w, h = cv.boundingRect(cnt)
        按轮廓切割 = img[y : y+h, x : x+w]
cv.imshow('lunkuo', img)
cv.waitKey(0)