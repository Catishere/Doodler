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
      <button
        v-if="isRush"
        class="btn btn-danger timer"
        @click="startStopRush()"
      >
        {{ isRushRunning ? 'Стоп' : 'Старт' }}
      </button>
      <wordle-timer
        v-if="isRush"
        v-model="rushTime"
        :is-running="isRushRunning"
        class="timer"
        @timeout="isRushRunning = false"
      />
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
          @clicked="letterClicked(row_id, letter_id)"
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
        @letindex-changed="(value) => changeLetterIndex(value)"
        @rush-changed="(value) => changeRush(value)"
      />
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import { BIconBarChartFill, BIconGearFill } from 'bootstrap-vue';
import Cookies from 'js-cookie';
import { getWordsModule } from '../../store';
import WordStats from '../../types/word-stats.type';

@Component({
  components: {
    BIconBarChartFill,
    BIconGearFill
  }
})
export default class Game extends Vue {
  id: string = '';
  rowAnimations: string[] = ['', '', '', '', '', ''];
  isChecking: boolean = false;
  isHardmode: boolean = false;
  isColMoved: boolean = false;
  isLetterIndexable: boolean = false;
  isRush: boolean = false;
  isRushRunning: boolean = false;
  rushTime: number = 90;
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
  }

  async beforeMount() {
    if (localStorage.getItem('game-info')) {
      this.loadBoard();
      const currRow = this.row === 0 ? 0 : this.row - 1;
      setTimeout(() => {
        this.isWin = this.states[currRow].every((el) => el === 'correct');
        this.showStats = this.isWin || currRow >= 5;
      }, 500);
    }
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
    if (!el) return;
    const factor =
      window.innerHeight < 800 ? (window.innerHeight < 600 ? 0.91 : 0.9) : 0.89;
    el.style.width =
      Math.min(window.innerWidth - 20, window.innerHeight * factor - 274) +
      'px';
  }

  letterClicked(row: number, col: number) {
    if (!this.isLetterIndexable) return;
    if (row === this.row) {
      this.setCol(col);
      this.animations[row][col] = 'pop';
      this.setAnimations(this.animations.slice());
      this.isColMoved = true;
      setTimeout(() => {
        this.animations[row][col] = ' ';
        this.setAnimations(this.animations.slice());
      }, 100);
    }
  }

  changeKeyboard(value: string) {
    this.keyboardType = value;
  }

  changeHardmode(value: boolean) {
    this.isHardmode = value;
  }

  changeLetterIndex(value: boolean) {
    this.isLetterIndexable = value;
  }

  changeRush(value: boolean) {
    this.isRush = value;
  }

  startStopRush() {
    if (this.isRushRunning) {
      this.isRushRunning = false;
    } else {
      this.rushTime = 90;
      this.isRushRunning = true;
      this.fetchNewWord();
    }
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

  clearStates() {
    this.setStates([
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty']
    ]);
  }

  clearBoard() {
    this.setRow(0);
    this.setCol(0);
    this.clearStates();
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
    if ($event) ($event?.target as HTMLButtonElement).blur();
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
    this.words.forEach((row, rowId) => {
      if (row.includes(' ')) this.words[rowId] = [' ', ' ', ' ', ' ', ' '];
    });
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

    const uid = Cookies.get('user') ?? '';
    localStorage.setItem(`wordle-stat${uid}`, JSON.stringify(this.stats));
    if (uid !== '') {
      this.$fire.firestore
        .collection('users')
        .doc(uid)
        .update({
          stats: {
            games: this.stats.games,
            wins: this.stats.wins,
            solves: this.stats.solves,
            streak: this.stats.streak,
            maxStreak: this.stats.maxStreak,
            lastTry: this.stats.lastTry,
            success: this.stats.success
          } as WordStats
        });
    }
  }

  flipAllLetters(states: string[][]) {
    for (let row = 0; row < this.row; row++) {
      this.words[row].forEach((_c, col) => {
        this.delayedFlipInOut({
          row,
          col,
          result: states[row][col],
          delay: 125
        });
      });
    }
  }

  loadBoard() {
    const gameInfo = JSON.parse(localStorage.getItem('game-info') ?? '{}');
    this.setRow(gameInfo.row);
    this.setWords(gameInfo.words);
    this.clearStates();
    this.flipAllLetters(gameInfo.states);
  }

  loadStats() {
    const uid = Cookies.get('user') ?? '';

    if (uid !== '') {
      this.$fire.firestore
        .collection('users')
        .doc(uid)
        .get()
        .then((doc) => {
          this.stats = doc.data()?.stats ?? {
            games: 0,
            wins: 0,
            streak: 0,
            maxStreak: 0,
            solves: [0, 0, 0, 0, 0, 0]
          };
        });
    } else {
      this.stats = JSON.parse(
        localStorage.getItem(`wordle-stat${uid}`) ??
          '{"games": 0, "wins": 0, "streak": 0, "maxStreak": 0, "solves": [0, 0, 0, 0, 0, 0]}'
      );
    }
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
      this.isColMoved = false;
    } else if (event.key === 'Enter' || event.key === '↵') {
      if (!this.words[this.row].every((el) => el !== ' ')) {
        this.shakeRow(this.row);
        this.showToaster('Недостатъчно букви');
        return;
      }

      this.isChecking = true;
      this.isColMoved = false;
      const rowCopy = this.row;

      if (this.isHardmode && !this.checkHardmode()) {
        return;
      }

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
        if (this.isRushRunning) {
          const addTime = this.isWin ? 15 : -20;
          this.showToaster(
            addTime < 0 ? `Минус 20 секунди` : `Получи 15 секунди`
          );
          this.rushTime += addTime;
        }
        this.stats.actualWord = response.additional;
        this.saveStats();
        if (!this.isRushRunning) this.showStats = true;
      }

      this.incrementRow();
      this.setCol(0);

      setTimeout(() => {
        this.isChecking = false;
        this.saveBoard();
      }, 1500);
    } else if (
      (event.key === 'Backspace' || event.key === '⌫') &&
      this.col >= 0 &&
      this.row < 6
    ) {
      if (!this.isColMoved && this.col === 0) return;
      if (this.isColMoved) this.setCol(this.col + 1);
      this.isColMoved = false;
      this.eraseLetter();
      this.incrementCol(-1);
    }
  }

  checkHardmode() {
    for (let rowId = 0; rowId < this.words.length; rowId++) {
      for (let colId = 0; colId < this.words.length; colId++) {
        if (
          this.states[rowId][colId] === 'correct' &&
          this.words[this.row][colId] !== this.words[rowId][colId]
        ) {
          this.showToaster('Това не ми изглежда трудно');
          this.isChecking = false;
          return false;
        }
        if (
          this.states[rowId][colId] === 'present' &&
          !this.words[this.row].includes(this.words[rowId][colId])
        ) {
          this.showToaster('Това не ми изглежда трудно');
          this.isChecking = false;
          return false;
        }
      }
    }
    return true;
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

  @Watch('nextRound')
  onNextRoundChange() {
    if (this.isRushRunning && (this.isWin || this.row > 5)) this.fetchNewWord();
  }

  get nextRound() {
    return getWordsModule(this.$store).nextRound;
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

  delayedFlipInOut(data: {
    row: number;
    col: number;
    result: string;
    delay: number;
  }): void {
    getWordsModule(this.$store).delayedFlipInOut(data);
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

@media screen and (max-width: 351px) {
  .timer {
    display: none;
  }
}
</style>
