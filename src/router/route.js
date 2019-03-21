const Login = resolve => {
  require.ensure(['@/components/business-modules/login/Login'], () => {
    resolve(require('@/components/business-modules/login/Login'))
  })
};

const Home = resolve => {
  require.ensure(['@/components/public-modules/Home'], () => {
    resolve(require('@/components/public-modules/Home'))
  })
};

const Main = resolve => {
  require.ensure(['@/components/public-modules/Main'], () => {
    resolve(require('@/components/public-modules/Main'))
  })
};
const NotFound = resolve => {
  require.ensure(['@/components/public-modules/404'], () => {
    resolve(require('@/components/public-modules/404'))
  })
};
const mockConfig = resolve => {
  require.ensure(['@/components/public-modules/config/mockConfig'], () => {
    resolve(require('@/components/public-modules/config/mockConfig'))
  });
};

const mockConfigGroup = resolve => {
  require.ensure(['@/components/public-modules/config/mockConfigGroup'], () => {
    resolve(require('@/components/public-modules/config/mockConfigGroup'))
});
};

const strategyConfig = resolve => {
  require.ensure(['@/components/public-modules/config/strategyConfig'], () => {
    resolve(require('@/components/public-modules/config/strategyConfig'))
  });
};

const applicationConfig = resolve => {
  require.ensure(['@/components/public-modules/config/applicationConfig'], () => {
    resolve(require('@/components/public-modules/config/applicationConfig'))
  });
};
const contentaudit = resolve => {
  require.ensure(['@/components/public-modules/config/contentaudit'], () => {
    resolve(require('@/components/public-modules/config/contentaudit'))
  });
};


const routers = [
  {path: '/', redirect: '/404',hidden:true},
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  }, {
    path: '/home',
    component: Home,
    name: '审核',
    iconCls: 'el-icon-setting',//图标样式class
    children: [
      {path: '/main', component: Main, name: '主页', hidden: true},
      {path: '/contentaudit', component: contentaudit, name: '内容审核'},
      // {path: '/applicationconfig', component: applicationConfig, name: '应用配置'},
      // {path: '/strategyConfig', component: strategyConfig, name: '策略配置'},
      // {path: '/mockConfigGroup', component:  mockConfigGroup, name: '分组配置'},
      // {path: '/mockConfig', component:  mockConfig, name: '挡板配置'}
    ]
  }, {
    path: '',
    hidden: true,
    redirect: '/404'
  },
  // {
  //   path: '*',
  //   hidden: true,
  //   redirect: '/404'
  // }
  ];
export default routers;
