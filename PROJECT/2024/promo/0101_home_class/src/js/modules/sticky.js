import { PT_STATE, util as _} from './bs_common';

export const sticky = {
  init() {
      var stickyMove = function() {
          var _navHeight = $('.sec_nav').outerHeight();

          if ($(window).scrollTop() >= $('.sec_nav').offset().top && $(window).scrollTop() <= $('.sec_comp').offset().top - _navHeight){
              $('.pt_sticky').addClass('pt_fixed');
              $('.lnb_wrapper').css('top' , _navHeight)
          }
        //   else if ($(window).scrollTop() >= $('.sec_accordian').offset().top - _navHeight && $(window).scrollTop() <= $('.sec_modal').offset().top - _navHeight){
        //       $('.pt_sticky').addClass('pt_fixed');
        //   }
          else{
              $('.pt_sticky').removeClass('pt_fixed');
              $('.lnb_wrapper').css('top' , '0')
          }
          

      }

      $(window).on('scroll.sticky', stickyMove);

      var stickyMove02 = function() {
        var _navHeight02 = $('.sec_lnb').outerHeight();

      //   if ($(window).scrollTop() >= $('.sec_lnb').offset().top && $(window).scrollTop() <= $('.sec_notice').offset().top - _navHeight){
        if ($(window).scrollTop() >= $('.sec_lnb').offset().top ){
            $('.lnb_wrapper').addClass('fixed_start');
        }else{
            $('.lnb_wrapper').removeClass('fixed_start');
        }

        console.log('??');
    }

    $(window).on('scroll.sticky', stickyMove02);
  }

};