<template>
  <wordle-modal-window @close="close()">
    <h1>Статистика</h1>
    <h5 v-if="stats.success">Браво!</h5>
    <h5 v-else-if="stats.actualWord">
      Този път не позна. Думата беше
      {{ stats.actualWord.toUpperCase() }}!
    </h5>
    <div class="stat-boxes">
      <div class="stats-pair">
        <div class="stat-box">
          <div class="stat-box-value">{{ stats.games }}</div>
          <div class="stat-box-title">Игри</div>
        </div>
        <div class="stat-box">
          <div class="stat-box-value">
            {{ Math.round((stats.wins / stats.games) * 100) }}
          </div>
          <div class="stat-box-title">% Победи</div>
        </div>
      </div>
      <div class="stats-pair">
        <div class="stat-box">
          <div class="stat-box-value">{{ stats.streak }}</div>
          <div class="stat-box-title">Победи подред</div>
        </div>
        <div class="stat-box">
          <div class="stat-box-value">{{ stats.maxStreak }}</div>
          <div class="stat-box-title">Рекорд</div>
        </div>
      </div>
    </div>
    <div v-if="stats.games > 0" class="graph">
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
    <button v-if="stats.success" class="btn btn-dark" @click="copy()">
      <b-icon-share-fill />
      Сподели
    </button>
  </wordle-modal-window>
</template>
<script lang="ts">
import { Prop, Component, Vue, Emit } from 'nuxt-property-decorator';
import { BIconShareFill, BIconXCircle, BProgress } from 'bootstrap-vue';
import WordleModalWindow from './WordleModalWindow.vue';
import WordStats from '@/client/types/word-stats.type';

@Component({
  components: { BIconShareFill, BIconXCircle, BProgress, WordleModalWindow }
})
export default class WordleEndWindow extends Vue {
  @Prop({ default: {} })
  stats!: WordStats;

  @Emit()
  close() {
    return false;
  }

  closeIf(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('overlay'))
      this.close();
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

.stat-boxes {
  display: flex;
  width: 100%;
  flex-grow: 1;
  justify-content: center;
  flex-wrap: nowrap;
  align-content: stretch;
  margin-top: 20px;
}

.stats-pair {
  flex-basis: 100%;
  flex-grow: 1;
  flex-shrink: 2;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: stretch;
  align-items: center;
}

@media screen and (min-width: 768px) {
  .stats-pair {
    flex-wrap: nowrap;
  }
}

.stat-box {
  flex-basis: 100%;
  flex-grow: 1;
  padding: 10px 5px;
  border-radius: 6px;
  flex-shrink: 2;
  margin: 5px;
  background-color: rgb(17, 17, 17);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-box-title {
  font-size: 0.7rem;
  margin-top: 5px;
}

.stat-box-value {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
