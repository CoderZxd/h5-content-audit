<template>
	<div class="strategy-wrap">
		<el-button type="primary" size="normal" @click="openStrategyWin" v-if="hasPermission">新增策略</el-button>
		<el-dialog :title="title" :visible.sync="addStrategyWin" size="tiny" :show-close="false">
			<el-form :model="addStrategyForm" :rules="rulesForm" ref="addStrategyForm" label-width="60px">
			    <el-input v-model="addStrategyForm.strategyId" auto-complete="off" type="hidden"></el-input>
			    <el-form-item label="名称"  prop="strategyName">
			      <el-input v-model.trim="addStrategyForm.strategyName" placeholder="请输入策略名称" auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="简称"  prop="strategyename">
			      <el-input v-model.trim="addStrategyForm.strategyename" placeholder="请输入策略简称" auto-complete="off" :disabled="title == '修改策略'"></el-input>
			    </el-form-item>
			    <el-form-item label="描述"  prop="desc">
			      <el-input v-model.trim="addStrategyForm.desc" type="textarea" placeholder="请输入描述" auto-complete="off"></el-input>
			    </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			    <el-button type="text"  @click="resetForm('addStrategyForm')">取 消</el-button>
			    <el-button type="primary"  @click="submitForm('addStrategyForm')">提 交</el-button>
			</div>
		</el-dialog>
		<div class="strategy-list">
			<el-table :data="strategyPage"  style="width:100%">
				<el-table-column prop="strategyname" label="名称"></el-table-column>
				<el-table-column prop="strategyename" label="简称"></el-table-column>
				<el-table-column prop="strategydesc" label="描述"></el-table-column>
				<el-table-column label="操作">
			      <template scope="scope">
			        <el-button type="text" size="small" @click="updateStrategy(scope.row)" v-if="hasPermission">修改</el-button>
			      </template>
			    </el-table-column>
			</el-table>
      <el-pagination @current-change="currentChange" :current-page.sync="firstPage" layout="total,prev, pager, next" :page-size="10" :total="strategySize" v-if="strategySize > 0">
      </el-pagination>
		</div>
	</div>
