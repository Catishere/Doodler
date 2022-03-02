<template>
  <div class="overlay" @click="close()">
    <div class="window-container">
      <div class="container">
        <h1>Statistics</h1>
        <div>{{ stats.games }} games played</div>
        <div v-if="stats.games > 0">
          {{ Math.round((stats.wins / stats.games) * 100) }}% wins
        </div>
        <div>{{ stats.streak }} current streak</div>
        <div>{{ stats.maxStreak }} longest streak</div>
        <div class="graph">
          <div
            v-for="(solve, i) in stats.solves"
            :key="'solve-' + i"
            class="graph-item"
          >
            <div class="graph-item-number">{{ i + 1 }}</div>
            <b-progress
              :value="solve"
              :variant="stats.lastTry == i ? 'success' : 'secondary'"
              :max="Math.max(...stats.solves)"
              show-value
            />
          </div>
        </div>
        <button class="btn btn-dark" @click="copy()">Share results</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Prop, Component, Vue, Emit } from 'nuxt-property-decorator';
import WordStats from '@/client/types/word-stats.type';

@Component
export default class WordleEndWindow extends Vue {
  @Prop({ default: {} })
  stats!: WordStats;

  @Emit()
  close() {
    return false;
  }

  @Emit()
  copy() {
    return true;
  }
}
</script>

<style scoped>
.graph {
  margin: 20px 0;
}
.graph-item-number {
  margin-right: 10px;
}
.graph-item {
  width: 100%;
  display: flex;
  align-items: center;
}

.progress {
  background-color: transparent;
  -webkit-box-shadow: none;
  box-shadow: none;
  width: 100%;
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
  border-radius: 15px;
  background-color: rgb(41, 41, 41);
}
</style>
