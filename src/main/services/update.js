import { autoUpdater } from "electron-updater"
import is from 'electron-is';


export function appUpdater(opts) {
    if (is.dev()) {
        autoUpdater.logger = require("electron-log")
        autoUpdater.logger.transports.file.level = "info"
    }
    autoUpdater.on('checking-for-update', () => {
        console.log('Checking for update...');
    })
    autoUpdater.on('update-available', (info) => {
        console.log('Update available.');
    })
    autoUpdater.on('update-not-available', (info) => {
        console.log('Update not available.');
    })
    autoUpdater.on('error', (err) => {
        console.log('Error in auto-updater. ' + err);
    })
    autoUpdater.on('download-progress', (progressObj) => {
        let log_message = "Download speed: " + progressObj.bytesPerSecond;
        log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
        log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        console.log(log_message);
    })
    autoUpdater.on('update-downloaded', (info) => {
        console.log('Update downloaded');
        autoUpdater.quitAndInstall();
    });
}

export function checkForUpdatesAndNotify() {
    autoUpdater.checkForUpdatesAndNotify()
}

export function quitAndInstall() {
    autoUpdater.quitAndInstall();
}