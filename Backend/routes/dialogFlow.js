const express = require("express");
const chatbot = require("../chatbot/chatbot");

const router = express.Router();

router.post("/api/df_text_query", async (req, res) => {
    const { text, userID, parameters } = req.body;