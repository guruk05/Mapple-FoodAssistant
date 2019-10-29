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

}
