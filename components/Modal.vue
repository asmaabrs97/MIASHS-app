<template>
    <div id="Modal" class="fixed grid place-items-center h-screen z-50 bottom-0 bg-black bg-opacity-50 backdrop-blur-md h-screen w-full">
      <div class="bg-black w-full max-w-[300px] rounded-lg text-white border border-gray-600 p-2">
        <!-- Bouton pour fermer la modale -->
        <button 
          @click="closeModal" 
          class="flex items-center justify-between bg-black w-full p-3"
        >
          <div>Close Modal</div>
          <Icon name="mdi:close" size="25"/>
        </button>
        <div class="border-b border-b-gray-700 my-1" />
        <!-- Bouton pour réinitialiser l'utilisateur -->
        <button @click="logout" class="flex items-center justify-between bg-black w-full p-3">
          <div>Log Out</div>
          <Icon name="ph:sign-out" size="25"/>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  // Gestion de l'état local ou global
  import { ref } from 'vue'
  import { useRouter } from '#app'
  import { useUserStore } from '~/stores/user'

  const router = useRouter()
  const userStore = useUserStore()

  // Variable pour gérer la fermeture de la modale
  const showModal = ref(false)

  // Fonction pour fermer la modale
  const closeModal = () => {
    userStore.isLogoutOverlay = false
  }

  // Fonction pour réinitialiser les données utilisateur
  const logout = () => {
    // Supprime les données utilisateur du stockage local
    localStorage.removeItem('user')
    localStorage.removeItem('posts')
    localStorage.removeItem('credentials')

    // Ferme la modale
    closeModal()
    
    // Redirige vers la page de connexion
    router.push('/auth/login')
  }
  </script>