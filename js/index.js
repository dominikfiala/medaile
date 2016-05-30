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
        position: 72,
        spacing: 0
      },
      middle: {
        text: '1',
        size: 50,
        position: 50,
        spacing: 0
      },
      bottom: {
        text: 'Spodní text',
        size: 10,
        position: 78,
        spacing: 0
      }
    }]
  }
}

Vue.filter('nl2br', function (value) {
  return value.replace(/\n/g, '<br>')
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
          size: this.item.top.size,
          spacing: this.item.top.spacing
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
          size: this.item.bottom.size,
          spacing: this.item.bottom.spacing
        },
        circle: {
          diam: this.item.bottom.position,
          rotate: -270,
          outer: 0
        }
      }
    },
    item_style: function() {
      return '@media print { .item-'+ this.index +' { width: '+ this.item.size +'mm; height: '+ this.item.size +'mm; } } @media screen { .item-'+ this.index +' { width: '+ this.item.size * 6 +'px; height: '+ this.item.size * 6 +'px; } }'
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
      var confirm = window.confirm('Opravdu smazat?')
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
