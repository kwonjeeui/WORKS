
import { PT_STATE, util as _ } from './modules/bs_common';
import { anchor } from './modules/anchor';
import { modal } from './modules/modal';
import { accordian } from './modules/accordian';


// ------- 갤캠스 필수 기능 start
var galcams = {
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

    accordian.toggle([
        {
            el: '[data-role-accordian="pt_kb__notice"]',
            target: '#pt_kb__notice'
        }
    ]);

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