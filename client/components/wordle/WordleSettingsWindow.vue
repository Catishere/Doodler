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
          <h1>Настройки</h1>
          <b-form-group label="Подредба на клавиатурата:">
            <b-form-radio-group
              id="keyboard-radios"
              v-model="selected"
              :options="options"
              name="radios-btn-default"
              buttons
              @change="$emit('keyboard-changed', selected)"
            ></b-form-radio-group>
          </b-form-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'nuxt-property-decorator';
import { BFormGroup, BFormRadioGroup, BIconXCircle } from 'bootstrap-vue';

@Component({
  components: { BFormGroup, BFormRadioGroup, BIconXCircle }
})
export default class WordleSettingsWindow extends Vue {
  selected: string = 'phonetic';
  options = [
    { text: 'БГР', value: 'phonetic' },
    { text: 'АБВ', value: 'alphabet' },
    { text: 'БДС', value: 'bulstand' }
  ];

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
