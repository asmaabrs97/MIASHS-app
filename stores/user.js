import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    posts: [],
    isMenuOverlay: false,
    isLogoutOverlay: false,
    currentUser: {
      name: 'Karima LACENE',
      image: '/karima.png'
    }
  }),

  actions: {
    addPost(post) {
      this.posts.unshift(post)
      if (process.client) {
        localStorage.setItem('posts', JSON.stringify(this.posts))
      }
    },

    setPosts(posts) {
      this.posts = posts
      if (process.client) {
        localStorage.setItem('posts', JSON.stringify(posts))
      }
    },

    updatePost(updatedPost) {
      const index = this.posts.findIndex(post => post.id === updatedPost.id)
      if (index !== -1) {
        this.posts[index] = updatedPost
        if (process.client) {
          localStorage.setItem('posts', JSON.stringify(this.posts))
        }
      }
    },

    deletePost(postId) {
      this.posts = this.posts.filter(post => post.id !== postId)
      if (process.client) {
        localStorage.setItem('posts', JSON.stringify(this.posts))
      }
    },

    updatePostLikes(postId, increment) {
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        if (!post.likes) post.likes = 0
        post.likes += increment ? 1 : -1
        post.userHasLiked = increment
        localStorage.setItem('posts', JSON.stringify(this.posts))
      }
    },

    addCommentToPost(postId, comment) {
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        if (!post.comments) post.comments = []
        post.comments.push(comment)
        localStorage.setItem('posts', JSON.stringify(this.posts))
      }
    }
  }
})