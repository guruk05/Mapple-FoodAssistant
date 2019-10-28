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

  const sessionClient = new dialogFlow.SessionsClient({ projectID, credentials });

  module.exports = {
    textQuery: async function(text, userID, parameters = {}) {
      let sessionPath = sessionClient.sessionPath(projectID, sessionID + userID);
  
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: text,
            languageCode: languageCode
          }
        },
        queryParams: {
          payload: {
            data: parameters
          }
        }
      };
      let responses = await sessionClient.detectIntent(request);
      responses = await this.handleAction(responses);
      return responses;
    },