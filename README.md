# WelloTools

## API documentation

[Available on SwaggerHub](https://app.swaggerhub.com/apis-docs/kondfox/WelloTools/1.0.0)

## Environment variables

You can find an example `.env` file under the name of `.env.example`.
Make a copy of it with the name `.env.dev` and set your environment variables according the following descriptions.
If you use multiple environments, create a `.env.<environment name>` file for each environemt, where `<environment name>` is the value of your `NODE_ENV` environment variable.

### Mandatory environment variables

| name         |      value       |                   description |                            example |
| ------------ | :--------------: | ----------------------------: | ---------------------------------: |
| DB_URI       |   MongoDB URI    |           set database by URI |   'mongodb://localhost/wellotools' |
| TOKEN_SECRET | JWT token secret | secret key to sign JWT tokens | 'sNzk2YJxJLvqvcZsCaEqwY8zZvbusd6q' |

### Optional environment variables

| name     |       value        |              description | example |
| -------- | :----------------: | -----------------------: | ------: |
| NODE_ENV | [dev / production] | set application run mode |   'dev' |

## Defined npm commands

- `npm install`: installs the dependencies
- `npm start`: starts the app in dev mode
- `npm test`: runs tests
- `npm run test:cover`: shows test coverage
- `npm run lint`: runs the linter
- `npm run build`: builds the app

## Play with the API locally

- in [VSCode](https://code.visualstudio.com/) install the [REST Client plugin](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- start the application (`npm start`)
- send requests to the API by clicking on the `Send Request` link above the sample API calls under the `usage` folder

(or use [Postman](https://www.postman.com/))
