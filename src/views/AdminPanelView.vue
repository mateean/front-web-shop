<template>
  <div class="admin-panel">
    <div class="admin-content">
      <div class="reviews">
        <h2>Ocene</h2>
        <div class="review-card" v-for="review in reviews" :key="review.id">
          <p><strong>Ocena:</strong> {{ review.ocena }}</p>
          <p><strong>Komentar:</strong> {{ review.komentar }}</p>
          <p><strong>Korisnik:</strong> {{ review.korisnikDaoRecenziju ? `${review.korisnikDaoRecenziju.ime} ${review.korisnikDaoRecenziju.prezime}` : 'Unknown' }}</p>
          <p><strong>Ocenjeni korisnik:</strong> {{ review.korisnikNaKogaSeOdnosiRecenzija ? `${review.korisnikNaKogaSeOdnosiRecenzija.ime} ${review.korisnikNaKogaSeOdnosiRecenzija.prezime}` : 'Unknown' }}</p>
          <button @click="deleteReview(review.id)" class="action-button delete-button">Obrisi</button>
        </div>
        <div v-if="reviews.length === 0">
          <p>No reviews found.</p>
        </div>
      </div>

      <div class="reports">
        <h2>Prijave</h2>
        <div class="report-card" v-for="report in reports" :key="report.id">
          <div class="report-details">
            <p><strong>Reported User ID:</strong> {{ report.podnosilac ? report.podnosilac.id : 'Unknown' }}</p>
            <p><strong>Razlog prijave:</strong> {{ report.razlogPrijave }}</p>
          </div>
          <div class="report-actions">
            <button @click="blockUser(report)" class="action-button block-button">Blokiraj</button>
            <button @click="rejectReport(report)" class="action-button reject-button">Odbij</button>
          </div>
        </div>
        <div v-if="reports.length === 0">
          <p>No reports found.</p>
        </div>
      </div>
    </div>

    <div v-if="reviews.length === 0 && reports.length === 0">
      <p>No reviews or reports found.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminPanel',
  data() {
    return {
      reviews: [],
      reports: []
    };
  },
  created() {
    this.fetchReports();
    this.fetchReviews();
  },
  methods: {
    async fetchReports() {
      try {
        const response = await axios.get('http://localhost:8888/prijave/all');
        this.reports = response.data;
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    },
    async fetchReviews() {
      try {
        const response = await axios.get('http://localhost:8888/recenzije/all');
        this.reviews = response.data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    },
    async blockUser(report) {
      // Implement your logic to block the user associated with the report
      console.log('Blocking user with ID:', report.podnosilac.id);
      // Example: You might make an API call to block the user
      // await axios.post(`http://localhost:8888/block-user/${report.podnosilac.id}`);
    },
    async rejectReport(report) {
      // Implement your logic to reject the report
      console.log('Rejecting report:', report.id);
      // Example: You might make an API call to reject the report
      // await axios.post(`http://localhost:8888/reject-report/${report.id}`);
    },
    async deleteReview(reviewId) {
      try {
        // Make an API call to delete the review
        await axios.delete(`http://localhost:8888/recenzije/${reviewId}`);
        // Remove the deleted review from the local data
        this.reviews = this.reviews.filter(review => review.id !== reviewId);
        console.log(`Review with ID ${reviewId} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting review with ID ${reviewId}:`, error);
      }
    }
  }
};
</script>

<style scoped>
.admin-panel {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
}

.admin-content {
  display: flex;
  gap: 20px;
}

.reviews {
  flex: 1;
}

.reports {
  flex: 1;
}

.review-card,
.report-card {
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.report-details {
  flex: 1;
}

.report-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  padding: 8px 16px;
  background-color: darkred;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: red;
}

.block-button {
  background-color: darkred;
}

.reject-button {
  background-color: darkred;
}

.delete-button {
  background-color: darkred;
}
</style>
