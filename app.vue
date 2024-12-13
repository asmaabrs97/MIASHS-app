<template>
  <div class="bg-black fixed w-[calc(100%+1px)] h-full">
    <NuxtPage />

    <CreatePoste
      :class="[
          {'max-h-[100vh] transition-all duration-200 ease-in visible': userStore.isMenuOverlay },
          {'max-h-0 transition-all duration-200 ease-out invisible': !userStore.isMenuOverlay },
      ]"
    />
    <Modal 
      :class="[
          {'max-h-[100vh] transition-all duration-200 ease-in visible': userStore.isLogoutOverlay },
          {'max-h-0 transition-all duration-200 ease-out invisible': !userStore.isLogoutOverlay },
      ]"
    />
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';
import { onMounted } from 'vue';
import { useRouter } from '#app';

const userStore = useUserStore()
const router = useRouter()

onMounted(() => {
  // Vérifie si l'utilisateur est authentifié
  if (!localStorage.getItem('credentials')) {
    router.push('/auth/login')
    return;
  }

  // Initialise le store avec les données sauvegardées
  userStore.initializeStore();

  // Charge les stories de démonstration si aucune n'existe
  if (!userStore.stories || userStore.stories.length === 0) {
    const demoStories = [
      {
        id: Date.now(),
        userName: 'Karima LACENE',
        userImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&h=200',
        seen: false,
        items: [{
          id: Date.now(),
          type: 'image',
          media: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000',
          timestamp: new Date().toISOString()
        }]
      }
    ];
    userStore.setStories(demoStories);
  }
})
</script>

<style>
/* Ajoutez ici vos styles si nécessaire */
</style>