#----------------------------------------------
FROM node:lts-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile --no-audit --ignore-scripts
COPY . .
RUN npm run build; \
  npm install --production --ignore-scripts --prefer-offline

#----------------------------------------------
FROM node:lts-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/www ./dist

# Stage 2: Serve the application using Nginx
FROM nginx:alpine
COPY --from=production /app/dist /usr/share/nginx/html
EXPOSE 80
