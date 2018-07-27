const global = require('global');
const path = require('path');
const electron = require('electron');
const moment = require('moment');
const electronLog = require('electron-log');
const serve = require('electron-serve');
const electronUpdater = require('electron-updater');
const _ = require('lodash');

const { app, BrowserWindow } = electron;

const createMenu = require('./libs/menu').createMenu;

app.DESKTOP_APP_CONFIG = {};
app.DESKTOP_APP_CONFIG.DESKTOP_APP_ENV = 'production';

process.argv.map((item) => {
  if (item === '--DESKTOP_APP_ENV=develop') {
	  app.DESKTOP_APP_CONFIG.DESKTOP_APP_ENV = 'develop';
  }
});

createMenu({ electron });


const autoUpdater = app.DESKTOP_APP_CONFIG.autoUpdater = electronUpdater.autoUpdater;
electronUpdater.autoUpdater.logger = electronLog.default;

autoUpdater.logger.transports.file.level = 'info';
electronLog.info('   ');
electronLog.info('   ');
electronLog.info('   ');
electronLog.info(`=======================   App starting [ ${app.DESKTOP_APP_ENV} ]   =======================`);
electronLog.info('   ');
electronLog.info('start time: ', moment().format('X'));
electronLog.info('   ');

app.DESKTOP_APP_CONFIG.electronStorage = require('redux-persist-electron-storage').default({
  electronStoreOpts: {
    name: 'DESKTOP_STORE_DB',
  },
});

let mainWindow;

global.LOADURL = serve({ directory: path.join(__dirname, '/app') });

app.setAsDefaultProtocolClient('yunle-ai-app');

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  if (app.DESKTOP_APP_CONFIG.DESKTOP_APP_ENV === 'develop') {
    mainWindow.loadURL('http://localhost:8000');
  } else {
    global.LOADURL(mainWindow);
    mainWindow.loadURL('app://-/');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  electronLog.info('   ');
  electronLog.info('close time: ', moment().format('X'));
  electronLog.info('   ');
  electronLog.info('=======================   App close   =======================');
  electronLog.info('   ');
});

app.on('gpu-process-crashed', (event, killed) => {
  electronLog.error(event, killed);
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function updateHandle(url) {
  const squirrelCommand = process.argv[1];
  if (squirrelCommand === '--squirrel-updated') return;
  if (squirrelCommand === '--squirrel-install') return;
  electronUpdater.autoUpdater.on('checking-for-update', () => {

  });
  electronUpdater.autoUpdater.on('update-available', () => {

  });
  electronUpdater.autoUpdater.on('update-not-available', () => {

  });
  electronUpdater.autoUpdater.on('download-progress', (progress) => {

  });
  electronUpdater.autoUpdater.on('update-downloaded', () => {

  });
  electronUpdater.autoUpdater.on('error', (e, data) => {

  });
  // electronUpdater.autoUpdater.setFeedURL(url);
  // electronUpdater.autoUpdater.checkForUpdates();
}
