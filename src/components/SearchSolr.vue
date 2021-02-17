<template>
<div>
  <header>
    <div v-if="items.length > 0">
      <div class="resultsnum">
        Showing items <span class="start" v-html="start + 1"></span> - <span class="docslength" v-html="this.items.length + this.start"></span> of <span class="numfound" v-html="Number(numFound).toLocaleString()"></span>  sesults
      </div>
      <div class="filters">
        <select v-model="sortByOptionSelected" id="browse-select" aria-label="Search Sort Results">
          <option v-for="option in sortByOptions" :key="option.field" :value="option.field">{{option.label}}</option>
        </select>
      </div>
    </div>
    <div v-if="items.length < 1">
      <p>Sorry, no results found.</p>
      <p>Try a different term.</p>
    </div>
  </header>
  <div class="widget" v-if="items.length > 0">
    <div class="item-list flex-container">
      <article class="item" v-for="item in items" :key="item.identifier" :data-score="item.score">
        <div class="card">
          <div class="thumbs">
            <div class="clipper">
              <router-link :to="`/books/${item.identifier}/1`" aria-hidden="true" role="presentation" tabindex="-1">
                <img :src="item.thumbnail" :alt="item.bundle" :title="item.title" role="presentation">
              </router-link>
            </div>
          </div>
          <h1 class="md_title">
            <router-link :to="`/books/${item.identifier}/1`">{{item.title}}</router-link>
          </h1>
          <div class="md_authors">
            <span class="md_label">Author:</span>&nbsp;
            <span class="md_author" v-for="author, aid in item.authors" :key="aid">{{author}}</span>
          </div>
          <div class="md_publisher">
            <span class="md_label">Publisher:</span>&nbsp;
            <span v-for="publocation, pid in item.publocation" :key="pid">{{publocation}}</span>, <span v-for="publisher in item.publishers" :key="publisher">{{publisher}}</span>, {{item.pubdate}}
          </div>
          <div class="md_provider">
            <span class="md_label">Provider:</span>&nbsp;
            <span v-for="partners, ppid in item.partners" :key="ppid">{{partners}}</span>
          </div>
          <div class="md_subjects">
            <span class="md_label">Subjects:</span>&nbsp;
            <router-link v-for="subject, sid in item.subjects" :key="sid" :to="`/search?q=${subject}`" class="md_subject">{{subject}}</router-link>
          </div>
        </div>
      </article>
      <article class="item"></article>
      <article class="item"></article>
    </div>
    <div class="overflow-auto" v-if="numFound > rowsPerPage">
      <b-pagination align="center" v-model="currentPagerPage" :per-page="rowsPerPage" :total-rows="numFound"></b-pagination>
    </div>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { BPagination } from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueAxios, axios)
Vue.component('b-pagination', BPagination)

export default {
  name: 'SearchSolr',
  props: {
    api: {
      type: String,
      default: 'https://stage-sites.dlib.nyu.edu/viewer/api/v1/search'
    },
    searchTerm: {
      type: String,
      default: ''
    },
    sortByOption: {
      type: String,
      default: 'ss_longlabel asc'
    },
    currentPage: {
      type: Number,
      default: 1
    },
    rowsPerPage: {
      type: Number,
      default: 12
    },
    fields: {
      type: Array,
      default: function () {
        return [
          'bundle',
          'bundle_name',
          'sm_field_identifier',
          'ss_representative_image',
          'ss_book_identifier',
          'ss_title_long',
          'sm_author',
          'sm_author',
          'sm_publisher',
          'ss_pubdate',
          'sm_collection_partner_label',
          'sm_subject_label',
          'ss_publocation',
          'sm_collection_partner_label',
          'sm_field_publication_location'
        ]
      }
    },
    facetQuery: {
      type: Array,
      default: function () {
        return [
          {
            filter: 'hash',
            value: '705lna'
          },
          {
            filter: 'sm_collection_code',
            value: 'io'
          }
        ]
      }
    },
    sortByOptions: {
      type: Array,
      default: function () {
        return [
          {
            field: 'ss_longlabel asc',
            label: 'Sort by Title'
          },
          {
            field: 'ss_sauthor asc',
            label: 'Sort by Author'
          },
          {
            field: 'ss_ssubject asc',
            label: 'Sort by Subject'
          },
          {
            field: 'ss_publocation asc',
            label: 'Sort by Place'
          }
        ]
      }
    }
  },
  computed: {
    sortByOptionSelected: {
      get: function () {
        return this.sortByOption
      },
      set: function (option) {
        this.$router.push({
          path: this.$router.currentRoute.path,
          query: {
            q: this.searchTerm,
            page: this.currentPagerPage,
            sort: option
          }
        })
      }
    },
    currentPagerPage: {
      get: function () {
        return this.currentPage
      },
      set: function (page) {
        this.$router.push({
          path: this.$router.currentRoute.path,
          query: {
            q: this.searchTerm,
            page: page,
            sort: this.sortByOptionSelected
          }
        })
      }
    }
  },
  mounted: function () {
    this.initRequest()
  },
  data: function () {
    return {
      start: 0,
      numFound: 0,
      items: []
    }
  },
  watch: {
    '$route.params': function () {
      this.initRequest()
    }
  },
  methods: {
    initRequest: function () {
      const facetQuery = []
      if (this.currentPagerPage <= 1) {
        this.start = 0
      } else {
        this.start = (this.currentPagerPage * this.rowsPerPage) - this.rowsPerPage
      }
      for (const facet of this.facetQuery) {
        facetQuery.push(`fq=${facet.filter}:${facet.value}`)
      }
      this.axios.get(`${this.api}/select?query=${this.searchTerm}&start=${this.start}&rows=${this.rowsPerPage}&fl=${this.fields.join(',')}&${facetQuery.join('&')}&sort=${this.sortByOption}`).then(response => {
        this.numFound = response.data.numFound
        this.items = []
        response.data.docs.map((item) => {
          this.items.push({
            score: item.score,
            title: item.ss_title_long,
            type: item.bundle.replace('dlts_', ''),
            identifier: item.sm_field_identifier[0],
            thumbnail: item.ss_representative_image,
            bundle: item.bundle_name,
            pubdate: item.ss_pubdate,
            publishers: item.sm_publisher,
            publocation: item.sm_field_publication_location,
            partners: item.sm_collection_partner_label,
            subjects: item.sm_subject_label,
            authors: item.sm_author
          })
        })
      })
    }
  }
}
</script>
