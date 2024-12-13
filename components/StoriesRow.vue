<template>
    <div class="w-full overflow-x-auto">
        <div class="flex gap-4 px-4 py-2">
            <!-- Bouton Ajouter une story -->
            <div class="flex flex-col items-center">
                <button 
                    @click="openStoryCreator"
                    class="w-16 h-16 rounded-full border-2 border-blue-500 flex items-center justify-center bg-blue-500 relative overflow-hidden"
                >
                    <Icon :icon="icons.plus" class="text-white text-2xl" />
                </button>
                <span class="text-white text-xs mt-1">Ajouter</span>
            </div>

            <!-- Stories existantes -->
            <div 
                v-for="(story, index) in stories" 
                :key="story.id"
                class="flex flex-col items-center cursor-pointer"
                @click="openStory(index)"
            >
                <div 
                    class="w-16 h-16 rounded-full border-2 p-[2px]"
                    :class="story.seen ? 'border-gray-500' : 'border-gradient-instagram'"
                >
                    <img 
                        :src="story.userImage" 
                        class="w-full h-full rounded-full object-cover"
                        :alt="story.userName"
                        @error="handleImageError"
                    />
                </div>
                <span class="text-white text-xs mt-1">{{ story.userName }}</span>
            </div>
        </div>

        <!-- Modal de création de story -->
        <div v-if="showCreator" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div class="bg-neutral-900 rounded-lg p-6 w-full max-w-md mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-white text-xl">Créer une story</h3>
                    <button @click="closeCreator" class="text-white hover:text-gray-300">
                        <Icon :icon="icons.close" class="text-2xl" />
                    </button>
                </div>

                <div class="space-y-4">
                    <!-- Aperçu de la caméra -->
                    <div v-if="showCamera" class="relative">
                        <button 
                            @click="stopCamera"
                            class="absolute top-2 right-2 bg-black/50 p-2 rounded-full z-10"
                        >
                            <Icon :icon="icons.close" class="text-white text-xl" />
                        </button>
                        <video
                            ref="videoRef"
                            autoplay
                            playsinline
                            muted
                            class="w-full h-[60vh] object-cover rounded-lg"
                        ></video>
                        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                            <button 
                                @click="switchCamera"
                                class="bg-white/20 p-2 rounded-full hover:bg-white/30"
                            >
                                <Icon :icon="icons.cameraFlip" class="text-white text-2xl" />
                            </button>
                            <button 
                                @click="takePhoto"
                                class="bg-white p-4 rounded-full hover:bg-gray-200"
                            >
                                <div class="w-4 h-4 rounded-full border-2 border-black"></div>
                            </button>
                        </div>
                    </div>

                    <!-- Prévisualisation de l'image -->
                    <div v-if="previewUrl && !showCamera" class="relative">
                        <img :src="previewUrl" class="w-full h-[60vh] object-cover rounded-lg" />
                        <button 
                            @click="clearSelectedFile"
                            class="absolute top-2 right-2 bg-black/50 p-1 rounded-full"
                        >
                            <Icon :icon="icons.delete" class="text-white" size="20" />
                        </button>
                    </div>

                    <!-- Options de création -->
                    <div v-if="!showCamera && !previewUrl" class="grid grid-cols-2 gap-4">
                        <button 
                            @click="initCamera"
                            class="flex flex-col items-center gap-2 p-8 border-2 border-gray-600 rounded-lg hover:border-gray-400"
                        >
                            <Icon :icon="icons.camera" class="text-white text-4xl" />
                            <span class="text-white text-lg">Caméra</span>
                        </button>

                        <button 
                            @click="triggerFileInput"
                            class="flex flex-col items-center gap-2 p-8 border-2 border-gray-600 rounded-lg hover:border-gray-400"
                        >
                            <input 
                                type="file" 
                                ref="fileInput" 
                                class="hidden" 
                                accept="image/*"
                                @change="handleFileSelect"
                            />
                            <Icon :icon="icons.image" class="text-white text-4xl" />
                            <span class="text-white text-lg">Galerie</span>
                        </button>
                    </div>

                    <!-- Bouton de publication -->
                    <div v-if="previewUrl" class="flex justify-center">
                        <button 
                            @click="createStory"
                            class="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700"
                        >
                            Publier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

