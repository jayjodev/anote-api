GET KOREA STOCK Information

- Express
- Redis
- MongoDB
- Docker

- cAdvisor
- Prometheus
- Grafana

## Bulid Application

1. Build the project in local with docker
    ```code
    $ docker-compose --env-file .env.local -f docker-compose.yml up -d --build
    ```
2. Build the project in production with docker
    ```code
    $ docker-compose --env-file .env.prod -f  docker-compose-prod.yml up -d --build
    ```

SSL Update Until April 8