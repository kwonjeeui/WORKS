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

    // 상단 탭 클릭시 전환
    $('.pt_tab__item').on('click', function(){
        $(this).addClass('is-active');
        $('.pt_tab__item').not(this).removeClass('is-active');
    })

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
        }
    ]);

    // 탭 클릭시 이동 제어
    tab.click([
        {
            el: '[data-role-tab="sec_tabmenu01"]',
            target: '#tab01',
        },
        {
            el: '[data-role-tab="sec_tabmenu02"]',
            target: '#tab02',
        },
    ]);

    viewportChange(); // fold 해상도 대응

    // 해시태그 텍스트 복사 기능
    copy.click();
});

// pc, mo 버전 별 다른 레이아웃 내 스와이퍼
const benefitSwiper = new Swiper(".pt_bnf__swiper",{
    slidesPerView: "auto",
    centeredSlides: false,
    allowTouchMove: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
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