<template>
  <div class="page-container">
    <navbar-component />
    <LoginRegister />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  name: 'RegisterPage'
})
export default class RegisterPage extends Vue {}
</script>

<style scoped>
.page-container {
  justify-content: flex-start;
  width: 100%;
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
}
</style>
