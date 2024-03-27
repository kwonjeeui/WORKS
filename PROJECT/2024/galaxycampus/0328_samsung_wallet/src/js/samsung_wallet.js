import { PT_STATE, util as _ } from './modules/bs_common';
import { anchor } from './modules/anchor_galcams'; //갤캠스 네비 앵커드 스크롤 이슈 수정
import { sticky } from './modules/sticky_galcams'; //갤캠스 네비 앵커드 스티키 이슈 수정
import { sns } from './modules/sns';
import { copy } from './modules/copy';

// ------- 갤캠스 프로젝트 기능 start
const samsung_wallet = {
    setSwiper() {
        // nav 영역 swiper
        const navSlider = new Swiper('.pt_nav.swiper-container', {
            slidesPerView: 'auto',
            allowTouchMove: true,
            preloadImages: false,
            lazy: true,
            breakpoints: {
                769: {
                    slidesPerView: 'auto',
                    allowTouchMove: false,
                }
            },
        });

        // firstroo 영역 swiper
        const firstrooSwiper = new Swiper ('.swiper-container.pt_swiper',{
            slidesPerView: 'auto',
            allowTouchMove: true,
            preloadImages: false,
            slidesPerGroup : 1,
            pagination: {
                el: '.swiper-pagination.pt_pagination',
                clickable : true,
            },
            lazy: true,
            breakpoints: {
                769: {
                    // allowTouchMove: false,
                    slidesPerGroup : 2,
                }
            },
            on: {
                breakpoint: function () {
                    var that = this;
                    setTimeout(function () {
                        that.slideTo(0, 0);
                    }, 150);
                },
                // watchOverflow : true
            },
        });
    },

    init() {
        this.setSwiper();
        viewportChange(); // fold 해상도 대응
    }
};
// ------- 갤캠스 프로젝트 기능 e

$(document).ready(function(){
    anchor.click([
        {
            el: '[data-role-anchor="sec_anchor01"]',
            target: '.sec_firstroo',
            speed: 1000,
            scroll: [0, -55]
        },
        {
            el: '[data-role-anchor="sec_anchor02"]',
            target: '.sec_secondroo',
            speed: 1000,
            scroll: [0, -55]
        },
        {
            el: '[data-role-anchor="sec_anchor03"]',
            target: '.sec_thirdroo',
            speed: 1000,
            scroll: [0, -55]
        },
        {
            el: '[data-role-anchor="secondroo_notice"]',
            target: '.noti_quiz',
            speed: 1000,
            scroll: [0, 0]
        },
        {
            el: '[data-role-anchor="thirdroo_notice"]',
            target: '.noti_emart',
            speed: 1000,
            scroll: [0, 0]
        },
    ]);

    anchor.load([
        {
            url: 'event01',
            target: '.sec_firstroo',
            scroll: [-62, -110]
        },
        {
            url: 'event02',
            target: '.sec_secondroo',
            scroll: [-62, -110]
        },
        {
            url: 'event03',
            target: '.sec_thirdroo',
            scroll: [-62, -110]
        },
    ]);

    copy.click();
    sticky.init();
    sns.init();

    /** 백그라운드 이미지에 lozad 적용 시 필요 함수 */
    const observerbg = lozad('.pt_bg-image', {
    loaded: function(el) {
            el.classList.add('pt_add-bg');
        }
    });
    observerbg.observe();

    samsung_wallet.init(); // 갤캠스 기능 호출 (viewportChange() 포함)
});
