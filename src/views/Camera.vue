<template>
  <div class="camera-box">

    <p class="error">{{ error }}</p>
    <div style="display: flex; justify-content: left;">
      <!-- camera icon -->
      <label v-if="!isCameraOpen">
        Click <img
          style="height: 25px;"
          src="https://img.icons8.com/material-outlined/50/000000/camera--v2.png"
          class="button-img camera-shoot"
          @click="openCamera"
        > to open the camera
      </label>
      <!-- video -->
      <span v-if="!isPhotoSelected && isCameraOpen" class="camera-canvas">
        <video ref="camera" :width="canvasWidth" :height="canvasHeight" autoplay @click="capture" /><br>
        <label>Click the vedio to capture</label><br>
        <canvas v-show="false" id="photoTaken" ref="canvas" :width="canvasWidth" :height="canvasHeight" />
      </span>
      <!-- image box -->
      <span v-if="isPhotoSelected">
        <img
          :width="canvasWidth"
          :height="canvasHeight"
          :src="imgDataUrl"
        ><br>
        <button @click="uploadPhoto">UpLoad</button>
        <button @click="recapture">ReCapture</button><br>
        <label v-if="showuploading">uploading...</label>
        <label v-if="showuploaded">uploaded: {{ imageName }}</label>
      </span>
    </div>
    <!-- <div v-if="!isPhotoSelected" style="height: 200px">
                <img :width="canvasWidth" :height="canvasHeight"
                 :src="imgDataUrl" @click="uploadPhoto" /><br><button @click="recapture">ReCapture</button>
        </div>
        <div v-else class="camera-canvas">
                <img :width="canvasWidth" :height="canvasHeight"
                 :src="imgDataUrl" @click="uploadPhoto" /><br><button @click="recapture">ReCapture</button>
        </div>-->

    <!--<vue-picture-swipe v-on:click="PhotoSelected" :items="items"></vue-picture-swipe>      -->

    <!-- <vue-picture-swipe v-on:click="PhotoSelected" :items="items"></vue-picture-swipe>

-->
  </div>

</template>

<script>
import VuePictureSwipe from 'vue-picture-swipe'
import { firestorage } from './dashboard/admin/components/Config/firebase'

export default {
  name: 'Camera',
  components: {
    VuePictureSwipe
  },
  data() {
    return {
      isCameraOpen: false,
      canvasHeight: 200,
      canvasWidth: 190,
      items: [],
      imageData: null,
      img1: null,
      imageName: '',
      imgDataUrl: null,
      isPhotoSelected: false,
      error: '',
      uploadValue: 0,
      showuploading: false,
      showuploaded: false

    }
  },
  methods: {

    openCamera() {
      this.startCameraStream()
      this.isCameraOpen = true
    },

    PhotoSelected(evn) {
      console.log(evn)
    },

    handleSetPhotoData(photoinfo) {
      this.$emit('handleSetPhotoData', photoinfo)
    },

    toggleCamera() {
      if (this.isCameraOpen) {
        this.isCameraOpen = false
        this.stopCameraStream()
      } else {
        this.isCameraOpen = true
        this.startCameraStream()
      }
    },
    startCameraStream() {
      try {
        const constraints = (window.constraints = {
          audio: false,
          video: true
        })
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(stream => {
            this.$refs.camera.srcObject = stream
          })
      } catch (error) {
        this.error = error
        // alert("Browser doesn't support or there is some errors." + error);
      }
    },

    stopCameraStream() {
      const tracks = this.$refs.camera.srcObject.getTracks()
      tracks.forEach(track => {
        track.stop()
      })
    },
    recapture() {
      this.isPhotoSelected = false
      this.showuploaded = false
      this.imgDataUrl = ''
      this.startCameraStream()
    },
    capture() {
      this.showuploaded = false
      const FLASH_TIMEOUT = 50
      const self = this
      setTimeout(() => {
        const context = self.$refs.canvas.getContext('2d')
        context.drawImage(self.$refs.camera, 0, 0, self.canvasWidth, self.canvasHeight)
        self.imgDataUrl = self.$refs.canvas.toDataURL('image/jpeg')
          .replace('image/jpeg', 'image/octet-stream')
        self.isPhotoSelected = true
        self.stopCameraStream()
        // self.uploadPhoto(dataUrl);
        // self.handleSetPhotoData({url: self.img1, name:self.imageName})
        // self.addToPhotoGallery(self.imgDataUrl);
        /*    console.log(dataUrl)
                     self.isCameraOpen = false;
                    */
      }, FLASH_TIMEOUT)
    },

    addToPhotoGallery(dataURI) {
      this.items.push(
        {
          src: dataURI,
          thumbnail: dataURI,
          w: this.canvasWidth,
          h: this.canvasHeight,
          alt: 'some numbers on a grey background' // optional alt attribute for thumbnail image
        }
      )
    },

    uploadPhoto() {
      this.showuploading = true
      const uniquePictureName = this.generateCapturePhotoName()
      const capturedPhotoFile = this.dataURLtoFile(this.imgDataUrl, uniquePictureName + '.jpg')
      const formData = new FormData()
      formData.append('file', capturedPhotoFile)
      // Upload image api
      // axios.post('http://your-url-upload', formData).then(response => {
      // console.log(response)
      // })
      this.imageName = uniquePictureName + '.jpg'
      const storageRef = firestorage.ref(this.imageName).put(capturedPhotoFile)
      storageRef.on('state_changed', snapshot => {
        this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      }, error => { console.log(error.message) },
      () => {
        this.uploadValue = 100
        this.showuploading = false
        storageRef.snapshot.ref.getDownloadURL().then((url) => {
          this.img1 = url
          console.log(this.img1)
          this.handleSetPhotoData({ url: this.img1, name: this.imageName })
          this.showuploaded = true
        })
      }
      )
    },

    generateCapturePhotoName() {
      return Math.random().toString(36).substring(2, 15)
    },

    dataURLtoFile(dataURL, filename) {
      const arr = dataURL.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    }
  }
}
</script>

<style scoped>
    .camera-box {
        border: 1px dashed #d6d6d6;
        border-radius: 4px;
        padding: 2px;
        width: 80%;
        min-height: 300px;
    }

</style>
