<template>
  <div class="bg-neutral-900 border border-gray-800 p-4 rounded-lg mb-2">
    <div class="flex items-center mb-2">
      <img :src="comment.userAvatar" class="w-8 h-8 rounded-full mr-2" />
      <div class="text-white text-sm">{{ comment.userName }}</div>
    </div>
    <p class="text-gray-300 text-sm">{{ comment.text }}</p>
  </div>
</template>

<script setup>
defineProps({
  comment: {
    type: Object,
    required: true
  }
})
</script>