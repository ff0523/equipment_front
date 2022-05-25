<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <!-- 搜索 -->
        委托编号：<el-input v-model="sampleNo" clearable size="small" style="width: 200px;" class="filter-item" />
        设备检号：<el-input v-model="equipmentID" clearable size="small" style="width: 200px;" class="filter-item" />
        委托人员：<el-input v-model="equipmentID" clearable size="small" style="width: 200px;" class="filter-item" />
        试验人员：<el-input v-model="equipmentID" clearable size="small" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
      <div class="crud-opts">
        <span class="crud-opts-left">
          <!--左侧插槽-->
          <slot name="left" />
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="toOpenImportDialog">
          导入任务
          </el-button>
          
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus" >
            添加任务
          </el-button>
          <!--
          <el-button class="filter-item" type="danger" icon="el-icon-delete" size="mini"
            :disabled="selections.length == 0" @click="open(selections)">
            删除
          </el-button>-->
        </span>
    <el-button-group class="crud-opts-right">
      <el-button
        size="mini"
        icon="el-icon-refresh"
        @click="refresh(page)"
      />
    </el-button-group>
      </div>
    </div>
   
    <!--导入任务选项-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelCU" :visible="status.cu > 0"
      :title="status.title" width="730px">
      <el-form :inline="true"  size="small" label-width="80px">
        
       <el-form-item  label="上传" prop="upload">
          <el-upload
            ref="upload"
            drag
            :limit="1"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :on-success="handleSuccess"
            :on-error="handleError"
            :action="'http://127.0.0.1:8081/task/import'"
          >
            <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">可上传Excel文件，且不超过5M</div>
          </el-upload>
        </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
    <el-button @click="cancelCU">取 消</el-button>
    <el-button type="primary" @click="submitUpload">确 定</el-button>
  </span>
    </el-dialog>


<el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible">
    <el-button-group class="crud-opts-left">
      <el-button
        size="mini"
        icon="el-icon-plus"
        @click="addRear(selections)"
      >新增任务</el-button>
 
       <el-button
        size="mini"
        icon="el-icon-plus"
        :disabled="selections.length == 0 || selections.length > 1"
        @click="addAfter(selections)">在指定任务之后新增</el-button>
           <el-button
        size="mini"
        icon="el-icon-upload2"
        :disabled="selections.length == 0 || selections.length > 1"
        @click="up(selections)">上移</el-button>
           <el-button
        size="mini"
        icon="el-icon-download"
        :disabled="selections.length == 0 || selections.length > 1"
        @click="down(selections)">下移</el-button>
           <el-button
        size="mini"
        icon="el-icon-document-copy"
        :disabled="selections.length == 0 || selections.length > 1"
        @click="zhiding(selections)">置顶</el-button>
    </el-button-group>
 <el-table ref="sortedtable" :row-class-name="tableRowClassName" :data="sortedData" style="width: 100%" row-key="id" @selection-change="selectionChangeHandler">
      <el-table-column type="selection"  align="center" fit/>
      <el-table-column  :show-overflow-tooltip="true" prop="equipmentID" label="排序" align="center" fit>
     <template slot-scope="scope">
          <span>{{scope.$index +1}}</span>
      </template>
          </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="委托编号" align="center" fit prop="sampleNo" />
      <el-table-column  :formatter="statusFormatter" :show-overflow-tooltip="true" prop="status" label="状态" align="center" fit/>
      <el-table-column prop="taskTime" label="已运行时间" align="center" fit />
      <el-table-column :formatter="timeFormatter" prop="modifyTime" label="更新日期" align="center" fit />
      <el-table-column :formatter="timeFormatter" prop="createTime" label="创建日期" align="center" fit>
      </el-table-column>
    </el-table>
     <!--新增任务选项-->
    <el-dialog title="新增任务" :visible.sync="newTaskDialogVisible"  append-to-body>
  <el-form :model="form">
    <el-form-item label="设备" label-width="120px">
      <el-input v-model="form.machineID"  disabled="true" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="委托编号" label-width="120px" >
     <el-input v-model="form.sampleNo" autocomplete="off" type="textarea" autosize></el-input>
    </el-form-item>
      <el-form-item label="预计试验周期" label-width="120px" >
     <el-input v-model="form.planTime" autocomplete="off" placeholder="小时数" autosize></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="newTaskDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addTask">确 定</el-button>
  </div>
</el-dialog>


