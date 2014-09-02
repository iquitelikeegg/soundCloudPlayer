jQuery(document).ready(function($) {

window.soundCloudPlayer = function() {
    var $element;
    var id;
    var scWidget;
    var url;
    var SDK;
    var options;
    var tracks = [];
    var playing = {
        trackNumber : 0,
        title : '',
        duration : 0,
        position : 0,
        sound : {}
    };
    var user = {
        id : '',
        uri : ''
    };

    var getStyles = function() {
        return '<link href="' + options.libraryPath + 'soundCloudPlayer-1.0/soundCloudPlayer.css" media="screen, projection" rel="stylesheet" type="text/css" />';
    };

    var generateButtons = function() {
        var buttons = {};

        buttons.play = $('<div />', {
            class : 'control play'
        }).html('<span class="legend"></span>');

        buttons.rewind = $('<div />', {
            class : 'control rewind'
        }).html('<span class="legend"></span><span class="legend"></span>');

        buttons.fastforward = $('<div />', {
            class : 'control fastforward'
        }).html('<span class="legend"></span><span class="legend"></span>');

        return buttons;
    };

    var generatePlayer = function() {
        return $('<div />', {
            class : 'player'
        }).html('<a href="' + options.userUrl + '" class="song-name"></a><span class="progress-bar"><span class="indicator"></span></span>');
    };

    var updateIndicator = function(reset) {
        if (reset === false) {
            var progress = (playing.position / playing.duration) * 100;
        } else {
            var progress = 0;
        }

        $element.find('.player > .progress-bar > .indicator').css('left', progress + '%');
    };

    var setSongTitle = function(name) {
        playing.title = name;

        $element.find('.player > .song-name').html(playing.title);
    };

    var setSongPosition = function() {
        playing.position = playing.sound.position;
    };

    var loadSong = function(trackNumber, callback) {
        SDK.stream(tracks[trackNumber].stream_url, {}, function(sound) {
            playing.sound = sound;

            setSongTitle(tracks[trackNumber].title);
            playing.trackNumber = trackNumber;
            playing.duration    = tracks[trackNumber].duration;
            playing.position    = 0;

            if (callback instanceof Function) {
                callback();
            }
        });
    };

    var play = function() {
        if (playing.position) {
            playing.sound.setPosition(playing.position);
        }

        playing.sound.play();
        $element.addClass('playing');

        playing.timer = setInterval(function() {
            setSongPosition();

            updateIndicator(false);
        }, 800);
    };

    var pause = function() {
        $element.removeClass('playing');
        playing.sound.pause();

        clearInterval(playing.timer);
    };

    var rewind = function() {
        var isPlaying = false;

        if (playing.sound.playState && !playing.sound.paused) {
            playing.sound.stop();
            isPlaying = true;
        }

        var prevTrack = playing.trackNumber - 1;
        if (prevTrack < 0) {
            // Loop to final track.
            prevTrack = tracks.length - 1;
        }

        loadSong(prevTrack, function() {
            if (isPlaying) {
                playing.sound.play();
            }
        });

        updateIndicator(true);
    };

    var fastforward = function() {
        var isPlaying = false;

        if (playing.sound.playState && !playing.sound.paused) {
            playing.sound.stop();
            isPlaying = true;
        }

        var nextTrack = playing.trackNumber + 1;
        if (nextTrack > (tracks.length - 1)) {
            // Loop back to start.
            nextTrack = 0;
        }

        loadSong(nextTrack, function() {
            if (isPlaying) {
                playing.sound.play();
            }
        });

        updateIndicator(true);
    };

    var seek = function(event) {
        // Only works on loaded sound data.
        if (playing.sound.loaded === false) {
            return false;
        }

        var mouse = {
            x : event.clientX,
            y : event.clientY
        };

        var progressBar = $element.find('.player > .progress-bar');

        var position = ((mouse.x - progressBar.offset().left) / progressBar.width()) * 100;
        var positionMilliseconds = Math.round(playing.duration * (position / 100));

        playing.sound.setPosition(positionMilliseconds);
        playing.position = positionMilliseconds;

        updateIndicator(false);
    };

    var attachClickHandlers = function() {
        $element.find('.control.play').on('click', function() {
            if (!$element.hasClass('playing')) {
                play();
            } else {
                pause();
            }
        });

        $element.find('.control.rewind').on('click', rewind);

        $element.find('.control.fastforward').on('click', fastforward);

        $element.find('.player > .progress-bar').on('click', seek);
    };


    var init = function(elementId, SC_SDK, settings) {
        id       = elementId;
        $element = $('#' + id);
        SDK      = SC_SDK;
        options  = settings;

        var buttons = generateButtons();
        $element.append(
            getStyles(),
            buttons.rewind,
            buttons.play,
            buttons.fastforward,
            generatePlayer()
        );

        //Get band data for widget.
        SDK.get('https://api.soundcloud.com/resolve.json?url=' + options.userUrl, function(data) {
            user.id  = data.id;
            user.uri = data.uri;

            SDK.get(user.uri + '/tracks', function(sounds) {
               tracks = sounds;
            });
        });

        setTimeout(
            function() {
                attachClickHandlers();

                loadSong(playing.trackNumber, false);
            },
            2000
        );
    };

    return {
        'init' : init,
        'setSongTitle' : setSongTitle,
        'playing' : playing
    };
}();
});
