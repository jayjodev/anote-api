Local development 

```
npm run start 
npm run start-debug
```
Install mongodb & redis on local
* MONGO_DB=0.0.0.0:27017
* REDIS_DB=0.0.0.0:6379


Development & Production Environment

- Node (Express)

- Redis
- MongoDB
- cAdvisor
- Prometheus
- Grafana

## Bulid Application

1. Build the project in development  with docker
    
    ```
    $ docker-compose --env-file .env.dev -f  docker-compose.yml up -d --build

2. Build the project in production with docker
    
    ```
    $ docker-compose --env-file .env.prod -f docker-compose.yml up -d --build
    ```

SSL Update Until April 8