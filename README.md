# who-is-2-turbo-services
Who Is 2 Turbo Services

## Prerequisite
- Nodejs
- npm 
- firebase-cli 
- nestjs-cli

## How to run locally 

```shell script
cd functions && npm run serve
```

### Checkout the application 
 - [swagger-ui](http://localhost:5001/who-is-2-turbo/europe-west1/api/swagger/index.html)
    - Explore `http://localhost:5001/who-is-2-turbo/europe-west1/api/swagger-json`
- The data located in folder `functions/mock` are loaded at emulator startup. 
    
## Security
TBD

## Deploy

### Environment setting
```shell script
firebase functions:config:set whoisturbo.baseurl="https://europe-west1-who-is-2-turbo.cloudfunctions.net/api"
```
