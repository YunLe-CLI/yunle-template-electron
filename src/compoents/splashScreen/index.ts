import { BrowserWindow, systemPreferences, ipcMain } from 'electron';
import delay from 'delay';
export { default as reportReady } from './report-ready';
export { default as Office } from './templates/office';
export { default as Dolphin } from './templates/dolphin';
export { default as Simple } from './templates/simple';

export interface IProps {
  mainWindow?: any;
  color?: any;
  icon?: any;
  width?: number;
  height?: number;
  url?: any;
  image?: any;
  brand?: any;
  productName?: any;
  logo?: any;
  website?: any;
  text?: any;
  backgroundColor?: string;
}
export const initSplashScreen = ({
  mainWindow,
  color,
  icon,
  width = 600,
  height = 400,
  url,
  image,
  brand,
  productName,
  logo,
  website,
  text,
  backgroundColor
}: IProps) => {
  const col =
    color ||
    (systemPreferences.getAccentColor &&
      `#${systemPreferences.getAccentColor()}`);

  // @ts-ignore
  global['splashScreenImage'] = image || icon;

  const splashScreen = new BrowserWindow({
    width,
    height,
    parent: mainWindow,
    modal: false,
    transparent: false,
    skipTaskbar: true,
    frame: false,
    titleBarStyle: 'customButtonsOnHover',
    autoHideMenuBar: true,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    icon,
    backgroundColor,
    show: false,
  });

  const args = {
    brand: brand,
    productName: productName,
    logo: logo,
    website: website,
    color: col,
    text: text
  };
  if (typeof url === 'function') {
    var file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(url(args));
    splashScreen.loadURL(file);
  } else {
    splashScreen.loadURL(
      url + '#' + Buffer.from(JSON.stringify(args)).toString()
    );
  }
  (async () => {
    await delay(500);
    splashScreen.show();
  })()
  const hide = async () => {
    await delay(500);
    splashScreen.destroy();
    if (mainWindow) {
      mainWindow.show();
    }
  };
  ipcMain.on('ready', hide);
  return hide;
};

export default initSplashScreen;