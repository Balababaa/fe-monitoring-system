<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>


<el-form ref="form" :model="userForm" label-width="80px" style="margin-top:20px">


    <el-form-item label="头像">
        <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/api/file/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
    </el-form-item>
  
  <el-form-item label="用户ID">
    <el-input v-model="userForm.uid" disabled></el-input>
  </el-form-item>
    <el-form-item label="用户名">
    <el-input v-model="userForm.username" disabled></el-input>
  </el-form-item>
    <el-form-item label="用户昵称" prop="nickname">
    <el-input v-model="userForm.nickname"></el-input>
  </el-form-item>
      <el-form-item label="用户密码">
    <el-input v-model="userForm.password"></el-input>
  </el-form-item>
      <el-form-item label="用户邮箱">
    <el-input v-model="userForm.email" disabled></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="update">修改</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>
import { UserUpdateAPI } from '../../api/request'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      listData: [], //用户数据
      imageUrl: '',
      userForm: {

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

  /**
   * 创建完毕
   */
  created() {
    this.userForm = JSON.parse(localStorage.getItem('userdata'))
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    handleAvatarSuccess(res, file) {
        console.log(res)
        this.userForm.avatar = res.data
    },

    update(userForm) {
        UserUpdateAPI(this.userForm).then(res => {
            if(res.code == 0){
            localStorage.setItem('userdata', JSON.stringify(res.data))
              this.$message({
                  type: 'success',
                  message: '设备保存成功！'
                })
        }else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }

        })            .catch(err => {
              this.$message.error('保存失败，请稍后再试！')
            })

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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
