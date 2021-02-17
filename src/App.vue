<template>
  <div>
    <div class="header-wrapper">
      <header class="header-main container-fluid" role="banner">
        <h1 class="sitename">
          <router-link to="/">{{label}}</router-link>
        </h1>
      </header>
    </div>
    <nav class="navbar navbar-default" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed widget" data-toggle="collapse" data-name="navButton">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
              x="0px"
              y="0px"
              width="40px"
              height="30px"
              viewBox="0 0 40 30"
              overflow="visible"
              xml:space="preserve">
              <defs> </defs>
               <rect
                 y="0"
                 fill="#FFFFFF"
                 width="40"
                 height="3"></rect>
               <rect
                 y="7"
                 fill="#FFFFFF"
                 width="40"
                 height="3"></rect>
               <rect
                 y="14"
                 fill="#FFFFFF"
                 width="40"
                 height="3"></rect>
            </svg>
            <span class="sr-only">Toggle navigation</span>
          </button>
        </div>
        <div class="navbar-collapse">
          <ul class="nav navbar-nav">
            <li><router-link to="/" class="front">Home</router-link></li>
            <li><router-link to="/about" class="about">About</router-link></li>
            <li><router-link to="/browse" class="browse">Browse</router-link></li>
          </ul>
          <div class="search_holder widget navbar-form navbar-right" data-name="search_form">
            <form method="get" v-on:submit.prevent="onSubmit" role="search">
              <input name="q" v-model="searchTerm" type="text" placeholder="Search titles, subjects, authors..." title="Enter the terms you wish to search for." aria-label="Search">
              <input type="submit" class="submit-search" aria-label="Submit Search">
            </form>
          </div>
        </div>
      </div>
    </nav>
    <router-view/>
    <div class="footer-wrapper" v-if="visible">
      <div class="footer-wrapper-top">
         <footer class="footer-main container-fluid">
          <ul class="footer-nav" role="navigation">
            <li><router-link to="/" class="Homelink">Home</router-link></li>
            <li><router-link to="/about" class="Aboutlink">About</router-link></li>
            <li><router-link to="/browse" class="Browselink">Browse</router-link></li>
            <li class="accessibility-link">
              <a class="external" href=" https://www.nyu.edu/footer/accessibility.html" target="_blank">Accessibility <span aria-hidden="true" role="presentation"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 20 20" height="15" width="15"><path fill="none" stroke="#ffffff" stroke-width="1" d="m8.6,7H1v12h12V11.4M9,1v2l2,2-6,6 4,4 6-6 2,2h2V1z"/></svg></span></a>
            </li>
            <li class="feedback-link">
              <a href="https://nyu.qualtrics.com/jfe/form/SV_8zQOuCi9g0JUVsV?site=indianocean&l=f" target="_blank">Send Feedback <span aria-hidden="true" role="presentation"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 20 20" height="15" width="15"><path fill="none" stroke="#ffffff" stroke-width="1" d="m8.6,7H1v12h12V11.4M9,1v2l2,2-6,6 4,4 6-6 2,2h2V1z"/></svg></span></a>
            </li>
          </ul>
        </footer>
      </div>
      <footer class="footer-main container-fluid" role="contentinfo">
        <div class="logo">
          <a href="http://nyu.edu/" target="_blank">
            <img src="/images/nyu_short_white.svg" alt="NYU" >
          </a>
        </div>
        <div class="partner-wrapper">
          <div class="partner-fales">
            <a href="http://www.nyu.edu/library/bobst/research/fales/" title="Fales Library and Special Collections" target="_blank">Fales Library and Special Collections</a>
          </div>
          <div class="partner-sochum">
            <a href="http://guides.nyu.edu/cat.php?cid=20969" title="Social Sciences and Humanities Department" target="_blank">Social Sciences and Humanities Department</a>
          </div>
          <div class="partner-nyuad">
            <a href="http://nyuad.nyu.edu/" title="NYU Abu Dhabi" target="_blank">NYU Abu Dhabi</a>
          </div>
          <div class="partner-dlts">
            <a href="http://dlib.nyu.edu/dlts/" title="Digital Library Technology Services" target="_blank">Digital Library Technology Services</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style src="@/sass/style.scss" lang="scss"></style>

<script>
export default {
  name: 'App',
  watch: {
    $route (to, from) {
      const current = to?.name?.toLowerCase()
      const back = from?.name?.toLowerCase()
      document.body.classList.add(current)
      if (to.path !== '/search') {
        this.searchTerm = ''
      }
      if (current && current === 'book') {
        this.visible = false
      } else {
        this.visible = true
      }
      if (from) {
        document.body.classList.remove(back)
      }
    }
  },
  data: function () {
    return {
      label: 'Indian Ocean Digital Collection',
      visible: true,
      searchTerm: ''
    }
  },
  mounted: function () {
    document.body.classList.add(this.$route?.name?.toLowerCase())
  },
  methods: {
    onSubmit: function () {
      this.$router.push(
        {
          path: '/search',
          query: {
            q: this.searchTerm
          }
        }
      )
    }
  }
}
</script>
