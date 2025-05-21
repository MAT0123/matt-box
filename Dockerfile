FROM node:20-bullseye as builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN rm -rf node_modules package-lock.json && npm install --include=optional
RUN npm rebuild lightningcss --build-from-source --verbose
RUN npm i lightningcss-linux-x64-gnu
COPY . .
RUN npm run build
# CMD ["npm" , "run" , "build"]
FROM node:20-bullseye as runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.ts ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm" , "run" , "start"]