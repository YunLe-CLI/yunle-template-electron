import React, { PureComponent } from 'react';
import global from 'global';
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import classNames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import $ from 'jquery';
import styles from './IndexPage.less';

@connect(({ auth }) => ({
	auth,
}))
export default class Index extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    console.log(styles, 111111)
    if (global.isElectron) {
      this.isOnline(() => {
        // this.bindUpdateEvet();
        // this.checkUpdate();
        this.renderWebview();
      })
      // this.openBrowserWindow();
    }
  }
  isOnline(user_callback){
    const message = () => {
      const { electron } = global.DESKTOP_SDK;
      const { remote } = electron;
      const { dialog, app } = remote;
      return dialog.showMessageBox(app['MAIN_WINDOW'], {
        title:"没有连接网络",
        message:"没有可用的网络, 您想再试一次吗？",
        type:'warning',
        buttons:["再试一次","关闭"],
        defaultId: 0
      },function(index){
        if(index == 0){
          execute();
        } else {
          app.quit();
        }
      })
    };

    const execute = () => {
      if(navigator.onLine){
        // Execute action if internet available.
        user_callback();
      }else{
        // Show warning to user
        // And "retry" to connect
        message();
      }
    };

    // Verify for first time
    execute();
  }
  bindUpdateEvet = () => {
    const that = this;
    let FirstCheckUpdate = true;
    const { electron } = global.DESKTOP_SDK;
    const { ipcRenderer, remote } = electron;
    const { dialog } = remote;
    ipcRenderer.on('check-for-update', () => {
      this.checkForUpdate();
    });
    ipcRenderer.on('check-for-error-cb', (e, err) => {
      console.log('check-for-error-cb: ', err);
      if (err.indexOf('is already running') > -1) {
        dialog.showMessageBox({
          type: 'error',
          title: 'update error',
          message: 'is already running',
        });
        return;
      }
      if (err.indexOf('Can not find Squirrel') > -1) {
        dialog.showMessageBox({
          type: 'error',
          title: 'update error',
          message: 'Can not find Squirrel',
        });
        return;
      }
      dialog.showMessageBox({
        type: 'error',
        title: 'update error',
        message: err,
      });
    });
    ipcRenderer.on('check-for-update-cb', (e) => {
      console.log('check-for-update-cb: ', e);
    });
    ipcRenderer.on('update-available-cb', (e) => {
      console.log('update-available-cb: ', e);
      const notification = {
        title: '新版本提醒',
        body: '线上有新版本，正在自动下载更新'
      };
      const myNotification = new window.Notification(notification.title, notification);
      myNotification.onclick = () => {
        console.log('Notification clicked')
      };
      this.openBrowserWindow();
    });
    ipcRenderer.on('update-not-available-cb', (e) => {
      console.log('update-not-available-cb: ', e);
      if (!FirstCheckUpdate) {
        const notification = {
          title: '未检测到新版本',
          body: '感放您的使用！'
        };
        const myNotification = new window.Notification(notification.title, notification);
        myNotification.onclick = () => {
          console.log('Notification clicked')
        };
        FirstCheckUpdate = false;
      }
    });
    ipcRenderer.on('download-progress-cb', (e, data) => {
      console.log('download-progress-cb: ', data);
    });
    ipcRenderer.on('update-downloaded-cb', (e) => {
      console.log('update-downloaded-cb: ', e);
      const { app, dialog } = electron.remote;
      const options = {
        type: 'info',
        title: '下载完成',
        message: "已下载完成，是否重启更新应用？",
        buttons: ['是']
      };
      dialog.showMessageBox(options, function (index) {
        if (index === 0) {
          app.autoUpdater.quitAndInstall();
        }
      });
    });
  };
  checkUpdate = () => {
    const { autoUpdater } = global.DESKTOP_SDK;
    console.info('正在检测是否有更新！');
    autoUpdater.checkForUpdates();
  }
  openBrowserWindow = (url) => {
    const { electron } = global.DESKTOP_SDK;
    const { BrowserWindow, app } = electron.remote;
    const preload = app['PRELOAD'];
    const LOADURL = app['LOADURL'];
    let win = this.updateWin = new BrowserWindow({
      // parent: app.MAIN_WINDOW,
      modal: true,
      width: 450,
      height: 190,
      minWidth: 450,
      minHeight: 190,
      transparent: true,
      frame: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        preload: preload,
      },
      backgroundThrottling: false,
    });
    // win.webContents.openDevTools();
    win.on('close', function () { win = null });
    if (LOADURL) {
	    // win.loadURL('http://localhost:8000/Update');
      LOADURL(win);
	    win.loadURL('app://-/Update/');
	    console.log(win, 111);
	    // if (app['DESKTOP_APP_ENV'] === 'develop') {
		   //  win.loadURL('http://localhost:8000/Update');
	    // } else {
		   //  LOADURL(win);
		   //  win.loadURL('app://-/Update/');
	    // }
    }
    // win.loadURL(url);
    win.once('ready-to-show', () => {
      win.show()
    });
  }
  renderWebview = () => {
    const { electron } = global.DESKTOP_SDK;
    const { remote } = electron;
    const { app } = remote;
    const webviewWrap = this.webviewWrap;
	  // const url = process.env.NODE_ENV === 'development' ? 'http://localhost:8882/' : 'https://class.hexiao-o.com/';
	  const url = 'https://class.hexiao-o.com/';
    webviewWrap.innerHTML = `<webview
              id='webview'
              nodeintegration='on'
              plugins='on'
              preload='file://${app.PRELOAD}'
              src='${url}'
            />`;
    const webview = global.YUNLE_WEBVIEW = this.webview = document.getElementById('webview');
    console.log('global.YUNLE_WEBVIEW: ', !!global.YUNLE_WEBVIEW);
    webview.addEventListener('did-start-loading', (e) => {
      // NProgress.start();
    });
    webview.addEventListener('did-stop-loading', () => {
      $('#YunLeAI_loading').remove();
      // NProgress.done();
      if (process.env.NODE_ENV === 'development') {
        // webview.openDevTools();
      }
    });
	  webview.addEventListener('console-message', (e) => {
		  console.log('page logged:', e.message)
	  })
	  webview.addEventListener('ipc-message', (event) => {
		  const { electronStorage, electron } = global.DESKTOP_SDK;
		  const { app, ipcRenderer } = electron;
		  const msg = event.channel
		  if (msg === 'window-Loading-open') {
			  ipcRenderer.send('window-Loading-open', 'ping');
		  }
		  if (msg === 'window-Main-open') {
			  ipcRenderer.send('window-Main-open', 'ping');
		  }
		  if (msg === 'window-Login-open') {
			  ipcRenderer.send('window-Login-open', 'ping');
		  }
		  if (msg === 'window-Loading-close') {
			  ipcRenderer.send('window-Loading-close', 'ping');
		  }
		  if (msg === 'window-Main-close') {
			  ipcRenderer.send('window-Main-close', 'ping');
		  }
		  if (msg === 'window-Login-close') {
			  ipcRenderer.send('window-Login-close', 'ping');
		  }
		  if (msg === 'window-Update-close') {
			  ipcRenderer.send('window-Update-close', 'ping');
		  }
		  // Prints "pong"
	  })
  }
  render() {
    return (
      <div style={{
	      position: 'absolute',
	      top: 0,
	      left: 0,
	      right: 0,
	      bottom: 0,
      }}>
        <Scrollbars style={{ width: '100%', height: '100%' }}>
          <div
            style={{
	            position: 'absolute',
	            top: 0,
	            left: 0,
	            right: 0,
	            bottom: 0,
            }}
            className={classNames(styles.wrap)}>
            <div ref={e => this.webviewWrap = e} className={styles.tableList}>

            </div>
          </div>
        </Scrollbars>
      </div>
    );
  }
}

Index.propTypes = {
};
