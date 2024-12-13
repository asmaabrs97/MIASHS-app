<template>
    <div class="max-w-[600px] mx-auto">
        <!-- Liste des posts -->
        <div class="space-y-4 mb-6">
            <div v-for="post in displayedPosts" :key="post.id" class="border-b border-gray-800 last:border-none">
                <Post 
                    :post="post" 
                    @isDeleted="handlePostDelete" 
                    @isUpdated="handlePostUpdate"
                />
            </div>
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading" class="flex justify-center py-4">
            <div class="w-8 h-8 rounded-full border-2 border-t-blue-500 animate-spin"></div>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && totalPages > 1" class="sticky bottom-0 bg-black bg-opacity-95 px-4 py-3 border-t border-gray-800">
            <div class="flex justify-between items-center max-w-[400px] mx-auto">
                <!-- Bouton Précédent -->
                <button 
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors"
                    :class="currentPage === 1 ? 'text-gray-600' : 'text-white hover:bg-gray-800'"
                >
                    <Icon name="mdi:chevron-left" size="20" />
                    <span class="hidden sm:inline">Précédent</span>
                </button>

                <!-- Pages -->
                <div class="flex items-center gap-2">
                    <template v-for="pageNum in paginationRange" :key="pageNum">
                        <span v-if="pageNum === '...'" class="text-gray-600 px-2">...</span>
                        <button 
                            v-else
                            @click="goToPage(pageNum)"
                            class="w-8 h-8 rounded-full text-sm flex items-center justify-center transition-colors"
                            :class="currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'"
                        >
                            {{ pageNum }}
                        </button>
                    </template>
                </div>

                <!-- Bouton Suivant -->
                <button 
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors"
                    :class="currentPage === totalPages ? 'text-gray-600' : 'text-white hover:bg-gray-800'"
                >
                    <span class="hidden sm:inline">Suivant</span>
                    <Icon name="mdi:chevron-right" size="20" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Post from './Post.vue';

// États
const posts = ref([
    // Exemple de données (à remplacer par vos propres données)
    {
        id: 1,
        name: "John Doe",
        text: "Premier post de test",
        image: "/path/to/avatar.jpg",
        likes: 5,
        userHasLiked: false
    },
    // Ajoutez plus de posts pour tester
]);

const currentPage = ref(1);
const postsPerPage = 5;
const loading = ref(false);

// Computed Properties
const totalPages = computed(() => Math.ceil(posts.value.length / postsPerPage));

const displayedPosts = computed(() => {
    const start = (currentPage.value - 1) * postsPerPage;
    const end = start + postsPerPage;
    return posts.value.slice(start, end);
});

const paginationRange = computed(() => {
    const range = [];
    const maxVisible = 5;
    
    if (totalPages.value <= maxVisible) {
        for (let i = 1; i <= totalPages.value; i++) {
            range.push(i);
        }
    } else {
        range.push(1);
        
        if (currentPage.value > 3) {
            range.push('...');
        }
        
        const start = Math.max(2, currentPage.value - 1);
        const end = Math.min(totalPages.value - 1, currentPage.value + 1);
        
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        
        if (currentPage.value < totalPages.value - 2) {
            range.push('...');
        }
        
        range.push(totalPages.value);
    }
    
    return range;
});

// Méthodes
const goToPage = (page) => {
    currentPage.value = page;
    scrollToTop();
};

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        scrollToTop();
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        scrollToTop();
    }
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handlePostDelete = (postId) => {
    posts.value = posts.value.filter(post => post.id !== postId);
    
    // Si la page actuelle est vide après suppression, revenir à la page précédente
    if (displayedPosts.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
    }
};

const handlePostUpdate = (updatedPost) => {
    const index = posts.value.findIndex(post => post.id === updatedPost.id);
    if (index !== -1) {
        posts.value[index] = updatedPost;
    }
};
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

/* Style pour la transition des pages */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .pagination-text {
        display: none;
    }
}
</style>
