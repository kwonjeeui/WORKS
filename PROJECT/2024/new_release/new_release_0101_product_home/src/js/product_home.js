import { PT_STATE, util as _ } from './modules/bs_common';

$(document).ready(function(){

    function swiperEvt(){
        let productSwiper = undefined;
        let slideNum = $('.pt_product .swiper-slide').length //슬라이드 총 개수
        let slideInx = 0; //현재 슬라이드 index
    
        //디바이스 체크
        let oldWChk = window.innerWidth > 769 ? 'pc' : 'mo';
        // 모바일에서 스와이퍼 동작 여부(true: 모바일에서 스와이퍼 동작, false: 모바일에서 스와이퍼 동작x)
        const isMoslide = true;

        sliderAct();
        $(window).on('resize', function () {
            let newWChk = window.innerWidth > 769 ? 'pc' : 'mo';
            oldWChk = newWChk;
            
            sliderAct();
        });


        function sliderAct(){
            //슬라이드 초기화 
            if (productSwiper != undefined){ 
                productSwiper.destroy();
                productSwiper = undefined;

                $('.pt_product .swiper-control').off('click.swiperControl');
            }
    
            //slidesPerView 옵션 설정
            let viewNum = oldWChk == 'mo' ? 7 : 2.5;

            let autoPlayChk = oldWChk == 'pc' ? {delay: 3000,disableOnInteraction: true} : false;

            //loop 옵션 체크
            let loopChk = slideNum > viewNum;

            if (!isMoslide) {
                productSwiper = new Swiper('.swiper-container.pt_product', {
                    slidesPerView: 'auto',
                    spaceBetween: 0,
                    centeredSlides: false,
                    loop: loopChk,
                    allowTouchMove: false,
                    observer: true,
                    observeParents: true,
                    preloadImages: false,
                    lazy: true,
                    autoplay: autoPlayChk,
                    breakpoints: {
                        769: {
                            loop: loopChk,
                            loopAdditionalSlides : 1,
                            allowTouchMove: true,
                            centeredSlides: true,
                        }
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    on: {
                        init:function() {
                            $('.pt_product .swiper-control').on('click.swiperControl', function() {
                                $(this).toggleClass("pt_pause pt_play");
                                if($(this).hasClass("pt_pause")) {
                                    productSwiper.autoplay.start();
                                    $('.pt_product .swiper-control').html('<span class="blind">정지</span>');
                                    $('.pt_product .swiper-control').attr('title', '정지');
                                } else {
                                    productSwiper.autoplay.stop();
                                    $('.pt_product .swiper-control').html('<span class="blind">재생</span>');
                                    $('.pt_product .swiper-control').attr('title', '재생');
                                }
                            });
                            setTimeout(function() {
                                let pageLength = $('.pt_product .swiper-pagination > span').length;
                                for(let i = 0; i < pageLength; i++){
                                    $('.pt_product .swiper-pagination > span').eq(i).html('<span class="blind">'+(i+1)+'번째 슬라이드 <em class="pt_select"></em></span>');
                                }
                                $('.pt_product .swiper-pagination > span').eq(0).find('.pt_select').html('선택됨');
                                $('.pt_product .swiper-slide a').attr('tabIndex', '-1');
                                $('.pt_product .swiper-slide-active a').attr('tabIndex', '0');
    
                                if(oldWChk == 'mo'){
                                    $('.pt_product .swiper-slide a').attr('tabIndex', '0');
                                }
                            });
                        },
                        slideChangeTransitionStart: function() {
                            $('.pt_product .swiper-pagination > span .pt_select').html('');
                            $('.pt_product .swiper-pagination > span').eq(this.realIndex).find('.pt_select').html('선택됨');
                            $('.pt_product .swiper-slide a').attr('tabIndex', '-1');
                            $('.pt_product .swiper-slide-active a').attr('tabIndex', '0');
    
                            if(oldWChk == 'mo'){
                                $('.pt_product .swiper-slide a').attr('tabIndex', '0');
                            }
                        },
                        activeIndexChange: function () {
                            slideInx = this.realIndex; //현재 슬라이드 index 갱신
                        },
                    }
    
                });
            } else {
                productSwiper = new Swiper('.swiper-container.pt_product', {
                    slidesPerView: 'auto',
                    loop: true,
                    loopAdditionalSlides : 1,
                    allowTouchMove: true,
                    centeredSlides: false,
                    observer: true,
                    observeParents: true,
                    preloadImages: false,
                    lazy: true,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false
                    },
                    breakpoints: {
                        769: {
                            centeredSlides: true,
                        }
                    },
                    on: {
                        breakpoint: function () {
                            var that = this;
                            setTimeout(function () {
                                that.slideTo(0, 0);
                            }, 150);
                        },
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    on: {
                        init:function() {
                            $('.pt_product .swiper-control').on('click.swiperControl', function() {
                                $(this).toggleClass("pt_pause pt_play");
                                if($(this).hasClass("pt_pause")) {
                                    productSwiper.autoplay.start();
                                    $('.pt_product .swiper-control').html('<span class="blind">정지</span>');
                                    $('.pt_product .swiper-control').attr('title', '정지');
                                } else {
                                    productSwiper.autoplay.stop();
                                    $('.pt_product .swiper-control').html('<span class="blind">재생</span>');
                                    $('.pt_product .swiper-control').attr('title', '재생');
                                }
                            });
                            setTimeout(function() {
                                let pageLength = $('.pt_product .swiper-pagination > span').length;
                                for(let i = 0; i < pageLength; i++){
                                    $('.pt_product .swiper-pagination > span').eq(i).html('<span class="blind">'+(i+1)+'번째 슬라이드 <em class="pt_select"></em></span>');
                                }
                                $('.pt_product .swiper-pagination > span').eq(0).find('.pt_select').html('선택됨');
                                $('.pt_product .swiper-slide a').attr('tabIndex', '-1');
                                $('.pt_product .swiper-slide-active a').attr('tabIndex', '0');
    
                                // if(oldWChk == 'mo'){
                                //     $('.pt_product .swiper-slide a').attr('tabIndex', '0');
                                // }
                            });
                        },
                        slideChangeTransitionStart: function() {
                            $('.pt_product .swiper-pagination > span .pt_select').html('');
                            $('.pt_product .swiper-pagination > span').eq(this.realIndex).find('.pt_select').html('선택됨');
                            $('.pt_product .swiper-slide a').attr('tabIndex', '-1');
                            $('.pt_product .swiper-slide-active a').attr('tabIndex', '0');
    
                            // if(oldWChk == 'mo'){
                            //     $('.pt_product .swiper-slide a').attr('tabIndex', '0');
                            // }
                        },
                        activeIndexChange: function () {
                            slideInx = this.realIndex; //현재 슬라이드 index 갱신
                        },
                    }
    
                });
            }

            
        }
    }

    swiperEvt();
    viewportChange(); // fold 해상도 대응
});
