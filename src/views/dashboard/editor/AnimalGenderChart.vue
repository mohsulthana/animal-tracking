<template>
  <PieChart :chart-data="data" />
</template>

<script>
import PieChart from './Pie.vue'

export default {
  name: 'AnimalGenderChart',
  components: {
    PieChart
  },
  props: {
    data: Object
  }
}
</script>

