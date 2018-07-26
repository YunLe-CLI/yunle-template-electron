import 'babel-polyfill'
import React from 'react'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { persistStore, persistReducer, REHYDRATE } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import storage from 'redux-persist/lib/storage'


import dva from './src/utils/dva'
import appModal from './src/models/app'

let db = storage;
if (global.isElectron && global.DESKTOP_SDK && global.DESKTOP_SDK.electronStorage) {
	db = global.DESKTOP_SDK.electronStorage;
}

const persistConfig = {
	key: 'desktopRoot',
	storage: db,
	whitelist: [
		'app',
	],
}

const app = dva({
	onReducer: rootReducer => persistReducer(persistConfig, rootReducer),
	onError(e) {
		console.log('onError', e)
	},
})

app.model(appModal)

const createPersistor = store => {
	const persistor = persistStore(store)
	// const state = store.getState() || {}
	// const appState = state.app || {}
	// 新版本清理数据
	// persistor.purge()
	return persistor
}
exports.replaceRouterComponent = ({ history }) => {
	app.setHistory(history)
	const ConnectedRouterWrapper = ({ children }) =>{
		if (app._store) {
			return app.start(
				<PersistGate persistor={createPersistor(app._store)} loading={<div>Loading</div>}>
					<Router history={history}>{children}</Router>
				</PersistGate>
			)
		} else {
			return app.start(
				<Router history={history}>{children}</Router>
			)
		}
	}


	return ConnectedRouterWrapper
}