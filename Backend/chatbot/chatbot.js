const dialogFlow = require("dialogflow");
const structjson = require("./structjson");
const config = require("../config/keys");

const projectID = config.googleProjectID;
const sessionID = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

const credentials = {
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey
  };