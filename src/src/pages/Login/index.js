import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import classNames from 'classnames';
import lottie from 'lottie-web';
import styles from './IndexPage.less';
import $ from "jquery";

@connect(({ app }) => ({
	app,
}))
export default class IndexPage extends PureComponent {
  state={
    info: '',
  }
  componentDidMount() {
	  if (global.isElectron) {
		  this.isOnline(() => {
			  this.renderWebview();
		  })
	  }
	  // setTimeout(()=> {
		 //  if (global.isElectron) {
			//   const { electronStorage, electron } = global.DESKTOP_SDK;
			//   const { app, ipcRenderer } = electron;
			//   ipcRenderer.sendSync('window-Main-open', 'ping');
			//   ipcRenderer.sendSync('window-Login-close', 'ping');
			//   ipcRenderer.sendSync('window-Loading-close', 'ping');
		 //  }
	  // }, 3000)
  }
	isOnline(user_callback){
		const message = () => {
			const { electron } = global.DESKTOP_SDK;
			const { remote } = electron;
			const { dialog, app } = remote;
			return dialog.showMessageBox({
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
	renderWebview = () => {
		const { electron } = global.DESKTOP_SDK;
		const { remote } = electron;
		const { app } = remote;
		const webviewWrap = this.webviewWrap;
		// const url = process.env.NODE_ENV === 'development' ? 'http://localhost:8882/' : 'https://class.hexiao-o.com/';
		const url = 'https://passport.hexiao-o.com/'
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
      <div className={'notSelect'} style={{ position: 'relative', width: '100%', height: '100%', background: 'rgba(0,0,0,.3)', overflow: 'hidden' }}>
	      <Helmet
		      title="登录 - YunLe.AI"
	      />
	      <div ref={e => this.webviewWrap = e} className={styles.tableList}>

	      </div>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

