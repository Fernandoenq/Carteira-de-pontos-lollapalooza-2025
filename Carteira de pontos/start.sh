#!/bin/bash
cd /home/ec2-user/react-app  # Caminho onde o projeto será armazenado na EC2

# Atualiza pacotes e instala Nginx
sudo yum update -y
sudo yum install -y nginx certbot python3-certbot-nginx

# Copia os arquivos do React para a pasta pública do Nginx
sudo cp -r dist/* /usr/share/nginx/html/

# Configuração do Nginx
sudo tee /etc/nginx/conf.d/react-app.conf > /dev/null <<EOF
server {
    listen 80;
    server_name ca.picbrand.dev.br;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name ca.picbrand.dev.br;

    ssl_certificate /etc/letsencrypt/live/ca.picbrand.dev.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ca.picbrand.dev.br/privkey.pem;

    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files \$uri /index.html;
    }

    error_page 404 /404.html;
}
EOF

# Reinicia o Nginx para aplicar as configurações
sudo systemctl restart nginx

# Garante que o Certbot renova o SSL automaticamente
sudo certbot --nginx -d ca.picbrand.dev.br --non-interactive --agree-tos -m seuemail@exemplo.com

echo "Setup concluído! O React Vite está rodando com HTTPS."
