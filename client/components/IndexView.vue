<!-- Please remove this file from your project -->
<template>
  <div>
    {{ data }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class IndexView extends Vue {
  data: string = '';
}
</script>

<style scoped>
.index-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
