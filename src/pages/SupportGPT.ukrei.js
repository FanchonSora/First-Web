
import { chatRecommend } from "backend/geminiRecommendation.web.js";
import wixAnimations from "wix-animations"
import wixLocationFrontend from 'wix-location-frontend'

// A map of items in inventory
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


$w.onReady(async function () {
    // Input submit handler
    const submitText = async () => {
        console.log($w('#textBox1').value);

        // Get the response from the chat input
        const result = await chatRecommend($w('#textBox1').value);
   
        // Display results with bullet points
        $w('#text8').text = result.response + "\n";
    
        console.log(result)
        
        result.items.forEach((item) => {
            $w('#text8').text += `\n•   ${itemMap[item.Item_name]} at ${item.Price}$: ${item.Reason}`
    
        })

    }

    // Submit the text on enter, reset the text field
    $w('#textBox1').onKeyPress((e) => {
        if (e.key == "Enter") {
            submitText()
            $w('#textBox1').value = ""
        }
    })

    // Redirect button
    $w('#button2').onClick(() => {
        wixLocationFrontend.to('/home')
    })
}); 