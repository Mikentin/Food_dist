"use strict"

document.addEventListener("DOMContentLoaded", () => {
    
    //Tabs
    
    const tabs = document.querySelectorAll(".tabheader__item"),
          tabsContent = document.querySelectorAll (".tabcontent"),
          tabsParent = document.querySelector(".tabheader__items");

    function hideTabContent () {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        })
        
        tabs.forEach(item => {
            item.classList.remove("tabheader__item_active")
        })
        
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');

        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener("click", (e) => {
        const target = e.target;
        if(target && target.classList.contains("tabheader__item")) {
           tabs.forEach((item, i) => {
            if (target == item) {
                hideTabContent();
                showTabContent(i);
            }
           })
        }
    })

    //Timer

    const deadline = '2024-02-28';

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if( t <= 0 ) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        }
              

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
       return (num >= 0 && num < 10) ? `0${num}`:  num;
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(upadateClock, 1000);
   
            upadateClock();

        function upadateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    //Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    function openModal () {
            modal.classList.add('show');
            modal.classList.remove('hide');
            document.body.style.overflow = "hidden";
            clearInterval(modalTimer);
        }
    
    function closeModal () {
            modal.classList.add('hide');
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }

    modalTrigger.forEach(btn => {btn.addEventListener('click', openModal)});

    modal.addEventListener('click', (e) => {
        if(e.target === modal || e.target.getAttribute('data-close') == ''){
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if(e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimer = setTimeout(openModal, 300000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Используем класы для карточек 

    class MenuCard {
        constructor(src, alt, title, description, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.description = description;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price *= this.transfer;
        }

        refer(){
            const element = document.createElement('div');

            element.innerHTML = `<div class="menu__item">
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.description}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
        </div>`

        this.parent.append(element)
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, ".menu .container").refer();
            });
        });


    //Forms

    const forms = document.querySelectorAll('form')

    const message = {
        success: 'Спасибо, мы скоро с Вами свяжемся',
        loading: 'img/form/spinner.svg',
        failure: 'Что то пошло не так'
    };
    forms.forEach(item => {bindPostData(item)});

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            header: {
                'Content-type':'application/json'
            },
            body: data
        })
        return await res.json();
    }

    function bindPostData (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            //message.loading
            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()))

            postData('http://localhost:3000/requests', json)
            .then(data => { 
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove()
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });

            // request.send(formData);

            // request.addEventListener('load', () => {
            //     if(request.status === 200) {
            //         console.log(request.response)
            //         showThanksModal(message.success);
            //         form.reset();
            //        statusMessage.remove();
            //     }
            //     else {
            //         showThanksModal(message.failure);
            //     }
            // })
            
        })
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        ` 
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add("show");
            prevModalDialog.classList.remove("hide");
            closeModal();
        }, 4000);
    }

    // Slider

    // const slides = document.querySelectorAll('.offer__slide'),
    //       next = document.querySelector('.offer__slider-next'),
    //       prev = document.querySelector('.offer__slider-prev'),
    //       curr = document.querySelector('#current'),
    //       total = document.querySelector('#total');
    // let slideIndex = 1;

    // showSlider(slideIndex);

    // if(slides.length < 10) {
    //     total.textContent = `0${slides.length}`
    // }
    // else {
    //     total.textContent = slides.length;

    // function showSlider(n){
    //     if(n > slides.length) {
    //         slideIndex = 1;
    //     }

    //     if(n < 1) {
    //         slideIndex = slides.length;
    //     }

    //     slides.forEach(item => item.style.display = 'none');
    //     slides[slideIndex - 1].style.display = 'block'

    //     if(slideIndex < 10) {
    //         curr.textContent = `0${slideIndex}`
    //     } else {
    //     total.textContent = slides.length;
    //     }

    // function changeSlide(n) {
    //     showSlider(slideIndex += n)
    // }

    // next.addEventListener('click', () => {
    //     changeSlide(1)
    // })

    // prev.addEventListener('click', () => {
    //     changeSlide(-1)
    // })

    //Slider variant 2

    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          next = document.querySelector('.offer__slider-next'),
          prev = document.querySelector('.offer__slider-prev'),
          curr = document.querySelector('#current'),
          total = document.querySelector('#total'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1,
        offset = 0;

        if(slides.length < 10) {
            total.textContent = `0${slides.length}`;
            curr.textContent = `0${slideIndex}`
        } else {
            total.textContent = slides.length;
            curr.textContent = slideIndex;
        }

    slidesField.style.width = 100 * slides.length + "%";
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    })

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots = [];

    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
    `;

    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
        box-sizing: content-box;
        flex: 0 1 auto;
        width: 30px;
        height: 6px;
        margin-right: 3px;
        margin-left: 3px;
        cursor: pointer;
        background-color: #fff;
        background-clip: padding-box;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        opacity: .5;
        transition: opacity .6s ease;
        `;

        if(i == 0){
            dot.style.opacity = 1;
        }

        indicators.append(dot)

        dots.push(dot);
    }

    next.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == slides.length) {
            slideIndex = 1
        } else {
            slideIndex++
        }

        if (slides.length < 10) {
            curr.textContent = `0${slideIndex}`
        } else {
            curr.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    })

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2)
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--
        }

        if (slides.length < 10) {
            curr.textContent = `0${slideIndex}`
        } else {
            curr.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    })

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = +width.slice(0, width.length - 2) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            if(slides.length < 10) {
                curr.textContent = `0${slideIndex}`
            } else {
                curr.textContent = slideIndex;
            }

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = 1;

            
        })
    })
    
});