</template>
<script>
	export default {
	    data() {
	    	var validatestrategyName = (rule, value, callback) => {
	    		if(value === ''){
	    			callback(new Error('请输入策略名称'));
	    		}else{
	    			if(value.length > 255){
	    				callback(new Error('策略名称长度不能大于255'));
	    			}else{
	    				callback();
	    			}
	    		}
	    	};
	    	var validatestrategyEName = (rule, value, callback) => {
	    		if(!value){
	    			callback(new Error('请输入策略简称'));
	    		}else{
	    			if(value.length > 255){
	    				callback(new Error('策略简称长度不能大于255'));
	    			}else{
	    				callback();
	    			}
	    		}
	    	};
	    	var validateDesc = (rule, value, callback) => {
	    		if(!value){
	    			callback(new Error('请输入策略描述'));
	    		}else{
	    			if(value.length > 2000){
	    				callback(new Error('描述长度不能大于2000'));
	    			}else{
	    				callback();
	    			}
	    		}
	    	};
	    	return {
	    		firstPage:1,
		      	strategy:[],
		      	strategyPage:[],
		      	strategySize:0,
		      	title:'新增策略',
		      	addStrategyWin:false,
          hasPermission:false,
		      	addStrategyForm:{
		      		strategyName:'',
              strategyename:'',
		      		desc:'',
		      		strategyId:''
		      	},
		      	rulesForm:{
		      		strategyName:[
		      			{ required: true,validator:validatestrategyName, trigger: 'blur' }
		      		],
              strategyename:[
		      			{ required: true,validator:validatestrategyEName, trigger: 'blur' }
		      		],
		      		desc:[
		      			{ required: true,validator:validateDesc, trigger: 'blur' }
		      		]
		      	}
	      	}
	  	},
	  	mounted(){
	  		this.getAllStategy();
        var tmpThis = this;
        $.ajax({
          url:  '/fx-mock/fx-mock-service/hasPermission',
          type: "POST",
          data: {"code" : "strategyConfig"},
          async: true,
          success: function(response) {
            tmpThis.hasPermission = response;
          }
        });
	  	},
	  	methods:{
	  		//查看全部策略类型
        getAllStategy(){
	  			this.$store.dispatch('getAllStategy').then(val => {
	  				this.strategy = val;
	  				this.strategySize = val.length;
	  				if(val <= 10){
	  					this.strategyPage = this.strategy.slice('0',this.strategy.length)
	  				}else{
	  					this.strategyPage = this.strategy.slice('0','10')
	  				}
	  			})
	  		},
	  		currentChange(val){
		    	this.strategyPage = this.strategy.slice((val - 1)*10,(val - 1)*10+10);
		    },
	  		openStrategyWin(){
	  			this.addStrategyWin = true;
          this.title = "新增策略";
	  			if(this.$refs.addStrategyForm){
	  				this.$refs.addStrategyForm.resetFields()
	  			}
	  			this.addStrategyForm = {
		      		strategyName:'',
		      		desc:'',
		      		strategyId:''
		      	}
	  		},
	  		submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          if (valid) {
		          	if(this.title === '修改策略'){
		          		this.$store.dispatch('updateStrategy',this.addStrategyForm).then(val => {
				    		if(val.data = 1){
				    			this.addStrategyWin = false;
			  					this.$refs[formName].resetFields()
			  					if(val.status == '200'){
			  						this.$message.success(val.message);
                    this.getAllStategy();
			  					}else{
			  						this.$message.error(val.message);
			  					}
			  				}
				    	})
		          	}else{
			            this.$store.dispatch('addStrategy',this.addStrategyForm).then(val => {
			  				if(val.data = 1){
			  					this.addStrategyWin = false;
			  					this.$refs[formName].resetFields()
			  					if(val.status == '200'){
			  						this.$message.success(val.message);
                    this.getAllStategy();
			  					}else{
			  						this.$message.error(val.message);
			  					}
			  				}
			  			});
			  		}
		          } else {
		            return false;
		          }
		        });
		    },
		    resetForm(formName){
		    	this.$refs[formName].resetFields();
		    	this.addStrategyWin = false;
		    	this.addStrategyForm = {
		      		strategyName:'',
              strategyename:'',
		      		desc:'',
		      		strategyId:''
		      	}
		    },
		    //删除
		    deleteStrategy(row,index){
		    	this.$confirm('此操作将永久删除该产线, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
			    	var strategyId = row.strategyid;
			    	this.$store.dispatch('deleteStrategy',strategyId).then(val => {
			    		if(val.data = 1){
		  					if(val.status == '200'){
		  						this.$message.success(val.message);
		  						this.strategyPage.splice(index,1);
		  						this.strategySize = this.strategySize - 1;
		  					}else{
		  						this.$message.error(val.message);
		  					}
		  				}
			    	})
			    }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });
		        });
		    },
		    //修改
		    updateStrategy(row){
		    	this.addStrategyWin = true;
		    	this.title = '修改策略';
		    	if(this.$refs.addStrategyForm){
	  				this.$refs.addStrategyForm.resetFields()
	  			}
		    	this.addStrategyForm.strategyId = row.strategyid;
		    	this.addStrategyForm.strategyName = row.strategyname;
		    	this.addStrategyForm.desc = row.strategydesc;
		    	this.addStrategyForm.strategyename = row.strategyename;
		    }
	  	}
	}
</script>
<style>
	.strategy-wrap{
		text-align: left;
	}
	.strategy-list{
		margin-top:20px;
		height: 450px;
	}
	.strategy-wrap .el-table__body-wrapper{
		text-align: left;
		font-size: 12px;
	}
	.strategy-wrap .el-icon-loading{
		display: none
	}
	.strategy-wrap .el-pagination{
		text-align: center;
		margin-top:10px;
	}
</style>
