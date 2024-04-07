<template>
  <div>
    <div>
      <camera @handleSetPhotoData="handleSetPhotoData" /><br>
    </div>
    <div><label>Photo name: </label>{{ imageName }}</div>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div class="container">
        <div class="row">
          <div class="col-md-12" />
        </div>
      </div>
      <div class="row">
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
      </div>
      <div class="row">
        <div>
          <div><label style="color: red">*</label><label>Qrcode:   </label> {{ this.$store.getters.qrcode }}</div>
        </div>
      </div>
      <div class="row">
        <div>
          <label style="color: red">*</label><label>Category   </label><br>
          <!--<input type="radio" id="Goat" value="Goat" v-model="category">
            <label for="Goat">Goat  </label> &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="radio" id="Cattle" value="Cattle" v-model="category">
            <label for="Cattle">Cattle   </label> &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="radio" id="Bok" value="Bok" v-model="category">
            <label for="Bok">Bok  </label> &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="radio" id="Sheep" value="Sheep" v-model="category">
            <label for="Sheep">Sheep  </label> -->
          <span v-for="(animcategory,index) in animalcategories" :key="index">
            <input id="animcategory.name" v-model="category" type="radio" :value="animcategory.name">
            <label for="animcategory.name"> {{ animcategory.name }}  </label>
            <span style="background-color:red; cursor:pointer; margin-right: 1em" @click="deleteAnimalCategory(animcategory.categoryID)">  X  </span>
          </span>
          <input id="newcategorybox" v-model="newcategory" type="text" placeholder="Enter a new category" style="text-transform: uppercase;">
          <button type="button" class="btn btn-primary" @click="addAnimalCategory(newcategory)">Add Category</button>
        </div><br>
      </div>
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
          <button type="button" class="btn btn-primary" @click="addAnimalGender(newgender)">Add Category</button>

        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <label>Registered date   </label><br>
          <input
            v-model="createddate"
            class="form-control"
            type="datetime-local"
            placeholder="Created date"
            aria-label="default input example"
            autocomplete="off"
          >
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <label style="color: red">*</label><label>Age in months  </label><br>
          <input
            v-model="monthage"
            class="form-control"
            type="number"
            placeholder="Age in months"
            aria-label="default input example"
            autocomplete="off"
          >
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <label>Alias  </label><br>
          <input
            v-model="alias"
            class="form-control"
            type="text"
            placeholder="Input an alias"
            aria-label="default input example"
            autocomplete="off"
          >
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <label>Photolink  </label><br>
          <input
            v-model="photolink"
            class="form-control"
            disabled="true"
            type="text"
            placeholder="Take a photo for a link"
            aria-label="default input example"
            autocomplete="off"
          >
        </div>
      </div>

    </el-row>
    <el-row>
      <div style="text-align:center">
        <button type="button" class="btn btn-primary" @click="saveData">Register</button>
      </div>

    </el-row>
    <!-- Animal photo Form-->
    <b-modal
      id="modal-animal-photo"
      ref="modal"
      title="Animal photo"
      size="sm"
    >

      <b-container class="bv-example-row" fluid="lg">
        <img :src="photolink">
      </b-container>

    </b-modal>
    <!-- Animal Form-->
    <div class="row p-3" style="background-colour:#fafafa" />
    <!--Animal Data/Table-->
    <div class="row">
      <div ref="tablearea" class="content scrollable">

        <div class="col-md-12">
          <table border="3" name="animaltable" style="table-layout: fixed; width: 100%">
            <thead>
              <tr>
                <th style="word-wrap: break-word" scope="col" @click="sort('category')">Category</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('gender')">Gender</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('monthage')">Age</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('alias')">Alias</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('photolink')">Photo</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('ip')">IP</th>
                <th style="word-wrap: break-word" @click="sort('qrcode')">Qrcode</th>
                <th scope="col" @click="sort('createddate')">Created</th>
                <!--  <th scope="col" v-on:click="sort('deleteddate')">Deleted date </th> -->

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
                <!--  <td>{{animal.deleteddate}}</td> -->

                <!--<td><button v-on:click ="editData(animal.docid)" type="button" class="btn btn-warning">Edit</button></td>-->
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
import Vue from 'vue'
import { firestore } from '../dashboard/admin/components/Config/firebase'
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import Camera from '../Camera.vue'
import { RouterLinkStub } from '@vue/test-utils'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

