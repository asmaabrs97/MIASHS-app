<template>
    <div id="MainLayout" class="h-screen">
      <div class="w-full max-w-[500px] mx-auto">
        <div id="TopMenu" class="w-full flex items-center justify-center px-2 h-10 my-2">
          <img class="w-[35px]" src="/UGA.png" />
        </div>
      </div>
      <div class="flex w-full max-w-[500px] mx-auto h-screen">
        <slot />
      </div>
  
      <div
        id="BottomNav"
        class="fixed z-50 bottom-0 flex w-full h-[70px] border-t border-t-gray-700 bg-black"
      >
        <div class="flex w-full max-w-[500px] mx-auto flex items-center justify-around">
          <button @click="navigateTo('/')" class="w-full h-full">
            <Icon icon="material-symbols:home-outline" width="35" color="#ffffff" />
          </button>
          <button @click="userStore.isMenuOverlay = true" class="w-full h-full">
            <Icon icon="material-symbols:edit-square-outline-rounded" width="32" color="#ffffff" />
          </button>
          <button @click="userStore.isLogoutOverlay = true" class="w-full h-full">
            <Icon icon="ph:sign-out" width="32" color="#ffffff" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { Icon } from '@iconify/vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '~/stores/user'; // Si vous utilisez Pinia pour le `userStore`
  
  const router = useRouter();
  const userStore = useUserStore();
  
  
  </script>
  