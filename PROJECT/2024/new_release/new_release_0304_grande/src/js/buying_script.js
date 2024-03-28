import buyingDataAi from "../data/data_grande_ai.json";
import buyingDataCombo from "../data/data_grande_combo.json";
import buyingSlide from "../data/buyingSlide.json";
// import benefitImage from "../data/benefitImage.json";
import {Buying} from './modules/buying_new';
import {BuyingSlide} from "./modules/buyingSlide";
import {util as _} from './modules/bs_common';
import {buyingAccordian} from './modules/buyingAccordian';
// import {buyingBnfSwiper} from './modules/buyingBnfSwiper';//혜택 스와이퍼
// import {promoCoupon} from './modules/coupon';

const $secWrap = $('.sec_project_wrap');
let mainBuying = null;
let comboBuying = null;

/**
 * 초기변수, 얼럿 메시지, 옴니값 등 바잉툴 초기값
 * - 초기 설정값(변경X): isOnce, isOpened, isDeactive
 * - deactiveMessage: 구매 관련 버튼 클릭시 얼럿 메시지
 * - omni: 구매 관련 버튼들의 옴기값 작성
 * - slideImage: 제품 슬라이드 이미지 파일경로 및 파일명 작성
 */
let config = {
    isOnceAi: false,
    isOpenedAi: true,
    isOnceCombo: false,
    isOpenedCombo: true,
    isDeactive: false,
    deactiveMessage: '중고 추가 보상 프로그램과 My갤럭시클럽까지<br/>모든 옵션 선택 후 구매 가능합니다.',
    telecomMessage: '통신사 선택(택1)까지<br/> 옵션 선택 후 신청 가능합니다.',
    telecomEvtNum: {
        skt: '32738',
        kt: '32739',
        lg: '32740'
    },
    netFunnel: {
        buy: 'b2c_cta_event',
        npay: 'b2c_cta_event',
        // cart: 'b2c_promotion',
        // present: 'b2c_promotion',
        pickup: ''
    },
    omniAi: {
        buy: 'sec:event:bespoke-grandeai:goto_POD_direct_buy_',
        link: 'sec:event:bespoke-grandeai:goto_POD_PD_URL_',
        coupon: 'sec:event:bespoke-grandeai:button_Download_coupon_',
        buySticky: 'sec:event:bespoke-grandeai:goto_POD_direct_buy_',
        linkSticky: 'sec:event:bespoke-grandeai:goto_POD_PD_URL_',
        couponSticky: 'sec:event:bespoke-grandeai:button_Download_coupon_',
    },
    omniCombo: {
        buy: 'sec:event:bespoke-grandeai:goto_POD_direct_buy_',
        link: 'sec:event:bespoke-grandeai:goto_POD_PD_URL_',
        coupon: 'sec:event:bespoke-grandeai:button_Download_coupon_',
        buySticky: 'sec:event:bespoke-grandeai:goto_POD_direct_buy_',
        linkSticky: 'sec:event:bespoke-grandeai:goto_POD_PD_URL_',
        couponSticky: 'sec:event:bespoke-grandeai:button_Download_coupon_',
    },
    slideImage: buyingSlide
}

/**
 * 바잉툴 초기화
 */
let buyingSlideAi = null;
let buyingSlideCombo = null;

