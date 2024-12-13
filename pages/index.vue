<template>
    <MainLayout>
        <div id="IndexPage" class="w-full overflow-auto">
            <div class="mx-auto max-w-[500px] overflow-hidden">
                <!-- Section Stories -->
                <div class="mb-4">
                    <StoriesRow 
                        :stories="stories" 
                        @story-created="handleStoryCreated"
                        @open-story="openStoriesViewer"
                        @delete-story="deleteStory"
                    />
                </div>

                <!-- Section Posts -->
                <div id="Posts" class="px-4 max-w-[600px] mx-auto">
                    <client-only>
                        <div v-if="isLoading" class="mt-20 w-full flex items-center justify-center mx-auto">
                            <div class="text-white mx-auto flex flex-col items-center justify-center">
                                <Icon name="eos-icons:bubble-loading" size="50" color="#ffffff" />
                                <div class="w-full mt-1">Loading...</div>
                            </div>
                        </div>
                        <div v-if="!isLoading && !userStore.posts.length" class="mt-20 w-full flex items-center justify-center mx-auto">
                            <div class="text-white mx-auto flex flex-col items-center justify-center">
                                <Icon name="tabler:mood-empty" size="50" color="#ffffff" />
                                <div class="w-full">Make the first post!</div>
                            </div>
                        </div>
                    </client-only>
                    <div v-if="userStore.posts.length > 0" v-for="post in userStore.posts" :key="post.id" class="mb-4">
                        <Post 
                            :post="post" 
                            @isDeleted="removePost"
                            @isUpdated="updatePost"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Stories Viewer -->
        <StoriesViewer 
            v-if="showStoriesViewer"
            :stories="stories"
            :initial-index="currentStoryIndex"
            @close="closeStoriesViewer"
            @delete-story="deleteStory"
        />
    </MainLayout>
</template>

<script setup>
import MainLayout from '~/layouts/MainLayout.vue';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/stores/user';
import { Icon } from '@iconify/vue';
import Post from '~/components/Post.vue';

const userStore = useUserStore();
const isLoading = ref(true);
const stories = ref([]);
const showStoriesViewer = ref(false);
const currentStoryIndex = ref(0);

// Gestion des posts
const removePost = (postId) => {
    userStore.deletePost(postId);
};

const updatePost = (updatedPost) => {
    userStore.updatePost(updatedPost);
};

// Gestion des stories
const handleStoryCreated = (newStory) => {
    stories.value.unshift(newStory);
    saveStories();
};

const openStoriesViewer = (index) => {
    currentStoryIndex.value = index;
    showStoriesViewer.value = true;
};

const closeStoriesViewer = () => {
    showStoriesViewer.value = false;
};

const deleteStory = (storyId) => {
    if (confirm('Voulez-vous vraiment supprimer cette story ?')) {
        stories.value = stories.value.filter(story => story.id !== storyId);
        saveStories();
        showStoriesViewer.value = false;
        
        // Handle edge case when deleting the last story
        if (stories.value.length === 0) {
            currentStoryIndex.value = 0;
        } else if (currentStoryIndex.value >= stories.value.length) {
            currentStoryIndex.value = stories.value.length - 1;
        }
    }
};

const saveStories = () => {
    if (process.client) {
        localStorage.setItem('stories', JSON.stringify(stories.value));
    }
};

// Nettoyage des stories expirées
const cleanupExpiredStories = () => {
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const now = new Date().getTime();

    stories.value = stories.value.filter(story => {
        const storyTime = new Date(story.items[0].timestamp).getTime();
        return now - storyTime < twentyFourHours;
    });
    saveStories();
};

onMounted(() => {
    if (process.client) {
        // Chargement des posts
        const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
        userStore.setPosts(storedPosts);

        // Chargement des stories
        const storedStories = JSON.parse(localStorage.getItem('stories')) || [];
        stories.value = storedStories;
        
        isLoading.value = false;

        // Démarrage du nettoyage périodique des stories
        setInterval(cleanupExpiredStories, 60 * 60 * 1000);
    }
});
</script>

<style scoped>
.stories-container {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.stories-container::-webkit-scrollbar {
    display: none;
}
</style>