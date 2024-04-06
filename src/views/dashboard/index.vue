<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
// import {firestore} from '../dashboard/admin/components/Config/firebase'
// import {auth} from '../dashboard/admin/components/Config/firebase'
// import Vue from 'vue'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  async beforeCreate() {

  },

  mounted() {

  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
<style>

body{
  background-color: rgb(80, 220, 255);
  background: cover;
    /* Other background properties here */
}

</style>
