import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    posts: [],
    stories: [],
    isMenuOverlay: false,
    isLogoutOverlay: false,
    currentUser: {
      name: 'Karima LACENE',
      image: '/karima.png'
    }
  }),

  actions: {
    addPost(post) {
      const newPost = {
        ...post,
        comments: [],
        likes: 0,
        userHasLiked: false
      };
      this.posts.unshift(newPost);
      if (process.client) {
        localStorage.setItem('posts', JSON.stringify(this.posts));
      }
    },

    setPosts(posts) {
      this.posts = posts.map(post => ({
        ...post,
        comments: post.comments || [],
        likes: post.likes || 0,
        userHasLiked: post.userHasLiked || false
      }));
      if (process.client) {
        localStorage.setItem('posts', JSON.stringify(this.posts));
      }
    },

    updatePost(updatedPost) {
      const index = this.posts.findIndex(post => post.id === updatedPost.id);
      if (index !== -1) {
          this.posts[index] = {
              ...this.posts[index],
              ...updatedPost,
              comments: updatedPost.comments || this.posts[index].comments || [],
              likes: updatedPost.likes || 0,
              userHasLiked: updatedPost.userHasLiked
          };
          if (process.client) {
              localStorage.setItem('posts', JSON.stringify(this.posts));
          }
      }
    },
    

    deletePost(postId) {
      this.posts = this.posts.filter(post => post.id !== postId);
      if (process.client) {
        localStorage.setItem('posts', JSON.stringify(this.posts));
      }
    },

    updatePostLikes(postId, increment) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        if (!post.likes) post.likes = 0;
        post.likes += increment ? 1 : -1;
        post.userHasLiked = increment;
        if (process.client) {
          localStorage.setItem('posts', JSON.stringify(this.posts));
        }
      }
    },

    addCommentToPost(postId, comment) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        if (!post.comments) post.comments = [];
        const newComment = {
          id: Date.now(),
          ...comment,
          timestamp: new Date().toISOString(),
          isEditing: false,
          showMenu: false,
          editText: ''
        };
        post.comments.push(newComment);
        if (process.client) {
          localStorage.setItem('posts', JSON.stringify(this.posts));
        }
      }
    },

    updateComment(postId, commentId, newText) {
      const post = this.posts.find(p => p.id === postId);
      if (post && post.comments) {
        const comment = post.comments.find(c => c.id === commentId);
        if (comment) {
          comment.text = newText;
          comment.editedAt = new Date().toISOString();
          if (process.client) {
            localStorage.setItem('posts', JSON.stringify(this.posts));
          }
        }
      }
    },

    deleteComment(postId, commentId) {
      const post = this.posts.find(p => p.id === postId);
      if (post && post.comments) {
        post.comments = post.comments.filter(c => c.id !== commentId);
        if (process.client) {
          localStorage.setItem('posts', JSON.stringify(this.posts));
        }
      }
    },

    // Stories management
    addStory(story) {
      this.stories.unshift({
        ...story,
        userImage: this.currentUser.image,
        userName: this.currentUser.name,
        items: story.items.map(item => ({
          ...item,
          media: item.media || ''
        }))
      });
      if (process.client) {
        localStorage.setItem('stories', JSON.stringify(this.stories));
      }
    },

    setStories(stories) {
      this.stories = stories;
      if (process.client) {
        localStorage.setItem('stories', JSON.stringify(stories));
      }
    },

    deleteStory(storyId) {
      this.stories = this.stories.filter(story => story.id !== storyId);
      if (process.client) {
        localStorage.setItem('stories', JSON.stringify(this.stories));
      }
    },

    markStorySeen(storyId) {
      const story = this.stories.find(s => s.id === storyId);
      if (story) {
        story.seen = true;
        if (process.client) {
          localStorage.setItem('stories', JSON.stringify(this.stories));
        }
      }
    },

    initializeStore() {
      if (process.client) {
        const savedPosts = localStorage.getItem('posts');
        if (savedPosts) {
          this.posts = JSON.parse(savedPosts);
        }
        const savedStories = localStorage.getItem('stories');
        if (savedStories) {
          this.stories = JSON.parse(savedStories);
        }
      }
    }
  }
});