import { PT_STATE, util as _ } from './modules/bs_common';
import { anchor } from './modules/anchor';
import { accordian } from './modules/accordian';
import { tab } from './modules/tab';
import { modal } from './modules/modal';
import { modalOrigin } from "./modules/modalOrigin";
// import { coupon, promoCoupon } from './modules/coupon';
import { sticky } from './modules/sticky';

function imgLozad() {
    const observerbg = lozad(".pt_bg-image", {
        loaded: function (el) {
            el.classList.add("pt_add-bg");
        },
    });
    observerbg.observe();
}
let hubSlide;
function setSwiper() {

    // hub swiper
    hubSlide = new Swiper('.sec_hub .pt_swiper', {
        slidesPerView: 'auto',
        breakpoints: {
            769: {
                allowTouchMove: false,
            },
        },
        on: {
            // breakpoint: function(){
            //     let _self = this;
            //     setTimeout(function(){
            //         _self.slideTo(0, 0);
            //     }, 150);
            // },
            // breakpoint: function() {
            //     let stickyMove = function(){
            //         let navTab = $(".sec_nav");
            //         let _navHeight = navTab.outerHeight();
            //         let scrollTop = $(this).scrollTop();
            //         let scrollClass =  _.pxToVw(-142, -167);
            //         let setNavFixed = ['.sec_buying', '.sec_spec', '.sec_benefit', '.sec_tradein', '.pt_bnf__item-mygalaxyclub'];

            //         setNavFixed.forEach((fixedClass, index)=>{
            //             if(($(fixedClass).offset().top - _navHeight + scrollClass) <= scrollTop){
            //                 navSlide.slideTo(index);
            //                 return;
            //             }
            //         });

            //     }

            //     $(window).on('scroll.sticky', stickyMove);
            // }
        }
    });
    if(_.isMobile()) {hubSlide.slideTo(1,0);}

    let rollingSwiper = new Swiper(".pt_rolling", {
        slidesPerView: 'auto',
        // effect: "fade",
        direction: 'vertical',
        observer:true,
        observeParents:true,
        lazy:true,
        preloadImages:false,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.pt_rolling__page',
            type: 'fraction',
        },
        navigation: {
            nextEl: ".pt_rolling__next",
            prevEl: ".pt_rolling__prev",
        },
        loop: true,
        on: {
            breakpoint: function() {
                const that = this;
                setTimeout(function() {
                    that.slideTo(0, 0);
                }, 150);
            },
            init: function() {
                $('.swiper-control').on('click', function(){
                    $(this).toggleClass("pt_pause pt_play");
                    if($(this).hasClass("pt_pause")) {
                        rollingSwiper.autoplay.start();
                        $('.swiper-control').html('일시정지');
                    } else {
                        rollingSwiper.autoplay.stop();
                        $('.swiper-control').html('시작');

                    }
                })
            }
        },
        breakpoints: {
            769: {
                loop: true
            },
        },
    });
}

