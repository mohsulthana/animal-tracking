<template>
  <div>
    <div>
      <h2>Search and add a pin</h2>
    </div>
    <br>
    <GmapMap
      :center="center"
      :zoom="12"
      style="width:100%;  height: 400px;"
    />
  </div>
</template>

<script>

console.log('src:components:GoogleMap.vue' + (+new Date()))

export default {
  name: 'GoogleMap',
  data() {
    return {
      center: { lat: -28.2293, lng: 25.7479 }
    }
  }
}
</script>

<style scoped>

</style>
