# 🚀 Guia de Deploy - Lanche App

Este guia fornece instruções detalhadas para colocar o aplicativo de venda de lanches em produção.

## 📋 Pré-requisitos

### Servidor
- Ubuntu 20.04+ ou CentOS 7+
- 2GB RAM mínimo (4GB recomendado)
- 20GB de espaço em disco
- Acesso root ou sudo

### Domínio
- Domínio registrado (ex: meulanches.com.br)
- DNS configurado apontando para o servidor

### Certificado SSL
- Let's Encrypt (gratuito) ou certificado comercial

## 🛠️ Opção 1: Deploy Manual (VPS)

### 1. Preparação do Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y python3 python3-pip python3-venv nodejs npm nginx git

# Instalar PM2 para gerenciar processos
sudo npm install -g pm2

# Criar usuário para a aplicação
sudo adduser lanche-app
sudo usermod -aG sudo lanche-app
```

### 2. Configuração do Backend

```bash
# Fazer login como usuário da aplicação
sudo su - lanche-app

# Clonar o repositório
git clone <seu-repositorio> /home/lanche-app/app
cd /home/lanche-app/app/lanche-app

# Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install flask flask-cors gunicorn

# Criar arquivo de configuração de produção
cat > config.py << EOF
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'sua-chave-secreta-super-segura'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
EOF

# Criar script de inicialização
cat > start.sh << EOF
#!/bin/bash
source /home/lanche-app/app/lanche-app/venv/bin/activate
cd /home/lanche-app/app/lanche-app
export FLASK_ENV=production
export SECRET_KEY="sua-chave-secreta-super-segura"
gunicorn -w 4 -b 127.0.0.1:5000 src.main:app
EOF

chmod +x start.sh

# Configurar PM2
pm2 start start.sh --name "lanche-backend"
pm2 save
pm2 startup
```

### 3. Configuração do Frontend

```bash
# Navegar para o frontend
cd /home/lanche-app/app/lanche-frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente para produção
cat > .env.production << EOF
VITE_API_URL=https://seu-dominio.com.br/api
EOF

# Build para produção
npm run build

