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
