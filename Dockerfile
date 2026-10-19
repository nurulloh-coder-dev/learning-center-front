# Bitta konteyner, bitta domen (alia.uz): landing + ilova + `/api` proxy.
#
# Uch bosqich, chunki natijada Node ham, node_modules ham kerak emas —
# faqat tayyor fayllar va kichkina Caddy qoladi.

# 1. Landing (Next.js, statik eksport → landing/out)
FROM node:22-alpine AS landing
WORKDIR /landing
COPY landing/package.json landing/package-lock.json ./
RUN npm ci
COPY landing/ ./
RUN npm run build

# 2. Ilova (Vite → dist)
FROM node:22-alpine AS build
WORKDIR /app

# package fayllari alohida ko'chiriladi: kod o'zgarganda ham
# `npm ci` qatlami kesh'dan olinadi.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# `npm run build` = `tsc -b && vite build` — tip xatosi build'ni to'xtatadi.
RUN npm run build

# 3. Server
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv/app
COPY --from=landing /landing/out /srv/site