function initBuyingAi() {
    mainBuying = new Buying('#pt_buying', {
        pdList: buyingDataAi.result,
        defaults: true,
        option: {
            type: 'hide',
            scroll: {
                use: false
            },
        },
        sessionStorage: false,
        autoScope: {
            use: true
        },
        on: {
            init(buying) {
                // const slideSubTxt = document.querySelector('.pt_slide__subtxt')

                // 제품 슬라이드 초기화
                buyingSlideAi = new BuyingSlide(buying, {
                    target: '#buying_slide_ai',
                    imageData: config.slideImage.buyingSlideAi,
                });

                // 바잉툴 슬라이드 첫번째만 아래 문구 없애기
                // buyingSlideAi.swiper.on('slideChange', function() {
                //     buyingSlideAi.swiper.realIndex === 0 ? 
                //         slideSubTxt.classList.add('hide-txt') : slideSubTxt.classList.remove('hide-txt')  
                // })

                
                // 모든 옵션을 클릭하기전까지, 버튼 클릭시 얼럿창 출력 이벤트
                buyingUtil.clickDeactiveBuy();

                // 구매하기 이벤트, etc 옵션 생길 시 주석처리
                PT_STATE.service.initBuy();

                // 매장픽업 이벤트 활성화
                // buyingUtil.pickupEvt();

                //바잉툴혜택 스와이퍼
                // buyingBnfSwiper.init();
            },
            // optionChangeEnd(buying, option) {
            //     const selected = buying.state.selected;
            //     const selectOption = buying.state.selectOption;
                
            // },
            productChangeEnd(buying) {
                const selectOptEtc = buying.state.selectOptionEtc;
                const selected = buying.state.selected;
                const sku = selected && selected.sku;
                const model = selected && selected.type;
                const gCode = selected && selected.gCode;


                // 선택된 제품의 데이터를 html에서 출력함
                buyingUtil.renderHtml(buying, '.sec_sticky.ai');

                // 각 버튼 클릭시 마다 API 실행시 사용될 data 속성값 저장 (G코드, 스큐, 회사코드 등)
                buyingUtil.updateBtn(buying.$el, selected, selectOptEtc, config.omniAi, '.sec_sticky.ai');

                // 매장픽업 초기화
                // buyingPickup.reset();

                // 바잉툴 상단, 하단 슬라이드 업데이트
                buyingSlideAi.update({sku:sku, model:model}, config.isOnceAi);

                // 제품 품절여부 확인 및 구매관련버튼 활성/비활성화
                PT_STATE.service.checkSoldout(gCode, function(saleStatCd){
                    buyingUtil.soldoutEvt(saleStatCd, buying.$el, '.sec_sticky.ai');
                });

                // 제품 별점 api
                PT_STATE.service.getCommentAvg(gCode, function(commentAvg) {
                    const $star = $('[data-comment]');

                    if (commentAvg === '0.0') {
                        $star.hide();
                    } else {
                        $star.html(commentAvg);
                        $star.attr('href', selected.pdUrl + '?focus=review');
                        $star.attr('title', selected.sku + '제품 상품평 페이지로 이동');
                        $star.show();
                    }
                });

                if(selected.priceC == '-') {
                    $('.pt_sale-box--priceB .pt_sale').addClass('pt_sale--blue');
                    $('.pt_sticky__sale-box--priceB .pt_sale').addClass('pt_sale--blue');
                } else {
                    $('.pt_sale-box--priceB .pt_sale').removeClass('pt_sale--blue');
                    $('.pt_sticky__sale-box--priceB .pt_sale').removeClass('pt_sale--blue');
                }

                //바잉툴혜택 스와이퍼
                // buyingBnfSwiper.navMove('jet01',0);
                // buyingBnfSwiper.navMove('jet02',0);
                // buyingBnfSwiper.contsMove('jet01',0);
                // buyingBnfSwiper.contsMove('jet02',0);

            },

            optionEtcChangeEnd(buying, option) {
                const selectOptEtc = buying.state.selectOptionEtc;
                const selected = buying.state.selected;

                // 각 버튼 클릭시 마다 API 실행시 사용될 data 속성값 저장 (G코드, 스큐, 회사코드 등)
                buyingUtil.updateBtn(buying.$el, selected, selectOptEtc, config.omni, '.sec_sticky.ai');

            },

            optionAllChangeEnd(buying) {
                const selectOptEtc = buying.state.selectOptionEtc;
                const selected = buying.state.selected;

                // 각 버튼 클릭시 사용되는 data 속성값 저장 (G코드, 스큐, 회사코드 등)
                // buyingUtil.updateBtn(buying.$el, selected, selectOptEtc, config.omni);

                // if($('[data-pickup-plazaNo]').text() === ''){
                    // 제품 품절여부 확인 및 구매관련버튼 활성/비활성화
                    // PT_STATE.service.checkSoldout(selected.gCode, function(saleStatCd){
                    //     buyingUtil.soldoutEvt(saleStatCd);
                    // });
                // }
                if (!config.isOpenedAi) {
                    PT_STATE.service.initBtnAll();
                    config.isOpenedAi = true;
                }
            },
        }
    });
}

