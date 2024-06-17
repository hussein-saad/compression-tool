<script setup>
import { ref } from 'vue';

const fileInput = ref(null);
const action = ref('compress');
const processing = ref(false);
const processedFileData = ref(null);
const errorMessage = ref('');

const handleFileChange = (event) => {
  const files = event.target.files;
  errorMessage.value = '';
  fileInput.value = '';
  if (files.length) {
    fileInput.value = files[0];
    const fileName = fileInput.value.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (
      (action.value == 'compress' && fileExtension === 'txt') ||
      (action.value == 'decompress' && fileExtension === 'huff')
    ) {
      processFile();
    } else {
      errorMessage.value = 'Unsupported file type. Please upload another file.';
    }
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const processFile = async () => {
  processing.value = false;
  processedFileData.value = null;
  const formData = new FormData();
  formData.append('file', fileInput.value);

  try {
    const response = await fetch(
      `http://localhost:3000/api/compression/${action.value}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    processing.value = true;
    const data = await response.blob();
    processedFileData.value = data;
  } catch (error) {
    console.error('Error processing file:', error);
    errorMessage.value = 'Error processing file. Please try again.';
  }
};

const downloadFile = () => {
  processing.value = false;
  if (processedFileData.value) {
    try {
      const downloadUrl = window.URL.createObjectURL(processedFileData.value);

      const a = document.createElement('a');
      a.href = downloadUrl;
      const extension = action.value === 'compress' ? 'huff' : 'txt';
      const fileName =
        action.value === 'compress' ? 'compressed' : 'decompressed';

      a.download = `${fileName}.${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
      errorMessage.value = 'Error downloading the file. Please try again.';
    }
  }
};
</script>

<template>
  <div
    class="flex flex-col justify-center items-center bg-gray-800 max-h-screen"
  >
    <div
      class="bg-gray-700 shadow-lg p-8 md:p-12 lg:p-16 rounded-lg w-full max-w-md"
    >
      <div class="mb-4 text-white">
        <label class="mr-2">
          <input type="radio" value="compress" v-model="action" />
          Compress
        </label>
        <label>
          <input type="radio" value="decompress" v-model="action" />
          Decompress
        </label>
      </div>
      <div
        class="border-2 border-dashed border-gray-600 rounded-lg p-4 md:p-8 lg:p-12 mb-4 w-full mx-auto"
        @drop.prevent="handleFileChange"
        @dragover.prevent
      >
        <input
          type="file"
          class="hidden"
          ref="fileInput"
          @change="handleFileChange"
        />
        <button @click="triggerFileInput" class="btn btn-primary mb-2">
          Upload from Computer
        </button>
        <p class="text-center text-gray-400">or Drag & Drop your file here</p>
      </div>

      <div v-if="processing" class="flex flex-col gap-2">
        <button
          class="bg-green-500 text-white py-2 rounded"
          @click="downloadFile"
        >
          Download Processed File
        </button>
      </div>
    </div>
    <div
      v-if="errorMessage"
      class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded shadow w-full max-w-md"
      role="alert"
    >
      <p class="font-bold">Error</p>
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>
<style>
.btn-primary {
  @apply bg-blue-500 text-white py-2 px-4 rounded;
}

.btn-primary:hover {
  @apply bg-blue-600;
}
</style>
