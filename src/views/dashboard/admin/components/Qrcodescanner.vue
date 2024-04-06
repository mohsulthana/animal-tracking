<template>
  <div>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div class="container">
        <div class="row">
          <div style="text-align:center"><h1 text-align="center">Register animals </h1></div>
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
              <QrcodeCapture :multiple="true" :capture="selected.value" @decode="onDecode" />
            </div>
            <div v-else>
              <p class="error">{{ error }}</p>
              <QrcodeStream @decode="onDecode" @init="onInit" />
            </div>
          </div>
        </div>
      </div>

      <p class="decode-result"><label>Qrcode:</label> <input
        v-model="result"
        class="form-control"
        :readonly="true"
        type="text"
        placeholder="00:00:00:00:00:00"
        aria-label="default input example"
        autocomplete="off"
      ></p>

    </el-row>
  </div>
</template>

<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'

export default {

  components: { QrcodeStream, QrcodeDropZone, QrcodeCapture },

  data() {
    const options = [
      { text: 'nothing (default)', value: undefined },
      { text: 'Camera', value: this.paintOutline },
      // { text: "centered text", value: this.paintCenterText },
      //  { text: "bounding box", value: this.paintBoundingBox },
      { text: 'Files', value: 'uploadfile' }
    ]

    const selected = options[1]

    return {
      result: '',
      options,
      selected: options[0],
      error: ''
    }
  },

  methods: {
    onDecode(result) {
      this.result = result
      this.$store.commit('changeQrcode', result)
      this.selected = this.options[0]
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

    paintBoundingBox(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const { boundingBox: { x, y, width, height }} = detectedCode

        ctx.lineWidth = 2
        ctx.strokeStyle = '#007bff'
        ctx.strokeRect(x, y, width, height)
      }
    },

    paintCenterText(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const { boundingBox, rawValue } = detectedCode

        const centerX = boundingBox.x + boundingBox.width / 2
        const centerY = boundingBox.y + boundingBox.height / 2

        const fontSize = Math.max(12, 50 * boundingBox.width / ctx.canvas.width)
        console.log(boundingBox.width, ctx.canvas.width)

        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.textAlign = 'center'

        ctx.lineWidth = 3
        ctx.strokeStyle = '#35495e'
        ctx.strokeText(detectedCode.rawValue, centerX, centerY)

        ctx.fillStyle = '#5cb984'
        ctx.fillText(rawValue, centerX, centerY)
      }
    },

    logErrors(promise) {
      promise.catch(console.error)
    }
  }

}
</script>
