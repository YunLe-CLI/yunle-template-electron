"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron = require("electron");
var global = require("global");
var path = require("path");
var moment = require("moment");
var electron_updater_1 = require("electron-updater");
var electron_log_1 = require("electron-log");
var app = electron.app, ipcMain = electron.ipcMain, globalShortcut = electron.globalShortcut, dialog = electron.dialog, Tray = electron.Tray, Menu = electron.Menu;
var BrowserWindow = electron.BrowserWindow;
var preload = app['PRELOAD'] = path.join(__dirname, '../../config.js');
var devIP = 'http://localhost:3001';
var proIP = 'http://oss.hexiao-o.com' || 'https://webrtc.hexiao-o.com';
app['DESKTOP_APP_ENV'] = 'production';
app['autoUpdater'] = electron_updater_1.autoUpdater;
process.argv.map(function (item) {
    if (item === '--DESKTOP_APP_ENV=develop') {
        app['DESKTOP_APP_ENV'] = 'develop';
    }
});
var appURL = app['DESKTOP_APP_URL'] = app['DESKTOP_APP_ENV'] === 'production' ? "file://" + path.join(__dirname, '../../') + "/app/index.html" : devIP;
var _IP_ = {
    url: appURL,
    updateFeed_darwin: proIP + "/desktop/",
    updateFeed_wine: proIP + "/desktop/",
};
function createLogin(url) {
    var setSavePath = null;
    var ipcMainUpSend = null;
    var config = {
        width: 1002,
        height: 680,
    };
    console.log(appURL, 1111);
    ipcMain.on('setDownloadPath', function (event, arg) {
        console.log(arg);
        setSavePath = arg;
        event.returnValue = 'ok';
    });
    var mainWindow = app['MAIN_WINDOW'] = new BrowserWindow({
        title: 'YunLe AI',
        // frame: false,
	      show: false,
        // titleBarStyle: 'hiddenInset',
        minWidth: 900,
        minHeight: 600,
        // resizable: false,
        fullscreen: false,
        fullscreenable: false,
        skipTaskbar: false,
        center: true,
        width: config.width,
        height: config.height,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../../public/windows_icon/icon_win.ico'),
        webPreferences: {
            webSecurity: false,
            allowRunningInsecureContent: true,
            plugins: true,
            preload: preload,
        },
    });
    mainWindow.webContents.session.on('will-download', function (event, item, webContents) {
        // 设置保存路径,使Electron不提示保存对话框。
        var date = moment().format('X');
        var fileName = 'video' + date + '.webm';
        var recordPath = path.join(app.getPath('userData'), "./records/" + fileName);
        if (setSavePath) {
            item.setSavePath(recordPath);
        }
        item.on('updated', function (event, state) {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed');
            }
            else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused');
                }
                else {
                    console.log("Received bytes: " + item.getReceivedBytes());
                }
            }
        });
        item.once('done', function (event, state) {
            if (state === 'completed') {
                console.log('Download successfully');
                if (setSavePath) {
                    var _data = JSON.parse(setSavePath);
                    app['electronStorage']
                        .getItem('RecordLocal')
                        .then(function (list) {
                        if (list === void 0) { list = JSON.stringify([]); }
                        var data = JSON.parse(list);
                        data.push({
                            id: date,
                            cover: _data.cover || 'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
                            title: _data.title || fileName,
	                          roomName: _data.roomName || fileName,
	                          roomId: _data.roomId || '',
                            uID: _data.uID,
	                          uName: _data.uName,
                            time: date,
                            video: recordPath,
                        });
                        app['electronStorage']
                            .setItem('RecordLocal', JSON.stringify(data));
                    });
                }
            }
            else {
                console.log("Download failed: " + state);
            }
            setSavePath = null;
        });
    });
    mainWindow.on('ready-to-show', function () {
        mainWindow.show();
        mainWindow.focus();
    });
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.on('close', function (event) {
        event.preventDefault();
        var options = {
          type: 'info',
          title: '是否关闭应用',
          message: "关闭应用？",
          buttons: ['是', '否']
        };
        dialog.showMessageBox(mainWindow, options, function (index) {
          if (index === 0) {
            mainWindow.destroy();
            app.quit();
            if (app['APPICON_TOP']) {
              app['APPICON_TOP'].destroy();
            }
          }
        });
      });
      if (app['DESKTOP_APP_ENV'] === 'develop') {
        mainWindow.loadURL('http://localhost:8000/Main');
      } else {
	      global.LOADURL(mainWindow);
	      mainWindow.loadURL('app://-/Main/');
      }
    return mainWindow;
}
exports.default = createLogin;
