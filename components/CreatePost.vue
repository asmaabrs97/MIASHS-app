<template>
    <div 
        v-if="isOpen"
        class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        @click="close"
    >
        <div 
            class="w-full max-w-2xl bg-neutral-900 rounded-xl overflow-hidden animate-slide-up"
            @click.stop
        >
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-800">
                <button @click="close">
                    <Icon name="mdi:close" color="#ffffff" size="24" />
                </button>
                <h2 class="text-white font-semibold">Create new post</h2>
                <button 
                    @click="sharePost"
                    :disabled="!canShare"
                    :class="[
                        'text-blue-500 font-semibold',
                        !canShare && 'opacity-50 cursor-not-allowed'
                    ]"
                >
                    Share
                </button>
            </div>

            <div class="flex h-[600px]">
                <!-- Left side - Image -->
                <div class="w-3/5 bg-black flex items-center justify-center relative">
                    <div v-if="!selectedImage" class="text-center p-8">
                        <Icon name="mdi:image-outline" size="64" color="#ffffff" class="mb-4" />
                        <h3 class="text-white text-xl font-semibold mb-4">Drag photos and videos here</h3>
                        <button 
                            @click="triggerFileInput"
                            class="instagram-button text-white px-6 py-2 rounded-lg font-semibold"
                        >
                            Select from computer
                        </button>
                        <input 
                            type="file" 
                            ref="fileInput" 
                            class="hidden" 
                            accept="image/*"
                            @change="handleFileSelect"
                        />
                    </div>
                    <img 
                        v-else 
                        :src="selectedImage" 
                        class="max-h-full max-w-full object-contain"
                    />
                    <button 
                        v-if="selectedImage"
                        @click="clearImage"
                        class="absolute top-4 right-4 bg-black/50 p-2 rounded-full"
                    >
                        <Icon name="mdi:close" color="#ffffff" size="20" />
                    </button>
                </div>

                <!-- Right side - Details -->
                <div class="w-2/5 border-l border-gray-800">
                    <!-- User info -->
                    <div class="p-4 flex items-center space-x-3">
                        <img 
                            :src="userImage" 
                            class="w-8 h-8 rounded-full"
                            alt="Profile"
                        />
                        <span class="text-white font-semibold">{{ userName }}</span>
                    </div>

                    <!-- Caption -->
                    <div class="p-4 border-t border-gray-800">
                        <textarea 
                            v-model="caption"
                            placeholder="Write a caption..."
                            class="w-full h-32 bg-transparent text-white resize-none focus:outline-none"
                            maxlength="2200"
                        ></textarea>
                        <div class="text-right text-gray-400 text-sm">
                            {{ caption.length }}/2,200
                        </div>
                    </div>

                    <!-- Location -->
                    <div class="p-4 border-t border-gray-800">
                        <input 
                            v-model="location"
                            type="text"
                            placeholder="Add location"
                            class="w-full bg-transparent text-white focus:outline-none"
                        />
                    </div>

                    <!-- Advanced settings -->
                    <div class="p-4 border-t border-gray-800">
                        <div class="flex items-center justify-between text-white mb-4">
                            <span>Hide likes and views</span>
                            <button 
                                @click="hideLikes = !hideLikes"
                                class="w-12 h-6 rounded-full relative"
                                :class="hideLikes ? 'bg-blue-600' : 'bg-gray-600'"
                            >
                                <div 
                                    class="absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform"
                                    :class="hideLikes ? 'translate-x-6' : 'translate-x-0.5'"
                                ></div>
                            </button>
                        </div>
                        <div class="flex items-center justify-between text-white">
                            <span>Turn off commenting</span>
                            <button 
                                @click="disableComments = !disableComments"
                                class="w-12 h-6 rounded-full relative"
                                :class="disableComments ? 'bg-blue-600' : 'bg-gray-600'"
                            >
                                <div 
                                    class="absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform"
                                    :class="disableComments ? 'translate-x-6' : 'translate-x-0.5'"
                                ></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
    isOpen: Boolean,
    userImage: {
        type: String,
        default: 'https://placekitten.com/100/100'
    },
    userName: {
        type: String,
        default: 'User'
    }
});

const emit = defineEmits(['close', 'create']);

// États
const fileInput = ref(null);
const selectedImage = ref(null);
const caption = ref('');
const location = ref('');
const hideLikes = ref(false);
const disableComments = ref(false);

// Computed
const canShare = computed(() => {
    return selectedImage.value !== null;
});

// Méthodes
const close = () => {
    emit('close');
};

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedImage.value = URL.createObjectURL(file);
    }
};

const clearImage = () => {
    if (selectedImage.value) {
        URL.revokeObjectURL(selectedImage.value);
    }
    selectedImage.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const sharePost = () => {
    if (!canShare.value) return;

    emit('create', {
        image: selectedImage.value,
        caption: caption.value,
        location: location.value,
        settings: {
            hideLikes: hideLikes.value,
            disableComments: disableComments.value
        }
    });

    // Reset form
    clearImage();
    caption.value = '';
    location.value = '';
    hideLikes.value = false;
    disableComments.value = false;
    close();
};
</script>

<style scoped>
textarea::placeholder,
input::placeholder {
    color: #6B7280;
}

textarea:focus,
input:focus {
    outline: none;
}

.animate-slide-up {
    animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
