import { delay } from '../utils'

export default {
  namespace: 'app',
  state: {
    count: 0,
  },
  reducers: {
    increment(state) {
      return { count: state.count + 1 }
    },
    decrement(state) {
      return { count: state.count - 1 }
    },
  },
  effects: {
	  *checkLogin({ payload }, { call, put }) {  // eslint-disable-line
		  if (global.isElectron) {
			  const { electronStorage, electron } = global.DESKTOP_SDK;
			  const { app, ipcRenderer } = electron;
			  const isLogin = yield call(electronStorage.getItem, 'isLogin');
			  if (isLogin === 'true') {
				  ipcRenderer.sendSync('window-Main-open', 'ping');
				  ipcRenderer.sendSync('window-Login-close', 'ping');
				  ipcRenderer.sendSync('window-Loading-close', 'ping');
				  return
			  }
			  if (isLogin === 'false') {
				  ipcRenderer.sendSync('window-Login-open', 'ping');
				  ipcRenderer.sendSync('window-Main-close', 'ping');
				  ipcRenderer.sendSync('window-Loading-close', 'ping');
				  return
			  }
			  ipcRenderer.sendSync('window-Login-open', 'ping');
			  ipcRenderer.sendSync('window-Main-close', 'ping');
			  ipcRenderer.sendSync('window-Loading-close', 'ping');
		  }
	  },
    *delayed({ payload: { timeout } }, { put }) {
      yield delay(timeout)
      yield put({ type: 'increment' })
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(({ pathname }) => {
        console.log(pathname)
      })
    },
  },
}
