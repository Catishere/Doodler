<template>
  <div class="page-container">
    <navbar-component />
    <Login />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  name: 'LoginPage'
})
export default class LoginPage extends Vue {}
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
