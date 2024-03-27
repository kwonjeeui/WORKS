import { PT_STATE, util as _, anchor, accordian, tab, copy, modal, countDownEvt, count } from './modules/bs_common';
import {promoCoupon} from './modules/coupon_evt';
import {category_tab} from './modules/category_tab';
import {sticky} from './modules/sticky';

$(document).ready(function(){
    // function prdEvt() {
    //     const scrollS = $('.pt_prd-slide').offset().top;
    //     const scrollE = $('.sec_buying_comp').offset().top;
    //     const navHeight = $('.sec_nav').outerHeight();
    //     const $buyingSlide = $('#buying_slide');

    //     function isMobile() {
    //         return $(window).outerWidth() <= 768;
    //     }

    //     $(window).scroll(() => {
    //         const scroll = $(window).scrollTop();
    //         if(isMobile()) {
    //             if (scroll <= scrollS) {
    //                 $buyingSlide.css('transform', 'none');
    //             }
    //             if (scroll > scrollS - navHeight && scroll < scrollE) {
    //                 const translateY = (scroll - scrollS + navHeight) * 0.5;
    //                 $buyingSlide.css('transform', `translateY(${translateY}px)`);
    //             }
    //         }else{
    //             $buyingSlide.css('transform', 'none');
    //         }
    //     });
    // }

    // let resizeTimer = null;
    // window.addEventListener('resize', function() {
    //     clearTimeout(resizeTimer);
    //     resizeTimer = setTimeout(prdEvt, 400);
    // }, false);


    // let bannerSwiper = new Swiper ('.swiper-container.pt_banner__swiper',{
    //     slidesPerView: 'auto',
    //     allowTouchMove: true,
    //     observer: true,
    //     observeParents: true,
    //     preloadImages: false,
    //     lazy: true,
    //     loop: true,
    //     speed : 2000,
    //     effect: 'fade',
    //     autoplay: {
    //         delay: 3000,
    //         disableOnInteraction: false,
    //     },        
    //     navigation: {
    //         nextEl: '.swiper-button-next.pt_banner_next',
    //         prevEl: '.swiper-button-prev.pt_banner_prev',
    //     },
    //     on: {
    //         breakpoint: function () {
    //             var that = this;
    //             setTimeout(function () {
    //                 that.slideTo(0, 0);
    //             }, 150);
    //         },
    //     },
    // });

    let bannerSwiper = new Swiper ('.swiper-container.pt_buying_banner__swiper',{
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        preloadImages: false,
        lazy: true,
        loop: true,
        // autoplay: {
        //     delay: 3000,
        //     disableOnInteraction: false,
        // },
        pagination: {
            el: '.swiper-pagination.pt_buying_banner__pagi',
            type: 'fraction',
        },
        navigation: {
            nextEl: '.swiper-button-next.pt_buying_banner-next',
            prevEl: '.swiper-button-prev.pt_buying_banner-prev',
        },
        on: {
            breakpoint: function () {
                var that = this;
                setTimeout(function () {
                    that.slideTo(0, 0);
                }, 150);
            },
        },
    });

    let podSwiper = new Swiper ('.swiper-container.pt_pod_swiper',{
        slidesPerView: 'auto',
        allowTouchMove: true,
        observer: true,
        observeParents: true,
        preloadImages: false,
        lazy: true,
        navigation: {
            nextEl: '.swiper-button-next.pt_pod_next',
            prevEl: '.swiper-button-prev.pt_pod_prev',
        },
        breakpoints: {
            769: {
                slidesPerView: 'auto',
                // allowTouchMove: false,
                preloadImages: false,
                lazy: true
            }
        },
        on: {
            breakpoint: function () {
                var that = this;
                setTimeout(function () {
                    that.slideTo(0, 0);
                }, 150);
            },
        },
    });
    
    let bnfSwiper = new Swiper ('.swiper-container.pt_bnf_swiper',{
        slidesPerView: 'auto',
        allowTouchMove: true,
        preloadImages: false,
        observer: true,
        observeParents: true,
        lazy: true,
        navigation: {
            nextEl: '.pt_bnf_swiper .swiper-button-next.pt_bnf_next',
            prevEl: '.pt_bnf_swiper .swiper-button-prev.pt_bnf_prev',
        },
        // breakpoints: {
        //     769: {
        //         slidesPerView: 'auto',
        //         allowTouchMove: false,
        //         preloadImages: false,
        //         lazy: true
        //     }
        // },
        on: {
            breakpoint: function () {
                var that = this;
                setTimeout(function () {
                    that.slideTo(0, 0);
                }, 150);
            },
        },
    });

    function benefitScrollSwiper () {
        let bnfscrollSwiper = new Swiper(".pt_scroll_swiper", {
            direction: "horizontal",
            slidesPerView: "auto",
            spaceBetween: 0,
            mousewheel: true,
            //centeredSlides: true,
            scrollbar: {
                el: ".swiper-scrollbar",
                draggable: true,
            },
            on: {
                breakpoint: function() {
                    const that = this;
                    setTimeout(function() {
                        that.slideTo(0, 0);
                    }, 150);
                }
            }
        });
    }

    let navSwiper = new Swiper ('.swiper-container.pt_mo_swiper',{
        slidesPerView: 'auto',
        allowTouchMove: true,
        preloadImages: false,
        observer: true,
        observeParents: true,
        lazy: true,
        // navigation: {
        //     nextEl: '.pt_bnf_swiper .swiper-button-next.pt_bnf_next',
        //     prevEl: '.pt_bnf_swiper .swiper-button-prev.pt_bnf_prev',
        // },
        breakpoints: {
            769: {
                slidesPerView: 'auto',
                allowTouchMove: false,
                preloadImages: false,
                lazy: true
            }
        },
        on: {
            breakpoint: function () {
                var that = this;
                setTimeout(function () {
                    that.slideTo(0, 0);
                }, 150);
            },
        },
    });

    // let btnPrev = $('.pt_bnf_swiper .swiper-button-prev.pt_bnf_prev');
    // let btnNext = $('.pt_bnf_swiper .swiper-button-next.pt_bnf_next');
    // btnNext.on('click', function(){
    //     bnfSwiper[0].slideTo(4, 200);
    // });

    // btnPrev.on('click', function(){
    //     bnfSwiper[0].slideTo(0, 200);
    // });

    let productSwiper =  new Swiper('#product_slide.swiper-container', {
      slidesPerView: 'auto',
      preloadImages: false,
      lazy: true,
      pagination: {
        el: '.product_pagination_pc',
        type: 'bullets',
      },
      on: {
        breakpoint: function () {
          var that = this;
          setTimeout(function () {
            that.slideTo(0, 0);
          }, 150);
        },
        init: function() {
          const $el = $(this.$el);

          this.params.navigation.prevEl = $el.siblings('.pt_slide__arrow--prev');
          this.params.navigation.nextEl = $el.siblings('.pt_slide__arrow--next');
        }
      },
    });

    let productMoSwiper =  new Swiper('.pt_m_slide.swiper-container', {
      slidesPerView: 'auto',
      preloadImages: false,
      lazy: true,
      pagination: {
        el: '.product_pagination_mo',
        type: 'bullets',
      },
      on: {
        breakpoint: function () {
          var that = this;
          setTimeout(function () {
            that.slideTo(0, 0);
          }, 150);
        },
        init: function() {
          const $el = $(this.$el);

          this.params.navigation.prevEl = $el.siblings('.pt_slide__arrow--prev');
          this.params.navigation.nextEl = $el.siblings('.pt_slide__arrow--next');
        }
      },
    });

    function lozadEvt(){
        const observerbg = lozad('.pt_bg-image', {
            loaded: function(el) {
                el.classList.add('pt_add-bg');
            }
        });
        observerbg.observe();
    }
    lozadEvt();

    anchor.load([
        {
            url: 'kv',
            target: '.sec_kv'
        },
        //사전구매 알림신청 앵커드
        {
            url: 'Navi_COMBO_AI_alarm_preorder_banner',
            target: '.sec_banner',
            scroll: [0, -88]
        },
        //혜택영역 앵커드
        {
            url: 'Navi_benefitzone_GrandeAI',
            target: '.sec_benefit'
        },
        //pod 원바디 제품 앵커드
        {
            url: 'POD_buying_Onebody',
            target: '.sec_buying_unpack'
        },
        //pod 올인원 제품 앵커드
        {
            url: 'POD_buying_Allinone',
            target: '.sec_buying_unpack'
        },
        //pod 올인원 제품 화이트 선택 앵커드
        {
            url: 'POD_buying_Allinone_WF24D21CWWE',
            target: '.sec_buying_unpack'
        },
        //pod 화이트WF21D17CWWC 선택 앵커드
        {
            url: 'POD_buying_WF21D17CWWC',
            target: '.sec_buying_unpack'
        },
         //pod 블랙캐비어 WF21D17CVVC 선택 앵커드
        {
            url: 'POD_buying_WF21D17CVVC',
            target: '.sec_buying_unpack'
        },
        //특가영역으로 앵커드
        {
            url: 'Navi_monthly_special_deal',
            target: '.sec_buying_comp'
        },
        //컴포넌트영역 앵커드
        {
            url: 'grandeAI_component',
            target: '.sec_component'
        },

        {
            url: 'special-price',
            target: '#sec_product'
        },
        {
            url: 'Youmake_products',
            target: '#component_tap'
        },
        {
            url: 'top-loader-wa',
            target: '#component_tap',
            isCategory: true
        },
    ]);

    anchor.click([
        {
            el: '[data-role-anchor="photo_event"]',
            target: '.sec_photo_event'
        },
        {
            el: '[data-role-anchor="component_tab"]',
            target: '.component_tab'
        },
        {
            el: '[data-role-anchor="sec_banner"]',
            target: '.sec_banner'
        },
        {
            el: '[data-role-anchor="sec_benefit"]',
            target: '.sec_benefit',
            scroll: [70, 50]
        },
        {
            el: '[data-role-anchor="sec_review"]',
            target: '.sec_review'
        },
        {
            el: '[data-role-anchor="sec_notice"]',
            target: '.sec_notice'
        },
        {
            el: '[data-role-anchor="sec_buying_comp"]',
            target: '.sec_buying_comp'
        },
        {
            el: '[data-role-anchor="sec_buying_unpack"]',
            target: '.sec_buying_unpack'
        },
        {
            el: '[data-role-anchor="pod_noti"]',
            target: '.pt_notice_anchor'
        },
        {
            el: '[data-role-anchor="notice_qooker"]',
            target: '.pt_notice_qooker',
            scroll: [-50, -10]
        },
        {
            el: '[data-role-anchor="notice_reviewer"]',
            target: '.pt_notice_reviewer',
            scroll: [-50, -10]
        },
        {
            el: '[data-role-anchor="notice_alarm"]',
            target: '.notice_alarm'
        },
        {
            el: '[data-role-anchor="banner_notice"]',
            target: '.banner_notice'
        },
    ])

    modal.init();

    accordian.toggle([
        {
            el: '[data-role-accordian="benefit_acco"]',
            target:'#benefit_acco',
            speed:600,
        },
        {
            el: '[data-role-accordian="spec_acco"]',
            target:'#spec_acco',
            speed:600,
        },
        {
            el: '[data-role-accordian="review_acco"]',
            target:'#review_acco',
            speed:600,
        },
        {
            el: '[data-role-accordian="pod_acco"]',
            target:'#pod_acco',
            speed:600,
        },
        {
            el: '[data-role-accordian="photo_acco"]',
            target:'#photo_acco',
            speed:600,
        },
        {
            el: '[data-role-accordian="pt_step_cnt1"]',
            target: '#pt_step_cnt1',
            scroll: [-70, -100],
            group: 'step',
        },
        {
            el: '[data-role-accordian="pt_step_cnt2"]',
            target: '#pt_step_cnt2',
            scroll: [-70, -100],
            group: 'step',
        },
        {
            el: '[data-role-accordian="pt_step_cnt3"]',
            target: '#pt_step_cnt3',
            scroll: [-70, -100],
            group: 'step',
        },
    ]);

    tab.click([
        {
            el: '[data-role-tab="tabPod"]',
            target: '#tabPodContents',
            default: 0
        },
        {
            el: '[data-role-tab="tab_buying_pod_new"]',
            target: '#tab_buying_pod_new',
        },
    ]);

    copy.click();
    category_tab.init();
    sticky.init();
    promoCoupon.init();
    benefitScrollSwiper();
    viewportChange();
    // prdEvt();
});


// nav 스크롤 제어 + on class 적용
// $(document).ready(function() {
//   var navItems = $('.pt_nav_btn');
//   var sections = $('.scroll');
//   var offset = 70;

//   $(window).scroll(function() {
//     var scrollPos = $(document).scrollTop();

//     sections.each(function(index, section) {
//       var top = $(section).offset().top - offset;
//       var bottom = top + $(section).height();

//       if (scrollPos >= top && scrollPos < bottom) {
//         navItems.removeClass('on');
//         navItems.eq(index).addClass('on');
//       }
//     });
//   });
// });