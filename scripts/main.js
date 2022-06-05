const express = require("express");
const { Sequelize } = require("sequelize");
const routes = require("./routes");
const session = require("express-session");
const app = express();

const PORT = 8000;

// Connect to MySQL
const sequelize = new Sequelize("main", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

sequelize.authenticate()
.then(() => console.log("Main Database Connected!"))
.catch((err) => console.log(`Error! \n ${err}`))

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view-engine", "ejs");
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});