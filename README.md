# Feedboard

Feedboard is a free, open-source, and self-hosted customer feedback tool designed to help you collect, organize, and prioritize feedback from your customers.

With Feedboard, you can easily gather insights from your user base, track feature requests, and manage your product roadmap more effectively.

## Features

### Projects and Boards
- Create multiple projects to manage feedback for different products or services
- Within each project, organize feedback into categories or boards
- Each board can have posts or feedback items added to it

### Statuses
- Assign statuses to posts, such as "Planned," "In Progress," or "Completed"
- Easily track the progress of feature requests or bug reports

### Roadmaps
- Create visual roadmaps to showcase your product's upcoming features
- Link posts or feedback items to specific roadmap items
- Keep your users informed about your development plans

### User Engagement
- Allow users to upvote posts, indicating the popularity of a feature request
- Enable commenting on posts for further discussion and clarification

## Run Locally

1. Clone the repository: `git clone https://github.com/Swanand01/feedboard.git`
2. Install dependencies: `npm install`
3. Configure the application by updating the `.env` file. Please refer to the **[Environment Variables](#environment-variables)**  section below.
4. Apply prisma migrations: `npm run prisma:migrate:dev`
5. Generate prisma types: `npm run prisma:generate`
6. Create the superuser: `npm run create-superuser`
4. Start the server: `npm run dev`
5. Start the onboarding process at the `/onboarding` route


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`: The URL of the local Postgres database.

`GOOGLE_CLIENT_ID`: Google OAuth Client ID.

`GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret.

`SUPERUSER_EMAIL`: Email address of the user you wish to make superuser.

`SESSION_SECRET`: A randomly generated string used for securely signing session cookies.


## Deployment

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/Swanand01/feedboard/tree/main)

- Feel free to customise the resources as per your requirement.
- Configure the [environment variables](#environment-variables). If you choose to proceed with DigitalOcean Postgres instance, you don't need to edit the `DATABASE_URL` variable.
- Once deployed, start the onboarding process at the `/onboarding` route.


## FAQ

1. ### How do I get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`?

    1. Go to https://console.cloud.google.com/
    2. Select a project or create a new one.
    3. Once the project is selected, go to https://console.cloud.google.com/apis/credentials
    4. Open the Credentials tab from the sidebar
    5. Click on Create Credentials and select OAuth client ID.
    6. Select Application type as Web application.
    7. Name your application.
    8. In the Authorised redirect URIs section, click on ADD URI and add http://localhost:3000/auth/google/callback

    **Note**: The port may be different for you.

    9. Click on CREATE.
    10. You will now get your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Copy them to your `.env` file.

2. ### How do I set up a Postgres database locally?

    Please read [this.](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database)

3. ### Do I *have* to use DigitalOcean managed Postgres?

    No, you can use any managed Postgres. Just make sure to set the `DATABASE_URL` environment variable accordingly while deploying.

4. ### How do I set up a managed Postgres instance?

    - [Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/)
    - [Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/products/postgresql/#overview)
    - [Digital Ocean Managed Postgres](https://www.digitalocean.com/products/managed-databases-postgresql)
    - [Google Cloud SQL for PostgreSQL](https://cloud.google.com/sql/docs/postgres/)
    - [Heroku Managed Data Services](https://www.heroku.com/managed-data-services)

## Contributing

We welcome contributions from the community! If you'd like to contribute to Feedboard, please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b my-new-feature`
3. Make your changes and commit them: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request
## License

[MIT](https://choosealicense.com/licenses/mit/)


## Feedback

If you have any feedback, please create a new issue, or head over to [Feedboard's Feedboard.](https://feedboard-sr8bt.ondigitalocean.app/)
