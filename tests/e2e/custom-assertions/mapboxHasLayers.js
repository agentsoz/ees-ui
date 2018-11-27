// A custom Nightwatch assertion.
// The assertion name is the filename.
// Example usage:
//
//   browser.assert.mapboxHasLayers(selector)
//
// For more information on custom assertions see:
// http://nightwatchjs.org/guide#writing-custom-assertions

exports.assertion = function mapboxHasLayers(match, count) {
  this.message = `Testing if mapbox has expected layers`;
  this.expected = count;
  this.pass = val => val === count;
  this.value = res => res.value;
  function evaluator(_match) {
    var actionTags = document.querySelectorAll('a')
    var vueLinkedElem = null;
    // not every element has a vue attribute, lets find the navbar 'a' tag
    for( var tag of actionTags ) {
      if ( tag.__vue__ ) {
        vueLinkedElem = tag;
        break;
      }
    }
    layers = vueLinkedElem.__vue__.$store.getters.mapInstance.getStyle().layers;
    return layers.filter(layer => layer.id.includes(_match)).length;
  }
  this.command = cb => this.api.execute(evaluator, [match], cb);
};
