<template>
  <div>
    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <div class="container">
            <div class="row">
               <div style="text-align:center"><h1  text-align="center">Manage animal records </h1></div>
            </div>-->
    <div>
      <b-container class="bv-example-row">
        <el-dropdown>
          <span class="el-dropdown-link">
            Dropdown List<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :value="'RegisterOrSearch'">Register or Search Users</el-dropdown-item>
            <el-dropdown-item value="'registerUser'">Register a new user</el-dropdown-item>
            <el-dropdown-item :value="'emailSearch'">Search user by email</el-dropdown-item>
            <el-dropdown-item :value="'nameSearch'">Search user by names</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <select v-model="searchmode">
          <option :value="'RegisterOrSearch'">
            Register or Search Users
          </option>
          <option :value="'registerUser'">
            Register a new user
          </option>
          <option :value="'emailSearch'">
            Search user by email
          </option>
          <option :value="'nameSearch'">
            Search user by names
          </option>
        </select>

        <div v-if="this.searchmode === 'registerUser'" class="row">
          <label>Email address:   </label><br>
          <span>
            <input v-model="newemail" type="email"><label style="color: red">*</label><br>
          </span>
          <label>First Name:   </label><br>
          <span>
            <input v-model="newfirstname" type="text"><label style="color: red">*</label><br>
          </span>
          <label>Last Name:   </label><br>
          <span>
            <input v-model="newsurname" type="text"><label style="color: red">*</label><br>
          </span>
          <label>Role:   </label><br>
          <div>
            <input id="Admin" v-model="newrole" type="radio" value="admin">
            <label for="Admin">Admin  </label> &nbsp;&nbsp;&nbsp;&nbsp;
            <input id="Devemoper" v-model="newrole" type="radio" value="devemoper">
            <label for="Devemoper">Devemoper   </label> &nbsp;&nbsp;&nbsp;&nbsp;
            <input id="Customer" v-model="newrole" type="radio" value="customer">
            <label for="Customer">Customer  </label> <label style="color: red">*</label>
            <!--<input type="radio" id="Sheep" value="Sheep" v-model="newrole">
                    <label for="Sheep">Sheep  </label>  -->
          </div>
          <label>Password:   </label><br>
          <span>
            <input v-model="password" type="password"><label style="color: red">*</label><br>
          </span>
          <span>
            <label>Photo:   </label>
            <input id="needphoto" v-model="needphoto" type="checkbox" name="needphoto"><br>
            <div v-if="needphoto"> <camera @handleSetPhotoData="handleSetPhotoData" /><br></div>
          </span>

          <button style="margin-top: 10px" type="button" class="btn btn-primary" @click="registernewuser">Register</button><br>
        </div>
        <div v-if="this.searchmode === 'emailSearch'" class="row">
          <label>Input email address to search:   </label><br>
          <span>
            <input v-model="emailtosearch" type="email"><br>
            <button style="margin-top: 10px" type="button" class="btn btn-primary" @click="searchEmail">Search Email</button><br>
            <button style="margin-top: 10px" type="button" class="btn btn-primary" @click="showusers = users">Show All</button><br>
          </span>
        </div>
        <div v-if="this.searchmode === 'nameSearch'" class="row">
          <label for="fname">First name:</label><br>
          <span>
            <input id="fname" v-model="firstnametosearch" type="text" name="fname"> <br>
            <button style="margin-top: 10px" type="button" class="btn btn-primary" @click="searchFirstname">Search Firstname</button><br>
          </span>
          <label for="lname">Last name:</label><br>
          <span>
            <input id="lname" v-model="surnametosearch" type="text" name="lname">    <br>
            <button style="margin-top: 10px" type="button" class="btn btn-primary" @click="searchSurname">Search Surname</button><br>
            <button style="margin-top: 10px" type="button" class="btn btn-primary" @click="searchFullname">Search Fullname</button><br>
            <button style="margin-top: 10px" type="button" class="btn btn-primary" @click="showusers = users">Show All</button><br>

          </span>
        </div>
      </b-container>
    </div>
    <div style="text-align:right">
      <vue-excel-xlsx
        :data="showusers"
        :columns="columns"
        :file-name="'ExportedUers'"
        :file-type="'xlsx'"
        :sheet-name="'UserInformation'"
      >
        Export to Excel
      </vue-excel-xlsx>
    </div>

    <b-modal
      id="modal-Edit-user"
      ref="modal"
      title="Edit user information"
      size="sm"
      @show="resetModalEditUser"
      @hidden="resetModalEditUser"
      @ok="handleOkEditUser"
    >
      <b-form ref="form" disabled @submit.stop.prevent="handleSubmitEditUser">
        <b-container class="bv-example-row" fluid="lg">
          <b-row class="mb-1">
            <b-col cols="6"><label style="color: red">*</label><label>Email</label></b-col><br>
            <b-col cols="6"><input id="Email" v-model="email" type="text" placeholder="Email" style="text-transform: uppercase;" @change="onchanged()"></b-col>
          </b-row>

          <b-row class="mb-1"><b-col cols="12"><label style="color: red">*</label><label>First name</label></b-col></b-row>
          <b-row class="mb-2">
            <b-col cols="12">
              <input
                v-model="firstname"
                class="form-control"
                type="text"
                placeholder="First name"
                aria-label="default input example"
                autocomplete="off"
                @change="onchanged()"
              ></b-col>
          </b-row>
          <b-row class="mb-2"><b-col cols="4">Surname</b-col></b-row>
          <b-row class="mb-2">
            <b-col cols="12"><input
              v-model="surname"
              class="form-control"
              type="text"
              placeholder="Surname"
              aria-label="default input example"
              autocomplete="off"
              @change="onchanged()"
            >  </b-col>
          </b-row>
          <b-row class="mb-2"><b-col cols="4">Role</b-col></b-row>
          <b-row class="mb-2">
            <b-col cols="12"><input
              v-model="role"
              class="form-control"
              disabled="true"
              type="text"
              placeholder="Role"
              aria-label="default input example"
              autocomplete="off"
              @change="onchanged()"
            >  </b-col>
          </b-row>
          <b-row class="mb-2"><b-col cols="4">Password</b-col></b-row>
          <b-row class="mb-2">
            <b-col cols="12"><input
              v-model="password"
              class="form-control"
              type="password"
              placeholder="Password"
              aria-label="default input example"
              autocomplete="off"
            >  </b-col>
          </b-row>
          <b-row class="mb-1">
            <b-col cols="4">Photo</b-col>
          </b-row>
          <b-row class="mb-1">
            <b-col cols="4"><camera @handleSetPhotoData="handleSetPhotoData" /></b-col>
          </b-row>
        </b-container>
      </b-form>
    </b-modal>

    <!-- User photo Form-->
    <b-modal
      id="modal-user-photo"
      ref="modal"
      title="User photo"
      size="sm"
      ok-only
    >
      <b-form>
        <b-container class="bv-example-row" fluid="lg">
          <img :src="photo">
        </b-container>
      </b-form>
    </b-modal>

    <!--users Data/Table-->
    <div class="row">

      <div ref="tablearea" class="content scrollable">

        <div class="col-md-12">

          <label> Found {{ obtainedusers }} users: Admin({{ obtainedAdmin }}),Developer({{ obtainedDeveloper }}),Customer({{ obtainedCustomer }}))   </label>
          <!--<input class="form-control" v-model="obtainedanimals" type="number" disabled> animals found<input />-->

          <table border="3" name="animaltable" style="table-layout: fixed; width: 100%">
            <thead>
              <tr>
                <th style="word-wrap: break-word" scope="col" @click="sort('email')">Email</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('firstname')">First Name</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('surname')">Surname</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('role')">Role</th>
                <th style="word-wrap: break-word" scope="col" @click="sort('photo')">Photo</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user,index) in showusers" :key="index">

                <td style="word-wrap: break-word">{{ user.email }}</td>
                <td style="word-wrap: break-word">{{ user.firstname }}</td>
                <td style="word-wrap: break-word">{{ user.surname }}</td>
                <td style="word-wrap: break-word">{{ user.role }}</td>
                <td style="word-wrap: break-word">
                  <span
                    v-if="user.photo!=null
                      && user.photo!=''"
                  ><button
                    v-b-modal.modal-user-photo
                    size="sm"
                    class="btn btn-primary"
                    @click="boundDataToPhotoModal(user.photo)"
                  >Photo</button></span>
                </td>
                <td><button v-b-modal.modal-Edit-user type="button" class="btn btn-warning" @click="boundDataToEditModal(user.userID)">Edit</button></td>
                <td><button type="button" class="btn btn-danger" @click="deleteData(user.userID)">Delete</button></td>

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
import { auth } from '../dashboard/admin/components/Config/firebase'
// import {admin} from '../dashboard/admin/components/Config/firebase'
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

  name: 'UserManage',

  components: { QrcodeStream, QrcodeDropZone, QrcodeCapture, Camera },

  data() {
    const selectedcategoryforsearch = []
    const searchmode = 'emailSearch'

    return {
      tableData: [{
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }],
      alias: '',
      admin: '',
      users: [],
      showusers: [],
      columns: [
        { field: 'email', label: 'Email' },
        { field: 'firstname', label: 'First Name' },
        { field: 'surname', label: 'Surname' },
        { field: 'role', label: 'Role' },
        { field: 'photo', label: 'Photo link' }
      ],
      confirmdisabled: 1,
      count: 5,
      createddate: '',
      currentsortdir: 'asc',
      currentsortname: 'email',
      error: '',
      email: '',
      emailtosearch: '',
      firstname: '',
      firstnametosearch: '',
      fullnametosearch: '',
      imageName: '',
      docid: '',
      needphoto: false,
      newemail: '',
      newfirstname: '',
      newsurname: '',
      newrole: 'Customer',
      newphoto: '',
      obtainedusers: 0,
      obtainedAdmin: 0,
      obtainedDeveloper: 0,
      obtainedCustomer: 0,
      password: '',
      photo: '',
      role: '',
      searchform: {
        email: '',
        firstname: '',
        surname: '',
        photo: '',
        role: ''
      },
      searchmode: 'RegisterOrSearch',
      surname: '',
      surnametosearch: ''
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
  },

  mounted() {
    this.fetchData()
    // console.log(this.users)
    // this.admin = require('firebase-admin');
  },

  function() {
    return {
      items: []
    }
  },

  methods: {

    registernewuser() {
      if (this.newemail == '') {
        alert('Email cannot be empty')
        return
      }
      if (this.newfirstname == '') {
        alert('First Name cannot be empty')
        return
      }
      if (this.newsurname == '') {
        alert('Surname cannot be empty')
        return
      }
      if (this.newrole == '') {
        alert('Role cannot be empty')
        return
      }
      if (this.password == '') {
        alert('Password cannot be empty')
        return
      }
      // console.log(this.email)
      const obj = {
        email: this.newemail,
        firstname: this.newfirstname,
        surname: this.newsurname,
        role: this.newrole,
        photo: this.newphoto
      }
      firestore.collection('users').add(obj).then(() => {
        // alert('Animal category ' + newcategory + ' added' )
        // console.log("User saved in firestore")
        alert('User generated: ' + this.newemail + ' with role:' + this.newrole)
        this.newemail = ''
        this.newfirstname = ''
        this.newsurname = ''
        this.newrole = ''
        this.newphoto = ''
        this.fetchData()
      })
        .catch(e => {
          console.log(e)
        })
      try {
        auth.createUserWithEmailAndPassword(this.newemail, this.password)
          .then(authUser => {
            // console.log("User created")
            // console.log(authUser)

            /* return db.collection("roles").doc(authUser.uid).set({
                                email: authUser.email,
                                role: customClaims
                            })*/
          })
          .catch(e => {
            alert(e)
          })
      } catch (error) {
        alert(error)
      }
    },

    searchEmail() {
      this.showusers = this.users.filter(user => user.email === this.emailtosearch)
    },
    searchFirstname() {
      this.showusers = this.users.filter(user => user.firstname === this.firstnametosearch)
    },
    searchSurname() {
      this.showusers = this.users.filter(user => user.surname === this.surnametosearch)
    },
    searchFullname() {
      this.showusers = this.users.filter(user => user.surname === this.surnametosearch && user.firstname === this.firstnametosearch)
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
      this.newphoto = photoinfo.url
      console.log(this.newphoto)
      this.imageName = photoinfo.name
      console.log(photoinfo)
      this.confirmdisabled = 0
    },

    boundDataToPhotoModal(photo) {
      this.photo = photo
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

    sortusers(name, sd) {
      var that = this
      this.users.sort(function(a, b) {
        var x
        var y
        switch (name) {
          case 'email':
            x = a.email
            y = b.email
            break
          case 'firstname':
            x = a.firstname
            y = b.firstname
            break
          case 'surname':
            x = a.surname
            y = b.surname
            break
          case 'role':
            x = a.role
            y = b.role
            break
          case 'photo':
            x = a.photo
            y = b.photo
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
      console.log('sorting changed to ' + name + 'in direction' + this.currentsortdir)
    },

    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      // this.nameState = valid
      return valid
    },

    resetModalEditUser() {
      // this.name = ''
      // this.nameState = null
    },

    handleOkEditUser(bvModalEvt) {
      // Prevent modal from closing
      // bvModalEvt.preventDefault()
      // Trigger submit handler
      // this.handleSubmit()
      this.modifyData()
    },

    handleSubmitEditUser() {
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
      event.preventDefault()
      this.users = []
      this.obtainedAdmin = 0
      this.obtainedDeveloper = 0
      this.obtainedCustomer = 0
      this.obtainedusers = 0
      var obtaineduser = []

      if (this.searchform.alias) {
        this.animals = this.$store.getters.animals.filter(animal => animal.alias === this.searchform.alias)
        this.obtainedanimals = this.animals.length
        this.animals.forEach(animal => {
          switch (animal.category) {
            case 'Goat':
              this.obtainedanimalsGoat++
              break
            case 'Sheep':
              this.obtainedanimalsSheep++
              break
            case 'Bok':
              this.obtainedanimalsBok++
              break
            case 'Cattle':
              this.obtainedanimalsCattle++
              break
          }
        })
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
          switch (checkedcategory) {
            case 'Goat':
              obtainedanimal = this.$store.getters.goatlist
              break
            case 'Sheep':
              obtainedanimal = this.$store.getters.sheeplist
              break
            case 'Bok':
              obtainedanimal = this.$store.getters.boklist
              break
            case 'Cattle':
              obtainedanimal = this.$store.getters.cattlelist
              break
          }

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
          this.obtainedanimals += obtainedanimal.length
          switch (checkedcategory) {
            case 'Goat':
              this.obtainedanimalsGoat += obtainedanimal.length
              break
            case 'Sheep':
              this.obtainedanimalsSheep += obtainedanimal.length
              break
            case 'Bok':
              this.obtainedanimalsBok += obtainedanimal.length
              break
            case 'Cattle':
              this.obtainedanimalsCattle += obtainedanimal.length
              break
          }
        })
      }
    },

    onSearchReset(event) {
      event.preventDefault()
      // Reset our form values
      this.searchform.email = ''
      this.searchform.firstname = ''
      this.searchform.surname = ''
      this.searchform.role = ''
      this.searchform.photo = ''
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
      this.users = this.$store.getters.users
      this.showusers = this.users
      this.obtainedusers = this.$store.getters.usercount
      this.obtainedAdmin = this.$store.getters.usercountadmin
      this.obtainedDeveloper = this.$store.getters.usercountdeveloper
      this.obtainedCustomer = this.$store.getters.usercountcustomer
    },

    deleteData(docid) {
      if (confirm('Are you sure you will delete this?')) {
        firestore.collection('users').doc(docid).delete().then(() => {
          alert('User Removed')
          this.fetchData()
        }).catch(e => {
          console.log(e)
        })
      }
    },

    modifyData() {
      if (this.docid) {
        console.log(this.docid)
        firestore.collection('users').doc(this.docid).update({
          email: this.email,
          firstname: this.firstname,
          surname: this.surname,
          role: this.role,
          photo: this.newphoto
        }).then(() => {
          this.fetchData()
        })
        if (this.password != '') {
          // update auth password
        }
      } else {
        alert('no doc to update')
      }
    },

    boundDataToEditModal(docid) {
      // console.log(docid)
      firestore.collection('users').doc(docid).get().then(doc => {
        this.email = doc.data().email
        this.firstname = doc.data().firstname
        this.surname = doc.data().surname
        this.role = doc.data().role
        this.photo = doc.data().photo ? doc.data().photo : ''
        this.password = ''
        this.docid = docid
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
