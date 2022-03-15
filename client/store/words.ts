import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

@Module({
  name: 'words',
  stateFactory: true,
  namespaced: true
})
export default class WordsModule extends VuexModule {
  words_ = [
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ']
  ];

  row_ = 0;
  col_ = 0;
  states_ = [
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty']
  ];

  animations_ = [
    ['idle', 'idle', 'idle', 'idle', 'idle'],
    ['idle', 'idle', 'idle', 'idle', 'idle'],
    ['idle', 'idle', 'idle', 'idle', 'idle'],
    ['idle', 'idle', 'idle', 'idle', 'idle'],
    ['idle', 'idle', 'idle', 'idle', 'idle'],
    ['idle', 'idle', 'idle', 'idle', 'idle']
  ];

  wordKey_ = '';

  get states() {
    return this.states_;
  }

  get words() {
    return this.words_;
  }

  get animations() {
    return this.animations_;
  }

  get col() {
    return this.col_;
  }

  get row() {
    return this.row_;
  }

  get wordKey() {
    return this.wordKey_;
  }

  @Mutation
  setRow(row: number): void {
    this.row_ = row;
  }

  @Mutation
  setCol(col: number): void {
    this.col_ = col;
  }

  @Mutation
  incrementCol(col: number = 1): void {
    this.col_ += col;
  }

  @Mutation
  incrementRow(row: number = 1): void {
    this.row_ += row;
  }

  @Mutation
  eraseLetter(): void {
    this.words_[this.row_].splice(this.col_ - 1, 1, ' ');
    this.words_ = this.words_.slice();
  }

  @Mutation
  addLetter(key: string): void {
    this.words_[this.row_].splice(this.col_, 1, key);
  }

  @Mutation
  setWords(words: string[][]): void {
    this.words_ = words;
  }

  @Mutation
  setStates(states: string[][]): void {
    this.states_ = states;
  }

  @Mutation
  setAnimations(animations: string[][]): void {
    this.animations_ = animations;
  }

  @Mutation
  setWordKey(wordKey: string): void {
    this.wordKey_ = wordKey;
  }

  @Action({ rawError: true, commit: 'setStates' })
  changeStateDelayed(data: {
    row: number;
    col: number;
    state: string;
    time: number;
  }) {
    const { row, col, state, time } = data;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newStates = this.states_.slice();
        newStates[row][col] = state;
        this.setStates(newStates);
        resolve();
      }, time);
    });
  }

  @Action({ rawError: true, commit: 'setAnimations' })
  changeAnimationDelayed(data: {
    row: number;
    col: number;
    animation: string;
    time: number;
  }) {
    const { row, col, animation, time } = data;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newAnimations = this.animations_.slice();
        newAnimations[row][col] = animation;
        this.setAnimations(newAnimations);
        resolve();
      }, time);
    });
  }

  @Action({ rawError: true })
  flipInOut(data: { row: number; col: number; result: string }): Promise<void> {
    return this.delayedFlipInOut({ ...data, delay: 300 });
  }

  @Action({ rawError: true })
  delayedFlipInOut(data: {
    row: number;
    col: number;
    result: string;
    delay: number;
  }): Promise<void> {
    return new Promise<void>((resolve) => {
      const { row, col, result, delay } = data;
      setTimeout(() => {
        this.animations_[row][col] = 'flip-in';
        this.context.commit('setAnimations', this.animations_.slice());
        setTimeout(() => {
          if (result === 'correct') {
            this.states_[row][col] = 'correct';
          } else if (result === 'present') {
            this.states_[row][col] = 'present';
          } else if (result === 'absent') {
            this.states_[row][col] = 'absent';
          }
          this.context.commit('setStates', this.states_.slice());
          this.animations_[row][col] = 'flip-out';
          this.context.commit('setAnimations', this.animations_.slice());
          setTimeout(() => {
            this.animations_[row][col] = 'idle';
            this.context.commit('setAnimations', this.animations_.slice());
            resolve();
          }, 150);
        }, 150);
      }, delay * col);
    });
  }
}
