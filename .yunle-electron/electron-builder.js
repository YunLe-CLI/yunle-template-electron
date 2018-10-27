const fs = require('fs');
const path = require('path');

// 更新url
const updateURL = 'http://oss.hexiao-o.com/desktop/update';
// 包名
const productName = 'YunLe-electron';
// app ID
const appId = 'com.hexiao-o.yunle-template-electron';
// OSX 图标
const mac_icon = './build/icon.icns';
// OSX 安装图标
const dmg_install_icon = './build/icon.icns';
// windows 图标
const win_icon = './build/icon.ico';
// windows 安装图标
const win_install_icon = './build/icon.ico';
// 打包后名字
const artifactName = `\${productName}_V\${version}.\${ext}`;

fs.writeFileSync(path.join(__dirname, '../electron-builder.yaml'),
	`directories:
  output: dist/\${version}
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
  artifactName: "\${productName}-Setup-\${version}.\${ext}"
win:
  target:
    - zip
    - nsis
  icon: ${win_icon}
  artifactName: "\${productName}-Setup-\${version}.\${ext}"
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
