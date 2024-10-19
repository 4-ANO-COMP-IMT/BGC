# Usa uma imagem base Node.js
FROM node:18-alpine

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia os arquivos de configuração e pacotes para o contêiner
COPY ../../package.json ../../pnpm-lock.yaml ./

# Instala o PNPM globalmente
RUN npm install -g pnpm

# Executa a instalação das dependências
RUN pnpm install

# Copia todo o código da aplicação para o contêiner
COPY . .

# Expõe a porta usada pelo serviço de transcrição
EXPOSE 5000

# Comando para iniciar o serviço de transcrição
CMD ["pnpm", "run", "back:dev:transcription"]
