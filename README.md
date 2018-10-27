# yunle-template-electron


## 开始

按照以下步骤开始开发您自己的electron客户端:

```
$ npm install -g yunle-cli

$ yunle init my-project

$ > electron
    gulp
    webpack
    react
    node
```

或者： 

* ```git clone https://github.com/YunLe-CLI/yunle-template-electron.git my-project```

## 开发

* 安装依赖 ``` npm install && cd app && npm install ```
* 启动render进程 ``` npm run dev ```
* 启动electron ``` npm run start ```

## 打包
* 打包osx ``` npm run build:mac ```
* 打包windows ``` npm run build:win64 ```

记得重置git历史:

* ```rm rf .```
* ```git init```
* ```git add .```
* ```git push -m init```
