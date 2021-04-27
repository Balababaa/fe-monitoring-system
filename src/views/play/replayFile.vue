<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/play/Replay' }">监控回放</el-breadcrumb-item>
      <el-breadcrumb-item>回放文件</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="选择起止时间：">
          <el-date-picker
        v-model="timeRange"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        value-format="yyyy-MM-dd HH:mm:ss"
        >
      </el-date-picker>

      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
      </el-form-item>
    </el-form>


    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column  align="center" prop="fileName" label="文件名称" min-width="300" />
      <el-table-column  align="center" prop="fileSize" label="文件大小" width="150" />
      <el-table-column  align="center" prop="startTime" label="开始时间" width="150" />
      <el-table-column  align="center" prop="endTime" label="结束时间" width="150" />
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="handlePlay(scope.$index, scope.row)">播放</el-button>
          <el-button type="primary" plain @click="handleDownload(scope.$index, scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

    <el-dialog :title="title" :visible.sync="editFormVisible" width="70%" :before-close="closeDialog">
      <div class="mainContainer">
          <video id="videoElement" class="centeredVideo" controls autoplay width="1024" height="576">Your browser is too old which doesn't support HTML5 video.</video>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { videoFileListAPI, videoFileDownloadAPI } from '../../api/request'
import Pagination from '../../components/Pagination'
import flvjs from 'flv.js'

export default {
  data() {
    return {
      title:'',
      editFormVisible :false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      timeRange: '',
      formInline: {
        page: 1,
        limit: 10,
        startTime: null,
        endTime: null,
        deviceId: null
      },
      listData: [], //列表数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      // 播放器
      flvPlayer: null
    }
  },

  // 注册组件
  components: {
    Pagination
  },

  /**
   * 创建完毕
   */
  created() {
    this.formInline.deviceId = this.$route.query.id
    this.getdata(this.formInline)
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取文件列表
    getdata(parameter) {
      this.loading = true
      console.log(parameter)
      videoFileListAPI(parameter).then( res => {
        console.log(res)
        if(res.code == 0 ){
          this.listData = res.data.dataList
          this.pageparm.currentPage = this.formInline.page
          this.pageparm.pageSize = this.formInline.limit
          this.pageparm.total = res.data.total
        }else{
            this.$message({
              type: 'info',
              message: res.msg
            })
        }
      }).catch( err => {
        this.$message.error('加载失败，请稍后再试！')
      })
      this.loading = false
    },

    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },

    // 搜索
    search() {
      if(this.timeRange == null){
        this.formInline.startTime=null
        this.formInline.endTime=null
      }else{
      this.formInline.startTime = this.timeRange[0]
      this.formInline.endTime = this.timeRange[1]
      }
      this.getdata(this.formInline)
    },

    // 打开视频播放界面
    handlePlay: function(index, row) {
      this.editFormVisible = true
      this.title = '监控回放'
      if (flvjs.isSupported()) {
        if (row != undefined && row != 'undefined') {
          try{
            this.flvPlayer = flvjs.createPlayer({
                type: 'video/mp4',
                url: `http://192.168.18.107:8808/api/video/file/play/${row.fileName}`
            });
            var videoElement = document.getElementById('videoElement');
            this.flvPlayer.attachMediaElement(videoElement);
            this.flvPlayer.load();
            this.flvPlayer.play();
          }catch(e){
            this.flvPlayer = null;
            this.$message.error('加载失败，请稍后再试！')
          }
        }
      }
    },
    
    // 下载视频文件
    handleDownload: function(index, row) {
      if (row != undefined && row != 'undefined') {
        videoFileDownloadAPI(row.fileName)
      }
    },

    // 关闭播放界面
    closeDialog() {
      console.log('unload')

      if(this.flvPlayer != null){
        this.flvPlayer.pause();
        this.flvPlayer.unload();
        this.flvPlayer.detachMediaElement();
        this.flvPlayer.destroy();
        this.flvPlayer = null;
      }
      this.editFormVisible = false
    }
  }
}
</script>

<<style scoped>
.user-search {
  margin-top: 20px;
}
.mainContainer {
  display: block;
  width: 1024px;
  margin-left: auto;
  margin-right: auto;
}
.centeredVideo {
  display: block;
  width: 100%;
  height: 576px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: auto;
}

</style>
 