function initBuyingCombo() {
    comboBuying = new Buying('#pt_buying_combo', {
        pdList: buyingDataCombo.result,
        defaults: true,
        option: {
            type: 'hide',
            scroll: {
                use: false
            },
        },
        sessionStorage: false,
        autoScope: {
            use: true
        },
        on: {
            init(buying) {
                // const slideSubTxt = document.querySelector('.pt_slide__subtxt')

                // 제품 슬라이드 초기화
                buyingSlideCombo = new BuyingSlide(buying, {
                    target: '#buying_slide_combo',
                    imageData: config.slideImage.buyingSlideCombo,
                });

                // 바잉툴 슬라이드 첫번째만 아래 문구 없애기
                // buyingSlideCombo.swiper.on('slideChange', function() {
                //     buyingSlideCombo.swiper.realIndex === 0 ? 
                //         slideSubTxt.classList.add('hide-txt') : slideSubTxt.classList.remove('hide-txt')  
                // })

                
                // 모든 옵션을 클릭하기전까지, 버튼 클릭시 얼럿창 출력 이벤트
                buyingUtil.clickDeactiveBuy();

                // 구매하기 이벤트, etc 옵션 생길 시 주석처리
                PT_STATE.service.initBuy();

                // 매장픽업 이벤트 활성화
                // buyingUtil.pickupEvt();

                //바잉툴혜택 스와이퍼
                // buyingBnfSwiper.init();
            },
            // optionChangeEnd(buying, option) {
            //     const selected = buying.state.selected;
            //     const selectOption = buying.state.selectOption;
                
            // },
            productChangeEnd(buying) {
                const selectOptEtc = buying.state.selectOptionEtc;
                const selected = buying.state.selected;
                const sku = selected && selected.sku;
                const model = selected && selected.type;
                const gCode = selected && selected.gCode;


                // 선택된 제품의 데이터를 html에서 출력함
                buyingUtil.renderHtml(buying, '.sec_sticky.combo');

                // 각 버튼 클릭시 마다 API 실행시 사용될 data 속성값 저장 (G코드, 스큐, 회사코드 등)
                buyingUtil.updateBtn(buying.$el, selected, selectOptEtc, config.omniCombo, '.sec_sticky.combo');

                // 매장픽업 초기화
                // buyingPickup.reset();

                // 바잉툴 상단, 하단 슬라이드 업데이트
                buyingSlideCombo.update({sku:sku, model:model}, config.isOnceCombo);

                // 제품 품절여부 확인 및 구매관련버튼 활성/비활성화
                PT_STATE.service.checkSoldout(gCode, function(saleStatCd){
                    buyingUtil.soldoutEvt(saleStatCd, buying.$el, '.sec_sticky.combo');
                });

                // 제품 별점 api
                PT_STATE.service.getCommentAvg(gCode, function(commentAvg) {
                    const $star = $('[data-comment]');

                    if (commentAvg === '0.0') {
                        $star.hide();
                    } else {
                        $star.html(commentAvg);
                        $star.attr('href', selected.pdUrl + '?focus=review');
                        $star.attr('title', selected.sku + '제품 상품평 페이지로 이동');
                        $star.show();
                    }
                });

                if(selected.priceC == '-') {
                    $('.pt_sale-box--priceB .pt_sale').addClass('pt_sale--blue');
                    $('.pt_sticky__sale-box--priceB .pt_sale').addClass('pt_sale--blue');
                } else {
                    $('.pt_sale-box--priceB .pt_sale').removeClass('pt_sale--blue');
                    $('.pt_sticky__sale-box--priceB .pt_sale').removeClass('pt_sale--blue');
                }

                //바잉툴혜택 스와이퍼
                // buyingBnfSwiper.navMove('jet01',0);
                // buyingBnfSwiper.navMove('jet02',0);
                // buyingBnfSwiper.contsMove('jet01',0);
                // buyingBnfSwiper.contsMove('jet02',0);

            },

            optionEtcChangeEnd(buying, option) {
                const selectOptEtc = buying.state.selectOptionEtc;
                const selected = buying.state.selected;

                // 각 버튼 클릭시 마다 API 실행시 사용될 data 속성값 저장 (G코드, 스큐, 회사코드 등)
                buyingUtil.updateBtn(buying.$el, selected, selectOptEtc, config.omni, '.sec_sticky.combo');

            },

            optionAllChangeEnd(buying) {
                const selectOptEtc = buying.state.selectOptionEtc;
                const selected = buying.state.selected;

                // 각 버튼 클릭시 사용되는 data 속성값 저장 (G코드, 스큐, 회사코드 등)
                // buyingUtil.updateBtn(buying.$el, selected, selectOptEtc, config.omni);

                // if($('[data-pickup-plazaNo]').text() === ''){
                    // 제품 품절여부 확인 및 구매관련버튼 활성/비활성화
                    // PT_STATE.service.checkSoldout(selected.gCode, function(saleStatCd){
                    //     buyingUtil.soldoutEvt(saleStatCd);
                    // });
                // }
                if (!config.isOpenedCombo) {
                    PT_STATE.service.initBtnAll();
                    config.isOpenedCombo = true;
                }
            },
        }
    });
}

/**
 * 바잉툴 유틸리티 함수 모음
 */
