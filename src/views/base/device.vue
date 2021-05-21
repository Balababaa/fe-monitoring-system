<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
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
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" prop="deviceName" label="设备名称" width="150" />
      <el-table-column align="center" prop="deviceType" label="设备类型" width="100" />
      <el-table-column align="center" prop="httpFlvUrl" label="设备地址" width="800" />
      <el-table-column align="center" prop="isDelete" label="是否删除" min-width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isDelete" inactive-color="#13ce66" active-color="#ff4949" @change="updateDeleteStatus(scope.$index, scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="creator" label="创建人" width="100" />
      <el-table-column align="center" prop="createTime" label="创建时间" width="150" />
      <el-table-column align="center" prop="modifier" label="修改人" width="100" />
      <el-table-column align="center" prop="updateTime" label="修改时间" width="150" />
      <el-table-column align="center" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="80px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input size="small" v-model="editForm.deviceName" auto-complete="off" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
            <el-select size="small" v-model="editForm.deviceType" placeholder="请选择">
            <el-option label="厨房" value="1"></el-option>
            <el-option label="客厅" value="2"></el-option>
            <el-option label="卧室" value="3"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备地址" prop="httpFlvUrl">
          <el-input size="small" v-model="editForm.httpFlvUrl" auto-complete="off" placeholder="请输入设备地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button size="small" @click="closeDialog">取消</el-button> -->
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deviceListAPI, deviceSaveAPI, deviceDeleteStatusUpdateAPI } from '../../api/request'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      editForm: {
        id: undefined,
        deviceName: '',
        deviceType: '',
        httpFlvUrl: '',
      },
      // rules表单验证
      rules: {
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        deviceType: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        httpFlvUrl: [
          { required: true, message: '请输入设备地址', trigger: 'blur' }
        ]
      },
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
      }
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
        this.$message.error('列表加载失败，请稍后再试！')
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
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改'
        this.editForm.id = row.id
        this.editForm.deviceName = row.deviceName
        this.editForm.deviceType = row.deviceType
        this.editForm.httpFlvUrl = row.httpFlvUrl
      } else {
        this.title = '添加'
        this.editForm.id = undefined
        this.editForm.deviceName = ''
        this.editForm.deviceType = ''
        this.editForm.httpFlvUrl = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          deviceSaveAPI(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.code == 0) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '设备保存成功！'
                })
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('设备保存失败，请稍后再试！')
            })
        } else {
          return false
        }
      })
    },

    // 更新设备删除状态
    updateDeleteStatus(index, row) {
        this.loading = true
        deviceDeleteStatusUpdateAPI({'id': row.id}).then(res => {
            this.getdata(this.formInline)  
        }).catch(err => {
            this.$message.error('设备删除状态更新失败，请稍后再试！')
        })
        this.loading = false
    },

    // 关闭编辑、增加弹出框
    closeDialog() {
      console.log('unload')
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
</style>

 
 