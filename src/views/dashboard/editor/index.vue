<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" @handleSetPieChartData="handleSetPieChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col>
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieChartData" />
        </div>
      </el-col>
    </el-row>
    <el-row>
      <button :style="[selected===1 ? {'background': 'blue','color': 'white'}: {'background': '#FFF'}]" @click="selected=1, handleSetLineChartData('footagein7days')">7 days</button>
      <button :style="[selected===2 ? {'background': 'blue','color': 'white'}: {'background': '#FFF'}]" @click="selected=2, handleSetLineChartData('footagein1month')">1 month</button>
      <button :style="[selected===3 ? {'background': 'blue','color': 'white'}: {'background': '#FFF'}]" @click="selected=3, handleSetLineChartData('footagein6months')">6 months</button>
      <button :style="[selected===4 ? {'background': 'blue','color': 'white'}: {'background': '#FFF'}]" @click="selected=4, handleSetLineChartData('footagein1year')">1 year</button>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <!--    <el-row>
        <button :style="[selected===11 ? {'background': 'blue','color': 'white'}: {'background': '#FFF'}]" @click="selected=11, handleSetLineChartData1('footagein7days')">7 days</button>
        <button :style="[selected===12 ? {'background': 'blue','color': 'white'}: {'background': '#FFF'}]" @click="selected=12, handleSetLineChartData1('footagein1month')">1 month</button>
        <button :style="[selected===13 ? {'background': 'blue','color': 'white'}: {'background': '#FFF'}]" @click="selected=13, handleSetLineChartData1('footagein6months')">6 months</button>
        <button :style="[selected===14 ? {'background': 'blue','color': 'white'}: {'background': '#FFF'}]" @click="selected=14, handleSetLineChartData1('footagein1year')">1 year</button>
      </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart1 v-bind:chartData="lineChartData1" />
    </el-row>
   <el-row>
      <Qrcoderscanner />
      <AnimalRegister/>

    </el-row>
-->

    <!--   <el-row>
      <div><GoogleMap />
      </div>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      //      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
      //       <todo-list />
      //      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>

// import AnimalRegister from '@/views/animalregister/AnimalRegister'
// import AnimalRecordManage from '@/views/animalmanagement/AnimalRecordManage'
// import GithubCorner from '@/components/GithubCorner'
import PanelGroup from '@/views/dashboard/PanelGroup'
import LineChart from '@/views/animalstatistic/LineChart'
import LineChart1 from '@/views/animalstatistic/LineChart1'
// import RaddarChart from '@/views/animalstatistic/RaddarChart'
import PieChart from '@/views/animalstatistic/PieChart'
// import BarChart from '@/views/animalstatistic/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from '@/views/animalstatistic/BoxCard'
// import GoogleMap from '@/components/GoogleMap'
// import Qrcoderscanner from './components/Qrcodescanner'
// import HereMap from "@/views/animalonmap/HereMap.vue"
// import auth from '@/views/dashboard/admin/components/Config/firebase'
import firebase from 'firebase'
// import QRCanvas from './components/QRCanvas'

