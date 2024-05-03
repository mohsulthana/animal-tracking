<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" @handleSetPieChartData="handleSetPieChartData" />

    <el-row>
      <el-col>
        <el-card class="box-card">
          <AnimalGenderChart :data="animalStatisticData" />
        </el-card>
        <div class="chart-wrapper" />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-card class="box-card">
          <button :style="[selected===1 ? {'background': 'blue','color': 'white'}: {'background': '#FFF'}]" @click="selected=1, handleSetLineChartData('footagein7days')">7 days</button>
          <button :style="[selected===2 ? {'background': 'blue','color': 'white'}: {'background': '#FFF'}]" @click="selected=2, handleSetLineChartData('footagein1month')">1 month</button>
          <button :style="[selected===3 ? {'background': 'blue','color': 'white'}: {'background': '#FFF'}]" @click="selected=3, handleSetLineChartData('footagein6months')">6 months</button>
          <button :style="[selected===4 ? {'background': 'blue','color': 'white'}: {'background': '#FFF'}]" @click="selected=4, handleSetLineChartData('footagein1year')">1 year</button>

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
      lineChartData1: {
        goatNumber: [0, 0, 0, 0, 0, 0, 0],
        sheepNumber: [0, 0, 0, 0, 0, 0, 0],
        cattleNumber: [0, 0, 0, 0, 0, 0, 0],
        bokNumber: [0, 0, 0, 0, 0, 0, 0]
      },
      lineChartData: { type: 'footagein7days', data: [] },
      pieChartData: { AdultMaleCount: 10, AdultFemaleCount: 20, YoungMaleCount: 30, YoungFemaleCount: 40 },
      animalStatisticData: {}
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

      data.data.forEach((value) => {
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
