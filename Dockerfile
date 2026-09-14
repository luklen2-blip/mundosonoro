FROM node:20-alpine

WORKDIR /usr/src/app

# Instalação de dependências
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Cópia do código-fonte completo
COPY . .

# Variáveis de ambiente de produção
ENV NODE_ENV=production
ENV PORT=3000

# Execução obrigatória de testes de integridade antes do CMD final
RUN node tests/run_all.js

EXPOSE 3000

CMD ["node", "server.js"]
