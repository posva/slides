// Require Node modules in the browser thanks to Browserify: http://browserify.org
'use strict';
var bespoke = require('bespoke'),
  nebula = require('bespoke-theme-nebula'),
  keys = require('bespoke-keys'),
  touch = require('bespoke-touch'),
  bullets = require('bespoke-bullets'),
  backdrop = require('bespoke-backdrop'),
  hash = require('bespoke-hash'),
  substeps = require('bespoke-substeps/dom'),
  notes = require('bespoke-notes/dom'),
  progress = require('bespoke-progress');
require('../../../lib/stereo');

// Bespoke.js
bespoke.from('article', [

  function(deck) {
    if (stereo.isMaster()) {
      deck.parent.classList.add ('hide-notes');
    } else {
      deck.parent.classList.add ('show-notes');
    }
    deck.on('activate', function(event) {
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
  notes(),
  nebula(),
  keys(),
  touch(),
  bullets('li, .bullet'),
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
