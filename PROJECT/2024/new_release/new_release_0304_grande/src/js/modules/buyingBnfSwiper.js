import { PT_STATE, util as _} from './bs_common';

export const buyingBnfSwiper = {
    init(){
        const contsSwiper1 = this.swiper_conts('jet01');
        const navSwiper1 = this.swiper_nav('jet01');
        this.var.swiperIns1 = { contsSwiper1, navSwiper1 }
        const contsSwiper2 = this.swiper_conts('jet02');
        const navSwiper2 = this.swiper_nav('jet02');
        this.var.swiperIns2 = { contsSwiper2, navSwiper2 }
    },
    var: {
        swiperIns1: null,
        swiperIns2: null,
        navs: document.querySelector('.pt_benefit__nav--jet01 .swiper-slide'),
    },
    swiper_nav(bnfNum) {
        let _this = this;
        return  new Swiper(".pt_benefit__nav--"+bnfNum, {
            slidesPerView: "auto",
            observer: true, // 팝업 등 숨겨져있는 상태에서 옵저버 
            observeParents: true, // 팝업 등 숨겨져있는 상태에서 옵저버 
            preloadImages: false,
            lazy: true,
            on: {
                slideChange: function() {}, // 슬라이드 변경 (오토는 불가)
                transitionEnd: function() {},  // 변경 후 (오토 가능)
                transitionStart: function() {
                    // _this.contsMove(this.activeIndex)
                }, 
                click: function() {
                    //console.log(this.clickedIndex)
                    _this.contsMove(bnfNum, this.clickedIndex)
                },
                breakpoint: function () {  // 브렉포인트 지나갈때마다
                    let that = this;
                    setTimeout(function () {
                        that.slideTo(0, 0);
                    }, 150);
                },
                init: function() {},
            },
            // navigation: {
            //     prevEl: '.conts .pt-swiper-prev',
            //     nextEl: '.conts .pt-swiper-next',                
            // },
            // autoplay: { // 오토플레이 모바일에서만 작동되게 하려면
            //     enabled: false,
            // },
            // breakpoints: {
            //     320: { // 320 이상
            //         slidesPerView: "auto",
            //         autoplay: { // 오토플레이 모바일에서만 작동되게 하려면
            //             enabled: true,
            //             delay: 3000,
            //         },
            //     },
            //     768: { // 768 이상
            //         slidesPerView: "auto",
            //     }
            // },
        });

    },
    swiper_conts(bnfNum) {
        let _this = this;
        return new Swiper(".pt_benefit__conts--"+bnfNum, {
            slidesPerView: "auto",
            observer: true, // 팝업 등 숨겨져있는 상태에서 옵저버 
            observeParents: true, // 팝업 등 숨겨져있는 상태에서 옵저버 
            preloadImages: false,
            lazy: true,
            pagination: {
                el: ".pt_benefit__conts--"+bnfNum+" .swiper-pagination",
                clickable: true,
            },
            on: {
                slideChange: function() {}, // 슬라이드 변경 (오토는 불가)
                transitionEnd: function() {
                },  // 변경 후 (오토 가능)
                transitionStart: function() {
                    let $bnfNavList = $('.pt_benefit__nav--'+bnfNum+' .swiper-slide');
                    let $bnfActive = $('.pt_benefit__conts--'+bnfNum+' .swiper-pagination .swiper-pagination-bullet-active').index();
                    
                    $bnfNavList.removeClass('on');
                    $bnfNavList.eq($bnfActive).addClass('on');
                    
                    _this.navMove(bnfNum ,this.activeIndex);
                },
                breakpoint: function () {  // 브렉포인트 지나갈때마다
                    let that = this;
                    setTimeout(function () {
                        that.slideTo(0, 0);
                    }, 150);
                },
                init: function() {},
            },
            // navigation: {
            //     prevEl: '.test_1 .pt-swiper-prev',
            //     nextEl: '.test_1 .pt-swiper-next',                
            // },
            // autoplay: { // 오토플레이 모바일에서만 작동되게 하려면
            //     enabled: false,
            // },
            // breakpoints: {
            //     320: { // 320 이상
            //         slidesPerView: "auto",
            //         autoplay: { // 오토플레이 모바일에서만 작동되게 하려면
            //             enabled: true,
            //             delay: 3000,
            //         },
            //     },
            //     768: { // 768 이하
            //         slidesPerView: "auto",
            //     }
            // },
        });

    },

    navMove(bnfNum, idx) {
        if(bnfNum === 'jet01'){
            this.var.swiperIns1.navSwiper1.slideTo(idx)
        }else if(bnfNum === 'jet02'){
            this.var.swiperIns2.navSwiper2.slideTo(idx)
        }
    },

    contsMove(bnfNum, idx) {
        if(bnfNum === 'jet01'){
            this.var.swiperIns1.contsSwiper1.slideTo(idx)
        }else if(bnfNum === 'jet02'){
            this.var.swiperIns2.contsSwiper2.slideTo(idx)
        }
    },

    tp() {
        console.log('tp', this);
        return 11
    },

}
