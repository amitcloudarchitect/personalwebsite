FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_SITE_URL="https://amitkumarportfolio.com"
ARG VITE_LINKEDIN_URL=""
ARG VITE_GITHUB_URL=""
ARG VITE_EMAIL=""
ARG VITE_YOUTUBE_URL=""
ARG VITE_RESUME_URL=""

ENV VITE_SITE_URL=$VITE_SITE_URL \
    VITE_LINKEDIN_URL=$VITE_LINKEDIN_URL \
    VITE_GITHUB_URL=$VITE_GITHUB_URL \
    VITE_EMAIL=$VITE_EMAIL \
    VITE_YOUTUBE_URL=$VITE_YOUTUBE_URL \
    VITE_RESUME_URL=$VITE_RESUME_URL

RUN npm run build

FROM node:22-alpine
RUN apk add --no-cache nginx \
    && mkdir -p /var/log/nginx /usr/share/nginx/html /app/data

WORKDIR /app
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/server /app/server
COPY --from=build /app/src/data/articles.ts /app/src/data/articles.ts
COPY nginx.conf /etc/nginx/nginx.conf.template
COPY scripts/start-container.sh /app/start-container.sh
RUN sed -i 's/\r$//' /app/start-container.sh && chmod +x /app/start-container.sh

EXPOSE 8080
CMD ["/app/start-container.sh"]
