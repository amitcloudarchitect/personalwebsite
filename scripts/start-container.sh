#!/bin/sh
PORT="${PORT:-80}"
sed "s/__PORT__/${PORT}/g; s/\r$//" /etc/nginx/nginx.conf.template > /tmp/nginx.conf
node /app/server/index.mjs &
exec nginx -c /tmp/nginx.conf -g 'daemon off;'
