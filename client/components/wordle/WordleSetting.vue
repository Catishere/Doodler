<template>
  <div class="setting">
    <div :id="id" class="setting-title">{{ label }}</div>
    <slot class="setting-control"></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({})
export default class WordleSetting extends Vue {
  @Prop({ default: 'default-setting-id' })
  id!: string;

  @Prop({ default: 'Default Label: ' })
  label!: string;
}
</script>

<style scoped>
.setting {
  margin-top: 10px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-direction: row;
}

.setting-title {
  display: flex;
  font-size: 1rem;
  font-weight: bold;
}

.setting-control {
  display: flex;
}
</style>
