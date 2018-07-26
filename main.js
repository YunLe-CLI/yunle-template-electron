"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron = require("electron");
var global = require("global");
var moment = require("moment");
var electron_log_1 = require("electron-log");
var serve = require('electron-serve');
var electron_updater_1 = require("electron-updater");
var createMenu = require('./libs/menu').createMenu;
var loading_1 = require("./libs/window/loading");
var login_1 = require("./libs/window/login");
var main_1 = require("./libs/window/main");
var update_1 = require("./libs/window/update");
var path = require("path");
var app = electron.app, ipcMain = electron.ipcMain, dialog = electron.dialog, Menu = electron.Menu, Tray = electron.Tray;
var loadURL = app['LOADURL'] = global.LOADURL = serve({ directory: path.join(__dirname, '/app') });
var ipcMainUpSend = null;
app['DESKTOP_APP_ENV'] = 'production';
process.argv.map(function (item) {
    if (item === '--DESKTOP_APP_ENV=develop') {
        app['DESKTOP_APP_ENV'] = 'develop';
    }
});
app['electronStorage'] = require('redux-persist-electron-storage').default({
    electronStoreOpts: {
        name: 'DESKTOP_STORE_DB',
    }
});
var autoUpdater = app['autoUpdater'] = electron_updater_1.autoUpdater;
electron_updater_1.autoUpdater.logger = electron_log_1.default;
autoUpdater.logger.transports.file.level = 'info';
electron_log_1.default.info('   ');
electron_log_1.default.info('   ');
electron_log_1.default.info('   ');
electron_log_1.default.info("=======================   App starting [ " + app['DESKTOP_APP_ENV'] + " ]   =======================");
electron_log_1.default.info('   ');
electron_log_1.default.info('start time: ', moment().format('X'));
electron_log_1.default.info('   ');
process.argv.map(function (item) {
    if (item === '--DESKTOP_APP_ENV=develop') {
        app['DESKTOP_APP_ENV'] = 'develop';
    }
});
createMenu({ electron: electron });
// var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
//     if (mainWindow) {
//         if (mainWindow.isMinimized())
//             mainWindow.restore();
//         mainWindow.focus();
//     }
// });
// 设置URL协议
app.setAsDefaultProtocolClient('yunle-ai-app');
// if (shouldQuit) {
//     app.quit();
//     process.exit(0);
// }

