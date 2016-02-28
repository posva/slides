// Require Node modules in the browser thanks to Browserify: http://browserify.org
var bespoke = require('bespoke'),
  nebula = require('bespoke-theme-nebula'),
  keys = require('bespoke-keys'),
  touch = require('bespoke-touch'),
  bullets = require('bespoke-bullets'),
  backdrop = require('bespoke-backdrop'),
  hash = require('bespoke-hash'),
  substeps = require('bespoke-substeps/dom'),
  progress = require('bespoke-progress');
require('../../../lib/stereo');

// Bespoke.js
stereo.makeMeMaster();
bespoke.from('article', [

  function(deck) {
    var refreshState = function() {
      console.log('master:', stereo.isMaster())
      if (stereo.isMaster()) {
        deck.parent.classList.add('hide-notes');
        deck.parent.classList.remove('show-notes');
      } else {
        deck.parent.classList.add('show-notes');
        deck.parent.classList.remove('hide-notes');
      }
    };
    // For some reason the broadcast doesn't work...
    //refreshState();
    //stereo.on('slider', refreshState);
    //stereo.emit('slider');
    //stereo.broadcast('slider');
    deck.on('activate', function(event) {
      refreshState();
      if (!event.id && !event.ignore && !event.move) {
        event.id = stereo.id;
        stereo.broadcast('slide', event);
      }
    });
    deck.on('next', function(event) {
      if (!event.id && !event.ignore) {
        event.id = stereo.id;
        stereo.broadcast('next', event);
      }
    });
    stereo.on('slide', function(event) {
      if (event.id !== stereo.id) {
        if (deck.slide() !== event.index)
          deck.slide(event.index, event);
        if (!stereo.isMaster()) {
          event.ignore = true;
          deck.next(event);
        } else {
          if (event.index === deck.slide())
            deck.prev(event);
        }
      }
    });
    stereo.on('next', function(event) {
      if (event.id !== stereo.id) {
        deck.next(event);
      }
    });
  },
  nebula(),
  keys(),
  touch(),
  bullets('ul.ul-bullet li, .bullet'),
  substeps(),
  backdrop(),
  hash(),
  progress()
]);

// Prism syntax highlighting
require('prismjs/components/prism-core');
require('prismjs/components/prism-clike');
require('prismjs/components/prism-javascript');
require('prismjs/components/prism-coffeescript');
require('prismjs/components/prism-css');
require('prismjs/components/prism-stylus');
require('prismjs/components/prism-markup');
require('prismjs/components/prism-jade');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-git');

require('prismjs/plugins/line-highlight/prism-line-highlight');

(function() {
  new Vue({
    el: '#hello-world',
    data: {
      value: 'Hello World'
    }
  });

  new Vue({
    el: '#v-for',
    data: {
      items: [0, 1]
    }
  });

  new Vue({
    el: '#v-show',
    data: {
      show: false,
    }
  });

  new Vue({
    el: '#v-transition',
    data: {
      show: false,
    }
  });

  new Vue({
    el: '#filters',
    data: {
      obj: {
        bool: true,
        arr: [1, 2],
        inner: {
          a: null
        }
      }
    }
  });
})();
