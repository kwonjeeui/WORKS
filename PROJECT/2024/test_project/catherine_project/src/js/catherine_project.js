// BS default 모듈
import { PT_STATE, util as _ } from './modules/bs_common';
import { anchor } from './modules/anchor';
import { accordian } from './modules/accordian';
import { tab } from './modules/tab';
import { coupon, promoCoupon } from './modules/coupon';
import { sticky } from './modules/sticky';
import { category_tab } from './modules/category_tab';
import { copy } from './modules/copy';

$(document).ready(function(){
    sticky.init();

    // 스티키영역 앵커 -> 사실상 사용 X
    anchor.click([
        {
            el: '[data-role-anchor="sec_anchor01"]',
            target: '.sec_benefit'
        },
        {
            el: '[data-role-anchor="sec_anchor02"]',
            target: '.sec_special',
            speed: 1000,
            scroll: [500]
        },
        {
            el: '[data-role-anchor="sec_anchor03"]',
            target: '.sec_event',
            speed: 0,
            scroll: [-200, -100]
        },
    ]);

    // 아코디언 기능 태그 제어
    anchor.load([
        {
            url: 'test01',
            target: '.sec_anchor'
        },
        {
            url: 'test02',
            target: '.sec_accordian',
            scroll: [0, -50]
        },
    ]);

    // 토글 버튼 효과
    accordian.toggle([
        {
            el: '[data-role-accordian="sec_accordian01"]',
            target: '#toggle01'
        },
        {
            el: '[data-role-accordian="sec_accordian02"]',
            target: '#toggle02',
            speed: 0
        },
        {
            el: '[data-role-accordian="sec_accordian03"]',
            target: '#toggle03',
            group: 'group01'
        },
        {
            el: '[data-role-accordian="sec_accordian04"]',
            target: '#toggle04',
            group: 'group01'
        },
        {
            el: '[data-role-accordian="sec_accordian05"]',
            target: '#toggle05',
            openFocus: 'toggle05'
        },
        {
            el: '[data-role-accordian="sec_accordian06"]',
            target: '#toggle06',
            openFocus: 'toggle06',
        },
        {
            el: '[data-role-accordian="sec_accordian07"]',
            target: '#toggle07',
            open: true
        },
        {
            el: '[data-role-accordian="sec_button_test"]',
            target: '#button01'
        }
    ]);

    // 탭 클릭시 이동 제어
    tab.click([
        {
            el: '[data-role-tab="sec_tabmenu01"]',
            target: '#tab01, #tab03',
        },
        {
            el: '[data-role-tab="sec_tabmenu02"]',
            target: '#tab01',
        },
        {
            el: '[data-role-tab="sec_tabmenu03"]',
            target: '#tab03',
        },
    ]);

    viewportChange(); // fold 해상도 대응

    // 해시태그 텍스트 복사 기능
    copy.click();

    // sticky nav 소스 -> 안되는 이유..?
    if ($(window).scrollTop() >= $('.sec_nav').offset().top && $(window).scrollTop() <= $('.sec_anchor').offset().top - _navHeight){
        $('.sticky_wrapper').addClass('fixed_start');
    }else if ($(window).scrollTop() >= $('.sec_accordian').offset().top - _navHeight && $(window).scrollTop() <= $('.sec_modal').offset().top - _navHeight){
        $('.sticky_wrapper').addClass('fixed_start');
    }else{
        $('.sticky_wrapper').removeClass('fixed_start');
    }
    $(window).on('scroll.sticky', stickyMove);
});

// pc, mo 버전 별 다른 레이아웃 내 스와이퍼
const benefitSwiper = new Swiper(".pt_benefit_01_swiper",{
    slidesPerView: "auto",
    centeredSlides: false,
    allowTouchMove: true,
    navigation: {
        nextEl: ".swiper-button-next.pt_benefit_01_swiper-next",
        prevEl: ".swiper-button-prev.pt_benefit_01_swiper-prev",
    },
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
    },
    breakpoints: {
        769 : { // 해상도 769px 이상 시 스와이퍼 기능 작동 X
            allowTouchMove: false,
        }
    },
});

// 바잉툴 내 냉장고 이미지 스와이퍼 (basic style)
const buyingSwiper = new Swiper('.pt_special_buyingtool_swiper', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
    },
});