<template>
  <div class="application-wrapper">
    <div style="margin: 15px;">
      <el-button type="primary" size="normal" @click="openApplicationWin" style="margin-right: 30px;" v-if="hasPermission">新增应用</el-button>
      <el-autocomplete placeholder="请输入内容" v-model="searchvalue" :fetch-suggestions="querySearch" @select="handleSelect"
                       style="width:400px;">
        <el-select v-model="searchtype" slot="prepend" placeholder="请选择" style="width:100px;" @change="searchvalue=''">
          <el-option label="产线名" value="1"></el-option>
          <el-option label="应用名" value="2"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getAllApplicationBySearch"></el-button>
      </el-autocomplete>
    </div>
    <el-dialog :title="title" :visible.sync="addApplicationWin" size="small" :show-close="title=='详细信息'" :close-on-click-modal=false>
      <template>
        <el-form :model="addLineForm" :rules="rulesForm" ref="addLineForm" label-width="100px">
          <el-form-item label="产线" prop="productlinename">
            <el-select v-model="addLineForm.productlinename" placeholder="请选择产线" @change="productLineSelectChange(addLineForm.productlinename)" filterable :disabled="title=='修改应用'">
              <el-option v-for="item in productLines" :key="item.producelineId" :label="item.productLineName" :value="item.productLineName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="applicationName">
            <el-tooltip class="item" effect="dark" :content="content" placement="top-start">
              <el-select v-model="addLineForm.applicationName" filterable placeholder="请选择应用" :disabled="title=='修改应用'">
                <el-option v-for="item in applicationsForFilter" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <!--<el-input v-model="addLineForm.applicationName" auto-complete="off" :disabled="title=='修改应用'"></el-input>-->
              <!--<el-autocomplete v-model="addLineForm.applicationName" auto-complete="on" :fetch-suggestions="queryApplicationNameByProdLine" placeholder="请输入应用名称" clearable></el-autocomplete>-->
            </el-tooltip>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="addLineForm.desc" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer" v-if="title!='详细信息'">
        <el-button type="text"    @click="resetForm()">取 消</el-button>
        <el-button type="primary" @click="submitForm('addLineForm')">提 交</el-button>
      </div>
    </el-dialog>
    <div class="application-list">
      <el-table :data="applicationPage" v-loading="isloading" style="width:100%">
        <el-table-column prop="productLine.productLineName" label="产线"></el-table-column>
        <el-table-column prop="application.applicationName" label="应用名称"></el-table-column>
        <el-table-column prop="application.applicationDesc" label="描述"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <!--<el-button type="text" size="small" @click="detailApplication(scope.row)">详细</el-button>-->
            <el-button type="text" size="small" @click="updateApplication(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="deleteApplication(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" :current-page.sync="firstPage" layout="total,prev, pager, next" :page-size="10" :total="applicationSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      var validateProductLineName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择产线'))
        } else {
          if (value.length > 255) {
            callback(new Error('产线名称长度不能大于255'))
          } else {
            callback();
          }
        }
      };
      var validateApplicationName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入应用名称'))
        } else {
          if (value.length > 255) {
            callback(new Error('应用名称长度不能大于255'))
          } else {
            callback();
          }
        }
      };
      var validateDesc = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入描述'))
        } else {
          if (value.length > 255) {
            callback(new Error('描述长度不能大于255'))
          } else {
            callback();
          }
        }
      };
      return {
        cpAddLineForm: {},
        content:'请输入应用的英文名称',
        firstPage: 1,
        isloading:false,
        applications: [],
        applicationPage: [],
        applicationSize: 0,
        title: "新增应用",
        searchtype: '1',
        searchvalue: '',
        addApplicationWin: false,
        hasPermission: false,
        addLineForm: {
          applicationName: '',
          applicationId: '',
          desc: '',
          productlineinfo: {},
          productlinename: ''
        },
        applicationsForFilter:[],
        productLines: [],
        personInfo: [],
        monitorInfo: [],
        rulesForm: {
          productlinename: [
            {required: true, validator: validateProductLineName, trigger: 'blur'}
          ],
          applicationName: [
            {required: true, validator: validateApplicationName, trigger: 'blur'}
          ],
          desc: [
            {required: true, validator: validateDesc, trigger: 'blur'}
          ]
        },
        autoCompleteProductLineList: [], //自动补全产线名称list
        autoCompleteApplicationList: [] //自动补全应用名称list
      }
    },
    mounted(){
      this.getAllApplication();
      this.getAllProductLine();
      this.cpAddLineForm = JSON.parse(JSON.stringify(this.addLineForm));
    },
    methods: {
      //查询智能提示
      querySearch(queryString, cb){
        //查询类型（1:产线名;2:应用名;3:人员名）
        var searchtype = this.searchtype;
        var results = '';
        if (searchtype == '1') {
          var productLines = this.$data.autoCompleteProductLineList;
          results = queryString ? productLines.filter(this.createFilter(queryString)) : productLines;
        } else if (searchtype == '2') {
          var applicationLists = this.$data.autoCompleteApplicationList;
          results = queryString ? applicationLists.filter(this.createFilter(queryString)) : applicationLists;
        }
        cb(results);
      },
      createFilter(queryString) {
        return (obj) => {
          return (obj.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
        };
      },
      //自动补全选择处理方法
      handleSelect(item){
        this.isloading = true;
        this.$store.dispatch('getAllApplicationBySearch', {
          searchType: this.searchtype,
          searchValue: item.value
        }).then(val => {
          this.applications = val;
          this.applicationSize = val.length;
          if (val <= 10) {
            this.applicationPage = this.applications.slice('0', this.applications.length)
          } else {
            this.applicationPage = this.applications.slice('0', '10')
          }
          this.isloading = false;
        })
      },
      //查看全部应用
      getAllApplication(){
        this.isloading = true;
        this.$store.dispatch('getApplication').then(val => {
          this.applications = val;
          this.applicationSize = val.length;
          if (val <= 10) {
            this.applicationPage = this.applications.slice('0', this.applications.length)
          } else {
            this.applicationPage = this.applications.slice('0', '10')
          }
          //生成全部应用自动补全list
          var applicationArray = [];
          for (var item in val) {
            var tempObj = {
              value: val[item].application.applicationName,           //中文名称
              applicationName: val[item].application.applicationName, //中文名称
              applicationId: val[item].application.applicationId //id
            };
            applicationArray.push(tempObj);
          }
          this.autoCompleteApplicationList = applicationArray;
          this.isloading = false;
        })
      },
      //根据类型返回应用
      getAllApplicationBySearch(){
        this.isloading = true;
        this.$store.dispatch('getAllApplicationBySearch', {
          searchType: this.searchtype,
          searchValue: this.searchvalue
        }).then(val => {
          this.applications = val;
          this.applicationSize = val.length;
          if (val <= 10) {
            this.applicationPage = this.applications.slice('0', this.applications.length)
          } else {
            this.applicationPage = this.applications.slice('0', '10')
          }
          this.isloading = false;
        })
      },
      //获得全部产线
      getAllProductLine(){
        this.$store.dispatch('getAllProductLine').then(val => {
          this.productLines = val;
          if (val != null && val.length > 0) {
              this.hasPermission = true;
          }
          //生成全部产线自动补全list
          var productLineArray = [];
          for (var item in val) {
            var tempObj = {
              value: val[item].productLineName,//中文名称
              productLineName: val[item].productLineName, //中文名称
              eproductLineName: val[item].eproductLineName, //英文名称
              productLineId: val[item].productLineId //id
            };
            productLineArray.push(tempObj);
          }
          this.autoCompleteProductLineList = productLineArray;
        })
      },
      //点击添加新的应用
      openApplicationWin(){
        this.title = "新增应用";
        //重置界面
        this.resetForm();
        this.addApplicationWin = true;
      },
      currentChange(val){
        this.applicationPage = this.applications.slice((val - 1) * 10, (val - 1) * 10 + 10);
      },
      //重置界面
      resetForm(){
        this.addLineForm = JSON.parse(JSON.stringify(this.cpAddLineForm));
        this.activeName = 'first';
        this.addApplicationWin = false;
      },
//      保存 或者修改
      submitForm(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.title == '新增应用') {
              //新增应用
              this.$store.dispatch('addApplication', this.addLineForm).then(val => {
                if (val.status == '200') {
                  this.$message.success(val.message);
                  this.getAllApplication();
                  this.resetForm();
                  this.firstPage = 1;
                } else {
                  this.$message.error(val.message);
                }
              })
            } else {
//                更新应用
                this.$confirm('确定要提交修改吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$store.dispatch('updateApplication', this.addLineForm).then(val => {
                    if (val.status == '200') {
                      this.$message.success(val.message);
                      this.getAllApplication();
                      this.resetForm();
                      this.firstPage = 1;
                    } else {
                      this.$message.error(val.message);
                    }
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消修改'
                  });
                });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //删除应用
      deleteApplication(row){
        this.$confirm('此操作将删除该应用，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var applicationId = row.application.applicationId;
          this.$store.dispatch('deleteApplication', applicationId).then(val => {
            if (val.status == '200') {
              this.$message.success(val.message);
              this.getAllApplication();
              this.resetForm();
              this.firstPage = 1;
            } else {
              this.$message.error(val.message);
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //修改应用
      updateApplication(row){
        this.resetForm();
        this.title = "修改应用";
        this.addApplicationWin = true;
        this.addLineForm.applicationName = row.application.applicationName;
        this.addLineForm.applicationId = row.application.applicationId;
        this.addLineForm.desc = row.application.applicationDesc;
        this.addLineForm.productlineinfo = row.productLine;
        this.addLineForm.productlinename = row.productLine.productLineName;
      },
      //详细
      detailApplication(row){
        this.title = "详细信息";
        this.addApplicationWin = true;
      },
      //下拉框change
      productLineSelectChange(value){
        for (let i = 0; i < this.productLines.length; i++) {
          if (this.productLines[i].productLineName == value) {
            this.addLineForm.productlineinfo = this.productLines[i];
            break;
          }
        }
        /***********************根据产线获取产线下的应用****************************/
        this.addLineForm.applicationName = '';
        let _this = this;
        let eproductLineName = '';
        for(var i=0;i<this.productLines.length;i++){
          let element = this.productLines[i];
          if(element.productLineName == _this.addLineForm.productlinename){
            eproductLineName = element.eproductLineName;
            break;
          }
        }
        this.$store.dispatch('queryApplicationsByProdLine', eproductLineName).then(val => {
//          let applicationNameList = [];
          _this.applicationsForFilter = [];
        if(val.status == '200'){
          for (var item in val.data) {
            var tempObj = {
              value: val.data[item],
              lable: val.data[item]
            };
            _this.applicationsForFilter.push(tempObj);
          }
        }else{
          this.$message.error(val.message);
        }
      });
        /***************************************************/
      }
    }
  }
</script>
<style>
  .application-wrapper {
    text-align: left;
  }

  .application-list {
    margin-top: 20px;
    height: 450px;
  }

  .application-wrapper .el-table__body-wrapper {
    text-align: left;
    font-size: 12px;
  }

  .application-wrapper .el-icon-loading {
    display: none
  }

  .application-wrapper .el-pagination {
    text-align: center;
    margin-top: 10px;
  }
</style>
