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

// Bespoke.js
bespoke.from('article', [
  nebula(),
  keys(),
  touch(),
  bullets('ul.bullet li, .bullet'),
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
Prism.languages.markup = {
  'comment': /<!--[\w\W]*?-->/,
  'prolog': /<\?.+?\?>/,
  'doctype': /<!DOCTYPE.+?>/,
  'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
    'tag': {
      pattern: /<\/?[\w:-]+\s*(?:\s+[\w:@\.-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/i,
      inside: {
        'tag': {
          pattern: /^<\/?[\w:-]+/i,
          inside: {
            'punctuation': /^<\/?/,
            'namespace': /^[\w-]+?:/
          }
        },
        'attr-value': {
          pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
          inside: {
            'punctuation': /=|>|"/
          }
        },
        'punctuation': /\/?>/,
        'attr-name': {
          pattern: /[\w:\.@-]+/,
          inside: {
            'namespace': /^[\w-]+?:/
          }
        }

      }
    },
    'entity': /&#?[\da-z]{1,8};/i
};
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
