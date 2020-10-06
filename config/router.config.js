export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      // user
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          { path: '/user', redirect: '/user/login' },
          { path: '/user/login', name: 'login', component: './User/Login' },
          { path: '/user/register', name: 'register', component: './User/Register' },
          {
            path: '/user/register-result',
            name: 'register.result',
            component: './User/RegisterResult',
          },
        ],
      },
      // app
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        // 控制权限 v1.3.0
        authority: ['admin', 'test', 'develop'],
        routes: [
          // dashboard
          /*{ path: '/', redirect: '/dashboard/analysis' },*/
          { path: '/', redirect: '/redis/home' }, //跳转到redis主页
          //account
          {
            name: 'account',
            icon: 'user',
            path: '/account',
            routes: [
              {
                path: '/account/center',
                name: 'center',
                //component: './Account/Center/Center',
                component: '404', //v1.4.0
                hideInMenu: true, //隐藏菜单 v1.4.0
                routes: [
                  {
                    path: '/account/center',
                    redirect: '/account/center/articles',
                  },
                  {
                    path: '/account/center/articles',
                    component: './Account/Center/Articles',
                  },
                  {
                    path: '/account/center/applications',
                    component: './Account/Center/Applications',
                  },
                  {
                    path: '/account/center/projects',
                    component: './Account/Center/Projects',
                  },
                ],
              },
              {
                path: '/account/settings',
                name: 'settings',
                component: './Account/Settings/Info',
                routes: [
                  {
                    path: '/account/settings',
                    redirect: '/account/settings/base',
                  },
                  {
                    path: '/account/settings/base',
                    component: './Account/Settings/BaseView',
                  },
                  {
                    path: '/account/settings/security',
                    component: './Account/Settings/SecurityView',
                  },
                  {
                    path: '/account/settings/binding',
                    component: './Account/Settings/BindingView',
                  },
                  {
                    path: '/account/settings/notification',
                    component: './Account/Settings/NotificationView',
                  },
                ],
              },
            ],
          },

          // usermanager
          {
            name: 'usermanager',
            icon: 'table',
            path: '/usermanager',
            // 控制权限 v1.4.0
            authority: ['superadmin'],
            routes: [
              {
                path: '/usermanager/list',
                name: 'userlist',
                component: './UserManager/UserList',
              },
            ],
          },

          // rolemanager
          {
            name: 'rolemanager',
            icon: 'table',
            path: '/rolemanager',
            // 控制权限 v1.4.0
            authority: ['superadmin'],
            routes: [
              {
                path: '/rolemanager/list',
                name: 'rolelist',
                component: './RoleManager/RoleList',
              },
            ],
          },

          // redis
          {
            name: 'connectionadmin', //菜单名字
            icon: 'setting', //图标
            path: '/redis', //文件夹
            routes: [
              {
                path: '/redis/home', //路由名称
                name: 'redishome', //菜单名称
                component: './Redis/RedisHomePage', //文件名称
              },
              {
                path: '/redis/data/:id', //路由名称
                name: 'redisdata', //菜单名称
                component: './Redis/RedisDataPage', //文件名称
                hideInMenu: true, //隐藏菜单
              },
              {
                path: '/redis/data/ztree/:id', //路由名称
                name: 'redisdataztree', //菜单名称
                component: './Redis/RedisDataPageZtree', //文件名称
                hideInMenu: true, //隐藏菜单
              },
            ],
          },
          /**【新建的路由配置一定要在‘404’前新建，不然会报404】*/
          {
            component: '404',
          },
        ],
      },
    ],
  },
];