const buyingUtil = {
    /**
     * 각 버튼 클릭시 마다 API 실행시 사용될 data 속성값 저장 (G코드, 스큐, 회사코드 등)
     */
    updateBtn($el, selected, selectOptEtc, omni, stickyType) {
        if(!selected) return;

        const $sticky = $secWrap.find(stickyType);

        // 구매하기 버튼
        const $btnBuy = $el.find('[data-role=btnBuy]');
        const $btnBuySticky = $sticky.find('[data-role=btnBuy]');

        if(!!$btnBuy.length && selected.gCode){
            $btnBuy.attr('data-gcode', selected.gCode);
            $btnBuySticky.attr('data-gcode', selected.gCode);
            $btnBuy.attr('data-comp', selected.deptCd ? selected.deptCd : 313);
            $btnBuySticky.attr('data-comp', selected.deptCd ? selected.deptCd : 313);

            if(!!omni) {
                $btnBuy.attr('data-omni', `${omni.buy}${selected.sku}`);
                $btnBuySticky.attr('data-omni', `${omni.buySticky}${selected.sku}`);
            }
        }

        // 매장픽업 버튼
        // const $btnPickup =  $secWrap.find('[data-role=btnPickup]');
        // if(!!$btnPickup.length && selected.gCode) {
        //     $btnPickup.attr('data-gcode', selected.gCode);
        //     $btnPickup.attr('data-gname', selected.pdNmApi);
        //     $btnPickup.attr('data-sku', selected.sku);
        //     if(!!omni) {
        //         $sticky.find('[data-role=btnPickup]').attr('data-omni', `${omni.pickupSticky}${selected.sku}`);
        //         $el.find('[data-role=btnPickup]').attr('data-omni', `${omni.pickup}${selected.sku}`);
        //     }
        // }

        // 쿠폰 다운로드 버튼
        const $btnCoupon =  $el.find('[data-role=btnCouponPromo]');
        const $btnCouponSticky =  $sticky.find('[data-role=btnCouponPromo]');
        if(!!$btnCoupon.length && selected.cpNum) {
            $btnCoupon.attr('data-cpnum', selected.cpNum ? selected.cpNum.trim() : '');
            $btnCouponSticky.attr('data-cpnum', selected.cpNum ? selected.cpNum.trim() : '');
            if(!!omni) {
                $btnCoupon.attr('data-omni', `${omni.coupon}${selected.sku}`);
                $btnCouponSticky.attr('data-omni', `${omni.couponSticky}${selected.sku}`);
            }
            $btnCoupon.show();
            $btnCouponSticky.show();
        } else {
            $btnCoupon.hide();
            $btnCouponSticky.hide();
        }

        // 자세히 보기 버튼
        const $btnPdUrl = $el.find('[data-role="btnPdUrl"]');
        const $btnPdUrlSticky = $sticky.find('[data-role="btnPdUrl"]');
        if (!!$btnPdUrl.length && selected.pdUrl) {
            $btnPdUrl.attr('href', selected.pdUrl);
            $btnPdUrlSticky.attr('href', selected.pdUrl);
            $btnPdUrl.attr('title', `${selected.sku} PD 페이지로 이동`);
            $btnPdUrlSticky.attr('title', `${selected.sku} PD 페이지로 이동`);
            if(!!omni) {
                $btnPdUrl.attr('data-omni', `${omni.link}${selected.sku}`);
                $btnPdUrlSticky.attr('data-omni', `${omni.link}${selected.sku}`);
            }
        } else {
            // $btnPdUrl.hide();
            // $btnPdUrlSticky.hide();
        }
    },
    pickupEvt(){
        // add
        $secWrap.find('[data-pickup-plazaNo]').on('DOMSubtreeModified', function() {
            try{
                const $btnNPay = $secWrap.find('[data-role=btnNPay]');
                const $btnBuy = $secWrap.find('[data-role=btnBuy]');
                // const $present = $('[data-role="btnPresent"]');
                // const $cart = $('[data-role="btnCart"]');
                const plazaNo = $('[data-pickup-plazaNo]').text();
                if(!!plazaNo){
                    $secWrap.find('[data-role="pickupItem"]').slideDown();
                    // 구매하기 버튼
                    $btnBuy.attr('data-is-pickup', true);
                    $btnBuy.html('구매하기');
                    $btnBuy.removeAttr('tabindex');
                    $btnBuy.removeClass('pt_btn--disabled');

                    // N페이 구매 버튼
                    $btnNPay.attr('data-is-pickup', true);
                    if($btnNPay.attr('data-galaxyclub') === 'Y'){
                        // $btnNPay.html('<span><span class="pt_ico pt_ico--npay">N Pay</span></span>');
                        $btnNPay.attr('tabindex', -1);
                        $btnNPay.addClass('pt_btn--disabled');

                    } else {
                        // $btnNPay.html('<span><span class="pt_ico pt_ico--npay">N Pay</span>구매하기</span>');
                        $btnNPay.removeAttr('tabindex');
                        $btnNPay.removeClass('pt_btn--disabled');
                    }

                    // 선물하기 버튼
                    // $present.addClass('pt_btn--disabled');

                    // 장바구니 버튼
                    // $cart.addClass('pt_btn--disabled');
                }

                // 특정 매장픽업 선택시 이벤트
                if(plazaNo === '923' || plazaNo === '251' || plazaNo === '184'){
                    $('[data-pickup-show="true"]').show();
                    $('[data-pickup-show="false"]').hide();
                } else {
                    $('[data-pickup-show="true"]').hide();
                    $('[data-pickup-show="false"]').show();
                }

            }catch (e) {}
        });

        // 매장픽업 시간 적용
        $secWrap.find('[data-pickup-capaDate]').on('DOMSubtreeModified', function() {
            const capaDate = $secWrap.find('[data-pickup-capaDate]').text();
            let date = '';
            try{
                if(capaDate){
                    date = capaDate.substr(0,4) + '-' + capaDate.substr(4,2) + '-' + capaDate.substr(6,2);
                    $secWrap.find('[data-role="pickupDate"]').closest('.pt_pickup__list').show();
                } else {
                    $secWrap.find('[data-role="pickupDate"]').closest('.pt_pickup__list').hide();
                }
            } catch (e) {}
            $secWrap.find('[data-role="pickupDate"]').text(date);
        });

        // 매장픽업 시간 적용
        $secWrap.find('[data-pickup-capaTime]').on('DOMSubtreeModified', function() {
            const capaTime = $secWrap.find('[data-pickup-capaTime]').text();
            let time = '';
            try{
                if(capaTime){
                    time = ( capaTime.length < 2 ? '0'+capaTime : capaTime ) + ':00';
                }
            } catch (e) {}
            $secWrap.find('[data-role="pickupTime"]').text(time);
        });

        $secWrap.on('click', '[data-pickup-close]', function() {
            const $btnBuy = $secWrap.find('[data-role=btnBuy]');
            const gCode = $btnBuy.attr('data-gcode');
            buyingPickup.reset('close');
            // 제품 품절여부 확인 및 구매관련버튼 활성/비활성화
            PT_STATE.service.checkSoldout(gCode, function(saleStatCd){
                buyingUtil.soldoutEvt(saleStatCd);
            });
        });
    },
    soldoutEvt(saleStatCd, $el, $sticky){
        const tradeInValue = $secWrap.find('[data-opt-etc="tradein"] input:checked').val();
        const galaxyClubValue = $secWrap.find('[data-opt-etc="galaxyClub"] input:checked').val();
        const btnDisabled = PT_STATE.service.getBtnDisabled({
            tradeIn: tradeInValue ? tradeInValue : 'N',
            galaxyClub: galaxyClubValue ? galaxyClubValue : 'N',
            soldout: Number(saleStatCd) === 12 ? 'N' : 'Y'
        });

        const $btnBuy = $el.find('[data-role="btnBuy"]');
        const $stickBtnBuy = $sticky.find('[data-role="btnBuy"]');
        const isPickup = $btnBuy.attr('data-is-pickup');
        if(isPickup==="true"){
            $btnBuy.removeClass('pt_btn--disabled');
            $btnBuy.html('구매하기');
            $btnBuy.removeAttr('tabindex');
            $stickBtnBuy.removeClass('pt_btn--disabled');
            $stickBtnBuy.html('구매하기');
            $stickBtnBuy.removeAttr('tabindex');
        } else {
            if(btnDisabled.buy){
                $btnBuy.addClass('pt_btn--disabled');
                $btnBuy.text('일시품절')
                $btnBuy.attr('tabindex', -1);
                $btnBuy.addClass('pt_btn--disabled');
                $btnBuy.text('일시품절')
                $btnBuy.attr('tabindex', -1);

            } else {
                $btnBuy.removeClass('pt_btn--disabled');
                $btnBuy.html('구매하기');
                $btnBuy.removeAttr('tabindex');
                $stickBtnBuy.removeClass('pt_btn--disabled');
                $stickBtnBuy.html('구매하기');
                $stickBtnBuy.removeAttr('tabindex');
            }
        }

        // const $btnCart = $secWrap.find('[data-role="btnCart"]');
        // if(btnDisabled.cart){
        //     $btnCart.addClass('pt_btn--disabled');
        // } else {
        //     $btnCart.removeClass('pt_btn--disabled');
        // }

        // const $btnPickup = $secWrap.find('[data-role="btnPickup"]');
        // if(btnDisabled.pickup){
        //     $btnPickup.addClass('pt_btn--disabled');
        // } else {
        //     $btnPickup.removeClass('pt_btn--disabled');
        // }

        // const $btnPresent = $secWrap.find('[data-role="btnPresent"]');
        // if(btnDisabled.present){
        //     $btnPresent.addClass('pt_btn--disabled');
        // } else {
        //     $btnPresent.removeClass('pt_btn--disabled');
        // }
    },
    /**
     * 닷컴앱 유무 체크
     */
    checkUserAgent() {
        const ua = navigator.userAgent.toLowerCase();
        if ( ua.indexOf('secapp') != -1) { // 닷컴앱 인경우
            $secWrap.find('[data-app-only]').show();
            $secWrap.find('[data-web-only]').hide();
        } else {
            $secWrap.find('[data-app-only]').hide();
            $secWrap.find('[data-web-only]').show();
        }
    },
    /**
     * 바잉툴 확대하기 기능 초기화
     */
    // initZoom() {
    //     let arrImage = {};
    //
    //     function setData(imageData){
    //         const src = imageData.src_zoom;
    //         const product = imageData.product;
    //         const alt = imageData.alt;
    //         Object.keys(product).forEach( (sku) => {
    //             if (!arrImage[sku]) arrImage[sku] = [];
    //             product[sku].forEach( (item) => {
    //                 if (!_.isMobile()) {
    //                     arrImage[sku].push( { src: src + item.imageZoom, width: 810, height: 690, alt: item.alt } );
    //                 } else {
    //                     arrImage[sku].push( { src: src + item.imageZoomMo, width: 720, height: 606, alt: item.alt } );
    //                 }
    //             });
    //         });
    //     }
    //
    //     function open(wrapper, sku) {
    //         let arrImgData = arrImage[sku];
    //         const lightbox = new PhotoSwipeLightbox({
    //             dataSource: arrImgData,
    //             children:'a',
    //             pswpModule: () => import('./plugins/photoswipe'),
    //             bgOpacity: .7,
    //             arrowPrevTitle: '이전',
    //             arrowNextTitle: '다음',
    //             closeTitle: '레이어 팝업 닫기',
    //             zoomTitle: '확대하기',
    //             initialZoomLevel: 'fit',
    //             secondaryZoomLevel: 1.3,
    //             maxZoomLevel: 1,
    //         });
    //
    //         lightbox.on('uiRegister', function() {
    //             lightbox.pswp.ui.registerElement({
    //                 name: 'bulletsIndicator',
    //                 className: 'pswp__bullets-indicator',
    //                 appendTo: 'wrapper',
    //                 onInit: (el, pswp) => {
    //                     const bullets = [];
    //                     let bullet;
    //                     let prevIndex = -1;
    //                     for (let i = 0; i < pswp.getNumItems(); i++) {
    //                         bullet = document.createElement('div');
    //                         bullet.className = 'pswp__bullet';
    //                         bullet.onclick = (e) => {
    //                             pswp.goTo(bullets.indexOf(e.target));
    //                         };
    //                         el.appendChild(bullet);
    //                         bullets.push(bullet);
    //                     }
    //                     pswp.on('change', (a) => {
    //                         if (prevIndex >= 0) {
    //                             bullets[prevIndex].classList.remove('pswp__bullet--active');
    //                         }
    //                         bullets[pswp.currIndex].classList.add('pswp__bullet--active');
    //                         prevIndex = pswp.currIndex;
    //                     });
    //                 },
    //             });
    //         });
    //
    //         const $target = $(wrapper).find(buyingSlide.target);
    //         const $swiper = $target[0].swiper;
    //         const realIdx = $swiper.realIndex ? $swiper.realIndex : 0;
    //
    //         lightbox.init();
    //         lightbox.loadAndOpen(realIdx);
    //     }
    //
    //     const $el = mainBuying.$el;
    //     setData(buyingSlide.imageData);
    //     $el.off('click.btnZoom').on('click.btnZoom', '[data-role="btnZoom"]', function(e) {
    //         e.preventDefault();
    //         let sku = $(this).attr('data-sku');
    //         open(mainBuying.el, sku);
    //     });
    // },
    /**
     * 제품의 모든 옵션들을 선택하기 전 구매 관련 버튼(구매하기, 매장픽업, 선물하기, 장바구니 등) 클릭시 얼럿 문구 출력
     */
    clickDeactiveBuy(){
        $secWrap.on('click', '[data-role="btnBuy"], [data-role="btnNPay"], [data-role="btnPickup"], [data-role="btnPresent"], [data-role="btnCart"]', function(e) {
            if(config.isOpenedAi) return;
            if(config.isOpenedCombo) return;
            e.preventDefault();
            PT_STATE.service.messager.alert(config.deactiveMessage, function(){
                let offset = $('#pt_buying .pt_option').offset().top - _.pxToVw(84, 224);
                let isOnce = false;
                $secWrap.find('[data-opt-etc]').each(function(i,item){
                    if(!isOnce && $(item).find('input:checked').length < 1){
                        offset = $(item).offset().top - _.pxToVw($(window).outerHeight()/3,$(window).outerHeight()/2);
                        isOnce = true;
                    }
                });

                $('html, body').stop().animate({ scrollTop: offset }, 500);
            });
        });
    },
    /**
     * 선택된 제품의 데이터를 html에서 출력함
     */
    renderHtml(buying, stickyType){
        const selected = buying.state.selected;

        // 바잉툴 외부 제품 정보 text 변경
        try {
            $secWrap.find(stickyType).find('[data-buying-text]').each(function(){
                const textKey = $(this).attr('data-buying-text');
                let text = selected[textKey].trim();
                if(/^\d+$/.test(text)) text = _.addComma(text); // 숫자이면 콤마추가
                $(this).html(text);
            });
        } catch (e) { console.error(e); }

        // data 값이 없을 때 바잉툴 외부 영역 숨김 처리
        try {
            $secWrap.find('[data-buying-active]').each(function(){
                const text = $(this).attr('data-buying-active');

                $(this).toggle(!!buying.state.selected[text]);
            });
        } catch (e) { console.error(e); }

        // show mapping
        try {
            $secWrap.find('[data-buying-show]').each(function(){
                const text = $(this).attr('data-buying-show');
                if (text.includes('==')) {
                    const [key, value] = text.split('==');
                    $(this).toggle(buying.state.selected[key] === value);
                } else if (text.includes('!=')) {
                    const [key, value] = text.split('!=');
                    $(this).toggle(buying.state.selected[key] !== value);
                }
            });
        } catch (e) { console.error(e); }

        // 뺄셈 계산
        try {
            $secWrap.find('[data-buying-calc]').each(function(){
                const text = $(this).attr('data-buying-calc');
                if (text.includes('-')) {
                    const keys = text.split('-');
                    const minus = keys.reduce(function(acc, curr, idx){
                        const result = idx === 0? acc : acc - _.removeComma(selected[curr]);
                        return result;
                    }, _.removeComma(selected[keys[0]]));

                    $(this).html(_.addComma(minus));
                }
            });
        } catch (e) { console.error(e); }

        // 매장픽업 비활성화
        // const $btnPickup = $secWrap.find('[data-role="btnPickup"]');
        // if(selected.pickup && selected.pickup.toUpperCase().trim() === 'O'){
        //     $btnPickup.addClass('pt_btn-pickup--disabled');
        // } else {
        //     $btnPickup.removeClass('pt_btn-pickup--disabled');
        // }

        // pd 이미지 
        const $pdImg = $('[data-pd-img]');
        if(selected && selected.pdImg){
            $pdImg.attr('src', selected.pdImg).attr('alt', `${selected.pdNm} ${selected.optNmD} 제품 이미지`);
        }
    },
}

