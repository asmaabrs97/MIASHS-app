<template>
    <div class="min-h-screen bg-black flex items-center justify-center">
        <div class="text-white text-center">
            <Icon 
                icon="eos-icons:bubble-loading" 
                class="animate-spin" 
                width="50" 
                height="50" 
            />
            <p class="mt-4">Authentification en cours...</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/user';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    console.log('Code reçu:', code);
    console.log('State reçu:', state);

    const savedState = localStorage.getItem('oauth_state');
    if (state !== savedState) {
        console.error('État invalide');
        router.push('/');
        return;
    }

    try {
        const { user } = await $fetch('/api/auth/github', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: { code }
        });

        if (!user) {
            throw new Error('Aucune donnée utilisateur reçue');
        }

        await userStore.setUser(user);
        router.push('/');
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        userStore.setError(error.message || 'Erreur d\'authentification');
        router.push('/');
    } finally {
        localStorage.removeItem('oauth_state');
        userStore.loading = false;
    }
});
</script>

<style scoped>
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>