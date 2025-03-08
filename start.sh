#!/bin/bash
set -e  # Faz o script parar se algum comando falhar

cd /home/ec2-user/Carteira-de-pontos-lollapalooza-2025  # Caminho do projeto

# 🔹 Atualiza pacotes e instala dependências
sudo yum update -y
sudo yum install -y nginx certbot python3-certbot-nginx nodejs git

# 🔹 Garante que o Nginx esteja ativo
sudo systemctl enable nginx
sudo systemctl start nginx || true  # Ignora erro se o Nginx não iniciar

# 🔹 Garante que a pasta de build existe antes de copiar
if [ ! -d "dist" ]; then
    echo "❌ ERRO: A pasta 'dist/' não existe. Certifique-se de rodar 'npm run build' antes de executar o script."
    exit 1
fi

# 🔹 Copia os arquivos do React para a pasta pública do Nginx
sudo rm -rf /usr/share/nginx/html/*  # Remove arquivos antigos para evitar conflitos
sudo cp -r dist/* /usr/share/nginx/html/

# 🔹 Remove qualquer configuração antiga do Nginx
sudo rm -f /etc/nginx/conf.d/*.conf

# 🔹 Configuração temporária do Nginx (sem SSL, apenas HTTP)
sudo tee /etc/nginx/conf.d/Carteira-de-pontos-lollapalooza-2025.conf > /dev/null <<EOF
server {
    listen 80;
    server_name ca.picbrand.dev.br;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri /index.html;
    }
}
EOF

# 🔹 Testa e inicia o Nginx sem SSL
sudo nginx -t
sudo systemctl restart nginx || true  # Ignora erro se não rodar

# 🔹 Aguarda alguns segundos para garantir que o site está online
sleep 5

# 🔹 Verifica se o Certificado já existe
if [ -f "/etc/letsencrypt/live/ca.picbrand.dev.br/fullchain.pem" ]; then
    echo "✅ Certificado SSL já existe. Pulando a geração."
else
    echo "⚡ Gerando certificado SSL..."
    sudo certbot certonly --nginx -d ca.picbrand.dev.br --non-interactive --agree-tos -m seuemail@exemplo.com
fi

# 🔹 Atualiza a configuração do Nginx para usar HTTPS agora que temos o SSL
sudo tee /etc/nginx/conf.d/Carteira-de-pontos-lollapalooza-2025.conf > /dev/null <<EOF
server {
    listen 80;
    server_name ca.picbrand.dev.br;
    return 301 https://\$host\$request_uri;
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

# 🔹 Testa e reinicia o Nginx com SSL ativado
sudo nginx -t
sudo systemctl restart nginx

# 🔹 Configura a renovação automática do certificado SSL
echo "0 0 * * * certbot renew --quiet && systemctl restart nginx" | sudo crontab -

echo "✅ Setup concluído! O React Vite está rodando com HTTPS."