</el-dialog>

    <!--表格渲染-->
    <el-table ref="table" :data="tableData" style="width: 100%" row-key="id" >
      <el-table-column :show-overflow-tooltip="true" label="委托编号" align="center" fit prop="sampleNo" />
       <el-table-column :show-overflow-tooltip="true" label="样品名称" align="center" fit prop="goodsName" />
        
      <el-table-column sortable :show-overflow-tooltip="true" prop="equipmentID" label="设备编号" align="center" fit>
     <template slot-scope="scope">
      <div class="information-title">
     <el-tag
          type='primary'
          @click="openTaskDetail(scope.row.equipmentID)"
          disable-transitions>{{scope.row.equipmentID}}</el-tag>
          </div>
      </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="入库时间" align="center" fit prop="whenIn" />
          
      <el-table-column  :formatter="statusFormatter" :show-overflow-tooltip="true" prop="status" label="状态" align="center" fit/>
      <el-table-column prop="taskTime" label="已运行时间" align="center" fit />
      <el-table-column :formatter="timeFormatter" prop="modifyTime" label="更新日期" align="center" fit />
      <el-table-column :formatter="timeFormatter" prop="createTime" label="创建日期" align="center" fit>
      </el-table-column>
      <el-table-column label="操作"  fit align="center" fixed="right" >
        <template slot-scope="scope">
          <div>
            <el-popover placement="top" width="100%" :ref="scope.$index">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.$index].doClose()">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteTask([scope.row])">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
    :page-size.sync="page.size"
    :total="page.total"
    :current-page.sync="page.page"
    style="margin-top: 8px;"
    layout="total, prev, pager, next, sizes"
    @size-change="sizeChangeHandler($event)"
    @current-change="pageChangeHandler"
  />

  </div>
</template>
<script>

  import {
      getTasks,
      getSortedTasks,
      topestTask,
      downTask,
      upTask,
      addTask,
      deleteTask1
  } from '@/api/task/task'
  const CRUD_STATUS = {
    NORMAL: 0,
    PREPARED: 1,
    PROCESSING: 2
  } //状态码

  const ADD_TYPE={
    REAR:1,
    BEFORE:2,
    NONE:0
  }
