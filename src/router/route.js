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
      {path: '/contentaudit', component: contentaudit, name: '内容审核'}
    ]
  }, {
    path: '',
    hidden: true,
    redirect: '/404'
  }
  ];
export default routers;
