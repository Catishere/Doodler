<template>
  <div class="flex-container">
    <div class="score">Класация</div>
    <div v-for="(user, id) in users" :key="'user-' + id" class="flex-row">
      <div>{{ id + 1 }}</div>
      <b-avatar :src="user.photoURL" size="3rem"></b-avatar>
      <div>{{ user.displayName }}</div>
      <div class="score">{{ user.stats.average.toFixed(2) }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({})
export default class Leaderboard extends Vue {
  users: any[] = [];

  async mounted() {
    const snap = await this.$fire.firestore
      .collection('users')
      .where('stats', '!=', null)
      .get();
    this.users = snap.docs
      .map((doc) => {
        const d = doc.data();
        const solveSum =
          d.stats.solves.reduce(
            (a: number, b: number, index: number) => a + b * (index + 1),
            0
          ) +
          (d.stats.games - d.stats.wins) * 7;
        d.stats.average = solveSum / d.stats.games;
        return d;
      })
      .sort((a, b) => a.stats.average - b.stats.average);
  }
}
</script>

<style scoped lang="css">
.flex-container {
  margin: 50px 0px;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  overflow-y: auto;
  height: 80%;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  width: 100%;
}

.score {
  font-size: 1.2rem;
  font-weight: bold;
  margin-left: 10px;
}
</style>
