import { PT_STATE, util as _} from './bs_common';

export const sticky = {
    init() {
        let tabIndex = 0;

        function setBlindTxt($this) {
            $this.closest('.sec_nav').find('li a .blind').remove();
            $this.append('<span class="blind">선택됨</span>');
        }

        const navArr = ['#sec_nav_ai', '#sec_nav_combo'];

        let stickyMove = function() {
            const scrollTop = $(window).scrollTop();

            navArr.forEach((item) => {
                if ($(item).hasClass('pt_page_hide')) return false;

                const $secNav = $(item);
                const $nav = $secNav.find('.pt_sticky');
                const _navHeight = $nav.outerHeight();
                const ancArr = $nav.find('[data-role-anchor]');
                const $compoTab = $('.pt_category_box');
                const $about = $('.sec_about');

                if (scrollTop >= $secNav.offset().top){
                    $nav.addClass('pt_fixed');
                }
                else{
                    $nav.removeClass('pt_fixed');
                }

                if (scrollTop >= $compoTab.offset().top - _navHeight && scrollTop <= $about.offset().top - _navHeight) {
                    $nav.hide();
                } else {
                    $nav.show();
                }
                for (let i = 0; i < ancArr.length; i++) {
                    const $btn = $(ancArr[i]);
                    const target = $btn.attr('data-target');
                    const nextTarget = i + 1 == ancArr.length ? '.sec_notice' : $(ancArr[i +1]).attr('data-target');

                    if (scrollTop >= $(target).offset().top + _.pxToVw(-60, -120) && scrollTop < $(nextTarget).offset().top + _.pxToVw(-60, -120)) {
                        const $sibing = $btn.closest('li').siblings().find('[data-role-anchor]');
                        $sibing.removeClass('on');
                        $btn.addClass('on');
                        setBlindTxt($btn);
                        
                        break;
                    };

                }

            });
            
        }

        stickyMove();
        
        $(window).on('scroll', stickyMove);
    }
};