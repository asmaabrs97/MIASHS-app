<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-black">
    <!-- Logo -->
    <img src="/UGA.png" alt="UGA Logo" class="mb-6 w-24 h-24" />
    <div class="bg-neutral-800 p-8 rounded shadow-md w-96">
      <h2 class="text-2xl font-bold text-center text-white mb-6">Connexion</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-bold text-gray-300 mb-2">Adresse Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="Entrez votre email"
            class="w-full px-3 py-2 border rounded bg-neutral-700 text-white placeholder-gray-400"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-bold text-gray-300 mb-2">Mot de Passe</label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Entrez votre mot de passe"
            class="w-full px-3 py-2 border rounded bg-neutral-700 text-white placeholder-gray-400"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Se connecter
        </button>
      </form>
      <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = () => {
  const storedCredentials = JSON.parse(localStorage.getItem('credentials'));

  if (!storedCredentials) {
    // Enregistre les informations utilisateur pour la première fois
    localStorage.setItem(
      'credentials',
      JSON.stringify({ email: email.value, password: password.value })
    );
    alert('Compte créé avec succès ! Vous êtes maintenant connecté.');
    router.push('/'); // Redirige vers la page d'accueil
  } else if (
    storedCredentials.email === email.value &&
    storedCredentials.password === password.value
  ) {
    alert('Connexion réussie.');
    router.push('/'); // Redirige vers la page d'accueil
  } else {
    error.value = 'Email ou mot de passe incorrect.';
  }
};
</script>

<style scoped>
input {
  border: 1px solid #4B5563;
  padding: 8px;
  width: 100%;
  border-radius: 4px;
  margin-bottom: 10px;
}

button {
  background-color: #3b82f6;
  color: white;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #2563eb;
}

body {
  background-color: #000; /* S'assure que tout le fond reste noir */
}
</style>
