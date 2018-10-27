import is from 'electron-is';
import { create, getPath } from './window';
import download from '../utils/StreamDownload';
import { appUpdater, checkForUpdatesAndNotify } from './update';

export function init() {
  const win = create({ width: 800, height: 600 });
  win.loadURL(getPath());

  // 调用下载
  // download.downloadFile("https://class100-ppt.oss-cn-shanghai.aliyuncs.com/TESTDD/ui/teaching/latest/build.zip", "./", (arg, percentage) => {
  //   if (arg === "progress") {
  //     console.log(111111, percentage)
  //     // 显示进度
  //   } else if (arg === "finished") {
  //     // 通知完成
  //   }
  // })

  // 调用自动下载
  appUpdater()
    setTimeout(() => {
        checkForUpdatesAndNotify()
    }, 3000)

}