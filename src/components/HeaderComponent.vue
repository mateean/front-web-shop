<template>
  <header class="header">
    <router-link to="/" class="logo">
      <img src="@/assets/logo.png" alt="Logo" />
    </router-link>
    <div class="buttons">
      <router-link v-if="!isLoggedIn" to="/login" class="button">Login</router-link>
      <router-link v-if="!isLoggedIn" to="/register" class="button">Register</router-link>
      <router-link v-if="isLoggedIn" to="/myprofile" class="button">Profil</router-link>
      <button v-if="isLoggedIn" @click="logout" class="button">Logout</button>
    </div>
  </header>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  name: 'HeaderComponent',
  computed: {
    ...mapState(['isLoggedIn'])
  },
  methods: {
    async logout() {
      try {
        await axios.get('http://localhost:8888/api/odjava');
        this.$store.dispatch('setLoggedIn', false);
        this.$store.dispatch('setUserId', null);
        localStorage.removeItem('user');
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  }
};
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15%;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
  height: 5vh; /* Set header height to 5% of viewport height */
  z-index: 1000; /* Ensure header is on top of other content */
}

.logo img {
  max-height: 50px; /* Adjust as per your logo's dimensions */
}

.buttons {
  display: flex;
}

.button {
  margin-left: 10px;
  padding: 8px 12px;
  text-decoration: none;
  color: #fff; /* Text color for buttons */
  background-color: darkred; /* Dark red background color */
  border: 1px solid darkred; /* Dark red border */
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #8b0000; /* Darken the background on hover */
}
</style>
