# api.bsodium.fr

This repository contains the source code of the API for my eportfolio/landing page, hosted at [bsodium.fr](https://bsodium.fr) on Vercel.

## Usage

Install all required dependencies with the following command:

```bash
yarn install
```

To start the development server, run the following command:

```bash
yarn dev
```

The server should be available at [http://localhost:3001](http://localhost:3001) by default.

## Technical challenges

This API mainly serves as a proxy to the many services which my projects are hosted on. This comes with some drawbacks such as rate limiting, especially when it comes to the GitHub and ResearchGate services. To mitigate this, a rudimentary but nonetheless highly effective and resource-efficient caching system has been implemented. 

The parsed API responses are regularly "frozen" and stored in a JSON file (one per route), allowing for near-instantaneous responses to be served to the client, when fetching the same data from the original service would take several seconds. 

The cache invalidation and refresh system is handled by a simple cron job, which runs every 24 hours.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.