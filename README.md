## Briefify: Simplificando a Gestão de Reuniões

### Resumo do Projeto

A Briefify é uma empresa inovadora que oferece um aplicativo para transformar áudios de reuniões em atas detalhadas e precisas automaticamente. Focada em aumentar a produtividade empresarial, a Briefify atende empresas de todos os portes, proporcionando eficiência na documentação de reuniões com uma interface amigável e tecnologia avançada de processamento de linguagem natural.

## Integrantes do Grupo BGC

| Nome                           | RA         |
| ------------------------------ | ---------- |
| Bruno Augusto Lopes Fevereiro  | 20.02194-0 |
| Gabriel Bianconi               | 20.00822-8 |
| Carlos Alberto Matias da Costa | 20.01308-6 |

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em seu ambiente:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)

### Passo a Passo

1. **Clone o repositório:**

```bash
git clone <link do repo>
```

2. **Crie o arquivo .env no diretório do back:**

```bash
PORT=3000

POSTGRES_HOST="localhost"
POSTGRES_PORT=5432
POSTGRES_USER="local_user"
POSTGRES_DB="local_db"
POSTGRES_PASSWORD=local_password

DATABASE_URL="postgresql://local_user:local_password@localhost:5432/local_db?schema=public"

```

3. **Instale as dependências:**

- Navegue para o diretório correspondente (front ou back):

```bash
cd </front ou /back>
```

4. **Instale as dependências do projeto:**

Abra um terminal na raiz do projeto e execute o comando abaixo para instalar todas as dependências necessárias:

```sh
pnpm install
```

5. **Execute o servidor de desenvolvimento:**

Após a instalação das dependências, inicie o servidor de desenvolvimento com so comandos:

- **back:**

```bash
pnpm run back:dev
```

Para as migrations do Banco de Dados:

```bash
pnpm run back:prisma:run
```

- **front:**

```bash
pnpm run front:dev
```
