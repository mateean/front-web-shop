<template>
  <div class="profile-view">
    <!-- Profile Header -->
    <div class="profile-header" v-if="profile">
      <img v-if="profile.profilnaSlika" :src="profile.profilnaSlika" alt="Profile Image" class="profile-image" />
      <div>
        <h1>{{ profile.ime }} {{ profile.prezime }}</h1>
        <div>
          <button class="button" @click="reportUser(profile.id)">Prijavi</button>
          <button class="button" @click="openRatingPopup(profile.id)">Oceni</button>
        </div>
      </div>
    </div>

    <!-- User Details -->
    <div class="user-details" v-if="profile">
      <h2>Detalji</h2>
      <p>Datum rođenja: {{ formatDate(profile.datumRodjenja) }}</p>
      <p>Opis: {{ profile.opis }}</p>
      <p>Uloga: {{ profile.uloga }}</p>
    </div>

    <!-- Products Section -->
    <div class="products" v-if="profile && profile.proizvodi && profile.proizvodi.length">
      <h2>Proizvodi:</h2>
      <div class="products-grid">
        <router-link v-for="product in profile.proizvodi" :key="product.id" :to="`/product/${product.id}`" class="product-card">
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

    <!-- Reviews Section -->
    <div class="reviews" v-if="profile && profile.recenzije && profile.recenzije.length">
      <h2>Recenzije:</h2>
      <div class="reviews-grid">
        <div v-for="review in profile.recenzije" :key="review.id" class="review-card">
          <p>Ocena: {{ review.ocena }}</p>
          <p>Komentar: {{ review.komentar }}</p>
          <p>Datum: {{ formatDate(review.datumRecenzije) }}</p>
          <p>Korisnik: {{ review.korisnikDaoRecenziju.ime }} {{ review.korisnikDaoRecenziju.prezime }}</p>
        </div>
      </div>
    </div>

    <!-- Rating Popup/Modal -->
    <div class="popup" v-if="showRatingPopup">
      <div class="popup-content">
        <h2>Oceni korisnika</h2>
        <form @submit.prevent="rateUser">
          <label for="rating">Ocena:</label>
          <input type="number" id="rating" v-model.number="rating.ocena" min="1" max="5" required>
          <label for="comment">Komentar:</label>
          <textarea id="comment" v-model="rating.komentar"></textarea>
          <button type="submit" class="button">Oceni</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ProfileView',
  data() {
    return {
      profile: null,
      showRatingPopup: false,
      userId: null,
      rating: {
        ocena: 0,
        komentar: ''
      }
    };
  },
  computed: {
    ...mapGetters(['getUserId', 'isLoggedIn'])
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    ...mapActions(['setLoggedIn', 'setUserId']),
    async fetchProfile() {
      const userId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8888/api/korisnik/${userId}`);
        this.profile = response.data;
        await this.fetchUserProfileImage(userId);
      } catch (error) {
        console.error('Error fetching profile information:', error);
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

        this.profile.profilnaSlika = `data:${response.headers['content-type'].toLowerCase()};base64,${imageBase64}`;
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    reportUser(userId) {
      // Implement functionality to report the user
      console.log(`User with ID ${userId} reported`);
    },
    openRatingPopup(userId) {
      this.showRatingPopup = true;
      this.userId = userId; // Set userId for use in rating
    },
    async rateUser() {
      const { ocena, komentar } = this.rating;
      const userId = this.userId;
      try {
        const response = await axios.post(`http://localhost:8888/api/korisnik/${userId}/${this.getUserId}/rate`, {
          ocena,
          komentar
        });
        console.log('User rated:', response.data);
        alert('Korisnik je ocenjen.');
        this.showRatingPopup = false; // Close the popup after rating
      } catch (error) {
        console.error('Error rating user:', error);
        alert('Greška prilikom ocenjivanja korisnika.');
      }
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

/* Popup/Modal styles */
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 400px;
}
.popup-content h2 {
  margin-bottom: 10px;
}
.popup-content form {
  display: flex;
  flex-direction: column;
}
.popup-content label {
  margin-bottom: 5px;
}
.popup-content input[type="number"],
.popup-content textarea {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.popup-content button {
  padding: 10px 20px;
  background-color: darkred;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.popup-content button:hover {
  background-color: red;
}
</style>
