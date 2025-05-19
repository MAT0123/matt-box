FROM node:20-bullseye
WORKDIR /app
COPY package.json package-lock.json* ./
RUN rm -rf node_modules package-lock.json && npm install --include=optional
RUN npm rebuild lightningcss --build-from-source --verbose
RUN npm i lightningcss-linux-arm64-gnu



COPY . .
EXPOSE 3001
CMD ["npm" , "run" , "dev"]