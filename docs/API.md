# API - Sistema de Barbearia

Documentação dos endpoints atuais da API do sistema de agendamento para barbearia.

# Autenticação

A API utiliza autenticação via JWT.

Rotas protegidas exigem o header:

Authorization: Bearer TOKEN

# Padrão de Resposta

Respostas de sucesso com objeto:

{
  "mensagem": "Texto da operação realizada com sucesso",
  "dados": {
    "id": 1
  }
}

Respostas de sucesso com listagem:

{
  "dados": [
    {
      "id": 1
    }
  ]
}

Respostas de erro:

{
  "erro": "Mensagem do erro"
}

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
  "dados": {
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
  "dados": {
    "token": "jwt_token",
    "usuario": {
      "id": 1,
      "nome": "João",
      "email": "joao@email.com"
    }
  }
}

GET /users  
Listar usuários

Response:

{
  "dados": [
    {
      "id": 1,
      "nome": "João",
      "email": "joao@email.com"
    }
  ]
}

# Serviços

GET /services  
Listar serviços

Response:

{
  "dados": [
    {
      "id": 1,
      "nome": "Corte Masculino",
      "preco": "35.00",
      "duracao": 30
    }
  ]
}

POST /services  
Criar serviço  
Requer autenticação

Request:

{
  "nome": "Corte Masculino",
  "preco": 35,
  "duracao": 30
}

Response:

{
  "mensagem": "Serviço criado com sucesso",
  "dados": {
    "id": 1,
    "nome": "Corte Masculino",
    "preco": "35.00",
    "duracao": 30
  }
}

# Funcionários

GET /employees  
Listar funcionários

Response:

{
  "dados": [
    {
      "id": 1,
      "nome": "Carlos",
      "especialidade": "Corte e barba",
      "telefone": "98999999999",
      "criado_em": "10/04/2026 05:02"
    }
  ]
}

POST /employees  
Criar funcionário  
Requer autenticação

Request:

{
  "nome": "Carlos",
  "especialidade": "Corte e barba",
  "telefone": "98999999999"
}

Response:

{
  "mensagem": "Funcionário criado com sucesso",
  "dados": {
    "id": 1,
    "nome": "Carlos",
    "especialidade": "Corte e barba",
    "telefone": "98999999999",
    "criado_em": "10/04/2026 05:02"
  }
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

Response:

{
  "mensagem": "Agendamento criado com sucesso",
  "dados": {
    "id": 1,
    "usuario_id": 1,
    "servico_id": 1,
    "funcionario_id": 1,
    "data_hora": "15/04/2026 14:00",
    "status": "agendado",
    "criado_em": "10/04/2026 12:00"
  }
}

GET /appointments  
Listar todos os agendamentos  
Requer autenticação

Response:

{
  "dados": [
    {
      "id": 1,
      "usuario": "João",
      "servico": "Corte Masculino",
      "funcionario": "Carlos",
      "data_hora": "15/04/2026 14:00",
      "status": "agendado",
      "criado_em": "10/04/2026 12:00"
    }
  ]
}

GET /my-appointments  
Listar agendamentos do usuário  
Requer autenticação

Response:

{
  "dados": [
    {
      "id": 1,
      "servico": "Corte Masculino",
      "funcionario": "Carlos",
      "data_hora": "15/04/2026 14:00",
      "status": "agendado"
    }
  ]
}

PUT /appointments/:id  
Editar agendamento  
Requer autenticação

Request:

{
  "servico_id": 1,
  "funcionario_id": 1,
  "data_hora": "2026-04-20 15:00"
}

Response:

{
  "mensagem": "Agendamento atualizado com sucesso",
  "dados": {
    "id": 1,
    "usuario_id": 1,
    "servico_id": 1,
    "funcionario_id": 1,
    "data_hora": "20/04/2026 15:00",
    "status": "agendado",
    "criado_em": "10/04/2026 12:00"
  }
}

PUT /appointments/:id/cancel  
Cancelar agendamento  
Requer autenticação

Response:

{
  "mensagem": "Agendamento cancelado com sucesso",
  "dados": {
    "id": 1,
    "status": "cancelado",
    "data_hora": "15/04/2026 14:00",
    "criado_em": "10/04/2026 12:00"
  }
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
  "dados": {
    "funcionario_id": 1,
    "data": "2026-04-15",
    "horarios_ocupados": [
      "10:00",
      "14:00"
    ]
  }
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