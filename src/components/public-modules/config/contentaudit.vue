<template>
	<div class="content-audit-wrap">
    <el-form :model="dataForAudit" status-icon label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="数据标识">
            <el-input v-model="dataForAudit.id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户id">
            <el-input v-model="dataForAudit.uid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户ip">
            <el-input v-model="dataForAudit.ip"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户设备号">
            <el-input v-model="dataForAudit.device"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="内容发布时间">
            <el-input v-model="dataForAudit.publish_date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="产品名称">
            <el-input v-model="dataForAudit.app_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="平台名称">
            <el-input v-model="dataForAudit.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="入库时间">
            <el-input v-model="dataForAudit.created"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="Api版本号">
            <el-input v-model="dataForAudit.version"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="机器审核结果">
            <el-input v-model="dataForAudit.sys_status"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="机器策略名称">
            <el-input v-model="dataForAudit.sys_policy"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数据类型">
            <el-input v-model="dataForAudit.data_type"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="消息类型">
            <el-input v-model="dataForAudit.msg_type"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户昵称">
            <el-input v-model="dataForAudit.nick_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户等级">
            <el-input v-model="dataForAudit.user_level"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="内容类型">
            <el-input v-model="dataForAudit.type"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="用户发布内容">
        <img v-if="dataForAudit.type && dataForAudit.type != 1" :src="dataForAudit.content" style="margin: 0 auto;"/>
        <el-input v-else type="textarea" :rows="5" v-model="dataForAudit.content"></el-input>
      </el-form-item>
      <el-form-item>
        <el-tooltip class="item" effect="dark" content="可按下键盘字母y或者Shift+y快速审核通过" placement="top">
          <el-button type="success" @click="passData">通过(Y)</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="可按下键盘字母n或者Shift+n快速审核不通过" placement="top">
          <el-button type="danger" @click="failData">不通过(N)</el-button>
        </el-tooltip>
      </el-form-item>
    </el-form>
	</div>
</template>
<script>
	export default {
	    data() {
	    	return {
          dataForAudit:{

          }
        }
	  	},
    created(){
      var _self = this;
      //给审核页面添加键盘监听事件
      document.onkeyup = function (e) {
        //y或者Y
        if(e && e.keyCode == 89){
          _self.passData();
        }else if(e && e.keyCode == 78){ //n或者N
          _self.failData();
        }
      }
    },
	  	mounted(){
        this.getDataForAudit();
//	  		var tmpThis = this;
//        $.ajax({
//          url:  '/fx-mock/fx-mock-service/hasPermission',
//          type: "POST",
//          data: {"code" : "prodLineConfig"},
//          async: true,
//          success: function(response) {
//            tmpThis.hasPermission = response;
//          }
//        });
	  	},
	  	methods:{
        getDataForAudit(){
	  			this.$store.dispatch('getDataForAudit').then(val => {
            if(val){
              this.dataForAudit = val;
            }
	  			})
	  		},
        passData(){
          console.log("pass-------------------------");
        },
        failData(){
          console.log("fail-------------------------");
        }
	  	}
	}
</script>
<style>
	.content-audit-wrap{
		text-align: left;
	}
	.prodline-list{
		margin-top:20px;
		height: 450px;
	}
	.content-audit-wrap .el-table__body-wrapper{
		text-align: left;
		font-size: 12px;
	}
	.content-audit-wrap .el-icon-loading{
		display: none
	}
	.content-audit-wrap .el-pagination{
		text-align: center;
		margin-top:10px;
	}
</style>
