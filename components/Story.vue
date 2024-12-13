<template>
    <div class="w-full h-screen bg-black text-white">
        <!-- Header avec boutons -->
        <div class="fixed top-0 w-full z-50 bg-black/50 py-4">
            <!-- Barre de progression -->
            <div class="flex gap-1 px-4 mb-4">
                <div v-for="(item, index) in story.items" :key="index" class="h-[2px] flex-grow">
                    <div 
                        :class="[
                            'h-full bg-gray-500 transition-all duration-100',
                            currentIndex > index ? 'w-full' : 
                            currentIndex === index ? 'animate-progress' : 
                            'w-0'
                        ]"
                    ></div>
                </div>
            </div>

            <!-- En-tête avec boutons -->
            <div class="flex items-center justify-between px-4">
                <div class="flex items-center gap-2">
                    <img :src="story.userImage" class="w-8 h-8 rounded-full" />
                    <span class="font-semibold">{{ story.userName }}</span>
                    <span class="text-gray-400 text-sm">{{ formatTime(story.items[currentIndex].timestamp) }}</span>
                </div>
                <div class="flex items-center gap-4">
                    <!-- Bouton supprimer -->
                    <button 
                        v-if="story.userName === 'Karima LACENE'"
                        @click="handleDelete"
                        class="p-2 text-red-500 hover:text-red-400 transition-colors"
                    >
                        <Icon name="mdi:delete" size="24" />
                    </button>
                    <!-- Bouton fermer -->
                    <button 
                        @click="handleClose"
                        class="p-2 text-white hover:text-gray-300 transition-colors"
                    >
                        <Icon name="mdi:close" size="24" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Contenu de la story -->
        <div class="h-screen flex items-center justify-center">
            <img 
                :src="story.items[currentIndex].media" 
                class="max-h-screen w-full object-contain"
                @click="handleClick"
            />
        </div>

        <!-- Zones de navigation tactile -->
        <div class="fixed inset-0 flex" @click="handleClick">
            <div class="w-1/2" @click.stop="previousStory"></div>
            <div class="w-1/2" @click.stop="nextStory"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
    story: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['close', 'next', 'previous', 'delete-story']);

const currentIndex = ref(0);
let timer;

const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
};

const handleClose = () => {
    clearTimeout(timer);
    emit('close');
};

const handleDelete = () => {
    if (confirm('Voulez-vous vraiment supprimer cette story ?')) {
        emit('delete-story');
    }
};

const startTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        nextStory();
    }, 5000);
};

const nextStory = () => {
    if (currentIndex.value < props.story.items.length - 1) {
        currentIndex.value++;
        startTimer();
    } else {
        emit('next');
    }
};

const previousStory = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
        startTimer();
    } else {
        emit('previous');
    }
};

const handleClick = (event) => {
    const { clientX } = event;
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickPosition = clientX - left;
    
    if (clickPosition < width / 2) {
        previousStory();
    } else {
        nextStory();
    }
};

const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
        handleClose();
    }
};

onMounted(() => {
    startTimer();
    document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
    clearTimeout(timer);
    document.removeEventListener('keydown', handleEscapeKey);
});
</script>

<style scoped>
@keyframes progress {
    from { width: 0; }
    to { width: 100%; }
}

.animate-progress {
    animation: progress 5s linear;
    width: 100%;
}
</style>