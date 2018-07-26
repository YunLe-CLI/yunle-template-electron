"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron = require("electron");
var global = require("global");
var path = require("path");
var app = electron.app, ipcMain = electron.ipcMain, globalShortcut = electron.globalShortcut, dialog = electron.dialog, Tray = electron.Tray, Menu = electron.Menu;
var BrowserWindow = electron.BrowserWindow;
var preload = path.join(__dirname, '../../config.js');

function createLogin(url) {
    var mainWindow = new BrowserWindow({
        title: 'YunLe AI',
	      show: false,
        // frame: false,
        // titleBarStyle: 'hiddenInset',
        resizable: false,
        fullscreen: false,
        fullscreenable: false,
        skipTaskbar: false,
        center: true,
		    width: 450,
		    height: 190,
		    minWidth: 450,
		    minHeight: 190,
        autoHideMenuBar: true,
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
	mainWindow.on('close', (event) => {
		app.quit();
		if (app['APPICON_TOP']) {
			app['APPICON_TOP'].destroy();
		}
	});
	if (app['DESKTOP_APP_ENV'] === 'develop') {
		mainWindow.loadURL('http://localhost:8000/Update');
	} else {
		global.LOADURL(mainWindow);
		mainWindow.loadURL('app://-/Update/');
	}
    return mainWindow;
}
exports.default = createLogin;
