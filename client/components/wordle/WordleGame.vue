<template>
  <div class="game-container">
    <div class="buttons">
      <button class="btn btn-dark" @click="fetchNewWord()">Нова дума</button>
      <button class="btn btn-dark" @click="showStats = true">
        <b-icon-bar-chart-fill />
      </button>
    </div>
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
    <transition name="fade" mode="">
      <wordle-end-window
        v-show="showStats"
        :stats="stats"
        @copy="shareResults()"
        @close="showStats = false"
      />
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { BIconBarChartFill } from 'bootstrap-vue';
import { getWordsModule } from '../../store';
import WordStats from '../../types/word-stats.type';

@Component({ components: { BIconBarChartFill } })
export default class WordleGame extends Vue {
  [x: string]: any;
  id: string = '';
  isChecking: boolean = false;
  showStats: boolean = false;
  isWin: boolean = false;
  updateKeyboard: boolean = false;
  stats: WordStats = {} as WordStats;

  mounted() {
    this.loadStats();
    if (localStorage.getItem('game-info')) {
      this.loadBoard();
      const currRow = this.row === 0 ? 0 : this.row - 1;
      setTimeout(() => {
        this.isWin = this.states[currRow].every((el) => el === 'correct');
        this.showStats = this.isWin || currRow >= 5;
      }, 500);
    } else if (localStorage.getItem('wordle-word') === null) {
      this.fetchNewWord();
    }
  }

  async beforeMount() {
    if (localStorage.getItem('wordle-id')) {
      this.id = localStorage.getItem('wordle-id') ?? '';
    } else {
      const user = await this.$axios.$post('/api/user/join');
      localStorage.setItem('wordle-id', user._id);
      this.id = user._id;
    }

    window.addEventListener('keydown', this.onKeyPress);
  }

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyPress);
  }

  shareResults() {
    let grid: string = 'Doodler ' + this.row + '/6\n';
    for (let i = 0; i < this.row; i++) {
      this.states[i].forEach((el) => {
        switch (el) {
          case 'correct':
            grid += '🟩';
            break;
          case 'present':
            grid += '🟨';
            break;
          case 'absent':
            grid += '⬛';
            break;
        }
      });
      grid += '\n';
    }
    navigator.clipboard.writeText(grid);
  }

  async fetchNewWord() {
    this.isWin = false;
    this.showStats = false;
    localStorage.removeItem('game-info');
    try {
      this.setWordKey(
        await this.$axios.$get('/api/word/random', {
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

  saveStats() {
    this.stats.games++;
    if (this.isWin) this.stats.wins++;
    this.stats.streak = this.isWin ? this.stats.streak + 1 : 0;
    this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.streak);
    this.stats.solves[this.row]++;
    this.stats.lastTry = this.isWin ? this.row : -1;
    localStorage.setItem('wordle-stat', JSON.stringify(this.stats));
  }

  loadBoard() {
    const gameInfo = JSON.parse(localStorage.getItem('game-info') ?? '{}');
    this.setRow(gameInfo.row);
    this.setWords(gameInfo.words);
    this.setStates(gameInfo.states);
  }

  loadStats() {
    this.stats = JSON.parse(
      localStorage.getItem('wordle-stat') ??
        '{"games": 0, "wins": 0, "streak": 0, "maxStreak": 0, "solves": [0, 0, 0, 0, 0, 0]}'
    );
  }

  async onKeyPress(event: KeyboardEvent) {
    if (this.isWin) return;
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

      const response = await this.$axios.$post('/api/word/guess', {
        _id: localStorage.getItem('wordle-id'),
        word: JSON.parse(localStorage.getItem('wordle-word') ?? '{}').word,
        guess: this.words[this.row].join('')
      });

      if (response.error !== undefined) return;
      const result = response.data;
      this.words[rowCopy].forEach((_, i) => {
        this.flipInOut({ row: rowCopy, col: i, result: result[i] });
      });

      this.isWin = result.every((el: string) => el === 'correct');
      if (this.isWin || rowCopy >= 5) {
        this.saveStats();
        this.showStats = true;
      }

      this.incrementRow();
      this.setCol(0);
      setTimeout(() => {
        this.saveBoard();
      }, 2500);
    } else if (
      (event.key === 'Backspace' || event.key === '⌫') &&
      this.col > 0 &&
      this.row < 6
    ) {
      this.eraseLetter();
      this.incrementCol(-1);
    }
  }

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
}
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

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

.buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 50%;
  padding: 5px 0px;
  position: relative;
  z-index: 1;
}

.grid {
  display: grid;
  width: 100%;
  max-width: 500px;
  padding: 0 25px;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px 5px;
}
</style>
