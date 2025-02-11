<template>
  <el-dialog
    width="450px"
    :title="form.id ? '编辑' : '新增'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
    destroy-on-close>
    <el-form
      v-loading="loading"
      :model="form"
      :rules="rules"
      ref="refForm"
      @keyup.enter="submit()"
      label-position="top">
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="form.nickname"
          placeholder="昵称"
          maxlength="20"
          show-word-limit />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          placeholder="用户名"
          maxlength="20"
          show-word-limit />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="密码"
          maxlength="20" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" placeholder="确认密码" show-password />
      </el-form-item>
      <el-form-item label="角色" prop="role_ids">
        <el-checkbox-group v-model="form.role_ids">
          <el-checkbox v-for="role in roles" :key="role.id" :label="role.id">{{ role.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <Collapse inactive-text="展开（非必填项）">
        <template #default>
          <el-form-item label="头像" prop="avatar">
            <ImageUploadSingle v-model="form.avatar" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" placeholder="手机号" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="邮箱" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio :label="item.value" v-for="item in dictionaryList" :key="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </Collapse>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          v-repeat
          type="primary"
          @click="submit()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { computed, defineComponent, nextTick, onBeforeMount, reactive, ref, toRefs } from 'vue'

import { ElMessage } from 'element-plus'
import Collapse from '@/components/collapse'
import ImageUploadSingle from '@/components/image-upload-single'

import useDictionary from '@/mixins/dictionary'
import { isUsername, isPassword, isEmail, isMobile } from '@/utils/regular'

import { selectListApi } from '@/api/role'
import { infoApi, addApi, editApi } from '@/api/administrator'

export default defineComponent({
  emits: ['refresh'],
  components: { Collapse, ImageUploadSingle },
  setup(_props, { emit }) {
    const { dictionaryList, getDictionary } = useDictionary()
    const refForm = ref()
    const data = reactive({
      loading: false,
      visible: false,
      form: {
        id: null,
        nickname: '',
        username: '',
        password: '',
        confirmPassword: '',
        avatar: '',
        mobile: '',
        email: '',
        sex: 2,
        role_ids: []
      },
      roles: []
    })

    const rules = computed(() => {
      const checkUsername = (_rule, value, callback) => {
        if (!isUsername(value)) {
          callback(new Error('用户名由4-16位的数字、字母、中横线、下划线组成'))
        } else {
          callback()
        }
      }
      const checkPassword = (_rule, value, callback) => {
        if (data.form.id && !isPassword(value)) {
          callback(new Error('用户名由8-16位的数字、字母、中横线、下划线组成'))
        } else if (!data.form.id && !isPassword(value)) {
          callback(new Error('用户名由8-16位的数字、字母、中横线、下划线组成'))
        } else {
          callback()
        }
      }
      const checkConfirmPassword = (_rule, value, callback) => {
        if (data.form.password && data.form.password !== value) {
          callback(new Error('新密码与确认密码不一致'))
        } else {
          callback()
        }
      }
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
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        username: [
          { required: true, message: '请输入帐号', trigger: 'blur' },
          { validator: checkUsername, trigger: 'blur' }
        ],
        password: [
          { required: !data.form.id, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: !data.form.id, message: '请输入确认密码', trigger: 'blur' },
          { validator: checkConfirmPassword, trigger: 'blur' }
        ],
        mobile: [{ validator: checkMobile, trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        role_ids: [{ type: 'array', required: true, message: '请选择角色', trigger: 'blur' }]
      }
    })

    const getRole = async () => {
      const r = await selectListApi()
      if (r) {
        data.roles = r.data
      }
    }

    const init = async (id) => {
      data.visible = true
      data.loading = true
      data.form.id = id

      await getRole()
      if (id) {
        const r = await infoApi(id)
        if (r) {
          data.form.nickname = r.data.nickname
          data.form.username = r.data.username
          data.form.password = r.data.password
          data.form.avatar = r.data.avatar
          data.form.mobile = r.data.mobile
          data.form.email = r.data.email
          data.form.sex = r.data.sex
          data.form.role_ids = r.data.roles.map(item => item.id)
        }
      }

      nextTick(() => { data.loading = false })
    }

    /**
     * @description: 表单验证提交
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const submit = () => {
      refForm.value.validate(async valid => {
        if (valid) {
          const r = data.form.id ? await editApi(data.form) : await addApi(data.form)
          if (r) {
            data.visible = false
            ElMessage({
              message: '操作成功!',
              type: 'success'
            })
            emit('refresh')
          }
        }
      })
    }

    onBeforeMount(() => {
      getDictionary('sex')
    })

    /**
     * @description: 弹窗关闭动画结束时的回调
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const dialogClosedHandle = () => {
      refForm.value.resetFields()
    }

    return {
      refForm,
      dictionaryList,
      ...toRefs(data),
      rules,
      init,
      submit,
      dialogClosedHandle
    }
  }
})
</script>
