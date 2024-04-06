<template>
  <div class="dashboard-editor-container">

    <el-row>
      <div style="text-align:center"><h1>Animals on the map</h1></div>
      <div>
        <HereMap />
      </div>
    </el-row>

  </div>
</template>

<script>

import HereMap from '@/views/animalonmap/HereMap.vue'

export default {
  name: 'Animalonmap',
  components: {
    HereMap

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
