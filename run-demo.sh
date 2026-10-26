#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
umask 077
mkdir -p .demo
export npm_config_cache="$PWD/.demo/npm-cache"
export PIP_CACHE_DIR="$PWD/.demo/pip-cache"
export COMPOSER_HOME="$PWD/.demo/composer" COMPOSER_CACHE_DIR="$PWD/.demo/composer-cache"
cd my-app
[[ -f .env.demo ]] || cp .env.example .env.demo
export APP_NAME="業務管理デモ" LOG_CHANNEL=single LOG_LEVEL=debug MAIL_FROM_ADDRESS=demo@example.invalid MAIL_FROM_NAME="しっぽ商店（架空）"
export APP_ENV=local APP_DEBUG=true APP_URL=http://localhost:8102
export DB_CONNECTION=sqlite DB_DATABASE="$PWD/database/demo.sqlite"
export SESSION_COOKIE=review_demo_session
export SESSION_DRIVER=file CACHE_STORE=file CACHE_DRIVER=file QUEUE_CONNECTION=sync MAIL_MAILER=log
export APP_KEY="$(php -r 'echo "base64:".base64_encode(random_bytes(32));')"
export FRONTEND_URL=http://localhost:3108
mkdir -p storage/framework/{cache/data,sessions,views} storage/logs bootstrap/cache
rm -f bootstrap/cache/config.php
composer install --no-interaction --prefer-dist
php artisan config:clear --env=demo
first=0
[[ -f "$DB_DATABASE" ]] || touch "$DB_DATABASE"
if [[ ! -f ../.demo/seeded ]]; then first=1; fi
php artisan migrate --env=demo --force
if [[ "$first" == 1 ]]; then php artisan db:seed --env=demo --class=ScreenshotSeeder --force; touch ../.demo/seeded; fi
npm ci --no-audit --no-fund
npm run build
rm -f public/hot
[[ "${1:-}" == "--prepare-only" ]] && exit 0
exec php artisan serve --env=demo --host=127.0.0.1 --port=8102
