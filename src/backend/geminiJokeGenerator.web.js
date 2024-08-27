import { fetch } from "wix-fetch";
// @ts-ignore
import { Permissions, webMethod } from "wix-web-module";

// Generate jokes about the given list of items using Gemini API
export const jokeGenerator = webMethod(Permissions.Anyone, async (items) => {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-latest:generateContent?key=AIzaSyDDatH8QOT5L0pXVMpsrsJVOVsJAUOoAOM"
    
    const headers = {
        "Content-Type": "application/json"
    }

    // Contructing query base on documentations with a template prompt
    const query = {
        "contents": [{
          "parts": [{
            "text": `You are hosting a street corner stoop sale and you assign witty jokes with less than 100 words for items and say it in one neat line and in complete plain text for each item. Make a funny joke in a way that makes the item more appealing no matter the condition for ${items.join(', ')}`
          }],
        }],
        "safetySettings": [
              {
                  "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                  "threshold": "BLOCK_NONE"
              },
              {
                  "category": "HARM_CATEGORY_HARASSMENT",
                  "threshold": "BLOCK_NONE"
              },
              {
                  "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                  "threshold": "BLOCK_NONE"
              },
              {
                  "category": "HARM_CATEGORY_HATE_SPEECH",
                  "threshold": "BLOCK_NONE"
              }
        ],
    }

    // Send the post request using wix-fetch
    try {
        const response = await fetch(url, { 
            method: "POST",
            headers: headers,
            body: JSON.stringify(query)
        })

        if (!response.ok) throw response.statusText

        const result = await response.json()
        return result.candidates[0].content.parts[0].text.split('\n');
    } catch (e) {
        console.log(e);
        return "";
    }

})