<template>
  <wordle-modal-window @close="close()">
    <h1>Настройки</h1>
    <div class="settings">
      <div class="setting">
        <div id="keyboard-label" class="setting-title">Клавиатура:</div>
        <b-form-group class="setting-control">
          <b-form-radio-group
            id="keyboard-radios"
            v-model="layoutSelected"
            :class="ctrlSize"
            :options="layoutOptions"
            name="radios-btn-default"
            buttons
          />
        </b-form-group>
      </div>
      <div class="setting">
        <div id="hardmode-label" class="setting-title">
          Искам да ми е трудно:
        </div>
        <b-form-checkbox
          v-model="isHardmode"
          class="setting-control"
          name="check-button"
          size="lg"
          switch
        />
      </div>
      <div class="setting">
        <div id="colorblind-label" class="setting-title">
          Не различавам цветове:
        </div>
        <b-form-checkbox
          v-model="isColorblind"
          class="setting-control"
          name="check-button"
          size="lg"
          switch
        />
      </div>
      <div class="setting">
        <div id="letindex-label" class="setting-title">
          Буквите да се цъкат:
        </div>
        <b-form-checkbox
          v-model="isLetterIndexable"
          class="setting-control"
          name="check-button"
          size="lg"
          switch
        />
      </div>
    </div>
    <b-tooltip target="keyboard-label" triggers="hover">
      Подреба на клавиатурата
    </b-tooltip>
    <b-tooltip target="hardmode-label" triggers="hover">
      Всяка подсказка трябва да се използва в следващите опити
    </b-tooltip>
    <b-tooltip target="colorblind-label" triggers="hover">
      Цветовете са по-подходящи за хора с далтонизъм
    </b-tooltip>
    <b-tooltip target="letindex-label" triggers="hover">
      Позволява натискането на квадратчетата за смяна на позицията на писане
    </b-tooltip>
  </wordle-modal-window>
</template>
<script lang="ts">
import { Component, Vue, Emit, Watch } from 'nuxt-property-decorator';
import {
  BFormGroup,
  BFormRadioGroup,
  BIconXCircle,
  BTooltip
} from 'bootstrap-vue';
import WordleModalWindow from './WordleModalWindow.vue';

@Component({
  components: {
    BFormGroup,
    BFormRadioGroup,
    BIconXCircle,
    BTooltip,
    WordleModalWindow
  }
})
export default class WordleSettingsWindow extends Vue {
  layoutSelected: string = 'phonetic';
  ctrlSize: string = '';
  isHardmode: boolean = false;
  isColorblind: boolean = false;
  isLetterIndexable: boolean = false;

  layoutOptions = [
    { text: 'БГР', value: 'phonetic' },
    { text: 'АБВ', value: 'alphabet' },
    { text: 'БДС', value: 'bulstand' }
  ];

  beforeMount() {
    if (window.innerWidth < 340) this.ctrlSize = 'btn-group-sm';
  }

  mounted() {
    this.layoutSelected = localStorage.getItem('wordle-keyboard') || 'phonetic';
    this.isHardmode = localStorage.getItem('wordle-hardmode') === 'true';
    this.isColorblind = localStorage.getItem('wordle-colorblind') === 'true';
    this.isLetterIndexable = localStorage.getItem('wordle-letindex') === 'true';
  }

  @Emit()
  close() {
    return false;
  }

  @Watch('isColorblind')
  onColorblindChanged() {
    localStorage.setItem('wordle-colorblind', this.isColorblind.toString());
    const root = document.querySelector(':root') as HTMLElement;
    if (!root) return;

    if (this.isColorblind) {
      root.style.setProperty('--color-correct', 'var(--orange)');
      root.style.setProperty('--color-present', 'var(--blue)');
    } else {
      root.style.setProperty('--color-correct', 'var(--green)');
      root.style.setProperty('--color-present', 'var(--darkendYellow)');
    }
  }

  @Watch('isHardmode')
  onHardmodeChange() {
    localStorage.setItem('wordle-hardmode', this.isHardmode.toString());
    this.$emit('hardmode-changed', this.isHardmode);
  }

  @Watch('layoutSelected')
  onLayoutChange() {
    localStorage.setItem('wordle-keyboard', this.layoutSelected);
    this.$emit('keyboard-changed', this.layoutSelected);
  }

  @Watch('isLetterIndexable')
  onLetterIndexableChange() {
    localStorage.setItem('wordle-letindex', this.isLetterIndexable.toString());
    this.$emit('letindex-changed', this.isLetterIndexable);
  }
}
</script>

<style scoped>
.top-bar {
  margin: 5px;
}

.settings {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

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
