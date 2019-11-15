const dialogFlow = require("dialogflow");
const config = require("../config/keys");

// Integrating DialogFlow using googleProjectID, dialogFlowsessionID and dialogFlowSessionlanguageCode

const projectID = config.googleProjectID;
const sessionID = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

// Credentials

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

    eventQuery: async function(event, userID, parameters = {}) {
        let sessionPath = sessionClient.sessionPath(projectID, sessionID + userID);
        const request = {
          session: sessionPath,
          queryInput: {
            event: {
              name: event,
              parameters: structjson.jsonToStructProto(parameters),
              languageCode: languageCode
            }
          }
        };
        let responses = await sessionClient.detectIntent(request);
        responses = await this.handleAction(responses);
        return responses;
      }
    }