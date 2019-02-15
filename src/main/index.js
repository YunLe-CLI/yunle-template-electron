import { app } from 'electron';
import is from 'electron-is';
import log from 'electron-log';
import * as application from './services/application';
import * as window from './services/window';
import * as menu from './services/menu';
import * as update from './services/update';
import { createSeve } from './utils/seve'
import * as config from './configs/config';

global.console = console = {
    ...log,
    log: log.info
};

log.transports.file.level = 'info';

log.info('(main/index) app start');
log.info(`(main/index) log file at ${log.transports.file.file}`);

if (is.dev()) {
  require('electron-debug')(); // eslint-disable-line global-require
}

createSeve({
    scheme: 'app',
    protocol: {}
});

app.on('ready', () => {
  log.info('(main/index) app ready');

  application.init();
  menu.init();

  // 加载 devtools extension
  if (is.dev()) {
      const { default:installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
      installExtension(REACT_DEVELOPER_TOOLS)
          .then((name) => console.log(`Added Extension:  ${name}`))
          .catch((err) => console.log('An error occurred: ', err));
      installExtension(REDUX_DEVTOOLS)
          .then((name) => console.log(`Added Extension:  ${name}`))
          .catch((err) => console.log('An error occurred: ', err));
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (window.getCount() === 0) {
    application.init();
  }
});

app.on('quit', () => {
  log.info('(main/index) app quit');
  log.info('(main/index) <<<<<<<<<<<<<<<<<<<');
});

// Register to global, so renderer can access these with remote.getGlobal
global.services = {
  application,
  window,
  update,
};

global.configs = {
  config,
};
