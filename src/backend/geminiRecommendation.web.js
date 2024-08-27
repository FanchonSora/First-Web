import { fetch } from "wix-fetch";
// @ts-ignore
import { Permissions, webMethod } from "wix-web-module";


// A map of all items in inventory
const itemMap = {
    "t-shirt": "👕",
    "jeans": "👖",
    "dress": "👗",
    "woman's shirt": "👚",
    "purse": "👛",
    "handbag": "👜",
    "clutch bag": "👝",
    "man's shoe": "👞",
    "running shoe": "👟",
    "high-heeled shoe": "👠",
    "woman's sandal": "👡",
    "woman's boot": "👢",
    "crown": "👑",
    "woman's hat": "👒",
    "top hat": "🎩",
    "graduation cap": "🎓",
    "billed cap": "🧢",
    "rescue worker's helmet": "⛑️",
    "prayer beads": "📿",
    "lipstick": "💄",
    "ring": "💍",
    "gem stone": "💎",
    "speaker": "🔉",
    "loudspeaker": "📢",
    "megaphone": "📣",
    "postal horn": "📯",
    "bell": "🔔",
    "studio microphone": "🎙️",
    "level slider": "🎚️",
    "control knobs": "🎛️",
    "microphone": "🎤",
    "headphone": "🎧",
    "radio": "📻",
    "saxophone": "🎷",
    "guitar": "🎸",
    "musical keyboard": "🎹",
    "trumpet": "🎺",
    "violin": "🎻",
    "drum": "🥁",
    "mobile phone": "📱",
    "laptop": "💻",
    "desktop computer": "🖥️"
}

// Create a recommendation, and pricing function base on the user's input
export const chatRecommend = webMethod(Permissions.Anyone, async ( input ) => {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDDatH8QOT5L0pXVMpsrsJVOVsJAUOoAOM"
    
    const headers = {
        "Content-Type": "application/json"
    }

    // Sending a query with a template engine, with the mime type specified as JSON, ensuring the response will follow the given schema
    const query = {
        "contents": [{
            "parts": [{
              "text": `You are hosting a street corner stoop sale and you are recommending items from the inventory to the user base on their budget. These are all the avaialable items in your inventory: ${Object.keys(itemMap).join(', ')}. The user's preference is ${input}. Output the top 5 best items for the user using this schema (make sure the item_name field is EXACTLY the same as the input):
                Item = {
                  'Item_name': str,
                  'Reason': str,
                  'Price': int,
                }
                Return a json of {
                    items: Item[],
                    response: str, (your response for the input)
                }
                `
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
          "generationConfig": {
            "response_mime_type": "application/json"
          }
      }
    
    // Send the request with wix-fetch
    try {
        const response = await fetch(url, { 
            method: "POST",
            headers: headers,
            body: JSON.stringify(query)
        })

        if (!response.ok) throw response.statusText

        const result = await response.json()
        return JSON.parse(result.candidates[0].content.parts[0].text);
    } catch (e) {
        console.log(e);
        return "";
    }
})