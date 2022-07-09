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
import { LeaderboardStats } from '~/client/types/word-stats.type';

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
        const dd = doc.data();
        const ls = dd.stats as LeaderboardStats;
        const solveSum =
          ls.solves.reduce((a, b, index) => a + b * (index + 1), 0) +
          (ls.games - ls.wins) * 7;
        ls.average = solveSum / ls.games;
        return dd;
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
