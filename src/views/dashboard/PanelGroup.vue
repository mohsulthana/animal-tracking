<template>
  <div>
    <b-container class="bv-example-row">
      <b-row class="mb-4">
        <b-col v-for="(c,ind) in $store.state.data.animalcategories" :key="ind" cols="3">
          <svg height="50" xmlns="http://www.w3.org/2000/svg" @click="handleSetPieChartData(c.name)">
            <text
              x="50"
              y="18"
              font-size="8pt"
              font-family="Arial"
              font-weight="100"
              text-anchor="middle"
              stroke="black"
              fill="black"
            > {{ c.name }} </text><br>
              <text
                x="50"
                y="40"
                font-size="16pt"
                font-family="Arial"
                font-weight="100"
                text-anchor="middle"
                stroke="blue"
                fill="blue"
              > {{ $store.state.data.animals.filter(a => a.category === c.name).length }} </text>
          </svg>
        </b-col>
      </b-row>
    </b-container>

    <!--                   : {{$store.state.data.animals.filter(a => a.category === c.name).length}}
     <svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" stroke="red" fill="grey">
        +
            '<text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
            'text-anchor="middle" fill="${STROKE}" >' + letters + '</text>

        <svg viewBox="0 0 10 10" x="200" width="100">
          <circle cx="5" cy="5" r="4" />
        </svg>
      </svg>
      <div class="card-panel"  @click="handleSetPieChartData('cattleGenderAge')">
        <div class="card-panel-icon-wrapper icon-cattle">
          <svg-icon icon-class="cattle" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Cattle
          </div>
          <count-to :start-val="0" :end-val="this.$store.getters.cattlelistcount" :duration="2600" class="card-panel-num" />
        </div>
      </div>-->

  <!--  <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetPieChartData('sheepGenderAge')">
        <div class="card-panel-icon-wrapper icon-sheep">
          <svg-icon icon-class="sheep" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Sheep
          </div>
          <count-to :start-val="0" :end-val="this.$store.getters.sheeplistcount" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetPieChartData('goatGenderAge')">
        <div class="card-panel-icon-wrapper icon-goat">
          <svg-icon icon-class="goat" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Goats
          </div>
          <count-to :start-val="0" :end-val="this.$store.getters.goatlistcount" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetPieChartData('bokGenderAge')">
        <div class="card-panel-icon-wrapper icon-bok">
          <svg-icon icon-class="bok" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Bok
          </div>
          <count-to :start-val="0" :end-val="this.$store.getters.boklistcount" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>-->

  <!-- <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="4" class="footage-card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('footagein7days')">
          <div class="card-panel-icon-wrapper icon-footage">
            <svg-icon icon-class="7days" class-name="footage-card-panel-icon" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="4" class="footage-card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('footagein1month')">
          <div class="card-panel-icon-wrapper icon-footage">
            <svg-icon icon-class="1month" class-name="footage-card-panel-icon" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="4" class="footage-card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('footagein6months')">
          <div class="card-panel-icon-wrapper icon-footage">
            <svg-icon icon-class="6months" class-name="footage-card-panel-icon" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="4" class="footage-card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('footagein1year')">
          <div class="card-panel-icon-wrapper icon-footage">
            <svg-icon size="200, 100" icon-class="1year" class-name="footage-card-panel-icon" />
          </div>
        </div>
      </el-col>
  </el-row>-->
  </div>

</template>

<script>
import CountTo from 'vue-count-to'
// import store from '@/store'
// import firebase from '../dashboard/admin/components/Config/firebase'
// import { date } from 'jszip/lib/defaults'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vue from 'vue'
Vue.use(BootstrapVue)
// Optionally install the
export default {

  components: {
    CountTo
  },
  data() {
    return {
      totalgoat: 0,
      totalbok: 0,
      totalsheep: 0,
      totalcattle: 0,
      selected: 1
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.handleSetLineChartData('footagein7days')
      this.handleSetPieChartData('')
    })
  },

  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    handleSetPieChartData(type) {
      this.$emit('handleSetPieChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }
 .footage-card-panel-col {
    margin-bottom: 0px;
  }

  .card-panel {
    height: 108px;
    width: 200px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-cattle {
        background: #0000ff;
      }
      .icon-footage {
        background: #0000ff;
      }
      .icon-sheep {
        background: #40c9c6;
      }

      .icon-goat {
        background: #36a3f7;
      }
      .icon-bok {
        background: darkkhaki;
      }
      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-cattle {
      color: #0000ff;
    }
    .icon-footage {
      color: #0000ff;
    }
    .icon-sheep {
      color: #40c9c6;
    }

    .icon-goat{
      color: #36a3f7;
    }
    .icon-bok{
      color: #FEC171;
    }
    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 58px;
    }

    .footage-card-panel-icon {
      float: right;
      font-size: 58px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
