<template>
  <div class="game-container">
    <div class="buttons">
      <button class="btn btn-dark" @click="fetchNewWord($event)">
        Нова дума
      </button>
      <button class="btn btn-dark" @click="showStats = true">
        <b-icon-bar-chart-fill />
      </button>
      <button class="btn btn-dark" @click="showSettings = true">
        <b-icon-gear-fill />
      </button>
    </div>
    <div id="grid" class="grid">
      <div
        v-for="(row, row_id) in words"
        :key="row_id + '-row'"
        :class="'grid-row ' + rowAnimations[row_id]"
      >
        <wordle-letter
          v-for="(letter, letter_id) in row"
          :ref="letter_id + '-letter'"
          :key="letter_id + '-letter'"
          :state="states[row_id][letter_id]"
          :animation="animations[row_id][letter_id]"
          :letter="letter"
        />
      </div>
    </div>
    <wordle-keyboard
      :words="words"
      :state="states"
      :render="updateKeyboard"
      :type="keyboardType"
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
    <transition name="fade" mode="">
      <wordle-settings-window
        v-show="showSettings"
        @close="showSettings = false"
        @keyboard-changed="(value) => changeKeyboard(value)"
        @hardmode-changed="(value) => changeHardmode(value)"
      />
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { BIconBarChartFill, BIconGearFill } from 'bootstrap-vue';
import { getWordsModule } from '../../store';
import WordStats from '../../types/word-stats.type';
import WordleKeyboard from './WordleKeyboard.vue';
import WordleLetter from './WordleLetter.vue';
import WordleEndWindow from './WordleEndWindow.vue';

@Component({
  components: {
    BIconBarChartFill,
    BIconGearFill,
    WordleKeyboard,
    WordleEndWindow,
    WordleLetter
  }
})
export default class WordleGame extends Vue {
  id: string = '';
  rowAnimations: string[] = ['', '', '', '', '', ''];
  isChecking: boolean = false;
  isHardmode: boolean = false;
  isWrongKeyboardDisplayed: boolean = false;
  showStats: boolean = false;
  showSettings: boolean = false;
  isWin: boolean = false;
  updateKeyboard: boolean = false;
  keyboardType: string = 'phonetic';
  stats: WordStats = {} as WordStats;

  mounted() {
    this.onResize();
    this.loadStats();
    if (localStorage.getItem('game-info')) {
      this.loadBoard();
      const currRow = this.row === 0 ? 0 : this.row - 1;
      setTimeout(() => {
        this.isWin = this.states[currRow].every((el) => el === 'correct');
        this.showStats = this.isWin || currRow >= 5;
      }, 500);
    }
  }