/* import firebase from 'firebase'
import { date } from 'jszip/lib/defaults'
import { Doc } from 'codemirror'
import { collection, query, where, getDocs,doc} from "firebase/firestore"*/
// import {  } from 'firebase/firestore'
// import 'firebase/firestore'
// import { QUEUED } from 'dropzone'

export default {
  name: 'AnimalRegister',
  components: { QrcodeStream, QrcodeDropZone, QrcodeCapture, Camera },

  data: () => {
    const options = [
      { text: 'nothing (default)', value: undefined },
      { text: 'Camera', value: 'this.paintOutline' },
      //  { text: "centered text", value: this.paintCenterText },
      //  { text: "bounding box", value: this.paintBoundingBox },
      { text: 'Files', value: 'uploadfile' }
    ]

    var today = new Date()

    const selected = options[0]

    return {
      alias: '',
      animals: [],
      animalcategories: [],
      category: '',
      confirmdisabled: 1,
      count: 5,
      createddate: '',
      currentanimalcategory: '',
      currentanimalgender: '',
      currentanimalmonthage: '',
      currentsortdir: 'asc',
      currentsortname: 'category',
      deleteddate: '',
      docid: '',
      error: 'No error',
      gender: '',
      genders: [],
      imageName: '',
      ip: '',
      monthage: '',
      newcategory: '',
      newgender: '',
      photolink: '',
      qrcode: '',
      options,
      selected,
      today
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
  onchanged() {
    this.confirmdisabled = 0
  },

  created() {
    this.createddate = '' + this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.today.getDate())).slice(-2) + ('T' + ('0' + (this.today.getHours())).slice(-2)) + ':' + ('0' + (this.today.getMinutes())).slice(-2)
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    boundDataToPhotoModal(photolink) {
      this.photolink = photolink
    },

    handleSubmitAnimalPhoto() {
      // Exit when the form isn't valid

      // Push the name to submitted names
      // this.submittedNames.push(this.name)
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    },

    showphoto(link) {
      console.log(link)
      window.open(link, 'popup', 'width=600,height=600')
    },

    handleSetPhotoData(photoinfo) {
      this.photolink = photoinfo.url
      console.log(this.photolink)
      this.imageName = photoinfo.name
      console.log(photoinfo)
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
            case 'alias':
              x = a.alias
              y = b.alias
              break
            case 'photolink':
              x = a.photolink ? a.photolink : ''
              y = b.photolink ? b.photolink : ''
              break
            case 'photolink':
              x = a.photolink
              y = b.photolink
              break
            case 'deleteddate':
              x = a.deleteddate
              y = b.deleteddate
              break
            case 'gender':
              x = a.gender
              y = b.gender
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
      console.log('sorting changed to ' + name)
    },

    modifyData(animaldocid) {
      console.log(animaldocid)
      /*      firebase.firestore.collection('animals').doc(animaldocid).update({
        category: this.currentanimalcategory,
      })

      firebase.firestore.collection('animals').doc(animaldocid).update({
        gender: this.currentanimalgender,
      })
      firebase.firestore.collection('animals').doc(animaldocid).update({
        monthage: this.currentanimalmonthage,
      })      */
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
    changevalues() {
      // console.log()
      var select1 = document.getElementById('animalcatergorySelect')
      var value1 = select1.options[select1.selectedIndex].value
      this.currentanimalcategory = value1
      var select2 = document.getElementById('animalgenderSelect')
      var value2 = select2.options[select2.selectedIndex].value
      this.currentanimalgender = value2
      var input = document.getElementById('animalmonthageinput')
      var value3 = input.value
      this.currentanimalmonthage = value3
    },
    saveData() {
      if (this.$store.getters.qrcode === '') {
        alert("Qrcode can't be empty.")
        return
      }
      if (this.category === '') {
        alert("Category can't be empty.")
        return
      }

      if (this.gender === '') {
        alert("Gender can't be empty.")
        return
      }
      if (this.monthage === '') {
        alert("Monthage can't be empty.")
        return
      }

      const obj = {
        alias: this.alias,
        category: this.category,
        createddate: this.createddate,
        deleteddate: this.deleteddate,
        gender: this.gender,
        ip: this.ip,
        monthage: this.monthage,
        photolink: this.photolink,
        qrcode: this.$store.getters.qrcode
      }
      // console.log(this.$store.getters.addanimal)

      firestore.collection('animals').add(obj).then(() => {
        alert('Animal registered')
        this.fetchData()
        this.qrcode = ''
        this.category = ''
        this.createddate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.today.getDate())).slice(-2) + ('T' + ('0' + (this.today.getHours())).slice(-2)) + ':' + ('0' + (this.today.getMinutes())).slice(-2)
        this.deleteddate = ''
        this.gender = ''
        this.ip = ''
        this.monthage = ''
        this.alias = ''
        this.photolink = ''
      })
        .catch(e => {
          console.log(e)
        })
    },
    /* onDecode (qrcode) {
      this.selected=this.options[0]
      console.log(qrcode)
      this.qrcode = qrcode;
      this.$store.commit("changeQrcode", qrcode);
      const animalsRef = firestore.collection('animals');

      //console.log(animalsRef);
      const q = animalsRef.where("qrcode", "==", qrcode);
      //console.log(this.qrcode);
      const querySnapshot = q.get().then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          this.category = doc.data().category
          this.createddate = doc.data().createddate
          this.deleteddate = doc.data().deleteddate
          this.gender = doc.data().gender
          this.monthage = doc.data().monthage
          this.qrcode = doc.data().qrcode
          this.docid = {docid:doc.id}.docid
        });
      })
      this.confirmdisabled = 1
    },*/
    onQrDecode(qrcode) {
      // this.selected=this.options[0]

      var animals = this.$store.getters.animals.filter(animal => animal.qrcode === qrcode)
      if (animals.length > 0) {
        this.qrcode = ''
        alert('The Qrcode has been used')
        return null
      } else {
        this.$store.state.data.qrcode.Qrcode = qrcode
        // console.log(qrcode)
      }
    /* console.log(this.animals)
      this.obtainedanimals = 0
      this.obtainedanimalsGoat = 0
      this.obtainedanimalsSheep = 0
      this.obtainedanimalsBok = 0
      this.obtainedanimalsCattle = 0

      this.animals.forEach((anim) => {
        this.obtainedanimals++
        switch(anim.category){
            case "Goat":
              this.obtainedanimalsGoat++
              break
            case "Sheep":
              this.obtainedanimalsSheep++
              break
            case "Bok":
              this.obtainedanimalsBok++
              break
            case "Cattle":
              this.obtainedanimalsCattle++
              break
        }
      })
      this.confirmdisabled = 1  */
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
          alert('No Qrcode is detected.')
        } else {
          this.onQrDecode(content)
        }
      } catch (error) {
      // ...
      }
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
      /* console.log(this.animals)
      this.$store.getters.aminals.collection('animals').get().then(docs=>{
        docs.forEach(doc=>{
          this.animals.push({...doc.data(),...{docid:doc.id}})

        })
      })
      this.$forceUpdate()*/
    },

    deleteData(docid) {
      console.log(docid)
      if (confirm('Are you sure you will delete this?')) {
        firestore.collection('animals').doc(docid).delete().then(() => {
          alert('Animal Removed')
          this.fetchData()
        }).catch(e => {
          console.log(e)
        })
      }
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

    editData(docid) {
      /* firestore.collection('animals').doc(docid).get().then(doc=>{
      this.category=doc.data().category
      this.gender=doc.data().gender
      this.qrcode=doc.data().qrcode
      this.monthage=doc.data().monthage
      this.createddate= doc.data().createddate
      this.deleteddate= doc.data().deleteddate
      this.docid = doc.id
      })   */
    }
  }
}
</script>

<style scoped>
  .v-input--checkbox .v-label {
    font-size: 10px;
  }

  .scrollable {
  overflow: hidden;
  overflow-y: scroll;
  overflow-x: scroll;
  height: calc(100vh - 20px);
}
</style>

