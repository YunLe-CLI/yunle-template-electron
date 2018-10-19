const fs = require('fs');
const path = require('path');
const version = require('../package.json').version;


const updateURL = 'http://oss.hexiao-o.com/desktop/';
const productName = 'YunLe-electron';
const appId = 'com.hexiao-o.yunle-template-electron';
const mac_icon = './build/icon.icns';
const dmg_install_icon = './build/icon.icns';
const win_icon = './build/icon.ico';
const win_install_icon = './build/icon.ico';
const artifactName = `\${productName}_V\${version}.\${ext}`;

fs.writeFileSync(path.join(__dirname, '../electron-builder.yaml'),
	`directories:
  output: dist/${version}
  buildResources: build
appId: ${appId}
compression: normal
npmRebuild: true
files:
  - "./dist/**/*"
  - "./pages/**/*"
  - "./node_modules/**/*"
publish:
  provider: generic
  url: ${updateURL}
  channel: latest
copyright: LEON
productName: ${productName}
mac:
  target:
    - dmg
    - zip
  icon: ${mac_icon}
dmg:
  icon: ${dmg_install_icon}
  artifactName: ${artifactName}
win:
  target:
    - zip
    - nsis
  requestedExecutionLevel: asInvoker
  icon: ${win_icon}
  artifactName: ${artifactName}
nsis:
  perMachine: true
  differentialPackage: false
  createDesktopShortcut: always
  installerIcon: ${win_install_icon}
  allowToChangeInstallationDirectory: true
  createStartMenuShortcut: true
  oneClick: false
  runAfterFinish: true
`);
