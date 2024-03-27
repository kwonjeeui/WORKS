import { PT_STATE, util as _} from './bs_common';

export const sticky = {
    init() {

        let tabIndex = 0;

        let stickyMove = function() {
            window.requestAnimationFrame(()=>{
                let $navWrapper = $('.pt_mo_swiper');
                let _navHeight = $('.pt_mo_swiper').outerHeight();
                let scrollTop = $(window).scrollTop();
                let navlng = $('.sec_nav li').length;

                if (scrollTop >= $('.sec_nav').offset().top && scrollTop <= $('.sec_component').offset().top){
                    $('.pt_nav_sticky').addClass('pt_fixed');
                }else if (scrollTop >= $('.sec_about').offset().top - _navHeight){
                    $('.pt_nav_sticky').addClass('pt_fixed');
                } else {
                    $('.pt_nav_sticky').removeClass('pt_fixed');
                }

                if (($('.sec_kv').offset().top) <= scrollTop && ($('.sec_buying').offset().top - _navHeight) >= scrollTop){
                    tabIndex = 0;
                }else if(($('.sec_buying').offset().top - _navHeight) <= scrollTop && ($('.pt_starbucks-banner').offset().top - _navHeight) >= scrollTop){
                    tabIndex = 1;
                }else if(($('.pt_starbucks-banner').offset().top - _navHeight) <= scrollTop && ($('.sec_faq').offset().top - _navHeight) >= scrollTop){
                    tabIndex = 2;
                }else if(($('.sec_faq').offset().top - _navHeight) <= scrollTop && ($('.component_tab').offset().top - _navHeight) >= scrollTop){
                    tabIndex = 3;
                }else if(($('.component_tab').offset().top - _navHeight) <= scrollTop && ($('.sec_about').offset().top - _navHeight) >= scrollTop){
                    tabIndex = 4;
                }else if(($('.sec_about').offset().top - _navHeight) <= scrollTop && ($('.sec_notice').offset().top - _navHeight) >= scrollTop){
                    tabIndex = 5;
                }

                for(let i=0; i < navlng; i++){
                    if(i == tabIndex){
                        $navWrapper.find('ul li').eq(i).find('a').addClass('on');
                        setBlindTxt($('.sec_nav li').eq(i).find('a'));
                    }else{
                        $navWrapper.find('ul li').eq(i).find('a').removeClass('on');
                    }
                }
            });
        }
        
        function setBlindTxt($this) {
            $this.closest('.sec_nav').find('li a .pt_nav_btn').remove();
            $this.append('<span class="blind pt_nav_btn">선택됨</span>');
        }

      $(window).on('scroll.sticky', stickyMove);
    }
};