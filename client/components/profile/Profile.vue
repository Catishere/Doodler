<template>
  <div class="profile-container">
    <div class="header">Profile</div>
    <div>Е-майл: {{ email }}</div>
    <div>Име: {{ displayName }}</div>
    <img :src="photoURL" />
  </div>
</template>

<script lang="ts">
import Cookies from 'js-cookie';
import { Component, Vue } from 'nuxt-property-decorator';
import { getUsersModule } from '../../store';

@Component({})
export default class Profile extends Vue {
  email?: string | null = '';
  displayName?: string | null = '';
  photoURL?: string = '';

  async beforeCreate() {
    const uid = Cookies.get('user');
    if (!uid || uid === '') {
      this.$router.push('/');
      return;
    }
    const snap = await this.$fire.firestore.collection('users').doc(uid).get();
    const user = snap.data();
    this.email = user?.email;
    this.displayName = user?.displayName;
    this.photoURL = user?.photoURL;

    getUsersModule(this.$store).setUserData({
      email: user?.email,
      displayName: user?.displayName,
      photoURL: user?.photoURL
    });

    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
</script>

<style scoped lang="css">
.profile-container {
  height: 100%;
}
</style>
