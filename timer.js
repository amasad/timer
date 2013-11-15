var $ = require('jquery');
var d3 = require('d3');

var SEC = 1000;
var TWOPI = 2 * Math.PI;

function Timer (options) {
  if (!options.interval) {
    throw new Error('Please set an interval');
  }

  this.$el = $('<div/>', { class: 'component-timer' });
  this.interval = options.interval;
  this.timeLeft = options.interval;
  this.progressWidth = options.progressWidth || 5;
  this.outerRadius = options.outerRadius || this.$el.height() / 2;
  this.innerRadius = this.outerRadius - this.progressWidth;
  this.d3Container = d3.select(this.$el[0]);
  this.svg = this.d3Container.append('svg').style('width', this.outerRadius * 2);
  this._completeCallback = options.onComplete || function () {};

  this._initialDraw();
}

Timer.prototype._initialDraw = function () {
  this.group = this.svg.append('g').attr(
    'transform',
    'translate(' + this.outerRadius + ',' + this.outerRadius +')'
  );

  this.group.append('path').attr('fill', '#eee');
  this._updatePath(1);

  var arc = d3.svg.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius);
  this.group.append('text')
      .text(this.timeLeft)
      .attr('fill', '#eee')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle');
};

Timer.prototype.start = function() {
  this.timeout = setTimeout(function () {
    this._decrementTime();
    this._updatePath(this.timeLeft / this.interval);
  }.bind(this), SEC);
};

Timer.prototype.stop = function () {
  if (this.timeout) clearTimeout(this.timeout);
};

Timer.prototype._decrementTime = function() {
  this.timeLeft--;
  $(this).trigger('step', this.timeLeft);

  var text = this.group.select('text');
  text.text(this.timeLeft);
  if (this.timeLeft === 0) {
    this._completeCallback();
  } else {
    this.start();
  }
};

Timer.prototype._updatePath = function (ratioLeft) {
  var path = this.group.select('path');
  path.attr(
    'd',
    d3.svg.arc()
      .startAngle(TWOPI)
      .endAngle(TWOPI * (1 - ratioLeft))
      .innerRadius(this.innerRadius)
      .outerRadius(this.outerRadius)
  );
};


module.exports = Timer;
