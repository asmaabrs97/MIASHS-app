<template>
    <div v-if="post" class="z-50 bottom-0 h-full w-full">
        <!-- Système de notifications -->
        <div class="fixed top-4 right-4 z-50">
            <TransitionGroup name="notification">
                <div v-for="notification in notifications" :key="notification.id"
                    :class="[
                        'mb-2 p-4 rounded-lg shadow-lg min-w-[300px] flex items-center gap-2',
                        notification.type === 'success' ? 'bg-green-600' : 
                        notification.type === 'error' ? 'bg-red-600' : 
                        'bg-blue-600'
                    ]"
                >
                    <Icon :name="getNotificationIcon(notification.type)" color="#ffffff" size="20"/>
                    <span class="text-white">{{ notification.message }}</span>
                </div>
            </TransitionGroup>
        </div>

        <div class="py-2 w-full">
            <!-- En-tête du post -->
            <div class="flex items-center justify-between">
                <div class="flex items-center text-white">
                    <img class="rounded-full h-[35px]" :src="post.image" alt="User Image">
                    <div class="ml-2 font-semibold text-[18px]">{{ post.name }}</div>
                </div>
                <div @click="isMenu = !isMenu" class="relative">
                    <button 
                        :disabled="isDeleting"
                        class="flex items-center text-white p-1 h-[24px] w-[24px] hover:bg-gray-800 rounded-full cursor-pointer" 
                        :class="isMenu ? 'bg-gray-800' : ''"
                    >
                        <Icon v-if="!isDeleting" name="bi:three-dots" color="#ffffff" size="18" />
                        <Icon v-else name="eos-icons:bubble-loading" color="#ffffff" size="18" />
                    </button>
                    <div v-if="isMenu" class="absolute border border-gray-600 right-0 z-20 mt-1 rounded bg-black">
                        <button 
                            @click="startEditing" 
                            class="flex items-center rounded gap-2 text-white justify-between w-full pl-4 pr-3 py-2 hover:bg-gray-900"
                        >
                            <div>Modifier</div>
                            <Icon name="mdi:pencil" size="20" />
                        </button>
                        <button 
                            @click="showDeleteConfirm" 
                            class="flex items-center rounded gap-2 text-red-500 justify-between w-full pl-4 pr-3 py-2 hover:bg-gray-900"
                        >
                            <div>Supprimer</div>
                            <Icon name="solar:trash-bin-trash-broken" size="20" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Corps du post -->
            <div class="relative flex items-center w-full">
                <div class="w-[42px] mx-auto">
                    <div class="absolute ml-4 mt-1 top-0 w-[1px] bg-gray-700 h-full"></div>
                </div>
                <div class="bg-black rounded-lg w-[calc(100%-50px)] text-sm w-full font-light">
                    <!-- Mode édition -->
                    <div v-if="isEditing" class="py-2">
                        <textarea
                            v-model="editedText"
                            class="w-full bg-neutral-800 text-white rounded-lg p-3 min-h-[100px] resize-none"
                            placeholder="Modifier votre message..."
                        ></textarea>
                        <div class="flex justify-end gap-2 mt-2">
                            <button 
                                @click="cancelEdit"
                                class="px-4 py-2 text-gray-400 hover:text-white"
                            >
                                Annuler
                            </button>
                            <button 
                                @click="saveEdit"
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>

                    <!-- Affichage normal -->
                    <div v-else>
                        <div class="py-2 text-gray-300">{{ post.text }}</div>
                        <img 
                            v-if="post.picture"
                            class="mx-auto w-full mt-2 pr-2 rounded" 
                            :src="post.picture" 
                            alt="Post Image"
                        />
                    </div>

                    <!-- Boutons d'interaction -->
                    <div class="flex items-center gap-6 mt-4 ml-2">
                        <button 
                            :disabled="isLike"
                            @click="toggleLike"
                            class="flex items-center gap-2 hover:bg-gray-800 rounded-full p-2 transition-colors duration-200"
                            :class="{ 'text-pink-600 bg-gray-800/50': props.post.userHasLiked, 'text-gray-400': !props.post.userHasLiked }"
                        >
                            <Icon 
                                :name="props.post.userHasLiked ? 'mdi:heart' : 'mdi:heart-outline'"
                                :color="props.post.userHasLiked ? '#db2777' : '#ffffff'"
                                size="24"
                            />
                            <span :class="{ 'text-pink-600': props.post.userHasLiked, 'text-gray-400': !props.post.userHasLiked }">
                                {{ props.post.likes || 0 }}
                            </span>
                        </button>

                        <button 
                            @click="showCommentInput = true"
                            class="flex items-center gap-1"
                        >
                            <Icon 
                                class="p-1 text-white hover:bg-gray-800 rounded-full cursor-pointer" 
                                name="material-symbols:comment-outline" 
                                size="28"
                            />
                            <span class="text-sm text-gray-400">{{ post.comments?.length || 0 }}</span>
                        </button>

                        <!-- Bouton Partager -->
                        <button 
                            @click="showShareMenu = true"
                            class="flex items-center gap-1"
                        >
                            <Icon 
                                class="p-1 text-white hover:bg-gray-800 rounded-full cursor-pointer" 
                                name="material-symbols:share-outline" 
                                size="28"
                            />
                        </button>
                    </div>

                    <!-- Liste des commentaires -->
                    <div v-if="post.comments?.length > 0" class="mt-4 space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        <div v-for="comment in post.comments" :key="comment.id" class="flex items-start gap-2 ml-2">
                            <img class="rounded-full h-[25px]" :src="comment.userImage" alt="User Image">
                            <div v-if="!comment.isEditing" class="bg-neutral-900 rounded-lg p-2 flex-1 relative group">
                                <div class="text-white text-sm font-semibold">{{ comment.userName }}</div>
                                <div class="text-gray-300 text-sm">{{ comment.text }}</div>
                                <div v-if="comment.userName === userStore.currentUser.name" 
                                     class="hidden group-hover:block absolute top-2 right-2">
                                    <button 
                                        @click="toggleCommentMenu(comment.id)"
                                        class="text-gray-400 hover:text-white p-1"
                                    >
                                        <Icon name="bi:three-dots-vertical" size="16" />
                                    </button>
                                    
                                    <div v-if="comment.showMenu" class="absolute right-0 top-6 bg-neutral-800 border border-gray-700 rounded-lg shadow-lg z-10">
                                        <button 
                                            @click="editComment(comment)"
                                            class="flex items-center gap-2 w-full px-4 py-2 text-sm text-white hover:bg-neutral-700"
                                        >
                                            <Icon name="mdi:pencil" size="16" />
                                            Modifier
                                        </button>
                                        <button 
                                            @click="deleteComment(comment)"
                                            class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-neutral-700"
                                        >
                                            <Icon name="mdi:trash" size="16" />
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="flex-1">
                                <div class="flex items-center gap-2">
                                    <input 
                                        v-model="comment.editText"
                                        type="text"
                                        class="flex-1 bg-neutral-800 text-white rounded-full px-4 py-2 text-sm"
                                        @keyup.enter="saveCommentEdit(comment)"
                                    />
                                    <button 
                                        @click="saveCommentEdit(comment)"
                                        class="text-blue-500 hover:text-blue-400"
                                    >
                                        <Icon name="material-symbols:check" size="20" />
                                    </button>
                                    <button 
                                        @click="cancelCommentEdit(comment)"
                                        class="text-gray-500 hover:text-gray-400"
                                    >
                                        <Icon name="material-symbols:close" size="20" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Input nouveau commentaire -->
                    <div v-if="showCommentInput" class="mt-4 flex items-center gap-2 ml-2 mb-4">
                        <img class="rounded-full h-[30px]" :src="userStore.currentUser.image" alt="Current User">
                        <div class="flex-1 relative">
                            <input 
                                v-model="newComment"
                                type="text"
                                placeholder="Ajouter un commentaire..."
                                class="w-full bg-neutral-800 text-white rounded-full px-4 py-2 text-sm"
                                @keyup.enter="addComment"
                            />
                            <button 
                                @click="addComment"
                                class="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                                <Icon 
                                    name="material-symbols:send-rounded" 
                                    class="text-gray-400 hover:text-white"
                                    size="20" 
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de confirmation de suppression -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-neutral-900 rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-xl text-white font-semibold mb-4">Supprimer le post ?</h3>
                <p class="text-gray-300 mb-6">Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce post ?</p>
                <div class="flex justify-end gap-3">
                    <button 
                        @click="showDeleteModal = false"
                        class="px-4 py-2 text-gray-400 hover:text-white"
                    >
                        Annuler
                    </button>
                    <button 
                        @click="confirmDelete"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal de partage -->
        <div v-if="showShareMenu" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-neutral-900 rounded-lg p-6 max-w-md w-full mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl text-white font-semibold">Partager le post</h3>
                    <button @click="showShareMenu = false" class="text-gray-400 hover:text-white">
                        <Icon name="mdi:close" size="24" />
                    </button>
                </div>

                <div class="bg-neutral-800 rounded-lg p-3 mb-4">
                    <div class="flex items-center gap-2">
                        <input 
                            ref="shareInput"
                            type="text" 
                            :value="shareUrl"
                            readonly
                            class="w-full bg-transparent text-white border-none focus:outline-none text-sm"
                        />
                        <button 
                            @click="copyToClipboard"
                            class="text-blue-500 hover:text-blue-400 whitespace-nowrap text-sm"
                        >
                            {{ copied ? 'Copié !' : 'Copier' }}
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-4 gap-4">
                    <button 
                        v-for="option in shareOptions" 
                        :key="option.name"
                        @click="shareVia(option.name)"
                        class="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                        <Icon :name="option.icon" size="24" :class="option.color" />
                        <span class="text-white text-sm">{{ option.label }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const props = defineProps({
    post: {
        type: Object,
        required: true
    }
});
const emit = defineEmits(['isUpdated']);

// États
const isMenu = ref(false);
const isDeleting = ref(false);
const isLiking = ref(false);
const showCommentInput = ref(false);
const newComment = ref('');
const isEditing = ref(false);
const editedText = ref('');
const showDeleteModal = ref(false);
const notifications = ref([]);
const showShareMenu = ref(false);
const copied = ref(false);
const shareInput = ref(null);

// Computed
const hasLikedComputed = computed(() => {
    return props.post.userHasLiked || false;
});

const shareUrl = computed(() => {
    if (process.client) {
        return `${window.location.origin}/post/${props.post.id}`;
    }
    return '';
});

// Options de partage
const shareOptions = [
    {
        name: 'whatsapp',
        label: 'WhatsApp',
        icon: 'ri:whatsapp-fill',
        color: 'text-green-500',
        url: (text, url) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
    },
    {
        name: 'twitter',
        label: 'Twitter',
        icon: 'ri:twitter-fill',
        color: 'text-blue-400',
        url: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    },
    {
        name: 'facebook',
        label: 'Facebook',
        icon: 'ri:facebook-fill',
        color: 'text-blue-600',
        url: (text, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
        name: 'email',
        label: 'Email',
        icon: 'material-symbols:mail-outline',
        color: 'text-gray-400',
        url: (text, url) => `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`
    }
];

// Gestion des notifications
const addNotification = (message, type = 'info') => {
    const id = Date.now();
    notifications.value.push({ id, message, type });
    setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id);
    }, 3000);
};

