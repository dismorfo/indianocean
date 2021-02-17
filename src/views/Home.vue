<template>
  <main class="main container-fluid" role="main">
    <header>
      <h2 class="page-title">{{label}}</h2>
    </header>
    <search-solr
      :searchTerm="searchTerm"
      :currentPage="currentPage"
      :sortByOption="sortByOption"
    ></search-solr>
  </main>
</template>

<script>
import SearchSolr from '../components/SearchSolr.vue'
export default {
  name: 'Home',
  components: {
    'search-solr': SearchSolr
  },
  props: {
    searchTerm: {
      type: String,
      default: '*'
    },
    currentPage: {
      type: Number,
      default: 1
    },
    sortByOption: {
      type: String,
      default: 'ss_longlabel asc'
    }
  },
  data: function () {
    return {
      label: 'Monographs, Maps, Postcards, Prints',
      sortBy: 'ss_longlabel asc'
    }
  }
}
</script>
