const fs = require('fs');
const fse = require('fs-extra')
const path = require('path');

// 更新url
const updateURL = 'https://dagouzhi.oss-cn-qingdao.aliyuncs.com/com.dagouzhi.app.metting.desktop/latest';
// 包名
const productName = 'YunLe-electron';
// app ID
const appId = 'com.dagouzhi.app.metting.desktop';
// OSX 图标
const mac_icon = './build/icon.icns';
// OSX 安装图标
const dmg_install_icon = './build/icon.icns';
// windows 图标
const win_icon = './build/icon.ico';
// windows 安装图标
const win_install_icon = './build/icon.ico';
// 打包后名字
// const artifactName = `${productName}-Setup-V\${version}.\${ext}`;
const artifactName = `latest-setup.\${ext}`;

const buildConfig = {
  "appId"        : "com.dagouzhi.app.metting.desktop",
  "artifactName" : artifactName,
  "directories"  : {"output" : "bin/\${version}"},
  "asar"         : true,
  "files": [
    "./dist/**/*",
    "./node_modules/**/*",
    "!.scripts",
    "!src/*",
  ],
  "npmRebuild" : true,
  "publish": {
    "provider": "generic",
    "url": updateURL,
    "channel": "latest",
  },
  "copyright": "LEON",
  "mac": {
    "category"   : "public.app-category.developer-tools",
    "icon"       : dmg_install_icon,
    "target"     : ["zip", "dmg"],
    "identity"  : "U2784YTGC6",
    "type"      : "distribution",
    // "extraFiles" : ["docs/equations.pdf"],
    "fileAssociations": {
      "ext"       : "ptree",
      "name"      : "PTree",
      "icon"      : mac_icon,
      "role"      : "Editor",
      "isPackage" : false
    },
    "entitlements": "entitlements.mac.plist",
    "hardenedRuntime": true,
    "extendInfo": {
      "NSMicrophoneUsageDescription": "请允许本程序访问您的麦克风",
      "NSCameraUsageDescription": "请允许本程序访问您的摄像头"
    },
  },
  "dmg": {
    "iconSize" : 80,
    "window"   :
    { "x": 400, "y": 100, "width": 540, "height": 380 },
    "contents" : [
      { "x": 130, "y": 170, "type" : "file" },
      { "x": 410, "y": 170, "type" : "link", "path" : "/Applications" },
      // { "x": 130, "y": 0,   "type" : "file", "path" : "docs/example.ptree" },
      // { "x": 270, "y": 0,   "type" : "file", "path" : "docs/equations.pdf" },
      // { "x": 410, "y": 0,   "type" : "file", "path" : "LICENSE.md" }
    ]
  },
  "win": {
    "icon"       : win_install_icon,
    "target"     : ["zip", "nsis"],
    "fileAssociations" : {
      "ext"         : "ptree",
      "name"        : "PTree",
      "description" : "PTree Project File",
      "icon"        : win_icon
    },
    // "extraFiles" : [
    //   {"from": "docs/example.ptree", "to": "example.ptree"},
    //   {"from": "docs/equations.pdf", "to": "equations.pdf"},
    //   {"from": "LICENSE.md", "to": "LICENSE.txt"}
    // ]
  },
  "nsis": {
    "perMachine": true,
    "differentialPackage": false,
    "createDesktopShortcut": "always",
    "installerIcon": win_install_icon,
    "allowToChangeInstallationDirectory": true,
    "createStartMenuShortcut": true,
    "oneClick": false,
    "runAfterFinish": true,
  }
  // "linux": {
  //   "icon"       : "icons/png/app",
  //   "target"     : {"target":"dir", "arch": "ia32"},
  //   "extraFiles" : [
  //     {"from": "docs/example.ptree", "to": "example.ptree"},
  //     {"from": "docs/equations.pdf", "to": "equations.pdf"},
  //     {"from": "LICENSE.md", "to": "LICENSE.txt"}
  //   ]
  // }
}
fs.writeFileSync(path.join(__dirname, '../electron-builder.json'), JSON.stringify(buildConfig));
// fs.writeFileSync(path.join(__dirname, '../electron-builder.yaml'),
//   `
//   main: "./dist/main.js"
//   directories:
//   output: dist/\${version}
//   buildResources: build
// appId: ${appId}
// compression: normal
// npmRebuild: true
// files:
//   - "./dist/**/*"
//   - "./pages/**/*"
//   - "./node_modules/**/*"
// publish:
//   provider: generic
//   url: ${updateURL}
//   channel: latest
// copyright: LEON
// productName: ${productName}
// mac:
//   target:
//     - dmg
//     - zip
//   icon: ${mac_icon}
// dmg:
//   icon: ${dmg_install_icon}
//   artifactName: "\${productName}-Setup-\${version}.\${ext}"
// win:
//   target:
//     - zip
//     - nsis
//   icon: ${win_icon}
//   artifactName: "\${productName}-Setup-\${version}.\${ext}"
// nsis:
//   perMachine: true
//   differentialPackage: false
//   createDesktopShortcut: always
//   installerIcon: ${win_install_icon}
//   allowToChangeInstallationDirectory: true
//   createStartMenuShortcut: true
//   oneClick: false
//   runAfterFinish: true
// `);

// fse.copy(path.join(__dirname, '../package.json'), path.join(__dirname, '../dist/package.json'))
//     .then(() => console.log('success!'))
//     .catch(err => console.error(err))