const getNotificationIcon = (type) => {
    switch(type) {
        case 'success': return 'material-symbols:check-circle-outline';
        case 'error': return 'material-symbols:error-outline';
        default: return 'material-symbols:info-outline';
    }
};

// Gestion du post
const startEditing = () => {
    editedText.value = props.post.text;
    isEditing.value = true;
    isMenu.value = false;
};

const cancelEdit = () => {
    isEditing.value = false;
    editedText.value = '';
};

const saveEdit = () => {
    if (editedText.value.trim()) {
        const updatedPost = {
            ...props.post,
            text: editedText.value,
            editedAt: new Date().toISOString()
        };
        
        emit('isUpdated', updatedPost);
        isEditing.value = false;
        isMenu.value = false;
        addNotification('Post modifié avec succès', 'success');
    }
};

const showDeleteConfirm = () => {
    showDeleteModal.value = true;
    isMenu.value = false;
};

const confirmDelete = () => {
    emit('isDeleted', props.post.id);
    showDeleteModal.value = false;
    addNotification('Post supprimé', 'success');
};

// Gestion des likes
const toggleLike = () => {
    if (isLiking.value) return; // Empêche les clics multiples rapides
    
    isLiking.value = true;
    setTimeout(() => {
        isLiking.value = false;
    }, 500); // Délai de 500ms avant de permettre un nouveau like

    if (!props.post.likes) props.post.likes = 0;

    const newLikeState = !props.post.userHasLiked;
    const updatedPost = {
        ...props.post,
        likes: props.post.likes + (newLikeState ? 1 : -1),
        userHasLiked: newLikeState
    };

    emit('isUpdated', updatedPost);
};
// Gestion du partage
const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(shareUrl.value);
        copied.value = true;
        setTimeout(() => copied.value = false, 2000);
        addNotification('Lien copié dans le presse-papiers', 'success');
    } catch (err) {
        addNotification('Erreur lors de la copie du lien', 'error');
    }
};

