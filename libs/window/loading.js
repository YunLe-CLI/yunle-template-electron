"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron = require("electron");
var global = require("global");
var path = require("path");
var BrowserWindow = electron.BrowserWindow;
var preload = path.join(__dirname, '../../config.js');
var app = electron.app, ipcMain = electron.ipcMain, globalShortcut = electron.globalShortcut, dialog = electron.dialog, Tray = electron.Tray, Menu = electron.Menu;

function createLogin(url) {
    var config = {
        width: 200,
        height: 200,
    };
    var mainWindow = new BrowserWindow({
        title: 'YunLe AI',
        frame: false,
	      show: false,
        // transparent: true,
        // titleBarStyle: 'hiddenInset',
        resizable: false,
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
    mainWindow.on('ready-to-show', function () {
        mainWindow.show();
        mainWindow.focus();
    });
    if (app['DESKTOP_APP_ENV'] === 'develop') {
	    mainWindow.loadURL('http://localhost:8000/loading');
    } else {
	    global.LOADURL(mainWindow);
	    mainWindow.loadURL('app://-/Loading/');
    }
    return mainWindow;
}
exports.default = createLogin;
