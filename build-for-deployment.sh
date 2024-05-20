#!/bin/bash

set -e

prisma_migrate_deploy() {
    echo "Running: npx prisma migrate deploy"
    npx prisma migrate deploy
}

prisma_generate() {
    echo "Running: npx prisma generate"
    npx prisma generate
}

npm_run_build() {
    echo "Running: npm run build"
    npm run build
}

npm_run_create_superuser() {
    echo "Running: npm run create-superuser"
    npm run create-superuser
}

main() {
    prisma_migrate_deploy
    prisma_generate
    npm_run_create_superuser
    npm_run_build
}

main
