<template>
  <main class="main container-fluid" role="main">
    <header>
      <h2 class="page-title">{{label}} for: <span v-html="searchTerm"></span></h2>
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
  name: 'Search',
  props: {
    searchTerm: String,
    currentPage: {
      type: Number,
      default: 1
    },
    sortByOption: {
      type: String,
      default: 'ss_longlabel asc'
    }
  },
  components: {
    'search-solr': SearchSolr
  },
  data: function () {
    return {
      label: 'Search Results'
    }
  }
}
</script>
