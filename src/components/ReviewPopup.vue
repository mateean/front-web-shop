<template>
  <div class="popup">
    <div class="popup-content">
      <h2>Oceni korisnika</h2>
      <form @submit.prevent="submitRating">
        <label for="rating">Ocena:</label>
        <input type="number" id="rating" v-model="rating" min="1" max="5" required>
        
        <label for="comment">Komentar:</label>
        <textarea id="comment" v-model="comment" rows="4"></textarea>

        <button type="submit" class="button">Potvrdi ocenu</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RateUserPopup',
  data() {
    return {
      rating: 1,
      comment: ''
    };
  },
  methods: {
    async submitRating() {
      try {
        const userId = this.$props.userId;
        const response = await axios.post(`http://localhost:8888/api/korisnik/${userId}/rate`, {
          ocena: this.rating,
          komentar: this.comment
        });
        console.log('User rated:', response.data);
        alert('Korisnik je ocenjen.');
        this.$emit('close');
      } catch (error) {
        console.error('Error rating user:', error);
        alert('Greška prilikom ocenjivanja korisnika.');
      }
    }
  }
};
</script>

<style scoped>
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
}

.popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

form {
  display: grid;
  gap: 10px;
}

label {
  font-weight: bold;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.button {
  background-color: darkred;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
.button:hover {
  background-color: red;
}
</style>
