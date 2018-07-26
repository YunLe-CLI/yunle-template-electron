try {
    (function () {
        var fs = require('fs');
        var global = require('global');
        var path = require('path');
        var electron = require('electron');
        var BrowserWindow = electron.remote.BrowserWindow;
        var app = electron.remote.app;
        var electronStorage = app.electronStorage;
        var isElectron = global.isElectron = !!electron;
        global.DESKTOP_SDK = {
            fs: fs,
            electronStorage: electronStorage,
            dev: app['DESKTOP_APP_ENV'],
            appUrl: app['DESKTOP_APP_URL'],
            require: require,
            electron: electron,
            autoUpdater: app['autoUpdater'],
            recording: require('./libs/recording'),
            upload: require('./libs/upload'),
        };
        var extensions = BrowserWindow.getExtensions();
        if (!('ajhifddimkapgcifgcodmmfdlknahffk' in extensions)) {
            BrowserWindow.addDevToolsExtension(path.join(__dirname, './extensions/desktopCapture'));
        }
        if (!('React Developer Tools' in extensions)) {
            BrowserWindow.addDevToolsExtension(path.join(__dirname, './extensions/react-devtool'));
        }
        if (!('Redux DevTools' in extensions)) {
            BrowserWindow.addDevToolsExtension(path.join(__dirname, './extensions/redux-devtool'));
        }
        if (app['DESKTOP_APP_ENV'] === 'develop') {
            require('devtron').install();
        }
        console.log('************************************************');
        console.log("**    Desktop  : " + isElectron + " ");
        console.log('************************************************');
    })();
}
catch (e) {
    console.log(e);
}
