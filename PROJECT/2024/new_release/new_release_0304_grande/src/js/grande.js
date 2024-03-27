import { util as _, anchor, accordian, tab, copy, modal, countDownEvt, count } from './modules/bs_common';
import {promoCoupon} from './modules/coupon_evt';
import {category_tab} from './modules/category_tab';
import {sticky} from './modules/sticky';

$(document).ready(function(){
    
    PT_STATE.service.getCommentAvg('G000380493', function(commentAvg){
        const $review = $('[data-combo]');
    
        if(commentAvg === '0.0'){
            $review.hide();
        } else {
            $review.html(commentAvg)
            $review.show();
        }
    });

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
            }
        },
    });

    const navMove = () => {
        const $navList = document.querySelector('.pt_nav_list');
        const $navMenu = document.querySelector('.pt_nav_btn.on');
        if ($navMenu) {
            const $index = Array.from($navList.children).indexOf($navMenu.parentNode);
            navSwiper.slideTo($index);
        }
    };

    window.addEventListener('scroll', navMove);

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
            url: '_benefitzone_GrandeAI',
            target: '.pt_benefit',
            scroll: [-50, -90]
        },
        //pod 원바디 제품 앵커드
        {
            url: 'POD_buying_Onebody',
            target: '.sec_buying'
        },
        //pod 올인원 제품 앵커드
        {
            url: 'POD_buying_Allinone',
            target: '.sec_buying'
        },
        //pod 올인원 제품 화이트 선택 앵커드
        {
            url: 'POD_buying_Allinone_WF24D21CWWE',
            target: '.sec_buying'
        },
        //pod 화이트WF21D17CWWC 선택 앵커드
        {
            url: 'POD_buying_WF21D17CWWC',
            target: '.sec_buying'
        },
         //pod 블랙캐비어 WF21D17CVVC 선택 앵커드
        {
            url: 'POD_buying_WF21D17CVVC',
            target: '.sec_buying'
        },
        //특가영역으로 앵커드
        {
            url: 'Navi_monthly_special_deal',
            target: '.sec_buying_comp'
        },
        //컴포넌트영역 앵커드
        {
            url: 'grandeAI_component',
            target: '.sec_component',
            scroll: [0, -30]

        },
        //콤보 사전구매자 배너 앵커드
        {
            url: 'COMBO_preorder-benefit_banner',
            target: '.pt_starbucks-banner'
        },
        //콤보 바잉툴로 앵커드
        {
            url: 'buying',
            target: '.sec_buying',
            scroll: [0, -100]
        },
        //콤보 사전구매자 유의사항 앵커드
        {
            url: 'COMBO_preorder-benefit_banner_detail',
            target: '.pt_notice_buyer',
            scroll: [-30, -50]
        },
        //베스트 리뷰어 챌린지 유의사항 앵커드
        {
            url: 'bestreviewer_detail',
            target: '.pt_notice_best_common',
            scroll: [-80, -100]
        },
        //신규 컬러 런칭 알림신청 배너 앵커드
        {
            url: 'Banner_new_color_pre-alram',
            target: '.sec_banner_alarm',
            scroll: [-60, -90]
        },
        {
            url: 'top-loader-wa',
            target: '#component_tap',
            isCategory: true
        },
        {
            url: 'Navi_COMBO_FAQ',
            target: '.sec_faq',
            scroll: [-69, -94]
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
            target: '.pt_benefit',
            scroll: [-30, 0]
        },
        {
            el: '[data-role-anchor="pt_starbucks-banner"]',
            target: '.pt_starbucks-banner',
            scroll: [60, 60]
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
            el: '[data-role-anchor="sec_buying"]',
            target: '.sec_buying'
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
            el: '[data-role-anchor="notice_bnf_single"]',
            target: '.pt_notice_bnf_single',
            scroll: [-50, -10]
        },
        {
            el: '[data-role-anchor="notice_reviewer"]',
            target: '.pt_notice_reviewer',
            scroll: [-50, -10]
        },
        {
            el: '[data-role-anchor="notice_alarm"]',
            target: '.pt_notice_alarm'
        },
        {
            el: '[data-role-anchor="banner_notice"]',
            target: '.banner_notice'
        },
        {
            el: '[data-role-anchor="sec_faq"]',
            target: '.sec_faq'
        },
        {
            el: '[data-role-anchor="notice_buyer"]',
            target: '.pt_notice_buyer',
            scroll: [-10, -10]
        },
        {
            el: '[data-role-anchor="sec_banner_alarm"]',
            target: '.sec_banner_alarm',
            scroll: [50, 70]
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
        
        {
            el: '[data-role-accordian="faq01"]',
            target: '#faq01',
            group: 'group01',
            // speed: 400
        },
        {
            el: '[data-role-accordian="faq02"]',
            target: '#faq02',
            group: 'group01',
            // speed: 400
        },
        {
            el: '[data-role-accordian="faq03"]',
            target: '#faq03',
            group: 'group01',
            // speed: 400
        },
        {
            el: '[data-role-accordian="faq04"]',
            target: '#faq04',
            group: 'group01',
            // speed: 400
        },
        {
            el: '[data-role-accordian="faq05"]',
            target: '#faq05',
            group: 'group01',
            // speed: 400
        },
        {
            el: '[data-role-accordian="faq06"]',
            target: '#faq06',
            group: 'group01',
            // speed: 400
        },
        {
            el: '[data-role-accordian="faq07"]',
            target: '#faq07',
            group: 'group01',
            // speed: 400
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