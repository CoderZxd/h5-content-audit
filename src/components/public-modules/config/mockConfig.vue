<template xmlns="http://www.w3.org/1999/html">
  <div class="strategy-wrap">
    <el-button type="primary" size="normal" @click="openStrategyWin" v-if="hasPermission">新增挡板配置</el-button>
    <el-autocomplete placeholder="请输入查询内容" v-model="searchvalue" :title="searchvalue" :fetch-suggestions="querySearch" @select="handleSelect"
                     style="width:500px;margin-left: 20px;">
      <el-select v-model="searchtype" slot="prepend" placeholder="请选择" style="width:120px;" @change="searchvalue=''">
        <el-option label="应用名称" value="1"></el-option>
        <el-option label="策略类型" value="2"></el-option>
        <el-option label="挡板名称" value="3"></el-option>
        <el-option label="请求路径" value="4"></el-option>
        <el-option label="命名空间" value="5"></el-option>
        <el-option label="容器标签" value="6"></el-option>
        <el-option label="挡板分组" value="7"></el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="getAllMockConfigBySearch" title="查询"></el-button>
    </el-autocomplete>
    <el-dialog :title="title" :visible.sync="addMockWin" size="tiny" width="80%" :show-close="false">
      <div v-show="!this.test">
        <el-form :model="addMockConfigForm" :rules="rulesForm" ref="addMockConfigForm" label-width="110px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="策略类型"  prop="strategyename">
                <el-select v-model="addMockConfigForm.strategyename" placeholder="请选择策略类型" filterable @change="strategyChange(addMockConfigForm.strategyename)">
                  <el-option v-for="item in strategy" :key="item.strategyename" :title="item.strategydesc" :label="item.strategyname" :value="item.strategyename">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="挡板分组"  prop="groupid">
                <el-select v-model="addMockConfigForm.groupid" placeholder="请选择分组" filterable>
                  <el-option v-for="item in groups" :key="item.id" :label="item.value" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="挡板名称"  prop="mockname">
                <el-input v-model="addMockConfigForm.mockname" placeholder="请输入挡板名称" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="挡板描述"  prop="desc">
                <el-input v-model="addMockConfigForm.desc" type="textarea" placeholder="请输入挡板描述" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="应用名称"  prop="applicationid">
                <el-select v-model="addMockConfigForm.applicationid" placeholder="请选择应用" filterable @change="applicationChange">
                  <el-option v-for="item in applications" :key="item.application.applicationId" :label="item.application.applicationName" :value="item.application.applicationId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="容器命名空间"  prop="namespace">
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    容器命名空间可不设置。<br/>
                    应用发起挡板请求会先根据容器命名空间匹配策略;<br/>
                    如果根据容器命名空间匹配不到策略，再匹配命名空间为空的策略。
                  </div>
                  <el-select v-model="addMockConfigForm.namespace" @change="changeNameSpace" placeholder="请选择容器命名空间" filterable >
                    <el-option v-for="item in namespaces" :key="item.namespace" :label="item.namespace" :value="item">
                      <el-tooltip class="item" effect="light" :content="'容器命名空间：'+item.namespace" placement="left">
                        <span style="float: left">{{ item.namespace }}</span>
                      </el-tooltip>
                      <el-tooltip class="item" effect="light" :content="'容器标签：'+item.userlabel" placement="right">
                        <el-tag style="float: right;">{{item.userlabel}}</el-tag>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="路由code"  prop="label" v-if="addMockConfigForm.strategyename == strategyEname.five || addMockConfigForm.strategyename == strategyEname.six">
                <el-select v-model="addMockConfigForm.routecode" placeholder="请选择路由code" filterable clearable >
                  <el-option v-for="item in routecodes" :key="item.routecode" :label="item.routecode" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
          <el-col :span="8" v-if="addMockConfigForm.strategyename != strategyEname.five&& addMockConfigForm.strategyename != strategyEname.six">
            <el-tooltip class="item" effect="light" placement="top">
              <div slot="content">如选择策略类型为<span style="color: red">透传</span>,请填写请求全路径</div>
              <el-form-item label="请求路径"  prop="requestpath">
                <el-input v-model.trim="addMockConfigForm.requestpath" placeholder="请输入请求路径" auto-complete="off"></el-input>
              </el-form-item>
            </el-tooltip>
          </el-col>
          <el-col :span="4"  v-if="addMockConfigForm.strategyename != strategyEname.five && addMockConfigForm.strategyename != strategyEname.six">
            <el-form-item label="请求类型"  prop="requesttype">
              <el-select v-model="addMockConfigForm.requesttype" placeholder="请选择请求类型" filterable>
                <el-option v-for="item in requestType" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          </el-row>

        </el-form>
        <!--1、策略1:JSON输入，JSON输出-->
        <div v-if="showStrategy.one">
          <el-form :model="strategyJSON" :rules="strategyJSONRules" ref="strategyJSONForm" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="JSON输入" prop="JSONInput">
                  <el-input v-model="strategyJSON.JSONInput" type="textarea" :rows="5" placeholder="请输入JSON输入信息" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <!--<el-col :span="2">-->
              <!--<el-form-item><i class="el-icon-d-arrow-right"></i></el-form-item>-->
              <!--</el-col>-->
              <el-col :span="8">
                <el-form-item label="JSON输出" prop="JSONOutput">
                  <el-input v-model="strategyJSON.JSONOutput" type="textarea" :rows="5" placeholder="请输入JSON输出信息" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    <strong>输入输出参数是否需要匹配正则表达式.</strong>例如:<br/>
                    1.JSON输入{"name":"zhangsan","age":20},JSON输出可配置为:{"msg":"Hello <span style="color: red">#{name}</span>","status":200},则匹配到该规则后,JSON返回为:{"msg":"Hello <span style="color: red">zhangsan</span>","status":200};<br/>
                    2.JSON输入{"name":"zhang<span style="color: red">#{\\d.*}</span>","age":20},JSON输出可配置为:{"msg":"Hello <span style="color: red">#{name}</span>","status":200},如果JSON输入为{"name":"zhang<span style="color: red">6san</span>","age":20},则可以匹配到该规则,JSON返回为:{"msg":"Hello <span style="color: red">zhang6san</span>","status":200};
                  </div>
                  <el-checkbox v-model="strategyJSON.isRegExp" style="margin-left: 20px">匹配正则表达式</el-checkbox>
                </el-tooltip>
              </el-col>
              <el-col :span="4">
                <el-form-item label="延迟返回(ms)"  prop="delay">
                  <el-input-number v-model="strategyJSON.delay" :min="0" :step=100 ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row><el-checkbox v-model="strategyJSON.iscallback">是否回调</el-checkbox></el-row>
            <template v-if="strategyJSON.iscallback">
              <el-row>
                <el-col :span="16">
                  <el-form-item label="Callback地址"  prop="callback">
                    <el-input v-model="strategyJSON.callback" placeholder="请输入回调Url" auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="Callback参数"  prop="callbackparams">
                    <el-input v-model="strategyJSON.callbackparams" type="textarea" :rows="5" placeholder="请输入传入回调Url的参数(JSON格式)" auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-form>
        </div>
        <!--2、策略2：透传-->
        <div v-else-if="showStrategy.two"></div>
        <!--3、策略3：逻辑处理-->
        <div v-else-if="showStrategy.three">
          <!--当一个 form 元素中只有一个输入框时，在该输入框中按下回车应提交该表单。如果希望阻止这一默认行为，可以在 <el-form> 标签上添加 @submit.native.prevent-->
          <el-form :model="strategyCompute"  ref="strategyComputeForm" label-width="80px" @submit.native.prevent>
            <el-form-item label="输入参数" title="输入参数配置">
              <el-tag style="margin-left: 5px;cursor: pointer" :key="param" v-for="param in strategyCompute.params" :closable="true" :close-transition="false" @close="removeParam(param)" @click.native="clickTag(param)">{{param}}</el-tag>
              <el-input size="small" style="width: 200px;" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
              <el-button v-else size="small" @click="showInput">+ 新增参数</el-button>
            </el-form-item>
            <el-form-item label="操作符号" title="操作符">
              <el-tag style="margin-left: 5px;cursor: pointer" :key="operator" v-for="operator in operators" :closable="false" :close-transition="false" @click.native="clickOperator(operator)">{{operator}}</el-tag>
            </el-form-item>
            <el-form-item label="计算表达式"  label-width="100px">
              <el-input v-model="strategyCompute.expression" type="textarea" :rows="5" placeholder="请配置计算表达式" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!--4、策略4：加解密-->
        <div v-else-if="showStrategy.four">four</div>
        <!--5、策略5：mock挡板-->
        <div v-if="showStrategy.five">
          <el-form :model="strategyDubbo" :rules="strategyDubboRules" ref="strategyDubboForm" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">请填写需要拦截的接口的<span style="color: red">包名+接口名</span><br/>例如：com.intermap.test.service.TestDubboService</div>
                  <el-form-item label="请求接口"  prop="interfaceName">
                    <el-input v-model.trim="strategyDubbo.interfaceName" placeholder="请输入请求接口" auto-complete="off"></el-input>
                  </el-form-item>
                </el-tooltip>
              </el-col>
              <el-col :span="8">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">请填写需要拦截的接口的方法名称，不需要带括号</div>
                  <el-form-item label="请求方法"  prop="method">
                    <el-input v-model.trim="strategyDubbo.method" placeholder="请输入请求方法" auto-complete="off"></el-input>
                  </el-form-item>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <el-form-item label="方法参数">
                  <el-button type="primary" size="small" icon="el-icon-plus" @click="addParamItem"></el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="paramList.length>0">
              <el-col :span="20" >
                <el-form-item label="    ">
                  <el-table :data="paramList" border style="width: 100%">
                    <el-table-column  align="center" label="参数序号" width="180">
                      <template slot-scope="scope">
                          <p>param{{ scope.$index }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="参数类型" width="180">
                      <template slot-scope="scope">
                        <el-select v-model=" scope.row.type" placeholder="请选择参数类型" filterable @change="paramChange( scope.row,  scope.$index)">
                          <el-option v-for="item in paramTypes" :key="item.value" :title="item.label" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="address" align="center" label="参数类名" >
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="light" placement="top">
                          <div slot="content">请填写参数的类名，包括<span style="color: red">包名+类名</span><br/>例如：com.intermap.test.entity.TestEntity</div>
                            <el-input v-model=" scope.row.path" :disabled=" scope.row.type!='custom'" placeholder="请输入参数的类名" auto-complete="off"></el-input>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="180">
                      <template slot-scope="scope">
                        <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteParam(scope.$index)" ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="false && strategyDubbo.method && strategyDubbo.interfaceName">
              <el-col :span="24">
                <el-form-item label="接口预览">
                  <br/>
                  <span style="color: blue">{{strategyDubbo.interfaceName}}.{{strategyDubbo.method}} ( </span>
                  <span style="color: green" v-for="(item,index) in paramList"><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.path}}&nbsp;&nbsp;param{{index}}<span v-if="index<paramList.length -1">,</span></span>
                  <span v-if="paramList.length>0"><br/></span>
                  <span style="color: blue">)</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <el-form-item label="动态返回" prop="isRegExp">
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content">
                      需要动态计算的结果，用 <span style="color: red">#{动态计算表达式}</span> 的形式来插入动态计算的表达式，
                      <br/>
                      表达式支持基本的四则运算和三元表达式；<br>可以支持基本的js语句，比如var定义变量，if、for等进行逻辑控制，但<span style="color: red">不支持直接的return</span>,如有多行js计算，默认取逻辑上的最后一行。
                      <br/>
                      输入参数如果是基本类型，直接填写可用参数对应的参数即可；如果是复杂类型，可以使用<span style="color: red"> . </span>选择子属性，比如param0.user[0].order.id
                    </div>
                    <el-checkbox v-model="strategyDubbo.isRegExp" style="margin-left: 20px">是否需要动态返回</el-checkbox>
                  </el-tooltip>
                  </el-form-item>
              </el-col>
              <el-col :span="3" v-if="strategyDubbo.isRegExp" >
                <el-form-item label="" prop="isExpression">
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content">
                      计算表达式相当于编程中的函数的概念<br/>
                      动态返回的计算公式比较复杂的话，可以拆分到计算表达式中。相当于编程中的拆分函数 <br/>
                      计算表达式语法跟动态计算的语法一样，但 <span style="color: red">无需#{}标记</span>，直接填写即可。 <br/>
                      计算表达式可以相互嵌套，但<span style="color: red">不允许循环引用，也不允许引用自己，即不可递归</span>。
                    </div>
                    <el-checkbox v-model="strategyDubbo.isExpression" style="margin-left: 20px">是否需要计算表达式</el-checkbox>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="3" v-if="strategyDubbo.isRegExp" >
                <el-form-item label="">
                  <i :class="!showExplain?'el-icon-arrow-down':'el-icon-arrow-up'" @click="showExplain=!showExplain">语法说明</i>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="showExplain && strategyDubbo.isRegExp">
              <el-col :span="24">
                <el-form-item label="语法说明">
                  需要动态计算的结果，用  <span style="color: red">#{动态计算表达式} </span>的形式来插入动态计算的表达式<br/>
                  语法支持js语法，但是不支持<span style="color: red">return</span> ,默认取逻辑上最后一行的结果<br/>
                  支持复杂类型的子属性选择，例如param0.order.user.name
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="showExplain && strategyDubbo.isRegExp&&paramList.length+expressionList.length>0">
              <el-col :span="24">
                <el-form-item label="可用参数">
                  <el-tooltip class="item" effect="light" placement="top" v-for="param,index in paramList" >
                    <div slot="content">参数类型：{{param.path}}</div>
                    <el-tag style="margin-left: 5px;cursor: pointer" class="tag-read" :closable="false" :close-transition="false" :data-clipboard-text="'param'+index" @click.native="clickParams('param'+index)">{{'param'+index}}</el-tag>
                  </el-tooltip>
                  <el-tag style="margin-left: 5px;cursor: pointer" v-if="strategyDubbo.isExpression" class="tag-read" v-for="expression,index in expressionList" :closable="false" :close-transition="false" :data-clipboard-text="'expression'+index" @click.native="clickParams('expression'+index)">{{'expression'+index}}</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="showExplain && strategyDubbo.isRegExp">
              <el-col :span="24">
                <el-form-item label="可用计算">
                  <el-tag style="margin-left: 5px;cursor: pointer" class="tag-read" :key="operator" v-for="operator in regOperators" :closable="false" :close-transition="false" :data-clipboard-text="operator" @click.native="clickParams(operator)">{{operator}}</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="strategyDubbo.isRegExp && strategyDubbo.isExpression">
              <el-col :span="4">
                <el-form-item label="计算表达式">
                  <el-button type="primary" size="small" icon="el-icon-plus" @click="addExpressionItem"></el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="strategyDubbo.isRegExp && strategyDubbo.isExpression && expressionList.length>0">
              <el-col :span="20" >
                <el-form-item label="    ">
                  <el-table :data="expressionList" border style="width: 100%">
                    <el-table-column  align="center" label="表达式序号" width="180">
                      <template slot-scope="scope">
                        <p>expression{{ scope.$index }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="参数类名" >
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="light" placement="top">
                          <div slot="content">计算表达式语法跟动态计算的语法一样，但 <span style="color: red">无需#{}标记</span>，直接填写即可。 <br/>
                            计算表达式可以相互嵌套，但不允许循环引用。
                          </div>
                          <el-input v-model="scope.row.expression" placeholder="计算表达式"  :autosize="true" @blur="paramBlur(scope.$index)" auto-complete="off" type="textarea"></el-input>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="180">
                      <template slot-scope="scope">
                        <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteExpression(scope.$index)" ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item label="返回结果" prop="JSONOutput">
                  <el-button type="primary" size="small" icon="el-icon-plus" @click="addJsonOutputItem"></el-button>
                  <el-button size="small" type="warning" icon="iconfont-test icon-ceshi" @click="testJsonDialog">测试动态返回</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20" >
                <el-form-item label="    ">
                  <el-table :data="strategyDubbo.JSONOutput.JSONOutputList" border style="width: 100%">
                    <el-table-column align="center" label="是否生效" width="180">
                      <template slot-scope="scope">
                        <el-radio v-model="strategyDubbo.JSONOutput.JSONEnable" :label="scope.$index" @change="jsonchange" >{{scope.$index==strategyDubbo.JSONOutput.JSONEnable?" ":"不"}}生效</el-radio>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="返回结果" >
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="light" placement="top">
                          <div slot="content">
                            ①请填写返回结果，比如数字或者字符串<br/>②如果是复杂类型，请输入 <span style="color: red">结果对应的JSON字符串</span>
                            <span v-if="strategyDubbo.isRegExp">
                              <br/>
                              ③需要动态计算的结果，用  <span style="color: red">#{动态计算表达式} </span>的形式来插入动态计算的表达式，
                            表达式支持基本的四则运算和三元表达式；<br/>④支持基本的js语句，比如var定义变量，if、for等进行逻辑控制，但 <span style="color: red">不支持return</span>,如有多行js计算，默认取逻辑上的最后一行。
                            <br/>
                              ⑤输入参数如果是基本类型，直接填写可用参数对应的参数即可；如果是复杂类型，可以使用 <span style="color: red">. </span>选择子属性，比如param0.user[0].order.id
                            </span>
                          </div>
                          <el-input v-model="strategyDubbo.JSONOutput.JSONOutputList[scope.$index]" type="textarea" @blur="paramBlur('result'+scope.$index)" :autosize="true" placeholder="请输入返回结果信息" auto-complete="off"></el-input>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="180">
                      <template slot-scope="scope">
                        <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteJsonOutput(scope.$index)" ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!--6、策略6：java挡板-->
        <div v-if="showStrategy.six">
          <el-form :model="strategyJava" :rules="strategyJavaRules" ref="strategyDubboForm" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">请填写需要拦截的类的<span style="color: red">包名+类名</span><br/>例如：com.intermap.test.service.TestDubboService</div>
                  <el-form-item label="请求类名"  prop="className">
                    <el-input v-model.trim="strategyJava.className" placeholder="请输入要拦截的类名" auto-complete="off"></el-input>
                  </el-form-item>
                </el-tooltip>
              </el-col>
              <el-col :span="8">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">请填写需要拦截的接口的方法名称，不需要带括号</div>
                  <el-form-item label="请求方法"  prop="method">
                    <el-input v-model.trim="strategyJava.method" placeholder="请输入请求方法" auto-complete="off"></el-input>
                  </el-form-item>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <el-form-item label="方法参数">
                  <el-button type="primary" size="small" icon="el-icon-plus" @click="addParamItem"></el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="paramList.length>0">
              <el-col :span="20" >
                <el-form-item label="    ">
                  <el-table :data="paramList" border style="width: 100%">
                    <el-table-column  align="center" label="参数序号" width="180">
                      <template slot-scope="scope">
                        <p>param{{ scope.$index }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="参数类型" width="180">
                      <template slot-scope="scope">
                        <el-select v-model=" scope.row.type" placeholder="请选择参数类型" filterable @change="paramChange( scope.row,  scope.$index)">
                          <el-option v-for="item in paramTypes" :key="item.value" :title="item.label" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="address" align="center" label="参数类名" >
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="light" placement="top">
                          <div slot="content">请填写参数的类名，包括<span style="color: red">包名+类名</span><br/>例如：com.intermap.test.entity.TestEntity</div>
                          <el-input v-model=" scope.row.path" :disabled=" scope.row.type!='custom'" placeholder="请输入参数的类名" auto-complete="off"></el-input>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="180">
                      <template slot-scope="scope">
                        <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteParam(scope.$index)" ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="6">
                <el-form-item label="返回类型" >
                  <el-switch
                    v-model="strategyJava.JSONOutput.useJson"
                    active-text="执行自定义方法"
                    inactive-text="JSON输出"
                    inactive-color="#13ce66"
                    active-value=0
                    inactive-value=1>
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="strategyJava.JSONOutput.useJson==1">
              <el-col :span="3">
                <el-form-item label="动态返回" prop="isRegExp">
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content">
                      需要动态计算的结果，用 <span style="color: red">#{动态计算表达式}</span> 的形式来插入动态计算的表达式，
                      <br/>
                      表达式支持基本的四则运算和三元表达式；也可以支持基本的js语句，比如var定义变量，if、for等进行逻辑控制，但不支持直接的return,如有多行js计算，默认取逻辑上的最后一行。
                      <br/>
                      输入参数如果是基本类型，直接填写可用参数对应的参数即可；如果是复杂类型，可以使用 . 选择子属性，比如param0.user[0].order.id
                    </div>
                    <el-checkbox v-model="strategyJava.isRegExp" style="margin-left: 20px">是否需要动态返回</el-checkbox>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="3" v-if="strategyJava.isRegExp" >
                <el-form-item label="" prop="isExpression">
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content">
                      计算表达式相当于编程中的函数<br/>
                      动态返回的计算公式比较复杂的话，可以拆分到计算表达式中。 <br/>
                      计算表达式语法跟动态计算的语法一样，但无需#{}标记，直接填写即可。 <br/>
                      计算表达式可以相互嵌套，但不允许循环引用。
                    </div>
                    <el-checkbox v-model="strategyJava.isExpression" style="margin-left: 20px">是否需要计算表达式</el-checkbox>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="3" v-if="strategyJava.isRegExp" >
                <el-form-item label="">
                  <i :class="!showExplain?'el-icon-arrow-down':'el-icon-arrow-up'" @click="showExplain=!showExplain">语法说明</i>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="showExplain && strategyJava.isRegExp && strategyJava.JSONOutput.useJson==1">
              <el-col :span="24">
                <el-form-item label="语法说明">
                  需要动态计算的结果，用  <span style="color: red">#{动态计算表达式} </span>的形式来插入动态计算的表达式<br/>
                  语法支持js语法，但是不支持<span style="color: red">return</span> ,默认取逻辑上最后一行的结果<br/>
                  支持复杂类型的子属性选择，例如param0.order.user.name
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="showExplain && strategyJava.isRegExp&&paramList.length+expressionList.length>0&& strategyJava.JSONOutput.useJson==1">
              <el-col :span="24">
                <el-form-item label="可用参数">
                  <el-tooltip class="item" effect="light" placement="top" v-for="param,index in paramList" >
                    <div slot="content">参数类型：{{param.path}}</div>
                    <el-tag style="margin-left: 5px;cursor: pointer" :closable="false" :close-transition="false" @click.native="clickParams('param'+index)">{{'param'+index}}</el-tag>
                  </el-tooltip>
                  <el-tag style="margin-left: 5px;cursor: pointer" v-if="strategyDubbo.isExpression" v-for="expression,index in expressionList" :closable="false" :close-transition="false" @click.native="clickParams('expression'+index)">{{'expression'+index}}</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="showExplain && strategyJava.isRegExp&& strategyJava.JSONOutput.useJson==1">
              <el-col :span="24">
                <el-form-item label="可用计算">
                  <el-tag style="margin-left: 5px;cursor: pointer" :key="operator" v-for="operator in regOperators" :closable="false" :close-transition="false" @click.native="clickParams(operator)">{{operator}}</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="strategyJava.isRegExp&&strategyJava.isExpression&& strategyJava.JSONOutput.useJson==1">
              <el-col :span="4">
                <el-form-item label="计算表达式">
                  <el-button type="primary" size="small" icon="el-icon-plus" @click="addExpressionItem"></el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="strategyJava.isRegExp  && strategyJava.isExpression && expressionList.length>0&& strategyJava.JSONOutput.useJson==1">
              <el-col :span="20" >
                <el-form-item label="    ">
                  <el-table :data="expressionList" border style="width: 100%">
                    <el-table-column  align="center" label="表达式序号" width="180">
                      <template slot-scope="scope">
                        <p>expression{{ scope.$index }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="参数类名" >
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="light" placement="top">
                          <div slot="content">计算表达式语法跟动态计算的语法一样，但无需#{}标记，直接填写即可。 <br/>
                            计算表达式可以相互嵌套，但不允许循环引用。
                          </div>
                          <el-input v-model="scope.row.expression" placeholder="计算表达式"  :autosize="true" @blur="paramBlur(scope.$index)" auto-complete="off" type="textarea"></el-input>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="180">
                      <template slot-scope="scope">
                        <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteExpression(scope.$index)" ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="strategyJava.JSONOutput.useJson==1">
              <el-col :span="18">
                <el-form-item label="返回结果" prop="JSONOutput">
                  <el-button type="primary" size="small" icon="el-icon-plus" @click="addJsonOutputItem"></el-button>
                  <el-button size="small" type="warning" icon="iconfont-test icon-ceshi" @click="testJsonDialog">测试动态返回</el-button>
                 <!-- <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content">执行自定义类和方法优先于JSON输出，执行方法的参数要与拦截的请求方法参数完全一致</div>
                    <el-button size="small" type="info" :disabled="!this.JSONOutputFlag" @click="executeMyClassMethod">执行自定义类和方法</el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content">如果JSON输出的配置不生效，因为执行自定义类和方法优先于JSON输出</div>
                    <el-button size="small" type="info" :disabled="this.JSONOutputFlag" @click="executeMyClassMethod">JSON输出</el-button>
                  </el-tooltip>-->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="strategyJava.JSONOutput.useJson==1">
              <el-col :span="20" >
                <el-form-item v-if="this.JSONOutputFlag" label="    ">
                  <el-table :data="strategyJava.JSONOutput.JSONOutputList" border style="width: 100%">
                    <el-table-column align="center" label="是否生效" width="180">
                      <template slot-scope="scope">
                        <el-radio v-model="strategyJava.JSONOutput.JSONEnable" :label="scope.$index" @change="jsonchange" >{{scope.$index==strategyJava.JSONOutput.JSONEnable?" ":"不"}}生效</el-radio>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="返回结果" >
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="light" placement="top">
                          <div slot="content">
                            ①请填写返回结果，比如数字或者字符串<br/>②如果是复杂类型，请输入 <span style="color: red">结果对应的JSON字符串</span>
                            <span v-if="strategyDubbo.isRegExp">
                              <br/>
                              ③需要动态计算的结果，用  <span style="color: red">#{动态计算表达式} </span>的形式来插入动态计算的表达式，
                            表达式支持基本的四则运算和三元表达式；<br/>④支持基本的js语句，比如var定义变量，if、for等进行逻辑控制，但 <span style="color: red">不支持return</span>,如有多行js计算，默认取逻辑上的最后一行。
                            <br/>
                              ⑤输入参数如果是基本类型，直接填写可用参数对应的参数即可；如果是复杂类型，可以使用 <span style="color: red">. </span>选择子属性，比如param0.user[0].order.id
                            </span>
                          </div>
                          <el-input v-model="strategyJava.JSONOutput.JSONOutputList[scope.$index]" type="textarea" @blur="paramBlur('result'+scope.$index)" :autosize="true" placeholder="请输入返回结果信息" auto-complete="off"></el-input>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="180">
                      <template slot-scope="scope">
                        <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteJsonOutput(scope.$index)" ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="strategyJava.JSONOutput.useJson!=1">
              <el-col :span="8">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">请填写需要拦截的类的<span style="color: red">包名+类名</span><br/>例如：com.intermap.test.service.TestDubboService</div>
                  <el-form-item label="执行类名">
                    <el-input v-model.trim="strategyJava.JSONOutput.myClassName" placeholder="请输入要拦截的类名" auto-complete="off" @blur="checkMyClassMethod"></el-input>
                  </el-form-item>
                </el-tooltip>
              </el-col>
              <el-col :span="8">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">请填写需要拦截的接口的方法名称，不需要带括号</div>
                  <el-form-item label="执行方法">
                    <el-input v-model.trim="strategyJava.JSONOutput.myMethod" placeholder="请输入请求方法" auto-complete="off" @blur="checkMyClassMethod"></el-input>
                  </el-form-item>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div v-if="this.test">
        <el-form :model="testJsonOutput" :rules="testJsonOutputRules" ref="testJsonOutputForm" label-width="100px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="参数信息">
                <el-table :data="paramList" border style="width: 100%">
                  <el-table-column  align="center" label="参数序号" width="180">
                    <template slot-scope="scope">
                      <p>param{{ scope.$index }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" align="center" label="参数类名" >
                    <template slot-scope="scope">
                      <el-input v-model=" scope.row.path" auto-complete="off" disabled="true"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="参数值">
                    <template slot-scope="scope">
                      <el-input v-model="paramArray[scope.$index]" type="textarea" :autosize="true" placeholder="请输入参数值,如果动态计算没有使用该参数可以不填" auto-complete="off"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="">
                <el-button size="small" type="warning" icon="iconfont-test icon-ceshi" @click="testJsonOutput()" >开始测试</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="this.testResult.length>0">
            <el-col :span="24">
              <el-form-item label="测试结果">
                <el-table :data="addMockConfigForm.strategyInfo.JSONOutput.JSONOutputList" border style="width: 100%">
                  <el-table-column prop="address" align="center" label="输入结果" >
                    <template slot-scope="scope">
                      <el-input  type="textarea" :autosize="true" v-model="addMockConfigForm.strategyInfo.JSONOutput.JSONOutputList[scope.$index]" auto-complete="off" disabled="true"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" align="center" label="测试结果" >
                    <template slot-scope="scope">
                      <el-input  type="textarea" :autosize="true" v-if="testResult[scope.$index].status == 0" v-model="testResult[scope.$index].result"  auto-complete="off" disabled="true"></el-input>
                      <el-input  type="textarea" :autosize="true" v-if="testResult[scope.$index].status != 0" v-omodel="testResult[scope.$index].msg"  auto-complete="off" disabled="true"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" align="center" label="测试状态" width="100">
                    <template slot-scope="scope">
                      <el-button v-if="testResult[scope.$index].status == 0" type="success" icon="el-icon-check" circle></el-button>
                      <el-button v-if="testResult[scope.$index].status != 0" type="danger" icon="el-icon-error" circle></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" v-if="!test" @click="resetForm('addMockConfigForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('addMockConfigForm')">{{test?'返回编辑':'提交'}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="cloneMockWin" size="tiny" width="70%" :show-close="false" class="clone">
      <el-form :model="cloneMockConfigForm" :rules="cloneRulesForm" ref="cloneMockConfigForm" label-width="120px">
        <el-row>
          <el-col :span="2">
            <el-tag type="success">来源数据：</el-tag>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应用名称">
              {{cloneMockConfigForm.oldApplicationName}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容器命名空间">
              {{cloneMockConfigForm.oldNamespace}}<el-tag>{{cloneMockConfigForm.oldUserlabel}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="cloneMockConfigForm.strategyename == this.strategyEname.five  || cloneMockConfigForm.strategyename == strategyEname.six">
            <el-form-item label="路由code" >
              {{cloneMockConfigForm.oldRoutecode}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            &nbsp;
          </el-col>
          <el-col :span="8">
            <el-form-item label="挡板名称"  >
              {{cloneMockConfigForm.oldMockName}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="挡板描述"  >
              {{cloneMockConfigForm.oldDesc}}
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item label="策略类型" >
              {{cloneMockConfigForm.strategyeinfo}}
            </el-form-item>
          </el-col>
        </el-row>
        <hr class="style-one"/>
        <el-row>
          <el-col :span="2">
            <el-tag type="warning">目标数据：</el-tag>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应用名称"  prop="applicationid">
              <el-select v-model="cloneMockConfigForm.applicationid" placeholder="请选择应用" filterable @change="applicationChange">
                <el-option v-for="item in applications" :key="item.application.applicationId" :label="item.application.applicationName" :value="item.application.applicationId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容器命名空间"  prop="namespace">
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  容器命名空间可不设置。<br/>
                  应用发起挡板请求会先根据容器命名空间匹配策略;<br/>
                  如果根据容器命名空间匹配不到策略，再匹配命名空间为空的策略。
                </div>
                <el-select v-model="cloneMockConfigForm.namespace" @change="changeNameSpace" placeholder="请选择容器命名空间" filterable>
                  <el-option v-for="item in namespaces" :key="item.namespace" :label="item.namespace" :value="item">
                    <el-tooltip class="item" effect="light" :content="'容器命名空间：'+item.namespace" placement="left">
                      <span style="float: left">{{ item.namespace }}</span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" :content="'容器标签：'+item.userlabel" placement="right">
                      <el-tag style="float: right;">{{item.userlabel}}</el-tag>
                    </el-tooltip>
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="cloneMockConfigForm.strategyename == strategyEname.five || cloneMockConfigForm.strategyename == strategyEname.six">
            <el-form-item label="路由code"  prop="label">
              <el-select v-model="cloneMockConfigForm.routecode" placeholder="请选择路由code" filterable clearable >
                <el-option v-for="item in routecodes" :key="item.routecode" :label="item.routecode" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            &nbsp;
          </el-col>
          <el-col :span="6">
            <el-form-item label="挡板分组"  prop="groupid">
              <el-select v-model="cloneMockConfigForm.groupid" placeholder="请选择分组" filterable>
                <el-option v-for="item in groups" :key="item.id" :label="item.value" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="挡板名称"  prop="mockName">
              <el-input v-model="cloneMockConfigForm.mockName" placeholder="请输入挡板名称" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="挡板描述"  prop="desc">
              <el-input v-model="cloneMockConfigForm.desc" type="textarea" placeholder="请输入挡板描述" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text"  @click="resetForm('cloneMockConfigForm')">取 消</el-button>
        <el-button type="primary"  @click="submitCloneForm('cloneMockConfigForm')">提 交</el-button>
      </div>
    </el-dialog>
    <div class="mockconfig-list">
      <el-table :data="mockconfigPage"  style="width:100%" v-loading="loading">
        <el-table-column prop="groupid" label="分组" :formatter="idToGroupName"></el-table-column>
        <el-table-column prop="applicationid" label="应用名称" :formatter="idToApplicationName"></el-table-column>
        <el-table-column prop="namespace" label="容器命名空间">
          <template slot-scope="scope" v-if="scope.row.namespace">
            <el-tag size="medium">{{ scope.row.namespace }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="namespace" label="容器标签">
          <template slot-scope="scope" v-if="scope.row.userlabel">
            <el-tag size="medium">{{ scope.row.userlabel }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="routecode" label="路由code"></el-table-column>
        <el-table-column prop="strategyename" label="策略类型" :formatter="idToStrategyName"></el-table-column>
        <el-table-column prop="mockname" label="挡板名称"></el-table-column>
        <el-table-column v-if="false" prop="requestpath" label="请求路径"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>
        <el-table-column prop="status" label="启用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-color="#13ce66" :active-value=1 :inactive-value=0 @change="mockStatusChange(scope.$index)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="text" size="small" @click="updateStrategy(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="cloneStrategy(scope.row)">快速复制</el-button>
            <el-button type="text" size="small" @click="deleteMockConfig(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" :current-page.sync="firstPage" layout="total,prev, pager, next" :page-size="10" :total="mockconfigSize" v-if="mockconfigSize > 0">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import ElRow from "element-ui/packages/row/src/row";
  import Clipboard from 'clipboard';
  import '../../../assets/test/iconfont.css';
  export default {
    components: {ElRow}, data() {
      var validatemockname = (rule, value, callback) => {
          console.log(value);
        if(!value || value === ''){
          callback(new Error('请输入挡板配置名称'));
        }else{
          if(value.length > 255){
            callback(new Error('名称长度不能大于255'));
          }else{
            callback();
          }
        }
      };
      var validaterequestpath = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请输入请求路径'));
        }else{
          if(value.length > 255){
            callback(new Error('请求路径长度不能大于255'));
          }else{
            if(this.addMockConfigForm.strategyename == this.strategyEname.two){ //如果是第二种策略
              if(this.passthroughRegEx.test(value)){
                callback();
              }else{
                callback(new Error('策略2需要填写完整的请求路径!'));
              }
            }else{
              callback();
            }
          }
        }
      };
      var validaterinterfaceName = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请输入请求接口'));
        }else{
          if(value.length > 255){
            callback(new Error('请求路径接口不能大于255'));
          }else{
            if(this.addMockConfigForm.strategyename == this.strategyEname.five || this.addMockConfigForm.strategyename == this.strategyEname.six){ //如果是第五种策略
              if(this.interfaceRegEx.test(value)){
                callback();
              }else{
                callback(new Error('需要填写完整的请求接口!'));
              }
            }else{
              callback();
            }
          }
        }
      };
      var validateDesc = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请输入挡板配置描述'));
        }else{
          if(value.length > 2000){
            callback(new Error('描述长度不能大于2000'));
          }else{
            callback();
          }
        }
      };
      var validateCallbackparams = (rule, value, callback) => {
        if(value === ''){
          callback();
        }else{
          try{
            JSON.parse(value);
          }catch(e){
            callback(new Error('JSON格式不正确'));
          }
          if(value.length > 2048){
            callback(new Error('JSON长度不能大于2048'));
          }else{
            callback();
          }
        }
      };
      var validateJsonInput = (rule, value, callback) => {
        if(value === ''){
          callback();
        }else{
          try{
            JSON.parse(value);
          }catch(e){
            callback(new Error('JSON格式不正确'));
          }
          if(value.length > 2048){
            callback(new Error('JSON长度不能大于2048'));
          }else if(this.addMockConfigForm.requesttype == 'get'){
            callback(new Error('JSON输入非空，请求类型请设置为Post'));
          }else{
            callback();
          }
        }
      };
      var validateJsonOutput = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请填写输出JSON'));
        }else{
          try{
            JSON.parse(value);
          }catch(e){
            callback(new Error('JSON格式不正确'));
          }
//          if(value.length > 2048){
//            callback(new Error('JSON长度不能大于2048'));
//          }else{
//            callback();
//          }
        }
      };
      var validateMockJsonOutput = (rule, value, callback) => {
        /*  value = this.strategyDubbo.JSONOutput;
        if(value && value != '' && (value.indexOf("{")==0 || value.indexOf("[")==0)){
          try{
            value = this.replaceJsonExpression(value);
            console.log("json数据:" + value);
            JSON.parse(value);
          }catch(e){
            callback(new Error('JSON格式不正确'));
          }
        }*/
        callback();
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
        strategyEname:{one:'jsoninandout',two:'passthrough',three:'strategy3',four:'strategy4', five: 'dubboconsumermock', six: 'javamock'},
        showStrategy:{one:false,two:false,three:false,four:false,five:false,six:false},
        passthroughRegEx:/^https?\:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/,  //校验完整的URL
        interfaceRegEx:/[a-zA-Z]+[0-9a-zA-Z_]*(\.[a-zA-Z]+[0-9a-zA-Z_]*)*\.[a-zA-Z]+[0-9a-zA-Z_]*/,  //校验完整的接口名
        operators:['+','-','*','/','%','(',')'],
        regOperators:['+','-','*','/','%','(',')','=','?',':',">","<",'if()','else','for(;;)'],
        firstPage:1,
        mock:[],
        JSONOutputFlag:true,
        test: false,
        testResult: [],
        mockconfigPage:[],
        mockconfigSize:0,
        applications:[],
        namespaces:[],
        routecodes:[],
        groups:[],
        loading: false,
        strategy:[],
        paramList:[],
        expressionList:[],
        paramArray: [],
        title:'新增挡板配置',
        inputVisible:false,
        hasPermission: false,
        inputValue:'',
        lastInput:'result',
        searchtype:'1',
        searchvalue:'',
        addMockWin:false,
        cloneMockWin:false,
        showExplain: false,
        cloneMockConfigForm:{
          mockid:-1,
          oldMockName: '',
          mockName: '',
          desc: '',
          oldDesc: '',
          oldApplicationName:'',
          strategyename:'',
          strategyeinfo: '',
          applicationid:'',
          oldNamespace:'',
          oldUserlabel: '',
          oldRoutecode:'',
          routeCode: 'default',
          namespace:'',
          status: 1,
          groupid: '',
          userlabel: '',
        },
        addMockConfigForm:{
          mockid:-1,
          applicationid:'',
          namespace:'',
          userlabel: '',
          requestpath:'',
          requesttype:'',
          strategyename:'',
          routecode: 'default', //路由
          mockname:'',
          desc:'',
          status: 1,
          strategyinfoid:'',
          groupid: '',
          strategyInfo:{}
        },
        //1.JSON输入，输出JSON
        strategyJSON:{
          strategyinfoid:-1,
          JSONInput:'',
          JSONOutput:'',
          isRegExp:false,//是否正则表达式匹配
          iscallback:false,
          delay:0,
          callback:'',
          callbackparams:''
        },
        //3.根据输入参数计算输出结果
        strategyCompute:{
          strategyinfoid:-1,
          params:[],
          expression:''
        },
        //5. dubbo消费端挡板
        strategyDubbo:{
          strategyinfoid:-1,
          interfaceName:'', //接口全名称
          method:'',    //方法名称
          params:'',    //参数名称
          expressions: '',
          JSONOutput:{
            JSONOutputList: [""],
            JSONEnable: 0
          },
          isRegExp:false,//是否正则表达式匹配
          isExpression: false //是否需要计算表达式
        },
        //6. java 任意方法挡板
        strategyJava:{
          strategyinfoid:-1,
          className:'', //类全名称
          method:'',    //方法名称
          params:'',    //参数名称
          expressions: '',
          JSONOutput:{
            JSONOutputList: [""],
            myClassName:'',
            myMethod:'',
            useJson: 1,
            JSONEnable: 0
          },
          isRegExp:false,//是否正则表达式匹配
          isExpression: false //是否需要计算表达式
        },
        cloneRulesForm:{
          applicationid:[
            { required: true,message:"请选择应用", trigger: 'change' }
          ],
          namespace:[
            { required: true,message:"请选择命名空间", trigger: 'change' }
          ],
          mockName:[
            { required: true,validator:validatemockname, trigger: 'blur' }
          ],
          desc:[
            { required: true,validator:validateDesc, trigger: 'blur' }
          ]
        },
        rulesForm:{
          applicationid:[
            { required: true,message:"请选择应用", trigger: 'change' }
          ],
          namespace:[
            { required: false,message:"请选择命名空间", trigger: 'change' }
          ],
          requesttype:[
            { required: true,message:"请选择请求类型", trigger: 'change' }
          ],
          strategyename:[
            { required: true,message:"请选择策略类型", trigger: 'change' }
          ],
          requestpath:[
            { required: true,validator:validaterequestpath, trigger: 'blur' }
          ],
          mockname:[
            { required: true,validator:validatemockname, trigger: 'blur' }
          ],
          desc:[
            { required: true,validator:validateDesc, trigger: 'blur' }
          ]
        },
        strategyJSONRules:{
          JSONInput:[
            { required: false,validator:validateJsonInput, trigger: 'blur' }
          ],
          JSONOutput:[
            { required: true,validator:validateJsonOutput, trigger: 'blur' }
          ],
          callbackparams:[
            { required: false,validator:validateCallbackparams, trigger: 'blur' }
          ]
        },
        strategyDubboRules:{
          interfaceName:[
            { required: true,validator:validaterinterfaceName, trigger: 'blur' }
          ],
          method:[
            { required: true,message:"请填写请求方法", trigger: 'change' }
          ],
          JSONOutput:[
            { required: false,validator:validateMockJsonOutput, trigger: 'blur' }
          ],
        },
        strategyJavaRules:{
          myClassName:[
            { required: true,validator:validaterinterfaceName, trigger: 'blur' }
          ],
          myMethod:[
            { required: true,message:"请填写方法", trigger: 'change' }
          ],
          JSONOutput:[
            { required: false,validator:validateMockJsonOutput, trigger: 'blur' }
          ],
        },
        //参数类型
        paramTypes:[
          {
            label:'boolean',
            value:'boolean'
          },
          {
            label:'Boolean',
            value:'java.lang.Boolean'
          },
          {
            label:'byte',
            value:'byte'
          },
          {
            label:'Byte',
            value:'java.lang.Byte'
          },
          {
            label:'char',
            value:'char'
          },
          {
            label:'Character',
            value:'java.lang.Character'
          },
          {
            label:'short',
            value:'short'
          },
          {
            label:'Short',
            value:'java.lang.Short'
          },
          {
            label:'int',
            value:'int'
          },
          {
            label:'Integer',
            value:'java.lang.Integer'
          },
          {
            label:'long',
            value:'long'
          },
          {
            label:'Long',
            value:'java.lang.Long'
          },
          {
            label:'float',
            value:'float'
          },
          {
            label:'Float',
            value:'java.lang.Float'
          },
          {
            label:'double',
            value:'double'
          },
          {
            label:'Double',
            value:'java.lang.Double'
          },
          {
            label:'String',
            value:'java.lang.String'
          },
          {
            label:'Set',
            value:'java.util.Set'
          },
          {
            label:'List',
            value:'java.util.List'
          },
          {
            label:'Map',
            value:'java.util.Map'
          },
          {
            label:'Array',
            value:'java.util.Arrays'
          },
          {
            label:'Date',
            value:'java.util.Date'
          },
          {
            label:'其他',
            value:'custom'
          }
        ],
        autoCompleteStrategyList:[],     //自动补全策略名称list
        autoCompleteApplicationList: [], //自动补全应用名称list
        autoCompleteMockNameList: [],    //自动补全挡板名称list
        autoCompleteRequestPathList: [], //自动补全请求路径list
        autoCompleteNameSpaceList: [],  //自动补全命名空间list
        autoCompleteGroupList: [],    //自动补全分组list
        autoCompleteUserLabelList: []  //自动补全容器标签list
      }
    },
    mounted(){
      this.getAllProductLine();
      this.getAllApplication();
      this.getAllStategy();
      this.getAllMockConfig();
      this.getAllNamespace();
      this.getAllGroup();
    },
    methods: {
      //查询智能提示
      querySearch(queryString, cb){
        //查询类型（1:应用名称;2:策略类型;3:挡板名称;4:请求路径,5:命名空间,6容器标签）
        var searchtype = this.searchtype;
        var results = '';
        if (searchtype == '1') {
          var applicationLists = this.$data.autoCompleteApplicationList;
          results = queryString ? applicationLists.filter(this.createFilter(queryString)) : applicationLists;
        } else if (searchtype == '2') {
          var strategyLists = this.$data.autoCompleteStrategyList;
          results = queryString ? strategyLists.filter(this.createFilter(queryString)) : strategyLists;
        } else if (searchtype == '3') {
          var mockNameLists = this.$data.autoCompleteMockNameList;
          results = queryString ? mockNameLists.filter(this.createFilter(queryString)) : mockNameLists;
        } else if (searchtype == '4') {
          var requestPathLists = this.$data.autoCompleteRequestPathList;
          results = queryString ? requestPathLists.filter(this.createFilter(queryString)) : requestPathLists;
        } else if (searchtype == '5') {
          var namespaceLists = this.$data.autoCompleteNameSpaceList;
          results = queryString ? namespaceLists.filter(this.createFilter(queryString)) : namespaceLists;
        } else if (searchtype == '6') {
          var userLabelLists = this.$data.autoCompleteUserLabelList;
          results = queryString ? userLabelLists.filter(this.createFilter(queryString)) : userLabelLists;
        }else if (searchtype == '7') {
          var groupLists = this.$data.autoCompleteGroupList;
          results = queryString ? groupLists.filter(this.createFilter(queryString)) : groupLists;
        }
        cb(results);
      },
      jsonchange(label){
        console.log(label);
      },
      changeNameSpace(item){
        let applicationId;
        if (this.addMockWin) {
          this.addMockConfigForm.namespace = item.namespace;
          this.addMockConfigForm.userlabel = item.userlabel;
          applicationId = this.addMockConfigForm.applicationid;
        } else {
          this.cloneMockConfigForm.namespace = item.namespace;
          this.cloneMockConfigForm.userlabel = item.userlabel;
          applicationId = this.cloneMockConfigForm.applicationid;
        }

        if (!item || item.namespace == '') {
          //this.$message.error("请先选择命名空间!");
          return;
        }
        let namespace = item.namespace;

        //根据应用和namespace获取路由
        this.$store.dispatch('getRoutecodesByNamespace', {
          applicationId: applicationId,
          namespace: namespace
        }).then(val => {
          console.log(val);
          this.routecodes = val;
        });
      },
      applicationChange(){
        let info;
        if (this.addMockWin) {
          info = this.addMockConfigForm;
        } else {
          info = this.cloneMockConfigForm;
        }
        info.namespace = "";
        info.routecode = "default";

        if (arguments.length == 0) {
          this.$message.error("请先选择应用!");
          return;
        }
        var applicationId = arguments[0];
        //根据应用查询该应用葛朗台下的所有namespace
        this.$store.dispatch('getNamespacesByApplicationId', {
          applicationId: applicationId
        }).then(val => {
          this.namespaces = val;
          /*if(val && val.length>0){
            info.namespace = val[0].namespace;
          }*/
        });
      },
      createFilter(queryString) {
        return (obj) => {
          return (obj.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
        };
      },
      handleSelect(item){
        this.getAllMockConfigBySearch();
      },
      mockStatusChange(index){
        console.log("状态变化" + index);
        if (this.loading) {
          return;
        }
        this.loading = true;
        let params = {};
        params.mockid = this.mockconfigPage[index].mockid;
        let status = this.mockconfigPage[index].status;
        params.status = status;
        this.$store.dispatch('changeStatus', params).then(val => {
          this.loading = false;
          console.log(val);
          if (val.data > 0) {
            this.$message.success(val.message);
          } else {
            this.$message.error(val.message);
          }
        })

      },
      paramChange(item, index){
        item.path = item.type;
        if ('custom' === item.path) {
          item.path = '';
        }
      },
      paramBlur(type){
        this.lastInput = type;
      },
      clickParams(param){
        /*if (isNaN(this.lastInput) && this.lastInput.indexOf('result') >= 0) {
          let index = this.lastInput.replace('result', '');
          this.$set(this.addMockConfigForm.strategyInfo.JSONOutput.JSONOutputList, index, this.addMockConfigForm.strategyInfo.JSONOutput.JSONOutputList[index] + param);
        } else {
          this.expressionList[this.lastInput].expression += param;
        }*/
        console.log("点击"+ param);
        let clipboard = new Clipboard('.tag-read', {
          text: function() {
            return param;
          }
        });
        clipboard.on('success', e => {
          this.$message.success('复制成功');
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          this.$message.error('该浏览器不支持自动复制');
          // 释放内存
          clipboard.destroy()
        });
      },
      getAllMockConfigBySearch(){
        var searchtype = this.searchtype;
        var searchvalue = this.searchvalue;
        if (searchtype == '1') { //应用名称
          var applicationList = this.autoCompleteApplicationList;
          for (var item in applicationList) {
            if (applicationList[item].value == this.searchvalue) {
              searchvalue = applicationList[item].applicationId;
              break;
            }
          }
        } else if (searchtype == '2') { //策略类型
          var strategyList = this.autoCompleteStrategyList;
          for (var item in strategyList) {
            if (strategyList[item].value == this.searchvalue) {
              searchvalue = strategyList[item].strategyename;
              break;
            }
          }
        }else if (searchtype == '7') { //分组
          var groupList = this.autoCompleteGroupList;
          for (var item in groupList) {
            if (groupList[item].value == this.searchvalue) {
              searchvalue = groupList[item].id;
              break;
            }
          }
        }
        this.$store.dispatch('getAllMockConfigBySearch', {
          searchType: searchtype,
          searchValue: searchvalue
        }).then(val => {
          this.mock = val;
          this.mockconfigSize = val.length;
          if (val <= 10) {
            this.mockconfigPage = this.mock.slice('0', this.mock.length);
          } else {
            this.mockconfigPage = this.mock.slice('0', '10');
          }
        });
      },
      addParamItem(){
        let param = {};
        param.type = "custom";
        param.path = "";
        this.paramList.push(param);
      },
      addExpressionItem(){
        let expression = {};
        expression.index = "expression" + this.paramList.length;
        expression.expression = "";
        this.expressionList.push(expression);
      },
      addJsonOutputItem(){
        this.addMockConfigForm.strategyInfo.JSONOutput.JSONOutputList.push("");
      },
      deleteJsonOutput(index){
        if(this.addMockConfigForm.strategyInfo.JSONOutput.JSONOutputList.length == 1 && this.addMockConfigForm.strategyInfo.JSONOutput.useJson != 0){
          this.$message.error("至少有一个返回结果！");
          return;
        }else{
          this.addMockConfigForm.strategyInfo.JSONOutput.JSONOutputList.splice(index, 1);
        }
      },
      testJsonDialog(){
        this.test = true;
        this.testResult = [];
        if(this.paramArray.length<1){
          this.paramArray = [];
          let that = this;
          this.addMockConfigForm.strategyInfo.JSONOutput.JSONOutputList.forEach(function (item) {
            that.paramArray.push("");
          });
        }
      },
      executeMyClassMethod(){
        this.JSONOutputFlag = !this.JSONOutputFlag;
      },
      checkMyClassMethod(){
        let jsonop = this.strategyJava.JSONOutput;

        if (!jsonop.myClassName && !jsonop.myMethod) {
          this.strategyJava.JSONOutput.JSONEnable = 0;
          return;
        }

        if(jsonop.myClassName && !this.interfaceRegEx.test(jsonop.myClassName)) {
          this.$message.error("执行类名不规范！");
        }

        if (jsonop.myClassName && jsonop.myMethod) {
          // this.JSONOutputFlag = false;
          this.strategyJava.JSONOutput.JSONEnable = -1;
        }
      },
      cancleTest(){
        this.test = false;
      },
      testJsonOutput(){
        let that = this;
        this.testResult = [];
        this.addMockConfigForm.strategyInfo.JSONOutput.JSONOutputList.forEach(function (item) {
          that.testResult.push("测试中，请稍候");
        });
        let param = {};
        console.log(this.addMockConfigForm);
        param.jsonOutput = this.addMockConfigForm.strategyInfo.JSONOutput.JSONOutputList;
        param.expressions = this.getExpression();
        param.isReg = this.addMockConfigForm.strategyInfo.isRegExp;
        param.paramArray = this.paramArray;
        this.$store.dispatch('testMockConfig', param).then(val => {
          console.log(val);
          that.testResult = [];
          val.data.forEach(function (item, index) {
            that.testResult[index] = item;
          });
          }
        );
      },
      deleteParam(index){
        this.paramList.splice(index, 1);
      },
      deleteExpression(index){
        this.expressionList.splice(index, 1);
      },
      //检查产线
      getAllProductLine(){
        this.$store.dispatch('getAllProductLine').then(val => {
          if (val != null && val.length > 0) {
            this.hasPermission = true;
          }
        })
      },
      //查看全部挡板配置
      getAllMockConfig(){
        this.$store.dispatch('getAllMockConfig').then(val => {
          this.mock = val;
          this.mockconfigSize = val.length;
          if (val <= 10) {
            this.mockconfigPage = this.mock.slice('0', this.mock.length)
          } else {
            this.mockconfigPage = this.mock.slice('0', '10')
          }
          //生成自动补全挡板名称list和生成自动补全请求路径list
          var mockNameArray = [];
          var requestArray = [];
          for (var item in val) {
            var tempNameObj = {
              value: val[item].mockname,    //挡板名称
              mockid: val[item].mockid      //id
            };
            var tempPathObj = {
              value: val[item].requestpath,  //请求路径
              mockid: val[item].mockid       //id
            };
            mockNameArray.push(tempNameObj);
            requestArray.push(tempPathObj);
          }
          this.autoCompleteMockNameList = mockNameArray;
          this.autoCompleteRequestPathList = requestArray;

        })
      },
      //查看全部挡板配置
      getAllGroup(){
        this.$store.dispatch('getAllMockConfigGroup').then(val => {
          //生成自动补全挡板名称list和生成自动补全请求路径list
          var groupArray = [];
          this.groups = [];
          for (var item in val) {
            var tempObj = {
              id: val[item].id,    //挡板名称
              value: val[item].name      //id
            };
            groupArray.push(tempObj);
          }
          this.groups = groupArray;
          this.autoCompleteGroupList = groupArray;

        })
      },
      //应用id转换为应用名称
      idToApplicationName: function (row, column, cellValue) {
        var text = cellValue;
        if (this.applications.length > 0) {
          this.applications.forEach(function (ele, index) {
            if (ele.application && ele.application.applicationId == cellValue) {
              text = ele.application.applicationName || '';
              return false;
            }
          });
        }
        return text;
      },
      //应用id转换为分组名称
      idToGroupName: function (row, column, cellValue) {
        var text = cellValue;
        if (this.groups.length > 0) {
          this.groups.forEach(function (ele, index) {
            if (ele.id && ele.id == cellValue) {
              text = ele.value || '';
              return false;
            }
          });
        }
        return text;
      },
      //策略英文缩写转换为策略名称
      idToStrategyName: function (row, column, cellValue) {
        var text = cellValue;
        if (this.strategy.length > 0) {
          this.strategy.forEach(function (ele, index) {
            if (ele.strategyename == cellValue) {
              text = ele.strategyname;
              return false;
            }
          });
        }
        return text;
      },
      //查看全部应用
      getAllApplication(){
        this.$store.dispatch('getApplication').then(val => {
          this.applications = val;
          //生成全部应用自动补全list
          var applicationArray = [];
          for (var item in val) {
            var tempObj = {
              value: val[item].application.applicationName,           //英文名称
              applicationName: val[item].application.applicationName, //中文名称
              applicationId: val[item].application.applicationId, //id
              eproductLineName: val[item].productLine.eproductLineName //产线缩写
            };
            applicationArray.push(tempObj);
          }
          this.autoCompleteApplicationList = applicationArray;
        })
      },
      //查看全部命名空间
      getAllNamespace(){
        this.$store.dispatch('getAllNamespace').then(val => {
          //生成全部命名空民间自动补全list
          var namespaceArray = [];
          var userlabelArray = [];
          var labels = [];
          for (var item in val) {
            var tempObj = {
              value: val[item].namespace,           //命名空间
            };
            if (labels.indexOf(val[item].userlabel) < 0) {
              labels.push(val[item].userlabel);
              var userObj = {
                value: val[item].userlabel //容器标签
              };
              userlabelArray.push(userObj);
            }
            namespaceArray.push(tempObj);
          }
          this.autoCompleteNameSpaceList = namespaceArray;
          this.autoCompleteUserLabelList = userlabelArray;
        })
      },
      getAllStategy(){
        this.$store.dispatch('getAllStategy').then(val => {
          this.strategy = val;
          //生成策略自动补全list
          var strategyArray = [];
          for (var item in val) {
            var tempObj = {
              value: val[item].strategyname,           //策略名称
              strategyename: val[item].strategyename, //英文简称
              strategyid: val[item].strategyid //id
            };
            strategyArray.push(tempObj);
          }
          this.autoCompleteStrategyList = strategyArray;
        })
      },
      strategyChange(ename){
        //第一种策略
        if (ename == this.strategyEname.one) {
          this.addMockConfigForm.strategyInfo = this.strategyJSON;
          this.showStrategy.one = true;
          this.showStrategy.two = false;
          this.showStrategy.three = false;
          this.showStrategy.four = false;
          this.showStrategy.five = false;
          this.showStrategy.six = false;
        } else if (ename == this.strategyEname.two) { //第二种策略
          this.addMockConfigForm.strategyInfo = {};
          this.showStrategy.one = false;
          this.showStrategy.two = true;
          this.showStrategy.three = false;
          this.showStrategy.four = false;
          this.showStrategy.five = false;
          this.showStrategy.six = false;
        } else if (ename == this.strategyEname.three) {//第三种策略
          this.addMockConfigForm.strategyInfo = this.strategyCompute;
          this.showStrategy.one = false;
          this.showStrategy.two = false;
          this.showStrategy.three = true;
          this.showStrategy.four = false;
          this.showStrategy.five = false;
          this.showStrategy.six = false;
        } else if (ename == this.strategyEname.four) {//第四种策略
          this.showStrategy.one = false;
          this.showStrategy.two = false;
          this.showStrategy.three = false;
          this.showStrategy.four = true;
          this.showStrategy.five = false;
          this.showStrategy.six = false;
        } else if (ename == this.strategyEname.five) {//第五种策略
          this.addMockConfigForm.strategyInfo = this.strategyDubbo;
          this.showStrategy.one = false;
          this.showStrategy.two = false;
          this.showStrategy.three = false;
          this.showStrategy.four = false;
          this.showStrategy.five = true;
          this.showStrategy.six = false;
        } else if (ename == this.strategyEname.six) {//第六种策略
          this.addMockConfigForm.strategyInfo = this.strategyJava;
          this.showStrategy.one = false;
          this.showStrategy.two = false;
          this.showStrategy.three = false;
          this.showStrategy.four = false;
          this.showStrategy.five = false;
          this.showStrategy.six = true;
        }
      },
      removeParam(param){
        this.strategyCompute.params.splice(this.strategyCompute.params.indexOf(param), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          if (this.strategyCompute.params.indexOf(inputValue) < 0) { //去重
            this.strategyCompute.params.push(inputValue);
          }
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      clickTag: function (tag) {
        this.strategyCompute.expression += tag;
      },
      clickOperator: function (operator) {
        this.strategyCompute.expression += operator;
      },
      currentChange(val){
        this.mockconfigPage = this.mock.slice((val - 1) * 10, (val - 1) * 10 + 10);
      },
      replaceJsonExpression: function (value) {
        this.expression = value;
        //将正则中的动态计算表达式替换，避免json校验失败
        var startIndex = value.indexOf("#{");
        while (startIndex >= 0) {
          var count = 1;
          var quotCount = 0;
          var endIndex = startIndex + 2;
          var index = 0;
          while (index < startIndex) {
            if (this.expression.charAt(index) == '"') {
              quotCount++;
            }
            index++;
          }
          while (endIndex < this.expression.length) {
            if (this.expression.charAt(endIndex) == '{') {
              count++;
            } else if (this.expression.charAt(endIndex) == '}') {
              count--;
            }
            if (count == 0) {
              break;
            }
            endIndex++;
          }
          if (endIndex == this.expression.length) {
            return -1;
          }
          if (endIndex < 0) {
            return "}}";
          }
          let replace = "";
          if (quotCount % 2 == 0) {
            replace = '""';
          }
          //值替换
          this.expression = this.expression.substring(0, startIndex) + replace + this.expression.substring(endIndex + 1);
          startIndex = this.expression.indexOf("#{");
          count = 0;
          quotCount = 0;
        }
        return this.expression;
      },
      openStrategyWin(){
        this.resetAllParam();
        this.addMockWin = true;
        this.namespaces = [];
        this.title = "新增挡板配置";
//        if(this.$refs.addMockConfigForm){
//          this.$refs.addMockConfigForm.resetFields()
//        }

      },
      submitCloneForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('cloneMockConfig', this.cloneMockConfigForm).then(val => {
              if (val.data = 1) {
                this.cloneMockWin = false;
                this.resetForm(formName);
                if (val.status == '200') {
                  this.$message.success(val.message);
                  this.getAllMockConfig();
                } else {
                  this.$message.error(val.message);
                }
              }
            });
          }
        });
      },
      submitForm(formName) {
        let that = this;
        if(this.test){
            this.cancleTest();
            return;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //根据策略类型和是否回调判断是否需要清空对应的strategyInfo。
            if (this.addMockConfigForm.strategyename == this.strategyEname.one) {
              //如果不需要回调，则清空strategyJSON的相关字段
              if (!this.strategyJSON.iscallback) {
//                this.strategyJSON.delay = 0;
                this.strategyJSON.callback = '';
                this.strategyJSON.callbackparams = '';
              }
            }
            //如果是dubbo挡板，需要拼接参数
            if (this.addMockConfigForm.strategyename == this.strategyEname.five || this.addMockConfigForm.strategyename == this.strategyEname.six) {
              let mockValid = false;
              this.$refs["strategyDubboForm"].validate((validMocok) => {
                mockValid = validMocok;
              });
              if (!mockValid) {
                this.$message.error("参数填写错误！");
                return false;
              }
              let params = '';
              let errIndex = -1;
              this.paramList.forEach(function (item, index) {
                if (item.path && item.path.length > 0) {
                  params += item.path + ',';
                } else {
                  errIndex = index;
                  return false;
                }
              });
              if (errIndex >= 0) {
                this.$message.error("param" + errIndex + "没有填写参数类名！");
                return false;
              }
              if (params && params.length > 0) {
                params = params.substring(0, params.length - 1);
              }
              this.addMockConfigForm.strategyInfo.params = params;

                if (this.addMockConfigForm.strategyInfo.isRegExp && this.addMockConfigForm.strategyInfo.isExpression && this.expressionList.length > 0) {
                let expressions = this.getExpression();
                this.addMockConfigForm.strategyInfo.expressions = expressions;
              }
            }

            //如果是java任意方法挡板，校验返回结果配置
            if (that.addMockConfigForm.strategyename == that.strategyEname.six) {
              let myClassNameLength = that.strategyJava.JSONOutput.myClassName.length;
              let myMethodLength = that.strategyJava.JSONOutput.myMethod.length;
              let jsonOutputListLength = that.strategyJava.JSONOutput.JSONOutputList.length;

              if ((myClassNameLength != 0 && myMethodLength == 0) || (myClassNameLength == 0 && myMethodLength != 0)) {
                this.$message.error("执行类名和执行方法是一对哟，不要丢掉另一个！");
                return false;
              }

              if (myClassNameLength == 0 && myMethodLength == 0 && jsonOutputListLength == 0) {
                that.$message.error("JSON输出和执行自定义类和方法缺一不可，二选一！");
                return false;
              }
            }

            if (this.title === '修改挡板配置') {
              this.$store.dispatch('updateMockConfig', this.addMockConfigForm).then(val => {
                if (val.data = 1) {
                  this.addMockWin = false;
                  this.resetForm(formName);
                  if (val.status == '200') {
                    this.$message.success(val.message);
                    this.getAllMockConfig();
                  } else {
                    this.$message.error(val.message);
                  }
                }
              })
            } else {
              this.$store.dispatch('addMockConfig', this.addMockConfigForm).then(val => {
                if (val.data = 1) {
                  this.addMockWin = false;
                  this.resetForm(formName);
                  if (val.status == '200') {
                    this.$message.success(val.message);
                    this.getAllMockConfig();
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
      getExpression(){
        let expressions = '{';
        let errIndex = -1;
        this.expressionList.forEach(function (item, index) {
          if (item.expression && item.expression.length > 0) {
            expressions += '"expression' + index + '":"' + item.expression + '",';
          } else {
            errIndex = index;
            return false;
          }
        });
        if (errIndex >= 0) {
          this.$message.error("expression" + errIndex + "没有填写！");
          return false;
        }
        if (expressions && expressions.length > 0) {
          expressions = expressions.substring(0, expressions.length - 1) + "}";
        }
        return expressions;
      },
      resetForm(formName){
        this.$refs[formName].resetFields();
        this.resetAllParam();
      },
      resetAllParam(){
        this.addMockWin = false;
        this.cloneMockWin = false;
        this.showStrategy.one = false;
        this.showStrategy.two = false;
        this.showStrategy.three = false;
        this.showStrategy.four = false;
        this.showStrategy.five = false;
        this.showStrategy.six = false;
        this.lastInput = 'result';
        this.title = "新增挡板配置";
        this.addMockConfigForm = {
          mockid: -1,
          applicationid: '',
          namespace: '',
          requestpath: '',
          requesttype: '',
          strategyename: '',
          routecode: 'default', //路由
          mockname: '',
          desc: '',
          status: 1,
          groupid: '',
          strategyinfoid: '',
          strategyInfo: {}
        };
        this.cloneMockConfigForm = {
          mockid: -1,
          oldMockName: '',
          mockName: '',
          desc: '',
          oldDesc: '',
          oldApplicationName: '',
          strategyename: '',
          strategyeinfo: '',
          applicationid: '',
          oldNamespace: '',
          oldUserlabel: '',
          oldRoutecode: '',
          groupid: '',
          status: 1,
          routeCode: 'default',
          namespace: '',
          userlabel: '',
        };
        this.strategyJSON = {
          strategyinfoid: -1,
          JSONInput: '',
          JSONOutput: '',
          iscallback: false,
          isRegExp: false,
          delay: 0,
          callback: '',
          callbackparams: ''
        };

        this.strategyDubbo = {
          JSONOutput: {
            JSONOutputList: [""],
            JSONEnable: 0
          },
          strategyinfoid: -1,
          interfaceName: '', //接口全名称
          method: '',    //方法名称
          params: '',    //参数名称
          expressions: '', //表达式名称
          isRegExp: false,//是否正则表达式匹配
          isExpression: false//是否需要计算表达式
        };

        this.strategyJava = {
          JSONOutput: {
            JSONOutputList: [""],
            myClassName: '',
            myMethod: '',
            useJson: 1,
            JSONEnable: 0
          },
          strategyinfoid: -1,
          className: '', //接口全名称
          method: '',    //方法名称
          params: '',    //参数名称
          expressions: '', //表达式名称
          isRegExp: false,//是否正则表达式匹配
          isExpression: false//是否需要计算表达式
        };
        this.paramList = [];
        this.expressionList = [];
        this.paramArray = [];

        this.strategyCompute = {
          strategyinfoid: -1,
          params: [],
          expression: ''
        };
        if (this.$refs.addMockConfigForm) {
          this.$refs.addMockConfigForm.resetFields();
        }

        if (this.$refs.strategyJSONForm) {
          this.$refs.strategyJSONForm.resetFields();
        }
        if (this.$refs.strategyComputeForm) {
          this.$refs.strategyComputeForm.resetFields();
        }
        if (this.$refs.strategyDubboForm) {
          this.$refs.strategyDubboForm.resetFields();
        }
        if (this.$refs.strategyJavaForm) {
          this.$refs.strategyJavaForm.resetFields();
        }
      },
      //删除
      deleteMockConfig(row, index){
        this.$confirm('此操作将永久删除该挡板配置, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var mockid = row.mockid;
          this.$store.dispatch('deleteMockConfig', mockid).then(val => {
            if (val.data = 1) {
              if (val.status == '200') {
                this.$message.success(val.message);
                this.mockconfigPage.splice(index, 1);
                this.mockconfigSize = this.mockconfigSize - 1;
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
      cloneStrategy(row){
        this.cloneMockWin = true;
        this.title = '复制挡板配置';
        this.cloneMockConfigForm.mockid = row.mockid;
        this.cloneMockConfigForm.oldMockName = row.mockname;
        this.cloneMockConfigForm.oldApplicationName = this.idToApplicationName(null, null, row.applicationid);
        this.cloneMockConfigForm.oldNamespace = row.namespace;
        this.cloneMockConfigForm.oldUserlabel = row.userlabel;
        this.cloneMockConfigForm.oldDesc = row.desc;
        this.cloneMockConfigForm.strategyeinfo = this.idToStrategyName(null, null, row.strategyename);
        this.cloneMockConfigForm.strategyename = row.strategyename;
        this.cloneMockConfigForm.oldRoutecode = row.routecode;
        if (this.$refs.cloneMockConfigForm) {
          this.$refs.cloneMockConfigForm.resetFields()
        }
      },
      //修改
      updateStrategy(row){
        this.resetAllParam();
        this.addMockWin = true;
        this.title = '修改挡板配置';
        if (this.$refs.addMockConfigForm) {
          this.$refs.addMockConfigForm.resetFields()
        }
        //根据应用查询该应用葛朗台下的所有namespace
        this.$store.dispatch('getNamespacesByApplicationId', {
          applicationId: row.applicationid
        }).then(val => {
          this.namespaces = val;
        });

        //根据应用和namespace获取路由
        this.$store.dispatch('getRoutecodesByNamespace', {
          applicationId: row.applicationid,
          namespace: row.namespace
        }).then(val => {
          console.log(val);
          this.routecodes = val;
        });

        this.addMockConfigForm.mockid = row.mockid;
        this.addMockConfigForm.applicationid = row.applicationid;
        this.addMockConfigForm.namespace = row.namespace;
        this.addMockConfigForm.userlabel = row.userlabel;
        this.addMockConfigForm.requestpath = row.requestpath;
        this.addMockConfigForm.requesttype = row.requesttype;
        this.addMockConfigForm.strategyename = row.strategyename;
        this.addMockConfigForm.mockname = row.mockname;
        this.addMockConfigForm.desc = row.desc;
        this.addMockConfigForm.strategyinfoid = row.strategyinfoid;
        this.addMockConfigForm.status = row.status;
        this.addMockConfigForm.routecode = row.routecode;
        //根绝策略类型strategyename和strategyinfoid查询具体的挡板配置信息,策略2除外
        if (row.strategyename != this.strategyEname.two) {
          var param = {};
          param.strategyename = row.strategyename;
          param.strategyinfoid = row.strategyinfoid;
          this.$store.dispatch('getMockConfigDetail', param).then(val => {
            //根据策略类型显示策略配置div
            //1.策略1
            if (row.strategyename == this.strategyEname.one) {
              this.strategyJSON.strategyinfoid = val.data.strategyinfoid;
              this.strategyJSON.namespace = val.data.namespace;
              this.strategyJSON.JSONInput = val.data.jsoninput;
              this.strategyJSON.JSONOutput = val.data.jsonoutput;
              this.strategyJSON.delay = val.data.delay;
              this.strategyJSON.callback = val.data.callback;
              if (val.data.isregexp === 'true') {
                this.strategyJSON.isRegExp = true;
              } else {
                this.strategyJSON.isRegExp = false;
              }
              this.strategyJSON.callbackparams = val.data.callbackparams;
              if (this.strategyJSON.callback) {
                this.strategyJSON.iscallback = true;
              } else {
                this.strategyJSON.iscallback = false;
              }
              this.showStrategy.one = true;
              this.addMockConfigForm.strategyInfo = this.strategyJSON;
            } else if (row.strategyename == this.strategyEname.three) {
              this.strategyCompute.strategyinfoid = val.data.strategyinfoid;
              this.strategyCompute.params = val.data.params.split(',');
              this.strategyCompute.expression = val.data.expression;
              this.showStrategy.three = true;
              this.addMockConfigForm.strategyInfo = this.strategyCompute;
            } else if (row.strategyename == this.strategyEname.five || row.strategyename == this.strategyEname.six) {
              if (row.strategyename == this.strategyEname.five) {
                this.addMockConfigForm.strategyInfo = this.strategyDubbo;
                this.showStrategy.five = true;
              } else {
                this.addMockConfigForm.strategyInfo = this.strategyJava;
                this.showStrategy.six = true;
              }

              this.addMockConfigForm.strategyInfo.strategyinfoid = val.data.strategyinfoid;
              this.addMockConfigForm.strategyInfo.interfaceName = val.data.interfaceName;
              this.addMockConfigForm.strategyInfo.className = val.data.className;
              this.addMockConfigForm.strategyInfo.method = val.data.method;
              this.addMockConfigForm.strategyInfo.params = val.data.params;
              let jsonoutput = val.data.jsonoutput;
              jsonoutput = jsonoutput.replace(/[\r]/g, "\\r").replace(/[\n]/g, "\\n");
              this.addMockConfigForm.strategyInfo.JSONOutput = JSON.parse(jsonoutput);

              /*let jsonop = this.addMockConfigForm.strategyInfo.JSONOutput;
              if (jsonop.myClassName && jsonop.myMethod) {
                this.JSONOutputFlag = false;
                this.strategyJava.JSONOutput.JSONEnable = -1;
              }*/

              if (val.data.isregexp === 'true') {
                this.addMockConfigForm.strategyInfo.isRegExp = true;
              } else {
                this.addMockConfigForm.strategyInfo.isRegExp = false;
              }
              let paramsList = [];
              if (val.data.params && val.data.params.length > 0) {
                let split = val.data.params.split(",");
                let that = this;
                split.forEach(function (item, index) {
                  let param = {type: ''};
                  param.path = item;
                  that.paramTypes.forEach(function (item1) {
                    if (item1.value === item) {
                      param.type = item1.value;
                    }
                  });
                  if (param.type == '') {
                    param.type = 'custom';
                  }
                  paramsList.push(param);
                });
                this.paramList = paramsList;
              }

              let expressionList = [];
              if (val.data.expressions && val.data.expressions.length > 0) {
                let backEpressionList = JSON.parse(val.data.expressions);
                let index = 0;
                for (var key in backEpressionList) {
                  let expression = {};
                  expression.index = "expression" + index;
                  expression.expression = backEpressionList[key];
                  expressionList.push(expression);
                  index++;
                }
                this.expressionList = expressionList;
                this.addMockConfigForm.strategyInfo.isExpression = true;
              }


              this.addMockConfigForm.strategyInfo.isregexp = val.data.isregexp;
              //this.strategyDubbo.jsonoutput = val.data.jsonoutput;

              //this.addMockConfigForm.strategyInfo = this.strategyDubbo;
            }
          });
        }
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
