<template>
  <div class="register-view">
    <!-- Registration form -->
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="ime">Ime</label>
        <input type="text" id="ime" v-model="formData.ime" required>
      </div>

      <div class="form-group">
        <label for="prezime">Prezime</label>
        <input type="text" id="prezime" v-model="formData.prezime" required>
      </div>

      <div class="form-group">
        <label for="korisnickoIme">Korisničko ime</label>
        <input type="text" id="korisnickoIme" v-model="formData.korisnickoIme" required>
      </div>

      <div class="form-group">
        <label for="mejlAdresa">Mejl adresa</label>
        <input type="email" id="mejlAdresa" v-model="formData.mejlAdresa" required>
      </div>

      <div class="form-group">
        <label for="brojTelefona">Broj telefona</label>
        <input type="text" id="brojTelefona" v-model="formData.brojTelefona" required>
      </div>

      <div class="form-group">
        <label for="lozinka">Lozinka</label>
        <input type="password" id="lozinka" v-model="formData.lozinka" required>
      </div>

      <div class="form-group">
        <label for="lozinkaPonovo">Ponovite lozinku</label>
        <input type="password" id="lozinkaPonovo" v-model="formData.lozinkaPonovo" required>
      </div>

      <div class="form-group">
        <label for="uloga">Uloga</label>
        <select id="uloga" v-model="formData.uloga" required>
          <option value="KUPAC">Kupac</option>
          <option value="PRODAVAC">Prodavac</option>
        </select>
      </div>

      <button type="submit" class="register-button">Register</button>
    </form>

    <!-- Display registration error message if any -->
    <p v-if="registerError" class="error-message">{{ registerError }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterView',
  data() {
    return {
      formData: {
        ime: '',
        prezime: '',
        korisnickoIme: '',
        mejlAdresa: '',
        brojTelefona: '',
        lozinka: '',
        lozinkaPonovo: '',
        uloga: 'KUPAC' // Default to 'kupac' for role selection
      },
      registerError: ''
    };
  },
  methods: {
    async register() {
      // Basic frontend validation
      if (!this.validateFields()) {
        this.registerError = 'Popunite sva polja';
        return;
      }

      try {
        console.log(this.formData);
        await axios.post('http://localhost:8888/api/registracija', this.formData);
        alert('Registracija uspešna');
        // Redirect or perform any other action upon successful registration
        this.$router.push('/login');
      } catch (error) {
        if (error.response && error.response.data) {
          this.registerError = error.response.data;
          console.error('Greška prilikom registracije:', error.response.data);
        } else {
          this.registerError = 'Došlo je do greške. Molimo pokušajte ponovo kasnije.';
          console.error('Greška prilikom registracije:', error);
        }
      }
    },
    validateFields() {
      // Check if all required fields are filled
      return (
        this.formData.ime &&
        this.formData.prezime &&
        this.formData.korisnickoIme &&
        this.formData.mejlAdresa &&
        this.formData.brojTelefona &&
        this.formData.lozinka &&
        this.formData.lozinkaPonovo
      );
    }
  }
};
</script>




<style scoped>
.register-view {
  height: 95vh; /* Set height to 95% of viewport height */
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-form {
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
input[type="email"],
input[type="password"],
select,
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
