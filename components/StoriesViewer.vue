<template>
    <div class="fixed inset-0 bg-black z-50">
        <Story 
            v-if="currentStory"
            :story="currentStory"
            @close="closeStories"
            @next="nextUser"
            @previous="previousUser"
            @delete-story="deleteCurrentStory"
        />
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Story from './Story.vue';

const props = defineProps({
    stories: {
        type: Array,
        required: true
    },
    initialIndex: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['close', 'delete-story']);

const currentIndex = ref(props.initialIndex);

const currentStory = computed(() => props.stories[currentIndex.value]);

const closeStories = () => {
    emit('close');
};

const deleteCurrentStory = () => {
    if (currentStory.value) {
        emit('delete-story', currentStory.value.id);
    }
};

const nextUser = () => {
    if (currentIndex.value < props.stories.length - 1) {
        currentIndex.value++;
    } else {
        closeStories();
    }
};

const previousUser = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};

// Watch for stories array changes
watch(() => props.stories.length, (newLength) => {
    if (newLength === 0 || currentIndex.value >= newLength) {
        closeStories();
    }
});
</script>