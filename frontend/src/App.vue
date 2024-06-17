<script setup>
import FileUpload from './components/FileUploader.vue';
</script>

<template>
  <div
    class="flex flex-col items-center justify-center bg-gray-900 min-h-screen"
  >
    <div class="flex-start">
      <h2 class="text-white font-extrabold mb-4 text-2xl">
        File Compressor / Decompressor
      </h2>
      <p class="text-gray-400 text-lg mb-4">Compress <b> txt </b> files or Decompress <b>huff</b> files</p>
      <div>
        <FileUpload />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
