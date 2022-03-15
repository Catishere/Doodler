<template>
  <div class="overlay" @click="closeIf($event)">
    <div class="window-container">
      <div class="scrollable">
        <div class="top-bar">
          <div class="close" @click="close()">
            <b-icon-x-circle style="color: white" />
          </div>
        </div>
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
.top-bar {
  margin: 5px;
}

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
  display: relative;
  width: 90%;
  max-width: 500px;
  height: 500px;
  max-height: 80%;
  padding-bottom: 20px;
  border-radius: 15px;
  background-color: rgb(41, 41, 41);
}

.scrollable {
  width: 100%;
  height: 100%;
  margin: 10px 0px;
  padding: 0 2%;
  display: relative;
  overflow-y: auto;
}
</style>
