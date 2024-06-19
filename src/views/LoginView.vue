<template>
  <div class="login-view">
    <form @submit.prevent="loginUser" class="login-form">
      <div class="form-group">
        <label for="username">Username or Email</label>
        <input type="text" id="username" v-model="formData.username" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="formData.password" required>
      </div>
      <button type="submit" class="login-button">Login</button>
    </form>
    <p v-if="loginError" class="error-message">{{ loginError }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex'; // Import mapGetters from Vuex

export default {
  name: 'LoginView',
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      loginError: ''
    };
  },
  computed: {
    ...mapGetters(['userId']) // Map userId getter from Vuex
  },
  methods: {
    ...mapActions(['setUserId', 'setLoggedIn']), // Import setUserId and setLoggedIn actions from Vuex

    async loginUser() {
      try {
        const response = await axios.post('http://localhost:8888/api/prijava', {
          korisnickoIme: this.formData.username,
          lozinka: this.formData.password
        });

        console.log('Login successful:', response.data);

        // Save user id to Vuex store
        const userId = response.data; // Assuming response.data is the user id
        this.setUserId(userId);
        this.setLoggedIn(true); // Set isLoggedIn to true

        // Save user data to local storage
        localStorage.setItem('user', JSON.stringify(response.data));

        // Redirect to profile page
        this.$router.push('/myprofile');
      } catch (error) {
        if (error.response && error.response.data) {
          this.loginError = error.response.data;
          console.error('Login error:', error.response.data);
        } else {
          this.loginError = 'An error occurred. Please try again later.';
          console.error('Login error:', error);
        }
      }
    }
  }
};
</script>


<style scoped>
.login-view {
  height: 95vh; /* Set height to 95% of viewport height */
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

input[type="text"],
input[type="password"],
button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: darkred; /* Red background color */
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #8b0000; /* Darken the background on hover */
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
