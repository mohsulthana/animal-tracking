<template>
  <div id="animal-record-management">
    <el-row :span="24">
      <el-col>
        <el-card class="box-card">
          <div slot="header" class="d-flex justify-content-between">
            <h5>Animals records management</h5>
            <div class="action-button">
              <!-- <el-button type="secondary" @click="isSearchMultipleAnimalDialogVisible = !isSearchMultipleAnimalDialogVisible">Search multiple animals</el-button> -->
              <!-- <el-button type="secondary" @click="isSearchByQRCodeDialogVisible = !isSearchByQRCodeDialogVisible">Search by QR Code</el-button> -->
              <el-button type="primary" size="medium" @click="isRegisterAnimalModalVisible = !isRegisterAnimalModalVisible">Register animal</el-button>
              <vue-excel-xlsx
                :data="animals"
                :columns="columns"
                :file-name="'exportedanimalrecorders'"
                :file-type="'xlsx'"
                :sheet-name="'animalinformation'"
                class="el-button el-button--secondary"
                style="cursor: pointer;"
              >
                Export to Excel
              </vue-excel-xlsx>
            </div>
          </div>
          <div class="px-4">
            <el-table :data="animals" style="width: 100%">
              <el-table-column prop="category" label="Category" />
              <el-table-column prop="gender" label="Gender" />
              <el-table-column prop="month_age" label="Age">
                <template slot-scope="scope">
                  {{ scope.row.month_age }} months
                </template>
              </el-table-column>
              <el-table-column prop="photo_link" label="Photo Link">
                <template slot-scope="scope">
                  <img
                    :src="scope.row.photo_link"
                    :height="200"
                    width="100%"
                    :alt="scope.row.alias"
                    style="object-fit: contain"
                  >
                </template>
              </el-table-column>
              <el-table-column prop="alias" label="Alias" />
              <el-table-column prop="ip" label="IP" />
              <el-table-column prop="qrcode" label="QR Code">
                <template slot-scope="scope">
                  <FsLightBox
                    :toggler="toggler"
                    :sources="[
                      'https://i.imgur.com/fsyrScY.jpg'
                    ]"
                  />
                  <img
                    :src="scope.row.qr_code"
                    :height="200"
                    width="100%"
                    :alt="scope.row.alias"
                    style="object-fit: contain; cursor: pointer;"
                    @click="toggler = true"
                  >
                </template>
              </el-table-column>
              <el-table-column prop="updated_at" label="Updated At">
                <template slot-scope="scope">
                  {{ formatDataDate(scope.row.updated_at) }}
                </template>

              </el-table-column>
              <el-table-column label="Action">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    plain
                    circle
                  />
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    plain
                    circle
                    @click="openDeleteConfirmationModal(scope.row.id)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Search multiple animal dialog -->
    <el-dialog
      title="Search multiple animals"
      :visible.sync="isSearchMultipleAnimalDialogVisible"
    >
      <el-row :gutters="20">
        <el-col>
          <div class="d-flex flex-row gap-8">
            <label for="registered-date">Registered Date</label>
            <el-date-picker
              id="registered-date"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
            />
          </div>
        </el-col>
        <el-col>
          <div class="d-flex flex-row gap-8">
            <label for="deleted-date">Deleted Date</label>
            <el-date-picker
              id="deleted-date"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
            />
          </div>
        </el-col>
      </el-row>
      <div class="block">
        <span class="demonstration">Month Age</span>
      </div>
    </el-dialog>

    <!-- Search by QR Code dialog -->
    <el-dialog :visible.sync="isSearchByQRCodeDialogVisible">
      hello world
    </el-dialog>
    <!-- <div>
      <b-container class="bv-example-row">
        <select v-model="searchmode">
          <option :value="'QRcodeSearch'">
            Search single animal by QRcode
          </option>
          <option :value="'MutipleSearch'">
            Search multiple animals
          </option>
        </select>
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
    </div> -->

    <!-- <b-modal
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
    </b-modal> -->

    <!-- <div class="row">
         <div class="col-md-4">
          <button type="button"  v-on:click="modifyData" class="btn btn-primary" :disabled="confirmdisabled == 1">Confirm the Changes</button>
        </div>
      </div> -->

    <!-- Register animal dialog -->
    <el-dialog title="Register animal" :visible.sync="isRegisterAnimalModalVisible">
      <el-form ref="ruleForm" label-position="top" label-width="50px" :model="form" :rules="rules" size="mini" style="text-align: left;">
        <el-form-item label="Alias" prop="alias">
          <el-input v-model="form.alias" />
        </el-form-item>
        <el-form-item label="Age (in months)" prop="age">
          <el-input v-model.number="form.age" />
        </el-form-item>
        <el-form-item label="Category" prop="category">
          <el-select v-model="form.category_id" placeholder="Select category" style="width: 100%;">
            <el-option
              v-for="(item, index) in animalcategories"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Gender" prop="gender">
          <el-select v-model="form.GID" placeholder="Select gender" style="width: 100%;">
            <el-option
              v-for="(item, index) in genders"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Photo link">
              <el-upload
                http-request
                class="upload-demo"
                :on-preview="handlePreview('photo_link')"
                :on-remove="handleRemove"
                :file-list="photo_link_list"
                :on-change="handleChangePhotoLink"
                list-type="list"
                :multiple="false"
                :auto-upload="false"
              >
                <el-button size="small" type="primary">Click to upload</el-button>
                <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="QR Code">
              <el-upload
                class="upload-demo"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="qr_code_list"
                :on-change="handleChangeQRCode"
                list-type="list"
                :multiple="false"
                :auto-upload="false"
              >
                <el-button size="small" type="primary">Click to upload</el-button>
                <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isRegisterAnimalModalVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">Register</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Camera from './Camera.vue'
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import { firestore } from './dashboard/admin/components/Config/firebase'
import Vue from 'vue'
import { IconsPlugin } from 'bootstrap-vue'
import VueExcelXlsx from 'vue-excel-xlsx'
import { formatDate } from '@/helpers/time'
import FsLightBox from 'fslightbox-vue'
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(VueExcelXlsx)
export default {
  name: 'AnimalRecordManage',
  components: { FsLightBox },

  data() {
    const options = [
      { text: 'nothing (default)', value: undefined },
      { text: 'Camera', value: this.paintOutline },
      { text: 'Files', value: 'uploadfile' }
    ]

    const selected = options[0]
    const selectedcategoryforsearch = []
    const searchmode = 'MutipleSearch'

    return {
      toggler: false,
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
      selectedcategoryforsearch,
      isSearchMultipleAnimalDialogVisible: false,
      isSearchByQRCodeDialogVisible: false,
      isRegisterAnimalModalVisible: false,
      form: {
        alias: '',
        age: '',
        GID: '',
        category_id: '',
        qr_code: null,
        photo_link: null
      },
      rules: {
        alias: [
          { required: true, message: 'Please input alias', trigger: 'blur' }
        ],
        age: [
          { required: true, message: 'Please input age', trigger: 'change' },
          { type: 'number', message: 'Age must be a number', trigger: 'change' }
        ],
        category_id: [
          { required: true, message: 'Please input category', trigger: 'change' }
        ],
        GID: [
          { required: true, message: 'Please input gender', trigger: 'change' }
        ],
        qr_code: [
          { required: true, message: 'Please upload QR Code', trigger: 'blur' }
        ],
        photo_link: [
          { required: true, message: 'Please upload photo link', trigger: 'blur' }
        ]
      },
      qr_code_list: [],
      photo_link_list: []
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
    this.createddate =
      '' +
      today.getFullYear() +
      '-' +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + today.getDate()).slice(-2) +
      ('T' + ('0' + today.getHours()).slice(-2)) +
      ':' +
      ('0' + today.getMinutes()).slice(-2)
  },

  mounted() {
    this.fetchAnimalData()
    this.fetchAnimalGender()
    this.fetchAnimalCategories()
  },

  function() {
    return {
      items: []
    }
  },

  methods: {
    formatDataDate(date) {
      return formatDate(date)
    },
    handleChangeQRCode(file, fileList) {
      this.qr_code_list = fileList.slice(-1)
    },
    handleChangePhotoLink(file, fileList) {
      this.photo_link_list = fileList.slice(-1)
    },
    handleRemove(type) {
      switch (type) {
        case 'photo_link':
          console.log('type')
          break
        case 'qr_code':
          console.log('type')
          break
        default:
          break
      }
    },
    handlePreview(type) {
      switch (type) {
        case 'photo_link':
          console.log('type')
          break
        case 'qr_code':
          console.log('type')
          break
        default:
          break
      }
    },
    submitForm(formName) {
      if (this.photo_link_list.length > 0) {
        this.form.photo_link = this.photo_link_list[0].raw
      }
      if (this.qr_code_list.length > 0) {
        this.form.qr_code = this.qr_code_list[0].raw
      }

      console.log(this.form)

      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    openDeleteConfirmationModal() {
      const h = this.$createElement

      this.$msgbox({
        title: 'Delete animal',
        message: h('p', null, [
          h('span', null, 'Are you sure to delete this animal? This action cannot be undone')
        ]),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        beforeClose: async(action, instance, done) => {
          if (action === 'confirm') {
            const { data } = await this.$http.delete('api/animals')
            console.log(data)

            instance.confirmButtonLoading = true
            instance.confirmButtonText = 'Loading...'
            setTimeout(() => {
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            }, 3000)
          } else {
            done()
          }
        }
      }).then(action => {
        this.$message({
          type: 'info',
          message: 'action: ' + action
        })
      })
    },
    async fetchAnimalData() {
      const { data } = await this.$http.get('api/animals')
      data.animals.data.forEach((value) => {
        this.animals.push({
          alias: value.alias,
          category: value.category,
          created_at: value.created_at,
          updated_at: value.updated_at,
          gender: value.gender,
          id: value.id,
          ip: value.ip,
          month_age: value.month_age,
          photo_link: value.photo_link,
          qr_code: value.qr_code
        })
      })
    },

    async fetchAnimalCategories() {
      const { data } = await this.$http.get('api/categories')
      data.data.data.forEach((value) => {
        this.animalcategories.push({
          id: value.id,
          name: value.name,
          alias: value.alias
        })
      })
    },

    async fetchAnimalGender() {
      const { data } = await this.$http.get('api/gender')
      data.data.data.forEach((value) => {
        this.genders.push({
          id: value.GID,
          name: value.name
        })
      })
    },

    addAnimalGender(newgender) {
      newgender = newgender.trim()
      if (!newgender) {
        alert('Animal gender cannot be empty!')
        return null
      }
      newgender = newgender.toUpperCase()
      if (this.genders.find((gen) => gen.name === newgender)) {
        alert('Animal gender ' + newgender + ' already exists!')
        return null
      }

      const obj = {
        name: newgender
      }
      // console.log(this.$store.getters.addanimal)
      this.newgender = ''
      firestore
        .collection('genders')
        .add(obj)
        .then(() => {
          // alert('Animal category ' + newcategory + ' added' )
          this.gender = newgender
          this.fetchData()
        })
        .catch((e) => {
          console.log(e)
        })
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
      const difference = currentDate - new Date(animal.createddate)
      // console.log(currentDate + '-' + (new Date(animal.createddate)) + '=' + difference)
      var ma =
        Number(animal.monthage) +
        Math.floor(difference / (30 * 24 * 60 * 60 * 1000)) // 1000*3600*24
      // console.log(ma)
      return ma
    },

    sort(sn) {
      if (sn === this.currentsortname) {
        this.currentsortdir = this.currentsortdir == 'asc' ? 'desc' : 'asc'
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
          if (xx < yy) {
            val = -1
          }
          if (xx > yy) {
            val = 1
          }
          if (sd === 'desc') {
            val = -1 * val
          }
          return val
        })
      }
      console.log(
        'sorting changed to ' + name + 'in direction' + this.currentsortdir
      )
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
        this.animals = this.$store.getters.animals.filter(
          (animal) => animal.alias === this.searchform.alias
        )
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
          var obtainedanimal = this.$store.getters.animals.filter(
            (ani) => ani.category === checkedcategory
          )

          if (this.searchform.checkedgender.length == 1) {
            obtainedanimal = obtainedanimal.filter(
              (animal) => animal.gender === this.searchform.checkedgender[0]
            )
          }

          if (this.searchform.createddate1 !== '') {
            obtainedanimal = obtainedanimal.filter(
              (animal) => animal.createddate >= this.searchform.createddate1
            )
          }
          if (this.searchform.createddate2 !== '') {
            obtainedanimal = obtainedanimal.filter(
              (animal) => animal.createddate <= this.searchform.createddate2
            )
          }
          if (this.searchform.deleteddate1 !== '') {
            obtainedanimal = obtainedanimal.filter(
              (animal) => animal.deleteddate >= this.searchform.deleteddate1
            )
          }
          if (this.searchform.deleteddate2 !== '') {
            obtainedanimal = obtainedanimal.filter(
              (animal) => animal.deleteddate <= this.searchform.deleteddate2
            )
          }
          if (this.searchform.monthage1 !== '') {
            obtainedanimal = obtainedanimal.filter(
              (animal) =>
                Number(animal.monthage) >= Number(this.searchform.monthage1)
            )
          }
          if (this.searchform.monthage2 !== '') {
            obtainedanimal = obtainedanimal.filter(
              (animal) =>
                Number(animal.monthage) <= Number(this.searchform.monthage2)
            )
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
      this.animals = this.$store.getters.animals.filter(
        (animal) => animal.qrcode === qrcode
      )
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
          this.error =
            'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
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

    deleteData(docid) {
      if (confirm('Are you sure you will delete this?')) {
        firestore
          .collection('animals')
          .doc(docid)
          .delete()
          .then(() => {
            alert('Animal Removed')
            this.fetchData()
          })
          .catch((e) => {
            console.log(e)
          })
      }
    },

    modifyData() {
      if (this.docid) {
        console.log(this.docid)
        firestore
          .collection('animals')
          .doc(this.docid)
          .update({
            alias: this.alias,
            category: this.category,
            createddate: this.createddate,
            deleteddate: this.deleteddate,
            gender: this.gender,
            monthage: this.monthage,
            photolink: this.photolink ? this.photolink : ''
          })
          .then(() => {
            this.fetchData()
          })
      } else {
        alert('no doc to update')
      }
    },

    boundDataToEditModal(docid) {
      // console.log(docid)
      firestore
        .collection('animals')
        .doc(docid)
        .get()
        .then((doc) => {
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
