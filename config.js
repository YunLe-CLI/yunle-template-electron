try {
  (function () {
    const fs = require('fs');
    const global = require('global');
    const path = require('path');
    const electron = require('electron');
    const BrowserWindow = electron.remote.BrowserWindow;
    const app = electron.remote.app;
    const electronStorage = app.electronStorage;
    const isElectron = global.isElectron = !!electron;
    global.DESKTOP_SDK = {
      fs,
      electronStorage,
      dev: app.DESKTOP_APP_ENV,
      appUrl: app.DESKTOP_APP_URL,
      require,
      electron,
      autoUpdater: app.autoUpdater,
      recording: require('./libs/recording'),
      upload: require('./libs/upload'),
    };
    const extensions = BrowserWindow.getExtensions();
    if (!('ajhifddimkapgcifgcodmmfdlknahffk' in extensions)) {
      BrowserWindow.addDevToolsExtension(path.join(__dirname, './extensions/desktopCapture'));
    }
    if (!('React Developer Tools' in extensions)) {
      BrowserWindow.addDevToolsExtension(path.join(__dirname, './extensions/react-devtool'));
    }
    if (!('Redux DevTools' in extensions)) {
      BrowserWindow.addDevToolsExtension(path.join(__dirname, './extensions/redux-devtool'));
    }
    if (app.DESKTOP_APP_ENV === 'develop') {
      require('devtron').install();
    }
    console.log('************************************************');
    console.log(`**    Desktop  : ${isElectron} `);
    console.log('************************************************');
  }());
} catch (e) {
  console.log(e);
}