const title="导入检测任务";
  export default {
    name: 'TaskManage',
    data() {
      return {
        searchCode: "",//设备搜索变量
        tableData: [],
        dialogTableVisible: false,
        newTaskDialogVisible:false,
        sortedData:[],
        dialogTitle:"设备任务序列",
        selections: [],
        currentRowIndex:-1,
        addtype:ADD_TYPE.NONE,
        form:{
          sampleNo:"",
          machineID:"",
          planTime:""
        },
        status: {
          add: CRUD_STATUS.NORMAL,
          edit: CRUD_STATUS.NORMAL,
          // 添加或编辑状态
          get cu() {
            if (this.add === CRUD_STATUS.NORMAL && this.edit === CRUD_STATUS.NORMAL) {
              return CRUD_STATUS.NORMAL
            } else if (this.add === CRUD_STATUS.PREPARED || this.edit === CRUD_STATUS.PREPARED) {
              return CRUD_STATUS.PREPARED
            } else if (this.add === CRUD_STATUS.PROCESSING || this.edit === CRUD_STATUS.PROCESSING) {
              return CRUD_STATUS.PROCESSING
            }
            throw new Error('wrong crud\'s cu status')
          },
          // 标题
          get title() {
            return this.add > CRUD_STATUS.NORMAL ? `${title}` : this.edit > CRUD_STATUS.NORMAL ? `编辑${title}` :
              title
          }
        },
        page:{
          size:10,
          currentPage:1,
          totalPage:0,
          total:0
        }
      }
    },
    mounted() {
      this.refresh(this.page)
    },
    methods: {
       refresh(page) {
        getTasks(page.currentPage,page.size, this.searchCode).then(res => {
          debugger
          page.total=res.totalCount
          page.totalPage=Math.ceil(res.totalCount/page.size)
          this.tableData = res.dataList
         
        })
      },
      search()//点击搜索按钮，搜索函数
      {
        this.refresh(this.page)
      },
      toOpenImportDialog()
      {
       this.status.add=CRUD_STATUS.PREPARED;
      },
      cancelCU()
      {
          this.status.add=CRUD_STATUS.NORMAL;
          this.status.edit=CRUD_STATUS.NORMAL;
      },
      beforeUpload(file)
      {
          debugger
       console.log("before upload")
      //判断文件大小
      const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (file.type === 'application/vnd.ms-excel');
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 5MB!')
        return false
      }
      if(!isExcel)
      {
        this.loading = false
        this.$message.error('上传文件只能为Excel文件!')
        return false
      }
      return true
      },
      handleSuccess(res,file)
      {
        this.$refs.upload.clearFiles();
        this.cancelCU();
          this.$message({
          message: '上传成功',
          type: 'success'
        });
  
      },
      handleError(err,file)
      {
         this.$message({
          message: "上传失败",
          type: 'error'
        }); 
      },
      submitUpload()
      {
          this.$refs.upload.submit();
      },
      selectionChangeHandler(value)
      {
         this.selections = value
      },
      statusFormatter(row,column)
      {
        if(row.status==0)
        {
          return "未开始"
        }
         if(row.status==1)
        {
          return "进行中"
        }
         if(row.status==2)
        {
          return "已结束"
        }
        return ""
      },
      timeFormatter(row,column)
      {
        var date = new Date(new Number(row[column.property])) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y+M+D+h+m+s
      },
     // 每页条数改变
    sizeChangeHandler(e) {
      
      this.page.size = e
      this.page.currentPage = 1
      this.refresh(this.page)
    }, // 当前页改变
    pageChangeHandler(e) {
      this.page.currentPage = e
      this.refresh(this.page)
    },
    openTaskDetail(machineID)
    {
           this.dialogTableVisible=true;
           this.dialogTitle=machineID+"设备任务序列";
 getSortedTasks(machineID).then(res => {
          this.sortedData = res.data
        })
    },
    addRear()
    {
        this.form.machineID=this.dialogTitle.replace("设备任务序列","");
       this.newTaskDialogVisible=true;
        this.addtype=ADD_TYPE.REAR;
        
    },
    addTask()
    {
      
       let arr = [];
    this.form.sampleNo.split('\n').forEach(item=>arr.push(item.trim()));
    let sampleNos=arr.join(',');
      if(this.addtype==ADD_TYPE.REAR)
      {
addTask(this.form.machineID,sampleNos,this.sortedData[this.sortedData.length  - 1].id,this.form.planTime).then(res=>{
          debugger
            this.newTaskDialogVisible=false;
             getSortedTasks(this.form.machineID).then(res => {
          this.sortedData = res.data
        })
        })
      }
       if(this.addtype==ADD_TYPE.BEFORE)
      {
  addTask(this.selections[0].equipmentID,sampleNos,this.selections[0].id,this.form.planTime).then(res=>{
           debugger
              this.newTaskDialogVisible=false;
             getSortedTasks(this.form.machineID).then(res => {
          this.sortedData = res.data
        })
        })
      }
    },
    addAfter()
    {
      if(this.selections.length>0)
      {
       this.form.machineID=this.dialogTitle.replace("设备任务序列","");
       this.newTaskDialogVisible=true;
       this.addtype=ADD_TYPE.BEFORE;
    
      }
       

    },
    up(selections)
    {
  upTask(selections[0].equipmentID,selections[0].id).then(res=>{
      debugger
      
       this.$message({message: '上移成功', type: 'success'});
    if (selections[0].row_index  > 0) {
          let upDate = this.sortedData[selections[0].row_index  - 1];
          this.sortedData.splice(selections[0].row_index  - 1, 1);
          this.sortedData.splice(selections[0].row_index ,0, upDate);
        } else {
          alert('已经是第一条，不可上移');
        }

      
      })

    },
    down(selections)
    {
   downTask(selections[0].equipmentID,selections[0].id).then(res=>{
      debugger
      
       this.$message({message: '下移成功', type: 'success'});
  if ((selections[0].row_index  + 1) === this.sortedData.length){
          alert('已经是最后一条，不可下移');
        } else {
          let downDate = this.sortedData[selections[0].row_index + 1];
          this.sortedData.splice(selections[0].row_index + 1, 1);
          this.sortedData.splice(selections[0].row_index,0, downDate);
        }

      
      })


    },
    zhiding(selections)
    {
     
      topestTask(selections[0].equipmentID,selections[0].id).then(res=>{
      debugger
       this.$message({message: '置顶成功', type: 'success'});
      var returnTop=this.sortedData[selections[0].row_index ];
                this.sortedData.splice(selections[0].row_index,1)
               this.sortedData.unshift(returnTop);
      
      })
       
    },
    tableRowClassName({row, rowIndex}) {

	row.row_index = rowIndex;
},
deleteTask(row)
{
  debugger
  console.log("删除"+row[0].id);
  deleteTask1(row[0].id).then(res=>{
     this.$message({message: '删除成功', type: 'success'});
  })
}

        
    },
    watch:{
      searchCode(val)
      {
        console.log(val)
        this.page.toquery.TestCode=this.searchCode
      }
    }
  }

</script>

<style>
  .crud-opts {
    padding: 4px 0;
    display: -webkit-flex;
    display: flex;
    align-items: center;
  }

  .crud-opts .crud-opts-right {
    margin-left: auto;
  }
  .information-title {
  cursor: pointer;  /*鼠标悬停变小手*/
 
}
</style>