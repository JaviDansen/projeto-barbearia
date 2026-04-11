# API - Sistema de Barbearia

Documentação dos endpoints atuais da API do sistema de agendamento para barbearia.]

Base URL: https://naregua-app.vercel.app

# Autenticação

A API utiliza autenticação via JWT.

Rotas protegidas exigem o header:

Authorization: Bearer TOKEN

# Auth

POST /register  
Cadastrar usuário

Request:

{
  "nome": "João",
  "email": "joao@email.com",
  "senha": "123456"
}

Response:

{
  "mensagem": "Usuário cadastrado com sucesso",
  "usuario": {
    "id": 1,
    "nome": "João",
    "email": "joao@email.com"
  }
}

POST /login  
Login do usuário

Request:

{
  "email": "joao@email.com",
  "senha": "123456"
}

Response:

{
  "mensagem": "Login realizado com sucesso",
  "token": "jwt_token",
  "usuario": {
    "id": 1,
    "nome": "João",
    "email": "joao@email.com"
  }
}

GET /users  
Listar usuários

Response:

[
  {
    "id": 1,
    "nome": "João",
    "email": "joao@email.com"
  }
]

# Serviços

GET /services  
Listar serviços

Response:

[
  {
    "id": 1,
    "nome": "Corte Masculino",
    "preco": "35.00",
    "duracao": 30
  }
]

POST /services  
Criar serviço  
Requer autenticação

Request:

{
  "nome": "Corte Masculino",
  "preco": 35,
  "duracao": 30
}

# Funcionários

GET /employees  
Listar funcionários

Response:

[
  {
    "id": 1,
    "nome": "Carlos",
    "especialidade": "Corte e barba",
    "telefone": "98999999999"
  }
]

POST /employees  
Criar funcionário  
Requer autenticação

Request:

{
  "nome": "Carlos",
  "especialidade": "Corte e barba",
  "telefone": "98999999999"
}

# Agendamentos

POST /appointments  
Criar agendamento  
Requer autenticação

Request:

{
  "servico_id": 1,
  "funcionario_id": 1,
  "data_hora": "2026-04-15 14:00"
}

GET /appointments  
Listar todos os agendamentos  
Requer autenticação

Response:

[
  {
    "id": 1,
    "usuario": "João",
    "servico": "Corte Masculino",
    "funcionario": "Carlos",
    "data_hora": "15/04/2026 14:00",
    "status": "agendado"
  }
]

GET /my-appointments  
Listar agendamentos do usuário  
Requer autenticação

Response:

[
  {
    "id": 1,
    "servico": "Corte Masculino",
    "funcionario": "Carlos",
    "data_hora": "15/04/2026 14:00",
    "status": "agendado"
  }
]

PUT /appointments/:id  
Editar agendamento  
Requer autenticação

Request:

{
  "servico_id": 1,
  "funcionario_id": 1,
  "data_hora": "2026-04-20 15:00"
}

PUT /appointments/:id/cancel  
Cancelar agendamento  
Requer autenticação

Response:

{
  "mensagem": "Agendamento cancelado com sucesso"
}

GET /availability  
Consultar disponibilidade  
Requer autenticação

Query Params:

funcionario_id  
data

Exemplo:

/availability?funcionario_id=1&data=2026-04-15

Response:

{
  "horarios_ocupados": [
    "10:00",
    "14:00"
  ]
}

# Status dos Agendamentos

agendado  
cancelado

# Tecnologias

Backend  
Node.js  
Express  
PostgreSQL  
JWT  
bcrypt  

Frontend  
React  
Vite  
React Query  
Axios  
Tailwind