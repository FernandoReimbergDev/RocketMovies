const { Router } = require("express");

const usersRouter = require("./users.routes");
const movieRouter = require("./movie.routes");
const tagsRouter = require("./tags.routes");


const routes = Router();

routes.use("/users", usersRouter)
routes.use("/moviesnotes", movieRouter)
routes.use("/tags", tagsRouter)

module.exports = routes;