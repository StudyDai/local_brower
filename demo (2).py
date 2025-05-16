import subprocess
import requests
def get_ipv4_address():
    result = subprocess.run('ipconfig', shell=True, capture_output=True, text=True)
    output_lines = result.stdout.splitlines()
    for line in output_lines:
        first_item = line.split(": ")
        if first_item[0] == '   IPv4 地址 . . . . . . . . . . . . ':
            return first_item[1]
    return None

# 主函数

def main():
    ip_config_info = get_ipv4_address()
    # 拿到ipv4地址
    print('IPv4 Address:', ip_config_info)
    data = {
        'ip': ip_config_info
    }
    response = requests.post('http://192.168.188.47:8888/posts',data)
    if response.status_code == 200:
        print('发送成功')
    else:
        print('出错了')

if __name__ == "__main__":
    main()