// Configuration des icônes
const icons = {
    plus: 'mdi:plus',
    close: 'mdi:close',
    camera: 'mdi:camera',
    image: 'mdi:image',
    cameraFlip: 'mdi:camera-flip',
    delete: 'mdi:delete'
};

const emit = defineEmits(['storyCreated', 'openStory']);
const props = defineProps({
    stories: {
        type: Array,
        required: true
    }
});

// Refs pour la gestion de la caméra et des fichiers
const videoRef = ref(null);
const fileInput = ref(null);
const stream = ref(null);
const showCreator = ref(false);
const showCamera = ref(false);
const previewUrl = ref(null);
const selectedFile = ref(null);
const facingMode = ref('user');

// Fonctions de gestion de la modal
const openStoryCreator = () => {
    showCreator.value = true;
};

const closeCreator = () => {
    showCreator.value = false;
    stopCamera();
    clearSelectedFile();
};

// Gestion de la caméra
const initCamera = async () => {
    try {
        showCamera.value = true;
        await nextTick();

        const constraints = {
            video: {
                facingMode: facingMode.value,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        };

        stream.value = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.value) {
            videoRef.value.srcObject = stream.value;
            await videoRef.value.play();
            console.log('Caméra initialisée avec succès');
        }
    } catch (error) {
        console.error('Erreur caméra:', error);
        handleCameraError(error);
    }
};

const handleCameraError = (error) => {
    let message = 'Erreur lors de l\'accès à la caméra';
    
    if (error.name === 'NotAllowedError') {
        message = 'Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur';
    } else if (error.name === 'NotFoundError') {
        message = 'Aucune caméra n\'a été trouvée sur votre appareil';
    } else if (error.name === 'NotReadableError') {
        message = 'La caméra est peut-être utilisée par une autre application';
    }
    
    alert(message);
    showCamera.value = false;
};

const switchCamera = async () => {
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop());
    }
    facingMode.value = facingMode.value === 'user' ? 'environment' : 'user';
    await initCamera();
};

const stopCamera = () => {
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop());
        stream.value = null;
    }
    if (videoRef.value) {
        videoRef.value.srcObject = null;
    }
    showCamera.value = false;
};

// Gestion des photos
const takePhoto = () => {
    if (!videoRef.value) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.value.videoWidth;
    canvas.height = videoRef.value.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.value, 0, 0);
    
    previewUrl.value = canvas.toDataURL('image/jpeg');
    selectedFile.value = dataURLtoFile(previewUrl.value, 'camera-photo.jpg');
    stopCamera();
};

const clearSelectedFile = () => {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = null;
    selectedFile.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

// Gestion des fichiers
const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        previewUrl.value = URL.createObjectURL(file);
    }
};

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/150';
};

// Création de story
const createStory = () => {
    if (selectedFile.value) {
        const newStory = {
            id: Date.now(),
            userName: 'Karima LACENE',
            userImage: previewUrl.value,
            seen: false,
            items: [{
                id: Date.now(),
                type: 'image',
                media: previewUrl.value,
                timestamp: new Date().toISOString()
            }]
        };
        
        emit('storyCreated', newStory);
        closeCreator();
    }
};

const openStory = (index) => {
    emit('openStory', index);
};

// Utilitaires
const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

// Nettoyage
onUnmounted(() => {
    stopCamera();
    clearSelectedFile();
});
</script>

<style scoped>
.border-gradient-instagram {
    background: linear-gradient(white, white) padding-box,
                linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%) border-box;
}
</style>