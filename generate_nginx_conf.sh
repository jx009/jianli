#!/bin/bash

# 1. 自动获取公网IP
MY_IP=$(curl -s ifconfig.me)
if [ -z "$MY_IP" ]; then MY_IP="_"; fi
echo "正在为 IP: $MY_IP 生成配置..."

# 2. 写入 Nginx 配置文件
cat > /www/server/panel/vhost/nginx/jianli.conf <<EOF
server
{
    listen 80;
    server_name $MY_IP;
    index index.html index.htm index.php;

    # 反向代理到 Docker 的 8090 端口
    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header REMOTE-HOST \$remote_addr;

        # WebSocket 支持
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        add_header X-Cache \$upstream_cache_status;
    }

    access_log  /www/wwwlogs/jianli.log;
    error_log  /www/wwwlogs/jianli.error.log;
}
EOF

# 3. 检查配置并重载 Nginx
echo "检查 Nginx 配置..."
nginx -t && nginx -s reload && echo "✅ Nginx 配置成功！现在可以通过 http://$MY_IP 访问你的项目了。"
