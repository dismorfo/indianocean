<template>
  <iframe
    role="main"
    id="book"
    :src="src"
    :title="title"
    :height="availableHeight"
    class="widget book"
    allowfullscreen mozallowfullscreen webkitallowfullscreen>
  </iframe>
</template>

<script>
export default {
  name: 'Book',
  props: {
    identifier: String,
    sequence: String
  },
  data: function () {
    return {
      title: '',
      src: '',
      availableHeight: 0
    }
  },
  destroyed: function () {
    window.removeEventListener('resize', this.calculateAvailableHeight)
  },
  mounted: function () {
    const vm = this
    window.addEventListener('message', function (event) {
      if (event.origin === 'https://sites.dlib.nyu.edu') {
        const message = decodeURIComponent(event.data)
        const data = message.split('&')
        const params = {}
        for (let i = 0; i < data.length; i++) {
          const pair = data[i].split('=')
          params[pair[0]] = decodeURIComponent(pair[1])
        }
        const result = JSON.parse(params.message)
        if (result) {
          document.title = result.data.title
        }
        // Update the browser history outside Vue router
        // so that the history object works as it should.
        if (result.fire === 'openlayers:change') {
          window.history.replaceState({}, null, `/books/${vm.identifier}/${result.data.sequence}`)
        }
      }
    }, false)
    window.addEventListener('resize', this.calculateAvailableHeight)
    this.calculateAvailableHeight()
    this.src = `https://sites.dlib.nyu.edu/viewer/books/${this.identifier}/${this.sequence}?embed=1&lang=en`
  },
  methods: {
    calculateAvailableHeight: function () {
      const widget = document.querySelector('.widget.book')
      let availableHeight = window.innerHeight
      let sibling = widget.parentNode.firstChild
      while (sibling) {
        if (sibling.nodeType === 1 && sibling !== widget) {
          availableHeight = availableHeight - sibling.offsetHeight
        }
        sibling = sibling.nextSibling
      }
      this.availableHeight = availableHeight
    }
  }
}
</script>
