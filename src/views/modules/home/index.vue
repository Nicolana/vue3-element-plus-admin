<template>
  <ContainerCustom>
    <template #default>
      <div class="home-container flex-box flex_w-wrap margin-10">
        <Introduction class="flex-item_f-3 margin-10" />
        <div class="flex-item_f-3 margin-10">
          <Project />
          <Interacted class="margin_t-20" />
        </div>
        <div class="width-full flex-box">
          <Visits class="margin-10 flex-item_f-3" />
          <Advertisement class="margin-10 flex-item_f-2" />
        </div>
      </div>
    </template>
  </ContainerCustom>
</template>

<script >
import { defineComponent, reactive, toRefs } from 'vue'

import ContainerCustom from '@/components/container-custom'
import Introduction from './components/introduction'
import Project from './components/project'
import Interacted from './components/interacted'
import Visits from './components/visits'
import Advertisement from './components/advertisement'

export default defineComponent({
  components: { ContainerCustom, Introduction, Project, Interacted, Visits, Advertisement },
  setup() {
    const data = reactive({
    })

    return {
      ...toRefs(data)
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
