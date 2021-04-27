<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>实时监控</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.deviceName" placeholder="输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-select size="small" v-model="formInline.deviceType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="厨房" value="1"></el-option>
          <el-option label="客厅" value="2"></el-option>
          <el-option label="卧室" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" prop="deviceName" label="设备名称" width="150" />
      <el-table-column align="center" prop="deviceType" label="设备类型" width="100" />
      <el-table-column align="center" prop="httpFlvUrl" label="设备地址" width="800" />
            <el-table-column align="center" prop="isDelete" label="是否删除" min-width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isDelete" inactive-color="#13ce66" active-color="#ff4949" disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="handlePlay(scope.$index, scope.row)" :disabled="scope.row.isDelete">查看实时监控视频</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

    <el-dialog title="实时监控播放" :visible.sync="editFormVisible" width="70%" :before-close="closeDialog">
      <div class="mainContainer">
          <video id="videoElement" class="centeredVideo" controls autoplay width="1024" height="576">Your browser is too old which doesn't support HTML5 video.</video>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deviceListAPI, deviceSaveAPI, deviceDeleteAPI } from '../../api/request'
import Pagination from '../../components/Pagination'
import flvjs from 'flv.js'

export default {
  data() {
    return {
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏

      // 搜索
      formInline: {
        page: 1,
        limit: 10,
        deviceName: '',
        deviceType: '',
      },

      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },

      flvPlayer: null
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    this.getdata(this.formInline)
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取公司列表
    getdata(parameter) {
      this.loading = true
      deviceListAPI(parameter).then( res => {
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
        this.$message.error('菜单加载失败，请稍后再试！')
      })
      this.loading = false
    },

    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },

    // 搜索事件
    search() {
      this.getdata(this.formInline)
    },

    //显示编辑界面
    handlePlay: function(index, row) {
      this.editFormVisible = true
      if (flvjs.isSupported()) {
        if (row != undefined && row != 'undefined') {
          try{
            this.flvPlayer = flvjs.createPlayer({
                type: 'flv',
                isLive: true,
                url: row.httpFlvUrl
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
   
    // 关闭编辑、增加弹出框
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

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
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

 
 