const shareVia = (platform) => {
    const option = shareOptions.find(opt => opt.name === platform);
    if (option) {
        const text = `Découvrez ce post de ${props.post.name}`;
        const url = option.url(text, shareUrl.value);
        window.open(url, '_blank');
    }
    showShareMenu.value = false;
};

// Gestion des commentaires
const toggleCommentMenu = (commentId) => {
    if (!props.post.comments) return;
    props.post.comments = props.post.comments.map(comment => ({
        ...comment,
        showMenu: comment.id === commentId ? !comment.showMenu : false
    }));
};

const editComment = (comment) => {
    comment.isEditing = true;
    comment.editText = comment.text;
    comment.showMenu = false;
};

const saveCommentEdit = (comment) => {
    if (comment.editText?.trim()) {
        userStore.updateComment(props.post.id, comment.id, comment.editText);
        comment.isEditing = false;
        addNotification('Commentaire modifié', 'success');
    }
};

const cancelCommentEdit = (comment) => {
    comment.isEditing = false;
    comment.showMenu = false;
};

const deleteComment = (comment) => {
    if (confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
        userStore.deleteComment(props.post.id, comment.id);
        addNotification('Commentaire supprimé', 'success');
    }
};

const addComment = () => {
    if (newComment.value.trim()) {
        const comment = {
            text: newComment.value,
            userName: userStore.currentUser.name,
            userImage: userStore.currentUser.image
        };
        
        userStore.addCommentToPost(props.post.id, comment);
        newComment.value = '';
        showCommentInput.value = false;
        addNotification('Commentaire ajouté', 'success');
    }
};
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.group:hover .hidden {
    display: block;
}

.share-option {
    transition: all 0.2s ease;
}

.share-option:hover {
    transform: scale(1.05);
}

input::placeholder,
textarea::placeholder {
    color: #6B7280;
}

input:focus,
textarea:focus {
    outline: none;
    border-color: #4B5563;
}
</style>