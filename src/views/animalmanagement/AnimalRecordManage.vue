<template>
  <div>
    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <div class="container">
            <div class="row">
               <div style="text-align:center"><h1  text-align="center">Manage animal records </h1></div>
            </div>-->
    <div>
      <b-container class="bv-example-row">
        <select v-model="searchmode">
          <option :value="'QRcodeSearch'">
            Search single animal by QRcode
          </option>
          <option :value="'MutipleSearch'">
            Search multiple animals
          </option>
        </select>
        <!-- </el-row>   -->
        <div v-if="this.searchmode === 'QRcodeSearch'" class="row">
          <div class="col-md-4">
            <label>Scan Qrcode from Files or Camera:   </label><br>
            <select v-model="selected">
              <option v-for="option in options" :key="option.text" :value="option">
                {{ option.text }}
              </option>
            </select>
            <div v-if="selected === options[0]" />
            <div v-else>
              <div v-if="selected === options[2] ">
                <QrcodeCapture :capture="selected.value" @detect="onQrDetect" />
              </div>
              <div v-else>
                <p class="error">{{ error }}</p>
                <QrcodeStream @detect="onQrDetect" @init="onInit" />
              </div>
            </div>
          </div>
          <div>Qrcode: {{ qrcode }}</div>
        </div>
      </b-container>
    </div>

    <div v-if="this.searchmode === 'MutipleSearch'">
      <b-form @submit.prevent="onSearchfromVuexStoreSubmit" @reset="onSearchReset">
        <b-container class="bv-example-row" fluid="sm">
          <b-row class="mb-2">
            <span> <label style="color: red">*</label><label>Category   </label><br></span>
            <span>
              <b-form-group
                v-slot="{ ariaDescribedby }"
              >
                <b-form-checkbox-group
                  id="checkboxes-4"
                  v-model="searchform.checkedcategories"
                  size="sm"
                  style="column-count: 5;"
                  :aria-describedby="ariaDescribedby"
                  :options="animaloptions"
                />
                <input id="newcategorybox" v-model="newcategory" type="text" placeholder="Enter a new category" style="text-transform: uppercase;">
                <button type="button" class="btn btn-primary" @click="addAnimalCategory(newcategory)">Add Category</button>
              </b-form-group>

            </span>
          </b-row>
          <!--     <div class="row">
                <div >
                    <label style="color: red">*</label><label >Category   </label><br>
                    <span v-for="(animcategory,index) in animalcategories" :key="index">
                      <input type="radio" id="animcategory.name" :value="animcategory.name" v-model="category">
                      <label for="animcategory.name"> {{animcategory.name}}  </label>
                      <span style="background-color:red; cursor:pointer; margin-right: 1em" v-on:click ="deleteAnimalCategory(animcategory.categoryID)">  X  </span>
                    </span>
                    <input type="text" id="newcategorybox" placeholder="Enter a new category" style="text-transform: uppercase;" v-model="newcategory">
                    <button v-on:click ="addAnimalCategory(newcategory)"  type="button" class="btn btn-primary">Add Category</button>
                </div><br>
              </div>

            <b-row class="mb-2">
                <b-col sm="auto">Gender</b-col>
                 <b-col sm="auto">
                    <b-form-group
                      id="input-group-2" >
                        <b-form-checkbox-group
                                v-model="searchform.checkedgender"
                                id="checkboxes-4"
                                style="column-count: 2;"
                              >
                          <b-form-checkbox value="M">Male</b-form-checkbox>
                          <b-form-checkbox value="F">Female</b-form-checkbox>
                      </b-form-checkbox-group>
                    </b-form-group>
                 </b-col>
              </b-row> -->
          <div class="row">
            <div>
              <label style="color: red">*</label><label>Gender   </label><br>
              <!--<input type="radio" id="Female" value="F" v-model="gender">
            <label for="Female">F  </label> &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="radio" id="Male" value="M" v-model="gender">
            <label for="Male">M   </label> &nbsp;&nbsp;&nbsp;&nbsp;  -->
              <span v-for="(gen,index) in genders" :key="index">
                <input id="gen.name" v-model="gender" type="radio" :value="gen.name">
                <label for="gen.name"> {{ gen.name }}  </label>
                <span style="background-color:red; cursor:pointer; margin-right: 1em" @click="deleteAnimalGender(gen.genderID)"> X </span>
              </span>
              <input id="newgenderbox" v-model="newgender" type="text" placeholder="Enter a new gender" style="text-transform: uppercase;">
              <button type="button" class="btn btn-primary" @click="addAnimalGender(newgender)">Add Gender</button>

            </div>
          </div>

          <b-row class="mb-2">
            <b-col sm="auto">Registered Date </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col cols="1"> From</b-col>
            <b-col cols="6">
              <input
                v-model="searchform.createddate1"
                class="form-control"
                type="datetime-local"
                placeholder="Created date"
                aria-label="default input example"
                autocomplete="off"
              >
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col cols="1">  To</b-col>
            <b-col cols="6">
              <input
                v-model="searchform.createddate2"
                class="form-control"
                type="datetime-local"
                placeholder="Created date"
                aria-label="default input example"
                autocomplete="off"
              >
            </b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col sm="auto">  Deleted Date </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col cols="1">  From:</b-col>
            <b-col cols="6">
              <input
                v-model="searchform.deleteddate1"
                class="form-control"
                type="datetime-local"
                placeholder="Deleted date"
                aria-label="default input example"
                autocomplete="off"
              >
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col cols="1">  To :</b-col>
            <b-col cols="6">
              <input
                v-model="searchform.deleteddate2"
                class="form-control"
                type="datetime-local"
                placeholder="Deleted date"
                aria-label="default input example"
                autocomplete="off"
              >
            </b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col sm="auto">Month Age</b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col cols="1">  From:</b-col>
            <b-col cols="6">
              <input
                v-model="searchform.monthage1"
                class="form-control"
                type="number"
                min="1"
                step="1"
                placeholder="Age of Month"
                aria-label="default input example"
                autocomplete="off"
              >
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col cols="1">  To  :</b-col>
            <b-col cols="6">
              <input
                v-model="searchform.monthage2"
                class="form-control"
                type="number"
                min="1"
                step="1"
                placeholder="Age of Month"
                aria-label="default input example"
                autocomplete="off"
              >
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col cols="1">  Alias  :</b-col>
            <b-col cols="6">
              <input
                v-model="searchform.alias"
                class="form-control"
                type="text"
                placeholder="Alias"
                aria-label="default input example"
                autocomplete="off"
              >
            </b-col>
          </b-row>

          <b-row align-h="center" class="mb-2">
            <b-col cols="1" />
            <b-col cols="6">
              <b-button type="submit" variant="primary">Search</b-button>
              <b-button type="reset" variant="danger">Reset</b-button>
            </b-col>
            <b-col />
          </b-row>
        </b-container>
      </b-form>
    </div>
    <div style="text-align:right">
      <vue-excel-xlsx
        :data="animals"
        :columns="columns"
        :file-name="'exportedanimalrecorders'"
        :file-type="'xlsx'"
        :sheet-name="'animalinformation'"
      >
        Export to Excel
      </vue-excel-xlsx>
    </div>
    <b-modal

      id="modal-Edit-animal"
      ref="modal"
      title="Edit animal information"
      size="sm"
      @show="resetModalEditanimal"
      @hidden="resetModalEditanimal"
      @ok="handleOkEditanimal"
    >
      <b-form @submit.stop.prevent="handleSubmitEditanimal">
        <b-container class="bv-example-row" fluid="lg">
          <b-row class="mb-1"><b-col cols="12"><label style="color: red">*</label><label>Category</label></b-col></b-row>
          <div v-for="(animcategory,index) in animalcategories" :key="index">
            <b-row class="mb-3">
              <b-col cols="1"><input id="animcategory.name" v-model="category" type="radio" :value="animcategory.name" @change="onchanged()"></b-col>
              <b-col cols="8"><span for="animcategory.name"> {{ animcategory.name }}  </span>  </b-col>
              <b-col cols="1"><label style="background-color:red; cursor:pointer; padding-right:0.25em; padding-left:0.25em; margin-right: 1em" @click="deleteAnimalCategory(animcategory.categoryID)">  X  </label></b-col>
            </b-row>
          </div>
          <b-row class="mb-3">
            <b-col cols="9"><input id="newcategorybox" v-model="newcategory" type="text" placeholder="Enter a new category" style="text-transform: uppercase;"></b-col>
            <b-col cols="1"><span style="background-color:green; color:white; font-weight:bold; cursor:pointer; padding-right:0.25em; padding-left:0.25em; margin-right: 1em" @click="addAnimalCategory(newcategory)">  +  </span></b-col>
          </b-row>
          <!--<button v-on:click ="addAnimalCategory(newcategory)"  type="button" class="btn btn-primary">Add Category</button> -->

          <b-row class="mb-1"><b-col cols="12"><label style="color: red">*</label><label>Gender</label></b-col></b-row>
          <div v-for="(gen,index) in genders" :key="index">
            <b-row class="mb-3">
              <b-col cols="1"><input id="gen.name" v-model="gender" type="radio" :value="gen.name"></b-col>
              <b-col cols="8"><span for="gen.name"> {{ gen.name }}  </span>  </b-col>
              <b-col cols="1"><span style="background-color:red; cursor:pointer; padding-right:0.25em; padding-left:0.25em; margin-right: 1em" @click="deleteAnimalGender(gen.genderID)"> X </span></b-col>
            </b-row>
          </div>
          <b-row class="mb-3">
            <b-col cols="9"><input id="newgenderbox" v-model="newgender" type="text" placeholder="Enter a new gender" style="text-transform: uppercase;"></b-col>
            <b-col cols="1"><span style="background-color:green; color:white; font-weight:bold; cursor:pointer; padding-right:0.25em; padding-left:0.25em; margin-right: 1em" @click="addAnimalGender(newgender)">  +  </span> </b-col>
          </b-row>
          <!-- <b-row  class="mb-2">
              <b-form-group
                label-for="name-input"
                invalid-feedback="Name is required"
                style="column-count: 8"
              >
                <b-col cols="3">Gender</b-col>
                <b-col cols="3"><input type="radio" id="Male" value="M" v-model="gender" v-on:change="onchanged()" >Male</b-col>
                <b-col cols="3"><input type="radio" id="Female" value="F" v-model="gender" v-on:change="onchanged()" > Female</b-col>
             </b-form-group>
            </b-row>       -->
          <b-row class="mb-1"><b-col cols="12"><label style="color: red">*</label><label>Created date</label></b-col></b-row>
          <b-row class="mb-2">
            <b-col cols="12"><input
              v-model="createddate"
              class="form-control"
              type="datetime-local"
              placeholder="Created date"
              aria-label="default input example"
              autocomplete="off"
              @change="onchanged()"
            >  </b-col>
          </b-row>
          <b-row class="mb-2"><b-col cols="4">Deleted date</b-col></b-row>
          <b-row class="mb-2">
            <b-col cols="12"><input
              v-model="deleteddate"
              class="form-control"
              type="datetime-local"
              placeholder="Deleted date"
              aria-label="default input example"
              autocomplete="off"
              @change="onchanged()"
            >  </b-col>
          </b-row>
          <b-row class="mb-2"><b-col cols="4">Qrcode</b-col></b-row>
          <b-row class="mb-2">
            <b-col cols="12"><input
              v-model="qrcode"
              class="form-control"
              disabled="true"
              type="text"
              placeholder="00.00.00.00.00.00"
              aria-label="default input example"
              autocomplete="off"
            >  </b-col>
          </b-row>
          <b-row class="mb-2"><b-col cols="4">Age in months</b-col></b-row>
          <b-row class="mb-2">
            <b-col cols="12"><input
              v-model="monthage"
              class="form-control"
              type="number"
              min="0"
              placeholder="Age in months"
              aria-label="default input example"
              autocomplete="off"
              @change="onchanged()"
            >  </b-col>
          </b-row>
          <b-row class="mb-2"><b-col cols="4">Alias</b-col></b-row>
          <b-row class="mb-2">
            <b-col cols="12"><input
              v-model="alias"
              class="form-control"
              type="text"
              placeholder="Alias"
              aria-label="default input example"
              autocomplete="off"
              @change="onchanged()"
            >  </b-col>
          </b-row>
          <b-row class="mb-1">
            <b-col cols="4">Photo</b-col>
          </b-row>
          <b-row class="mb-1">
            <b-col cols="4"><img :src="photolink"></b-col>
          </b-row>
          <b-row class="mb-1">
            <b-col cols="4"><camera @handleSetPhotoData="handleSetPhotoData" /></b-col>
          </b-row>
        </b-container>
      </b-form>
    </b-modal>

    <!-- Animal photo Form-->
    <b-modal
      id="modal-animal-photo"
      ref="modal"
      title="Animal photo"
      size="sm"
    >
      <b-form>
        <b-container class="bv-example-row" fluid="lg">
          <img :src="photolink">
        </b-container>
      </b-form>
    </b-modal>
    <!-- <div class="row">
         <div class="col-md-4">
          <button type="button"  v-on:click="modifyData" class="btn btn-primary" :disabled="confirmdisabled == 1">Confirm the Changes</button>
        </div>
      </div> -->

    <!-- animals Form-->
    <div class="row p-3" style="background-colour:#fafafa" />
    <!--animals Data/Table-->
    <div class="row">

      <div ref="tablearea" class="content scrollable">

        <div class="col-md-12">
          <label> Found {{ animals.length }} animals:
            <span v-for="(c,index) in animalcategories" :key="index">
              {{ c.name }} ({{ animals.filter(a => a.category === c.name).length }}),
            </span>
          </label>
          <!--<input class="form-control" v-model="obtainedanimals" type="number" disabled> animals found<input />-->

          <table border="3" name="animaltable" style="table-layout: fixed; width: 100%">
            <thead>
              <tr>

                <th style="word-wrap: break-word" scope="col" @click="sort('category')">Category</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('gender')">Gender</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('monthage')">Age</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('alias')">Alias</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('photolink')">Photo</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('ip')">IP</th>
                <th style="word-wrap: break-word; width: 20%" scope="col" @click="sort('qrcode')">Qrcode</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('createddate')">Created</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('deleteddate')">Deleted </th>

                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(animal,index) in animals" :key="index">

                <td style="word-wrap: break-word">{{ animal.category }}</td>
                <td style="word-wrap: break-word">{{ animal.gender }}</td>
                <td style="word-wrap: break-word">{{ calculateAge(animal) }}</td>
                <td style="word-wrap: break-word">{{ animal.alias }}</td>
                <td style="word-wrap: break-word"><span v-if="animal.photolink!=null && animal.photolink!=''"><label v-b-modal.modal-animal-photo size="sm" type="button" class="btn btn-primary" @click="boundDataToPhotoModal(animal.photolink)">Photo</label></span></td>
                <td style="word-wrap: break-word">{{ animal.ip }}</td>
                <td style="word-wrap: break-word">{{ animal.qrcode }}</td>
                <td style="word-wrap: break-word">{{ animal.createddate }}</td>
                <td style="word-wrap: break-word">{{ animal.deleteddate }}</td>

                <td><button v-b-modal.modal-Edit-animal type="button" class="btn btn-warning" @click="boundDataToEditModal(animal.animalID)">Edit</button></td>
                <td><button type="button" class="btn btn-danger" @click="deleteData(animal.animalID)">Delete</button></td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Camera from '../Camera.vue'
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import { firestore } from '../dashboard/admin/components/Config/firebase'
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueExcelXlsx from 'vue-excel-xlsx'
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(VueExcelXlsx)
export default {

  name: 'AnimalRecordManage',

  components: { QrcodeStream, QrcodeDropZone, QrcodeCapture, Camera },

  data() {
    const options = [
      { text: 'nothing (default)', value: undefined },
      { text: 'Camera', value: this.paintOutline },
      // { text: "centered text", value: this.paintCenterText },
      //  { text: "bounding box", value: this.paintBoundingBox },
      { text: 'Files', value: 'uploadfile' }
    ]

    const selected = options[0]
    const selectedcategoryforsearch = []
    const searchmode = 'MutipleSearch'

    return {
      alias: '',
      animaloptions: [
        { text: 'Goat', value: 'Goat' },
        { text: 'Sheep', value: 'Sheep' },
        { text: 'Bok', value: 'Bok' },
        { text: 'Cattle', value: 'Cattle' }
      ],
      animals: [],
      animalcategories: [],
      category: 'Goat',
      columns: [
        { field: 'category', label: 'Animal Category' },
        { field: 'createddate', label: 'Created date' },
        { field: 'deleteddate', label: 'Deleted date' },
        { field: 'gender', label: 'Gender' },
        { field: 'ip', label: 'IP address' },
        { field: 'ageofMonth', label: 'Age of Month' },
        { field: 'qrcode', label: 'Qrcode' }

      ],
      confirmdisabled: 1,
      count: 5,
      createddate: '',
      currentsortdir: 'asc',
      currentsortname: 'category',
      deleteddate: '',
      error: '',
      gender: 'F',
      genders: [],
      imageName: '',
      monthage: '',
      docid: '',
      newcategory: '',
      newgender: '',
      obtainedanimals: 0,
      options,
      photolink: '',
      qrcode: '',
      searchform: {
        alias: '',
        checkedcategories: [],
        checkedgender: [],
        createddate1: '',
        createddate2: '',
        deleteddate1: '',
        deleteddate2: '',
        monthage1: '',
        monthage2: '',
        photolink: '',
        qrcode: ''
      },
      searchmode,
      selected,
      selectedcategoryforsearch

      // foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],

    }
  },

  watch: {
    count: function() {
      this.$nextTick(function() {
        var container = this.$refs.tablearea
        container.scrollTop = container.scrollHeight + 120
      })
    }
  },

  created() {
    var today = new Date()
    this.createddate = '' + today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + (today.getDate())).slice(-2) + ('T' + ('0' + (today.getHours())).slice(-2)) + ':' + ('0' + (today.getMinutes())).slice(-2)
  },

  mounted() {
    this.fetchData()
  },

  function() {
    return {
      items: []
    }
  },

  methods: {
    deleteAnimalGender(docid) {
      console.log(docid)
      if (confirm('Are you sure you will delete this?')) {
        firestore.collection('genders').doc(docid).delete().then(() => {
          // alert('Animal Category Removed')
          this.fetchData()
        }).catch(e => {
          console.log(e)
        })
      }
    },

    addAnimalGender(newgender) {
      newgender = newgender.trim()
      if (!newgender) {
        alert('Animal gender cannot be empty!')
        return null
      }
      newgender = newgender.toUpperCase()
      if (this.genders.find(gen => gen.name === newgender)) {
        alert('Animal gender ' + newgender + ' already exists!')
        return null
      }

      const obj = {
        name: newgender
      }
      // console.log(this.$store.getters.addanimal)
      this.newgender = ''
      firestore.collection('genders').add(obj).then(() => {
        // alert('Animal category ' + newcategory + ' added' )
        this.gender = newgender
        this.fetchData()
      })
        .catch(e => {
          console.log(e)
        })
    },

    addAnimalCategory(newcategory) {
      newcategory = newcategory.trim()
      if (!newcategory) {
        alert('Animal category cannot be empty!')
        return null
      }
      newcategory = newcategory.toUpperCase()
      if (this.animalcategories.find(cat => cat.name === newcategory)) {
        alert('Animal category ' + newcategory + ' already exists!')
        return null
      }

      const obj = {
        name: newcategory
      }
      // console.log(this.$store.getters.addanimal)
      this.newcategory = ''
      firestore.collection('animalcategories').add(obj).then(() => {
        // alert('Animal category ' + newcategory + ' added' )
        this.category = newcategory
        this.fetchData()
      })
        .catch(e => {
          console.log(e)
        })
    },

    deleteAnimalCategory(docid) {
      console.log(docid)
      if (confirm('Are you sure you will delete this?')) {
        firestore.collection('animalcategories').doc(docid).delete().then(() => {
          // alert('Animal Category Removed')
          this.fetchData()
        }).catch(e => {
          console.log(e)
        })
      }
    },

    handleSetPhotoData(photoinfo) {
      this.photolink = photoinfo.url
      console.log(this.photolink)
      this.imageName = photoinfo.name
      console.log(photoinfo)
    },

    boundDataToPhotoModal(photolink) {
      this.photolink = photolink
    },

    calculateAge(animal) {
      const currentDate = new Date()
      const difference = currentDate - (new Date(animal.createddate))
      // console.log(currentDate + '-' + (new Date(animal.createddate)) + '=' + difference)
      var ma = Number(animal.monthage) + Math.floor(difference / (30 * 24 * 60 * 60 * 1000))// 1000*3600*24
      // console.log(ma)
      return ma
    },

    sort(sn) {
      if (sn === this.currentsortname) {
        this.currentsortdir = (this.currentsortdir == 'asc') ? 'desc' : 'asc'
        this.sortanimals(sn, this.currentsortdir)
      } else {
        this.currentsortname = sn
        this.sortanimals(sn, this.currentsortdir)
      }
    },

    sortanimals(name, sd) {
      var that = this
      if (name === 'monthage') {
        this.animals.sort(function(a, b) {
          if (sd === 'asc') {
            return that.calculateAge(a) - that.calculateAge(b)
          } else {
            return that.calculateAge(b) - that.calculateAge(a)
          }
        })
      } else {
        this.animals.sort(function(a, b) {
          var x
          var y
          switch (name) {
            case 'qrcode':
              x = a.qrcode
              y = b.qrcode
              break
            case 'category':
              x = a.category
              y = b.category
              break
            case 'createddate':
              x = a.createddate
              y = b.createddate
              break
            case 'deleteddate':
              x = a.deleteddate
              y = b.deleteddate
              break
            case 'gender':
              x = a.gender
              y = b.gender
              break
            case 'alias':
              x = a.alias
              y = b.alias
              break
            case 'photolink':
              x = a.photolink ? a.photolink : ''
              y = b.photolink ? b.photolink : ''
              break
            case 'ip':
              x = a.ip
              y = b.ip
              break
          }
          const xx = x.toLowerCase()
          const yy = y.toLowerCase()
          var val = 0
          if (xx < yy) { val = -1 }
          if (xx > yy) { val = 1 }
          if (sd === 'desc') { val = -1 * val }
          return val
        })
      }
      console.log('sorting changed to ' + name + 'in direction' + this.currentsortdir)
    },

    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      // this.nameState = valid
      return valid
    },

    resetModalEditanimal() {
      // this.name = ''
      // this.nameState = null
    },

    handleOkEditanimal(bvModalEvt) {
      // Prevent modal from closing
      // bvModalEvt.preventDefault()
      // Trigger submit handler
      // this.handleSubmit()
      this.modifyData()
    },

    handleSubmitEditanimal() {
      // Exit when the form isn't valid

      if (!this.checkFormValidity()) {
        return
      }
      // Push the name to submitted names
      // this.submittedNames.push(this.name)
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    },
    // popup form for animal editor:

    onSearchfromVuexStoreSubmit(event) {
      this.animals = []

      if (this.searchform.alias) {
        this.animals = this.$store.getters.animals.filter(animal => animal.alias === this.searchform.alias)
      } else {
        if (this.searchform.checkedcategories.length == 0) {
          this.animaloptions.forEach((ao) => {
            this.searchform.checkedcategories.push(ao.value)
          })
        }
        if (this.searchform.checkedgender.length == 0) {
          this.searchform.checkedgender = ['M', 'F']
        }

        this.searchform.checkedcategories.forEach((checkedcategory) => {
          var obtainedanimal = this.$store.getters.animals.filter(ani => ani.category === checkedcategory)

          if (this.searchform.checkedgender.length == 1) {
            obtainedanimal = obtainedanimal.filter(animal => animal.gender === this.searchform.checkedgender[0])
          }

          if (this.searchform.createddate1 !== '') {
            obtainedanimal = obtainedanimal.filter(animal => animal.createddate >= this.searchform.createddate1)
          }
          if (this.searchform.createddate2 !== '') {
            obtainedanimal = obtainedanimal.filter(animal => animal.createddate <= this.searchform.createddate2)
          }
          if (this.searchform.deleteddate1 !== '') {
            obtainedanimal = obtainedanimal.filter(animal => animal.deleteddate >= this.searchform.deleteddate1)
          }
          if (this.searchform.deleteddate2 !== '') {
            obtainedanimal = obtainedanimal.filter(animal => animal.deleteddate <= this.searchform.deleteddate2)
          }
          if (this.searchform.monthage1 !== '') {
            obtainedanimal = obtainedanimal.filter(animal => Number(animal.monthage) >= Number(this.searchform.monthage1))
          }
          if (this.searchform.monthage2 !== '') {
            obtainedanimal = obtainedanimal.filter(animal => Number(animal.monthage) <= Number(this.searchform.monthage2))
          }

          this.animals.push(...obtainedanimal)
        })
      }
    },
    /* onSearchfromFirestoreSubmit(event) {
      event.preventDefault()
      const animalsRef = firestore.collection('animals')
      this.animals = []
      var q

      //console.log(animalsRef);
      this.obtainedanimals = 0
      if (this.searchform.checkedcategories.length == 0){
        this.animaloptions.forEach((ao) =>{
          this.searchform.checkedcategories.push(ao.value)
        })
      }
      if (this.searchform.checkedgender.length == 0){
         this.searchform.checkedgender = ["M", "F"]
      }

      this.searchform.checkedcategories.forEach((checkedcategory) => {
          this.searchform.checkedgender.forEach((checkedgender) =>{
           q = animalsRef.where("category", "==", checkedcategory).where("gender", "==", checkedgender)
           if (this.searchform.createddate1 !== ''){
             q = q.where("createddate", ">=", this.searchform.createddate1)
           }
           if (this.searchform.createddate2 !== ''){
             q = q.where("createddate", "<=", this.searchform.createddate2)
           }
           if ((this.searchform.deleteddate1 !== '') && (this.searchform.deleteddate1 == this.searchform.deleteddate2)){
            q = q.where("deleteddate", "==", this.searchform.deleteddate1)
           }
           if ((this.searchform.monthage1 !== '') && (this.searchform.monthage1 == this.searchform.monthage2)){
            q = q.where("monthage", "==", this.searchform.monthage1)
           }
          q.get().then(querySnapshot => {
            querySnapshot.forEach((doc) => {
              var validdoc = 1
              if ((this.searchform.deleteddate1 != this.searchform.deleteddate2)){
              if ((this.searchform.deleteddate1) !== ''){
                if (doc.data().deleteData < this.searchform.deleteddate1){
                  validdoc = 0
                }
              }
              if ((this.searchform.deleteddate2) !== ''){
                if (doc.data().deleteData > this.searchform.deleteddate2){
                  validdoc = 0
                }
              }
              }

              if ((this.searchform.monthage1 != this.searchform.monthage2)){
              if (this.searchform.monthage1 !== ''){

                if (Number(doc.data().monthage) < Number(this.searchform.monthage1)){
                  validdoc = 0
                }
              }
              if (this.searchform.monthage2 !== ''){
                if (Number(doc.data().monthage) > Number(this.searchform.monthage2)){
                  validdoc = 0
                }
              }
              }
              if (validdoc == 1){
                this.animals.push({...doc.data(),...{docid:doc.id}})
                this.obtainedanimals++
                if (doc.data().category == "Goat"){
                  this.obtainedanimalsGoat++
                }
                if (doc.data().category == "Sheep"){
                  this.obtainedanimalsSheep++
                }
                if (doc.data().category == "Bok"){
                  this.obtainedanimalsBok++
                }
                if (doc.data().category == "Cattle"){
                  this.obtainedanimalsCattle++
                }
              }
            })
          });
        })
      });
//      this.$nextTick(() => {
//        alert(obtainedanimals.toString() + " animal records are obtained")
//      })

             //event.preventDefault()
      //alert(JSON.stringify(this.form))
    },*/
    onSearchReset(event) {
      event.preventDefault()
      // Reset our form values
      this.searchform.checkedcategories = []
      this.searchform.checkedgender = []
      this.searchform.createddate1 = ''
      this.searchform.deleteddate1 = ''
      this.searchform.monthage1 = ''
      this.searchform.createddate2 = ''
      this.searchform.deleteddate2 = ''
      this.searchform.monthage2 = ''
      this.searchform.qrcode = ''
      this.searchform.alias = ''
      // Trick to reset/clear native browser form validation state
      // this.show = false
      // this.$nextTick(() => {
      //  this.show = true
      // })
    },

    onQrDecode(qrcode) {
      // this.selected=this.options[0]

      console.log(qrcode)
      this.animals = this.$store.getters.animals.filter(animal => animal.qrcode === qrcode)
      this.confirmdisabled = 1
    },

    async onQrDetect(promise) {
      // this.selected=this.options[0]

      try {
        const {
          imageData, // raw image data of image/frame
          content, // decoded String or null
          location // QR code coordinates or null
        } = await promise
        this.qrcode = content
        if (content === null) {
          this.animals = []
          this.confirmdisabled = 1
        } else {
          this.onQrDecode(content)
        }
      } catch (error) {
      // ...
      }
    },

    onchanged() {
      this.confirmdisabled = 0
    },

    async onInit(promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = 'ERROR: you need to grant camera access permission'
        } else if (error.name === 'NotFoundError') {
          this.error = 'ERROR: no camera on this device'
        } else if (error.name === 'NotSupportedError') {
          this.error = 'ERROR: secure context required (HTTPS, localhost)'
        } else if (error.name === 'NotReadableError') {
          this.error = 'ERROR: is the camera already in use?'
        } else if (error.name === 'OverconstrainedError') {
          this.error = 'ERROR: installed cameras are not suitable'
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = 'ERROR: Stream API is not supported in this browser'
        } else if (error.name === 'InsecureContextError') {
          this.error = 'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
        } else {
          this.error = `ERROR: Camera error (${error.name})`
        }
      }
    },

    paintOutline(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

        ctx.strokeStyle = 'red'

        ctx.beginPath()
        ctx.moveTo(firstPoint.x, firstPoint.y)
        for (const { x, y } of otherPoints) {
          ctx.lineTo(x, y)
        }
        ctx.lineTo(firstPoint.x, firstPoint.y)
        ctx.closePath()
        ctx.stroke()
      }
    },

    fetchData() {
      this.animals = this.$store.getters.animals
      this.animalcategories = this.$store.getters.animalcategories
      this.genders = this.$store.getters.genders
      this.animaloptions = []
      this.animalcategories.forEach(ac => this.animaloptions.push({
        text: ac.name, value: ac.name
      }))
    },

    deleteData(docid) {
      if (confirm('Are you sure you will delete this?')) {
        firestore.collection('animals').doc(docid).delete().then(() => {
          alert('Animal Removed')
          this.fetchData()
        }).catch(e => {
          console.log(e)
        })
      }
    },

    modifyData() {
      if (this.docid) {
        console.log(this.docid)
        firestore.collection('animals').doc(this.docid).update({
          alias: this.alias,
          category: this.category,
          createddate: this.createddate,
          deleteddate: this.deleteddate,
          gender: this.gender,
          monthage: this.monthage,
          photolink: this.photolink ? this.photolink : ''
        }).then(() => {
          this.fetchData()
        })
      } else {
        alert('no doc to update')
      }
    },

    boundDataToEditModal(docid) {
      // console.log(docid)
      firestore.collection('animals').doc(docid).get().then(doc => {
        this.category = doc.data().category
        this.gender = doc.data().gender
        this.qrcode = doc.data().qrcode
        this.monthage = doc.data().monthage
        this.alias = doc.data().alias ? doc.data().alias : ''
        this.createddate = doc.data().createddate
        this.deleteddate = doc.data().deleteddate
        this.photolink = doc.data().photolink ? doc.data().photolink : ''
        this.docid = doc.id
      })
    }
  }
}
</script>

<style scoped>
  .scrollable {
  overflow: hidden;
  overflow-y: scroll;
  overflow-x: scroll;
  height: calc(100vh - 20px);
}

</style>
