# who-is-2-turbo-services
Who Is 2 Turbo Services

## Prerequisite
- Nodejs
- npm 
- firebase-cli 
- nestjs-cli

## How to run locally 
### Prerequisites
#### Retrieve a production token
Since the authentication is not mocked locally, you'll need a real token from production.  
To get it, launch a game session on `https://whois.publicissapient.fr` and retrieve a bearer token from any requests.

#### Add authentication to Firebase for your local to be allowed
Also since the authentication is production one, your calls need to be authenticated to Firebase.
This is done automatically by `admin.initializeApp();` method that will check your credentials by default ().
However, you need to pass these credentials. Detailed procedure can be found [here](https://firebase.google.com/docs/admin/setup#initialize-sdk).  
TL;DR version :
```manifest
 - Generate a key from [here](https://console.firebase.google.com/u/0/project/who-is-2-turbo/settings/serviceaccounts/adminsdk)
 - Save the key anywhere you want (please, not in the git project...)
 - Export the location of this key in `GOOGLE_APPLICATION_CREDENTIALS` env var.
```

### Run  it
```shell script
cd functions && npm run dev
```

### Curl it
```shell
curl -H 'Authorization: Bearer <your token>' http://localhost:5001/who-is-2-turbo/europe-west1/api/members/me
```

### Checkout the application 
 - [swagger-ui](http://localhost:5001/who-is-2-turbo/europe-west1/api/swagger/index.html)
    - Explore `http://localhost:5001/who-is-2-turbo/europe-west1/api/swagger-json`
- The data located in folder `functions/mock` are loaded at emulator startup. 
    
## Security
TBD

## Troubleshooting

On M1 you may have this error: 
> Failed to load function definition from source: Failed to generate manifest from function source: Error:
Something went wrong installing the "sharp" module

It's due to missing x64 binary.

To add them to your local environment in order to publish to Firebase you can use:

```bash
npm rebuild --platform=darwin --arch=x64 sharp
```

## Deploy from local environment to Firebase

> You need the Firebase CLI.

```bash
firebase login
firebase use <your project>
firebase deploy --only functions
```

