var data = {
  active: 0
}

if(window.localStorage) {
  var store = window.localStorage

  if(store.getItem('items')) {
    data.items = JSON.parse(store.getItem('items'))
  }
  else {
    data.items = [{
      size: 30,
      font: 'open-sans',
      top: {
        text: 'Horní text',
        size: 10,
        position: 72
      },
      middle: {
        text: "1",
        size: 50,
        position: 50
      },
      bottom: {
        text: 'Spodní text',
        size: 10,
        position: 78
      }
    }]
  }
}

Vue.filter('nl2br', function (value) {
  return value.replace(/\n/g, '<br>');
})

var svg_circle_text = Vue.component('svg_circle_text', {
  template: '#svg-circle-text',
  props: ['data']
})

var item = Vue.component('item', {
  template: '#item-template',
  props: ['item', 'index', 'active'],
  computed: {
    top_text: function() {
      return {
        key: 'top-' + this.index,
        text: {
          text: this.item.top.text,
          size: this.item.top.size
        },
        circle: {
          diam: this.item.top.position,
          rotate: -90,
          outer: 1
        }
      }
    },
    bottom_text: function() {
      return {
        key: 'bottom-' + this.index,
        text: {
          text: this.item.bottom.text,
          size: this.item.bottom.size
        },
        circle: {
          diam: this.item.bottom.position,
          rotate: -270,
          outer: 0
        }
      }
    },
    print_style: function() {
      return '.item-'+ this.index +' { width: '+ this.item.size +'mm; width: '+ this.item.size +'mm;}';
    }
  },
  methods: {
    makeActive: function(index) {
      this.$parent.active = index
    }
  }
})

var app = new Vue({
  el: '#app',
  data: data,
  methods: {
    makeActive: function(index) {
      this.active = index
    },
    duplicateItem: function(index) {
      var duplicate = JSON.parse(JSON.stringify(this.items[index]))
      this.items.splice(index, 0, duplicate)
      this.makeActive(index + 1)
    },
    deleteItem: function(index) {
      var confirm = window.confirm('Opravdu smazat?');
      if (confirm) {
        this.items.splice(index, 1)
        var activate = this.items[index - 1] ? index - 1 : 0
        this.makeActive(activate)
      }
    },
    printSheet: function() {
      window.print()
    }
  }
})

if(store) {
  app.$watch('items', function(items) {
    store.setItem('items', JSON.stringify(data.items))
  }, {
    deep: true
  })
}

