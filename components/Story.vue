<template>
    <div class="w-full h-screen bg-black text-white">
        <!-- Header -->
        <div class="fixed top-0 w-full z-50 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                    <img 
                        :src="story.userImage" 
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                    />
                </div>
                <div class="flex flex-col">
                    <span class="text-sm font-semibold">{{ story.userName }}</span>
                    <span class="text-xs opacity-70">
                        {{ formatTimestamp(story.items[currentItemIndex].timestamp) }}
                    </span>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <button 
                    v-if="isCurrentUserStory"
                    @click="deleteStory" 
                    class="p-2 hover:bg-white/10 rounded-full"
                >
                    <Icon icon="mdi:delete" class="text-white text-xl" />
                </button>
                <button 
                    @click="closeStory" 
                    class="p-2 hover:bg-white/10 rounded-full"
                >
                    <Icon icon="mdi:close" class="text-white text-xl" />
                </button>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="fixed top-0 w-full z-40 p-2 flex gap-1">
            <div 
                v-for="(item, index) in story.items" 
                :key="index"
                class="h-0.5 bg-gray-500 flex-1 overflow-hidden"
            >
                <div 
                    class="h-full bg-white transition-all duration-100 ease-linear"
                    :style="{ 
                        width: index === currentItemIndex ? `${progress}%` : 
                               index < currentItemIndex ? '100%' : '0%'
                    }"
                ></div>
            </div>
        </div>

        <!-- Story Content -->
        <div class="relative w-full h-full flex items-center justify-center">
            <img 
                v-if="currentItem && currentItem.type === 'image'"
                :src="currentItem.media"
                class="w-full h-full object-contain"
                @load="startProgress"
                @error="handleImageError"
            />

            <!-- Navigation Areas -->
            <div class="absolute inset-0 flex">
                <!-- Previous -->
                <div 
                    class="w-1/3 h-full cursor-pointer" 
                    @click="previousItem"
                ></div>
                <!-- Pause/Play -->
                <div 
                    class="w-1/3 h-full cursor-pointer" 
                    @click="togglePause"
                ></div>
                <!-- Next -->
                <div 
                    class="w-1/3 h-full cursor-pointer" 
                    @click="nextItem"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useUserStore } from '~/stores/user';

const props = defineProps({
    story: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['close', 'next', 'previous', 'delete-story']);

const userStore = useUserStore();
const currentItemIndex = ref(0);
const progress = ref(0);
const isPaused = ref(false);
const progressInterval = ref(null);
const storyDuration = 5000; // 5 seconds per story
const progressIncrement = 100 / (storyDuration / 100); // Pour un progrès fluide

const currentItem = computed(() => {
    return props.story.items[currentItemIndex.value];
});

const isCurrentUserStory = computed(() => {
    return props.story.userName === userStore.currentUser.name;
});

const startProgress = () => {
    clearInterval(progressInterval.value);
    progress.value = 0;
    
    progressInterval.value = setInterval(() => {
        if (!isPaused.value) {
            progress.value += progressIncrement;
            
            if (progress.value >= 100) {
                nextItem();
            }
        }
    }, 100);
};

const togglePause = () => {
    isPaused.value = !isPaused.value;
};

const nextItem = () => {
    clearInterval(progressInterval.value);
    
    if (currentItemIndex.value < props.story.items.length - 1) {
        currentItemIndex.value++;
        startProgress();
    } else {
        emit('next');
    }
};

const previousItem = () => {
    clearInterval(progressInterval.value);
    
    if (currentItemIndex.value > 0) {
        currentItemIndex.value--;
        startProgress();
    } else {
        emit('previous');
    }
};

const closeStory = () => {
    clearInterval(progressInterval.value);
    emit('close');
};

const deleteStory = () => {
    if (confirm('Voulez-vous vraiment supprimer cette story ?')) {
        emit('delete-story');
    }
};

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/800x1200?text=Image+non+disponible';
};

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Moins d'une minute
    if (diff < 60000) {
        return 'À l\'instant';
    }
    // Moins d'une heure
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `Il y a ${minutes} min`;
    }
    // Moins d'un jour
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `Il y a ${hours}h`;
    }
    // Plus d'un jour
    const days = Math.floor(diff / 86400000);
    return `Il y a ${days}j`;
};

onMounted(() => {
    startProgress();
});

onUnmounted(() => {
    clearInterval(progressInterval.value);
});
</script>

<style scoped>
/* Ajoutez ici vos styles spécifiques si nécessaire */
</style>