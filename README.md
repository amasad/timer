## Timer

![image](https://i.cloudup.com/AlUzlbkKnQ-3000x3000.png)

### Usage

    component install amasad/timer

```javascript
var Timer = require('timer');
var $ = require('jquery');

var timer = new Timer({
  interval: 15,
  outerRadius: 50,
  onComplete: function () {
    alert('complete');
  }
});
$(timer).on('step', function (e, timeleft) {
  console.log(timeleft);
});

$('body').append(timer.$el);

timer.start();
```
