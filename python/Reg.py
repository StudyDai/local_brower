import re

content = 'Hi 123 4567 呆呆 一起学习python'
# match的结果可以用group()把所有匹配到的结果都打印出来 span就是下标位置 从哪到哪
print(re.match('^Hi\s\d\d\d\s\d{4}', content).group())
print(re.match('^Hi\s\d\d\d\s\d{4}', content).span())

content = 'Hi 1234567 呆呆 一起学习python Demo'
# 这样子拿到的没办法拿到括号里面的
print(re.match('^Hi\s(\d+)\s呆呆', content).group())
# 要传递一个参数才可以，正常是1
print(re.match('^Hi\s(\d+)\s呆呆', content).group(1))
# 贪婪模式
print(re.match('^Hi.*(\d+).*Demo$', content).group(1))
# 非贪婪 这种数量后面的加?就是开启非贪婪 例如+和*
# match方法有第三个参数,第三个参数写的re.S 意思就是我们的.通配符包含了换行符在内的所有字符
print(re.match('^Hi.*?(\d+).*Demo$', content).group(1))

# search()方法 会从头开始找起,找到第一个符合的就返回,否则就是返回None
# findall()方法 就是把符合的结果都丢到列表里面去 用法和search一样
print(re.search('^Hi.*?(\d+).*Demo$', content).group(1))

# 一般替换都会选择replace字符串的方法,但是太繁琐了,我们直接用sub即可
print(re.sub('^Hi.*?(\d+).*Demo$', '我是修改后的内容', content))
# 字符串去除两边空白字符的方法是strip()

# 正则对象 是通过re.compile来进行生成的
# r的含义是代表后面的字符串是原始的字符串,并不是什么模板字符串这些
pattern = re.compile(r'[\u4e00-\u9fa5]+')
# 得到这个pattern 其实就是 /[\u4e00-\u9fa5]+/


