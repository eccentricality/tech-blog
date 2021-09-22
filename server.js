// bringing in dependencies
const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// controller routes, sequelize, helper functions
const routes = require("./controllers");
const sequelize = require("./config/connection");
const helpers = require("./utils/helpers");

// server and port
const app = express();
const PORT = process.env.PORT || 3001;

// session with cookie timeout 10 mins
const sess = {
  secret: "Super secret secret",
  cookie: {
    expires: 600000,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// use express-session
app.use(session(sess));

// handlebars with helpers
const hbs = exphbs.create({ helpers });

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
