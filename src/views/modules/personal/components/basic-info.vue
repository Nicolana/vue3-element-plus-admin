<template>
  <el-form
    class="basic-info-container"
    :model="form"
    :rules="rules"
    ref="refForm"
    @keyup.enter="submit()"
    label-position="top">
    <el-form-item label="头像" prop="avatar">
      <ImageUploadSingle v-model="form.avatar" :disabled="!havePermission('administrator:basic')" />
    </el-form-item>
    <el-form-item label="昵称" prop="nickname">
      <el-input
        v-model="form.nickname"
        placeholder="昵称"
        maxlength="20"
        show-word-limit
        :disabled="!havePermission('administrator:basic')" />
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="form.mobile" placeholder="手机号" :disabled="!havePermission('administrator:basic')" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" placeholder="邮箱" :disabled="!havePermission('administrator:basic')" />
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-radio-group v-model="form.sex" :disabled="!havePermission('administrator:basic')">
        <el-radio :label="0">女</el-radio>
        <el-radio :label="1">男</el-radio>
        <el-radio :label="2">未知</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="havePermission('administrator:basic')">
      <el-button v-repeat type="primary" @click="submit()">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { computed, defineComponent, onBeforeMount, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'

import { ElMessage } from 'element-plus'
import ImageUploadSingle from '@/components/image-upload-single'

import { isEmail, isMobile } from '@/utils/regular'
import { havePermission } from '@/utils'

import { editBasicApi } from '@/api/administrator'

export default defineComponent({
  components: { ImageUploadSingle },
  props: {
    administrator: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore()

    const refForm = ref()
    const data = reactive({
      form: {
        avatar: '',
        nickname: '',
        mobile: '',
        email: '',
        sex: 2
      }
    })
    const rules = computed(() => {
      const checkMobile = (_rule, value, callback) => {
        if (data.form.mobile !== '' && !isMobile(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
      const checkEmail = (_rule, value, callback) => {
        if (data.form.email !== '' && !isEmail(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
      return {
        nickname: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }]
      }
    })

    const submit = () => {
      refForm.value.validate(valid => {
        if (valid) {
          editBasicApi(data.form).then(r => {
            if (r) {
              store.dispatch('administrator/getAdministrator')
              ElMessage({
                message: '操作成功!',
                type: 'success'
              })
            }
          })
        }
      })
    }

    onBeforeMount(() => {
      data.form.avatar = props.administrator.avatar
      data.form.nickname = props.administrator.nickname
      data.form.mobile = props.administrator.mobile
      data.form.email = props.administrator.email
      data.form.sex = props.administrator.sex
    })

    return {
      refForm,
      ...toRefs(data),
      rules,
      submit,
      havePermission
    }
  }
})
</script>

<style lang="scss" scoped>
.basic-info-container {
  min-width: 350px;
  max-width: 500px;
}
</style>
