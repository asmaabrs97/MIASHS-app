<template>
  <div class="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-2">
    <div class="max-w-[500px] mx-auto flex justify-between items-center">
      <button class="p-2 hover:bg-gray-900 rounded-full transition-colors">
        <Icon name="material-symbols:home" size="28" color="#ffffff" />
      </button>
      <button class="p-2 hover:bg-gray-900 rounded-full transition-colors">
        <Icon name="material-symbols:search" size="28" color="#ffffff" />
      </button>
      <button class="p-2 hover:bg-gray-900 rounded-full transition-colors">
        <Icon name="material-symbols:add-box-outline" size="28" color="#ffffff" />
      </button>
      <button class="p-2 hover:bg-gray-900 rounded-full transition-colors">
        <Icon name="material-symbols:favorite-outline" size="28" color="#ffffff" />
      </button>
      <button class="p-2 hover:bg-gray-900 rounded-full transition-colors">
        <img class="w-7 h-7 rounded-full" :src="userImage" alt="Profile">
      </button>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';

// TODO: Remplacer par l'image de l'utilisateur actuel
const userImage = 'https://placekitten.com/100/100';
</script>