  async beforeMount() {
    if (localStorage.getItem('wordle-id')) {
      this.id = localStorage.getItem('wordle-id') ?? '';
    } else {
      const user = await this.$axios.$post('/api/user/join');
      localStorage.setItem('wordle-id', user._id);
      this.id = user._id;
      this.fetchNewWord();
    }

    window.addEventListener('keydown', this.onKeyPress);
    window.addEventListener('resize', this.onResize);
  }

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyPress);
    window.addEventListener('resize', this.onResize);
  }

  onResize() {
    const el = document.getElementById('grid') as HTMLElement;
    const factor =
      window.innerHeight < 800 ? (window.innerHeight < 600 ? 0.91 : 0.9) : 0.89;
    el.style.width =
      Math.min(window.innerWidth - 20, window.innerHeight * factor - 274) +
      'px';
  }

  changeKeyboard(value: string) {
    this.keyboardType = value;
  }

  changeHardmode(value: boolean) {
    this.isHardmode = value;
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
    this.showToaster('Копирано!');
  }

  clearBoard() {
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
  }

  async fetchNewWord($event?: Event) {
    ($event?.target as HTMLButtonElement).blur();
    this.isWin = false;
    this.showStats = false;
    localStorage.removeItem('game-info');
    try {
      const wordKey = await this.$axios.$get('/api/word/random', {
        params: {
          _id: this.id
        }
      });
      this.setWordKey(wordKey);
      localStorage.setItem('wordle-word', JSON.stringify(wordKey));
      this.clearBoard();
    } catch (e) {}
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
    if (this.isWin) {
      this.stats.wins++;
      this.stats.solves[this.row]++;
    }
    this.stats.streak = this.isWin ? this.stats.streak + 1 : 0;
    this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.streak);
    this.stats.lastTry = this.isWin ? this.row : -1;
    this.stats.success = this.isWin;
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

  shakeRow(id: number) {
    const newRow = this.rowAnimations.slice();
    newRow[id] = 'shake';
    this.rowAnimations = newRow;
    setTimeout(() => {
      const newRow = this.rowAnimations.slice();
      newRow[id] = '';
      this.rowAnimations = newRow;
    }, 500);
  }

  async guess() {
    return await this.$axios.$post('/api/word/guess', {
      _id: localStorage.getItem('wordle-id'),
      word: JSON.parse(localStorage.getItem('wordle-word') ?? '{}').word,
      guess: this.words[this.row].join('')
    });
  }

  async onKeyPress(event: KeyboardEvent) {
    if (this.isWin) return;
    if (this.isChecking) return;
    if (
      event.key >= 'a' &&
      event.key <= 'z' &&
      !this.isWrongKeyboardDisplayed
    ) {
      this.shakeRow(this.row);
      this.showToaster('Пиши на кирилица');
      this.isWrongKeyboardDisplayed = true;
      setTimeout(() => {
        this.isWrongKeyboardDisplayed = false;
      }, 1000);
      return;
    }
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
    } else if (event.key === 'Enter' || event.key === '↵') {
      if (this.col !== 5) {
        this.shakeRow(this.row);
        this.showToaster('Недостатъчно букви');
        return;
      }

      this.isChecking = true;

      const rowCopy = this.row;

      // if (this.isHardmode) {
      // }

      let response = await this.guess();

      if (response.error !== undefined) {
        if (response.error !== 'EXPIRED') {
          this.shakeRow(this.row);
          this.showToaster(response.error);
          this.isChecking = false;
          return;
        }
        localStorage.setItem(
          'wordle-word',
          JSON.stringify({ word: response.info })
        );
        response = await this.guess();
        if (this.row > 0) {
          this.showToaster('Опа');
          this.clearBoard();
          this.isChecking = false;
          return;
        }
      }
      const result = response.data;
      this.words[rowCopy].forEach((_, i) => {
        this.flipInOut({ row: rowCopy, col: i, result: result[i] });
      });

      this.isWin = result.every((el: string) => el === 'correct');

      if (this.isWin || rowCopy >= 5) {
        this.stats.actualWord = response.additional;
        this.saveStats();
        this.showStats = true;
      }

      this.incrementRow();
      this.setCol(0);

      setTimeout(() => {
        this.isChecking = false;
      }, 500);

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

  showToaster(message: string) {
    this.$bvToast.toast(message, {
      autoHideDelay: 1000,
      appendToast: false,
      solid: true,
      toaster: 'b-toaster-top-center',
      noCloseButton: true,
      noHoverPause: true,
      bodyClass: 'toast-body',
      headerClass: 'toast-header'
    });
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
  justify-content: space-between;
  width: 97%;
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
  justify-content: center;
  align-items: center;
  padding: 5px 0px;
  gap: 10px;
  position: relative;
}

.grid {
  display: grid;
  width: 100%;
  max-width: 500px;
  gap: 5px 5px;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px 5px;
}

.shake {
  animation-name: shake;
  animation-duration: 0.6s;
}

@keyframes shake {
  10%,
  90% {
    transform: translateX(-1px);
  }

  20%,
  80% {
    transform: translateX(2px);
  }

  30%,
  50%,
  70% {
    transform: translateX(-4px);
  }

  40%,
  60% {
    transform: translateX(4px);
  }
}
</style>

<style>
.b-toaster {
  margin-top: 100px !important;
}

.toast-body {
  width: auto;
  font-weight: bolder;
  border-radius: 15px;
  text-align: center;
}
</style>
