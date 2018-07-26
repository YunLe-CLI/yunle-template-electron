var _a = require('electron'), ipcRenderer = _a.ipcRenderer, remote = _a.remote, desktopCapturer = _a.desktopCapturer;
var app = remote.app;
var path = require('path');
var fs = require('fs');
var FileSaver = require('file-saver');
var recorder;
var chunks = [];
var audioStream = null;
var audioDesktopStream = null;
var mediaConstraints = {
    audio: false,
    video: {
        mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: 1,
            maxWidth: 1920,
            maxHeight: 1080
        }
    }
};
function prepareFolderForRecords() {
    fs.stat(path.join(app.getPath('userData'), "./records"), function (err, stats) {
        if (err)
            fs.mkdir(path.join(app.getPath('userData'), "./records"), function (err) { if (err)
                throw err; });
    });
}
function captureCameraMedia(mediaOptions, successCallback, errorCallback) {
    navigator.mediaDevices.getUserMedia(mediaOptions).then(successCallback).catch(errorCallback);
}
function onVideoSuccess(stream) {
    recorder = new MediaRecorder(stream);
    recorder.addEventListener('dataavailable', function (event) {
        console.log(event.data, 888);
        chunks.push(event.data);
    });
    if (audioStream) {
        stream.addTrack(audioStream.getAudioTracks()[0]);
    }
    if (audioDesktopStream) {
        stream.addTrack(audioStream.getAudioTracks()[0]);
    }
    recorder.start(3000);
}
function onAudioSuccess(stream) {
    audioStream = stream;
}
function onAudioDesktopSuccess(stream) {
    audioDesktopStream = stream;
}
function download(blob, data) {
    if (data === void 0) { data = {}; }
    var a = document.createElement('a'), url = URL.createObjectURL(blob);
    a.style = 'display: none';
    a.href = url;
    a.download = data.title || 'Capture.webm';
    var info = JSON.stringify(data);
    var reply = ipcRenderer.sendSync('setDownloadPath', info);
    if (reply === 'ok') {
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        chunks = [];
    }
}
function onMediaError(e) {
    console.error('media error', e);
}
function saveToFolder(base64data) {
    var date = new Date().getTime();
    var fileName = 'video' + date + '.txt';
    fs.writeFile(path.join(app.getPath('userData'), "./records/" + fileName), base64data, 'utf8', function (err) {
        if (err)
            throw err;
    });
}
prepareFolderForRecords();
function start(roomName) {
    if (!roomName) {
        console.error('recording error: ', 'not find room name');
        return;
    }
    desktopCapturer.getSources({ types: ['screen'] }, function (error, sources) {
        if (error)
            throw error;
        console.log(sources);
        captureCameraMedia({
            audio: true,
            video: false,
        }, onAudioSuccess, onMediaError);
    });
    desktopCapturer.getSources({ types: ['window', 'screen'] }, function (error, sources) {
        if (error)
            throw error;
        captureCameraMedia({
            audio: {
                mandatory: {
                    chromeMediaSource: 'desktop'
                }
            },
            video: false,
        }, onAudioDesktopSuccess, function (e) { return console.error('onAudioDesktopErr', e); });
    });
    desktopCapturer.getSources({ types: ['window'] }, function (error, sources) {
        if (error)
            throw error;
        console.log(sources);
        for (var i = 0; i < sources.length; ++i) {
            if (sources[i].name === (roomName || '房间')) {
                mediaConstraints = {
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: sources[i].id,
                            maxWidth: 1920,
                            maxHeight: 1080
                        },
                    }
                };
                captureCameraMedia(mediaConstraints, onVideoSuccess, onMediaError);
                return;
            }
        }
    });
}
function stop(data) {
    if (data === void 0) { data = {}; }
    if (recorder) {
        recorder.stop();
        console.log(chunks, 1111);
        setTimeout(function () {
            download(new Blob(chunks, { type: 'video/webm' }), data);
        }, 3000);
    }
}
// captureCameraMedia(mediaConstraints, onMediaSuccess, onMediaError);
exports.start = start;
exports.stop = stop;
