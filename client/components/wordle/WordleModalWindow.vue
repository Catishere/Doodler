<template>
  <div class="overlay" @click="closeIf($event)">
    <div class="window-container">
      <div class="close" @click="close()">
        <b-icon-x-circle style="color: white" />
      </div>
      <div class="scrollable">
        <div class="container">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'nuxt-property-decorator';
import { BIconXCircle } from 'bootstrap-vue';

@Component({ components: { BIconXCircle } })
export default class WordleModalWindow extends Vue {
  @Emit()
  close() {
    return false;
  }

  closeIf(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('overlay'))
      this.close();
  }
}
</script>

<style scoped>
.overlay {
  position: absolute;
  margin: 0;
  left: 0;
  top: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}
.window-container {
  position: relative;
  display: block;
  width: 90%;
  max-width: 600px;
  height: 500px;
  max-height: 85%;
  padding: 2% 2%;
  border-radius: 15px;
  background-color: rgb(41, 41, 41);
}

@media screen and (max-width: 767px) {
  .window-container {
    height: 600px !important;
  }
}

.close {
  height: 5%;
}

.scrollable {
  width: 100%;
  height: 95%;
  display: block;
  overflow-y: auto;
}
</style>
