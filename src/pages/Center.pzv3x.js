// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixWindowFrontend, { lightbox } from 'wix-window-frontend';

$w.onReady(function () {

	// Envelop animation close after 4s
	$w('#html1').onMessage((e) => {
		console.log(e)
		setTimeout(() => {
			wixWindowFrontend.lightbox.close()
		}, 4000)
	})

	// Write your Javascript code here using the Velo framework API

	// Print hello world:
	// console.log("Hello world!");

	// Call functions on page elements, e.g.:
	// $w("#button1").label = "Click me!";

	// Click "Run", or Preview your site, to execute your code

});