$(document).ready(function(){

    setSwiper();

    // promoCoupon.init();
    modal.init();
    modalOrigin.init();
    modal.toggle([
        // pt_modal의 id와 동일한 값을 부여
        {
            el: '[data-role-anchor-modal="modal_tradein01"]',
            target: "#modal_tradein01",
            group: "pt_modal_tradein",
        },
        {
            el: '[data-role-anchor-modal="modal_tradein02"]',
            target: "#modal_tradein02",
            group: "pt_modal_tradein",
        },
        {
            el: '[data-role-anchor-modal="modal_tradein03"]',
            target: "#modal_tradein03",
            group: "pt_modal_tradein",
        },
        {
            el: '[data-role-anchor-modal="modal_club01"]',
            target: "#modal_club01",
            group: "pt_modal_club",
        },
        {
            el: '[data-role-anchor-modal="modal_club02"]',
            target: "#modal_club02",
            group: "pt_modal_club",
        },
        {
            el: '[data-role-anchor-modal="modal_club03"]',
            target: "#modal_club03",
            group: "pt_modal_club",
        },
        {
            el: '[data-role-anchor-modal="modal_club04"]',
            target: "#modal_club04",
            group: "pt_modal_club",
        },
    ]);

    anchor.click([
        {
            el: '[data-role-anchor="sec_buying"]',
            target: '.sec_buying',
            scroll: [-80,-1]
        },
        {
            el: '[data-role-anchor="sec_benefit"]',
            target: '.sec_benefit',
            scroll: [-60,-100]
        },
        {
            el: '[data-role-anchor="sec_pod"]',
            target: '.sec_pod',
            scroll: [-60,-100]
        },
        {
            el: '[data-role-anchor="sec_inbox"]',
            target: '.sec_inbox',
            scroll: [-60,-100]
        },
        {
            el: '[data-role-anchor="pt_notice__benefit"]',
            target: '.pt_notice__benefit'
        },
        {
            el: '[data-role-anchor="sec_tabmenu01"]',
            target: '.sec_tabmenu01'
        },
        {
            el: '[data-role-anchor="common_benefit_notice"]',
            target: '.common_benefit_notice'
        },
        {
            el: '[data-role-anchor="single_benefit_notice"]',
            target: '.single_benefit_notice'
        },
        {
            el: '[data-role-anchor="product_coupon_notice"]',
            target: '.product_coupon_notice'
        },
        {
            el: '[data-role-anchor="app_coupon_notice"]',
            target: '.app_coupon_notice'
        },
        {
            el: '[data-role-anchor="samsungcard_notice"]',
            target: '.samsungcard_notice'
        },
        // {
        //     el: '[data-role-anchor="price_payment_notice"]',
        //     target: '.price_payment_notice'
        // },
        {
            el: '[data-role-anchor="product_payment_notice"]',
            target: '.product_payment_notice'
        },
        {
            el: '[data-role-anchor="snaps_benefit"]',
            target: '#snaps_benefit'
        },
    ]);

    anchor.load([
        {
            url: 'benefit',
            target: '.sec_benefit ',
            scroll: [-60, -80],
        },
        {
            url: 'SM-X910NZEAKOO',
            target: '.sec_buying ',
            // scroll: [200,0]
        },
        // 스페셜특가 앵커드URL
        // {
        //     url: 'special_today',
        //     target: '.sec_special',
        //     click: '[data-ancload-click="special_today"]'
        // },
    ]);


    tab.click([
        {
            el: '[data-role-tab="pt_inbox_tab"]',
            target: '#inbox',
        },
        {
            el: '[data-role-tab="pt_benefit_tab"]',
            target: '#benefit_tab',
            anc: false
        },
    ]);

    accordian.toggle([
        {
            el: '[data-role-accordian="pt_toggle_buying"]',
            target: '#pt_toggle_buying',
            openFocus: '#pt_toggle_buying',
            openTitle: '기능별 유의사항 펼쳐보기',
            closeTitle: '기능별 유의사항 닫기',
            openText: '기능별 유의사항 보기',
            closeText: '기능별 유의사항 닫기',
            openOmni: 'sec:event:galaxy-tabs9-series:botton_pod_open',
            closeOmni: 'sec:event:galaxy-tabs9-series:botton_pod_close',
            speed: 300,
            scroll: [-80,-1]
        },
    ]);

    // benefit swiper
    const benefitSwiper = new Swiper("#pt_single_benefit_swiper", {
        slidesPerView: "auto",
        observer : true, 
        observeParents : true,
        // preloadImages: false,
        // lazy: true,
        // allowTouchMove: true,
        // nested: true,
        navigation: {
            prevEl: '.pt_single_benefit_swiper--prev',
            nextEl: '.pt_single_benefit_swiper--next',
        },
        // pagination: {
        //     el: "",
        //     clickable : true,
        // }, 
        a11y: {
            prevSlideMessage: '이전 슬라이드',
            nextSlideMessage: '다음 슬라이드',
            slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.',
        },
        breakpoints: {
            768: {
                slidesPerView: "auto",
                spaceBetween: 0,
                allowTouchMove: false,
            }
        },
        on: {
            breakpoint: function () {
                var that = this;
                setTimeout(function () {
                    that.slideTo(0, 0);
                    for(let i = 0; i < that.slides.length; i ++) {
                        that.slides[i].setAttribute('style', '')
                    }
                }, 150);
            },
            // init: function() {
            //     $(this.el).find('.swiper-slide').attr('tabindex', -1);
            //     $(this.el).find('.swiper-slide.swiper-slide-active').attr('tabindex', 0);                    
            // },
        },
    });
    // console.log('bb?', benefitSwiper)

    sticky.init();

    imgLozad();

    viewportChange(); // fold 해상도 대응
});