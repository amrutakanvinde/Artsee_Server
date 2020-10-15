require("dotenv").config();
let express = require("express");
let app = express();
let sequelize = require("./db");

let user = require("./controllers/usercontroller");
let cart = require("./controllers/cartcontroller");
let item = require("./controllers/itemcontroller");
let category = require("./controllers/categorycontroller");
let categoryitem = require("./controllers/categoryitemcontroller");

sequelize.sync();
// sequelize.sync({force: true}) //Drop database

app.use(require("./middleware/headers"));
app.use(express.json());

app.use("/user", user);
// app.use(require('./middleware/validate-session'));
app.use("/cart", cart);
app.use("/item", item);
app.use("/category", category);
app.use("/categoryitem", categoryitem);

app.listen(process.env.PORT, function () {
  console.log(`App is listening to port ${process.env.PORT}`);
});
