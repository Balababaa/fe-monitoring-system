/**
 * 系统管理  权限管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.code" placeholder="输入权限CODE"></el-input>
      </el-form-item>
      <!-- <el-form-item label="角色：">
        <el-select size="small" v-model="formInline.roleId" placeholder="请选择">
          <el-option selected label="请选择" value="0"></el-option>
          <el-option v-for="parm in userparm" :key="parm.roleId" :label="parm.roleName" :value="parm.roleId"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
        <!-- <el-button size="small" type="primary" icon="el-icon-plus" @click="RolePermission()">配置权限</el-button> -->
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" prop="name" label="权限名称" width="150">
      </el-table-column>
      <el-table-column align="center" prop="code" label="权限CODE" width="150">
      </el-table-column>
      <el-table-column align="center" prop="type" label="权限类型" width="150">
      </el-table-column>
      <el-table-column align="center" prop="path" label="菜单路径" min-width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" min-width="150">
      </el-table-column>
      <el-table-column align="center" prop="creator" label="创建人" width="150">
      </el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间" min-width="150">
      </el-table-column>
      <el-table-column align="center" prop="modifier" label="修改人" width="150">
      </el-table-column>
      <!-- <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog title="添加权限" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="权限名称" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off" placeholder="权限名称"></el-input>
        </el-form-item>
        <el-form-item label="权限CODE" prop="code">
          <el-input size="small" v-model="editForm.code" auto-complete="off" placeholder="权限CODE"></el-input>
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-select size="small" v-model="editForm.type" placeholder="请选择">
            <el-option label="功能权限" value="1"></el-option>
            <el-option label="菜单权限" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input size="small" v-model="editForm.path" auto-complete="off" placeholder="权限PATH"></el-input>
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
import {
  permissionList,
  permissionSave,
  // ermissionDelete,
  // roleDropDown,
  // RolePermission
} from '../../api/request'
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
        code: '',
        name: '',
        type: '',
        path: ''
      },
      // rules表单验证
      rules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入权限CODE', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入权限类型', trigger: 'blur' }
        ]
      },
      formInline: {
        page: 1,
        limit: 10,
        code: '',
      },
      // 选择数据
      selectdata: [],
      userparm: [], //搜索权限
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
   * 数据发生改变
   */

  watch: {},

  /**
   * 创建完毕
   */

  created() {
    this.getdata(this.formInline)
    // this.getAccsee()
  },

  /**
   * 里面的方法只有被调用才会执行
   */

  methods: {
    // 获取数据方法
    getdata(parameter) {
      this.loading = true
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      // 获取权限列表
      permissionList(parameter)
        .then(res => {
          this.loading = false
          if (res.code != 0) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.listData = res.data.dataList
            // 分页赋值
            this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total = res.data.total
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('权限管理列表获取失败，请稍后再试！')
        })
    },
    // 获取权限
    getAccsee() {
      roleDropDown()
        .then(res => {
          if (res.success == false) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.userparm = res.data
          }
        })
        .catch(err => {
          this.$message.error('权限获取失败，请稍后再试！')
        })
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
      // 深拷贝并赋值
      //this.editForm = Object.assign({}, row)
      if (row != undefined && row != 'undefined') {
        this.title = '修改'
        this.editForm.permissionId = row.permissionId
        this.editForm.permissionName = row.permissionName
        this.editForm.permission = row.permission
      } else {
        this.title = '添加'
        this.editForm.permissionId = ''
        this.editForm.permissionName = ''
        this.editForm.permission = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          permissionSave(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.code == 0) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '权限管理保存成功！'
                })
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
              this.editForm = {}
            })
            .catch(err => {
              this.editForm = {}
              this.editFormVisible = false
              this.loading = false
              this.$message.error('权限管理保存失败，请稍后再试！')
            })
        } else {
          return false
        }
      })
    },
    // 删除权限
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ermissionDelete(row.permissionId)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '权限管理已删除！'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('权限管理删除失败,请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 选择复选框事件
    selectChange(val) {
      this.selectdata = val
    },
    // 配置权限
    RolePermission() {
      let parms = {
        roleId: '',
        permissionIds: ''
      }
      if (this.formInline.roleId == '0') {
        this.$message({
          type: 'info',
          message: '请选择角色'
        })
        return false
      }
      parms.roleId = this.formInline.roleId
      let len = this.selectdata
      let ids = []
      if (len != 0) {
        for (let i = 0; i < len.length; i++) {
          ids.push(len[i].permissionId)
        }
      }
      parms.permissionIds = ids.join(',')
      RolePermission(parms)
        .then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '配置权限成功！'
            })
            this.getdata(this.formInline)
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('配置权限失败,请稍后再试！')
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      console.log("close")
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

 