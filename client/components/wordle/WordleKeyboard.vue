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
<script>
export default {
  name: 'WordleKeyboard',
  props: {
    words: {
      type: Array,
      default() {
        return [];
      }
    },
    state: {
      type: Array,
      default() {
        return [];
      }
    },
    render: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      keyboard: [
        ['я', 'в', 'е', 'р', 'т', 'ъ', 'у', 'и', 'о', 'п', 'ч'],
        ['а', 'с', 'д', 'ф', 'г', 'х', 'й', 'к', 'л', 'ш', 'щ'],
        ['↵', 'з', 'ь', 'ц', 'ж', 'б', 'н', 'м', 'ю', '⌫']
      ]
    };
  },
  methods: {
    resolveType(letter) {
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
};
</script>

<style scoped>
.keyboard {
  margin: 5px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
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
  background-color: #538d4e;
}
.present {
  background-color: #b59f3b;
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
