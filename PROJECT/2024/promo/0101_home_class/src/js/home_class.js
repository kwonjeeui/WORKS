import { PT_STATE, util as _ } from './modules/bs_common';
import { anchor } from './modules/anchor';
// import { accordian } from './modules/accordian';
// import { tab } from './modules/tab';
// import { copy } from './modules/copy';
// import { modal } from './modules/modal';
// import { count } from './modules/countdown';
// import { coupon, promoCoupon } from './modules/coupon';
// import { sns } from './modules/sns';
// import { video, videoKv } from './modules/video';
import { sticky } from './modules/sticky';
import { category_tab } from './modules/category_tab';

// 필요 한 부분만 남기고 제거해서 사용해주세요. 
// 실행소스 참고는 BS스크립트 3버전을 참고해주세요. PROJECT/00_bs_script_v3
$(document).ready(function(){

    anchor.click([
        {
            el: '[data-role-anchor="con01"]',
            target: '.sec_kv'
        },
        {
            el: '[data-role-anchor="con02"]',
            target: '.sec_open_banner',
            scroll: [-90, -90]
        },
        {
            el: '[data-role-anchor="con03"]',
            target: '.sec_program',
            scroll: [-90, -90]
        },
        {
            el: '[data-role-anchor="con04"]',
            target: '.sec_class',
            scroll: [-90, -90]
        },
        {
            el: '[data-role-anchor="con05"]',
            target: '.sec_contest',
            scroll: [-90, -90]
        },
        {
            el: '[data-role-anchor="con06"]',
            target: '.sec_event',
            scroll: [-90, -90]
        },
        {
            el: '[data-role-anchor="con07"]',
            target: '.sec_comp',
            scroll: [-90, -90]
        },
        {
            el: '[data-role-anchor="notice3"]',
            target: '.notice_area3'
        },
        {
            el: '[data-role-anchor="notice2"]',
            target: '.notice_area2'
        },
        {
            el: '[data-role-anchor="notice1"]',
            target: '.notice_area1'
        },
        {
            el: '[data-role-anchor="program"]',
            target: '.sec_program .pt_link',
            scroll: [-90, -90]
        },
    ]);

    anchor.load([
        // s: url 명칭 고정 *삭제, 수정하지마세요*
        {
            url: 'hcevent12',
            target: '.sec_open_banner',
            scroll: [-150, -150]
        },
        {
            url: 'bestprogram',
            target: '.sec_program',
            scroll: [-150, -150]
        },
        {
            url: 'recommandvod',
            target: '.sec_class',
            scroll: [-150, -150]
        },
        {
            url: 'homeclassevent01',
            target: '.sec_contest',
            scroll: [-150, -150]
        },
        {
            url: 'recommand',
            target: '.sec_event',
            scroll: [-150, -150]
        },
        {
            url: 'homclassvod2',
            target: '.sec_comp',
            scroll: [-150, -150]
        },
        {
            url: 'freeclass',
            target: '.sec_class',
            scroll: [-150, -200]
        },
        {
            url: 'healthclass',
            target: '.pt_link__item--health',
            scroll: [-230, -530]
        },
        {
            url: 'makeupstyling',
            target: '.pt_link__item--beauty',
            scroll: [-230, -530]
        },
        {
            url: 'childedu',
            target: '.pt_link__item--education',
            scroll: [-230, -530]
        }
        

        // e: url 명칭 고정 *삭제, 수정하지마세요*
    ]);

    function swiperWrap(){
        const kvSwiper = new Swiper('.pt_kv__swiper', {
            slidesPerView: 'auto',
            allowTouchMove: true,
            preloadImages: false,
            lazy: true,
            autoplay: {
                delay: 5000
            },
            loop: true,
            navigation: {
                nextEl: '.pt_kv__swiper .swiper-button-next',
                prevEl: '.pt_kv__swiper .swiper-button-prev',
            },
            pagination: {
                el: '[data-pagination]',
                clickable: true,
                bulletElement: 'button'
            },
            a11y: {
                prevSlideMessage: '이전 슬라이드',
                nextSlideMessage: '다음 슬라이드',
                slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.',
            },
            // breakpoints: {
            //     769: {
            //         allowTouchMove: false
            //     }
            // },
            on: {
                breakpoint: function() {
                    var that = this;
                    setTimeout(function() {
                        that.slideTo(0, 0);
                    }, 150);
                },
                init: function(){
                    // play/pause
                    $('.pt_kv__swiper-btn').on('click', function() {
                        $(this).toggleClass("pt_kv__swiper-btn--pause");
                        if($(this).hasClass("pt_kv__swiper-btn--pause")) {
                            kvSwiper.autoplay.stop();
                        } else {
                            kvSwiper.autoplay.start();
                        }
                    });
                },
                slideChange: function(){
                    const activeIndex = this.activeIndex;
                    const $control = $('.pt_kv__swiper-control');

                    if(activeIndex === 4 || activeIndex === 8){
                        $control.addClass('pt_dark');
                    } else {
                        $control.removeClass('pt_dark');
                    }
                }

            }
        });
    
        const tabSwiper = new Swiper('.pt_tab_swiper_mo', {
            slidesPerView: 'auto',
            navigation: {
                prevEl: '.sec_nav .pt_arrow_box .pt_slide_prev',
                nextEl: '.sec_nav .pt_arrow_box .pt_slide_next',
            },
            breakpoints: {
                769 : {
                    allowTouchMove: false
                }
            },
            on: {
                breakpoint: function() {
                    var that = this;
                    setTimeout(function() {
                        that.slideTo(0, 0);
                    }, 150);
                }
            }
        })

        const classSwiper = new Swiper('.pt_class__swiper', {
            slidesPerView: 'auto',
            allowTouchMove: true,
            loop: false,
            preloadImages: false,
            lazy: true,
            observer: true,
            observeParents: true,
            navigation: {
                prevEl: '.pt_class__swiper .swiper-button-prev',
                nextEl: '.pt_class__swiper .swiper-button-next',
            },
            pagination: {
                el: '.pt_class .swiper-pagination',
                type: 'bullets',
            },
            on: {
                breakpoint: function() {
                    var that = this;
                    setTimeout(function() {
                        that.slideTo(0, 0);
                    }, 150);
                }
            }
        });
        
        // s: class 스와이퍼 pc에서 작동X

        // let nowWidth = $(window).width();
        // let classSwiper = undefined;

        // function initSwiper() {
        //     if (nowWidth <= 720 && classSwiper == undefined) {
        //         classSwiper = new Swiper('.pt_class__swiper', {
        //             slidesPerView: 'auto',
        //             allowTouchMove: true,
        //             loop: true,
        //             preloadImages: false,
        //             lazy: true,
        //             observer: true,
        //             observeParents: true,
        //             navigation: {
        //                 prevEl: '.pt_class__swiper .swiper-button-prev',
        //                 nextEl: '.pt_class__swiper .swiper-button-next',
        //             },
        //             pagination: {
        //                 el: '.swiper-pagination',
        //                 type: 'bullets',
        //             },
        //             on: {
        //                 breakpoint: function() {
        //                     var that = this;
        //                     setTimeout(function() {
        //                         that.slideTo(0, 0);
        //                     }, 150);
        //                 }
        //             }
        //         });
        //     } else if (nowWidth > 720 && classSwiper != undefined) {
        //         classSwiper.destroy();
        //         classSwiper = undefined;
        //     }
        // }
        
        // initSwiper();
    
        // $(window).on('resize', function () {
        //     nowWidth = $(window).width();
        //     initSwiper();
        // });

        // e: class 스와이퍼 pc에서 작동X

       
    }
    
    function imgLazy(){
        const observerbg = lozad('.pt_bg-image', {
            loaded: function(el) {
                el.classList.add('pt_add-bg');
            }
        });
        observerbg.observe()
    }

    function compBtn(){
        let btnHref = [
            'https://www.samsung.com/sec/all-mdchoiceshop/all-all-mdchoiceshop/?HomeClass-Health',
            'https://www.samsung.com/sec/all-mdchoiceshop/all-all-mdchoiceshop/?mds-hot-deals',
            'https://www.samsung.com/sec/all-mdchoiceshop/all-all-mdchoiceshop/?mds-hot-deals',
            'https://www.samsung.com/sec/all-mdchoiceshop/all-all-mdchoiceshop/?HomeClass-Hobby',
            'https://www.samsung.com/sec/all-mdchoiceshop/all-all-mdchoiceshop/?Hobby'
        ]
        let btnOmin = [
            'sec:homeclass:homeclass:launching:goto_md01',
            'sec:homeclass:homeclass:launching:goto_md02',
            'sec:homeclass:homeclass:launching:goto_md03',
            'sec:homeclass:homeclass:launching:goto_md04',
            'sec:homeclass:homeclass:launching:goto_md05'
        ]
        $('.sec_comp .swiper-slide').click(function(){
            let idx = $(this).index();
        
            $('.pt_btn_comp_btn').attr('href',btnHref[idx])
                                 .attr('data-omni',btnOmin[idx]);
        })
    }

    // accordian.toggle([
    //     {
    //         el: '[data-role-accordian="sec_accordian01"]',
    //         target: '#toggle01'
    //     },
    //     {
    //         el: '[data-role-accordian="sec_accordian02"]',
    //         target: '#toggle02',
    //         speed: 0
    //     },
    //     {
    //         el: '[data-role-accordian="sec_accordian03"]',
    //         target: '#toggle03',
    //         group: 'group01'
    //     },
    //     {
    //         el: '[data-role-accordian="sec_accordian04"]',
    //         target: '#toggle04',
    //         group: 'group01'
    //     },
    //     {
    //         el: '[data-role-accordian="sec_accordian05"]',
    //         target: '#toggle05',
    //         openFocus: 'toggle05'
    //     },
    //     {
    //         el: '[data-role-accordian="sec_accordian06"]',
    //         target: '#toggle06',
    //         openFocus: 'toggle06',
    //     },
    //     {
    //         el: '[data-role-accordian="sec_accordian07"]',
    //         target: '#toggle07',
    //         open: true
    //     },
    //     {
    //         el: '[data-role-accordian="sec_button_test"]',
    //         target: '#button01'
    //     }
    // ]);

    // tab.click([
    //     {
    //         el: '[data-role-tab="sec_tabmenu01"]',
    //         target: '#tab01',
    //         default: 1
    //     },
    //     {
    //         el: '[data-role-tab="sec_tabmenu02"]',
    //         target: '#tab02',
    //     },
    // ]);

    // video.init([
    //     {
    //         el: '[data-role-video="video01"]',
    //         target: '#video03',
    //         video: 'https://images.samsung.com/kdp/event/sec/PM_0607_alarm_samsung_careplus/launching/video/care.mp4'
    //     },
    //     {
    //         el: '[data-role-video="video02"]',
    //         target: '#video02',
    //         youtube: 'Ix0a4QRZzUU'
    //     }
    // ])

    // videoKv.init({
    //     target: '#kv_video',
    //     maxCount: 1
    // });

    // copy.click();
    // modal.init();
    sticky.init();
    category_tab.init();
    // coupon.init();
    // promoCoupon.init();
    // sns.init();

    // 카운트다운 타이머 설정
    //count.init('#count01', '2023/03/31 23:59:59');

    swiperWrap();
    imgLazy();
    compBtn();
    viewportChange(); // fold 해상도 대응
});
