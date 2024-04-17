<template>
  <div>
    <h4>Animal categories</h4>
    <div style="width: 100%; display: inline-block;">
      <el-row :gutter="20">
        <el-col v-for="(category, index) in categories" :key="index" :sm="12" :md="2" class="mb-2">
          <el-card shadow="hover" style="width: 100%; ">
            <div>
              <el-statistic
                group-separator=","
                :precision="0"
                :value="totalAnimals(category)"
                :title="category.name"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vue from 'vue'
Vue.use(BootstrapVue)

export default {
  data() {
    return {
      totalgoat: 0,
      totalbok: 0,
      totalsheep: 0,
      totalcattle: 0,
      selected: 1,
      categories: []
    }
  },
  computed: {
    categoryList() {
      return this.$store.state.data.animalcategories
    }
  },
  async mounted() {
    const { data } = await this.$http.get('api/categories')
    data.data.forEach((value) => {
      this.categories.push({
        id: value.id,
        name: value.name
      })
    })

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
    },
    totalAnimals(category) {
      return this.categories.filter(a => a.name === category.name).length
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