var loadingWindow;
var loginWindow;
var mainWindow;
var updateWindow;
function bindEvent() {
    // 打开loading
    ipcMain.on('window-Loading-open', function (event, arg) {
	    if (!loadingWindow) {
		    loadingWindow = loading_1.default();
	    } else {
		    loadingWindow.show();
		    loadingWindow.focus();
      }
	    event.returnValue = 'pong';
    });
    // 打开主应用
    ipcMain.on('window-Main-open', function (event, arg) {
          if (!mainWindow) {
            mainWindow = main_1.default();
          } else {
            mainWindow.show();
            mainWindow.focus();
          }
        event.returnValue = 'pong';
    });
    // 打开登录
    ipcMain.on('window-Login-open', function (event, arg) {
	    if (!loginWindow) {
		    loginWindow = login_1.default();
	    } else {
		    loginWindow.show();
		    loginWindow.focus();
	    }
        event.returnValue = 'pong';
    });
    // 打开更新
    ipcMain.on('window-Update-open', function (event, arg) {
      if (!updateWindow) {
        updateWindow = update_1.default();
      } else {
        updateWindow.show();
        updateWindow.focus();
      }
        event.returnValue = 'pong';
    });
    // 关闭loading
    ipcMain.on('window-Loading-close', function (event, arg) {
        if (loadingWindow) {
            loadingWindow.destroy();
            loadingWindow = null;
        }
        event.returnValue = 'pong';
    });
    // 关闭主应用
    ipcMain.on('window-Main-close', function (event, arg) {
        if (mainWindow) {
            mainWindow.destroy();
            mainWindow = null;
        }
        event.returnValue = 'pong';
    });
    // 关闭登录
    ipcMain.on('window-Login-close', function (event, arg) {
        if (loginWindow) {
            console.log(loginWindow.destroy)
            loginWindow.destroy();
            loginWindow = null;
        }
        event.returnValue = 'pong';
    });
    // 关闭更新
    ipcMain.on('window-Update-close', function (event, arg) {
        if (updateWindow) {
            updateWindow.destroy();
            updateWindow = null;
        }
        event.returnValue = 'pong';
    });
}
app.on('ready', function () {
    bindEvent();
    var iconName = process.platform === 'win32' ? './public/windows_icon/favicon-16.png' : './public/macos_icon/favicon-16.png';
    var iconPath = path.join(__dirname, iconName);
    var appIcon = app['APPICON_TOP'] = new Tray(iconPath);
    var contextMenu = Menu.buildFromTemplate([
        {
            label: '设置',
            click: function () {
                // event.sender.send('tray-removed')
                // app.quit();
                // if (appIcon) appIcon.destroy();
            }
        },
        {
            label: '退出',
            click: function () {
                // event.sender.send('tray-removed')
                app.quit();
                if (appIcon)
                    appIcon.destroy();
            }
        },
    ]);
    appIcon.setToolTip('YunLe.AI');
    appIcon.setContextMenu(contextMenu);
    appIcon.on('click', function () {
        console.log(111);
    });
    loadingWindow = loading_1.default();
		updateHandle()
});
app.on('will-quit', function () {
    // app.quit();
    // if (appIcon) appIcon.destroy();
    electron_log_1.default.info('   ');
    electron_log_1.default.info('close time: ', moment().format('X'));
    electron_log_1.default.info('   ');
    electron_log_1.default.info('=======================   App close   =======================');
    electron_log_1.default.info('   ');
});
app.on('activate', function () {
    if (mainWindow) {
        mainWindow.focus();
        // createWindow();
    }
    if (updateWindow) {
        updateWindow.focus();
        // createWindow();
    }
    if (loginWindow) {
        loginWindow.focus();
        // createWindow();
    }
    if (loginWindow) {
        loadingWindow.focus();
        // createWindow();
    }
});
app.on('certificate-error', function (event, webContents, url, error, certificate, callback) {
    event.preventDefault();
    callback(true);
});
app.on('gpu-process-crashed', function (event, killed) {
    console.log(event, killed);
});


