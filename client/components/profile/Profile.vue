<template>
  <div class="profile-container">
    <div class="header">Profile</div>
    <div>Е-майл: {{ email }}</div>
    <div>Име: {{ name }}</div>
    <img :src="avatar" />
  </div>
</template>

<script lang="ts">
import Cookies from 'js-cookie';
import { Component, Vue } from 'nuxt-property-decorator';

@Component({})
export default class Profile extends Vue {
  email?: string | null = '';
  name?: string | null = '';
  avatar?: string = '';

  async beforeCreate() {
    const uid = Cookies.get('user');
    if (!uid || uid === '') {
      this.$router.push('/');
      return;
    }
    const snap = await this.$fire.firestore.collection('users').doc(uid).get();
    const user = snap.data();
    this.email = user?.email;
    this.name = user?.name;
    this.avatar = user?.avatar;

    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
</script>

<style scoped lang="css">
.profile-container {
  height: 100%;
}
</style>
