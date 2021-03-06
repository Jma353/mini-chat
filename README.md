# Mini Chat (Node JS MVC + Socket exploration)


# To Run 
This app requires nodemon (updates of server on saved changes)
```python 
# If you don't have nodemon 
npm install -g nodemon
# To run the server 
npm start 
```

# Endpoint Access From Command Line 
To access endpoints of this app, one can use [httpie](https://github.com/jkbrzt/httpie).  To pass a json as an HTTP body from the `/jsons` folder in, one can call: 

	http POST :<PORT>/my/endpoint/name < desired.json

# Endpoints 
## Users 

### Index 
GET /users/index : Get a list of users using the platform 
#### HTTP Request HEADERS 
	session_code: XYZ 


### Sign Up 
POST /users/sign_up : Sign up a user 
#### HTTP Request BODY  
	{ 
		user: {
			firstName: "Joe",
			lastName: "Antonakakis",
			email: "jma353@cornell.edu",
			password: "this_is_my_password"
		}
	}

### Sign In 
POST /users/sign_in : Sign in as a user (getting a session code back)
#### HTTP Request HEADERS 
	E: jma353@cornell.edu
	P: this_is_my_password

### Sign Out 
POST /users/sign_out : Sign out a user 
#### HTTP Request HEADERS 
	session_code: XYZ



## Chats

### Index 
GET /chats/index : Get a list of chats you're in 
#### HTTP Request HEADERS 
	session_code: XYZ

### Participants of a Chat
GET /chats/participants/:chat_id : Get a list of users in a chat
#### HTTP Request HEADERS 
	session_code: XYZ

### Create
POST /chats/create : Create a chat 
#### HTTP Request HEADERS 
	session_code: XYZ
#### HTTP Request BODY 
	{
		participants: [ 100, 3, 44, // userId's of the people you want in the chat ]
	}
















