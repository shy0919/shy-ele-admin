<template>
  <div class="page-login">
    <vue-particles
      :click-effect="true"
      click-mode="repulse"
    />
    <div class="login-box">
      <el-form ref="ruleForm" :model="form" :rules="rules" class="ruleForm">
        <el-form-item prop="loginName">
          <el-input v-model.trim="form.loginName" placeholder="请输入用户名" :clearable="true" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model.trim="form.password" type="password" placeholder="请输入密码" :clearable="true" />
        </el-form-item>
        <el-form-item>
          <div class="login-button" @click="submitForm">登录</div>
        </el-form-item>
      </el-form>
      <div class="tips">
        账号:随便 密码:随便
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: '',
  setup() {
    const router = useRouter()
    // 表单ref
    const ruleForm = ref()
    const form = reactive({
      loginName: '',
      password: ''
    })
    // 校验规则
    const rules = {
      loginName: [{ required: true, message: '用户名不能为空' }],
      password: [{ required: true, message: '密码不能为空' }]
    }
    // 提交表单
    const submitForm = async() => {
      const formRef = unref(ruleForm)
      if (!formRef) return
      try {
        await formRef.validate()
        localStorage.setItem('loginfo', JSON.stringify(form))
        router.push('/')
      } catch (err) {
        console.log(err)
      }
    }
    // 回车登录
    const keydown = (event) => {
      if (event.keyCode === 13) {
        submitForm()
      }
    }
    onMounted(() => {
      window.addEventListener('keydown', keydown)
    })
    return {
      ruleForm,
      form,
      rules,
      submitForm,
      keydown
    }
  }
}
</script>

<style scoped lang='scss'>
.page-login{
  width: 100%;
  height: 100vh;
  background-color: #0b313f;
  .login-box{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .tips{
      color: #eee;
    }
    .login-button{
      cursor: pointer;
      width: 450px;
      border-radius: 5px;
      background-color: rgb(91,174,223);
      line-height: 46px;
      font-size: 20px;
      color: #fff;
      &:hover{
        background-color: rgb(91,170,220);
      }
      &:active{
        background-color: rgb(91,170,220);
      }
    }
  }
}
</style>
