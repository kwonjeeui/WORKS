import { PT_STATE, util as _} from './bs_common';

export const sticky = {
    init() {
        let stickyMove = function() {
            let winScrollTop = $(window).scrollTop();
            let gnbHeader = $("#header__navi");
            let navTab = $(".sec_nav");
            let _gnbHeight = gnbHeader.outerHeight();
            let _navHeight = navTab.outerHeight();
            let setNavFixed = ['.sec_ai_toon', '.sec_content', '.sec_chance'];
            let scrollTop = $(this).scrollTop();
            let scrollClass =  _.pxToVw(0, 0);
            let bodyClass = $("body").attr('class');

            if(bodyClass == 'scroll-down'){
                scrollClass =  _.pxToVw(0, 0)
            }else{
                scrollClass =  _.pxToVw(-80, -55)
            }

            if (winScrollTop >= navTab.offset().top && winScrollTop <= $(".sec_notice").offset().top - _navHeight) {
                $(".pt_nav").attr("sticky", "");
                setNavFixed.forEach((fixedClass, index)=>{
                    if (($(fixedClass).offset().top - _navHeight + scrollClass) <= scrollTop){
                        navTab.find('li').removeClass('pt_nav__item--active');
                        navTab.find('li').eq(index).addClass('pt_nav__item--active');
                    } else {
                        navTab.find('li').eq(index).removeClass('pt_nav__item--active');
                    }
                });
            } else if (winScrollTop <= navTab.offset().top - _gnbHeight) {
                $(".pt_nav").removeAttr("sticky")
                navTab.find('li').removeClass('pt_nav__item--active');
            } else {
                $(".pt_nav").removeAttr("sticky");
            }
        };
        $(window).on('scroll.sticky', stickyMove);
    }
};