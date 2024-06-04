#!/bin/bash

set -e

prisma_migrate_deploy() {
    echo "Running: npm run prisma:migrate:deploy"
    npm run prisma:migrate:deploy
}

prisma_generate() {
    echo "Running: npm run prisma:generate"
    npm run prisma:generate
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
