<!-- Please remove this file from your project -->
<template>
  <nuxt-link to="/wordle">
    <b-button class="margin-top"> Към Думите </b-button>
  </nuxt-link>
</template>

<script lang="ts">
import { BButton } from 'bootstrap-vue';
import { Component, Vue } from 'nuxt-property-decorator';

@Component({ components: { BButton } })
export default class IndexView extends Vue {
  mounted() {}
}
</script>

<style scoped>
.margin-top {
  margin-top: 1rem;
}
.index-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
