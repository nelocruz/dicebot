const fs = require('fs');

var isLocked = false;
var list = [];
var voiceChannel = undefined;
var voiceConnection = undefined;
var currentTrack = -1;
var currentVolume = 0.2;
var isLooping = false;

function runCommand(message, command) {
    switch (command.split(' ')[0]) {
        case "p":
        case "play":
            playTest(message, command.replace(/[^0-9]/g, ''));
            break;
        case "s":
        case "stop":
            stop(message);
            break;
        case "r":
        case "repeat":
            isLooping = !isLooping;
            break;
        case "l":
        case "list":
            listFiles(message);
            break;
        case "v":
        case "volume":
            setVolume(message, command.replace(/[^0-9]/g, ''));
            break;
    }
}

function playTest(message, position) {
    if (!isLocked) {
        checkList();
        if (typeof position === 'undefined') {
            position = 0;
        }
        currentTrack = position;
        voiceChannel = message.member.voice.channel;
        if (typeof voiceChannel !== 'undefined' && typeof voiceChannel !== 'null') {
            voiceChannel.join().then(connection => {
                playFile(connection);
            }).catch(err => console.log(err));
        }
    }
}
function playFile(connection) {
    isLocked = true;
    var filename = getFromList(currentTrack);
    voiceConnection = connection
        .play('./audio/' + filename, { volume: currentVolume })
        .on('start', () => {
            //console.log('play!');
        })
        .on('finish', () => {
            if (isLooping) {
                playFile(connection);
            } else {
                //console.log('end!');
                voiceConnection = undefined;
                voiceChannel.leave();
                isLocked = false;
            }
        });
}

function setVolume(message, command) {
    if (voiceConnection) {
        currentVolume = command / 10;
        voiceConnection.setVolume(currentVolume);
    }
}

function stop(message) {
    if (isLocked) {
        var voiceChannel = message.member.voice.channel;
        if (typeof voiceChannel !== 'undefined') {
            voiceConnection = undefined;
            voiceChannel.leave();
            isLocked = false;
        }
    }
}

function listFiles(message) {
    checkList();
    var textChannel = message.channel;
    if (typeof textChannel !== 'undefined') {
        var lines = [];
        lines.push('Tracks found:');
        list.forEach((t, index) => {
            lines.push(padStart(index, 3, '0') + ': ' + t);
        });
        textChannel.send(lines.join('\r\n'));
    }
}

function checkList() {
    if (!list || list.length === 0) {
        fs.readdirSync('./audio').forEach((f, index) => {
            list.push(f);
        });
    }
}

function getFromList(position) {
    checkList();
    var index = parseInt(position);
    if (isNaN(index)) {
        index = 0;
    }
    if (list && index < list.length) {
        return list[index];
    }
}

function padStart(val, length, char) {
    var result = '';
    for (var x = 0; x < length; x++) {
        result += char;
    }
    result += val;
    return result.substr(result.length - length);
}

module.exports.runCommand = runCommand;