function updateHandle() {
	var _IP_ = {
		updateFeed_darwin: "http://oss.hexiao-o.com/desktop/",
		updateFeed_wine: "http://oss.hexiao-o.com/desktop/",
	};
	ipcMain.on('ipcMain-update', function (event, arg) {
		ipcMainUpSend = function (type, data) {
			try {
				event.sender.send(type, data);
			}
			catch (e) {
				electron_log_1.default.error('ipcMain-update: ', e);
			}
		};
	});
	var updateFeed = _IP_.updateFeed_wine;
	if (process.platform === 'darwin') {
		updateFeed = _IP_.updateFeed_darwin;
	}
	if (process.platform === 'win32') {
		updateFeed = _IP_.updateFeed_wine;
	}
	var squirrelCommand = process.argv[1];
	if (squirrelCommand === '--squirrel-updated')
		return;
	if (squirrelCommand === '--squirrel-install')
		return;
	electron_updater_1.autoUpdater.on('checking-for-update', function () {
		if (loadingWindow) {
			loadingWindow.webContents.send('check-for-update-cb');
		}
		if (loginWindow) {
			loginWindow.webContents.send('check-for-update-cb');
		}
		if (mainWindow) {
			mainWindow.webContents.send('check-for-update-cb');
		}
		if (updateWindow) {
			updateWindow.webContents.send('check-for-update-cb');
		}
		electron_log_1.default.info('check-for-update');
		if (ipcMainUpSend) {
			ipcMainUpSend('check-for-update-cb');
		}
	});
	electron_updater_1.autoUpdater.on('update-available', function () {
		if (loadingWindow) {
			loadingWindow.webContents.send('update-available-cb');
		}
		if (loginWindow) {
			loginWindow.webContents.send('update-available-cb');
		}
		if (mainWindow) {
			mainWindow.webContents.send('update-available-cb');
		}
		if (updateWindow) {
			updateWindow.webContents.send('update-available-cb');
		}
		electron_log_1.default.info('update-available');
		if (ipcMainUpSend) {
			ipcMainUpSend('update-available-cb');
		}
	});
	electron_updater_1.autoUpdater.on('update-not-available', function () {
		if (loadingWindow) {
			loadingWindow.webContents.send('update-not-available-cb');
		}
		if (loginWindow) {
			loginWindow.webContents.send('update-not-available-cb');
		}
		if (mainWindow) {
			mainWindow.webContents.send('update-not-available-cb');
		}
		if (updateWindow) {
			updateWindow.webContents.send('update-not-available-cb');
		}
		electron_log_1.default.info('update-not-available');
		if (ipcMainUpSend) {
			ipcMainUpSend('update-not-available-cb');
		}
	});
	electron_updater_1.autoUpdater.on('download-progress', function (progress) {
		if (loadingWindow) {
			loadingWindow.webContents.send('download-progress-cb', progress);
		}
		if (loginWindow) {
			loginWindow.webContents.send('download-progress-cb', progress);
		}
		if (mainWindow) {
			mainWindow.webContents.send('download-progress-cb', progress);
		}
		if (updateWindow) {
			updateWindow.webContents.send('download-progress-cb', progress);
		}
		electron_log_1.default.info('download-progress', progress);
		if (ipcMainUpSend) {
			ipcMainUpSend('download-progress-cb', progress);
		}
	});
	electron_updater_1.autoUpdater.on('update-downloaded', function (e, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
		if (loadingWindow) {
			loadingWindow.webContents.send('update-downloaded-cb', { releaseNotes: releaseNotes, releaseName: releaseName, releaseDate: releaseDate, updateUrl: updateUrl, quitAndUpdate: quitAndUpdate });
		}
		if (loginWindow) {
			loginWindow.webContents.send('update-downloaded-cb', { releaseNotes: releaseNotes, releaseName: releaseName, releaseDate: releaseDate, updateUrl: updateUrl, quitAndUpdate: quitAndUpdate });
		}
		if (mainWindow) {
			mainWindow.webContents.send('update-downloaded-cb', { releaseNotes: releaseNotes, releaseName: releaseName, releaseDate: releaseDate, updateUrl: updateUrl, quitAndUpdate: quitAndUpdate });
		}
		if (updateWindow) {
			updateWindow.webContents.send('update-downloaded-cb', { releaseNotes: releaseNotes, releaseName: releaseName, releaseDate: releaseDate, updateUrl: updateUrl, quitAndUpdate: quitAndUpdate });
		}
		electron_log_1.default.info('update-downloaded');
		if (ipcMainUpSend) {
			ipcMainUpSend('update-downloaded-cb', { releaseNotes: releaseNotes, releaseName: releaseName, releaseDate: releaseDate, updateUrl: updateUrl, quitAndUpdate: quitAndUpdate });
			ipcMainUpSend = null;
		}
	});
	electron_updater_1.autoUpdater.on('error', function (e, data) {
		electron_log_1.default.error('update-error', e, data);
		if (data) {
			if (loadingWindow) {
				loadingWindow.webContents.send('check-for-error-cb', data, e);
			}
			if (loginWindow) {
				loginWindow.webContents.send('check-for-error-cb', data, e);
			}
			if (mainWindow) {
				mainWindow.webContents.send('check-for-error-cb', data, e);
			}
			if (updateWindow) {
				updateWindow.webContents.send('check-for-error-cb', data, e);
			}
			if (ipcMainUpSend) {
				ipcMainUpSend('check-for-error-cb', e, data);
			}
			ipcMainUpSend = null;
		}
	});
	electron_updater_1.autoUpdater.setFeedURL(updateFeed);
	// autoUpdater.checkForUpdates();
}
