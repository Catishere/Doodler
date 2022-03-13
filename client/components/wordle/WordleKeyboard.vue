<template>
  <div class="keyboard">
    <div
      v-for="(row, i) in keyboard"
      :key="i + '-keyboard-row'"
      class="keyboard-row"
    >
      <button
        v-for="letter in row"
        :key="letter"
        :class="
          (letter == '↵' || letter == '⌫'
            ? 'keyboard-key keyspecial'
            : 'keyboard-key') +
          ' ' +
          resolveType(letter)
        "
        @click="$emit('keyboard-press', { key: letter })"
      >
        {{ letter }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Prop, Component, Vue, Watch } from 'nuxt-property-decorator';
import {
  KeyboardLayouts,
  IIndexable
} from 'client/types/keyboard-layouts.type';

@Component({})
export default class WordleKeyboard extends Vue {
  @Prop({ default: [] })
  words!: String[][];

  @Prop({ default: [] })
  state!: String[][];

  @Prop({ default: false })
  render!: boolean;

  @Prop({ default: 'phonetic' })
  type!: boolean;

  keyboardLayouts: KeyboardLayouts = {
    phonetic: [
      ['я', 'в', 'е', 'р', 'т', 'ъ', 'у', 'и', 'о', 'п', 'ч'],
      ['а', 'с', 'д', 'ф', 'г', 'х', 'й', 'к', 'л', 'ш', 'щ'],
      ['↵', 'з', 'ь', 'ц', 'ж', 'б', 'н', 'м', 'ю', '⌫']
    ],
    alphabet: [
      ['а', 'б', 'в', 'г', 'д', 'е', 'ж', 'з', 'и', 'й', 'к'],
      ['л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х'],
      ['↵', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ь', 'ю', 'я', '⌫']
    ],
    bulstand: [
      ['у', 'е', 'и', 'ш', 'щ', 'к', 'с', 'д', 'з', 'ц', 'б'],
      ['ь', 'я', 'а', 'о', 'ж', 'г', 'т', 'н', 'в', 'м', 'ч'],
      ['↵', 'ю', 'й', 'ъ', 'ф', 'х', 'п', 'р', 'л', '⌫']
    ]
  };

  keyboard = this.keyboardLayouts.phonetic;

  beforeMount() {
    const type = localStorage.getItem('wordle-keyboard') || 'phonetic';
    this.keyboard = (this.keyboardLayouts as IIndexable)[type];
  }

  @Watch('type')
  onTypeChange(newValue: string) {
    newValue ||= 'phonetic';
    localStorage.setItem('wordle-keyboard', newValue);
    this.keyboard = (this.keyboardLayouts as IIndexable)[newValue];
  }

  resolveType(letter: string) {
    let type = '';
    const flatWords = this.words.flat();
    const flatState = this.state.flat();
    for (let i = 0; i < flatWords.length; i++) {
      if (flatWords[i] === letter) {
        if (flatState[i] === 'correct') return 'correct';
        if (flatState[i] === 'present') type = 'present';
        if (flatState[i] === 'absent' && type !== 'present') type = 'absent';
      }
    }
    return type;
  }
}
</script>

<style scoped>
.keyboard {
  flex-shrink: 0;
  margin-bottom: 58px;
  width: 100%;
  display: flex;
  align-items: center;
  align-self: flex-end;
  flex-direction: column;
}

@media screen and (max-width: 330px) {
  .keyboard {
    font-size: 0.6rem;
  }
}

.keyboard-row {
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: row;
}
.keyboard-key {
  border-radius: 4px;
  border: none;
  width: 40px;
  height: 50px;
  margin: 2.5px;
  background-color: rgb(95, 95, 95);
  color: rgb(211, 211, 211);
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
}

.correct {
  background-color: var(--color-correct);
}
.present {
  background-color: var(--color-present);
}
.absent {
  background-color: #3a3a3c;
}

.keyboard-key:active {
  filter: brightness(0.7);
}
.keyspecial {
  background-color: rgb(95, 95, 95);
  width: 63px;
}
</style>
