const fs = require('fs');
const version = require('./package.json').version;
const updateURL = 'http://oss.hexiao-o.com/desktop/';
const productName = 'YunLe.AI';
const appId = 'com.hexiao-o.class';
const mac_icon = './public/macos_icon/icon_mac.icns';
const dmg_install_icon = './public/macos_icon/icon_mac_install.icns';
const win_icon = './public/windows_icon/icon_win.ico';
const win_install_icon = './public/windows_icon/icon_win_install.ico';
const artifactName = '\${productName}-\${version}.\${ext}';

fs.writeFileSync('./electron-builder.yaml',
`directories:
  output: dist/${version}
  buildResources: build
appId: ${appId}
compression: normal
files:
  - '!dist/'
  - '!app/'
  - '!*.map'
  - '!*.ts'
  - '!src/'
  - from: ./src/public/
    to: ./app
  - from: ./extensions/
    to: .
extraResources:
  - from: ./extensions/
    to: extensions
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
  backgroundColor: '#fff'
  window:
    x: 400
    'y': 100
    width: 540
    height: 380
win:
  publish:
    provider: generic
    url: 'http://webrtc.hexiao-o.com/desktop/darwin/'
    channel: latest
  target:
    - zip
    - nsis
  icon: ${win_icon}
  artifactName: ${artifactName}
nsis:
  perMachine: true
  differentialPackage: false
  createDesktopShortcut: always
  installerIcon: ${win_install_icon}
  allowToChangeInstallationDirectory: true
  oneClick: false
squirrelWindows:
  iconUrl: 'https://www.easyicon.net/1140213-SS_File_Extension_icon.html'
  loadingGif: ./public/install-spinner.gif
	electronVersion: 3.0.0-beta.3
`);