/**
 * 바잉툴 매장픽업 함수 모음
 */
const buyingPickup = {
    /**
     * 매장픽업 초기화
     */
    reset(isClose) {
        const $btnBuy = $secWrap.find('[data-role="btnBuy"]');
        const $btnNPay = $secWrap.find('[data-role="btnNPay"]');
        if($btnBuy.attr('data-is-pickup') || isClose === 'close'){
            $secWrap.find('[data-pickup-plazaNo]').text('');
            $secWrap.find('[data-pickup-storeAddr]').text('');
            $secWrap.find('[data-pickup-capaDate]').text('');
            $secWrap.find('[data-pickup-capaTime]').text('');
            $secWrap.find('[data-role="pickupDate"]').text('');
            $secWrap.find('[data-role="pickupTime"]').text('');
            $secWrap.find('[data-role="pickupItem"]').slideUp();
            $btnBuy.attr('data-is-pickup', false);
            $btnNPay.attr('data-is-pickup', false);
        }
    }
}

/**
 * 바잉툴 스티키 네비 함수 모음
 */
const buyingSticky = {
    scrollEvt: function() {

        const mainTag = document.querySelector('#grande')
        let $secBuying = null;

        $(window).off('scroll.buyingSticky').on('scroll.buyingSticky', function() {
            const scrollTop = $(window).scrollTop();

            mainTag.classList.contains('ai') ? 
                ($secBuying = $('[data-page-content=ai].sec_buying')) : ($secBuying = $('[data-page-content=combo].sec_buying'))

            
            const $sec_notice = $('.sec_notice');
            const $buyingSticky = $('[data-buying-sticky]');
            const stickyHeight = $buyingSticky.outerHeight();
            const secTarget = $secBuying.offset().top;
            const startPosition = _.isMobile() ? secTarget - (window.innerHeight / 2) : secTarget + _.pxToVw(-83, -485);
            const endPosition = _.isMobile() ? secTarget + $secBuying.innerHeight() - (window.innerHeight / 2) : secTarget + $secBuying.innerHeight() - 100;

            if (scrollTop >= startPosition && scrollTop <= endPosition ) {
                $buyingSticky.addClass('pt_fixed');
            } else {
                $buyingSticky.removeClass('pt_fixed');
            }

        }).scroll();

    },
    accordianEvt: function() {
        let noScrollScrollY = 0;
        buyingAccordian.toggle([
            {
                el: '[data-role-buying-accordian="buyingBenefitBtn"]',
                target: '[data-buying-role="buyingBenefitBox"]',
                speed : 100,
                offScroll: true,
                callback: function($this) {
                    if ($this.hasClass('active')) {
                        $this.html('<span class="blind">혜택 닫기</span>');
                        $this.attr('data-omni', 'sec:event:bespoke-grandeai:button_sticky_benefit_close');
                    } else {
                        $this.html('<span class="blind">혜택 보기</span>');
                        $this.attr('data-omni', 'sec:event:bespoke-grandeai:button_sticky_benefit_open');
                    }
                }
            }
        ]);
    },
    init: function() {
        this.scrollEvt();
        this.accordianEvt();
    }
}

