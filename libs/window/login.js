"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron = require("electron");
var path = require("path");
var BrowserWindow = electron.BrowserWindow;
var preload = path.join(__dirname, '../../config.js');
var app = electron.app;
function createLogin(url) {
	var config = {
		width: 580,
		height: 430,
	};
	var mainWindow = new BrowserWindow({
		title: 'YunLe AI',
		// frame: false,
		// transparent: true,
		titleBarStyle: 'hiddenInset',
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
	mainWindow.on('close', (event) => {
		app.quit();
		if (app['APPICON_TOP']) {
			app['APPICON_TOP'].destroy();
		}
	});
	if (app['DESKTOP_APP_ENV'] === 'develop') {
		mainWindow.loadURL('http://localhost:8000/Login');
	} else {
		global.LOADURL(mainWindow);
		mainWindow.loadURL('app://-/Login/');
	}
	return mainWindow;
}
exports.default = createLogin;
