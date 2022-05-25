<template>

<el-container>
  <el-header>
  <el-row :gutter="20">
  <el-col :span="12" :offset="6">
  <div style="margin-top: 15px;">
  <el-input placeholder="请输入搜索内容" v-model="searchString" class="input-with-select">
    <el-select v-model="select" slot="prepend" placeholder="请选择">
      <el-option label="设备检号" value="1"></el-option>
      <el-option label="委托编号" value="2"></el-option>
    </el-select>
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
</div>
  </el-col>
</el-row>
  
</el-header>

  <el-main>

  <el-row :gutter="20">
  <el-col :span="8" v-for="(value, key)  in taskData" :key="key">
  <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>{{key}}</span>
    <span>{{"(当前有"+value.length+"个样品在队列中)"}}</span>
    <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
  </div>


  <el-table :data="limitRows(value)" style="width: 100%">
      <el-table-column
        label="序号"
        width="50">
          <template slot-scope="scope">
          <span>{{scope.$index +1}}</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="sampleNo"
        label="样品编号"
        width="120">
      </el-table-column>
         <el-table-column
        prop="goodsName"
        label="样品名称">
      </el-table-column>
      <el-table-column
        prop="expectTime"
        label="预计做完时间">
      </el-table-column>
    </el-table>

</el-card>
</el-col>
  
</el-row>
  
</el-main>
</el-container>



</template>
<script>
  import {
      getIndexSortedTasks
  } from '@/api/task/task'

export default {
  data() {
    return {
      input1: '',
      input2: '',
      input3: '',
      select: '',
      taskData:{},
      searchString:""
    }
  },
   mounted() {
      this.refresh(this.select,this.searchString)
    },
  methods:{
    refresh(select,searchString)
    {
      
      getIndexSortedTasks(select,searchString).then(res=>{
        this.taskData=res.data;
      });
    },
    limitRows(value)
    {
      debugger
      console.log(value);
      var expectTime=0;
      var ret = [];


      value.forEach(item=>{
        if(item!=null){
           expectTime=Number(item.planTime)+Number(expectTime)-Number(item.taskTime);
           this.$set(item,'expectTime',expectTime)
           ret.push(item)
        }
      });
      return ret.slice(0,6);
     
    }


  }
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

  .box-card {
    width: 480px;
  }
</style>