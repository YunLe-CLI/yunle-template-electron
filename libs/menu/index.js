exports.createMenu = function (_a) {
    var electron = _a.electron;
    var app = electron.app, Menu = electron.Menu, BrowserWindow = electron.BrowserWindow;
    var template = [
        {
            label: '窗口',
            role: 'window',
            submenu: [
                {
                    label: '刷新',
                    accelerator: 'CmdOrCtrl+R',
                    click: function (item, focusedWindow) {
                        if (focusedWindow) {
                            // 重载之后, 刷新并关闭所有的次要窗体
                            if (focusedWindow.id === 1) {
                                BrowserWindow.getAllWindows().forEach(function (win) {
                                    if (win.id > 1) {
                                        win.close();
                                    }
                                });
                            }
                            focusedWindow.webContents.send('webview-reload');
                            var ses = focusedWindow.webContents.session;
                            ses.clearCache(function () {
                                console.log('clearCache');
                            });
                            focusedWindow.reload();
                            // focusedWindow.reload()
                        }
                    }
                },
                {
                    label: '最小化',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                },
                {
                    label: '关闭',
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close'
                },
                {
                    type: 'separator'
                },
                {
                    label: '重新打开窗口',
                    accelerator: 'CmdOrCtrl+Shift+T',
                    enabled: false,
                    key: 'reopenMenuItem',
                    click: function () {
                        app.emit('activate');
                    }
                },
            ],
        },
        {
            label: '帮助',
            role: 'help',
            submenu: [
                {
                    label: '关于我们',
                    click: function () {
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: '切换开发者工具',
                    accelerator: (function () {
                        if (process.platform === 'darwin') {
                            return 'Alt+Command+I';
                        }
                        else {
                            return 'Ctrl+Shift+I';
                        }
                    })(),
                    click: function (item, focusedWindow) {
                        if (focusedWindow) {
                            focusedWindow.toggleDevTools();
                        }
                    }
                },
            ]
        },
    ];
    function addUpdateMenuItems(items, position) {
        if (process.mas)
            return;
        var version = electron.app.getVersion();
        var updateItems = [
            {
                label: "Version " + version,
                enabled: false
            },
            {
                label: '检查更新',
                enabled: true,
                key: 'checkingForUpdate',
                click: function () {
                    require('electron').autoUpdater.checkForUpdates();
                }
            },
        ];
        items.splice.apply(items, [position, 0].concat(updateItems));
    }
    function findReopenMenuItem() {
        var menu = Menu.getApplicationMenu();
        if (!menu)
            return;
        var reopenMenuItem;
        menu.items.forEach(function (item) {
            if (item.submenu) {
                item.submenu.items.forEach(function (item) {
                    if (item.key === 'reopenMenuItem') {
                        reopenMenuItem = item;
                    }
                });
            }
        });
        return reopenMenuItem;
    }
    if (process.platform === 'darwin') {
        var name_1 = electron.app.getName();
        template.unshift({
            label: name_1,
            submenu: [{
                    label: "\u5173\u4E8E " + name_1,
                    role: 'about'
                }, {
                    type: 'separator'
                }, {
                    label: '服务',
                    role: 'services',
                    submenu: []
                }, {
                    type: 'separator'
                }, {
                    label: "\u9690\u85CF " + name_1,
                    accelerator: 'Command+H',
                    role: 'hide'
                }, {
                    label: '隐藏其它',
                    accelerator: 'Command+Alt+H',
                    role: 'hideothers'
                }, {
                    label: '显示全部',
                    role: 'unhide'
                }, {
                    type: 'separator'
                }, {
                    label: '退出',
                    accelerator: 'Command+Q',
                    click: function () {
                        app.quit();
                    }
                }]
        });
        // 窗口菜单.
        template[1].submenu.push({
            type: 'separator'
        }, {
            label: '前置所有',
            role: 'front'
        });
        addUpdateMenuItems(template[0].submenu, 1);
    }
    if (process.platform === 'win32') {
        var helpMenu = template[template.length - 1].submenu;
        addUpdateMenuItems(helpMenu, 0);
    }
    app.on('ready', function () {
        var menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    });
    app.on('browser-window-created', function () {
        var reopenMenuItem = findReopenMenuItem();
        if (reopenMenuItem)
            reopenMenuItem.enabled = false;
    });
    app.on('window-all-closed', function () {
        var reopenMenuItem = findReopenMenuItem();
        if (reopenMenuItem)
            reopenMenuItem.enabled = true;
    });
    return {
        addUpdateMenuItems: function (i) {
            var helpMenu = template[template.length - 1].submenu;
            addUpdateMenuItems(helpMenu, i);
        },
        hideMenu: function () {
            var menu = Menu.buildFromTemplate([]);
            Menu.setApplicationMenu(menu);
        },
        showMenu: function () {
            var menu = Menu.buildFromTemplate(template);
            Menu.setApplicationMenu(menu);
        }
    };
};
