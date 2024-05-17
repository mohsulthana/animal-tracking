<template>
  <PieChart :chart-data="data" />
</template>

<script>
import PieChart from '@/components/Charts/Pie.vue'

export default {
  name: 'AnimalGenderChart',
  components: {
    PieChart
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

