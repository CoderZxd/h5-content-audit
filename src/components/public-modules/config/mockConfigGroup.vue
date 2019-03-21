<template xmlns="http://www.w3.org/1999/html">
  <div class="strategy-wrap">
    <el-button type="primary" size="normal" @click="openGroupWin" v-if="hasPermission">新增分组配置</el-button>
    <el-dialog :title="title" :visible.sync="addMockGroupWin" size="tiny" width="60%" :show-close="false">
      <el-form :model="addMockConfigGroupForm" :rules="rulesForm" ref="addMockConfigGroupForm" label-width="110px">
        <el-row>
          <el-col :span="1" v-show="false">
            <el-form-item label="id"  prop="mockname">
              <el-input v-model="addMockConfigGroupForm.id" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分组名称"  prop="mockname">
              <el-input v-model="addMockConfigGroupForm.name" placeholder="请输入分组名称" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分组描述"  prop="desc">
              <el-input v-model="addMockConfigGroupForm.desc" type="textarea" placeholder="请输入分组描述" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text"  @click="resetForm('addMockConfigGroupForm')">取 消</el-button>
        <el-button type="primary"  @click="submitForm('addMockConfigGroupForm')">提 交</el-button>
      </div>
    </el-dialog>
   <div class="mockconfig-list">
      <el-table :data="mockconfigGroupPage"  style="width:100%" v-loading="loading">
        <el-table-column prop="name" label="分组名称"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="text" size="small" @click="updateGroup(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="deleteGroup(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" :current-page.sync="firstPage" layout="total,prev, pager, next" :page-size="10" :total="mockconfigGroupSize" v-if="mockconfigGroupSize > 0">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import ElRow from "element-ui/packages/row/src/row";
  import Clipboard from 'clipboard';
  export default {
    components: {ElRow}, data() {
      var validatename = (rule, value, callback) => {
          console.log(value);
        if(!value || value === ''){
          callback(new Error('请输入分组名称'));
        }else{
          if(value.length > 64){
            callback(new Error('名称长度不能大于64'));
          }else{
            callback();
          }
        }
      };

      var validateDesc= (rule, value, callback) => {
        console.log(value);
        if(!value || value === ''){
          callback(new Error('请输入分组名称'));
        }else{
          if(value.length > 255){
            callback(new Error('描述长度不能大于255'));
          }else{
            callback();
          }
        }
      };

      return {
        requestType:[
          {
            id:'get',
            name:'Get'
          },{
            id:'post',
            name:'Post'
          }
        ],
        firstPage:1,
        loading: false,
        mockconfigGroupPage:[],
        mockGroup: [],
        mockconfigGroupSize:0,
        title:'新增分组配置',
        hasPermission: false,
        addMockGroupWin: false,
        addMockConfigGroupForm:{
          id:-1,
          name:'',
          desc:'',
          createtime: '',
          updatetime:'',
          createtime: '',
          updatetime:''
        },
        rulesForm:{
          name:[
            { required: true,validator:validatename, trigger: 'blur' }
          ],
          desc:[
            { required: true,validator:validateDesc, trigger: 'blur' }
          ]
        }
      }
    },
    mounted(){
      this.getAllGroup();
    },
    methods: {
      //检查产线
      getAllGroup(){
        this.$store.dispatch('getAllMockConfigGroup').then(val => {
          this.hasPermission = true;
          this.mockGroup = val;
          this.mockconfigGroupSize = val.length;
          if (val <= 10) {
            this.mockconfigGroupPage = this.mockGroup.slice('0', this.mockGroup.length)
          } else {
            this.mockconfigGroupPage = this.mockGroup.slice('0', '10')
          }
        })
      },
      currentChange(val){
        this.mockconfigGroupPage = this.mockGroup.slice((val - 1) * 10, (val - 1) * 10 + 10);
      },
      openGroupWin(){
        this.addMockGroupWin = true;
        this.title = "新增分组";
        this.resetAllParam();
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.title === '修改分组') {
              this.$store.dispatch('updateMockConfigGroup', this.addMockConfigGroupForm).then(val => {
                if (val.data = 1) {
                  this.addMockGroupWin = false;
                  this.resetForm(formName);
                  if (val.status == '200') {
                    this.$message.success(val.message);
                    this.getAllGroup();
                  } else {
                    this.$message.error(val.message);
                  }
                }
              })
            } else {
              this.$store.dispatch('addMockConfigGroup', this.addMockConfigGroupForm).then(val => {
                if (val.data = 1) {
                  this.addMockGroupWin = false;
                  this.resetForm(formName);
                  if (val.status == '200') {
                    this.$message.success(val.message);
                    this.getAllGroup();
                  } else {
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
        this.addMockGroupWin = false;
        this.resetAllParam();
      },
      resetAllParam(){
        this.title = "新增挡板配置";
        this.addMockConfigGroupForm = {
          id:-1,
          name:'',
          desc:'',
          createtime: '',
          updatetime:'',
          createtime: '',
          updatetime:''
        };
        if (this.$refs.addMockConfigForm) {
          this.$refs.addMockConfigForm.resetFields();
        }
      },
      //删除
      deleteMockConfigGroup(row, index){
        this.$confirm('此操作将永久删除该分组配置, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var id = row.id;
          this.$store.dispatch('deleteMockConfigGroup', id).then(val => {
            if (val.data = 1) {
              if (val.status == '200') {
                this.$message.success(val.message);
                this.mockconfigGroupPage.splice(index, 1);
                this.mockconfigGroupSize = this.mockconfigGroupSize - 1;
              } else {
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
      updateGroup(row){
        this.addMockGroupWin = true;
        this.title = '修改分组';
        if (this.$refs.addMockConfigGroupForm) {
          this.$refs.addMockConfigGroupForm.resetFields()
        }
        this.addMockConfigGroupForm = row;
      }
    }
  }
</script>
<style lang="scss" scoped>

  .container-infor {
    margin: 10px 10px 0;
    line-height: 28px;
    border: 1px solid #d9dee4;
    background-color: #fff;

    .fb {
      float: left;
      width: 30%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-bottom: 1px dashed #d9dee4;
      border-right: 1px dashed #d9dee4;
      width: 130px;
    }
    ul li{
      list-style: none;
      list-style-type:none;
    }
  }

  .clone {
    .el-row {
      margin-top: 20px;
    }
  }
</style>
<style>
  .strategy-wrap{
    text-align: left;
  }
  .mockconfig-list{
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
  hr.style-one {/*内嵌水平线*/
    width:100%;
    margin:0 auto;
    border: 0;
    height: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
</style>
