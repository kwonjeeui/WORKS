import { PT_STATE, util as _} from './bs_common';

export const sticky = {
    init() {
        let stickyMove = function() {
            let winScrollTop = $(window).scrollTop();
            let navTab = $(".sec_nav");
            let _navHeight = navTab.outerHeight();
            let setNavFixed = ['.pt_ongoing--youmake', '.pt_ongoing--smartphones', '.pt_ongoing--tab', '.pt_ongoing--watch', '.sec_banner'];
            let scrollTop = $(this).scrollTop();
            let scrollClass =  _.pxToVw(-142, -167);
  
           if (winScrollTop >= navTab.offset().top && winScrollTop <= $(".sec_notice").offset().top - _navHeight) {
              $(".pt_nav-slider").attr("sticky", "");
              setNavFixed.forEach((fixedClass, index)=>{
                if(($(fixedClass).offset().top - _navHeight + scrollClass) <= scrollTop){
                    navTab.find('li').removeClass('pt_nav__item--active');
                    navTab.find('li').eq(index).addClass('pt_nav__item--active');
                    return;
                }
              });
          } else {
              $(".pt_nav-slider").removeAttr("sticky")
              navTab.find('li').removeClass('pt_nav__item--active');
          }
  
        };
  
        $(window).on('scroll.sticky', stickyMove);
    }
  
  };