const lineChartData = {
  goatNumber: [80, 199, 130, 140, 90, 100, 110],
  sheepNumber: [100, 99, 230, 240, 190, 200, 210],
  cattleNumber: [1000, 99, 230, 240, 290, 100, 180],
  bokNumber: [280, 199, 170, 190, 150, 140, 170]
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    LineChart1,
    PieChart
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

      pieChartData: { AdultMaleCount: 10, AdultFemaleCount: 20, YoungMaleCount: 30, YoungFemaleCount: 40 }
      /*
      totalgoat: 0,
      totalbok: 0,
      totalsheep: 0,
      totalcattle: 0,

      totalgoatin7days:   [0, 0, 0, 0, 0, 0, 0],
      totalbokin7days:    [0, 0, 0, 0, 0, 0, 0],
      totalsheepin7days:  [0, 0, 0, 0, 0, 0, 0],
      totalcattlein7days: [0, 0, 0, 0, 0, 0, 0],

      totalgoatin1month:    [0, 0, 0, 0],
      totalbokin1month:     [0, 0, 0, 0],
      totalsheepin1month:   [0, 0, 0, 0],
      totalcattlein1month:  [0, 0, 0, 0],

      totalgoatin6months:    [0, 0, 0, 0, 0, 0],
      totalbokin6months:     [0, 0, 0, 0, 0, 0],
      totalsheepin6months:   [0, 0, 0, 0, 0, 0],
      totalcattlein6months:  [0, 0, 0, 0, 0, 0],

      totalgoatin1year:    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      totalbokin1year:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      totalsheepin1year:   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      totalcattlein1year:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
*/
    }
  },

  /* async created() {
    this.$nextTick(function () {
      window.addEventListener('beforeunload', this.countanimalfootages)
    })
  },*/

  /* destroyed() {
    window.removeEventListener('beforeunload', this.countanimalfootages)
  },*/
  async beforeCreate() {

    // this.$nextTick(function () {
    // this.countanimalfootages()
    // this.lineChartData = {goatNumber: this.$store.getters.footagecount.totalgoatin7days, cattleNumber: this.$store.getters.footagecount.totalcattlein7days, sheepNumber: this.$store.getters.footagecount.totalsheepin7days, bokNumber: this.$store.getters.footagecount.totalbokin7days}
    // })
  },
  mounted() {
    console.log(firebase.auth().currentUser)
    console.log(this.$store.state.logedinEmail)
    console.log(this.$store.state.password)
    if (!(firebase.auth().currentUser)) {
      firebase.auth().signInWithEmailAndPassword('duc@tut.ac.za', 'aaaaaa').then(() => {
        console.log(firebase.auth().currentUser)
      })
    }

    this.lineChartData1 = { goatNumber: this.$store.getters.footagecount.totalgoatin7days, cattleNumber: this.$store.getters.footagecount.totalcattlein7days, sheepNumber: this.$store.getters.footagecount.totalsheepin7days, bokNumber: this.$store.getters.footagecount.totalbokin7days }
    this.lineChartData = { type: 'footagein7days', data: this.$store.getters.categoryfootage }
  },

  methods: {
    handleSetLineChartData(type) {
      // console.log(this.$store.getters.footagecount)
      this.lineChartData = { type: type, data: this.$store.getters.categoryfootage }
    },

    handleSetLineChartData1(type) {
      // console.log(this.$store.getters.footagecount)
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
      // console.log(this.$store.getters.footagecount)
      // console.log(type)

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

      /* switch (type){
        case "cattleGenderAge":
        this.pieChartData = {AdultMaleCount: this.$store.getters.animalgenderagecount.cattleAdultMaleCount,
                              AdultFemaleCount: this.$store.getters.animalgenderagecount.cattleAdultFemaleCount,
                              YoungMaleCount: this.$store.getters.animalgenderagecount.cattleYoungMaleCount,
                              YoungFemaleCount: this.$store.getters.animalgenderagecount.cattleYoungFemaleCount}
        break
        case "goatGenderAge":
        this.pieChartData = {AdultMaleCount: this.$store.getters.animalgenderagecount.goatAdultMaleCount,
                              AdultFemaleCount: this.$store.getters.animalgenderagecount.goatAdultFemaleCount,
                              YoungMaleCount: this.$store.getters.animalgenderagecount.goatYoungMaleCount,
                              YoungFemaleCount: this.$store.getters.animalgenderagecount.goatYoungFemaleCount}
        break
        case "bokGenderAge":
        this.pieChartData = {AdultMaleCount: this.$store.getters.animalgenderagecount.bokAdultMaleCount,
                              AdultFemaleCount: this.$store.getters.animalgenderagecount.bokAdultFemaleCount,
                              YoungMaleCount: this.$store.getters.animalgenderagecount.bokYoungMaleCount,
                              YoungFemaleCount: this.$store.getters.animalgenderagecount.bokYoungFemaleCount}
        break
        case "sheepGenderAge":
        this.pieChartData = {AdultMaleCount: this.$store.getters.animalgenderagecount.sheepAdultMaleCount,
                              AdultFemaleCount: this.$store.getters.animalgenderagecount.sheepAdultFemaleCount,
                              YoungMaleCount: this.$store.getters.animalgenderagecount.sheepYoungMaleCount,
                              YoungFemaleCount: this.$store.getters.animalgenderagecount.sheepYoungFemaleCount}
       break
      }
      console.log(type)
      console.log(this.pieChartData)  */
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
