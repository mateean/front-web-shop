<template>
  <div class="profile-view">
    <div class="profile-header" v-if="user">
      <img v-if="user.profilnaSlika" :src="user.profilnaSlika" alt="Profile Image" class="profile-image" />
      <div>
        <h1>{{ user.ime }} {{ user.prezime }}</h1>
      </div>
    </div>

    <div class="user-details" v-if="user">
      <h2>Detalji</h2>
      <p>Datum rođenja: {{ formatDate(user.datumRodjenja) }}</p>
      <p>Opis: {{ user.opis }}</p>
      <p>Uloga: {{ user.uloga }}</p>
    </div>

    <!-- Admin Panel Button with guard -->
    <router-link v-if="user && user.uloga === 'ADMINISTRATOR'" :to="'/admin'" class="button admin-button">Admin Panel</router-link>
    
    <!-- Novi Oglas Button for Prodavac -->
    <router-link v-if="user && user.uloga === 'PRODAVAC'" :to="'/novioglas'" class="button novi-oglas-button">Novi oglas</router-link>

    <router-link to="/updateprofile" class="button">Ažuriraj profil</router-link>

    <div class="products" v-if="user && user.proizvodi && user.proizvodi.length">
      <h2>Proizvodi:</h2>
      <div class="products-grid">
        <router-link
          v-for="product in user.proizvodi"
          :key="product.id"
          :to="`/product/${product.id}`"
          class="product-card"
        >
          <img :src="product.slika" alt="Product Image" class="product-image" />
          <div class="product-details">
            <h3>{{ product.naziv }}</h3>
            <p>Kategorija: {{ product.kategorija.naziv }}</p>
            <p>Cena: {{ product.cena }} rsd</p>
            <p>Tip prodaje: {{ product.tipProdaje }}</p>
            <p>Prodato: {{ product.prodat ? 'Da' : 'Ne' }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <div class="reviews" v-if="user && user.recenzije && user.recenzije.length">
      <h2>Recenzije:</h2>
      <div class="reviews-grid">
        <div v-for="review in user.recenzije" :key="review.id" class="review-card">
          <p>Ocena: {{ review.ocena }}</p>
          <p>Komentar: {{ review.komentar }}</p>
          <p>Datum: {{ formatDate(review.datumRecenzije) }}</p>
          <p>Korisnik: {{ review.korisnikDaoRecenziju.ime }} {{ review.korisnikDaoRecenziju.prezime }}</p>
        </div>
      </div>
    </div>

    <button v-if="isLoggedIn" @click="logout" class="button">Logout</button>
  </div>
</template>


<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'LoggedProfileView',
  computed: {
    ...mapGetters(['getUserId', 'isLoggedIn'])
  },
  data() {
    return {
      user: null
    };
  },
  mounted() {
    this.fetchUserInfo();
  },
  methods: {
    async fetchUserInfo() {
      const userId = this.getUserId;
      if (userId) {
        await this.fetchUserDetails(userId);
        await this.fetchUserProfileImage(userId);
      }
    },
    async fetchUserDetails(userId) {
      try {
        const response = await axios.get(`http://localhost:8888/api/korisnik/${userId}`);
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    },
    async fetchUserProfileImage(userId) {
      try {
        const response = await axios.get(`http://localhost:8888/api/korisnik/${userId}/slika`, {
          responseType: 'arraybuffer'
        });

        const imageBase64 = btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        this.user.profilnaSlika = `data:${response.headers['content-type'].toLowerCase()};base64,${imageBase64}`;
      } catch (error) {
        console.error('Error fetching user profile image:', error);
      }
    },
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
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    }
  }
};
</script>

<style scoped>
.profile-view {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
}
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.profile-image {
  border-radius: 50%;
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-right: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.user-details,
.products,
.reviews {
  margin-bottom: 30px;
}
.products-grid,
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
.product-card,
.review-card {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  text-decoration: none;
  color: inherit;
}
.product-card:hover,
.review-card:hover {
  transform: translateY(-5px);
}
.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}
.product-details h3 {
  margin: 10px 0;
}
.button {
  display: inline-block;
  padding: 10px 20px;
  background: darkred;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}
.button:hover {
  background: red;
}
.admin-button {
  margin-right: 10px;
}
.novi-oglas-button {
  background-color: darkblue;
}
.novi-oglas-button:hover {
  background-color: blue;
}
</style>
