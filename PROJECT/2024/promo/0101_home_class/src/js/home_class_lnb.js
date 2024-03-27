import { PT_STATE, util as _ } from './modules/bs_common';

$(document).ready(function(){

        const tabSwiper = new Swiper('.pt_tab_swiper_mo', {
            slidesPerView: 'auto',
            navigation: {
                prevEl: '.sec_nav .pt_arrow_box .pt_slide_prev',
                nextEl: '.sec_nav .pt_arrow_box .pt_slide_next',
            },
            breakpoints: {
                769 : {
                    allowTouchMove: false
                }
            },
            on: {
                breakpoint: function() {
                    var that = this;
                    setTimeout(function() {
                        that.slideTo(0, 0);
                    }, 150);
                }
            }
        })

    viewportChange(); // fold 해상도 대응
});
