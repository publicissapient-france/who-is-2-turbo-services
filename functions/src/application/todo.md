# /games/series-5
## POST
### response 
```json
{
 "id": "c83146e3-2cf2-40d4-94d1-8289861fe913",
 "type": "series", 
 "size": 5,
 "questions": [
     {
         "picture": "/api/games/pictures/jdksjflskdfj",
         "propositions": [
             {"firstName": "Toto", "lastName": "Lambda"},
             {"firstName": "Tutu", "lastName": "Lambda"},
             {"firstName": "Titi", "lastName": "Lambda"},
             {"firstName": "Tata", "lastName": "Lambda"}
        ]
     },
     {
         "picture": "/api/games/pictures/jzaeoiooos",
         "propositions": [
             {"firstName": "Toto", "lastName": "Lambda"},
             {"firstName": "Tutu", "lastName": "Lambda"},
             {"firstName": "Titi", "lastName": "Lambda"},
             {"firstName": "Tata", "lastName": "Lambda"}
        ]
     },
     {
         "picture": "/api/games/pictures/ozapeiozieokk",
         "propositions": [
             {"firstName": "Toto", "lastName": "Lambda"},
             {"firstName": "Tutu", "lastName": "Lambda"},
             {"firstName": "Titi", "lastName": "Lambda"},
             {"firstName": "Tata", "lastName": "Lambda"}
        ]
     },
     {
         "picture": "/api/games/pictures/wjksqljdakjdkz",
         "propositions": [
             {"firstName": "Toto", "lastName": "Lambda"},
             {"firstName": "Tutu", "lastName": "Lambda"},
             {"firstName": "Titi", "lastName": "Lambda"},
             {"firstName": "Tata", "lastName": "Lambda"}
        ]
     },
     {
         "picture": "/api/games/pictures/lppaelldkoih",
         "propositions": [
             {"firstName": "Toto", "lastName": "Lambda"},
             {"firstName": "Tutu", "lastName": "Lambda"},
             {"firstName": "Titi", "lastName": "Lambda"},
             {"firstName": "Tata", "lastName": "Lambda"}
        ]
     }
    ]
}
```

# /games/series-5/{gameId}

## POST
### request
```json
{
    "responses": [1,0,1,3,2]
}
```
### response
```json
{
  "correct": 4,
  "total": 5
}
```

# /games/pictures/{cipheredId}
Returns picture
