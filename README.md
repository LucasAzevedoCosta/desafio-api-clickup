# Desafio de Programação - API de Integração ClickUp

Este projeto implementa uma API RESTful em Node.js para integrar um sistema interno com a plataforma ClickUp, conforme os requisitos de um desafio de programação. A API permite sincronizar, criar e excluir tarefas, gerenciando-as tanto no ClickUp quanto em um banco de dados interno.

## Funcionalidades

A API expõe as seguintes rotas:

- `GET /api/tasks`: Sincroniza as tarefas de uma lista específica do ClickUp com o banco de dados interno. Verifica se as tarefas já existem e as atualiza, caso contrário, as insere.
- `POST /api/tasks`: Cria uma nova tarefa no ClickUp e a armazena no banco de dados interno. Requer um título e permite descrição, status, data de início e data de vencimento opcionais.
- `DELETE /api/tasks/:id`: Exclui uma tarefa do armazenamento interno, dado o seu ID. **Importante**: Esta operação não exclui a tarefa correspondente no ClickUp.

## Requisitos Técnicos

- **Linguagem**: JavaScript
- **Runtime**: Node.js (versão mais recente)
- **Framework Web**: Express.js
- **ORM**: Drizzle ORM (para interação com o banco de dados PostgreSQL)
- **Validação de Esquema**: Zod
- **Requisições HTTP**: Axios
- **Variáveis de Ambiente**: Dotenv
- **Banco de Dados**: PostgreSQL

## Docker

Para facilitar a configuração do ambiente de banco de dados, este projeto inclui um arquivo `docker-compose.yml` que configura um contêiner PostgreSQL.

### Configuração do Docker Compose

O arquivo `docker-compose.yml` define um serviço de banco de dados PostgreSQL com as seguintes configurações:

```yaml
version: '3.8'
services:
  db:
    image: postgres:13
    container_name: desafioSerUtil
    environment:
      POSTGRES_USER: usuario
      POSTGRES_PASSWORD: senha
      POSTGRES_DB: desafioSerUtil
    ports:
      - "5439:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

- `image: postgres:13`: Utiliza a imagem oficial do PostgreSQL versão 13.
- `container_name: desafioSerUtil`: Define o nome do contêiner como `desafioSerUtil`.
- `environment`: Configura as variáveis de ambiente para o PostgreSQL, incluindo usuário, senha e nome do banco de dados, que correspondem às configurações no `src/db/index.js` e no `.env`.
- `ports: - "5439:5432"`: Mapeia a porta `5439` do host para a porta `5432` do contêiner, onde o PostgreSQL está escutando.
- `volumes: - postgres_data:/var/lib/postgresql/data`: Persiste os dados do banco de dados em um volume nomeado `postgres_data`, garantindo que os dados não sejam perdidos ao reiniciar o contêiner.

### Como usar o Docker Compose

1. Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.
2. Navegue até a raiz do projeto onde o arquivo `docker-compose.yml` está localizado.
3. Execute o seguinte comando para iniciar o contêiner do banco de dados:

   ```bash
   docker-compose up -d
   ```

   Isso criará e iniciará o contêiner do PostgreSQL em segundo plano.

4. Após iniciar o contêiner, você pode prosseguir com as migrações do banco de dados conforme descrito na seção "Como Rodar o Projeto".

Para parar e remover o contêiner, execute:

```bash
docker-compose down
```
## Docker

Para facilitar a configuração do ambiente de banco de dados, este projeto inclui um arquivo `docker-compose.yml` que configura um contêiner PostgreSQL.

### Configuração do Docker Compose

O arquivo `docker-compose.yml` define um serviço de banco de dados PostgreSQL com as seguintes configurações:

```yaml
version: '3.8'
services:
  db:
    image: postgres:13
    container_name: desafioSerUtil
    environment:
      POSTGRES_USER: usuario
      POSTGRES_PASSWORD: senha
      POSTGRES_DB: desafioSerUtil
    ports:
      - "5439:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

- `image: postgres:13`: Utiliza a imagem oficial do PostgreSQL versão 13.
- `container_name: desafioSerUtil`: Define o nome do contêiner como `desafioSerUtil`.
- `environment`: Configura as variáveis de ambiente para o PostgreSQL, incluindo usuário, senha e nome do banco de dados, que correspondem às configurações no `src/db/index.js` e no `.env`.
- `ports: - "5439:5432"`: Mapeia a porta `5439` do host para a porta `5432` do contêiner, onde o PostgreSQL está escutando.
- `volumes: - postgres_data:/var/lib/postgresql/data`: Persiste os dados do banco de dados em um volume nomeado `postgres_data`, garantindo que os dados não sejam perdidos ao reiniciar o contêiner.

### Como usar o Docker Compose

1. Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.
2. Navegue até a raiz do projeto onde o arquivo `docker-compose.yml` está localizado.
3. Execute o seguinte comando para iniciar o contêiner do banco de dados:

   ```bash
   docker-compose up -d
   ```

   Isso criará e iniciará o contêiner do PostgreSQL em segundo plano.

4. Após iniciar o contêiner, você pode prosseguir com as migrações do banco de dados conforme descrito na seção "Como Rodar o Projeto".

Para parar e remover o contêiner, execute:

```bash
docker-compose down
```
## Configuração do Ambiente

Para rodar este projeto, você precisará configurar as variáveis de ambiente e o banco de dados.

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
CLICKUP_TOKEN=YOUR_CLICKUP_API_TOKEN
CLICKUP_TEAM_ID=YOUR_CLICKUP_TEAM_ID
CLICKUP_LIST_ID=YOUR_CLICKUP_LIST_ID
DATABASE_URL=postgresql://usuario:senha@localhost:5439/desafioSerUtil
PORT=3000
```

- `CLICKUP_TOKEN`: Seu token de API do ClickUp. Você pode gerá-lo nas configurações do seu perfil no ClickUp.
- `CLICKUP_TEAM_ID`: O ID da sua equipe no ClickUp.
- `CLICKUP_LIST_ID`: O ID da lista de tarefas no ClickUp que será utilizada para sincronização e criação de tarefas. Você pode obter este ID na URL da lista no ClickUp (ex: `https://app.clickup.com/t/list/YOUR_LIST_ID`).
- `DATABASE_URL`: A string de conexão com o seu banco de dados PostgreSQL. Certifique-se de que o banco de dados esteja acessível e com as credenciais corretas.
- `PORT`: A porta em que a API será executada (padrão: 3000).

### Banco de Dados

Este projeto utiliza PostgreSQL com Drizzle ORM. Certifique-se de ter um servidor PostgreSQL em execução. As migrações do banco de dados são gerenciadas pelo Drizzle Kit.

Para aplicar as migrações, execute:

```bash
npm run migrate
```

Isso criará a tabela `tasks` no seu banco de dados com o seguinte esquema:

- `id`: String, Primary Key (ID da tarefa do ClickUp)
- `title`: String
- `description`: String (opcional)
- `status`: String
- `startDate`: Date (opcional)
- `deadline`: Date (opcional)

## Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto:

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/LucasAzevedoCosta/desafio-api-clickup.git
   cd desafio-api-clickup
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Configure o arquivo `.env`** (conforme descrito acima).

4. **Execute as migrações do banco de dados**:

   ```bash
   npm run migrate
   ```

5. **Inicie a aplicação**:

   ```bash
   npm start
   ```

   A API estará disponível em `http://localhost:3000` (ou na porta configurada no seu `.env`).

## Estrutura de Pastas

- `src/`
  - `app.js`: Ponto de entrada da aplicação, configura o Express e as rotas.
  - `controllers/`: Contém a lógica de negócio para cada rota da API.
    - `task.controller.js`: Lógica para sincronizar, criar e excluir tarefas.
  - `db/`: Configuração do banco de dados e esquema.
    - `index.js`: Inicialização do Drizzle ORM.
    - `schema.js`: Definição do esquema da tabela `tasks`.
  - `routes/`: Define as rotas da API.
    - `task.routes.js`: Rotas relacionadas às operações de tarefas.
  - `services/`: Contém a lógica para interagir com APIs externas.
    - `clickup.service.js`: Funções para interagir com a API do ClickUp.
  - `utils/`: Utilitários e funções auxiliares.
    - `errorHandler.js`: Funções para tratamento de erros.
- `drizzle/`: Arquivos de migração do Drizzle ORM.
- `.env`: Variáveis de ambiente (não incluído no controle de versão).
- `package.json`: Metadados do projeto e dependências.

## Considerações sobre o Desafio

- **Armazenamento Interno**: As tarefas são armazenadas em um banco de dados PostgreSQL utilizando Drizzle ORM. A escolha do ORM e do banco de dados foi feita para demonstrar familiaridade com tecnologias modernas e boas práticas de desenvolvimento.
- **Sincronização de Tarefas**: A rota `GET /api/tasks` foi implementada para sincronizar as tarefas do ClickUp com o banco de dados interno. Ela utiliza `onConflictDoNothing()` para evitar duplicatas e garantir que apenas novas tarefas sejam inseridas, ou que as existentes sejam ignoradas se já presentes.
- **Validação de Dados**: A biblioteca Zod é utilizada para validação de esquemas de entrada, garantindo que os dados recebidos pela API estejam no formato esperado e que os campos obrigatórios sejam fornecidos.
- **Tratamento de Erros**: Um módulo `errorHandler.js` foi criado para centralizar o tratamento de erros, fornecendo respostas consistentes para erros de servidor, validação e erros de "não encontrado".

