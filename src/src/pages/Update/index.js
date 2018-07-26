import React, { PureComponent } from 'react';
import global from 'global';
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import classNames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import $ from 'jquery';
import { Alert, Row, Col, Button, Card, Progress } from 'antd';
import styles from './IndexPage.less';

@connect(({ auth }) => ({
	auth,
}))
export default class IndexPage extends PureComponent {
  state = {
    progress: {
	    percent: 0,
    }
  };

  componentDidMount() {
    $('#YunLeAI_loading').remove();
	  if (global.isElectron) {
		  this.isOnline(() => {
			  this.bindUpdateEvet();
			  this.progress();
			  // this.checkUpdate();
		  })
	  }
  }
  close = () => {
    if (global.isElectron) {
      if (global.DESKTOP_SDK) {
        const { electron } = global.DESKTOP_SDK;
        const { app } = electron.remote;
        app['MAIN_WINDOW'].removeAllListeners('close');
        app.quit();
      }
    }
    // window.close();
  }
  progress = () => {
    if (global.isElectron) {
      try {
        const { electron } = global.DESKTOP_SDK;
        const {ipcRenderer} = electron;
        ipcRenderer.send('ipcMain-update');
        ipcRenderer.on('download-progress-cb', (e, data) => {
          this.setState({
            progress: data,
          })
        });
      } catch (e) {
        console.error(e);
      }
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
				this.setState({
					progress: {
						percent: 100,
					}
				})
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
  render() {
    const { percent=0, total=0, bytesPerSecond = 0, transferred=0 } = this.state.progress;
    console.log(percent, 11111);
    return (
	    <div
        className={''}
        style={{
		    position: 'absolute',
		    top: 0,
		    left: 0,
		    right: 0,
		    bottom: 0,
	    }}>
		    <Helmet
			    title="更新 - YunLe.AI"
		    />
        <Scrollbars style={{ width: '100%', height: '100%' }}>
          <div className={classNames(styles.wrap)}>
            <Card bordered={false} title="应用更新" style={{ width: '100%' }}>
             <Row>
              <Row gutter={16}>
                <Col className={styles.ProgressWrap} span={24}>
                  <Progress strokeWidth={20} percent={Math.round(percent >= 100 ? 100 : percent)} status="active" />
                  <Col className={styles.ProgressInfo}>
                    <Col style={{textAlign: 'left'}} className={styles.info} span={12}>
                      已下载：{`${transferred > 0 ? (transferred/1024/1024).toFixed(2) : 0 }MB/${total > 0 ? (total/1024/1024).toFixed(2) : 0}MB`}
                    </Col>
                    <Col style={{textAlign: 'right', paddingRight: 50 }} className={styles.info} span={12}>
                      {`${bytesPerSecond > 0 ? (bytesPerSecond/1024).toFixed(2) : 0 }KB/s`}
                    </Col>
                  </Col>
                </Col>
                <Col className={styles.infod} span={24}>
                  为了您更好的体验，请更新完成后使用！
                </Col>
              </Row>
             </Row>
            </Card>
          </div>
        </Scrollbars>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

