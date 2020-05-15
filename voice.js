var isLocked = false;

function runCommand(message, command) {
    switch (command) {
        case "p":
        case "play":
            playTest(message);
            break;
        case "s":
        case "stop":
            stop(message);
            break;
    }
}

function playTest(message) {
    if (!isLocked) {
        isLocked = true;
        var voiceChannel = message.member.voice.channel;
        if (typeof voiceChannel !== 'undefined') {
            voiceChannel.join().then(connection => {
                const dispatcher = connection
                    .play('./audio/ds1.mp3', {volume: 0.25})
                    .on('start', () => { console.log('play!') })
                    .on('end', end => {voiceChannel.leave(); isLocked = false;});
            }).catch(err => console.log(err));
        }
    }
}

function stop(message) {
    if (isLocked) {
        var voiceChannel = message.member.voice.channel;
        if (typeof voiceChannel !== 'undefined') {
            voiceChannel.leave();
            isLocked = false;
        }
    }
}

module.exports.runCommand = runCommand;