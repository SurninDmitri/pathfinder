# Этап 1: Сборка
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Этап 2: Просто отдаем файлы (мы их заберем через volume в compose)
FROM alpine
COPY --from=build-stage /app/dist /frontend_static
# ^ Если у тебя Create React App, замени /app/dist на /app/build