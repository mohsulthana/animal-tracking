<template>
  <div class="dashboard-editor-container">
    <panel-group
      @handleSetLineChartData="handleSetLineChartData"
    />

    <el-row :gutter="24">
      <el-col :span="12" :xs="24">
        <el-card>
          <AnimalGenderChart
            v-if="animalStatisticData.labels?.length"
            :data="animalStatisticData"
          />
          <el-empty v-else description="Empty animal data" />
        </el-card>
      </el-col>
      <el-col :span="12" :xs="24">
        <el-card>
          <el-radio-group v-model="selected">
            <el-radio-button :label="1">7 Days</el-radio-button>
            <el-radio-button :label="2">1 Month </el-radio-button>
            <el-radio-button :label="3"> 6 Months </el-radio-button>
            <el-radio-button :label="4">1 Year</el-radio-button>
          </el-radio-group>

          <line-chart :chart-data="lineChartData" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from '@/views/dashboard/PanelGroup'
import LineChart from '@/views/animalstatistic/LineChart'
// TODO: Delete component as well
// import PieChart from '@/views/animalstatistic/PieChart'
import AnimalGenderChart from './AnimalGenderChart'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    AnimalGenderChart
  },

  data: () => {
    return {
      selected: 1,
      lineChartData: { type: 'footagein7days', data: [] },
      animalStatisticData: {},
      animalFootageHistoryData: {}
    }
  },
  watch: {
    selected: function(newVal, oldVal) {
      switch (newVal) {
        case 1:
          this.handleSetLineChartData('footagein7days')
          break
        case 2:
          this.handleSetLineChartData('footagein1month')
          break
        case 3:
          this.handleSetLineChartData('footagein6months')
          break
        case 4:
          this.handleSetLineChartData('footagein1year')
          break
        default:
          break
      }
    }
  },
  mounted() {
    this.fetchAnimalGender()
    this.fetchFootageChart()
  },

  methods: {
    async fetchAnimalGender() {
      const { data } = await this.$http.get('total-gender')
      const labels = []
      const totalAnimals = []
      const backgroundColor = ['#41B883', '#E46651']
      const datasets = [
        {
          backgroundColor,
          data: totalAnimals
        }
      ]

      data.animals.forEach((value) => {
        labels.push(value.gender)
        totalAnimals.push(value.total_animals)
      })

      this.animalStatisticData = {
        labels,
        datasets
      }
    },
    async fetchFootageChart() {
      const { data } = await this.$http.get('footage-chart')
      data.data.forEach(footage => {
        this.lineChartData.data.push(footage)
      })
    },
    handleSetLineChartData(type) {
      this.lineChartData.type = type
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
