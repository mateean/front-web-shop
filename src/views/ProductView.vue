<template>
  <div class="product-view">
    <div v-if="product">
      <div class="product-info">
        <div class="product-image">
          <img :src="product.slika" alt="Product Image">
        </div>
        <div class="product-details">
          <h3>{{ product.naziv }}</h3>
          <p>Opis: {{ product.opis }}</p>
          <p>Kategorija: {{ product.kategorija.naziv }}</p>
          <p>Cena: {{ product.cena }} rsd</p>
          <div>
            <p>Prodavac: {{ product.prodavac.ime }} {{ product.prodavac.prezime }}</p>
            <button @click="viewSellerProfile(product.prodavac.id)">Pogledaj profil prodavca</button>
          </div>
          <p>Tip prodaje: {{ product.tipProdaje }}</p>

          <!-- Display "Kupi" button only if tipProdaje is FIKSNA_CENA and user is logged in -->
          <button v-if="isLoggedIn && product.tipProdaje === 'FIKSNA_CENA'" @click="buyProduct(product.id, getUserId)">
            Kupi
          </button>

          <!-- Display offer form only if tipProdaje is AUKCIJA and user is logged in -->
          <div v-if="isLoggedIn && product.tipProdaje === 'AUKCIJA'">
            <label for="offerAmount">Ponuda:</label>
            <input type="number" id="offerAmount" v-model="offerAmount" />
            <button @click="sendOffer(product.id, getUserId, offerAmount)">
              Pošalji ponudu
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Učitavanje...</p>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'ProductView',
  data() {
    return {
      product: null,
      offerAmount: 0 // Add offerAmount to the data properties
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'getUserId'])
  },
  created() {
    this.fetchProduct();
  },
  methods: {
    fetchProduct() {
      const productId = this.$route.params.id;
      axios.get(`http://localhost:8888/api/proizvod/${productId}`)
        .then(response => {
          this.product = response.data;
        })
        .catch(error => {
          console.error('Error fetching product:', error);
        });
    },
    viewSellerProfile(sellerId) {
      this.$router.push(`/profile/${sellerId}`);
    },
    async buyProduct(productId, buyerId) {
      try {
        const response = await axios.post(`http://localhost:8888/api/kupi/${productId}/${buyerId}`);
        console.log(response);
        alert('Proizvod je uspešno kupljen.');
        // Optionally, update UI or redirect to a different page
      } catch (error) {
        console.error('Error buying product:', error);
        alert('Došlo je do greške prilikom kupovine proizvoda.');
      }
    },
    async sendOffer(productId, userId, offerAmount) {
      try {
        const response = await axios.post(`http://localhost:8888/api/proizvodi/${productId}/ponudi`, null, {
          params: {
            cena: offerAmount,
            loggedInUserId: userId
          }
        });
        console.log(response);
        alert('Ponuda je uspešno poslata.');
      } catch (error) {
        console.error('Error sending offer:', error);
        alert('Došlo je do greške prilikom slanja ponude.');
      }
    }
  }
};
</script>

<style scoped>
.product-view {
  padding: 2rem;
  max-width: 900px;
  margin: 10vh auto;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.product-info {
  display: flex;
  align-items: flex-start;
  border-bottom: 2px solid #8B0000;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.product-image {
  width: 40%;
  flex-shrink: 0;
  margin-right: 2rem;
}

.product-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-details {
  width: 60%;
}

.product-details h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #8B0000;
  font-size: 1.5rem;
}

.product-details p {
  margin-bottom: 0.75rem;
  color: #333;
}

.product-details button {
  padding: 0.5rem 1.5rem;
  background-color: #8B0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem;
}

.product-details button:hover {
  background-color: #a52a2a;
}

.product-details div {
  margin-top: 1rem;
}

.product-details input {
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.product-details label {
  margin-right: 0.5rem;
}
</style>
