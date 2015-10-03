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
