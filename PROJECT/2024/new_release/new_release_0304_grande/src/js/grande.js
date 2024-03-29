import { util as _, anchor, accordian, tab, copy, modal, countDownEvt, count } from './modules/bs_common';
import {page_tab} from './modules/page_tab';
import {promoCoupon} from './modules/coupon_evt';
import {category_tab} from './modules/category_tab';
import {sticky} from './modules/sticky';
import {video} from './modules/video_evt';

page_tab.init();

$(document).ready(function(){
    
    PT_STATE.service.getCommentAvg('G000380493', function(commentAvg){
        const $review = $('[data-combo]');
    
        if(commentAvg === '0.0'){
            $review.hide();
        } else {
            $review.html(commentAvg);
            $review.show();
        }
    });

    function setPageTab() {
        $('.sec_project_wrap').find('[data-page-tab]').eq(1).addClass('on').siblings().removeClass('on');
        page_tab.showContent('ai');
    }

    function tabClick() {
        setTimeout(() => {
            const tabAi = document.querySelector('[data-page-tab="ai"]');
            if(!tabAi) return;
            tabAi.click();
        }, 0)
    }

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

    // const navMove = () => {
    //     const $navList = document.querySelector('.pt_nav_list');
    //     const $navMenu = document.querySelector('.pt_nav_btn.on');
    //     if ($navMenu) {
    //         const $index = Array.from($navList.children).indexOf($navMenu.parentNode);
    //         navSwiper.slideTo($index);
    //     }
    // };

    // window.addEventListener('scroll', navMove);

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
            url: 'KV_ClothingCare',
            target: '.sec_kv_ai',
            tabClick: tabClick
        },
        //사전구매 알림신청 앵커드
        {
            url: 'Navi_COMBO_AI_alarm_preorder_banner',
            target: '.sec_banner',
            scroll: [-58,-94]
        },
        //혜택영역 앵커드
        {
            url: '_benefitzone_GrandeAI',
            target: '.pt_benefit',
            scroll: [-58,-94],
            tabClick: tabClick
        },
        //컴포넌트영역 앵커드
        {
            url: 'grandeAI_component',
            target: '.sec_component',
            scroll: [-58,-94],
            tabClick: tabClick
        },
        //콤보 사전구매자 배너 앵커드
        {
            url: 'COMBO_preorder-benefit_banner',
            target: '.pt_starbucks-banner',
            scroll: [-58,-94]
        },
        //콤보 바잉툴로 앵커드
        {
            url: 'COMBO_2sku_buying',
            target: '#sec_buying_combo',
            scroll: [-58,-94]
        },
        // Ai 바잉툴로 앵커드
        {
            url: 'GrandeAI_buying',
            target: '#sec_buying',
            scroll: [-58,-94],
            tabClick: tabClick
        },
        //콤보 사전구매자 유의사항 앵커드
        {
            url: 'COMBO_preorder-benefit_banner_detail',
            target: '.pt_notice_buyer',
            scroll: [-58,-94]
        },
        //알림신청자 대상 혜택 유의사항
        {
            url: 'pre-alram_Benefit_detail',
            target: '.pt_notice_alarm',
            scroll: [-58,-94]
        },
        //베스트 리뷰어 챌린지 유의사항 앵커드
        {
            url: 'bestreviewer_detail',
            target: '.pt_notice_best_common',
            scroll: [-58,-94]
        },
        //신규 컬러 런칭 알림신청 배너 앵커드
        {
            url: 'Banner_new_color_pre-alram',
            target: '.sec_banner_alarm',
            scroll: [-58,-94]
        },
        // FAQ 영역 앵커드
        {
            url: 'Navi_COMBO_FAQ',
            target: '.sec_faq',
            scroll: [-58,-94]
        },
        // TVC 영상 영역
        {
            url: 'COMBO_TVC',
            target: '.sec_video',
            scroll: [-58,-94]
        },
    ]);

    anchor.click([
        {
            el: '[data-role-anchor="photo_event"]',
            target: '.sec_photo_event'
        },
        {
            el: '[data-role-anchor="component_tab"]',
            target: '.component_tab',
            scroll: [-58,-94]
        },
        {
            el: '[data-role-anchor="sec_banner"]',
            target: '.sec_banner'
        },
        {
            el: '[data-role-anchor="sec_benefit"]',
            target: '.pt_benefit',
            scroll: [-58,-94]
        },
        {
            el: '[data-role-anchor="pt_starbucks-banner"]',
            target: '.pt_starbucks-banner',
            scroll: [-58,-94]
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
            target: '.sec_buying',
            scroll: [-58,-94]
            
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
            target: '.pt_notice_alarm',
            scroll: [-58,-94]
        },
        {
            el: '[data-role-anchor="banner_notice"]',
            target: '.banner_notice'
        },
        {
            el: '[data-role-anchor="sec_faq"]',
            target: '.sec_faq',
            scroll: [-58,-94]
        },
        {
            el: '[data-role-anchor="notice_buyer"]',
            target: '.pt_notice_buyer',
            scroll: [-10, -10]
        },
        {
            el: '[data-role-anchor="sec_banner_alarm"]',
            target: '.sec_banner_alarm',
            scroll: [-58,-94]
        },
        {
            el: '[data-role-anchor="sec_video"]',
            target: '.sec_video',
            scroll: [-58,-94]
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
    
    video.init([
        {
            el: '[data-role-video="tvc_video"]',
            target: '#tvc_video',
            video: '../../is/images/video/gd_video_tvc.mp4'
        },
    ])


    count.init('#alarm_count', '2024/04/04 16:59:59');
    copy.click();
    category_tab.init();
    sticky.init();
    promoCoupon.init();
    benefitScrollSwiper();
    viewportChange();
    // prdEvt();

});