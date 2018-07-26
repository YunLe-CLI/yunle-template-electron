import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import classNames from 'classnames';
import lottie from 'lottie-web';
import styles from './IndexPage.less';

@connect(({ auth }) => ({
	auth,
}))
export default class IndexPage extends PureComponent {
  state={
    info: '',
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
  	try {
			const that = this;
			let FirstCheckUpdate = true;
			const { electron } = global.DESKTOP_SDK;
			const { ipcRenderer, remote } = electron;
			const { dialog } = remote;
			this.setState({
				info: '检测版本更新...',
			})
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
				ipcRenderer.sendSync('window-Update-open', 'ping');
				setTimeout(() => {
					ipcRenderer.sendSync('window-Login-close', 'ping');
					ipcRenderer.sendSync('window-Main-close', 'ping');
					ipcRenderer.sendSync('window-Loading-close', 'ping');
				}, 800)
			});
			ipcRenderer.on('update-not-available-cb', (e) => {
				console.log('update-not-available-cb: ', e);
				this.renderInof()
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
	  } catch(e) {
		  console.log(e)
	  }
	};
	checkUpdate = () => {
		const { autoUpdater } = global.DESKTOP_SDK;
		console.info('正在检测是否有更新！');
		autoUpdater.checkForUpdates();
	}
  componentDidMount() {
    const animation = lottie.loadAnimation({
      container: document.getElementById('lottie'),
      animationData: require('./assets/loading.json'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      name: "Loading...",
    })
	  if (global.isElectron) {
		  this.isOnline(() => {
			  this.bindUpdateEvet();
			  this.checkUpdate();
		  })
	  }
  }
  renderInof = () => {
	  let i = 0
	  const infoMsg = [
		  '加载静态资源...',
		  '加载配置文件...',
		  '检查配置信息...',
		  '检查用户权限...',
		  '注入用户信息...',
		  '注入安全信息...',
		  '正在进入客户端',
	  ]
	  setInterval(() => {
		  if (i < 8) {
			  this.setState({
				  info: infoMsg[i] || '正在进入客户端'
			  }, () => {
				  i+=1
			  })
		  } else {
			  const { dispatch } = this.props;
			  dispatch({ type: 'app/checkLogin' })
		  }
	  }, 800)
  }
  render() {
    const { info } = this.state
    return (
      <div className={'notSelect'} style={{ position: 'relative', width: '100%', height: '100%', background: 'rgba(0,0,0,.3)', overflow: 'hidden' }}>
        <div className={classNames('loadingWrap')} id='lottie' />
        <h1 style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 1,
          textAlign: 'center',
        }}>
          <span style={{
            padding: '5px 15px',
	          fontSize: 13,
	          background: 'rgba(0,0,0,.3)',
            borderRadius: 5,
	          color: '#fff',
          }}>
            { info || 'Loading...' }
          </span>
        </h1>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

