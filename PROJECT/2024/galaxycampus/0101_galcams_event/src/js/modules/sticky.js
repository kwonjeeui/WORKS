import { PT_STATE, util as _} from './bs_common';
import evtData from "../../data/event.json";

export const sticky = {
    init() {
        const eventData = evtData.result;
        const setNavFixed = eventData.map((item, index)=>{
            return `.sec_${item.name}`;
        });

        // setNavFixed.push('.sec_galaxy');

        let stickyMove = function() {

            let winScrollTop = $(window).scrollTop();
            let navTab = $(".sec_nav");
            let firstSec = $(".sec_event-wrap .sec_event:first-child"); //첫번째 이벤트 섹션으로 수정(소이)
            let _navHeight = navTab.outerHeight();
            let scrollTop = $(this).scrollTop();
            let scrollClass =  _.pxToVw(-142, -167);

            // header 높이값 위로 앵커 시작되도록 수정(에런)
            const eventHeader = document.getElementById('header__navi');
            const headerHeight = eventHeader.offsetHeight;

            // console.log('스크롤값 : ' + winScrollTop);
            // console.log('포인트값 : ' + (firstSec.offset().top - (_navHeight + headerHeight)));

           if (winScrollTop >= firstSec.offset().top - (_navHeight + headerHeight + 10) && winScrollTop <= $(".sec_notice").offset().top - _navHeight) { 
            
            if (document.body.classList.contains('scroll-up')) {
                $(".pt_nav-slider").attr("sticky", "");
            } else if (winScrollTop >= firstSec.offset().top - (_navHeight + 10)) {
                $(".pt_nav-slider").attr("sticky", "");
            }
            // -- header 높이값 위로 앵커 시작되도록 수정(에런)


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