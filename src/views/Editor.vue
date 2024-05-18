<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" @handleSetPieChartData="handleSetPieChartData" />

    <el-row :gutter="12">
      <el-col span="12">
        <el-card>
          <AnimalGenderChart v-if="animalStatisticData.labels.length" :data="animalStatisticData" />
          <el-empty v-else description="Empty category data" />
        </el-card>
      </el-col>
      <el-col span="12">
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
      pieChartData: { AdultMaleCount: 10, AdultFemaleCount: 20, YoungMaleCount: 30, YoungFemaleCount: 40 },
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

    this.lineChartData1 = { goatNumber: this.$store.getters.footagecount.totalgoatin7days, cattleNumber: this.$store.getters.footagecount.totalcattlein7days, sheepNumber: this.$store.getters.footagecount.totalsheepin7days, bokNumber: this.$store.getters.footagecount.totalbokin7days }
    this.lineChartData = { type: 'footagein7days', data: this.$store.getters.categoryfootage }
  },

  methods: {
    async fetchAnimalGender() {
      const { data } = await this.$http.get('api/total-gender')
      const labels = []
      const totalAnimals = []
      const backgroundColor = ['#41B883', '#E46651']
      const datasets = [{
        backgroundColor,
        data: totalAnimals
      }]

      data.animals.forEach((value) => {
        labels.push(value.gender)
        totalAnimals.push(value.total_animals)
      })

      this.animalStatisticData = {
        labels,
        datasets
      }
    },
    handleSetLineChartData(type) {
      this.lineChartData = { type: type, data: this.$store.getters.categoryfootage }
    },

    handleSetLineChartData1(type) {
      switch (type) {
        case 'footagein7days':
          this.lineChartData1 = { goatNumber: this.$store.getters.footagecount.totalgoatin7days, cattleNumber: this.$store.getters.footagecount.totalcattlein7days, sheepNumber: this.$store.getters.footagecount.totalsheepin7days, bokNumber: this.$store.getters.footagecount.totalbokin7days }
          break
        case 'footagein1month':
          this.lineChartData1 = { goatNumber: this.$store.getters.footagecount.totalgoatin1month, cattleNumber: this.$store.getters.footagecount.totalcattlein1month, sheepNumber: this.$store.getters.footagecount.totalsheepin1month, bokNumber: this.$store.getters.footagecount.totalbokin1month }
          break
        case 'footagein6months':
          this.lineChartData1 = { goatNumber: this.$store.getters.footagecount.totalgoatin6months, cattleNumber: this.$store.getters.footagecount.totalcattlein6months, sheepNumber: this.$store.getters.footagecount.totalsheepin6months, bokNumber: this.$store.getters.footagecount.totalbokin6months }
          break
        case 'footagein1year':
          this.lineChartData1 = { goatNumber: this.$store.getters.footagecount.totalgoatin1year, cattleNumber: this.$store.getters.footagecount.totalcattlein1year, sheepNumber: this.$store.getters.footagecount.totalsheepin1year, bokNumber: this.$store.getters.footagecount.totalbokin1year }
          break
      }
    },

    handleSetPieChartData(type) {
      var AdultMaleCount = 0
      var AdultFemaleCount = 0
      var YoungMaleCount = 0
      var YoungFemaleCount = 0

      AdultMaleCount = this.$store.getters.animals.filter(a => a.category === type && a.monthage >= 12 && a.gender === 'M').length
      AdultFemaleCount = this.$store.getters.animals.filter(a => a.category === type && a.monthage >= 12 && a.gender === 'F').length
      YoungMaleCount = this.$store.getters.animals.filter(a => a.category === type && a.monthage < 12 && a.gender === 'M').length
      YoungFemaleCount = this.$store.getters.animals.filter(a => a.category === type && a.monthage < 12 && a.gender === 'F').length

      this.pieChartData = { AdultMaleCount: AdultMaleCount,
        AdultFemaleCount: AdultFemaleCount,
        YoungMaleCount: YoungMaleCount,
        YoungFemaleCount: YoungFemaleCount }
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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
