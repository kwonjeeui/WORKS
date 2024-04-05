import modelData from "../data/modelData.json";
import premium from "../data/premiumData.json";
import { PT_STATE, util as _ } from './modules/bs_common';
import { anchor } from './modules/anchor';
import { modal } from './modules/modal';
import { accordian } from './modules/accordian';


anchor.click([
    {
        el: '[data-role-anchor="benefit_month"]',
        target: '.sec_month',
        scroll: [-50, 0],
    },
    {
        el: '[data-role-anchor="billing_discount"]',
        target: '.sec_samsung_card',
    },
	{
        el: '[data-role-anchor="interest_free"]',
        target: '.sec_card_benefit',
        // scroll: [-50, -80],
    },
	{
        el: '[data-role-anchor="membership_points"]',
        target: '.sec_point',
    },
	{
        el: '[data-role-anchor="exclusive_service"]',
        target: '.sec_special_benefit',
    },
    {
        el: '[data-role-anchor="month_notice"]',
        target: '.sec_month_notice',
    },
    {
        el: '[data-role-anchor="samsungcard_notice"]',
        target: '.sec_samsungcard_notice',
    },
    // {
    //     el: '[data-role-anchor="paymentcard_notice"]',
    //     target: '.sec_paymentcard_notice',
    // },
    {
        el: '[data-role-anchor="card_benefit_notice"]',
        target: '.sec_benefit_notice',
    },
    {
        el: '[data-role-anchor="membership_notice"]',
        target: '.sec_membership_notice',
    },
    {
        el: '[data-role-anchor="sec_kb_notice"]',
        target: '.sec_kb_notice',
    },
]);

anchor.load([
    {
        url: 'kv',
        target: '.sec_kv'
    },
    {
        url: 'monthlybenefit',
        target: '.sec_month'
    },
    {
        url: 'Paydiscount',
        target: '.sec_samsung_card',
    },
    {
        url: 'paydiscount',
        target: '.sec_samsung_card',
    },
    {
        url: 'nointerest',
        target: '.sec_card_benefit',
        // scroll: [-50, -80],
    },
    {
        url: 'point',
        target: '.sec_point',
    },
    {
        url: 'togetherbuy',
        target: '.sec_special_banner',
        scroll: [-180, -110],
    },
    {
        url: 'service',
        target: '.sec_special_benefit',
    },
    {
        url: 'end',
        target: '.pt_end',
    },
]);

modal.init();

accordian.toggle([
    {
        el: '[data-role-accordian="pt_kbcard__notice"]',
        target: '#pt_kbcard__notice',
        speed: 300
    },
]);


;(function(){
    'use strict';

    var benefitzone = {
		stickyEvt: function(){
            let navTab = $(".pt_nav_list");
            let navHeight = navTab.outerHeight();
            let navTop = navTab.offset().top;
            let stickyStop =  $('.sec_notice').offset().top;
            let scrollClass =  _.pxToVw(-0, 70);
            let scroll =  _.pxToVw(-0, 120);

            let setNavFixed = ['.sec_month', '.sec_samsung_card', '.sec_card_benefit', '.sec_point', '.sec_special_benefit'];

			$(window).on('scroll', function() {
              
				let scrollTop = $(this).scrollTop();
				if(scrollTop >= $('.sec_nav').offset().top && scrollTop <= (stickyStop - navHeight ) + (scroll)){
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
            // let banSwiper = new Swiper(".pt_banslide", {
            //     slidesPerView: 'auto',
            //     // effect: "fade",
            //     observer:true,
            //     observeParents:true,
            //     lazy:true,
            //     preloadImages:false,
            //     loop: true,
            //     autoplay: {
            //         delay: 2500,
            //         disableOnInteraction: false,
            //     },
            //     pagination: {
            //         el: '.pt_banslide__page',
            //         clickable: true,
            //         bulletElement: 'button'
            //     },
            //     // navigation: {
            //     //     nextEl: ".pt_banslide__next",
            //     //     prevEl: ".pt_banslide__prev",
            //     // },
            //     loop: true,
            //     on: {
            //         breakpoint: function() {
            //             const that = this;
            //             setTimeout(function() {
            //                 that.slideTo(0, 0);
            //             }, 150);
            //         },
            //         init: function() {
            //             $('.swiper-control').on('click', function(){
            //                 $(this).toggleClass("pt_pause pt_play");
            //                 if($(this).hasClass("pt_pause")) {
            //                     banSwiper.autoplay.start();
            //                     $('.swiper-control').html('일시정지');
            //                     $(this).attr('data-omni', '');
            //                 } else {
            //                     banSwiper.autoplay.stop();
            //                     $('.swiper-control').html('시작');
            //                     $(this).attr('data-omni', '');
            //                 }
            //             })
            //         }
            //     },
            //     breakpoints: {
            //         769: {
            //             loop: true
            //         },
            //     },
            // });

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
        modelPopup: function(){
            const modelList = modelData.result;
            const modelTable = $("#pt_popup_model");
            let _html = ``;
            modelList.forEach((item)=>{
                _html += `
                    <tr>
                        <td>${item.category}</td>
                        <td>${item.group}</td>
                        <td>${item.name}</td>
                        <td>${item.seg}</td>
                        <td>${item.benefitPrice}</td>
                    </tr>
                `
            })
            modelTable.html(_html);
            
        },

        modelPopup1: function(){
            const list1 = premium.result;
            const listTable = $("#pt_popup_model1");
            let _html = ``;
            list1.forEach((item)=>{
                _html += `
                    <tr>
                        <td>${item.category}</td>
                        <td>${item.sku}</td>
                    </tr>
                `
            })
            listTable.html(_html);
            
        },    

        init: function() {
            this.stickyEvt();
            this.slideEvt();
            this.modelPopup();
            this.modelPopup1();
            viewportChange(); // fold 해상도 대응
        }
    };

    benefitzone.init();
})();