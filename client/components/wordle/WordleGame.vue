<template>
  <div class="game-container">
    <button class="margin-top btn btn-primary" @click="fetchNewWord()">
      Нова дума
    </button>
    <div class="grid">
      <wordle-letter
        v-for="(letter, letter_id) in words.flat()"
        :ref="letter_id + '-letter'"
        :key="letter_id + '-letter'"
        :state="states[Math.floor(letter_id / 5)][letter_id % 5]"
        :animation="animations[Math.floor(letter_id / 5)][letter_id % 5]"
        :letter="letter"
      />
    </div>
    <wordle-keyboard
      :words="words"
      :state="states"
      :render="updateKeyboard"
      @keyboard-press="(key) => onKeyPress(key)"
    />
    <wordle-end-window v-show="success" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { getWordsModule } from '../../store';

@Component
export default class WordleGame extends Vue {
  id: string = '';
  isChecking: boolean = false;
  success: boolean = false;
  updateKeyboard: boolean = false;

  get states() {
    return getWordsModule(this.$store).states;
  }

  get words() {
    return getWordsModule(this.$store).words;
  }

  get animations() {
    return getWordsModule(this.$store).animations;
  }

  get col() {
    return getWordsModule(this.$store).col;
  }

  get row() {
    return getWordsModule(this.$store).row;
  }

  get wordKey() {
    return getWordsModule(this.$store).wordKey;
  }

  mounted() {
    if (localStorage.getItem('game-info')) {
      this.loadBoard();
      const currRow = this.row === 0 ? 0 : this.row - 1;
      this.success = this.states[currRow].every((el) => el === 'correct');
    } else this.fetchNewWord();
  }

  async beforeMount() {
    if (localStorage.getItem('wordle-id')) {
      this.id = localStorage.getItem('wordle-id') ?? '';
    } else {
      const user = await this.$axios.$post('/user/join');
      localStorage.setItem('wordle-id', user._id);
    }

    window.addEventListener('keydown', this.onKeyPress);
  }

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyPress);
  }

  setRow(row: number): void {
    getWordsModule(this.$store).setRow(row);
  }

  setCol(col: number): void {
    getWordsModule(this.$store).setCol(col);
  }

  incrementCol(col: number = 1): void {
    getWordsModule(this.$store).incrementCol(col);
  }

  incrementRow(row: number = 1): void {
    getWordsModule(this.$store).incrementRow(row);
  }

  eraseLetter(): void {
    getWordsModule(this.$store).eraseLetter();
  }

  addLetter(key: string): void {
    getWordsModule(this.$store).addLetter(key);
  }

  setWords(words: string[][]): void {
    getWordsModule(this.$store).setWords(words);
  }

  setStates(states: string[][]): void {
    getWordsModule(this.$store).setStates(states);
  }

  setAnimations(animations: string[][]): void {
    getWordsModule(this.$store).setAnimations(animations);
  }

  setWordKey(wordKey: string): void {
    getWordsModule(this.$store).setWordKey(wordKey);
  }

  changeStateDelayed(data: {
    row: number;
    col: number;
    state: string;
    time: number;
  }) {
    getWordsModule(this.$store).changeStateDelayed(data);
  }

  changeAnimationDelayed(data: {
    row: number;
    col: number;
    animation: string;
    time: number;
  }) {
    getWordsModule(this.$store).changeAnimationDelayed(data);
  }

  flipInOut(data: { row: number; col: number; result: string }): void {
    getWordsModule(this.$store).flipInOut(data);
  }

  async fetchNewWord() {
    localStorage.removeItem('game-info');
    try {
      this.setWordKey(
        await this.$axios.$get('/word/random', {
          params: {
            _id: this.id
          }
        })
      );
      localStorage.setItem('wordle-word', JSON.stringify(this.wordKey));
      this.setRow(0);
      this.setCol(0);
      this.setStates([
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty']
      ]);
      this.setWords([
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ']
      ]);
    } catch (e) {
      console.error(e);
    }
  }

  saveBoard() {
    localStorage.setItem(
      'game-info',
      JSON.stringify({
        row: this.row,
        words: this.words,
        states: this.states
      })
    );
  }

  loadBoard() {
    const gameInfo = JSON.parse(localStorage.getItem('game-info') ?? '{}');
    this.setRow(gameInfo.row);
    this.setWords(gameInfo.words);
    this.setStates(gameInfo.states);
  }

  async onKeyPress(event: KeyboardEvent) {
    if (event.key >= 'а' && event.key <= 'я' && this.col < 5 && this.row < 6) {
      const currRow = this.row;
      this.updateKeyboard = !this.updateKeyboard;
      const currCol = this.col;
      this.animations[currRow][currCol] = 'pop';
      setTimeout(() => {
        this.animations[currRow][currCol] = 'idle';
      }, 200);
      this.addLetter(event.key);
      this.incrementCol();
    } else if (
      (event.key === 'Enter' || event.key === '↵') &&
      this.col === 5 &&
      this.isChecking === false
    ) {
      this.isChecking = true;
      const rowCopy = this.row;

      setTimeout(() => {
        this.isChecking = false;
      }, 500);

      setTimeout(() => {
        this.success = this.states[rowCopy].every((el) => el === 'correct');
      }, 3000);

      const response = await this.$axios.$post('/word/guess', {
        _id: localStorage.getItem('wordle-id'),
        word: JSON.parse(localStorage.getItem('wordle-word') ?? '{}').word,
        guess: this.words[this.row].join('')
      });

      if (response.error !== undefined) return;
      const result = response.data;
      this.words[rowCopy].forEach((_, i) => {
        this.flipInOut({ row: rowCopy, col: i, result: result[i] });
      });
      this.incrementRow();
      this.setCol(0);
    } else if (
      (event.key === 'Backspace' || event.key === '⌫') &&
      this.col > 0 &&
      this.row < 6
    ) {
      this.eraseLetter();
      this.incrementCol(-1);
    }
  }
}
</script>
<style scoped>
.game-container {
  justify-content: center;
  width: 100%;
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
.grid {
  display: grid;
  margin-top: 50px;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px 5px;
}

.margin-top {
  margin-top: 20px;
}
</style>
