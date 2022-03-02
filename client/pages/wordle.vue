<template>
  <div class="page-container">
    <navbar-component />
    <WordleGame />
  </div>
</template>

<script lang="ts">
export default {
  name: 'WordlePage'
};
</script>

<style scoped>
.page-container {
  justify-content: center;
  width: 100%;
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
}
</style>
