const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const config = require("./config/keys");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(config.mongoURI, { useUnifiedTopology: true , useNewUrlParser: true }); 

//Routes

const dialogFlowRoutes = require("./routes/dialogFlow");
const fulfillmentRoutes = require("./routes/fulfillment");

app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.send({ hello: "there" });
});

app.use(dialogFlowRoutes);
app.use(fulfillmentRoutes);



  app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`);
  });