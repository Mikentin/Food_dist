'use strict';
import tabs from'./modules/tabs';
import modal from'./modules/modal';
import calc from'./modules/calc';
import card from'./modules/card';
import forms from'./modules/forms';
import slider from './modules/slider';
import timer from'./modules/timer';
import {openModal} from './modules/modal';

document.addEventListener('DOMContentLoaded', () => {

	const modalTimer = setTimeout(() => (openModal('.modal', modalTimer)), 300000);

	tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
	modal('[data-modal]', '.modal', modalTimer);
	calc();
	card();
	forms('form', modalTimer);
	timer('.timer', '2024-03-10');
	slider({
        container: '.offer__slider',
        slide: '.offer__slide',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });
});