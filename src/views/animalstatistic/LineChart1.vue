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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      monthnames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      weekdaynames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
    setOptions({ goatNumber, cattleNumber, sheepNumber, bokNumber } = {}) {
      if (this.chart == null) { return }
      var xlabels = null
      var today = new Date()

      if (goatNumber.length == 7) { // footage in a week.
        var w = today.getDay() - 1
        xlabels = [this.weekdaynames[(w - 6 < 0) ? w - 6 + 7 : w - 6], this.weekdaynames[(w - 5 < 0) ? w - 5 + 7 : w - 5], this.weekdaynames[(w - 4 < 0) ? w - 4 + 7 : w - 4], this.weekdaynames[(w - 3 < 0) ? w - 3 + 7 : w - 3], this.weekdaynames[(w - 2 < 0) ? w - 2 + 7 : w - 2], this.weekdaynames[(w - 1 < 0) ? w - 1 + 7 : w - 1], this.weekdaynames[w]]
      }
      if (goatNumber.length == 4) { // footage in a month.
        xlabels = ['Wk1', 'Wk2', 'Wk3', 'Wk4']
      }
      if (goatNumber.length == 6) { // footage in  6 months.
        var m = today.getMonth() - 1
        xlabels = [this.monthnames[(m - 5 < 0) ? m - 5 + 12 : m - 5], this.monthnames[(m - 4 < 0) ? m - 4 + 12 : m - 4], this.monthnames[(m - 3 < 0) ? m - 3 + 12 : m - 3], this.monthnames[(m - 2 < 0) ? m - 2 + 12 : m - 2], this.monthnames[(m - 1 < 0) ? m - 1 + 12 : m - 1], this.monthnames[m]]
      }
      if (goatNumber.length == 12) { // footage in a year.
        var m = today.getMonth() - 1
        xlabels = [this.monthnames[(m - 11 < 0) ? m - 11 + 12 : m - 11], this.monthnames[(m - 10 < 0) ? m - 10 + 12 : m - 10], this.monthnames[(m - 9 < 0) ? m - 9 + 12 : m - 9], this.monthnames[(m - 8 < 0) ? m - 8 + 12 : m - 8], this.monthnames[(m - 7 < 0) ? m - 7 + 12 : m - 7], this.monthnames[(m - 6 < 0) ? m - 6 + 12 : m - 6], this.monthnames[(m - 5 < 0) ? m - 5 + 12 : m - 5], this.monthnames[(m - 4 < 0) ? m - 4 + 12 : m - 4], this.monthnames[(m - 3 < 0) ? m - 3 + 12 : m - 3], this.monthnames[(m - 2 < 0) ? m - 2 + 12 : m - 2], this.monthnames[(m - 1 < 0) ? m - 1 + 12 : m - 1], this.monthnames[m]]
      }
      this.chart.setOption({
        xAxis: {
          data: xlabels,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['expected', 'actual']
        },
        series: [{
          name: 'Goats', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#36a3f7',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: goatNumber,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: 'Cattle',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#00ff00',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: cattleNumber,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: 'Sheep',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#40c9c6',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: sheepNumber,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: 'Bok',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#f4516c',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: bokNumber,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
