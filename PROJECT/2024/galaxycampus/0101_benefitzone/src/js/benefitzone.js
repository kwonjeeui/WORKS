
import { PT_STATE, util as _ } from './modules/bs_common';
import { anchor } from './modules/anchor';
import { modal } from './modules/modal';
// import { accordian } from './modules/accordian';
// import { tab } from './modules/tab';
// import { copy } from './modules/copy';
// import { count } from './modules/countdown';
// import { coupon, promoCoupon } from './modules/coupon';
// import { sns } from './modules/sns';
// import { video, videoKv } from './modules/video';
// import { sticky } from './modules/sticky';
// import { category_tab } from './modules/category_tab';


// ------- 갤캠스 필수 기능 start
var galcams = {
    /** 갤캠스 : 로그인 체크 */
//    isSamsungLogin: function() {
//        stPath = '/event/galaxycampus/';

//        var options = {
//            url : stPath+"xhr/member/getSession",
//            type: "POST",
//            done : function(data){
//                var session = JSON.parse(data);
    
//                if (session.mbrNo == 0) { // 로그인이 되어 있지 않을때
//                    console.log('로그인해주시기 바랍니다.');
//                    var returnUrl = window.location.pathname;
//                    window.location.href = stPath+"member/introPage/?returnUrl="+returnUrl;
//                } 
//            }
//        }
//        ajax.call(options);;
//    },

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

    init: function() {
    //    this.isSamsungLogin(); // 갤캠스 로그인 체크
        viewportChange(); // fold 해상도 대응
    }
};
// ------- 갤캠스 필수 기능 e


// 필요 한 부분만 남기고 제거해서 사용해주세요. 
// 실행소스 참고는 BS스크립트 3버전을 참고해주세요. PROJECT/00_bs_script_v3
$(document).ready(function(){
    anchor.click([
        {
            el: '[data-role-anchor="billing_discount"]',
            target: '.sec_samsung_card',
            scroll: [-20, -50]
        },
        {
            el: '[data-role-anchor="interest_free"]',
            target: '.sec_card_benefit',
            scroll: [-20, -120]
        },
        {
            el: '[data-role-anchor="membership_points"]',
            target: '.sec_point',
        },
        {
            el: '[data-role-anchor="samsungcard_notice"]',
            target: '.sec_samsungcard_notice01',
        },
        {
            el: '[data-role-anchor="card_benefit_notice"]',
            target: '.sec_benefit_notice',
        },
        {
            el: '[data-role-anchor="membership_notice"]',
            target: '.sec_membership_notice',
        },
        {
            el: '[data-role-anchor="banner-card__notice"]',
            target: '.sec_banner_card_notice',
        }
    ]);

    // anchor.load([
    //     {
    //         url: 'test01',
    //         target: '.sec_anchor'
    //     },
    //     {
    //         url: 'test02',
    //         target: '.sec_accordian',
    //         scroll: [0, -50]
    //     },
    // ]);

    // accordian.toggle([
    //     {
    //         el: '[data-role-accordian="pt_card__notice"]',
    //         target: '#pt_card__notice'
    //     }
    // ]);


    // copy.click();
    // modal.init();
    // sticky.init();
    // category_tab.init();
    // coupon.init();
    // promoCoupon.init();
    // sns.init();

    // 카운트다운 타이머 설정
    //count.init('#count01', '2023/07/26 23:59:59');

    galcams.init(); // 갤캠스 필수 기능 호출

    /** 백그라운드 이미지에 lozad 적용 시 필요 함수 */
    // const observerbg = lozad('.pt_bg-image', {
    // loaded: function(el) {
    //         el.classList.add('pt_add-bg');
    //     }
    // });
    // observerbg.observe()
});

modal.init();

;(function(){
    'use strict';

    var benefitzone = {
		stickyEvt: function(){
            let navTab = $(".pt_nav_list");
            let navHeight = navTab.outerHeight();
            let navTop = navTab.offset().top;
            let stickyStop =  $('.sec_notice').offset().top;
            let scrollClass =  _.pxToVw(-0, 100);
            let scroll =  _.pxToVw(-0, 120);

            let setNavFixed = ['.sec_samsung_card', '.sec_card_benefit', '.sec_point'];

			$(window).on('scroll', function() {

				let scrollTop = $(this).scrollTop();
				if(scrollTop >= navTop && scrollTop <= (stickyStop - navHeight ) + (scroll)){
                    navTab.addClass('fixed');

					setNavFixed.forEach((fixedClass, index)=>{
                        if(($(fixedClass).offset().top - navHeight + scrollClass) <= scrollTop){
                            navTab.find('li').removeClass('on');
                            navTab.find('li').eq(index).addClass('on');
                            setBlindTxt($('.sec_nav li').eq(index).find('a'));
                            return;
                        }
                    });
				} else {
                    navTab.removeClass('fixed');
                    navTab.find('li').removeClass('on');
                    navTab.find('li').eq(0).addClass('on');
				}
			});

			function setBlindTxt($this) {
				$this.closest('.sec_nav').find('li a .pt_selected').remove();
				$this.append('<span class="blind pt_selected">선택됨</span>');
			}
		},
        slideEvt: function() {
            var specialSwiper = new Swiper('.swiper-container.pt_special_container', {
				// freeMode: true,
				allowTouchMove: true,
				slidesPerView: 'auto',
				observer: true,
				observeParents: true,
				loop: false,
                preloadImages: false,
                lazy: true,
				navigation : {
					nextEl : '.pt_special_benefit_wrap .pt_next_btn',
					prevEl : '.pt_special_benefit_wrap .pt_prev_btn',
				},
				on: {
					breakpoint: function () {
						var that = this;
						setTimeout(function () {
							that.slideTo(0, 0);
						}, 150);
					}
				}
			});
        },
        
        init: function() {
            this.stickyEvt();
            this.slideEvt();
            viewportChange(); // fold 해상도 대응
        }
    };

    benefitzone.init();
})();