# Mover arquivos para diretório do Nginx
sudo mkdir -p /var/www/lanche-app
sudo cp -r dist/* /var/www/lanche-app/
sudo chown -R www-data:www-data /var/www/lanche-app
```

### 4. Configuração do Nginx

```bash
# Criar configuração do site
sudo nano /etc/nginx/sites-available/lanche-app
```

Conteúdo do arquivo:

```nginx
server {
    listen 80;
    server_name seu-dominio.com.br www.seu-dominio.com.br;
    
    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com.br www.seu-dominio.com.br;
    
    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com.br/privkey.pem;
    
    # Configurações SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Frontend
    location / {
        root /var/www/lanche-app;
        try_files $uri $uri/ /index.html;
        
        # Cache para assets estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Logs
    access_log /var/log/nginx/lanche-app.access.log;
    error_log /var/log/nginx/lanche-app.error.log;
}
```

```bash
# Ativar o site
sudo ln -s /etc/nginx/sites-available/lanche-app /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 5. Configuração do SSL (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com.br -d www.seu-dominio.com.br

# Configurar renovação automática
sudo crontab -e
# Adicionar linha:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. Configuração do Firewall

```bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 🐳 Opção 2: Deploy com Docker

### 1. Dockerfile do Backend

```dockerfile
# lanche-app/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY src/ ./src/

# Variáveis de ambiente
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "src.main:app"]
```

### 2. Dockerfile do Frontend

```dockerfile
# lanche-frontend/Dockerfile
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

### 3. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./lanche-app
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=sua-chave-secreta-super-segura
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  frontend:
    build: ./lanche-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

### 4. Executar com Docker

```bash
# Build e start
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## ☁️ Opção 3: Deploy em Cloud

### Heroku (Backend)

```bash
# Instalar Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Criar app
heroku create lanche-app-backend

# Configurar variáveis
heroku config:set SECRET_KEY=sua-chave-secreta
heroku config:set FLASK_ENV=production

# Criar Procfile
echo "web: gunicorn src.main:app" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Vercel (Frontend)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Configurar variáveis de ambiente no dashboard
# VITE_API_URL=https://lanche-app-backend.herokuapp.com/api
```

### AWS (Completo)

#### Backend (Elastic Beanstalk)
```bash
# Instalar EB CLI
pip install awsebcli

# Inicializar
eb init

# Criar ambiente
eb create production

# Deploy
eb deploy
```

#### Frontend (S3 + CloudFront)
```bash
# Build
npm run build

# Upload para S3
aws s3 sync dist/ s3://seu-bucket-name --delete

# Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id EDFDVBD6EXAMPLE --paths "/*"
```

## 📊 Monitoramento e Logs

### 1. Logs do Sistema

```bash
# Logs do backend (PM2)
pm2 logs lanche-backend

# Logs do Nginx
sudo tail -f /var/log/nginx/lanche-app.access.log
sudo tail -f /var/log/nginx/lanche-app.error.log

# Logs do sistema
sudo journalctl -u nginx -f
```

### 2. Monitoramento com PM2

```bash
# Status dos processos
pm2 status

# Monitoramento em tempo real
pm2 monit

# Restart automático em caso de falha
pm2 startup
pm2 save
```

### 3. Backup do Banco de Dados

```bash
# Criar script de backup
cat > /home/lanche-app/backup.sh << EOF
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/lanche-app/backups"
mkdir -p $BACKUP_DIR

# Backup do SQLite
cp /home/lanche-app/app/lanche-app/src/database/app.db $BACKUP_DIR/app_$DATE.db

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "app_*.db" -mtime +7 -delete
EOF

chmod +x /home/lanche-app/backup.sh

# Configurar cron para backup diário
crontab -e
# Adicionar: 0 2 * * * /home/lanche-app/backup.sh
```

## 🔒 Segurança em Produção

### 1. Configurações de Segurança

```bash
# Configurar fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Configurar SSH
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no
# PasswordAuthentication no
# Port 2222 (mudar porta padrão)

sudo systemctl restart ssh
```

### 2. Variáveis de Ambiente Seguras

```bash
# Criar arquivo .env para produção
cat > /home/lanche-app/app/lanche-app/.env << EOF
SECRET_KEY=sua-chave-super-secreta-de-32-caracteres
DATABASE_URL=sqlite:///app.db
FLASK_ENV=production
PAYMENT_API_KEY=sua-chave-da-api-de-pagamento
WEBHOOK_SECRET=seu-webhook-secret
EOF

# Proteger o arquivo
chmod 600 /home/lanche-app/app/lanche-app/.env
```

## 🚨 Solução de Problemas

### Backend não responde
```bash
# Verificar se o processo está rodando
pm2 status

# Verificar logs
pm2 logs lanche-backend

# Restart
pm2 restart lanche-backend
```

### Frontend não carrega
```bash
# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx

# Verificar arquivos
ls -la /var/www/lanche-app/
```

### Problemas de SSL
```bash
# Verificar certificado
sudo certbot certificates

# Renovar manualmente
sudo certbot renew

# Testar configuração SSL
openssl s_client -connect seu-dominio.com.br:443
```

## 📈 Otimização de Performance

### 1. Nginx
```nginx
# Adicionar ao bloco server
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Cache de assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. Backend
```python
# Adicionar ao main.py
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configurações de produção
if app.config['ENV'] == 'production':
    app.config['DEBUG'] = False
    app.config['TESTING'] = False
```

## 📞 Suporte Pós-Deploy

### Checklist de Verificação
- [ ] Site acessível via HTTPS
- [ ] APIs funcionando corretamente
- [ ] Pagamentos sendo processados
- [ ] Logs sendo gerados
- [ ] Backups configurados
- [ ] Monitoramento ativo
- [ ] SSL válido e renovação automática
- [ ] Firewall configurado

### Contatos de Emergência
- Provedor de hospedagem
- Registrador de domínio
- Suporte técnico da aplicação

---

**🎉 Parabéns! Seu aplicativo de venda de lanches está agora em produção!**

