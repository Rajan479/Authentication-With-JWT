const express = require('express');
// const cors = require('cors');
const app = express(); // create an express object by calling the express function
require('dotenv').config();
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

// app.get('/', function (request, response){
//     response.send("Hello world");
// });

// app.post('/home', function (request, response){
//     response.send("Welcome to home page");
// });

// app.patch("/patch", function (request, response){
//     response.send("This is a patch request");
// })

// app.listen(PORT, function process(){
//     console.log("Server started on port : " + PORT);
// });
 
//  // -- This code is for how to use cors middleware and this middleware is used for stop the unvalid requests and when we give requests in array then this forntend requets only use the backend (index.js)
// app.use(express.json());
// app.use(cors({
//     domains : ["http://localhost:3000"]
// }));

// app.post("/sum", function(request, response){
//     const a = parseInt(request.body.a);
//     const b = parseInt(request.body.b);
    
//     response.json({
//         answer : a + b
//     });
// });

// app.listen(PORT, function(request, response){
//     console.log("server started!");
// });

// // ----Authentication

const users = [];

app.use(express.json());

// custom logic for token generation
// function generateToken(){
//     let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y','z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//     let token = "";
//     for(let i=0; i<options.length; i++){
//         token += options[Math.floor(Math.random() * options.length)];
//     }

//     return token;
// }

app.get("/", function(request, response){
    response.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", function (request, response){
    const username = request.body.username;
    const password = request.body.password;

    users.push({
        username : username,
        password : password
    });


    response.json({
        message : "You are signed up"
    });
});

app.post("/signin", function (request, response){
    const username = request.body.username;
    const password = request.body.password;

    let foundUser = null;
    for(let i=0; i<users.length; i++){
        if(users[i].username == username && users[i].password == password){
            foundUser = users[i];
        }
    }

    if(foundUser){
        const token = jwt.sign({
            username : username
        }, JWT_SECRET); // it create token using username + JWT_SECRET
        // foundUser.token = token;
        response.json({
            token : token
        });
    }
    else{
        response.status(403).send({
            message : "Invalid username & password"
        });
    }

});

function auth(request, response, next){
    const token = request.headers.token;
    const decodedInformation = jwt.verify(token, JWT_SECRET);
    if(decodedInformation.username){
        request.username = decodedInformation.username;
        next();
    }
    else{
        response.json({
            Message : "You are not logged in"
        });
    }
}

app.get("/me", auth, function(request, response){
    let founduser = null;

    for(let i=0; i<users.length; i++){
        if(users[i].username == request.username){
            founduser = users[i];
        }
    }

    if(founduser){
        response.json({
            username : founduser.username,
            password : founduser.password
        });
    }
    else{
        response.json({
            message : "you do not have access to this website"
        });
    }
});

app.listen(PORT);