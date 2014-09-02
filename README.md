A soundcloud player based on the soundcloud Javascript API. 

=== NOTE ===

You'll need to include the soundcloud javascript API for this repo to function!

Include this line before you initialise the player.

"&lt;script src="https://connect.soundcloud.com/sdk.js" type="text/javascript"&gt;&lt;/script&gt;" 

You will also need to initialise the soundcloud SDK and pass it to player as a parameter:

SC.initialize({
    client_id : 'XXXXXXXXXXXX'
});

=== initialising the player ===

Firstly, place a div with an id of 'sc-player-controls' where you want the player to be. This will become the soundCloud player.

The player.js file attaches the soundCloudPlayer object as a property of the window object. so to initialise the player use:

window.soundCloudPlayer.init(
    'sc-player-controls', // The id of the element that the player will use.
    SC, // The SoundCloud Javascript SDK
    {
	userUrl : 'XXXX', // The public url of the targetted user.
	libraryPath: 'XXXX/' //The path to the directory where the library folder is stored, leave a trailing slash.
    } 
);

=== TODO ===

Theming! 

More type of Soundcloud endpoints supported.
