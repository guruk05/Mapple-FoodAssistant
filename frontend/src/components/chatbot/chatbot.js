import React, { Component } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { v4 as uuid } from "uuid";
import Message from "./Message";
import Card from "./Card";
import messageSound from './../../assets/open-ended.mp3';

const cookies = new Cookies();


class Chatbot extends Component {
    // Creating react references to elements
    messagesEnd;
    chatInput;
  
    constructor(props) {
      super(props);
      this.state = {
        messages: [],
        showBot: false,
        welcomeSent: false,
        botName: 'Chatbot'
      };
      
      this.sound = new Audio(messageSound);
      
      //Setting the cookie using uuid
      if (!cookies.get("userID")) {
        cookies.set("userID", uuid(), { path: "/" });
      }
  
      //event listeners
      this.toggleBot = this.toggleBot.bind(this);
      this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    }
  
    resolveAfterXSeconds(time) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(time);
        }, time * 1000);
      });
    }
  
    async componentDidMount() {
      if(!this.state.welcomeSent) {
        await this.resolveAfterXSeconds(1.2);
        this.df_event_query("WELCOME_TO_SITE");
        this.setState({ welcomeSent: true, showBot: true });
      }
    }
  
    // Scroll to latest message on updation of state
    componentDidUpdate() {
      if(this.state.showBot) {
        this.messagesEnd.scrollIntoView({ behaviour: "smooth" });
      }
      if (this.chatInput) {
        this.chatInput.focus();
      }
    }

    async df_text_query(text) {
        let says = {
          speaks: "me",
          message: {
            text: {
              text
            }
          }
        };
        this.setState({
          messages: [...this.state.messages, says]
        });
    
        const res = await axios.post("/api/df_text_query", {
          text,
          userID: cookies.get("userID")
        });
    
     
        if (res.data.action === 'input.whoAreYou' && res.data.allRequiredParamsPresent) {
          this.setState({botName: res.data.parameters.fields.name.stringValue});
        }
    
        res.data.fulfillmentMessages.forEach(message => {
          says = {
            speaks: "bot",
            message
          };
          this.setState({
            messages: [...this.state.messages, says]
          });
        });
        
    
        this.sound.play();
      }

      async df_event_query(event) {
        const res = await axios.post("/api/df_event_query", {
          event,
          userID: cookies.get("userID")
        });
        // Iterating over all the responeses in the the request response
        // because the chatbot can have multiple responses for a single phrase
        for (let msg of res.data.fulfillmentMessages) {
          let says = {
            speaks: "bot",
            message: msg
          };
          this.setState({ messages: [...this.state.messages, says] });
        }
        this.sound.play();
      }
    
      //Helper functions
      isNormalMessage(message) {
        return message.message && message.message.text && message.message.text.text;
      }
    
      isMessageCard(message) {
        return (
          message.message &&
          message.message.payload &&
          message.message.payload.fields &&
          message.message.payload.fields.cards
        );
      }


      renderCards(cards) {
        return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
      }
    
      renderOneMessage(message, i) {
        if (this.isNormalMessage(message)) {
          return (
              <Message
                key={i}
                speaks={message.speaks}
                text={message.message.text.text}
              />
          );
        } else if (this.isMessageCard(message)) {
          return (
            <div key={i}>
              <div className="container">
                <div
                  style={{
                    height: 200,
                    width:
                      message.message.payload.fields.cards.listValue.values.length * 150,
                    paddingLeft: '12%'
                  }}
                >
                  {this.renderCards(
                    message.message.payload.fields.cards.listValue.values
                  )}
                </div>
              </div>
            </div>
          );
        }
      }
    
      //Renders all the messages
      renderMessages(stateMessages) {
        if (stateMessages) {
          return stateMessages.map((message, i) => {
            return this.renderOneMessage(message, i);
          });
        }
        return null;
      }
    
      toggleBot() {
        this.setState({ showBot: !this.state.showBot });
      }

}
