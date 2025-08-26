# 🍔 Lanche App - Sistema de Reserva de Lanches

Um aplicativo web completo para venda de lanches com sistema de reservas, pagamentos (PIX e Cartão de Crédito) e painel administrativo.

## 📋 Funcionalidades

### Para Usuários
- ✅ **Reserva de Lanches**: Escolha lanches para entrega no dia seguinte
- ✅ **Carrinho Interativo**: Adicione/remova itens com cálculo automático
- ✅ **Pagamentos Seguros**: PIX e Cartão de Crédito
- ✅ **Cadastro Simples**: Apenas nome, email, telefone e senha
- ✅ **Validação de Horário**: Pedidos até 20h do dia anterior

### Para Administradores
- ✅ **Gerenciamento de Lanches**: Cadastrar, editar e remover produtos
- ✅ **Relatórios de Pedidos**: Visualizar pedidos por data
- ✅ **Relatórios de Pagamentos**: Acompanhar valores recebidos
- ✅ **Painel Administrativo**: Controle total do sistema

## 🛠️ Tecnologias Utilizadas

### Backend
- **Flask** (Python) - Framework web
- **SQLite** - Banco de dados
- **Flask-CORS** - Suporte a CORS
- **Werkzeug** - Segurança e hashing

### Frontend
- **React 18** - Interface do usuário
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

### Sistema de Pagamentos
- **Simulação de APIs** brasileiras (PIX e Cartão)
- **Webhooks** para confirmação automática
- **Validação** de cartões de teste

## 📁 Estrutura do Projeto

```
lanche-app/
├── src/
│   ├── main.py              # Aplicação principal Flask
│   ├── models/              # Modelos do banco de dados
│   │   ├── user.py         # Modelo de usuário
│   │   ├── snack.py        # Modelo de lanche
│   │   ├── order.py        # Modelo de pedido
│   │   └── payment.py      # Modelo de pagamento
│   ├── routes/             # Rotas da API
│   │   ├── user.py         # Rotas de usuário
│   │   ├── snack.py        # Rotas de lanches
│   │   ├── order.py        # Rotas de pedidos
│   │   └── payment.py      # Rotas de pagamento
│   ├── services/           # Serviços
│   │   └── payment_service.py # Serviço de pagamento
│   └── database/           # Banco de dados
│       └── app.db          # SQLite database

lanche-frontend/
├── src/
│   ├── App.jsx             # Componente principal
│   ├── contexts/           # Contextos React
│   │   └── AuthContext.jsx # Contexto de autenticação
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Layout.jsx      # Layout principal
│   │   ├── LoginForm.jsx   # Formulário de login
│   │   ├── RegisterForm.jsx # Formulário de registro
│   │   ├── SnackCard.jsx   # Card de lanche
│   │   ├── Cart.jsx        # Carrinho de compras
│   │   └── PaymentModal.jsx # Modal de pagamento
│   └── pages/              # Páginas
│       └── HomePage.jsx    # Página principal
├── index.html              # HTML principal
├── vite.config.js          # Configuração do Vite
└── package.json            # Dependências
```

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 20+
- npm ou pnpm

### 1. Backend (Flask)

```bash
# Navegar para o diretório do backend
cd lanche-app

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Instalar dependências
pip install flask flask-cors

# Executar o servidor
python src/main.py
```

O backend estará disponível em: `http://localhost:5000`

### 2. Frontend (React)

```bash
# Navegar para o diretório do frontend
cd lanche-frontend

# Instalar dependências
pnpm install
# ou
npm install

# Executar o servidor de desenvolvimento
pnpm run dev --host
# ou
npm run dev -- --host
```

O frontend estará disponível em: `http://localhost:5173`

## 👤 Usuários de Teste

### Administrador
- **Email**: admin@lanche.com
- **Senha**: admin123

### Cartões de Teste
- **Aprovado**: 4111 1111 1111 1111
- **Recusado**: 4000 0000 0000 0002

## 📱 Como Usar

### Para Clientes

