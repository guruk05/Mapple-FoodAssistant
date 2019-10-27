const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const config = require("./config/keys");

const app = express();
const PORT = process.env.PORT || 5000;