import React from 'react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import createMemoryHistory from 'history/createMemoryHistory'

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
	models: [
		appModal,
	],
	onReducer: rootReducer => persistReducer(persistConfig, rootReducer),
	onError(e) {
		console.log('onError', e)
	},
})

const createPersistor = store => {
	const persistor = persistStore(store)
	// const state = store.getState() || {}
	// const appState = state.app || {}
	// 新版本清理数据
	// persistor.purge()
	return persistor
}

app.setHistory(createMemoryHistory())

exports.replaceRenderer = ({ bodyComponent, replaceBodyHTMLString }) => {
	const ConnectedBody = () => {
		if (app._store) {
			return app.start(
				<PersistGate persistor={createPersistor(app._store)} loading={<div />}>
					{bodyComponent}
				</PersistGate>
			)
		} else {
			return app.start(
				bodyComponent
			)
		}
		return app.start(bodyComponent)
	}
	replaceBodyHTMLString(renderToString(<ConnectedBody />))
}