"use strict"

document.addEventListener("DOMContentLoaded", () => {
    const tabs = require('./modules/tabs'),
          modal = require('./modules/modal'),
          calc = require('./modules/calc'),
          card = require('./modules/card'),
          forms = require('./modules/forms'),
          slider = require('./modules/slider'),
          timer = require('./modules/timer')

    tabs();
    modal();
    calc();
    card();
    forms();
    slider();
    timer();
});