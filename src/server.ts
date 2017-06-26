import "reflect-metadata";

import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import { routes } from "./mvc/routes";

import { UsersController }  from "./controllers/users";
import { AuthController }  from "./controllers/auth";
import { ImagesController }  from "./controllers/images";

import "./repository/mongo-repository";

// Create our Express application
var app = express();
app.use(cors())
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({extended: true}));

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

// Register all our routes with /api
app.use('/storage/', express.static(process.env.STORAGE_DIR || './data'));

app.use('/api/v1/users', routes(UsersController));
app.use('/api/v1/auth', routes(AuthController));
app.use('/api/v1/images', routes(ImagesController));

// Start the server
app.listen(port);
console.log(`Listening on port ${port}`);
