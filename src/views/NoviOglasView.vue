<template>
  <div class="new-product-view">
    <h1>Dodaj novi oglas</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="naziv">Naziv:</label>
        <input type="text" v-model="proizvod.naziv" id="naziv" required />
      </div>
      <div>
        <label for="opis">Opis:</label>
        <textarea v-model="proizvod.opis" id="opis" required></textarea>
      </div>
      <div>
        <label for="slika">Slika URL:</label>
        <input type="text" v-model="proizvod.slika" id="slika" required />
      </div>
      <div>
        <label for="cena">Cena:</label>
        <input type="number" v-model="proizvod.cena" id="cena" required />
      </div>
      <div>
        <label for="kategorija">Kategorija:</label>
        <input type="text" v-model="proizvod.kategorija.naziv" id="kategorija" required />
      </div>
      <div>
        <label for="tipProdaje">Tip Prodaje:</label>
        <select v-model="proizvod.tipProdaje" id="tipProdaje" required>
          <option value="PRODAJA">Prodaja</option>
          <option value="AUKCIJA">Aukcija</option>
        </select>
      </div>
      <button type="submit">Dodaj Proizvod</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'NoviOglasView',
  data() {
    return {
      proizvod: {
        naziv: '',
        opis: '',
        slika: '',
        cena: 0,
        kategorija: {
          naziv: ''
        },
        tipProdaje: 'PRODAJA'
      }
    };
  },
  computed: {
    ...mapGetters(['getUserId'])
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.post(
          `http://localhost:8888/api/proizvod/dodavanje-proizvoda-prodavac`,
          this.proizvod,
          {
            params: {
              userId: this.getUserId
            }
          }
        );
        console.log(response);
        alert('Proizvod uspešno dodat!');
        this.$router.push('/myprofile');
      } catch (error) {
        console.error('Error adding product:', error);
        alert('Došlo je do greške prilikom dodavanja proizvoda.');
      }
    }
  }
};
</script>

<style scoped>
.new-product-view {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
}
form div {
  margin-bottom: 10px;
}
label {
  display: block;
  font-weight: bold;
}
input,
textarea,
select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  padding: 10px 20px;
  background: darkred;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}
button:hover {
  background: red;
}
</style>
