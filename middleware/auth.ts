export default defineNuxtRouteMiddleware((to, from) => {
  const credentials = localStorage.getItem('credentials');

  // If user is not logged in and trying to access a protected route
  if (!credentials && to.path !== '/auth/login') {
    return navigateTo('/auth/login');
  }

  // If user is logged in and trying to access login page
  if (credentials && to.path === '/auth/login') {
    return navigateTo('/');
  }
});
