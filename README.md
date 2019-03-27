# h5-content-audit

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


0. npm install
如安装node-sass报错,请安装淘宝镜像：
1. npm install -g cnpm --registry=https://registry.npm.taobao.org
2. cnpm install
3. npm start

###版本履历

1. V1.0.0

   * config/index.js 修改host和port
   * http.js 配置请求URL地址
   * store/index.js 添加modules
   * route.js 配置router
   * modules目录下创建相关module
     * contentaudit.vue 为内容审核页面
     
####注
   * 因为data_record_2019xxxx表中的operator字段类型为int,所以contentaudit.vue中暂时将operator设置为10001进行测试,后面待需求确认后,进行修改.
   * 因为data_record_2019xxxx表为天粒度表,当前默认审核的数据是当天表的数据,前端可添加控件进行日期选择,选择审核指定日期的数据,需要前后端联合修改实现.
   * contentaudit.vue页面的"用户发布内容"会根据data的type判断是文本还是图片,默认type=1为文本,type=2为图片,需要根据实际情况进行修改.
