<template>
  <el-container>
    <el-header>
      <div style="margin-top: 15px;">
        <el-row>
          <el-col :span="19" :offset="1">
            <el-form :model="searchForm" :inline="true">
              <el-form-item label="样品编号：">
                <el-input v-model="searchForm.sampleNo" autocomplete="off" type="textarea" autosize @input="changeHighLight"></el-input>
              </el-form-item>
              <el-form-item label="设备检号：">
                <el-input v-model="searchForm.equipmentId" autocomplete="off" type="textarea" autosize></el-input>
              </el-form-item>
              <el-form-item label="委托人员：">
                <el-input v-model="searchForm.client" autocomplete="off" type="textarea" autosize></el-input>
              </el-form-item>
              <el-form-item label="试验人员：">
                <el-input v-model="searchForm.tester" autocomplete="off" type="textarea" autosize></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="2" style="float: left">
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="search">搜索</el-button>
          </el-col>
          <el-col :span="2" style="float: right">
            <el-button type="text" @click="setEquipIds" v-show="setEquipIdsShow">设置设备检号</el-button>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-main>
      <el-row :gutter="20" style="margin-bottom: 18px;">
        <el-col :span="24" style="margin-bottom: 18px;" v-for="info in taskData" :key="info.equipmentId">
          <el-card class="box-card2" shadow="always">
            <div slot="header">
              <div style="margin-bottom: 18px;">
                <span>[{{info.equipmentId}}]{{info.equipmentName}}</span> 
                <el-pagination style="float: right; padding: 3px 0"
                  :current-page.sync="info.pageInfo.currPage"
                  :page-size="pageInfo.pageSize"
                  :pager-count="pageInfo.pagerCount"
                  layout="total, prev, pager, next"
                  :total="info.pageInfo.total"
                  @current-change="handleCurrentChange($event,info.equipmentId)"
                  @prev-click="handleCurrentChange($event,info.equipmentId)"
                  @next-click="handleCurrentChange($event,info.equipmentId)">
                </el-pagination>
              </div>
              <div>
                <el-button-group class="crud-opts-left" v-show="buttonsShow">
                  <el-button  size="mini"  icon="el-icon-plus" :disabled="unUseful0(info.equipmentId)" @click="toOpenAddDialog(info.equipmentId)">新增</el-button>
                  <el-button  size="mini"  icon="el-icon-plus" :disabled="unUseful0(info.equipmentId)" @click="toOpenImportDialog(info.equipmentId)">导入</el-button>
                  <el-button  size="mini"  icon="el-icon-plus" :disabled="unUseful1(info.equipmentId)" @click="toOpenUpdateDialog(info.equipmentId)">修改</el-button>
                  <el-button  size="mini"  icon="el-icon-plus" :disabled="unUseful1(info.equipmentId)" @click="up(info.equipmentId)">上移</el-button>
                  <el-button  size="mini"  icon="el-icon-plus" :disabled="unUseful1(info.equipmentId)" @click="down(info.equipmentId)">下移</el-button>
                  <el-button  size="mini"  icon="el-icon-plus" :disabled="unUseful1(info.equipmentId)" @click="zhiding(info.equipmentId)">置顶</el-button>
                  <el-button  size="mini"  icon="el-icon-plus" :disabled="unUseful2(info.equipmentId)" @click="deleteRowsDialog(info.equipmentId)">删除</el-button>
                </el-button-group>
              </div> 
            </div>
            <el-table ref="cardTable" :data="info.equipmentTaskInfo.slice(info.pageInfo.begin,info.pageInfo.end)" 
            style="margin: auto; width: 100%" class="text item" row-key="id" :row-class-name="tableRowClassName" :cell-class-name="tableCellClassName" 
            @selection-change="handleSelectionChange($event,info.equipmentId)">
              <el-table-column type="selection" :reserve-selection="true" align="center" fit/>
              <el-table-column label="序号" width="50" align="center">
                <template slot-scope="scope">
                  <span>{{(info.pageInfo.currPage-1)*info.pageInfo.pageSize + scope.$index +1}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" label="样品编号" width="160">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>入库时间: {{ scope.row.whenIn }}</p>
                    <p>入库人: {{ scope.row.inByName }}</p>
                    <p>库房: {{ scope.row.warehouseName }}</p>
                    <p>园区: {{ scope.row.locationsCode }}</p>
                    <p>开始时间: {{ scope.row.taskTime }}</p>
                    <p>已运行时长(小时): {{ scope.row.runTime }}</p>
                    <div slot="reference">
                      <el-tag size="medium" :effect="scope.row.sampleNoEffect">{{ scope.row.sampleNo }}</el-tag>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="sampleName" label="样品名称"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="clientTime2" label="委托日期"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="client" label="委托人"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="tester" label="试验人"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="planTime" label="预计试验周期(小时)"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="taskStatus" label="试验状态"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="expectTime" label="预计完成时间"></el-table-column>
              <!-- <el-table-column fixed="right" align="center" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="update(scope.row)">修改</el-button>
                  <el-button type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>

    <!--主页面card选项-新增检测任务选项卡-->
    <el-dialog :title="dialogTitle" :visible.sync="newTaskDialogVisible"  append-to-body>
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key" :label="'任务' + (index+1)">
          <el-col :span="10" >
            <el-form-item label="委托编号">
              <el-input v-model="domain.sampleNo" autocomplete="off" type="textarea" autosize></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="预计试验周期">
              <el-input v-model="domain.planTime" autocomplete="off" placeholder="小时数" autosize></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">    
            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="插入位置" label-width="300px" v-show="placeChooseShow" label-position="right">
          <template>
            <el-radio v-model="dynamicValidateForm.place" label="before">所选任务之前</el-radio>
            <el-radio v-model="dynamicValidateForm.place" label="after">所选任务之后</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDomain">新增任务</el-button>
        <el-button @click="newTaskDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTask">确 定</el-button>
      </div>
    </el-dialog>

    <!--主页面card选项-修改检测任务选项卡-->
    <el-dialog :title="dialogTitle" :visible.sync="updateDialogVisible"  append-to-body>
      <el-form :model="updateForm" :inline="true">
        <el-form-item label="委托编号" label-width="120px" >
          <el-input v-model="updateForm.sampleNo" autocomplete="off" type="textarea" autosize disabled></el-input>
        </el-form-item>
        <el-form-item label="预计试验周期" label-width="120px" >
          <el-input v-model="updateForm.planTime" autocomplete="off" placeholder="小时数" autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateTask">确 定</el-button>
      </div>
    </el-dialog>

    <!--主页面card选项-导入检测任务选项卡-->
    <el-dialog :title="dialogTitle" :visible="uploadDialogVisible" append-to-body :close-on-click-modal="false" :before-close="cancelCU" width="600px">
      <el-form :inline="true" size="small" label-width="80px" class="demo-dynamic">
        <el-form-item label="上传" prop="upload">
          <el-upload ref="upload" drag :limit="1" :before-upload="beforeUpload" :auto-upload="false" :on-success="handleSuccess" :on-error="handleError"
            :action="'http://192.168.17.19:8081/task/import?equipmentId=' + importForm.equipmentId + '&beforeid=' + importForm.beforeid + '&place=' + importForm.place">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">可上传Excel文件,且不超过5M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="插入位置" label-width="300px" v-show="placeChooseShow" label-position="left">
          <template>
            <el-radio v-model="importForm.place" label="before">所选任务之前</el-radio>
            <el-radio v-model="importForm.place" label="after">所选任务之后</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </span>
    </el-dialog>

    <!--设置设备检号页面-->
    <el-dialog title="设置设备检号" width=60% :visible.sync="equipment.setEquipmentIDsShow">
      <el-row>
        <el-col :span="6" style="float: right">
          <el-button type="primary" @click="equipment.addEquipmentIDsShow = true">添  加</el-button>
          <el-button type="danger" @click.prevent="deleteEquipmentIDsShow">删  除</el-button>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="equipment.equipmentIds.slice(equipment.pageInfo.begin,equipment.pageInfo.end)" @selection-change="handleSelectionChange2">
        <el-table-column type="selection" reserve-selection=true align="center" width="55"></el-table-column>
        <el-table-column property="equipmentId" align="center" label="设备检号"></el-table-column>
        <el-table-column property="equipmentName" align="center" label="设备名称"></el-table-column>
        <!-- <el-table-column label="操作"  fit align="center" fixed="right" >
          <template slot-scope="scope">
            <div>
              <el-popover placement="top" :ref="scope.$index">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button type="primary" size="mini" @click="deleteEquipment(scope.row.equipmentId)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popover>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
      <div style="margin-bottom: 18px;">
        <el-pagination style="float: right; padding: 3px 0"
          :current-page="equipment.pageInfo.currPage"
          :page-size="equipment.pageInfo.pageSize"
          :pager-count="equipment.pageInfo.pagerCount"
          layout="total, prev, pager, next"
          :total="equipment.pageInfo.total"
          @current-change="handleEqumentCurrentChange"
          @prev-click="handleEqumentCurrentChange"
          @next-click="handleEqumentCurrentChange">
        </el-pagination>
      </div>
    </el-dialog>

    <!--设置设备检号页面-添加-->
    <el-dialog title="提示" :visible.sync="equipment.addEquipmentIDsShow" width="30%">
      <span>请输入要添加的设备检号：</span>
      <span slot="footer" class="dialog-footer">
        <el-input v-model="equipment.addEquipmentIDs" placeholder="请输入正确的检号，多个检号请以逗号分隔"></el-input>
        <el-row style="margin-top: 18px;">
          <el-button @click="equipment.addEquipmentIDsShow = false">取 消</el-button>
          <el-button type="primary" @click="addEquipments">确 定</el-button>
        </el-row>
      </span>
    </el-dialog>

    <!--设置设备检号页面-删除-->
    <el-dialog title="提示" :visible.sync="equipment.deleteEquipmentIDsShow" width="30%">
      <span>确定要删除选中的记录吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="equipment.deleteEquipmentIDsShow = false">取 消</el-button>
        <el-button type="primary" @click="deleteEquipments">确 定</el-button>
      </span>
    </el-dialog>

    <!--公共的确认页面-->
    <el-dialog title="提示" :visible.sync="confirmDialogShow" width="30%">
      <span>{{confirmDialogInfo}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmClick">确 定</el-button>
      </span>
    </el-dialog>

  </el-container>



</template>
<script>
  import {
    getRole,
    getMyIndexSortedTasks,
    getEquipmentIds,
    deleteEquipments,
    addEquipments,
    addTask,
    updateTask,
    topestTask,
    downTask,
    upTask,
    deleteTask,
    getSortedTasks,
  } from '@/api/task/task'
  export default {
    data() {
      return {
        setEquipIdsShow:true,
        buttonsShow:true,
        taskData:[],//数据源
        //查询条件
        searchForm:{
          sampleNo:'',
          equipmentId:'',
          client:'',
          tester:'',
        },
        //card多选框内容
        selections:[],
        //确认框
        confirmDialogShow:false,
        confirmDialogInfo:'',
        confirmMethod:'',
        confirmMethodParams:{},
        //分页数据初始值
        pageInfo:{
          pageSize:8,
          pagerCount:5,
          currPage:1,
        },
        //新增&导入
        newTaskDialogVisible:false,
        uploadDialogVisible:false,
        dialogTitle:'',
        placeChooseShow:false,//是否显示插入位置
        //新增form
        dynamicValidateForm: {
          equipmentId:'',
          domains: [{
            sampleNo:'',
            planTime:''
          }],
          place:'after',
        },
        //导入form
        importForm:{
          equipmentId:'',   
          beforeid:'',
          place:'after',
        },
        //修改
        updateDialogVisible:false,
        updateForm:{
          id:'',
          equipmentId:'',
          sampleNo:'',   
          planTime:'',
        },
        //设备设置
        equipment:{
          setEquipmentIDsShow:false,//设置设备检号页面
          equipmentIds:[{
            equipmentId:'',
            equipmentName:'',
          }],//要显示的设备
          multipleSelection: [],//选择的设备
          addEquipmentIDsShow:false,//设置设备检号页面--添加
          deleteEquipmentIDsShow:false,//设置设备检号页面--删除
          addEquipmentIDs:'',//要添加的设备
          pageInfo:{
            pageSize:10,
            pagerCount:5,
            currPage:1,
            begin:0,
            end:10,
          },
        },
      }
    },
   mounted() {
      this.refresh(this.searchForm.sampleNo,this.searchForm.equipmentId,this.searchForm.client,this.searchForm.tester)
      this.getRole()
    },
  methods:{
    getRole(){
      let that = this
      var userName = that.$store.getters.user.username;
      getRole(userName).then(res=>{
        if(res.data==="admin"){
          that.setEquipIdsShow=true
          that.buttonsShow=true
        }
      })
    },
    refresh(sampleNo,equipmentId,client,tester){
      let that = this
      //获取页面显示数据
      that.taskData = []
      getMyIndexSortedTasks(sampleNo,equipmentId,client,tester).then(res2=>{
        if(res2!=null && res2.data!=null){
            res2.data.forEach(infos=>{
            var equipmentId = infos.equipmentId;
            var equipmentName = infos.equipmentName;
            var equipmentTaskInfo = infos.equipmentTaskInfo;
            if(equipmentId!=null && equipmentId!=''){
              var expectTime=0;
              var ret = [];
              var count = 0;
              if(equipmentTaskInfo!=null){//处理获取的数据，使其在页面正确显示
                count = equipmentTaskInfo.length;
                var tempCurrPage = that.pageInfo.currPage;
                for(var i=0;i<count;i++){
                  var item = equipmentTaskInfo[i];
                  this.$set(item,'indexOfAll',i)
                  if(item!=null){
                    expectTime=Number(item.planTime)+Number(expectTime)-Number(item.taskTime);
                    this.$set(item,'expectTime',expectTime/24+'天')
                    var taskStatus = "--"
                    switch(item.status){
                      case 0:
                        taskStatus = "未开始"
                        break
                      case 1:
                        taskStatus = "进行中("+item.taskTime+")"
                        break
                      case 2:
                        taskStatus = "已结束"
                        break
                      default:
                    }
                    this.$set(item,'taskStatus',taskStatus)
                    this.$set(item,'clientTime2',item.clientTime.slice(0,10))
                    var date = new Date(item.createTime)
                    var time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
                    this.$set(item,'createTime2',time)
                    if(that.searchForm.sampleNo!=null&&that.searchForm.sampleNo!=''&&item.sampleNo.indexOf(that.searchForm.sampleNo)!=-1){
                      this.$set(item,'sampleNoEffect',"dark")
                    }else{
                      this.$set(item,'sampleNoEffect',"light")
                    }
                    ret.push(item)
                  }
                }
              }
              var temp = {
                equipmentId:equipmentId,
                equipmentTaskInfo:ret,
                equipmentName:equipmentName,
                lastExpectTime:expectTime,
                pageInfo:{
                  pageSize:that.pageInfo.pageSize,
                  begin:0,
                  end:that.pageInfo.pageSize,
                  pagerCount:that.pageInfo.pagerCount,
                  currPage:tempCurrPage,
                  total:count,
                },
              }
              that.taskData.push(temp);
              //添加复选框内容
              var tempSelection = {
                equipId:equipmentId,
                selectionRows:[],
              }
              that.selections.push(tempSelection);
            }
          });
        }
      });
    },
    search() {
      this.refresh(this.searchForm.sampleNo,this.searchForm.equipmentId,this.searchForm.client,this.searchForm.tester)
    },
    setEquipIds(){
      let that = this
      //获取设备列表
      getEquipmentIds().then(res=>{
        if(res!=null && res.data!=null){
          that.equipment.equipmentIds=res.data
          that.$set(that.equipment.pageInfo,'total',res.data.length)
        }else{
          that.equipment.equipmentIds=[]
          that.$set(that.equipment.pageInfo,'total',0)
        }
        //解决删除最后一页显示错误问题
        var lastPage = Math.ceil(res.data.length/that.equipment.pageInfo.pageSize)
        if(lastPage<that.equipment.pageInfo.currPage){
          that.equipment.pageInfo.currPage = lastPage
          that.equipment.pageInfo.begin=that.equipment.pageInfo.pageSize*(lastPage-1)
          that.equipment.pageInfo.end = res.data.length
        }
      })
      this.equipment.setEquipmentIDsShow=true
    },
    //card多选框变化时
    handleSelectionChange(val,equipmentId) {
      //取出当前选择rows和equipmentId，保存
      this.selections.forEach(item=>{
        if(item.equipId===equipmentId){
          item.selectionRows = val;
        }
      })
    },
    //card button是否可用
    unUseful0(equipmentId){
      var disable = true;
      this.selections.forEach(item=>{
        if(item.equipId===equipmentId){
          if(item.selectionRows.length ===0 || item.selectionRows.length ===1){
            disable = false
          }
        }
      })
      return disable
    },
    unUseful1(equipmentId){
      var disable = true;
      this.selections.forEach(item=>{
        if(item.equipId===equipmentId){
          if(item.selectionRows.length ===1){
            disable = false
          }
        }
      })
      return disable
    },
    unUseful2(equipmentId){
      var disable = true;
      this.selections.forEach(item=>{
        if(item.equipId===equipmentId){
          if(item.selectionRows.length >=1){
            disable = false
          }
        }
      })
      return disable
    },
    tableRowClassName(e) {
      e.row.row_index = e.rowIndex;
    },
    //高亮
    tableCellClassName(e) {
      //var userName = this.$store.getters.user.username;
      if (this.searchForm.client!='' && e.row.client.indexOf(this.searchForm.client)!=-1 && e.columnIndex===5) {
        return "client-cell";
      }
      return "";
    },
    changeHighLight(){
      debugger
      let that = this
      that.taskData.forEach(item=>{
        var info=item.equipmentTaskInfo
        info.forEach(item2=>{
          if(that.searchForm.sampleNo!=null&&that.searchForm.sampleNo!=''&&item2.sampleNo.indexOf(that.searchForm.sampleNo)!=-1){
            item2.sampleNoEffect="dark"
          }else{
            item2.sampleNoEffect="light"
          }
        })
      })
    },
    //上移
    up(equipmentId){
      let that = this
      for(var i=0;i<that.selections.length;i++){
        var item = that.selections[i]
        if(item.equipId===equipmentId){
          var index = item.selectionRows[0].indexOfAll;
          if ( index > 0) {
            upTask(equipmentId,item.selectionRows[0].id).then(res=>{
              if(res.code===200){
                for(var j=0;j<that.taskData.length;j++){
                  if(that.taskData[j].equipmentId===equipmentId){
                    var info = that.taskData[j].equipmentTaskInfo
                    let data1 = info[index-1];
                    let data2 = info[index];
                    data1.indexOfAll = index;
                    data2.indexOfAll = index-1
                    info.splice(index-1, 2);
                    info.splice(index-1 ,0, data2,data1);
                    break
                  }
                }
                that.$message({message: '上移成功', type: 'success'});
              }else{
                that.$message({message: '上移失败', type: 'error'});
              }
            })
          }else{
            that.$message({message: '已经是第一条，不可上移', type: 'warning'});
          }
          break;
        }
      }
    },
    down(equipmentId){
      let that = this
      for(var i=0;i<that.selections.length;i++){
        var item = that.selections[i]
        if(item.equipId===equipmentId){
          var index = item.selectionRows[0].indexOfAll;
          downTask(equipmentId,item.selectionRows[0].id).then(res=>{
            for(var j=0;j<that.taskData.length;j++){
              if(that.taskData[j].equipmentId===equipmentId){
                var info = that.taskData[j].equipmentTaskInfo
                if (index+1 === info.length) {
                  that.$message({message: '已经是最后一条，不可下移', type: 'warning'});
                }else{
                  if(res.code===200){
                    let data1 = info[index];
                  let data2 = info[index+1];
                  data1.indexOfAll = index+1;
                  data2.indexOfAll = index
                  info.splice(index, 2);
                  info.splice(index ,0, data2,data1);
                    that.$message({message: '下移成功', type: 'success'});
                  }else{
                    that.$message({message: '下移失败', type: 'error'});
                  }
                }
                break
              }
            }
          })
          break;
        }
      }
    },
    zhiding(equipmentId){
      let that = this
      for(var i=0;i<that.selections.length;i++){
        var item = that.selections[i]
        if(item.equipId===equipmentId){
          var index = item.selectionRows[0].indexOfAll;
          if ( index > 0) {
            topestTask(equipmentId,item.selectionRows[0].id).then(res=>{
              if(res.code===200){
                for(var j=0;j<that.taskData.length;j++){
                  if(that.taskData[j].equipmentId===equipmentId){
                    var info = that.taskData[j].equipmentTaskInfo
                    let data = info[index];
                    data.indexOfAll = 0;
                    info.splice(index,1)
                    info.unshift(data);
                    for(var k=1;k<=index;k++){
                      info[k].indexOfAll = k;
                    }
                    break
                  }
                }
                that.$message({message: '置顶成功', type: 'success'});
              }else{
                that.$message({message: '置顶失败', type: 'error'});
              }
            })
          }else{
            that.$message({message: '当前记录已经是第一条', type: 'warning'});
          }
          break;
        }
      }
    },
    //设置确认框点击调用的方法
    confirmClick(){
      var method = this.confirmMethod;
      let methods = this.$options.methods;
      let that = this;
      methods[method](that)
    },
    deleteRowsDialog(equipmentId){
      this.confirmDialogShow = true
      this.confirmDialogInfo = "确定要删除选中的记录吗？"
      this.$set(this.confirmMethodParams,'equipmentId',equipmentId)
      this.confirmMethod = "deleteRows"
    },
    deleteRows(that){
      var equipmentId = that.confirmMethodParams.equipmentId
      for(var i=0;i<that.selections.length;i++){
        var item = that.selections[i]
        if(item.equipId===equipmentId){
          var rows = item.selectionRows
          var ids = []
          for(var j=0;j<rows.length;j++){
            ids.push(rows[j].id)
          }
          deleteTask(ids.join(",")).then(res=>{
            if(res.code===200){
              that.$message({message: '删除成功', type: 'success'});
            }else{
              that.$message({message: '删除失败', type: 'error'});
            }
            getSortedTasks(equipmentId).then(res => {
              for(var k=0;k<that.taskData.length;k++){
                if(that.taskData[k].equipmentId===equipmentId){
                  that.taskData[k].equipmentTaskInfo=res.data
                  for(var g=0;g<that.taskData[k].equipmentTaskInfo.length;g++){
                    that.$set(that.taskData[k].equipmentTaskInfo,'indexOfAll',g)
                  }
                  var total = res.data.length
                  var lastPage = Math.ceil(total/that.taskData[k].pageInfo.pageSize)
                  //解决删除最后一页显示错误问题
                  if(lastPage<that.taskData[k].pageInfo.currPage){
                    that.taskData[k].pageInfo.currPage = lastPage
                    that.taskData[k].pageInfo.begin=that.taskData[k].pageInfo.pageSize*(lastPage-1)
                    that.taskData[k].pageInfo.end = that.taskData[k].pageInfo.pageSize*(lastPage)
                  }
                  that.taskData[k].pageInfo.total = total
                  break
                }
              }
            })
          })
          break;
        }
      }
      that.confirmDialogShow = false;
      debugger
      that.$refs.cardTable.forEach(item=>{
        item.clearSelection()
      });
    },
    //动态表单相关
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        sampleNos: '',
        planTime:'',
        key: Date.now()
      });
    },
    toOpenAddDialog(equipmentId){
      let that = this
      that.dialogTitle="新增检测任务-"+equipmentId;
      that.dynamicValidateForm.equipmentId=equipmentId;
      that.newTaskDialogVisible=true;
      that.selections.forEach(item=>{
        if(item.equipId===equipmentId){
          if(item.selectionRows.length ===0){
            that.placeChooseShow = false
          }
          if(item.selectionRows.length ===1){
            that.placeChooseShow = true
          }
        }
      })
    },
    addTask(){
      let that = this
      var equipmentId = that.dynamicValidateForm.equipmentId
      var beforeid
      for(var i=0;i<that.selections.length;i++){
        var item = that.selections[i]
        if(item.equipId===equipmentId){
          if(item.selectionRows.length ===0){
            for(var j=0;j<that.taskData.length;j++){
              if(that.taskData[j].equipmentId===equipmentId){
                var info = that.taskData[j].equipmentTaskInfo
                if(info.length===0){
                  beforeid=-1
                }else{
                  beforeid = info[info.length-1].id
                }
                break
              }
            }
          }else if(item.selectionRows.length ===1){
            var indexOfAll = item.selectionRows[0].indexOfAll
            for(var k=0;k<that.taskData.length;k++){
              if(that.taskData[k].equipmentId===equipmentId){
                var info2 = that.taskData[k].equipmentTaskInfo
                for(var p=0;p<info2.length;p++){
                    if(info2.id === item.selectionRows[0].id){
                      indexOfAll = p
                    }
                  }
                if(that.dynamicValidateForm.place==="before"){
                  if(indexOfAll===0){
                    beforeid=-1
                  }else{
                    beforeid = info2[indexOfAll-1].id
                  }
                }else if(that.dynamicValidateForm.place==="after"){
                  beforeid = info2[indexOfAll].id
                }
                break
              }
            }
          }
          break;
        }
      }
      var infos = {}
      that.dynamicValidateForm.domains.forEach(item=>{
        var index = that.dynamicValidateForm.domains.indexOf(item)
        that.$set(infos,"任务"+index,item.sampleNo + "=" + item.planTime)
      })
      var kv = JSON.stringify(infos)
      addTask(equipmentId,beforeid,kv).then(res=>{
        if(res.code===200){
          that.$message({message: '添加成功', type: 'success'});
        }else{
          that.$message({message: '添加失败', type: 'error'});
        }
        getSortedTasks(equipmentId).then(res => {
          debugger
          for(var h=0;h<that.taskData.length;h++){
            if(that.taskData[h].equipmentId===equipmentId){
              that.taskData[h].equipmentTaskInfo=res.data
              for(var g=0;g<that.taskData[h].equipmentTaskInfo.length;g++){
                that.$set(that.taskData[h].equipmentTaskInfo,'indexOfAll',g)
              }
              var total = res.data.length
              that.taskData[h].pageInfo.total = total
              break
            }
          }
        })
        this.newTaskDialogVisible=false;
        this.dynamicValidateForm.domains = [{sampleNo:'',planTime:''}]
        this.dynamicValidateForm.equipmentId=''
        this.dynamicValidateForm.place='after'
      })
    },
    toOpenUpdateDialog(equipmentId){
      debugger
      let that = this
      that.dialogTitle="修改检测任务-"+equipmentId;
      that.updateForm.equipmentId=equipmentId;
      for(var i=0;i<that.selections.length;i++){
        var item = that.selections[i]
        if(item.equipId===equipmentId){
          if(item.selectionRows.length === 1){
            that.updateForm.id=item.selectionRows[0].id;
            that.updateForm.sampleNo=item.selectionRows[0].sampleNo;
            that.updateForm.planTime=item.selectionRows[0].planTime;
            that.updateDialogVisible=true;
          }
        }
      }
    },
    updateTask(){
      let that = this
      updateTask(that.updateForm.id,that.updateForm.planTime).then(res=>{
        if(res.code===200){
          that.$message({message: '修改成功', type: 'success'});
        }else{
          that.$message({message: '修改失败', type: 'error'});
        }
        for(var h=0;h<that.taskData.length;h++){
            if(that.taskData[h].equipmentId===that.updateForm.equipmentId){
              var info = that.taskData[h].equipmentTaskInfo
              for(var g=0;g<info.length;g++){
                if(info[g].id === that.updateForm.id){
                  debugger
                  info[g].planTime = that.updateForm.planTime
                  break;
                }
              }
              var expectTime = 0
              for(var k=0;k<info.length;k++){
                expectTime=Number(info[k].planTime)+Number(expectTime)-Number(info[k].taskTime);
                info[k].expectTime=expectTime/24+'天'
              }
              break
            }
          }
        this.updateDialogVisible=false;
      })
    },
    toOpenImportDialog(equipmentId){
      let that = this
      that.dialogTitle="导入检测任务-"+equipmentId;
      that.importForm.equipmentId=equipmentId;
      var beforeid
      for(var i=0;i<that.selections.length;i++){
        var item = that.selections[i]
        if(item.equipId===equipmentId){
          if(item.selectionRows.length ===0){
            for(var j=0;j<that.taskData.length;j++){
              if(that.taskData[j].equipmentId===equipmentId){
                var info = that.taskData[j].equipmentTaskInfo
                if(info.length===0){
                  beforeid=-1
                }else{
                  beforeid = info[info.length-1].id
                }
                break
              }
            }
          }else if(item.selectionRows.length ===1){
            var indexOfAll = item.selectionRows[0].indexOfAll
            for(var k=0;k<that.taskData.length;k++){
              if(that.taskData[k].equipmentId===equipmentId){
                var info2 = that.taskData[k].equipmentTaskInfo
                for(var p=0;p<info2.length;p++){
                    if(info2.id === item.selectionRows[0].id){
                      indexOfAll = p
                    }
                  }
                if(that.dynamicValidateForm.place==="before"){
                  if(indexOfAll===0){
                    beforeid=-1
                  }else{
                    beforeid = info2[indexOfAll-1].id
                  }
                }else if(that.dynamicValidateForm.place==="after"){
                  beforeid = info2[indexOfAll].id
                }
                break
              }
            }
          }
          break;
        }
      }
      that.importForm.beforeid=beforeid
      that.uploadDialogVisible=true;
      that.selections.forEach(item=>{
        if(item.equipId===equipmentId){
          if(item.selectionRows.length ===0){
            that.placeChooseShow = false
          }
          if(item.selectionRows.length ===1){
            that.placeChooseShow = true
          }
        }
      })
    },
    cancelCU(){
      this.uploadDialogVisible=false
    },
    beforeUpload(file){
      console.log("before upload")
    //判断文件大小
      const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (file.type === 'application/vnd.ms-excel');
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 5MB!')
        return false
      }
      if(!isExcel){
        this.loading = false
        this.$message.error('上传文件只能为Excel文件!')
        return false
      }
      return true
    },
    handleSuccess(res,file){
      let that = this
      that.$refs.upload.clearFiles();
      that.uploadDialogVisible=false;
      var equipmentId=that.importForm.equipmentId
      getSortedTasks(equipmentId).then(res => {
        debugger
        for(var h=0;h<that.taskData.length;h++){
          if(that.taskData[h].equipmentId===equipmentId){
            that.taskData[h].equipmentTaskInfo=res.data
            for(var g=0;g<that.taskData[h].equipmentTaskInfo.length;g++){
              that.$set(that.taskData[h].equipmentTaskInfo,'indexOfAll',g)
            }
            var total = res.data.length
            that.taskData[h].pageInfo.total = total
            break
          }
        }
      })
      that.$message({
        message: '上传成功',
        type: 'success'
      });
    },
    handleError(err,file){
      this.$message({
        message: "上传失败",
        type: 'error'
      }); 
    },
    submitUpload(){
      this.$refs.upload.submit();
    },
    timeFormatter(row,column){
      var date = new Date(new Number(row[column.property])) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
      var D = date.getDate() + ' '
      var h = date.getHours() + ':'
      var m = date.getMinutes() + ':'
      var s = date.getSeconds()
      return Y+M+D+h+m+s
    },
    handleCurrentChange(val,equipmentId) {
      console.log(`当前页: ${val}`);
      this.taskData.forEach(item=>{
        if(item.equipmentId===equipmentId){
          item.pageInfo.currPage = val
          item.pageInfo.begin = (val-1)*this.pageInfo.pageSize
          item.pageInfo.end = (val)*this.pageInfo.pageSize
        }
      });
    },
    handleEqumentCurrentChange(val) {
      this.equipment.pageInfo.currPage = val
      this.equipment.pageInfo.begin = (val-1)*this.equipment.pageInfo.pageSize
      this.equipment.pageInfo.end = (val)*this.equipment.pageInfo.pageSize
    },
    deleteEquipment(e){
      let that = this
      // var userName = this.$store.getters.user.username;
      // if(userName===null||userName===''){
      //   alert("当前登录已过期，请重新登录！")
      // }
      deleteEquipments("indexmachines",e).then(res=>{
        if(res.code==='200'){
          that.$message({message: '删除成功', type: 'success'});
          for(var i=0;i<that.equipment.equipmentIds.length;i++){
            if(that.equipment.equipmentIds[i].equipmentId === e){
              that.equipment.equipmentIds.splice(i,1)
            }
          }
          for(var j=0;j<that.taskData.length;i++){
            if(that.taskData[j].equipmentId === e){
              that.taskData.splice(j,1)
            }
          }
        }else{
          that.$message({message: '删除失败', type: 'error'});
        }
      })
    },
    deleteEquipmentIDsShow(){
      if(this.equipment.multipleSelection.length===0){
        this.$message({message: '请选择要删除的设备！'});
      }else{
        this.equipment.deleteEquipmentIDsShow=true
      }
    },
    deleteEquipments(){
      let that = this
      debugger
      // var userName = this.$store.getters.user.username;
      // if(userName===null||userName===''){
      //   alert("当前登录已过期，请重新登录！")
      // }
      var deleteIds = [];
      that.equipment.multipleSelection.forEach(item=>{
        if(item.equipmentId!=null&&item.equipmentId!=''){
          deleteIds.push(item.equipmentId);
        }
      })
      deleteEquipments("indexmachines",deleteIds.join(",")).then(res=>{
        if(res.code==='200'){
          that.$message({message: '删除成功', type: 'success'});
          that.setEquipIds()
          deleteIds.forEach(id=>{
            // for(var i=0;i<that.equipment.equipmentIds.length;i++){
            //   if(that.equipment.equipmentIds[i].equipmentId === id){
            //     that.equipment.equipmentIds.splice(i,1)
            //   }
            // }
            for(var j=0;j<that.taskData.length;j++){
              if(that.taskData[j].equipmentId === id){
                that.taskData.splice(j,1)
              }
            }
          })
        }else{
          that.$message({message: '删除失败', type: 'error'});
        }
      })
      that.$refs.multipleTable.clearSelection();
      that.equipment.deleteEquipmentIDsShow=false
    },
    addEquipments(){
      // var userName = this.$store.getters.user.username;
      // if(userName===null||userName===''){
      //   alert("当前登录已过期，请重新登录！")
      // }
      let that = this;
      var ids = that.equipment.addEquipmentIDs;
      that.equipment.addEquipmentIDsShow = false;
      addEquipments("indexmachines",ids).then(res=>{
        debugger
        if(res.code==='200'){
          that.$message({message: '添加成功', type: 'success'});
          that.setEquipIds()
          that.refresh(that.searchForm.sampleNo,that.searchForm.equipmentId,that.searchForm.client,that.searchForm.tester)
        }else{
          that.$message({message: res.msg, type: 'error'});
        }
      })
      that.equipment.addEquipmentIDs=""
    },
    handleSelectionChange2(val) {
      this.equipment.multipleSelection = val;
    }
  },
}
</script>
<style>
 .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card2 {
    width: 1500px;
    height: 530px;
  }
  .el-table .client-cell {
    color: rgb(18, 1, 250);
  }
</style>