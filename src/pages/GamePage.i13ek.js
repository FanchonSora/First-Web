
import { jokeGenerator } from "backend/geminiJokeGenerator.web.js";
import wixAnimations from "wix-animations"
import wixLocationFrontend from 'wix-location-frontend'
import wixWindowFrontend from 'wix-window-frontend'
import { showAlert } from "wix-mobile";


// wixAnimation for text values update
function animateTextUpdate(textElement, newText, duration = 500) {
    if (textElement.text == newText) return;

    wixAnimations.timeline()
        .add(textElement, {
            duration: duration / 2,
            opacity: 0
        })
        .play()
        .onComplete(() => {
            // Update text content
            textElement.text = newText;
            
            // Fade in new text
            wixAnimations.timeline()
                .add(textElement, {
                    duration: duration / 2,
                    opacity: 1
                })
                .play();
        });
}


// A map of the inventory
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

    // Get all the different items/keys in the inventory
    const keySet = Object.keys(itemMap);
    const appeared = new Set();

    // Redirect button
    $w('#button2').onClick(() => {
        wixLocationFrontend.to('/home')
    })

    // Pick out 10 random unique item index for the hidden object game
    do {
        const randomIndex = Math.floor(Math.random() * keySet.length);
        appeared.add(randomIndex);
    } while (appeared.size < 10)
    
    let index = 0;

    // @ts-ignore
    let playingList = $w("#item1, #item2, #item3, #item4, #item5, #item6, #item7, #item8, #item9, #item10")

    // Iterate through the 10 values and update the item text elements accordingly while adding the item name to an array
    const desc = []
    appeared.forEach((key) => {
        animateTextUpdate(playingList[index], itemMap[keySet[key]])
        desc.push(keySet[key])

        index++;
    })
    
    // Generate 10 descriptions for the array
    const genai = await jokeGenerator(desc);

    // Variables of WixElement to display the game progress
    const bubble = $w('#bubble')
    const cart = $w('#cart')

    // Timeout object declaration
    let bubbleTimeout;
    
    // Hint button that makes all items glow on hover
    $w('#button1').onMouseIn(() => {
        playingList.forEach(element => {
            element.customClassList.add('glow')
        })
    })
    $w('#button1').onMouseOut(() => {
        playingList.forEach(element => {
            element.customClassList.remove('glow')
        })
    })

    // Keep track of the found items
    let found = 0;

    // For each item element assign onClick
    genai.forEach( (message, index) => {

        playingList[index].onClick(async () => {
            
            // Increment found when an element is clicked
            found++;

            // Check if there's a previous timeout then clear
            if (bubbleTimeout) clearTimeout(bubbleTimeout)

            // Remove the default hidden styling
            playingList[index].customClassList.remove('item')
            
            // Add the current element to the cart
            cart.text += `\n${itemMap[desc[index]]} : ${desc[index]}`

            // Display the funny description of the item
            bubble.text = message;
            bubble.customClassList.remove('hide')

            // Hide the description bubble after 5s unless the timeout is cleared 
            bubbleTimeout = setTimeout(() => {
                bubble.customClassList.add("hide")
            }, 5000)

            // Hide the element after 5s
            setTimeout(() => {
                console.log("hide " + playingList[index].text)
                playingList[index].customClassList.add("hide")
            }, 5000)

            // Prompt the winning popup if all elements are found
            if (found == 10) {
                wixWindowFrontend.openLightbox("GameWin")
            }
        })
    })
});