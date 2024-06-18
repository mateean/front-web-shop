<template>
  <div class="home-view">
    <div class="filters">
      <!-- Search Bar -->
      <h2>Pretraga</h2>
      <div class="search-bar">
        <input type="text" v-model="searchQuery" @input="filterProducts">
      </div>

      <div class="filter-sort">
        <h3>Sortiraj</h3>
        <select v-model="sortOrder" @change="filterProducts">
          <option value="asc">Cena rastuće</option>
          <option value="desc">Cena opadajuće</option>
        </select>
      </div>

      <!-- Filters -->
      <div class="filter-category">
        <h2>Filteri</h2>
        <h3>Kategorija</h3>
        <div v-for="category in categories" :key="category.id">
          <input type="checkbox" :value="category.id" v-model="selectedCategories" @change="filterProducts">
          <label>{{ category.naziv }}</label>
        </div>
      </div>

      <div class="filter-tipProdaje">
        <h3>Tip Prodaje</h3>
        <div>
          <input type="checkbox" value="FIKSNA_CENA" v-model="selectedTipProdaje" @change="filterProducts">
          <label>Fiksna Cena</label>
        </div>
        <div>
          <input type="checkbox" value="AUKCIJA" v-model="selectedTipProdaje" @change="filterProducts">
          <label>Aukcija</label>
        </div>
      </div>

      <div class="filter-price">
        <h3>Cena</h3>
        <div>
          <label for="minPrice">Donja granica:</label>
          <input type="number" id="minPrice" v-model.number="minPrice">
        </div>
        <div>
          <label for="maxPrice">Gornja granica:</label>
          <input type="number" id="maxPrice" v-model.number="maxPrice">
        </div>
        <button @click="filterProducts">Primeni cenu</button>
      </div>
      <div>
        <button @click="resetFilters">Ponisti filtere</button>
      </div>
    </div>

    <!-- Product List -->
    <div class="product-list">
      <div class="list-container">
        <div v-for="product in displayedProducts" :key="product.id" class="product-card" @click="viewProduct(product.id)">
          <div class="image-container">
            <img :src="product.slika" alt="Product Image">
          </div>
          <div class="product-details">
            <h3>{{ product.naziv }}</h3>
            <p>{{ product.cena }} rsd</p>
            <!-- Additional product details can be added here -->
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Predhodna</button>
        <span>{{ currentPage }} od {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Sledća</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeView',
  data() {
    return {
      products: [],
      filteredProducts: [],
      categories: [],
      selectedCategories: [],
      selectedTipProdaje: [],
      minPrice: 0,
      maxPrice: 0,
      searchQuery: '',
      sortOrder: 'asc', // Default sort order
      currentPage: 1,
      productsPerPage: 10
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.productsPerPage);
    },
    displayedProducts() {
      const start = (this.currentPage - 1) * this.productsPerPage;
      const end = start + this.productsPerPage;
      return this.filteredProducts.slice(start, end);
    }
  },
  mounted() {
    this.fetchProducts();
    this.fetchCategories();
  },
  methods: {
    fetchProducts() {
      axios.get('http://localhost:8888/api/proizvod')
        .then(response => {
          console.log('Products API Response:', response.data);
          this.products = response.data;
          this.filterProducts(); // Apply initial filtering
          this.setMaxPrice();
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    },
    fetchCategories() {
      axios.get('http://localhost:8888/api/kategorija/')
        .then(response => {
          console.log('Categories API Response:', response.data);
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    },
    filterProducts() {
      // Filter products based on various criteria
      this.filteredProducts = this.products.filter(product => {
        const matchesCategory = this.selectedCategories.length === 0 || this.selectedCategories.includes(product.kategorija.id);
        const matchesTipProdaje = this.selectedTipProdaje.length === 0 || this.selectedTipProdaje.includes(product.tipProdaje);
        const matchesPrice = (this.minPrice === 0 || product.cena >= this.minPrice) && (this.maxPrice === 0 || product.cena <= this.maxPrice);
        const matchesSearch = product.naziv.toLowerCase().includes(this.searchQuery.toLowerCase()) || product.opis.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        // Filter out products that are sold
        const isNotSold = !product.prodat;

        return matchesCategory && matchesTipProdaje && matchesPrice && matchesSearch && isNotSold;
      });

      // Sort filtered products based on sortOrder
      if (this.sortOrder === 'asc') {
        this.filteredProducts.sort((a, b) => a.cena - b.cena);
      } else {
        this.filteredProducts.sort((a, b) => b.cena - a.cena);
      }

      // Reset pagination to the first page
      this.currentPage = 1;
    },
    resetFilters() {
      this.selectedCategories = [];
      this.selectedTipProdaje = [];
      this.minPrice = 0;
      this.maxPrice = 0;
      this.searchQuery = '';
      this.sortOrder = 'asc';
      this.filterProducts(); // Apply filters again after resetting
    },
    setMaxPrice() {
      const maxProduct = Math.max(...this.products.map(product => product.cena));
      this.maxPrice = maxProduct;
    },
    viewProduct(productId) {
      this.$router.push(`/product/${productId}`);
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }
};
</script>


<style scoped>
.home-view {
  display: flex;
  padding: 1rem;
  height: 100%; /* Ensures full height */
}

.filters {
  width: 17vw; /* Adjusted width for filters */
  height: 100%; /* Full height for filters */
  padding: 1rem;
  overflow-y: auto; /* Enables scroll if content exceeds height */
  text-align: left; /* Aligns all items to the left */
}

/* Style checkboxes */
.filters input[type="checkbox"] {
  appearance: none; /* Removes default styles */
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 50%; /* Makes checkboxes round */
  border: 2px solid darkred; /* Border color */
  background-color: white; /* Checkbox background */
  margin-right: 0.5rem; /* Adjust spacing */
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
}

.filters input[type="checkbox"]:checked {
  background-color: darkred; /* Filled circle when checked */
  border: 2px solid darkred; /* Keeps border color when checked */
}

.search-bar input[type="text"] {
  width: 80%;
  padding: 0.5rem;
  border: 2px solid darkred; /* Dark red border */
  border-radius: 5rem; /* Rounded corners */
  font-size: 1rem; /* Larger text */
  margin-bottom: 1rem; /* Add margin at the bottom */
  box-sizing: border-box;
}

/* Style price inputs */
.filters input[type="number"] {
  width: 30%;
  border: 2px solid darkred; /* Dark red border */
  border-radius: 5rem; /* Rounded corners */
  font-size: 1rem; /* Larger text */
  box-sizing: border-box;
  margin-bottom: 0.5rem;
}

/* Style buttons */
.filters button, .filters select {
  padding: 0.5rem 1rem;
  background-color: darkred; /* Button background color */
  color: white; /* Text color */
  border: none;
  border-radius: 4px; /* Rounded corners */
  margin-top: 0.5rem; /* Adjust spacing */
  cursor: pointer;
  transition: background-color 0.3s ease; /* Transition effect */
  display: inline-block;
}

.filters button:hover, .filters select:hover {
  background-color: #8b0000; /* Darken color on hover */
}

/* Adjust margin for titles */
.filters h2, .filters h3 {
  margin-top: 1rem;
  margin-bottom: 0.25rem;
}

.product-list {
  width: 70vw;
  padding: 1rem;
}

.list-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.product-card {
  cursor: pointer;
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow effect */
  width: 15rem;
  height: 22rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f9f9f9; /* Slight darker shade of white */
  transition: transform 0.2s ease-in-out; /* Transition effect for scaling */
  margin-bottom: 1rem; /* Margin at the bottom */
}

.product-card:hover {
  transform: scale(1.05); /* Scale up by 5% on hover */
}

.image-container {
  height: 75%;
  overflow: hidden;
}

.product-card img {
  width: auto;
  height: 100%;
  object-fit: cover;
}

.product-details {
  padding: 1rem;
  flex-grow: 1;
}

.product-details h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: darkred; /* Dark red background */
  color: white; /* White text */
  border: none;
  border-radius: 4px; /* Rounded corners */
  transition: background-color 0.3s ease; /* Transition effect */
}

.pagination button:hover {
  background-color: #8b0000; /* Darken color on hover */
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
