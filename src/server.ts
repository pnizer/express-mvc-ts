import * as express from "express";
import { routes } from "./mvc/routes";
import { UsersController }  from "./controllers/users";

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

// Register all our routes with /api
app.use('/api/users', routes(UsersController));

// Start the server
app.listen(port);
console.log(`Listening on port ${port}`);

