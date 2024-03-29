import { PT_STATE, util as _ } from './modules/bs_common';
import { anchor } from './modules/anchor_galcams';
import { tab } from './modules/tab';
import { sticky } from './modules/sticky_galcams';
import { copy } from './modules/copy';
import { sns } from './modules/sns';


// ------- 갤캠스 필수 기능 start
var galcams = {
    /** 갤캠스 : 기기별 퍼블단 변경 (WEB/APP 다른 디자인일 시 사용) */ 
    isAgent: function() {
        let agent = navigator.userAgent.toLowerCase();
        let localPort1 = window.location.port == '4441';
        let localPort2 = window.location.port == '4442';
        let locationQa = window.location.pathname.indexOf('display/preview/');

        if(agent.indexOf('secapp') != -1) {
            $('html').addClass('isApp');
        } else {
            $('html').addClass('isWeb');
            
        }
        if(window.location.search.indexOf('isApp') != -1 && (localPort1 || localPort2 || locationQa != -1)){
            if($('html').hasClass('isWeb')){
                $('html').removeClass('isWeb');
                $('html').addClass('isApp');
            }
        }else if(window.location.search.indexOf('isWeb') != -1 && (localPort1 || localPort2 || locationQa != -1)){
            if($('html').hasClass('isApp')){
                $('html').removeClass('isApp');
                $('html').addClass('isWeb');
            }
        }
        },

    bnfSwiper: function (){
        var bnfSwiper = new Swiper('.swiper-container.pt_bnf-swiper', {
            slidesPerView: 'auto',
            allowTouchMove: true,
            autoplay : false,
            loop: false,
            preloadImages: false,
            lazy: true,
            breakpoints: {
                769: {
                    allowTouchMove: false,
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
        });
    },

    setSwiper: function(){

        const navSlider = new Swiper('.pt_nav', {
            slidesPerView: 'auto',
            allowTouchMove: true,
            preloadImages: false,
            lazy: true,
            //3개 이상시 주석 해제
            breakpoints: {
                769: {
                    slidesPerView: 'auto',
                    allowTouchMove: false,
                }
            },
            on: {
                breakpoint: function() {
                    let stickyMove = function(){
                        let navTab = $(".sec_nav");
                        let _navHeight = navTab.outerHeight();
                        let scrollTop = $(this).scrollTop();
                        let scrollClass =  _.pxToVw(-142, -167);
                        let setNavFixed = ['.pt_ongoing--s24series', '.pt_ongoing--gb4series', '.pt_ongoing--tabs9series', '.pt_ongoing--budsseries', '.sec_banner'];

                        setNavFixed.forEach((fixedClass, index)=>{
                            if(($(fixedClass).offset().top - _navHeight + scrollClass) <= scrollTop){
                                navSlider.slideTo(index);
                                return;
                            }
                        });
                    }
                    $(window).on('scroll.sticky', stickyMove);
                }
            }
        });
    },

    init: function() {
        this.bnfSwiper();
        this.setSwiper();
        viewportChange(); // fold 해상도 대응
    }
};
// ------- 갤캠스 필수 기능 e

$(document).ready(function(){
    // 네이버 웹툰 쿠키오븐 API 전달 소스 start
    var cookieOvenUrl = new URL(document.location.href);
    var cookieOvenUrlParams = cookieOvenUrl.searchParams;

    if(cookieOvenUrlParams.get('click_key') != null){
        setCookie('click_key', cookieOvenUrlParams.get('click_key'), 1);
    }
    // 네이버 웹툰 쿠키오븐 API 전달 소스 end

    anchor.click([
        {
            el: '[data-role-anchor="nav_s24series"]',
            target: '.pt_ongoing--s24series',
            scroll:[-70, -115]
        },
        {
            el: '[data-role-anchor="nav_gb4series"]',
            target: '.pt_ongoing--gb4series',
            scroll:[-70, -115]
        },
        {
            el: '[data-role-anchor="nav_tabs9series"]',
            target: '.pt_ongoing--tabs9series',
            scroll:[-70, -115]
        },
        {
            el: '[data-role-anchor="nav_budsseries"]',
            target: '.pt_ongoing--budsseries',
            scroll:[-70, -115]
        },
        {
            el: '[data-role-anchor="nav_eventhub"]',
            target: '.sec_banner',
            scroll:[-70, -115]
        },
        {
            el: '[data-role-anchor="ongoing_anc_s24series"]',
            target: '.pt_noti--s24series',
        },
        {
            el: '[data-role-anchor="ongoing_anc_gb4series"]',
            target: '.pt_noti--gb4series',
        },
        {
            el: '[data-role-anchor="ongoing_anc_tabs9series"]',
            target: '.pt_noti--tabs9series',
        },
        {
            el: '[data-role-anchor="ongoing_anc_budsseries"]',
            target: '.pt_noti--budsseries',
        },
    ]);

    anchor.load([
        {
            url: 'galaxy-s24-series',
            target: '.pt_ongoing--s24series',
            scroll:[-70, -115]
        },
        {
            url: 'galaxy-book4-series',
            target: '.pt_ongoing--gb4series',
            scroll:[-70, -115]
        },
        {
            url: 'galaxy-tabs9-series',
            target: '.pt_ongoing--tabs9series',
            scroll:[-70, -115]
        },
        {
            url: 'galaxy-buds-series',
            target: '.pt_ongoing--budsseries',
            scroll:[-70, -115]
        },
        {
            url: 'galaxycampuseventzip',
            target: '.sec_banner',
            scroll:[-70, -115]
        },
    ]);

    galcams.init(); // 갤캠스 필수 기능 호출
    sticky.init();
    sns.init();
    copy.click();
    viewportChange(); // fold 해상도 대응
});