$(document).ready(function(){
    // 바잉툴 초기화
    const grandeWrap = document.querySelector('#grande');
    const tabBtnAi = document.querySelector('.pt_category_nav .pt_category_nav__btn--ai');
    const tabBtnCombo = document.querySelector('.pt_category_nav .pt_category_nav__btn--combo');
    let aiSwitch = false;
    let comboSwitch = false;

    // buyingBnfSwiper.init();

    if(tabBtnAi.classList.contains('on') && !aiSwitch) {
        initBuyingAi();
        grandeWrap.classList.add('ai')
        aiSwitch = true;
    }
    if(tabBtnCombo.classList.contains('on') && !comboSwitch) {
        initBuyingCombo();
        grandeWrap.classList.add('combo')
        comboSwitch = true;
    }
    

    function aiActive() {
        grandeWrap.classList.remove('combo')
        grandeWrap.classList.add('ai')

        if(mainBuying) {
            const selectOptEtc = mainBuying.state.selectOptionEtc;
            const selected = mainBuying.state.selected;
            const sku = selected && selected.sku;
            const model = selected && selected.type;

            buyingUtil.renderHtml(mainBuying, '.sec_sticky.ai');

            buyingUtil.updateBtn(mainBuying.$el, selected, selectOptEtc, config.omniAi, '.sec_sticky.ai');

            buyingSlideAi.update({sku:sku, model:model}, config.isOnceAi);
        } 

        if(aiSwitch) {
            document.querySelector('#optB_2').click();
            return;
        };
        initBuyingAi();
        aiSwitch = true;
    }

    function comboActive() {
        grandeWrap.classList.remove('ai')
        grandeWrap.classList.add('combo')

        if(comboBuying) {
            const selectOptEtc = comboBuying.state.selectOptionEtc;
            const selected = comboBuying.state.selected;
            const sku = selected && selected.sku;
            const model = selected && selected.type;
            
            buyingUtil.renderHtml(comboBuying, '.sec_sticky.combo');

            buyingUtil.updateBtn(comboBuying.$el, selected, selectOptEtc, config.omniCombo, '.sec_sticky.combo');

            buyingSlideCombo.update({sku:sku, model:model}, config.isOnceCombo);
        } 

        
        if(comboSwitch) {
            document.querySelector('#optBB_1').click();
            return;
        };
        initBuyingCombo();
        // $('#opt_etc_aa_4').trigger('click')
        comboSwitch = true;
    }

    tabBtnAi.addEventListener('click', aiActive)
    tabBtnCombo.addEventListener('click', comboActive)
    // 바잉툴 스티키 초기화
    buyingSticky.init();
    // 확대하기 버튼 초기화
    // buyingUtil.initZoom();
    // 닷컴앱 유무 체크
    // buyingUtil.checkUserAgent();
    // 쿠폰 다운로드 초기화
    // promoCoupon.init();


    config.isOnceAi = true;
    config.isOnceCombo = true;
});