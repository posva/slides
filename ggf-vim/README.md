# Gotta Go Fast: Vim
> A [Bespoke.js](http://markdalgleish.com/projects/bespoke.js) presentation, built with [generator-bespoke](https://github.com/markdalgleish/generator-bespoke)

do `gulp serve` to start the presentation in dev mode

To create the thumbail I tried using webshot but it doesn't work with Bespoke.
Instead I screenshot a fulscreen version of the first slide and then use convert
to get a smaller version of it: `convert screenshot.png -resize 320
dist/thumb.png`
