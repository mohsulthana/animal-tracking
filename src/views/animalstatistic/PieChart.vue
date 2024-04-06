<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    chartData: {
      type: Object,
      defualt: {
        AdultMaleCount: 0,
        AdultFemaleCount: 0,
        YoungMaleCount: 0,
        YoungFemaleCount: 0
      },
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },

  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },

  beforeCreate() {
    this.$nextTick(() => {
      this.initChart()
    })
  },

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },

    setOptions(chartData) {
      var totalCount = (this.chartData.AdultMaleCount + this.chartData.AdultFemaleCount + this.chartData.YoungMaleCount + this.chartData.YoungFemaleCount)
      var AdultMalePercent = 0
      var AdultFemalePercent = 0
      var YoungMalePercent = 0
      var YoungFemalePercent = 0

      if (totalCount >= 1) {
        AdultMalePercent = Math.round((this.chartData.AdultMaleCount / totalCount * 100), 1)
        AdultFemalePercent = Math.round((this.chartData.AdultFemaleCount / totalCount * 100), 1)
        YoungMalePercent = Math.round((this.chartData.YoungMaleCount / totalCount * 100), 1)
        YoungFemalePercent = Math.round((this.chartData.YoungFemaleCount / totalCount * 100), 1)
      }

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Adult Male', 'Adult Female', 'Young Male', 'Young Female']
        },
        series: [
          {
            name: 'Gender and age percentages',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: chartData.AdultMaleCount, name: 'Adult Male(' + this.chartData.AdultMaleCount + ' with ' + AdultMalePercent + '%)' },
              { value: chartData.AdultFemaleCount, name: 'Adult Female(' + this.chartData.AdultFemaleCount + ' with ' + AdultFemalePercent + '%)' },
              { value: chartData.YoungMaleCount, name: 'Young Male(' + this.chartData.YoungMaleCount + ' with ' + YoungMalePercent + '%)' },
              { value: chartData.YoungFemaleCount, name: 'Young Female(' + this.chartData.YoungFemaleCount + ' with ' + YoungFemalePercent + '%)' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
