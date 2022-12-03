## anote.dev APIs 

### Local development 

```
npm run start 
npm run start-debug
```
### Bulid Application

1. Build the project in development with docker
    
```
docker-compose --env-file .env.dev -f  docker-compose.yml up -d --build
```

2. Build the project in production with docker
    
```
docker-compose --env-file .env.prod -f docker-compose.yml up -d --build
```