1. **Acesse o aplicativo** em `http://localhost:5173`
2. **Faça login** ou cadastre-se
3. **Escolha seus lanches** na página principal
4. **Adicione ao carrinho** usando os botões + e -
5. **Finalize o pedido** clicando em "Finalizar Pedido"
6. **Escolha o pagamento**: PIX ou Cartão de Crédito
7. **Complete o pagamento** seguindo as instruções

### Para Administradores

1. **Faça login** com as credenciais de admin
2. **Gerencie lanches** através das APIs administrativas
3. **Visualize relatórios** de pedidos e pagamentos
4. **Monitore** as vendas em tempo real

## 🔧 APIs Disponíveis

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `POST /api/auth/register` - Registrar usuário
- `GET /api/auth/me` - Obter usuário atual

### Lanches
- `GET /api/snacks` - Listar lanches
- `POST /api/admin/snacks` - Criar lanche (admin)
- `PUT /api/admin/snacks/<id>` - Editar lanche (admin)
- `DELETE /api/admin/snacks/<id>` - Remover lanche (admin)

### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders` - Listar pedidos do usuário
- `GET /api/admin/orders` - Relatório de pedidos (admin)

### Pagamentos
- `POST /api/payments/create` - Iniciar pagamento
- `POST /api/payments/webhook` - Webhook de confirmação
- `GET /api/payments/<id>/status` - Status do pagamento
- `GET /api/admin/payments` - Relatório de pagamentos (admin)

## 🌐 Deploy em Produção

### Opção 1: Servidor VPS

#### Backend
```bash
# Instalar dependências do sistema
sudo apt update
sudo apt install python3 python3-pip python3-venv nginx

# Clonar o projeto
git clone <seu-repositorio>
cd lanche-app

# Configurar ambiente virtual
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors gunicorn

# Executar com Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 src.main:app
```

#### Frontend
```bash
# Build do frontend
cd lanche-frontend
npm install
npm run build

# Configurar Nginx
sudo nano /etc/nginx/sites-available/lanche-app
```

Configuração do Nginx:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    location / {
        root /path/to/lanche-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Opção 2: Plataformas Cloud

#### Heroku
```bash
# Criar Procfile para o backend
echo "web: gunicorn src.main:app" > Procfile

# Deploy
heroku create lanche-app-backend
git push heroku main
```

#### Vercel (Frontend)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Opção 3: Docker

#### Dockerfile (Backend)
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ ./src/
EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "src.main:app"]
```

#### Dockerfile (Frontend)
```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
```

## 🔒 Segurança

### Implementado
- ✅ Autenticação por sessões
- ✅ Validação de dados de entrada
- ✅ Proteção de rotas administrativas
- ✅ Sanitização de inputs
- ✅ Tratamento de erros

### Recomendações para Produção
- 🔐 Usar HTTPS (SSL/TLS)
- 🔑 Implementar JWT tokens
- 🛡️ Rate limiting
- 📝 Logs de auditoria
- 🔒 Criptografia de dados sensíveis

## 📊 Monitoramento

### Métricas Importantes
- Número de pedidos por dia
- Valor total de vendas
- Taxa de conversão de carrinho
- Métodos de pagamento mais usados
- Lanches mais vendidos

### Logs
- Acessos de usuários
- Transações de pagamento
- Erros do sistema
- Performance das APIs

## 🐛 Solução de Problemas

### Backend não inicia
```bash
# Verificar se o Python está instalado
python --version

# Verificar se as dependências estão instaladas
pip list

# Verificar se a porta 5000 está livre
lsof -i :5000
```

### Frontend não carrega
```bash
# Verificar se o Node.js está instalado
node --version

# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar se a porta 5173 está livre
lsof -i :5173
```

### Problemas de CORS
- Verificar se `flask-cors` está instalado
- Confirmar configuração do proxy no `vite.config.js`
- Verificar se o backend está rodando na porta 5000

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console (F12 no navegador)
2. Consulte a documentação das APIs
3. Verifique se todos os serviços estão rodando
4. Confirme as configurações de rede

## 📄 Licença

Este projeto foi desenvolvido como uma solução personalizada para venda de lanches.

---

**Desenvolvido com ❤️ para facilitar a venda de lanches com sistema de reservas e pagamentos seguros.**

