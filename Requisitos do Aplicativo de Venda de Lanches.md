
# Requisitos do Aplicativo de Venda de Lanches

## 1. Requisitos Funcionais

### 1.1. Módulo de Usuário (Cliente)
- **Reserva de Lanches:**
  - O usuário deve poder visualizar os lanches disponíveis para o dia seguinte.
  - O usuário deve poder selecionar um ou mais lanches para reserva.
  - O limite para reserva é até as 20h do dia anterior à entrega.
- **Pagamento:**
  - O usuário deve poder pagar a reserva via PIX.
  - O usuário deve poder pagar a reserva via Cartão de Crédito.
  - A confirmação do pedido depende da confirmação do pagamento.
- **Cadastro Simplificado:**
  - O processo de cadastro do usuário deve ser rápido e simples, solicitando apenas informações essenciais (ex: nome, email, telefone).
  - O usuário deve poder visualizar o status de seus pedidos.

### 1.2. Módulo de Usuário Master (Administrador)
- **Cadastro de Lanches:**
  - O usuário master deve poder cadastrar novos lanches, incluindo nome, descrição, preço e disponibilidade.
  - O usuário master deve poder editar e remover lanches existentes.
- **Relatórios:**
  - O usuário master deve ter acesso a um relatório de todos os pedidos para um dia específico.
  - O relatório de pedidos deve incluir informações como lanche, quantidade, dados do cliente e status do pagamento.
  - O usuário master deve ter acesso a um relatório dos valores pagos, detalhando as transações e o método de pagamento.

## 2. Requisitos Não Funcionais

- **Usabilidade:**
  - A interface do usuário deve ser intuitiva e fácil de usar.
  - O processo de reserva e pagamento deve ser claro e direto.
- **Desempenho:**
  - O aplicativo deve ser responsivo e carregar rapidamente.
  - As operações de cadastro e consulta devem ser eficientes.
- **Segurança:**
  - As informações dos usuários e de pagamento devem ser protegidas.
  - A comunicação entre o frontend e o backend deve ser segura (HTTPS).
  - O acesso ao painel administrativo deve ser restrito e seguro.
- **Confiabilidade:**
  - O sistema de pagamento deve ser robusto e garantir a integridade das transações.
  - O aplicativo deve ser capaz de lidar com falhas de forma graciosa.
- **Manutenibilidade:**
  - O código deve ser bem estruturado, modular e fácil de manter.
- **Escalabilidade:**
  - O aplicativo deve ser capaz de suportar um aumento no número de usuários e pedidos no futuro.
- **Compatibilidade:**
  - O aplicativo web deve ser compatível com os principais navegadores (Chrome, Firefox, Edge, Safari).
  - O design deve ser responsivo para funcionar bem em dispositivos móveis e desktops.

