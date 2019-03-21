<template>
	<div class="container">
		<el-row class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'" @click.native="gomain">
				{{collapsed?sysNameShortName:sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="el-icon el-icon-d-arrow-left" :title="collapsed ? '展开':'折叠'" ref="state"></i>
					<!-- <i class="fa fa-align-justify"></i> -->
				</div>
			</el-col>
			<el-col :span="3" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner">{{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item  @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-row>
		<el-row  class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router :default-openeds=[1,2,3,4,5,6,7,8,9,10] :collapse="collapsed">
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index" v-if="!item.leaf">
							<template slot="title">
                <!--<i :class="item.iconCls"></i>{{item.name}}-->
                <i :class="item.iconCls"></i>
                <span slot="title">{{item.name}}</span>
              </template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				sysName:'内容审核系统',
        sysNameShortName:'Audit',
				collapsed:false,
				sysUserName: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
          sessionStorage.removeItem('user');
          this.$router.push({ path: '/login' });
        }).catch(() => {

				});


			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
				if(this.collapsed){
					this.$refs.state.className = "el-icon-d-arrow-right"
				}else{
					this.$refs.state.className = "el-icon-d-arrow-left"
				}
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
      gomain(){
        this.$router.push({ path: '/main' });
      }
		},
		mounted() {
      if(!sessionStorage.getItem('user')){
        this.$router.push({ path: '/login' });
      }else{
        this.sysUserName = sessionStorage.getItem('user');
      }
    	 var tmpThis = this;
//		  $.ajax({
//          url:  '/fx-mock/sso/user/getUsername',
//          type: "POST",
//          processData: false,
//          contentType: false,
//          async: true,
//          success: function(response) {
//              if (response.error == '00000000') {
//                  sessionStorage.setItem('user', response.data.username);
//                  tmpThis.sysUserName = sessionStorage.getItem('user');
//              }
//          }
//          });
		}
	}

</script>

<style>
	html,body{padding:0;margin:0;}
  .container {
    }
  .container .header {
    height: 60px;
    line-height: 60px;
    background: rgb(65,141,181);
    color: #fff; }
  .container .header .userinfo {
    text-align: right;
    padding-right: 35px;
    float: right; }
  .container .header .userinfo .userinfo-inner {
    cursor: pointer;
    color: #fff; }
  .container .header .userinfo .userinfo-inner img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 0px 10px 10px;
    float: right; }
  .container .header .logo {
    height: 60px;
    font-size: 22px;
    font-weight: bold;
    padding-left: 5px;
    padding-right: 20px;
    border-color: rgba(238, 241, 146, 0.3);
    border-right-width: 1px;
    border-right-style: solid; }
  .container .header .logo img {
    width: 40px;
    float: left;
    margin: 10px 10px 10px 18px; }
  .container .header .logo .txt {
    color: #fff; }
  .container .header .logo-width {
    width: 230px;
    cursor: pointer;}
  .container .header .logo-collapse-width {
    width: 65px;
    cursor: pointer;}
  .container .header .tools {
    padding: 0px 23px;
    width: 14px;
    height: 60px;
    line-height: 60px;
    cursor: pointer; }
  .container .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    width: 100%;
}
  .container .main aside {
    flex: 0 0 230px;
    width: 230px; }
  .container .main aside .el-menu {
    height: 100%; }
  .container .main aside .collapsed {
    width: 60px; }
  .container .main aside .collapsed .item {
    position: relative; }
  .container .main aside .collapsed .submenu {
    position: absolute;
    top: 0px;
    left: 60px;
    z-index: 99999;
    height: auto;
    display: none; }
  .container .main .menu-collapsed {
    flex: 0 0 60px;
    width: 60px; }
  .container .main .menu-expanded {
    flex: 0 0 230px;
    width: 230px; }
  .container .main .content-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px; }
  .container .main .content-container .breadcrumb-container{
  	padding-bottom:10px;
  	border-bottom:1px solid #ddd;
  	margin-bottom: 20px;
  }
   .container .main .content-container .el-breadcrumb {
  	font-size: 14px;
  	border-bottom: 0;
  	padding-bottom:0;
  	margin-bottom: 0;
  }
  .container .main .content-container .breadcrumb-container .title {
    width: 200px;
    float: left;
    color: #475669; }
  .container .main .content-container .content-wrapper {
    background-color: #fff;
    box-sizing: border-box; }
    .el-dropdown-menu{
    	font-size: 12px;
    	padding: 0
    }
</style>
