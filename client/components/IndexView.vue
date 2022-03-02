<!-- Please remove this file from your project -->
<template>
  <div>
    <navbar-component />
    <NuxtLink to="/wordle">
      About (internal link that belongs to the Nuxt App)
    </NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'IndexView'
};
</script>

<style scoped>
.index-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
