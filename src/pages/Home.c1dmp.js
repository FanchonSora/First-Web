// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import { getCurrentGeolocation } from 'wix-window-frontend';
import wixAnimations from "wix-animations"
import wixLocation from 'wix-location';
import wixWindow from 'wix-window'; 
import wixLocationFrontend from 'wix-location-frontend'

const [lat1, lon1] = [40.679582, -73.997341];

// Update time counter
const updateTime = (timeLeft) => {
        animateTextUpdate($w('#text5'), `${timeLeft.days}`)
        animateTextUpdate($w('#text6'), `${timeLeft.hours}`)
        animateTextUpdate($w('#text7'), `${timeLeft.minutes}`)
        animateTextUpdate($w('#text8'), `${timeLeft.seconds}`)
} 

// wixAnimation for text values update
export function animateTextUpdate(textElement, newText, duration = 500) {
        // Fade out current text
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

// Find distance using coordinates
const distanceFromLocation = (lat, lon) => {
        const R = 6371e3; // metres
        const phi1 = lat1 * Math.PI/180; // φ, λ in radians
        const phi2 = lat * Math.PI/180;
        const deltaphi = (lat1-lat) * Math.PI/180;
        const deltalambda = (lon1-lon) * Math.PI/180;

        const a = Math.sin(deltaphi/2) * Math.sin(deltaphi/2) +
                        Math.cos(phi1) * Math.cos(phi2) *
                        Math.sin(deltalambda/2) * Math.sin(deltalambda/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return (R * c / 1000).toFixed();
}

// Get timezone from computer's settings
function getUserTimezone() {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log(`Your timezone is: ${timezone}`);
        return timezone;
}

    
$w.onReady(async function () {

        // Get geolocation
        const location = await getCurrentGeolocation();

        // Redirect buttons
        $w('#button1').onClick(() => {
            wixLocationFrontend.to('/game')
        })

        $w('#supportButton').onClick(() => {
            wixLocationFrontend.to('/supportgpt')
        })
        
        // Initialize an event date and update the counter every second
        const eventDate = new Date("2024-07-20T10:00:00");
        setInterval(() => {
            const now = new Date();
            const difference = eventDate.getTime() - now.getTime();
            
            if (difference > 0) {
                updateTime({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        }, 1000);

        // Update text field with the calculated distance
        $w('#text4').text = `You are ${distanceFromLocation(location.coords.latitude, location.coords.longitude)} km away from the Brooklyn Stoop Sale`;
        
        try {

            // Options to format dates
            const dateOptions = {
                month: "long",
                day: "numeric",
            };

            // Options to format time
            const timeOptions = {
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short"
            };
            

            // EST or event's local time
            // @ts-ignore
            const shortEST = new Intl.DateTimeFormat([], { ...timeOptions, timeZone: "America/New_York" }).format(eventDate);
            // @ts-ignore    
            const dateEST = new Intl.DateTimeFormat([], { ...dateOptions, timeZone: "America/New_York" }).format(eventDate);
            
            // User's local time for the event
            const timeZone = getUserTimezone();
            // @ts-ignore
            const shortUser = new Intl.DateTimeFormat([], { ...timeOptions, timeZone: timeZone }).format(eventDate);
            // @ts-ignore
            const dateUser = new Intl.DateTimeFormat([], { ...dateOptions, timeZone: timeZone }).format(eventDate);
            
            const timeElem = $w("#text14")
            const dateElem = $w("#text20")

            // Change back and forth between user's time and est
            setInterval(() => {
                animateTextUpdate(timeElem, timeElem.text == shortEST ? shortUser : shortEST)
                animateTextUpdate(dateElem, dateElem.text == dateEST ? dateUser : dateEST)
            }, 5000)
    
        } catch (error) {
            console.error("Error fetching geolocation:", error);
        }
        
	
        // Share URL button (save to clipboard)
        $w('#shareButton').onClick(() => {
            let pageURL = wixLocation.url;
            wixWindow.copyToClipboard(pageURL).then(() => {
                $w('#shareButton').label = 'URL copied';

                setTimeout(() => {
                        $w('#shareButton').label = 'Copy page URL';
                }, 3500);
            })
        });
        
});