import { autoUpdater } from "electron-updater"


export function appUpdater() {
    // autoUpdater.logger = require("electron-log")
    // autoUpdater.logger.transports.file.level = "info"
    autoUpdater.on('checking-for-update', () => {
        console.log('检查更新...');
    })
    autoUpdater.on('update-available', (info: any) => {
        console.log('更新可用.');
    })
    autoUpdater.on('update-not-available', (info: any) => {
        console.log('更新没有.');
    })
    autoUpdater.on('error', (err: string) => {
        console.log('自动更新错误. ' + err);
    })
    autoUpdater.on('download-progress', (progressObj: { bytesPerSecond: string; percent: string; transferred: string; total: string; }) => {
        let log_message = "下载速度: " + progressObj.bytesPerSecond;
        log_message = log_message + ' - 已下载 ' + progressObj.percent + '%';
        log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        console.log(log_message);
    })
    autoUpdater.on('update-downloaded', (info: any) => {
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