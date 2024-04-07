<template>
  <div class="dashboard-editor-container">
    <el-row>
      <div>
        <AnimalRecordManage />
      </div>
    </el-row>

  </div>
</template>

<script>

import AnimalRecordManage from '@/views/animalmanagement/AnimalRecordManage'

export default {
  name: 'AnimalrecordManage',
  components: {
    AnimalRecordManage

  },

  data: () => {
    return {
    }
  },

  mounted() {
  },

  methods: {

  }
}
</script>
