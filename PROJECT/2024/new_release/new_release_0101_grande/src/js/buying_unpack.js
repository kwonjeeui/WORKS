import buyingData from "../data/buying_unpack.json";
import { Buying } from './modules/buying_m_unpack';
import { util as _, PT_STATE } from  './modules/bs_common';
import PhotoSwipeLightbox from './plugins/photoswipeLight';
import { buyingAccordian } from './modules/buyingAccordian';

const $secWrap = $('.sec_project_wrap');
let isOpened = false;
let arrPrdBuying = [];
let isLogin = false;
let isLocal = false;
let isOnce = false;
let isOnceZoom = false;

try{
    isLocal = !(document.domain.includes("samsung.com"));
} catch (e) {}

var messager = {
    data: {
        content: '',
        btnText: '확인',
        okBtnText: '확인',
        cancelBtnText: '취소'
    },
    setAlertData: function (content, btnText, callback) {
        messager.data.content = content;
        messager.data.btnText = btnText;
        if (callback != undefined) {
            messager.data.callback = callback;
        } else {
            delete messager.data[callback];
        }
    },
    alert: function (content, btnText, callback) {
        messager.setAlertData(content, btnText, callback);
        commonAlert(messager.data);
        openLayer('commonAlert');
    },
}



function renderHtml(buying,selected){
    // 바잉툴 외부 제품 정보 text 변경
    try {
        $secWrap.find('[data-buying-text]').each(function(){
            const textKey = $(this).attr('data-buying-text');
            let text = !!selected[textKey] ? selected[textKey].trim()  : '';
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
                $(this).toggle(selected[key].trim() === value);
            } else if (text.includes('!=')) {
                const [key, value] = text.split('!=');
                $(this).toggle(selected[key].trim() !== value);
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
}

function buying(){
    arrPrdBuying[0] = new Buying('#pt_buying_unpack', {
        pdList: buyingData.result,
        defaults: true,
        option: {
            type: 'hide', // disabled(default), hide
            scroll: {
                use: false,  // false(default), true
            },
        },
        sessionStorage: false,
        autoScope: {
            use: false,
        },
        on: {
            init(buying) {
                buyingSlide.init(buying);

                // 초기화 버튼 예시
                // buying.$el.off('click.buyingInit').on('click.buyingInit', '[data-role="btnReset"]', function(){
                //     buyingSlide.wrapper = buying.el;
                //     buying.reset();
                // });

                // const gClub = buying.state.selectOptionEtc.galaxyClub;

                // if (gClub == 'Y') {
                //     $secWrap.find('[data-gclub-show="N"]').addClass('pt_hide');
                //     $secWrap.find('[data-gclub-show="Y"]').removeClass('pt_hide');
                // } else {
                //     $secWrap.find('[data-gclub-show="N"]').removeClass('pt_hide');
                //     $secWrap.find('[data-gclub-show="Y"]').addClass('pt_hide');
                // }

                if(_.isMobile()){
                    let bnfChk = false;
                        $('[data-buying-role="btnDeactiveLink"]').on('click',function(){
                            $('[data-buying-role="buyingBenefitBox"]').slideDown(500,() => $('[data-buying-role="buyingBenefitBox"]').addClass('open_benefit'));
                            $('.pt_sticky__dimm').remove();
                            $('[data-buying-sticky]').addClass('opened').after('<div class="pt_sticky__dimm"></div>');
                            $('.pt_btn__buy--close').addClass('pt_hide');
                            $('.pt_btn__buy--open').removeClass('pt_hide');
                            $('.pt_btn_arrow_show').addClass('off');
                            dimmUpdateLine();
                        });
                        if(bnfChk == true) {
                            $('[data-buying-role="buyingBenefitBox"]').slideDown(500,() => $('[data-buying-role="buyingBenefitBox"]').addClass('open_benefit'));
                            $('[data-buying-sticky]').addClass('opened').after('<div class="pt_sticky__dimm"></div>');
                            $('.pt_btn__buy--close').addClass('pt_hide');
                            $('.pt_btn__buy--open').removeClass('pt_hide');
                            $('.pt_btn_arrow_show').addClass('off');
                            bnfChk = false;
                            dimmUpdateLine();
                        }
                    $('[data-role-buying-accordianClose="buyingBenefitBtn"]').on('click', function(){
                        $('[data-buying-role="buyingBenefitBox"]').slideUp(500,() => $('[data-buying-role="buyingBenefitBox"]').removeClass('open_benefit'));
                        $('.pt_sticky__dimm').remove();
                        $('.pt_btn__buy--close').removeClass('pt_hide');
                        $('.pt_btn__buy--open').addClass('pt_hide');
                        setTimeout(() => {
                            $('.pt_btn_arrow_show').removeClass('off');
                        }, 300);
                        dimmUpdateLine();
                    });
                }
            },
            optionChangeEnd(buying, option) {
                const selected = buying.state.selected;
                const sku = selected && selected.sku ? selected.sku : $(option).attr('data-opt-sku');
                const _optCdA = buying.state.selectOption.optCdA;

                if(selected.priceC == '-') {
                    $('.pt_sale-box--priceB .pt_sale').addClass('pt_sale--blue');
                    $('.pt_sticky__sale-box--priceB .pt_sale').addClass('pt_sale--blue');
                } else {
                    $('.pt_sale-box--priceB .pt_sale').removeClass('pt_sale--blue');
                    $('.pt_sticky__sale-box--priceB .pt_sale').removeClass('pt_sale--blue');
                }

                // 매장픽업 비활성화
                // if (selected.pickup === 'O') {
                //     $secWrap.find('[data-role="btnPickup"]').addClass('pt_btn--disabled');
                // } else {
                //     $secWrap.find('[data-role="btnPickup"]').removeClass('pt_btn--disabled');
                // }

                /// 대표 sku 제품 이미지 를라이드 맵핑
                if(sku) buyingSlide.update(buying, sku);
                
                // 매장픽업 초기화
                // const $btnBuy = $secWrap.find('[data-role="btnBuy"]');
                // if($btnBuy.attr('data-is-pickup')){
                //     $secWrap.find('[data-pickup-plazaNo]').text('');
                //     $secWrap.find('[data-pickup-storeAddr]').text('');
                //     $secWrap.find('[data-role="pickupItem"]').hide();
                //     $btnBuy.attr('data-is-pickup', false);
                //     callApi.soldoutCheck(selected.gCode);
                // }

                if(isOnce){
                    isOnceZoom = true;
                    // 옵션 클릭시 첫번째 줌 슬라이드 삭제시 사용
                }

            },
            productChangeEnd(buying) {
                const selectOptEtc = buying.state.selectOptionEtc;
                const selected = buying.state.selected;
                const omni = {
                    coupon: 'sec:event:bespoke-grandeai:button_Download_specialprice_coupon_',
                    buy: 'sec:event:bespoke-grandeai:goto_POD_Onebody_buy',
                    // present: 'sec:event:galaxy-tabs9:launching:gift_',
                    // cart: 'sec:event:galaxy-tabs9:launching:sticky_cart_',
                    // pickup: 'sec:event:galaxy-tabs9:launching:pickup_',
                    link: 'sec:event:bespoke-grandeai:goto_POD_Onebody_buy',
                    linkAll: 'sec:event:bespoke-grandeai-2023:goto_POD_Allinone_buy',
                    // stickyRestock: 'sec:event:galaxy-tabs9:launching:sticky_restock_',
                    // modalRestock: 'sec:event:galaxy-tabs9:launching:sticky_restock2_'
                }

                buyingUtil.updateBtn(buying.$el, selected, selectOptEtc, omni);

                // souldout Check
                if (!isLocal) callApi.soldoutCheck(selected.gCode);

                // if(isOnce){
                //     $('[data-role-buying-accordian="buyingBenefitBtn"]').trigger('click');
                // }

                // if (selected.pickupSoldout == "O") {
                //     $('.pt_btn--buy, [data-role="btnPickup"]').addClass('pt_reverse');
                // } else {
                //     $('.pt_btn--buy, [data-role="btnPickup"]').removeClass('pt_reverse');
                // }

                renderHtml(buying,selected);
            },
            optionAllChangeEnd(buying, option) {
                const tradeInValue = $('[data-opt-etc="tradeIn"] input:checked').val();
                const clubValue = $('[data-opt-etc="galaxyClub"] input:checked').val();
                const $present = $('.pt_btn--present');
                const $cart = $('.pt_btn--cart');
                const selectOptEtc = buying.state.selectOptionEtc;
                const selected = buying.state.selected;
                let isStickChk = false;

                buyingUtil.updateBtn(buying.$el, selected, selectOptEtc, null);
                // buyingUtil.updateBtn(buying.$el, selected, null, null);

                // if($('[data-pickup-plazaNo]').text() === '' && $('[data-role="btnAlarmPop"]:visible').length < 1){
                //     if(tradeInValue === 'Y' || clubValue === 'Y'){
                //         $present.addClass('pt_btn--disabled');
                //     } else {
                //         $present.removeClass('pt_btn--disabled');
                //     }
                //     if(clubValue === 'Y'){
                //         $cart.addClass('pt_btn--disabled');
                //     } else {
                //         // $cart.removeClass('pt_btn--disabled');
                //         callApi.soldoutCheck(selected.gCode);
                //     }
                // }

                if (!isOpened) {
                    if (!$('[data-buying-sticky]').hasClass('fixed')) {
                        $('html, body').stop().animate({scrollTop: $('#pt_buying_unpack .pt_option').offset().top - _.pxToVw(85, 224)}, 500, function(){
                            if(!isStickChk){
                                $('[data-role-buying-accordian="buyingBenefitBtn"]').trigger('click');
                                isStickChk = true;
                            }
                        });

                    } else {
                        $('[data-role-buying-accordian="buyingBenefitBtn"]').trigger('click');
                    }

                    $('[data-buying-btn]').addClass('active');
                    // $('.pt_kv_btn').attr('data-omni', 'sec:event:galaxy-tabs9:launching:kv_buynow_option');

                    $secWrap.find('[data-buying-role="btnLink"]').removeClass('pt_hide');

                    // !_.isMobile() ? $secWrap.find('[data-buying-role="btnDeactiveLink"]').addClass('pt_hide') :'';
                    // $secWrap.find('[data-buying-role="btnLink"]').removeClass('pt_hide').addClass('pt_buying_cta');
                    // $secWrap.find('[data-buying-role="btnLearnMore"]').removeClass('pt_hide').addClass('pt_buying_cta');

                    $secWrap.off('click.deactiveBuy');

                    buyingUtil.btnLink();
                    // buyingUtil.btnBuy();
                    // buyingUtil.btnKvBuy();
                    // buyingUtil.btnPresent();
                    // buyingUtil.btnPickup();
                    // buyingUtil.btnCart();

                    isOpened = true;
                }
            },
            optionEtcChangeEnd(buying, option) {
                const selected = buying.state.selected;
                renderHtml(buying,selected);

                // const gClub = buying.state.selectOptionEtc.galaxyClub;
                // if (gClub == 'Y') {
                //     $secWrap.find('[data-gclub-show="N"]').addClass('pt_hide');
                //     $secWrap.find('[data-gclub-show="Y"]').removeClass('pt_hide');
                // } else {
                //     $secWrap.find('[data-gclub-show="N"]').removeClass('pt_hide');
                //     $secWrap.find('[data-gclub-show="Y"]').addClass('pt_hide');
                // }
            },
        }
    });
}
function dimmUpdateLine() {
    let dimmEle_All = document.querySelectorAll('.pt_sticky__dimm');
    let closeAccordian_Btn = document.querySelector('[data-role-buying-accordianclose="buyingBenefitBtn"]');
    dimmEle_All.forEach(v=> {
        v.addEventListener('click', ()=> closeAccordian_Btn.click());
    });
}

const callApi = {
    apiUrl: '/sec/',
    soldoutCheck: function (gCode){
        const api = {
            url: `${callApi.apiUrl}xhr/goods/getSaleStatCd`,
            data: {
                goodsId: gCode
            },
            done: function(data){
                try{
                    // const $present = $('.pt_btn--present');
                    // const $cart = $('.pt_btn--cart');

                    if (data.saleStatCd == '12'){
                        //현재 판매중인 상품
                        $('[data-role="btnPdUrl"]').html('구매하기').removeClass('pt_btn--disabled');
                        $('[data-buying-role="btnDeactiveLink"]').removeClass('pt_btn--disabled');
                        $('[data-buying-role="btnDeactiveLink"] .pt_btn_show_benefit').html('구매하기')
                        // $('[data-role="btnBuy"]').html('구매하기').removeClass('pt_btn--disabled');
                        // $('[data-role="btnKvBuy"]').html('구매하기');
                        // $('[data-role="btnBuy"]').show();
                        // $('[data-role="btnAlarmPop"]').hide();
                        // $('[data-alarm-box]').hide();

                        // const $chkTradeIn = $('[data-opt-etc="tradeIn"] input:checked');
                        // const $galaxyClub = $('[data-opt-etc="galaxyClub"] input:checked');
                        // if((!!$chkTradeIn.length && !!$galaxyClub.length && $chkTradeIn.val() === 'N' && $galaxyClub.val() === 'N') || !$galaxyClub.length){
                        //     $present.removeClass('pt_btn--disabled');
                        // }

                        // if(!!$galaxyClub.length && $galaxyClub.val() === 'N'){
                        //     $cart.removeClass('pt_btn--disabled');
                        // }

                    } else {
                        // 일시 품절 처리
                        $('[data-role="btnPdUrl"]').html('상품 준비중').addClass('pt_btn--disabled');
                        $('[data-buying-role="btnDeactiveLink"]').addClass('pt_btn--disabled');
                        $('[data-buying-role="btnDeactiveLink"] .pt_btn_show_benefit').html('상품 준비중')
                        // $('[data-role="btnBuy"]').html('일시 품절').addClass('pt_btn--disabled');


                        // 재입고 알림 신청 처리
                        // $('[data-role="btnKvBuy"]').html('재입고 알림 신청하기');
                        // $('[data-role="btnBuy"]').hide();
                        // $('[data-role="btnAlarmPop"]').show();
                        // $('[data-alarm-box]').show();
                        // $present.addClass('pt_btn--disabled');
                        // $cart.addClass('pt_btn--disabled');

                        // const loginApi = {
                        //     url : `${callApi.apiUrl}xhr/member/getSession`,
                        //     type: "POST",
                        //     done : function(data){
                        //         const session = JSON.parse(data);
                        //         if(session.mbrNo !== 0){
                        //             callApi.alarmCheck(gCode);
                        //         }
                        //     }
                        // };
                        // ajax.call(loginApi);
                    }
                } catch (e) {}
            }
        }

        ajax.call(api);
    },
    alarmCheck: function(gCode) {
        const api = {
            url : `${callApi.apiUrl}xhr/mypage/interest/insertRestockCheck`,
            data : {goodsId : gCode},  // 상품아이디
            type: "POST",
            done : function(data){
                 if(!!data) {
                    if('Y' == data.result) {
                        // 재입고 알림 신청 완료
                        $('[data-role="btnKvBuy"]').html('재입고 알림 신청 완료');
                        $('[data-role="btnAlarmPop"]').html('재입고 알림 신청 완료');
                        $('[data-role="btnAlarmPop"]').attr('data-alarmed', 'true');
                    } else {
                        // 재입고 알림 신청
                        $('[data-role="btnKvBuy"]').html('재입고 알림 신청하기');
                        $('[data-role="btnAlarmPop"]').html('재입고 알림 신청하기');
                        $('[data-role="btnAlarmPop"]').attr('data-alarmed', 'false');
                     }
                 }
            }
        }

        ajax.call(api);
    },
    loginCheck: function() {
        const api = {
            url : `${callApi.apiUrl}xhr/member/getSession`,
            type: "POST",
            done : function(data){
                const session = JSON.parse(data);
                if(session.mbrNo == 0){
                    isLogin = false;
                } else {
                    // console.log("로그인 된 회원"); 
                    isLogin = true;
                }
            }

        };
    
        ajax.call(api);
    },
    emailCheck: function() {
        const api = {
            url : `${callApi.apiUrl}xhr/goods/getMemberInfo`,
            type: "POST",
            dataType : "json",
            done : function(data){
                try{
                    if(!!data.mbrInfo){ // 이메일 정보
                        $('[data-popup-role="eMail"]').val(data.mbrInfo);
                    }
                    if(!!data.mbrInfoHp) { // 전화번호 정보
                        $('[data-popup-role="phoneNumber"]').val(data.mbrInfoHp);
                    }
                }catch (e) {}
            }

        };
    
        ajax.call(api);
    },
}

// 바잉툴 스티키 네비
let isToogle = false;
const buyingStickyEvt = {
    scrollEvt: function() {
        $(window).on('scroll.buyingSticky', function() {
            const scrollTop = $(window).scrollTop();
            const winHeight = $(window).outerHeight();
            const buyingSticky = $('[data-buying-sticky]').outerHeight();
            const navHeight = $('.sec_nav').outerHeight();
            const thumbHeight = $('[data-buying-sticky-thumnail]').outerHeight();

            // var _thumnailHeight = _.isMobile() ? $('[data-buying-sticky-thumnail]').outerHeight() * 1.5 : buyingSticky * 1.5;
            if (scrollTop >= $('.pt_buying_unpack').offset().top - navHeight && scrollTop <= $('.sec_notice').offset().top - winHeight) {
                $('[data-buying-sticky]').addClass('fixed').css('z-index',1000);
            } else {
                $('[data-buying-sticky]').removeClass('fixed')
                if (!isToogle && $('[data-buying-sticky]').hasClass('opened')) {
                    $('[data-role-buying-accordian="buyingBenefitBtn"]').trigger('click');
                }                     
                $('[data-buying-sticky-thumnail]').removeClass('fixed').css('z-index',10);
            }

            if (scrollTop >= $('.pt_buying_unpack').offset().top - navHeight && scrollTop <= $('.sec_benefit').offset().top - thumbHeight) {
                if(_.isMobile()) {
                    $('[data-buying-sticky-thumnail]').addClass('fixed').css('z-index',19);
                } else {
                    $('[data-buying-sticky-thumnail]').removeClass('fixed').css('z-index',10);
                }
            } else {
                $('[data-buying-sticky-thumnail]').removeClass('fixed').css('z-index',10);
            }
        });
    },
    accordianEvt: function() {
        buyingAccordian.toggle([
            {
                el: '[data-role-buying-accordian="buyingBenefitBtn"]',
                target: '[data-buying-role="buyingBenefitBox"]',
                speed : 300,
                offScroll: true,
                callback: function($this) {
                    if ($this.hasClass('active')) {
                        // isToogle = true;
                        $this.html('<span class="pt_btn_show_benefit"></span>');
                        $('[data-buying-sticky]').addClass('opened').after('<div class="pt_sticky__dimm"></div>');
                        // $('html, body').stop().animate({ scrollTop: $('.sec_sticky').offset().top + _.pxToVw(50) }, 500, function() {
                        //     // 팝업 열릴때 스크롤 방지
                        //     // noScroll.add();
                        //     isToogle = false;
                        // });
                    } else {

                        $this.html('<span class="pt_btn_show_benefit"></span>');
                        $('[data-buying-sticky]').removeClass('opened');
                        $('.pt_sticky__dimm').remove();
						// 팝업 닫힐때 스크롤 방지 해제
                        // noScroll.remove();
                    }

                    $secWrap.off('click.stickyDimm').on('click.stickyDimm', '.pt_sticky__dimm', function() {
                        $('[data-role-buying-accordian="buyingBenefitBtn"]').trigger('click');
                    });

                }
            }
        ]);
    },
    init: function() {
        this.scrollEvt();
        this.accordianEvt();
    }
}

const noScroll = {
    scrollY: 0,
    add() {
        this.scrollY = window.scrollY;
        $('body').addClass('pt_no_scroll').css('top', `-${this.scrollY}px`);
    },
    remove() {
        $('body').removeClass('pt_no_scroll');
        window.scrollTo(0, this.scrollY);
    }
}

// 슬라이드 예시
const buyingSlide = {
    wrapper: '#pt_buying_unpack',
    target: '#buying_slide',
    imageFadeEffect: true,
    imageData: {
        "src": "../../is/images/unpack_buying/slide/",
        "product": {
            "WD25DB8995BZMC":[
                // {image:'gd_WD25DB8995BZMC_pc.jpg', imageMo:'gd_WD25DB8995BZMC_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WD25DB8995BZMC_pc.jpg', imageMoZoom:'gd_WD25DB8995BZMC_mo.jpg', videoUrl:''},
                {image:'gd_WD25DB8995BZMC_01_pc.jpg', imageMo:'gd_WD25DB8995BZMC_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'세탁물이 들어가있고, 세탁과 건조 코스로 99분안에 해결할수 있다는', imagePcZoom:'gd_WD25DB8995BZMC_01_pc.jpg', imageMoZoom:'gd_WD25DB8995BZMC_01_mo.jpg', videoUrl:'', blind:'하나로 세탁·건조하는 ONE 솔루션'},
                {image:'gd_WD25DB8995BZMC_02_pc_v1.jpg', imageMo:'gd_WD25DB8995BZMC_02_mo_v1.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤코스로 세탁부터 건조까지 가능하다는', imagePcZoom:'gd_WD25DB8995BZMC_02_pc.jpg', imageMoZoom:'gd_WD25DB8995BZMC_02_mo.jpg', videoUrl:'', blind:'AI 맞춤 코스'},
                {image:'gd_WD25DB8995BZMC_03_pc.jpg', imageMo:'gd_WD25DB8995BZMC_03_mo_v2.jpg', podTxtPc:'', podTxtMo:'', alt:'음성인식 AI 허브로 세탁 건조 코스 확인하기', imagePcZoom:'gd_WD25DB8995BZMC_03_pc.jpg', imageMoZoom:'gd_WD25DB8995BZMC_03_mo.jpg', videoUrl:'', blind:'음성인식 AI 허브'},
                {image:'gd_WD25DB8995BZMC_04_pc_v1.jpg', imageMo:'gd_WD25DB8995BZMC_04_mo_v2.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 세제 자동투입이 작동되는 부품 위치 안내', imagePcZoom:'gd_WD25DB8995BZMC_04_pc.jpg', imageMoZoom:'gd_WD25DB8995BZMC_04_mo.jpg', videoUrl:'', blind:'AI 세제자동투입'},
                // {image:'gd_WD25DB8995BZMC_04_pc.jpg', imageMo:'gd_WD25DB8995BZMC_04_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WD25DB8995BZMC_04_pc.jpg', imageMoZoom:'gd_WD25DB8995BZMC_04_mo.jpg', videoUrl:'{"video":"../../is/images/video/gd_video_one03_v3.mp4", "caption":"풍부한 에코버블과 섬세한 세탁으로 미세플라스틱 배출은 줄이고 세탁물은 깨끗하게<br />미세플라스틱 발생량 50% 저감, 연간 신용카드 8장 무게만큼 미세플라스틱 배출량 감소, 옷감 보호 최대 25% 개선"}'},
            ],


            "WF24D21CVVE":[
                // {image:'gd_WF24D21CVVE_pc.jpg', imageMo:'gd_WF24D21CVVE_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF24D21CVVE_pc.jpg', imageMoZoom:'gd_WF24D21CVVE_mo.jpg', videoUrl:''},
                {image:'gd_WF24D21CVVE_01_pc.jpg', imageMo:'gd_WF24D21CVVE_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF24D21CVVE_01_pc.jpg', imageMoZoom:'gd_WF24D21CVVE_01_mo.jpg', videoUrl:'', blind:'AI 맞춤세탁'},
                {image:'gd_WF24D21CVVE_02_pc_v2.jpg', imageMo:'gd_WF24D21CVVE_02_mo_v2.jpg', podTxtPc:'', podTxtMo:'', alt:'세탁기 중앙에서 공간 제습이 가능한 환기구가 열려있는 이미지와 AI 공간제습이 50% 적정습도에서 가능하다는', imagePcZoom:'gd_WF24D21CVVE_02_pc_v2.jpg', imageMoZoom:'gd_WF24D21CVVE_02_mo_v2.jpg', videoUrl:'', blind:'AI 공간제습'},
                {image:'gd_WF24D21CVVE_03_pc_v2.jpg', imageMo:'gd_WF24D21CVVE_03_mo_v3.jpg', podTxtPc:'', podTxtMo:'', alt:'미세플라스틱저감 코스로 연간 약 49g 미세플라스틱 배출감소 (신용카드 약 10장 만큼 무게) AI 에너지절약 모드로 세탁기 최대 60% 건조기 최대 35% 에너지 절감', imagePcZoom:'gd_WF24D21CVVE_03_pc_v2.jpg', imageMoZoom:'gd_WF24D21CVVE_03_mo_v2.jpg', videoUrl:'', blind:'미세플라스틱저감 코스 & AI 에너지 절약'},
                {image:'gd_WF24D21CVVE_04_pc.jpg', imageMo:'gd_WF24D21CVVE_04_mo_v1.jpg', podTxtPc:'', podTxtMo:'', alt:'살균 세탁, 살균 건조로 의류에 있는 유해 세균을 99.9% 살균하고, 무세제통세척+와 열품 내부 살균, 직접 관리형 열교환기로 기기 내부까지 구석구석 케어합니다.', imagePcZoom:'gd_WF24D21CVVE_04_pc.jpg', imageMoZoom:'gd_WF24D21CVVE_04_mo.jpg', videoUrl:'', blind:'의류 99.9% 살균, 기기 내부 케어'},
            ],
            "WF24D21CEEE":[
                // {image:'gd_WF24D21CEEE_pc.jpg', imageMo:'gd_WF24D21CEEE_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF24D21CEEE_pc.jpg', imageMoZoom:'gd_WF24D21CEEE_mo.jpg', videoUrl:''},
                {image:'gd_WF24D21CEEE_01_pc.jpg', imageMo:'gd_WF24D21CEEE_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF24D21CEEE_01_pc.jpg', imageMoZoom:'gd_WF24D21CEEE_01_mo.jpg', videoUrl:'', blind:'AI 맞춤세탁'},
                {image:'gd_WF24D21CEEE_02_pc_v2.jpg', imageMo:'gd_WF24D21CEEE_02_mo_v2.jpg', podTxtPc:'', podTxtMo:'', alt:'세탁기 중앙에서 공간 제습이 가능한 환기구가 열려있는 이미지와 AI 공간제습이 50% 적정습도에서 가능하다는', imagePcZoom:'gd_WF24D21CEEE_02_pc_v2.jpg', imageMoZoom:'gd_WF24D21CEEE_02_mo_v2.jpg', videoUrl:'', blind:'AI 공간제습'},
                {image:'gd_WF24D21CEEE_03_pc_v2.jpg', imageMo:'gd_WF24D21CEEE_03_mo_v3.jpg', podTxtPc:'', podTxtMo:'', alt:'미세플라스틱저감 코스로 연간 약 49g 미세플라스틱 배출감소 (신용카드 약 10장 만큼 무게) AI 에너지절약 모드로 세탁기 최대 60% 건조기 최대 35% 에너지 절감', imagePcZoom:'gd_WF24D21CEEE_03_pc_v2.jpg', imageMoZoom:'gd_WF24D21CEEE_03_mo_v2.jpg', videoUrl:'', blind:'미세플라스틱저감 코스 & AI 에너지 절약'},
                {image:'gd_WF24D21CEEE_04_pc.jpg', imageMo:'gd_WF24D21CEEE_04_mo_v1.jpg', podTxtPc:'', podTxtMo:'', alt:'살균 세탁, 살균 건조로 의류에 있는 유해 세균을 99.9% 살균하고, 무세제통세척+와 열품 내부 살균, 직접 관리형 열교환기로 기기 내부까지 구석구석 케어합니다.', imagePcZoom:'gd_WF24D21CEEE_04_pc.jpg', imageMoZoom:'gd_WF24D21CEEE_04_mo.jpg', videoUrl:'', blind:'의류 99.9% 살균, 기기 내부 케어'},
            ],
            "WF24D21CWWE":[
                // {image:'gd_WF24D21CWWE_pc.jpg', imageMo:'gd_WF24D21CWWE_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF24D21CWWE_pc.jpg', imageMoZoom:'gd_WF24D21CWWE_mo.jpg', videoUrl:''},
                {image:'gd_WF24D21CWWE_01_pc.jpg', imageMo:'gd_WF24D21CWWE_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF24D21CWWE_01_pc.jpg', imageMoZoom:'gd_WF24D21CWWE_01_mo.jpg', videoUrl:'', blind:'AI 맞춤세탁'},
                {image:'gd_WF24D21CWWE_02_pc_v2.jpg', imageMo:'gd_WF24D21CWWE_02_mo_v2.jpg', podTxtPc:'', podTxtMo:'', alt:'세탁기 중앙에서 공간 제습이 가능한 환기구가 열려있는 이미지와 AI 공간제습이 50% 적정습도에서 가능하다는', imagePcZoom:'gd_WF24D21CWWE_02_pc_v2.jpg', imageMoZoom:'gd_WF24D21CWWE_02_mo_v2.jpg', videoUrl:'', blind:'AI 공간제습'},
                {image:'gd_WF24D21CWWE_03_pc_v2.jpg', imageMo:'gd_WF24D21CWWE_03_mo_v3.jpg', podTxtPc:'', podTxtMo:'', alt:'미세플라스틱저감 코스로 연간 약 49g 미세플라스틱 배출감소 (신용카드 약 10장 만큼 무게) AI 에너지절약 모드로 세탁기 최대 60% 건조기 최대 35% 에너지 절감', imagePcZoom:'gd_WF24D21CWWE_03_pc_v2.jpg', imageMoZoom:'gd_WF24D21CWWE_03_mo_v2.jpg', videoUrl:'', blind:'미세플라스틱저감 코스 & AI 에너지 절약'},
                {image:'gd_WF24D21CWWE_04_pc.jpg', imageMo:'gd_WF24D21CWWE_04_mo_v1.jpg', podTxtPc:'', podTxtMo:'', alt:'살균 세탁, 살균 건조로 의류에 있는 유해 세균을 99.9% 살균하고, 무세제통세척+와 열품 내부 살균, 직접 관리형 열교환기로 기기 내부까지 구석구석 케어합니다.', imagePcZoom:'gd_WF24D21CWWE_04_pc.jpg', imageMoZoom:'gd_WF24D21CWWE_04_mo.jpg', videoUrl:'', blind:'의류 99.9% 살균, 기기 내부 케어'},
            ],

            
            "WF24D20CWWC":[
                // {image:'gd_WF24D20CWWC_pc.jpg', imageMo:'gd_WF24D20CWWC_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF24D20CWWC_pc.jpg', imageMoZoom:'gd_WF24D20CWWC_mo.jpg', videoUrl:''},
                {image:'gd_WF24D20CWWC_01_pc.jpg', imageMo:'gd_WF24D20CWWC_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF24D20CWWC_01_pc.jpg', imageMoZoom:'gd_WF24D20CWWC_01_mo.jpg', videoUrl:'', blind:'AI 맞춤세탁'},
                {image:'gd_WF24D20CWWC_02_pc_v2.jpg', imageMo:'gd_WF24D20CWWC_02_mo_v3.jpg', podTxtPc:'', podTxtMo:'', alt:'미세플라스틱저감 코스로 연간 약 49g 미세플라스틱 배출감소 (신용카드 약 10장 만큼 무게) AI 에너지절약 모드로 세탁기 최대 60% 건조기 최대 35% 에너지 절감', imagePcZoom:'gd_WF24D20CWWC_02_pc_v2.jpg', imageMoZoom:'gd_WF24D20CWWC_02_mo_v2.jpg', videoUrl:'', blind:'미세플라스틱저감 코스 & AI 에너지 절약'},
                {image:'gd_WF24D20CWWC_03_pc.jpg', imageMo:'gd_WF24D20CWWC_03_mo_v1.jpg', podTxtPc:'', podTxtMo:'', alt:'살균 세탁, 살균 건조로 의류에 있는 유해 세균을 99.9% 살균하고, 무세제통세척+와 열품 내부 살균, 직접 관리형 열교환기로 기기 내부까지 구석구석 케어합니다.', imagePcZoom:'gd_WF24D20CWWC_03_pc.jpg', imageMoZoom:'gd_WF24D20CWWC_03_mo.jpg', videoUrl:'', blind:'의류 99.9% 살균, 기기 내부 케어'},
            ],
            "WF24D20CVVC":[
                // {image:'gd_WF24D20CVVC_pc.jpg', imageMo:'gd_WF24D20CVVC_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF24D20CVVC_pc.jpg', imageMoZoom:'gd_WF24D20CVVC_mo.jpg', videoUrl:''},
                {image:'gd_WF24D20CVVC_01_pc.jpg', imageMo:'gd_WF24D20CVVC_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF24D20CVVC_01_pc.jpg', imageMoZoom:'gd_WF24D20CVVC_01_mo.jpg', videoUrl:'', blind:'AI 맞춤세탁'},
                {image:'gd_WF24D20CVVC_02_pc_v2.jpg', imageMo:'gd_WF24D20CVVC_02_mo_v3.jpg', podTxtPc:'', podTxtMo:'', alt:'미세플라스틱저감 코스로 연간 약 49g 미세플라스틱 배출감소 (신용카드 약 10장 만큼 무게) AI 에너지절약 모드로 세탁기 최대 60% 건조기 최대 35% 에너지 절감', imagePcZoom:'gd_WF24D20CVVC_02_pc_v2.jpg', imageMoZoom:'gd_WF24D20CVVC_02_mo_v2.jpg', videoUrl:'', blind:'미세플라스틱저감 코스 & AI 에너지 절약'},
                {image:'gd_WF24D20CVVC_03_pc.jpg', imageMo:'gd_WF24D20CVVC_03_mo_v1.jpg', podTxtPc:'', podTxtMo:'', alt:'살균 세탁, 살균 건조로 의류에 있는 유해 세균을 99.9% 살균하고, 무세제통세척+와 열품 내부 살균, 직접 관리형 열교환기로 기기 내부까지 구석구석 케어합니다.', imagePcZoom:'gd_WF24D20CVVC_03_pc.jpg', imageMoZoom:'gd_WF24D20CVVC_03_mo.jpg', videoUrl:'', blind:'의류 99.9% 살균, 기기 내부 케어'},
            ],
            "WF24D20CEEC":[
                // {image:'gd_WF24D20CEEC_pc.jpg', imageMo:'gd_WF24D20CEEC_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF24D20CEEC_pc.jpg', imageMoZoom:'gd_WF24D20CEEC_mo.jpg', videoUrl:''},
                {image:'gd_WF24D20CEEC_01_pc.jpg', imageMo:'gd_WF24D20CEEC_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF24D20CEEC_01_pc.jpg', imageMoZoom:'gd_WF24D20CEEC_01_mo.jpg', videoUrl:'', blind:'AI 맞춤세탁'},
                {image:'gd_WF24D20CEEC_02_pc_v2.jpg', imageMo:'gd_WF24D20CEEC_02_mo_v3.jpg', podTxtPc:'', podTxtMo:'', alt:'미세플라스틱저감 코스로 연간 약 49g 미세플라스틱 배출감소 (신용카드 약 10장 만큼 무게) AI 에너지절약 모드로 세탁기 최대 60% 건조기 최대 35% 에너지 절감', imagePcZoom:'gd_WF24D20CEEC_02_pc_v2.jpg', imageMoZoom:'gd_WF24D20CEEC_02_mo_v2.jpg', videoUrl:'', blind:'미세플라스틱저감 코스 & AI 에너지 절약'},
                {image:'gd_WF24D20CEEC_03_pc.jpg', imageMo:'gd_WF24D20CEEC_03_mo_v1.jpg', podTxtPc:'', podTxtMo:'', alt:'살균 세탁, 살균 건조로 의류에 있는 유해 세균을 99.9% 살균하고, 무세제통세척+와 열품 내부 살균, 직접 관리형 열교환기로 기기 내부까지 구석구석 케어합니다.', imagePcZoom:'gd_WF24D20CEEC_03_pc.jpg', imageMoZoom:'gd_WF24D20CEEC_03_mo.jpg', videoUrl:'', blind:'의류 99.9% 살균, 기기 내부 케어'},
            ],


            "WF21D17CVVC":[
                // {image:'gd_WF21D17CVVC_pc.jpg', imageMo:'gd_WF21D17CVVC_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF21D17CVVC_pc.jpg', imageMoZoom:'gd_WF21D17CVVC_mo.jpg', videoUrl:''},
                {image:'gd_WF21D17CVVC_01_pc.jpg', imageMo:'gd_WF21D17CVVC_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF21D17CVVC_01_pc.jpg', imageMoZoom:'gd_WF21D17CVVC_01_mo.jpg', videoUrl:'', blind:'AI 맞춤세탁'},
                {image:'gd_WF21D17CVVC_02_pc_v2.jpg', imageMo:'gd_WF21D17CVVC_02_mo_v3.jpg', podTxtPc:'', podTxtMo:'', alt:'미세플라스틱저감 코스로 연간 약 49g 미세플라스틱 배출감소 (신용카드 약 10장 만큼 무게) AI 에너지절약 모드로 세탁기 최대 60% 건조기 최대 35% 에너지 절감', imagePcZoom:'gd_WF21D17CVVC_02_pc_v2.jpg', imageMoZoom:'gd_WF21D17CVVC_02_mo_v2.jpg', videoUrl:'', blind:'미세플라스틱저감 코스 & AI 에너지 절약'},
                {image:'gd_WF21D17CVVC_03_pc.jpg', imageMo:'gd_WF21D17CVVC_03_mo_v1.jpg', podTxtPc:'', podTxtMo:'', alt:'살균 세탁, 살균 건조로 의류에 있는 유해 세균을 99.9% 살균하고, 무세제통세척+와 열품 내부 살균, 직접 관리형 열교환기로 기기 내부까지 구석구석 케어합니다.', imagePcZoom:'gd_WF21D17CVVC_03_pc.jpg', imageMoZoom:'gd_WF21D17CVVC_03_mo.jpg', videoUrl:'', blind:'의류 99.9% 살균, 기기 내부 케어'},
            ],
            "WF21D17CEEC":[
                // {image:'gd_WF21D17CEEC_pc.jpg', imageMo:'gd_WF21D17CEEC_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF21D17CEEC_pc.jpg', imageMoZoom:'gd_WF21D17CEEC_mo.jpg', videoUrl:''},
                {image:'gd_WF21D17CEEC_01_pc.jpg', imageMo:'gd_WF21D17CEEC_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF21D17CEEC_01_pc.jpg', imageMoZoom:'gd_WF21D17CEEC_01_mo.jpg', videoUrl:'', blind:'AI 맞춤세탁'},
                {image:'gd_WF21D17CEEC_02_pc_v2.jpg', imageMo:'gd_WF21D17CEEC_02_mo_v3.jpg', podTxtPc:'', podTxtMo:'', alt:'미세플라스틱저감 코스로 연간 약 49g 미세플라스틱 배출감소 (신용카드 약 10장 만큼 무게) AI 에너지절약 모드로 세탁기 최대 60% 건조기 최대 35% 에너지 절감', imagePcZoom:'gd_WF21D17CEEC_02_pc_v2.jpg', imageMoZoom:'gd_WF21D17CEEC_02_mo_v2.jpg', videoUrl:'', blind:'미세플라스틱저감 코스 & AI 에너지 절약'},
                {image:'gd_WF21D17CEEC_03_pc.jpg', imageMo:'gd_WF21D17CEEC_03_mo_v1.jpg', podTxtPc:'', podTxtMo:'', alt:'살균 세탁, 살균 건조로 의류에 있는 유해 세균을 99.9% 살균하고, 무세제통세척+와 열품 내부 살균, 직접 관리형 열교환기로 기기 내부까지 구석구석 케어합니다.', imagePcZoom:'gd_WF21D17CEEC_03_pc.jpg', imageMoZoom:'gd_WF21D17CEEC_03_mo.jpg', videoUrl:'', blind:'의류 99.9% 살균, 기기 내부 케어'},
            ],
            "WF21D17CWWC":[
                // {image:'gd_WF21D17CWWC_pc.jpg', imageMo:'gd_WF21D17CWWC_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF21D17CWWC_pc.jpg', imageMoZoom:'gd_WF21D17CWWC_mo.jpg', videoUrl:''},
                {image:'gd_WF21D17CWWC_01_pc.jpg', imageMo:'gd_WF21D17CWWC_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF21D17CWWC_01_pc.jpg', imageMoZoom:'gd_WF21D17CWWC_01_mo.jpg', videoUrl:'', blind:'AI 맞춤세탁'},
                {image:'gd_WF21D17CWWC_02_pc_v2.jpg', imageMo:'gd_WF21D17CWWC_02_mo_v3.jpg', podTxtPc:'', podTxtMo:'', alt:'미세플라스틱저감 코스로 연간 약 49g 미세플라스틱 배출감소 (신용카드 약 10장 만큼 무게) AI 에너지절약 모드로 세탁기 최대 60% 건조기 최대 35% 에너지 절감', imagePcZoom:'gd_WF21D17CWWC_02_pc_v2.jpg', imageMoZoom:'gd_WF21D17CWWC_02_mo_v2.jpg', videoUrl:'', blind:'미세플라스틱저감 코스 & AI 에너지 절약'},
                {image:'gd_WF21D17CWWC_03_pc.jpg', imageMo:'gd_WF21D17CWWC_03_mo_v1.jpg', podTxtPc:'', podTxtMo:'', alt:'살균 세탁, 살균 건조로 의류에 있는 유해 세균을 99.9% 살균하고, 무세제통세척+와 열품 내부 살균, 직접 관리형 열교환기로 기기 내부까지 구석구석 케어합니다.', imagePcZoom:'gd_WF21D17CWWC_03_pc.jpg', imageMoZoom:'gd_WF21D17CWWC_03_mo.jpg', videoUrl:'', blind:'의류 99.9% 살균, 기기 내부 케어'},
            ],


            "WF2421HCEEH":[
                // {image:'gd_WF2421HCEEH_pc.jpg', imageMo:'gd_WF2421HCEEH_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF2421HCEEH_pc.jpg', imageMoZoom:'gd_WF2421HCEEH_mo.jpg', videoUrl:''},
                {image:'gd_WF2421HCEEH_01_pc.jpg', imageMo:'gd_WF2421HCEEH_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'하나의 바디로 딱 맞춘 원바디 디자인', imagePcZoom:'gd_WF2421HCEEH_01_pc.jpg', imageMoZoom:'gd_WF2421HCEEH_01_mo.jpg', videoUrl:'', blind:'원바디 디자인'},
                {image:'gd_WF2421HCEEH_02_pc_v2.jpg', imageMo:'gd_WF2421HCEEH_02_mo_v2.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF2421HCEEH_02_pc_v2.jpg', imageMoZoom:'gd_WF2421HCEEH_02_mo_v2.jpg', videoUrl:'', blind:'AI 맞춤세탁/건조'},
                {image:'gd_WF2421HCEEH_03_pc_v2.jpg', imageMo:'gd_WF2421HCEEH_03_mo_v2.jpg', podTxtPc:'', podTxtMo:'', alt:'세탁기 중앙에서 공간 제습이 가능한 환기구가 열려있는 이미지와 AI 공간제습이 50% 적정습도에서 가능하다는', imagePcZoom:'gd_WF2421HCEEH_03_pc_v2.jpg', imageMoZoom:'gd_WF2421HCEEH_03_mo_v2.jpg', videoUrl:'', blind:'AI 공간제습'},
            ],

            
            "WF21CB6650BW2N":[
                // {image:'gd_WF21CB6650BW2N_pc.jpg', imageMo:'gd_WF21CB6650BW2N_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF21CB6650BW2N_pc.jpg', imageMoZoom:'gd_WF21CB6650BW2N_mo.jpg', videoUrl:''},
                {image:'gd_WF21CB6650BW2N_01_pc.jpg', imageMo:'gd_WF21CB6650BW2N_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'세탁기에 버블이 있고 그위에 세탁물이 들어있는', imagePcZoom:'gd_WF21CB6650BW2N_01_pc.jpg', imageMoZoom:'gd_WF21CB6650BW2N_01_mo.jpg', videoUrl:'', blind:'에코버블'},
                {image:'gd_WF21CB6650BW2N_02_pc.jpg', imageMo:'gd_WF21CB6650BW2N_02_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF21CB6650BW2N_02_pc.jpg', imageMoZoom:'gd_WF21CB6650BW2N_02_mo.jpg', videoUrl:'', blind:'AI 맞춤세탁'},
                {image:'gd_WF21CB6650BW2N_03_pc_v2.jpg', imageMo:'gd_WF21CB6650BW2N_03_mo_v2.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 이불세탁과 건조가 가능한 코스 선택 화면', imagePcZoom:'gd_WF21CB6650BW2N_03_pc_v2.jpg', imageMoZoom:'gd_WF21CB6650BW2N_03_mo_v2.jpg', videoUrl:'', blind:'AI 이불세탁'},
                {image:'gd_WF21CB6650BW2N_04_pc.jpg', imageMo:'gd_WF21CB6650BW2N_04_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 에너지절약으로 이번달 예상 사용량 체크가 가능한 안내판 이미지, AI 절약모드로 전력 사용량을 최소화하여 코스 완료!', imagePcZoom:'gd_WF21CB6650BW2N_04_pc.jpg', imageMoZoom:'gd_WF21CB6650BW2N_04_mo.jpg', videoUrl:'', blind:'AI 에너지 절약'},
            ],
            "WF21CB6650BV2N":[
                // {image:'gd_WF21CB6650BV2N_pc.jpg', imageMo:'gd_WF21CB6650BV2N_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF21CB6650BV2N_pc.jpg', imageMoZoom:'gd_WF21CB6650BV2N_mo.jpg', videoUrl:''},
                {image:'gd_WF21CB6650BV2N_01_pc.jpg', imageMo:'gd_WF21CB6650BV2N_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'세탁기에 버블이 있고 그위에 세탁물이 들어있는', imagePcZoom:'gd_WF21CB6650BV2N_01_pc.jpg', imageMoZoom:'gd_WF21CB6650BV2N_01_mo.jpg', videoUrl:'', blind:'에코버블'},
                {image:'gd_WF21CB6650BV2N_02_pc.jpg', imageMo:'gd_WF21CB6650BV2N_02_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF21CB6650BV2N_02_pc.jpg', imageMoZoom:'gd_WF21CB6650BV2N_02_mo.jpg', videoUrl:'', blind:'AI 맞춤세탁'},
                {image:'gd_WF21CB6650BV2N_03_pc_v2.jpg', imageMo:'gd_WF21CB6650BV2N_03_mo_v2.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 이불세탁과 건조가 가능한 코스 선택 화면', imagePcZoom:'gd_WF21CB6650BV2N_03_pc_v2.jpg', imageMoZoom:'gd_WF21CB6650BV2N_03_mo_v2.jpg', videoUrl:'', blind:'AI 이불세탁'},
                {image:'gd_WF21CB6650BV2N_04_pc.jpg', imageMo:'gd_WF21CB6650BV2N_04_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 에너지절약으로 이번달 예상 사용량 체크가 가능한 안내판 이미지, AI 절약모드로 전력 사용량을 최소화하여 코스 완료!', imagePcZoom:'gd_WF21CB6650BV2N_04_pc.jpg', imageMoZoom:'gd_WF21CB6650BV2N_04_mo.jpg', videoUrl:'', blind:'AI 에너지 절약'},
            ],
            "WF21CB6650BE2N":[
                // {image:'gd_WF21CB6650BE2N_pc.jpg', imageMo:'gd_WF21CB6650BE2N_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF21CB6650BE2N_pc.jpg', imageMoZoom:'gd_WF21CB6650BE2N_mo.jpg', videoUrl:''},
                {image:'gd_WF21CB6650BE2N_01_pc.jpg', imageMo:'gd_WF21CB6650BE2N_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'세탁기에 버블이 있고 그위에 세탁물이 들어있는', imagePcZoom:'gd_WF21CB6650BE2N_01_pc.jpg', imageMoZoom:'gd_WF21CB6650BE2N_01_mo.jpg', videoUrl:'', blind:'에코버블'},
                {image:'gd_WF21CB6650BE2N_02_pc.jpg', imageMo:'gd_WF21CB6650BE2N_02_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF21CB6650BE2N_02_pc.jpg', imageMoZoom:'gd_WF21CB6650BE2N_02_mo.jpg', videoUrl:'', blind:'AI 맞춤세탁'},
                {image:'gd_WF21CB6650BE2N_03_pc_v2.jpg', imageMo:'gd_WF21CB6650BE2N_03_mo_v2.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 이불세탁과 건조가 가능한 코스 선택 화면', imagePcZoom:'gd_WF21CB6650BE2N_03_pc_v2.jpg', imageMoZoom:'gd_WF21CB6650BE2N_03_mo_v2.jpg', videoUrl:'', blind:'AI 이불세탁'},
                {image:'gd_WF21CB6650BE2N_04_pc.jpg', imageMo:'gd_WF21CB6650BE2N_04_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 에너지절약으로 이번달 예상 사용량 체크가 가능한 안내판 이미지, AI 절약모드로 전력 사용량을 최소화하여 코스 완료!', imagePcZoom:'gd_WF21CB6650BE2N_04_pc.jpg', imageMoZoom:'gd_WF21CB6650BE2N_04_mo.jpg', videoUrl:'', blind:'AI 에너지 절약'},
            ],


            "WF24DV21WWF24T":[
                // {image:'gd_WF24DV21WWF24T_pc.jpg', imageMo:'gd_WF24DV21WWF24T_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WF24DV21WWF24T_pc.jpg', imageMoZoom:'gd_WF24DV21WWF24T_mo.jpg', videoUrl:''},
                {image:'gd_WF24DV21WWF24T_01_pc.jpg', imageMo:'gd_WF24DV21WWF24T_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'AI 맞춤세탁으로 세탁부터 탈수까지 알아서에 대한 설명', imagePcZoom:'gd_WF24DV21WWF24T_01_pc.jpg', imageMoZoom:'gd_WF24DV21WWF24T_01_mo.jpg', videoUrl:'', blind:'AI 맞춤세탁'},
                {image:'gd_WF24DV21WWF24T_02_pc_v2.jpg', imageMo:'gd_WF24DV21WWF24T_02_mo_v2.jpg', podTxtPc:'', podTxtMo:'', alt:'세탁기 중앙에서 공간 제습이 가능한 환기구가 열려있는 이미지와 AI 공간제습이 50% 적정습도에서 가능하다는', imagePcZoom:'gd_WF24DV21WWF24T_02_pc_v2.jpg', imageMoZoom:'gd_WF24DV21WWF24T_02_mo_v2.jpg', videoUrl:'', blind:'AI 공간제습'},
                {image:'gd_WF24DV21WWF24T_03_pc_v2.jpg', imageMo:'gd_WF24DV21WWF24T_03_mo_v3.jpg', podTxtPc:'', podTxtMo:'', alt:'미세플라스틱저감 코스로 연간 약 49g 미세플라스틱 배출감소 (신용카드 약 10장 만큼 무게) AI 에너지절약 모드로 세탁기 최대 60% 건조기 최대 35% 에너지 절감', imagePcZoom:'gd_WF24DV21WWF24T_03_pc_v2.jpg', imageMoZoom:'gd_WF24DV21WWF24T_03_mo_v2.jpg', videoUrl:'', blind:'미세플라스틱저감 코스 & AI 에너지 절약'},
            ],


            "WA19CG6745BW":[
                // {image:'gd_WA19CG6745BW_pc.jpg', imageMo:'gd_WA19CG6745BW_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WA19CG6745BW_pc.jpg', imageMoZoom:'gd_WA19CG6745BW_mo.jpg', videoUrl:''},
                {image:'gd_WA19CG6745BW_01_pc.jpg', imageMo:'gd_WA19CG6745BW_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'빨랫감이 돌고있고 퍼블이 세척하는', imagePcZoom:'gd_WA19CG6745BW_01_pc.jpg', imageMoZoom:'gd_WA19CG6745BW_01_mo.jpg', videoUrl:'', blind:'버블폭포'},
                {image:'gd_WA19CG6745BW_02_pc.jpg', imageMo:'gd_WA19CG6745BW_02_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'원통에서 물줄기가 나오고 세척 가능하다는', imagePcZoom:'gd_WA19CG6745BW_02_pc.jpg', imageMoZoom:'gd_WA19CG6745BW_02_mo.jpg', videoUrl:'', blind:'입체돌풍세탁'},
                {image:'gd_WA19CG6745BW_03_pc.jpg', imageMo:'gd_WA19CG6745BW_03_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'원통 안에 물줄기가 강하게 나오는', imagePcZoom:'gd_WA19CG6745BW_03_pc.jpg', imageMoZoom:'gd_WA19CG6745BW_03_mo.jpg', videoUrl:'', blind:'무세제통세척'},
            ],
            "WA16CG6741BV":[
                // {image:'gd_WA16CG6741BV_pc.jpg', imageMo:'gd_WA16CG6741BV_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WA16CG6741BV_pc.jpg', imageMoZoom:'gd_WA16CG6741BV_mo.jpg', videoUrl:''},
                {image:'gd_WA16CG6741BV_01_pc.jpg', imageMo:'gd_WA16CG6741BV_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'빨랫감이 돌고있고 퍼블이 세척하는', imagePcZoom:'gd_WA16CG6741BV_01_pc.jpg', imageMoZoom:'gd_WA16CG6741BV_01_mo.jpg', videoUrl:'', blind:'버블폭포'},
                {image:'gd_WA16CG6741BV_02_pc.jpg', imageMo:'gd_WA16CG6741BV_02_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'원통에서 물줄기가 나오고 세척 가능하다는', imagePcZoom:'gd_WA16CG6741BV_02_pc.jpg', imageMoZoom:'gd_WA16CG6741BV_02_mo.jpg', videoUrl:'', blind:'입체돌풍세탁'},
                {image:'gd_WA16CG6741BV_03_pc.jpg', imageMo:'gd_WA16CG6741BV_03_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'원통 안에 물줄기가 강하게 나오는', imagePcZoom:'gd_WA16CG6741BV_03_pc.jpg', imageMoZoom:'gd_WA16CG6741BV_03_mo.jpg', videoUrl:'', blind:'무세제통세척'},
            ], 
            "WA14CG6441BY":[
                // {image:'gd_WA14CG6441BY_pc.jpg', imageMo:'gd_WA14CG6441BY_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'', imagePcZoom:'gd_WA14CG6441BY_pc.jpg', imageMoZoom:'gd_WA14CG6441BY_mo.jpg', videoUrl:''},
                {image:'gd_WA14CG6441BY_01_pc.jpg', imageMo:'gd_WA14CG6441BY_01_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'빨랫감이 돌고있고 퍼블이 세척하는', imagePcZoom:'gd_WA14CG6441BY_01_pc.jpg', imageMoZoom:'gd_WA14CG6441BY_01_mo.jpg', videoUrl:'', blind:'버블폭포'},
                {image:'gd_WA14CG6441BY_02_pc.jpg', imageMo:'gd_WA14CG6441BY_02_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'원통에서 물줄기가 나오고 세척 가능하다는', imagePcZoom:'gd_WA14CG6441BY_02_pc.jpg', imageMoZoom:'gd_WA14CG6441BY_02_mo.jpg', videoUrl:'', blind:'입체돌풍세탁'},
                {image:'gd_WA14CG6441BY_03_pc.jpg', imageMo:'gd_WA14CG6441BY_03_mo.jpg', podTxtPc:'', podTxtMo:'', alt:'원통 안에 물줄기가 강하게 나오는', imagePcZoom:'gd_WA14CG6441BY_03_pc.jpg', imageMoZoom:'gd_WA14CG6441BY_03_mo.jpg', videoUrl:'', blind:'무세제통세척'},
            ]
        }
    },
    update(buying, sku) {
        const slide = this;
        const imgSrc = slide.imageData.src;
        const productAll = slide.imageData.product;
        const selected = buying.state.selected;
        let arrImg = [];

        slide.wrapper= buying.el

        Object.keys(productAll).forEach(function(item){
            if(item === sku){
                arrImg = productAll[item];
            }
        });

        // pd 이미지 추가
        if(!arrImg.length) {
            arrImg = slide.imageData.product.etc;
        } else {
            arrImg.unshift({isPdImg:true});
        }

        function mainSlide(){
            const $target = $(slide.wrapper).find(slide.target);
            const $mainSwiper = $target[0].swiper;
            let arrMainList = [];
            let imgBeforeSrc = '';

            if(!$mainSwiper) return;

            if(slide.imageFadeEffect){
                if(_.isMobile()){
                    imgBeforeSrc = $target.find('.swiper-slide-active img.m_show').attr('src');
                } else {
                    imgBeforeSrc = $target.find('.swiper-slide-active img.m_hide').attr('src');
                }
            }

            $.each(arrImg, function(idx){

                // if(!!isOnce && idx == 0) return;
                
                // let blindTxt = ''

                // if (!!this.blind) {
                //     const blind = [... this.blind];

                //     blindTxt += '<div class="blind">';

                //     blind.forEach(function(item) {
                //         blindTxt += `<p>${item}</p>`;
                //     });

                //     blindTxt += '</div>';
                // }

                arrMainList.push(`<li class="swiper-slide ${this.dark === 'O' ? 'pt_dark' : ''}">
                                    ${this.bubble === 'O' ? `<p class="pt_bubble">건조기</p>` : ''}
                                    <!-- <p class="pt_pod-txt m_hide" ${!!this.podTxtPc ? '' : 'style="display:none;"'}>${this.podTxtPc}</p>
                                    <p class="pt_pod-txt m_show" ${!!this.podTxtMo ? '' : 'style="display:none;"'}>${this.podTxtMo}</p> -->
                                    <div class="img_box">
                                        ${this.isPdImg ? `
                                            <img src="${selected.thumbnail}?$784_400_PNG$" alt="${selected.sku} 제품 이미지" class="m_hide" loading="lazy" />
                                            <img src="${selected.thumbnail}?$720_360_PNG$" alt="${selected.sku} 제품 이미지" class="m_show" loading="lazy" />
                                        ` : `
                                            <img src="${imgSrc}${this.image}" alt="${this.alt}" class="m_hide" loading="lazy" />
                                            <img src="${imgSrc}${this.imageMo}" alt="${this.alt}" class="m_show" loading="lazy" />
                                        `}
                                    </div>
                                    ${!!this.blind? `<p class="blind">${this.blind}</p>` : ''}
                                    <div class="pt_bg ${!this.videoUrl ? 'pt_video_off':'pt_video_on'}">
                                        <a class="pt_btn_play" href="javascript:;" title=" 영상보기" data-role="btnModal" data-target="#pod_modal" data-option='${this.videoUrl}'><p class="blind">재생</p></a>
                                    </div>
                                </li>`);
            });

            arrImg.shift();
            $mainSwiper.removeAllSlides();
            $mainSwiper.appendSlide(arrMainList);
            $mainSwiper.update();
            $mainSwiper.slideToLoop(0, 0);

            if(imgBeforeSrc && slide.imageFadeEffect){
                let $imgBox =  $target.find('.swiper-slide-active .img_box');
                $imgBox.append('<img data-slide-effect src="' + imgBeforeSrc + '" alt="" style="position: absolute;top: 0;left: 0;"/>');
                $imgBox.find('[data-slide-effect]').stop().fadeOut(120, function() { $(this).remove() });
            }
        }

        mainSlide();
    },
    init(buying) {
        const slide = this;

        slide.wrapper = buying.el;

        const buyingSlide = new Swiper($(slide.wrapper).find(slide.target),{
            preloadImages: false,
            lazy: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            slidesPerView: 1,
            loop: true,
            pagination: {
                el: '[data-buying-pagination]',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next.pt_buying-next',
                prevEl: '.swiper-button-prev.pt_buying-prev',
            },
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            on: {
                init: function(){
                    // play/pause
                    $('.pt_btn-play').on('click', function() {
                        $(this).toggleClass("pt_pause pt_play");
                        if($(this).hasClass("pt_pause")) {
                            buyingSlide.autoplay.start();
                        } else {
                            buyingSlide.autoplay.stop();
                        }
                    });
                },
                slideChange: function(){
                    const activeIndex = this.activeIndex;
                    const $activeSlide = $(this.slides[activeIndex]);
                    const $control = $('.pt_prd-slide__control');

                    if($activeSlide.hasClass('pt_dark')){
                        $control.addClass('pt_dark');
                        $('.swiper-button-prev, .swiper-button-next').addClass('pt_dark');
                    } else {
                        $control.removeClass('pt_dark');
                        $('.swiper-button-prev, .swiper-button-next').removeClass('pt_dark');
                    }
                }
            }
    
        });
    }
}

const buyingUtil = {
    btnZoom() {
        let arrImage = {};

        function setData(imageData){
            const src = imageData.src;
            const product = imageData.product;
            Object.keys(product).forEach( (sku) => {
                if (!arrImage[sku]) arrImage[sku] = [];
                product[sku].forEach( (item) => {
                    //arrImage[sku].push( { src: src + item.image, width: 784, height: 512, alt: item.alt } );
					if (!_.isMobile()) {
                        arrImage[sku].push( { src: src + item.imagePcZoom, width: 800, height: 690, alt: item.alt } );
                    } else {
                        arrImage[sku].push( { src: src + item.imageMoZoom, width: 720, height: 606, alt: item.alt } );
                    }
                });
            });
        }

        function open(wrapper, sku) {
			let arrImgData = arrImage[sku];

            // if(isOnceZoom){
            //     arrImgData = arrImage[sku].slice(1);
            // }

            const lightbox = new PhotoSwipeLightbox({
                dataSource: arrImgData,
                children:'a',
                pswpModule: () => import('./plugins/photoswipe'),
                bgOpacity: .7,
                arrowPrevTitle: '이전',
                arrowNextTitle: '다음',
                closeTitle: '레이어 팝업 닫기',
                zoomTitle: '확대하기',
                initialZoomLevel: 'fit',
                secondaryZoomLevel: 1.3,
                maxZoomLevel: 1,
            });
            lightbox.on('uiRegister', function() {
                lightbox.pswp.ui.registerElement({
                    name: 'bulletsIndicator',
                    className: 'pswp__bullets-indicator',
                    appendTo: 'wrapper',
                    onInit: (el, pswp) => {
                        const bullets = [];
                        let bullet;
                        let prevIndex = -1;
                        for (let i = 0; i < pswp.getNumItems(); i++) {
                            bullet = document.createElement('div');
                            bullet.className = 'pswp__bullet';
                            bullet.onclick = (e) => {
                                pswp.goTo(bullets.indexOf(e.target));
                            };
                            el.appendChild(bullet);
                            bullets.push(bullet);
                        }
                        pswp.on('change', (a) => {
                            if (prevIndex >= 0) {
                                bullets[prevIndex].classList.remove('pswp__bullet--active');
                            }
                            bullets[pswp.currIndex].classList.add('pswp__bullet--active');
                            prevIndex = pswp.currIndex;
                        });
                    }
                });
            });

            const $target = $(wrapper).find(buyingSlide.target);
            const $swiper = $target[0].swiper;
            const realIdx = $swiper.realIndex ? $swiper.realIndex : 0;

            lightbox.init();
            lightbox.loadAndOpen(realIdx);
        }

        arrPrdBuying.forEach(function(item){
            const $el = item.$el;
            setData(buyingSlide.imageData);

            $el.off('click.btnZoom').on('click.btnZoom', '[data-role="btnZoom"]', function(e) {
                e.preventDefault();
                let $btn = $(this);
                let sku = $btn.attr('data-sku');

                open(item.el, sku);
            });
        });

    },
    btnKvBuy() {
        $secWrap.off('click.btnKvBuy').on('click.btnKvBuy', '[data-role="btnKvBuy"], [data-role="btnKvPresent"], [data-role="btnKvPickup"]', function(e) {
            e.preventDefault();

            $('html, body').stop().animate({ scrollTop: $('#pt_buying_unpack .pt_option').offset().top - _.pxToVw(85, 208) }, 500, function() {

                if (!$('[data-role-buying-accordian="buyingBenefitBtn"]').hasClass('active')) {
                    $('[data-role-buying-accordian="buyingBenefitBtn"]').trigger('click')
                }
            });
        });
    },
    btnBuy() {
        $secWrap.off('click.btnBuy').on('click.btnBuy', '[data-role="btnBuy"]', function(e) {
            e.preventDefault();
            let $btn = $(this);
            const params = {
                goodsId: $btn.attr('data-gcode'),
                qty: 1,
            }

            // if(!!$btn.attr('data-is-pickup')){
            //     params.pckStrNo = $('#plazaNo-'+$btn.attr('data-gcode')).text();
            // }

            // if(!!$btn.attr('data-tradeIn')){
            //     params.tradeIn = $btn.attr('data-tradeIn') ? $btn.attr('data-tradeIn') : 'N';
            // }

            // if(!!$btn.attr('data-galaxyCd')){
            //     params.galaxyClub = $btn.attr('data-galaxyClub') ? $btn.attr('data-galaxyClub') : 'N';
            //     params.galaxyClubTpCd = $btn.attr('data-galaxyCd') ? $btn.attr('data-galaxyCd') : null;
            // }

            if (params.goodsId && window.fnBuyDirectByMultiId) {
                //NetFunnel_Action({action_id:'b2c_checkout'}, function(ev,ret){
                    fnBuyDirectByMultiId([params]);
                //});
            }
        });
    },
    btnLink() {
        $secWrap.off('click.btnLink').on('click.btnLink', '[data-buying-role="btnLink"]', function(e) {
            e.preventDefault();
            let $btn = $(this);

                const gcode = $btn.attr('data-gcode');
                const params = [
                    {goodsId: gcode, qty: 1},
                ]
                if (window.fnBuyDirectByMultiId) {
                    //NetFunnel_Action({action_id:'b2c_checkout'}, function(ev,ret){
                    fnBuyDirectByMultiId(params);
                    //});
                }

                // PD 페이지로 링크 이동
                // const url = $btn.attr('data-href');
                // location.href = url;
        });
    },
    btnPresent() {
        $secWrap.off('click.btnPresent').on('click.btnPresent', '[data-role="btnPresent"]', function(e) {
            e.preventDefault();
            let sku = $(this).attr('data-sku');
            if (sku && window.presentDirect) {
                // NetFunnel_Action({action_id:'b2c_promotion'}, function(ev,ret){
                    presentDirect(sku, '_self');
                // });
            }
        });

    },
    btnCart() {
        $secWrap.off('click.btnCart').on('click.btnCart', '[data-role="btnCart"]', function(e) {
            e.preventDefault();
            let $btn = $(this);
            const params = {
                goodsId: $btn.attr('data-gcode'),
                qty: 1,
                compNo: $btn.attr('data-comp'),
                tradeIn: $btn.attr('data-tradeIn'),
            };

            if (params.goodsId && window.fnCartDirectByMultiId) {
                // NetFunnel_Action({action_id:'b2c_checkout'}, function(ev,ret){
                fnCartDirectByMultiId([params], "confirm");
                // });
            }
        });
    },
    btnPickup() {
        $secWrap.off('click.btnPickup').on('click.btnPickup', '[data-role="btnPickup"]', function(e) {
            e.preventDefault();
            let $btn = $(this);
            const params = {
                goodsId: $btn.attr('data-gcode'),
                goodsNm: $btn.attr('data-gname'),
                mdlCode: $btn.attr('data-sku'),
                isEvent: "Y"
            }
            if (params.goodsId && window.fnOpenPickUpStorePop) {
                NetFunnel_Action({action_id:'pickup_popup'}, function(ev,ret){
                    fnOpenPickUpStorePop(params);
                });
            }

            $secWrap.find('[data-pickup-plazaNm]').attr('id','plazaNm-'+params.goodsId);
            $secWrap.find('[data-pickup-plazaNo]').attr('id','plazaNo-'+params.goodsId);
            $secWrap.find('[data-pickup-storeAddr]').attr('id','storeAddr-'+params.goodsId);
        });
    },
    btnPickupTrigger() {
        $secWrap.off('click.btnPickupTrigger').on('click.btnPickupTrigger', '[data-role="btnPickupTrigger"]', function(e) {
            e.preventDefault();
            let $btn = $(this);
            $secWrap.find('[data-role="btnPickup"]')[0].trigger('click')
        });
    },
    btnAlarmPop() {
        const $prevfocus = [];

        $secWrap.off('click.btnAlarmPop').on('click.btnAlarmPop', '[data-role="btnAlarmPop"]', function(e) {
            e.preventDefault();
            const $this = $(this);
            const isAlarmed = $this.attr('data-alarmed');

            if (isAlarmed == 'true') {
                makeAlert('<b>재입고알림이 신청된 상품입니다.</b> <br />신고하신 내역은 마이페이지 -> 관심목록 -> <br />재입고 알림 페이지에서 확인 가능합니다.');
            } else {
                const api = {
                    url : `${callApi.apiUrl}xhr/member/getSession`,
                    type: "POST",
                    done : function(data){
                        const session = JSON.parse(data);
    
                        if(session.mbrNo == 0){
                            isLogin = false;
    
                            const returnUrl = window.location.pathname;
                            location.href='/sec/member/indexLogin/?returnUrl='+returnUrl;
    
                        } else {
                            isLogin = true;
    
                            const gCode = $this.attr('data-gCode');
                            const target = $this.attr('data-target');
                            const $target = $(target);
                            const $closeModal = $(`[data-role="closeAlarmModal"][data-target="${target}"]`);
                            const dimm_id = `dimm_${new Date().getTime()}`;
    
                            $prevfocus.push($this);
                            $('body').append(`<div id="${dimm_id}" class="dimm"></div>`);
                            $(`#${dimm_id}`).css('z-index', +$target.css('z-index') - 1).fadeIn();
                            $target.show().trigger('focus');
                            $closeModal.attr('data-dimm', `#${dimm_id}`);
    
                            if (!isLocal) callApi.emailCheck();
    
                            $target.off('keydown.popFocusPrev').on('keydown.popFocusPrev', function (e) {
                                if ($target.is(':focus') && e.shiftKey && e.keyCode == 9) {
                                    e.preventDefault();
                                    $closeModal.trigger('focus');
                                }
                            });
                            $closeModal.off('keydown.popFocusNext').on('keydown.popFocusNext', function (e) {
                                if (!e.shiftKey && e.keyCode == 9) {
                                    e.preventDefault();
                                    $target.trigger('focus');
                                }
                            });
                        }
                    }
                };
                ajax.call(api);
    
            }

        });

        // 모달 닫기
        $secWrap.off('click.closeAlarmModal').on('click.closeAlarmModal', '[data-role="closeAlarmModal"]', function (e) {
            e.preventDefault();
            const $this = $(this);
            const $target = $($this.attr('data-target'));
            const dimm_id = $this.attr('data-dimm');
            
            $(dimm_id).fadeOut(function () {
                $(this).remove();
            });
            $target.hide();
            $prevfocus[0].trigger('focus');
            $prevfocus.pop();

            const gCode = $secWrap.find('[data-role=btnBuy]').attr('data-gcode');
            callApi.alarmCheck(gCode);
        });
    },
    btnAlarm() {
        $secWrap.off('click.btnAlarm').on('click.btnAlarm', '[data-role="btnAlarm"]', function (e) {
            const gCode = $(this).attr('data-gCode');
            const phoneNumber = $('[data-popup-role="phoneNumber"]').val();
            const eMail = $('[data-popup-role="eMail"]').val();
            
            if (gCode && window.fnRegisterRestockAlarm) {
                //if(!phoneNumber){
                //    alert('폰번호 입력 안됨!');
                //}else{
                //     console.info('입고알림 호출됨!',gCode,eMail,phoneNumber);
                //}

                const restockAlarmResult = fnRegisterRestockAlarm(gCode, eMail, phoneNumber);
                if(restockAlarmResult){
                    $secWrap.find('.pt_submit-popup__close').trigger('click');
                }
            }
        });
    },
    updateBtn($el, selected, selectOptEtc, omni) {
        if(!selected) return;

        // 더 쿠폰 다운받기 버튼
        const $btnCoupon = $secWrap.find('[data-buying-role="btnCoupon"]');
        if(!!$btnCoupon.length && selected.gCode){
            $btnCoupon.attr('data-cpNum', selected.cpNum);
            if(!!omni) $btnCoupon.attr('data-omni', `${omni.coupon}${selected.sku}`);
        }
        // 더 알아보기 버튼 (-> 구매하기 버튼으로 수정됨)
        const $btnLink = $secWrap.find('[data-buying-role=btnLink]');
        if(!!$btnLink.length && selected.gCode){
            $btnLink.attr('data-href', selected.pdUrl);
            $btnLink.attr('data-gcode', selected.gCode);
            $btnLink.attr('title', `${selected.sku} 제품 페이지로 이동`);
            if(!!omni) $btnLink.attr('data-omni', `${omni.buy}${selected.sku}`);
        }
        // 자세히보기 버튼
        const $btnPdUrl = $secWrap.find('[data-role=btnPdUrl]');
        if(!!$btnPdUrl.length && selected.gCode){
            $btnPdUrl.attr('href', selected.pdUrl);
            $btnPdUrl.attr('title', `${selected.sku} 제품 페이지로 이동`);
            if(!!omni) $btnPdUrl.attr('data-omni', `${omni.link}${selected.sku}`);
        }
        // 구매하기 버튼
        const $btnBuy = $secWrap.find('[data--buying-role=btnBuy]');
        if(!!$btnBuy.length && selected.gCode){
            $btnBuy.attr('data-gcode', selected.gCode);
            // $btnBuy.attr('data-comp', selected.deptCd ? selected.deptCd : 313);
            // $btnBuy.attr('data-galaxyClub', selectOptEtc.galaxyClub ? selectOptEtc.galaxyClub : 'N');
            // $btnBuy.attr('data-tradeIn', selectOptEtc.tradeIn ? selectOptEtc.tradeIn : 'N');
            // $btnBuy.attr('data-galaxyCd', selected.galaxyClub ? selected.galaxyClub : 'CLBT03');
            // $btnBuy.attr('href', selected.pdUrl);
            // $btnBuy.attr('title', `${selected.sku} 제품 페이지로 이동`);
            if(!!omni) $btnBuy.attr('data-omni', `${omni.buy}${selected.sku}`);
        }
        // 제품별 삼케플 해당 혜택 금액 변경
        // if(!!selected && !!selected.priceD && selected.priceD.trim() !== '-'){
        //     console.info(selected.priceD);
        // }

        // 선물하기 버튼
        // const $btnPresent = $secWrap.find('[data-role=btnPresent]');
        // if(!!$btnPresent.length && selected.sku) {
        //     // $btnPresent.attr('data-gcode', selected.gCode);
        //     $btnPresent.attr('data-sku', selected.sku);
        //     // $btnPresent.attr('data-comp', selected.deptCd ? selected.deptCd : 313);
        //     if(!!omni) $btnPresent.attr('data-omni', `${omni.present}${selected.sku}`);
        // }
        // 장바구니 버튼
        // const $btnCart = $secWrap.find('[data-role="btnCart"]');
        // if(!!$btnCart.length && selected.sku) {
        //     $btnCart.attr('data-gcode', selected.gCode);
        //     $btnCart.attr('data-comp', selected.deptCd ? selected.deptCd : 313);
        //     $btnCart.attr('data-tradeIn', selectOptEtc.tradeIn ? selectOptEtc.tradeIn : 'N');
        //     if(!!omni) $btnCart.attr('data-omni', `${omni.cart}${selected.sku}`);
        // }
        // 재입고 알림 신청
        // const $btnAlarmPop = $secWrap.find('[data-role="btnAlarmPop"]');
        // if(!!$btnAlarmPop.length && selected.gCode) {
        //     $btnAlarmPop.attr('data-gcode', selected.gCode);
        //     if(!!omni) $btnAlarmPop.attr('data-omni', `${omni.stickyRestock}${selected.sku}`);
        // }
        // 재입고 알림 신청
        // const $btnAlarm = $secWrap.find('[data-role="btnAlarm"]');
        // if(!!$btnAlarm.length && selected.gCode) {
        //     $btnAlarm.attr('data-gcode', selected.gCode);
        //     if(!!omni) $btnAlarm.attr('data-omni', `${omni.modalRestock}${selected.sku}`);
        // }
        // 매장픽업 버튼
        // const $btnPickup =  $secWrap.find('[data-role=btnPickup]');
        // if(!!$btnPickup.length && selected.gCode) {
        //     $btnPickup.attr('data-gcode', selected.gCode);
        //     $btnPickup.attr('data-gname', selected.pdNmApi);
        //     $btnPickup.attr('data-sku', selected.sku);
        //     if(!!omni) $($btnPickup[0]).attr('data-omni', `${omni.pickup}${selected.sku}`);
        // }
        // 확대하기 버튼
        const $btnZoom = $el.find('[data-role=btnZoom]');
        if(!!$btnZoom.length && selected.sku) {
            $btnZoom.attr('data-sku', selected.sku);
        }
    },
    pickupEvt(){
        const $btnBuy = $secWrap.find('[data-role=btnBuy]');
        const $btnAlarmPop = $secWrap.find('[data-role="btnAlarmPop"]');
        // add
        $secWrap.find('[data-pickup-plazaNo]').on('DOMSubtreeModified', function() {
            try{

                if(!!$('[data-pickup-plazaNo]').text()){

                    $secWrap.find('[data-role="pickupItem"]').show();
                    $btnBuy.attr('data-is-pickup', true);
                    $btnBuy.show();
                    $btnBuy.removeClass('pt_reverse');
                    $btnAlarmPop.hide();
                    // $('[data-role="btnKvBuy"]').html('재입고 알림 신청하기');
                    const $present = $('.pt_btn--present');
                    const $cart = $('.pt_btn--cart');
                    $present.addClass('pt_btn--disabled');
                    $cart.addClass('pt_btn--disabled');
                    // 픽업하기 선택 시
                    if (!$('[data-role-buying-accordian="buyingBenefitBtn"]').hasClass('active')) {
                        console.dir('매장픽업')
                        $('[data-role-buying-accordian="buyingBenefitBtn"]').trigger('click')
                    }

                }

            }catch (e) {}

        });
        // $secWrap.on('click', '[data-pickup-close]', function() {
        //     const gCode = $btnBuy.attr('data-gcode');
        //     $secWrap.find('[data-pickup-plazaNo]').text('');
        //     $secWrap.find('[data-pickup-storeAddr]').text('');
        //     $secWrap.find('[data-role="pickupItem"]').hide();
        //     $btnBuy.attr('data-is-pickup', false);
        //     callApi.soldoutCheck(gCode);
        // });
    },
    init() {
        this.btnZoom();
        // this.btnAlarmPop();
        // this.btnAlarm();
        // this.btnBuy();
        // this.btnPickupTrigger();
        // this.pickupEvt();
    },
}

// 삼성 앱 체크
const checkUserAgent = function() {
    const ua = navigator.userAgent.toLowerCase();

    if ( ua.indexOf('secapp') != -1) { // 닷컴앱 인경우      
        $secWrap.find('[data-app-only]').show();
        $secWrap.find('[data-web-only]').hide();
    } else {
        $secWrap.find('[data-app-only]').hide();
        $secWrap.find('[data-web-only]').show();
    }
}

function init() {
    // if (!isLocal) callApi.loginCheck();
    buying();
    buyingStickyEvt.init();
    buyingUtil.init();

    checkUserAgent();

    isOnce = true;
    // 줌 모달 이미지 사이즈 조절
    let timer;
    let isMobileInit = _.isMobile();
    $(window).on('resize', function(){ 
        if (timer) {
            clearTimeout(timer);  
        }
        timer = setTimeout(function(){
            if (isMobileInit == _.isMobile()){
                return;
            } else {
                isMobileInit = _.isMobile();
                buyingUtil.btnZoom();
            }
        }, 150);  
    });
}

// function visibleSingleInit(){
//     try{
//         $(window).on('scroll.oledBuying', function(e) {
//             const winTop = $(window).scrollTop();
//             const winHt = $(window).outerHeight();

//             if(winTop > winHt / 2){
                
//                 init();
//                 $(window).off('scroll.oledBuying');
//             }
//         }).scroll();
//     }catch (e){
//         
//     }
// }

// $(document).ready(function(){
//     visibleSingleInit();
// });
init();