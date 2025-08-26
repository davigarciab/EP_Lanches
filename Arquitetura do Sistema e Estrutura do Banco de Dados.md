# Arquitetura do Sistema e Estrutura do Banco de Dados

## 1. Arquitetura Geral

O aplicativo será desenvolvido com uma arquitetura de microsserviços, separando o frontend do backend. Isso permite maior flexibilidade, escalabilidade e manutenibilidade.

- **Frontend:** Será desenvolvido em **React**, uma biblioteca JavaScript popular para a construção de interfaces de usuário interativas. O frontend será responsável por toda a apresentação e interação com o usuário.
- **Backend:** Será desenvolvido em **Flask**, um micro-framework Python leve e flexível. O backend será responsável pela lógica de negócios, gerenciamento de dados e integração com serviços externos, como o de pagamento.
- **Banco de Dados:** Utilizaremos um banco de dados relacional, como o **PostgreSQL**, para garantir a integridade e a consistência dos dados.
- **API de Pagamento:** A integração de pagamento será feita através de uma das APIs pesquisadas (Stripe, PagSeguro, Mercado Pago, etc.), que oferecem suporte a PIX e Cartão de Crédito.

## 2. Estrutura do Banco de Dados (Esquema)

A seguir, o esquema do banco de dados com as tabelas e seus respectivos campos:

### Tabela: `users`

| Nome da Coluna | Tipo de Dado | Descrição |
|---|---|---|
| `id` | SERIAL | Chave primária, auto-incremento |
| `name` | VARCHAR(255) | Nome do usuário |
| `email` | VARCHAR(255) | Email do usuário (único) |
| `phone` | VARCHAR(20) | Telefone do usuário |
| `password_hash` | VARCHAR(255) | Hash da senha do usuário |
| `is_admin` | BOOLEAN | Indica se o usuário é administrador (master) |
| `created_at` | TIMESTAMP | Data e hora de criação do registro |

### Tabela: `snacks`

| Nome da Coluna | Tipo de Dado | Descrição |
|---|---|---|
| `id` | SERIAL | Chave primária, auto-incremento |
| `name` | VARCHAR(255) | Nome do lanche |
| `description` | TEXT | Descrição do lanche |
| `price` | DECIMAL(10, 2) | Preço do lanche |
| `is_available` | BOOLEAN | Indica se o lanche está disponível para venda |
| `created_at` | TIMESTAMP | Data e hora de criação do registro |

### Tabela: `orders`

| Nome da Coluna | Tipo de Dado | Descrição |
|---|---|---|
| `id` | SERIAL | Chave primária, auto-incremento |
| `user_id` | INTEGER | Chave estrangeira para a tabela `users` |
| `order_date` | DATE | Data para a qual o pedido foi feito |
| `total_amount` | DECIMAL(10, 2) | Valor total do pedido |
| `status` | VARCHAR(50) | Status do pedido (ex: 'pending', 'paid', 'delivered') |
| `created_at` | TIMESTAMP | Data e hora de criação do registro |

### Tabela: `order_items`

| Nome da Coluna | Tipo de Dado | Descrição |
|---|---|---|
| `id` | SERIAL | Chave primária, auto-incremento |
| `order_id` | INTEGER | Chave estrangeira para a tabela `orders` |
| `snack_id` | INTEGER | Chave estrangeira para a tabela `snacks` |
| `quantity` | INTEGER | Quantidade do lanche no pedido |
| `price` | DECIMAL(10, 2) | Preço do lanche no momento do pedido |

### Tabela: `payments`

| Nome da Coluna | Tipo de Dado | Descrição |
|---|---|---|
| `id` | SERIAL | Chave primária, auto-incremento |
| `order_id` | INTEGER | Chave estrangeira para a tabela `orders` |
| `payment_method` | VARCHAR(50) | Método de pagamento (ex: 'pix', 'credit_card') |
| `transaction_id` | VARCHAR(255) | ID da transação na API de pagamento |
| `status` | VARCHAR(50) | Status do pagamento (ex: 'pending', 'approved', 'failed') |
| `amount` | DECIMAL(10, 2) | Valor do pagamento |
| `created_at` | TIMESTAMP | Data e hora de criação do registro |

## 3. APIs do Backend (Endpoints)

A seguir, uma definição inicial das rotas da API que o backend irá expor:

- **Autenticação:**
  - `POST /api/auth/register`: Registrar um novo usuário.
  - `POST /api/auth/login`: Autenticar um usuário e retornar um token de acesso.

- **Lanches (Snacks):**
  - `GET /api/snacks`: Listar todos os lanches disponíveis.
  - `POST /api/admin/snacks`: (Admin) Adicionar um novo lanche.
  - `PUT /api/admin/snacks/<id>`: (Admin) Atualizar um lanche existente.
  - `DELETE /api/admin/snacks/<id>`: (Admin) Remover um lanche.

- **Pedidos (Orders):**
  - `POST /api/orders`: Criar um novo pedido.
  - `GET /api/orders`: Listar os pedidos do usuário logado.
  - `GET /api/admin/orders`: (Admin) Listar todos os pedidos.
  - `GET /api/admin/orders/today`: (Admin) Listar os pedidos para o dia atual.

- **Pagamentos (Payments):**
  - `POST /api/payments/create`: Iniciar um processo de pagamento para um pedido.
  - `POST /api/payments/webhook`: Receber notificações de status de pagamento da API externa.

- **Relatórios (Reports):**
  - `GET /api/admin/reports/daily`: (Admin) Gerar um relatório de pedidos para um dia específico.
  - `GET /api/admin/reports/payments`: (Admin) Gerar um relatório de pagamentos.


