
# Deployment

## Prerequisites

- Fork the reposistory
- Configure the environment variables

## DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps/new).
2. Select `GitHub` as the Provider.
3. Provide access to the forked `Feedboard` repository.
4. Make sure the Branch is set to `main` and the Source Directory is `/`.
5. Click Next.
6. In the Resources section, you could delete the first resource. Feel free to increase/decrease the size of the allocated resources.
7. Ensure you have these settings for the selected resource.
8. Set the environment variables for the app.
9. Review your configuration.
10. Press Create Resources.
11. Once deployed, go to the Console for your deployed app, and run these commands:
    1. `npm run prisma:generate`
    2. `npm run prisma:migrate:deploy`
    3. `npm run create-superuser`
