<template>
  <wordle-modal-window @close="close()">
    <h1>Настройки</h1>
    <div class="settings">
      <wordle-setting :id="'keyboard-label'" :label="'Клавиатура:'">
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
      </wordle-setting>
      <wordle-setting :id="'hardmode-label'" :label="'Искам да ми е трудно:'">
        <b-form-checkbox
          v-model="isHardmode"
          class="setting-control"
          name="check-button"
          size="lg"
          switch
        />
      </wordle-setting>
      <wordle-setting
        :id="'colorblind-label'"
        :label="'Не различавам цветове:'"
      >
        <b-form-checkbox
          v-model="isColorblind"
          class="setting-control"
          name="check-button"
          size="lg"
          switch
        />
      </wordle-setting>
      <wordle-setting :id="'letindex-label'" :label="'Буквите да се цъкат:'">
        <b-form-checkbox
          v-model="isLetterIndexable"
          class="setting-control"
          name="check-button"
          size="lg"
          switch
        />
      </wordle-setting>
      <wordle-setting :id="'rush-label'" :label="'Пъзел ръш:'">
        <b-form-checkbox
          v-model="isRush"
          class="setting-control"
          name="check-button"
          size="lg"
          switch
        />
      </wordle-setting>
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
    <b-tooltip target="rush-label" triggers="hover">
      Веднага след приключването на сегашната дума се пуска нова. При успешно
      познаване на думата получаваш бонус време. Играта приключва, когато
      таймерът свърши.
    </b-tooltip>
  </wordle-modal-window>
</template>
<script lang="ts">
import { Component, Vue, Emit, Watch } from 'nuxt-property-decorator';
import {
  BFormGroup,
  BFormCheckbox,
  BFormRadioGroup,
  BIconXCircle,
  BTooltip
} from 'bootstrap-vue';
import WordleModalWindow from './ModalWindow.vue';
import WordleSetting from './Setting.vue';

@Component({
  components: {
    BFormGroup,
    BFormRadioGroup,
    BFormCheckbox,
    BIconXCircle,
    BTooltip,
    WordleModalWindow,
    WordleSetting
  }
})
export default class SettingsWindow extends Vue {
  layoutSelected: string = 'phonetic';
  ctrlSize: string = '';
  isHardmode: boolean = false;
  isColorblind: boolean = false;
  isLetterIndexable: boolean = false;
  isRush: boolean = false;

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
    this.isRush = localStorage.getItem('wordle-rush') === 'true';
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

  @Watch('isRush')
  onRushChange() {
    localStorage.setItem('wordle-rush', this.isRush.toString());
    this.$emit('rush-changed', this.isRush);
  }
}
</script>

<style scoped>
.settings {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
