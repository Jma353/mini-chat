# Mini Chat (Node JS MVC + Socket exploration)


## To Run 
This app requires nodemon (updates of server on saved changes)
```python 
# If you don't have nodemon 
npm install -g nodemon
# To run the server 
npm start 
```

## Endpoint Access From Command Line 
To access endpoints of this app, one can use [httpie](https://github.com/jkbrzt/httpie).  To pass a json as an HTTP body from the `/jsons` folder in, one can call: 

	http POST :<PORT>/my/endpoint/name < desired.json

