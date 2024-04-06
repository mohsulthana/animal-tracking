<template>
  <div class="dashboard-editor-container">

    <el-row>
      <div style="text-align:center"><h1>Animals Register</h1></div>
      <div>
        <AnimalRegister />
      </div>
    </el-row>

  </div>
</template>

<script>

import AnimalRegister from '@/views/animalregister/AnimalRegister'

export default {
  name: 'Animalonmap',
  components: {
    AnimalRegister

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

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

</style>
