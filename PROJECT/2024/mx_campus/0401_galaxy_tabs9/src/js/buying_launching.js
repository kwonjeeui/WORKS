import buyingData from "../data/launching.json";
import { Buying } from './modules/buying';
import { util as _ } from  './modules/bs_common';
import PhotoSwipeLightbox from './plugins/photoswipeLight';
import { buyingAccordian } from './modules/buyingAccordian';

const $secWrap = $('.sec_project_wrap');
let isOpened = false;
let arrPrdBuying = [];
let isOnce = false;
let isOnceZoom = false;

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

function buying(){
    arrPrdBuying[0] = new Buying('#pt_buying', {
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
            use: true,
        },
        on: {
            init(buying) {
                buyingSlide.init(buying);

                // 초기화 버튼 예시
                buying.$el.off('click.buyingInit').on('click.buyingInit', '[data-role="btnReset"]', function(){
                    buyingSlide.wrapper = buying.el;
                    buying.reset();
                });

                // 구매하기 초기 이벤트
                $secWrap.on('click.deactiveBuy', '[data-role="btnBuy"], [data-role="btnPickup"], [data-role="btnPresent"], [data-role="btnCart"]', function() {
                    messager.alert('중고 추가 보상 프로그램 (트레이드인)과 <br />My갤럭시클럽까지 <br />모든 옵션 선택 후 구매 가능합니다.', '확인', function(){
                        function isMobile() {
                            return $(window).outerWidth() <= 768;
                        }

                        function pxToVw(pc, mo) {
                            const winWidth = $(window).outerWidth();
                            const divide = isMobile() ? 720 : 1440;
                            const pixel = isMobile() ? (mo === undefined ? pc : mo) : pc;
                            return pixel >= 0 ? Math.min(pixel, (pixel / divide) * winWidth) : Math.max(pixel, (pixel / divide) * winWidth);
                        }

                        let offset = $('#pt_buying .pt_option').offset().top - pxToVw(84, 224);
                        let isOnce = false;
                        $('.sec_project_wrap').find('[data-opt-etc]').each(function(i,item){
                            if(!isOnce && $(item).find('input:checked').length < 1){
                                offset = $(item).offset().top - pxToVw($(window).outerHeight()/2);
                                isOnce = true;
                            }
                        });

                        $('html, body').stop().animate({ scrollTop: offset }, 500);
                    })
                });
            },
            optionChangeEnd(buying, option) {
                const selected = buying.state.selected;
                const sku = selected && selected.sku ? selected.sku : $(option).attr('data-opt-sku');
                
                // 매장픽업 비활성화
                if (selected.pickup === 'O') {
                    $secWrap.find('[data-role="btnPickup"]').addClass('pt_btn--disabled');
                } else {
                    $secWrap.find('[data-role="btnPickup"]').removeClass('pt_btn--disabled');
                }

                // 대표 sku 제품 이미지 를라이드 맵핑
                if(sku) buyingSlide.update(buying, sku);

                if(isOnce){
                    // 옵션 클릭시 첫번째 줌 슬라이드 삭제시 사용
                    isOnceZoom = true;
                }
                
            },
            productChangeEnd(buying) {
                const selectOptEtc = buying.state.selectOptionEtc;
                const selected = buying.state.selected;
                const omni = {
                    // 갤캠스 사용X : present, cpn, appCpn, pdCpn, present_under, cpn_under
                    buy: 'event:galaxycampus:gcsPromotion:galaxy-tabs9-series:buynow_sticky_',
                    present: 'event:galaxycampus:gcsPromotion:galaxy-tabs9-series:gift_sticky_',
                    cart: 'event:galaxycampus:gcsPromotion:galaxy-tabs9-series:cart_stkicky_',
                    pickup: 'event:galaxycampus:gcsPromotion:galaxy-tabs9-series:pickup_sticky_',
                    pdUrl: 'event:galaxycampus:gcsPromotion:galaxy-tabs9-series:viewmore_stiky_',

                    cpn: 'event:galaxycampus:gcsPromotion:galaxy-tabs9-series:coupon_stiky_',
                    appCpn: 'event:galaxycampus:gcsPromotion:galaxy-tabs9-series:app_coupon_simulater_',
                    pdCpn: 'event:galaxycampus:gcsPromotion:galaxy-tabs9-series:coupon_simulater_',

                    buy_under: 'event:galaxycampus:gcsPromotion:galaxy-tabs9-series:buynow_',
                    present_under: 'event:galaxycampus:gcsPromotion:galaxy-tabs9-series:gift_',
                    cart_under: 'event:galaxycampus:gcsPromotion:galaxy-tabs9-series:cart_',
                    pickup_under: 'event:galaxycampus:gcsPromotion:galaxy-tabs9-series:pickup_',
                    cpn_under: 'event:galaxycampus:gcsPromotion:galaxy-tabs9-series:coupon_',
                }
                buyingUtil.updateBtn(buying.$el, selected, selectOptEtc, omni, null);

                // 컬러칩 하단 1월 도착보장 라벨 부착
                buyingUtil.setColorLabel(buying);

                // 매장픽업 초기화
                const $btnBuy = $secWrap.find('[data-role="btnBuy"]');
                if($btnBuy.attr('data-is-pickup')){
                    $secWrap.find('[data-pickup-plazaNo]').text('');
                    $secWrap.find('[data-pickup-storeAddr]').text('');
                    $secWrap.find('[data-pickup-capaDate]').text('');
                    $secWrap.find('[data-pickup-capaTime]').text('');
                    $secWrap.find('[data-role="pickupDate"]').text('');
                    $secWrap.find('[data-role="pickupTime"]').text('');
                    $secWrap.find('[data-role="pickupItem"]').slideUp();
                    $btnBuy.attr('data-is-pickup', false);
                }

                // 바잉툴 외부 제품 정보 text 변경
                try {
                    $secWrap.find('[data-buying-text]').each(function(){
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

                if(selected.priceChk == 'O' ) {
                    $secWrap.find('.pt_sale--txt').text('삼성카드 제품별 결제일할인가');
                } else {
                    $secWrap.find('.pt_sale--txt').text('신용카드 금액대별 결제일할인가');
                }

                // if(selected.optCdA === 'optA_2') {
                //     $secWrap.find('.pt_option__deli').hide();
                // } else {
                //     $secWrap.find('.pt_option__deli').show();
                // }

                // if(selected.optCdE === 'optE_5') {
                //     $secWrap.find('.pt_benefit__txt--bundle').text('세서미 스트리트 엔벨롭 커버 30% 할인');
                // } else if(selected.optCdE === 'optE_6') {
                //     $secWrap.find('.pt_benefit__txt--bundle').text('조구만 스튜디오 엔벨롭 커버 30% 할인');
                // } else {
                //     $secWrap.find('.pt_benefit__txt--bundle').text('프라이버시 스크린 30% 할인');
                // }

                if(selected.optCdA === 'optA_1') {
                    //ultra
                    $secWrap.find('.pt_option__img--gray').html(`
                    <img src="../../is/images/buying/gt9_option_ultra_graphite_pc.png" class="m_hide" alt="갤럭시 탭S9 Ultra 그라파이트 제품의 후면" loading="lazy" />
                    <img src="../../is/images/buying/gt9_option_ultra_graphite_mo.png" class="m_show" alt="갤럭시 탭S9 Ultra 그라파이트 제품의 후면" loading="lazy" />
                    `);
                    $secWrap.find('.pt_option__img--beige').html(`
                    <img src="../../is/images/buying/gt9_option_ultra_beige_pc.png" class="m_hide" alt="갤럭시 탭S9 Ultra 베이지 제품의 후면" loading="lazy" />
                    <img src="../../is/images/buying/gt9_option_ultra_beige_mo.png" class="m_show" alt="갤럭시 탭S9 Ultra 베이지 제품의 후면" loading="lazy" />
                    `);
                    // $secWrap.find('.pt_option__img--joguman').html(`
                    // <img src="../../is/images/buying/gt9_option_bundle3_1_pc_v1.png" class="m_hide" alt="우유상자 안에 초록색 공룡이 있는 조구만 스튜디오 이미지가 있는 엔벨롭 커버" loading="lazy" />
                    // <img src="../../is/images/buying/gt9_option_bundle3_1_mo_v1.png" class="m_show" alt="우유상자 안에 초록색 공룡이 있는 조구만 스튜디오 이미지가 있는 엔벨롭 커버" loading="lazy" />
                    // `);
                } else if(selected.optCdA === 'optA_2') {
                    //plus
                    $secWrap.find('.pt_option__img--gray').html(`
                    <img src="../../is/images/buying/gt9_option_plus_graphite_pc.png" class="m_hide" alt="갤럭시 탭S9 plus 그라파이트 제품의 후면" loading="lazy" />
                    <img src="../../is/images/buying/gt9_option_plus_graphite_mo.png" class="m_show" alt="갤럭시 탭S9 plus 그라파이트 제품의 후면" loading="lazy" />
                    `);
                    $secWrap.find('.pt_option__img--beige').html(`
                    <img src="../../is/images/buying/gt9_option_plus_beige_pc.png" class="m_hide" alt="갤럭시 탭S9 plus 베이지 제품의 후면" loading="lazy" />
                    <img src="../../is/images/buying/gt9_option_plus_beige_mo.png" class="m_show" alt="갤럭시 탭S9 plus 베이지 제품의 후면" loading="lazy" />
                    `);
                    // $secWrap.find('.pt_option__img--joguman').html(`
                    // <img src="../../is/images/buying/gt9_option_bundle3_2_pc_v1.png" class="m_hide" alt="UBHC 문구가 적혀있는 빨간색 사과와 초록색 공룡이 있는 조구만 엔벨롭 커버" loading="lazy" />
                    // <img src="../../is/images/buying/gt9_option_bundle3_2_mo_v1.png" class="m_show" alt="UBHC 문구가 적혀있는 빨간색 사과와 초록색 공룡이 있는 조구만 엔벨롭 커버" loading="lazy" />
                    // `);
                } else if(selected.optCdA === 'optA_3') {
                    //s9
                    $secWrap.find('.pt_option__img--gray').html(`
                    <img src="../../is/images/buying/gt9_option_s9_graphite_pc.png" class="m_hide" alt="갤럭시 탭S9 그라파이트 제품의 후면" loading="lazy" />
                    <img src="../../is/images/buying/gt9_option_s9_graphite_mo.png" class="m_show" alt="갤럭시 탭S9 그라파이트 제품의 후면" loading="lazy" />
                    `);
                    $secWrap.find('.pt_option__img--beige').html(`
                    <img src="../../is/images/buying/gt9_option_s9_beige_pc.png" class="m_hide" alt="갤럭시 탭S9 베이지 제품의 후면" loading="lazy" />
                    <img src="../../is/images/buying/gt9_option_s9_beige_mo.png" class="m_show" alt="갤럭시 탭S9 베이지 제품의 후면" loading="lazy" />
                    `);
                    // $secWrap.find('.pt_option__img--joguman').html(`
                    // <img src="../../is/images/buying/gt9_option_bundle3_3_pc_v1.png" class="m_hide" alt="앉아있는 초록색 공룡과 손에 칼을 들고 있는 초록색 공룡이 있는 조구만 엔벨롭 커버" loading="lazy" />
                    // <img src="../../is/images/buying/gt9_option_bundle3_3_mo_v1.png" class="m_show" alt="앉아있는 초록색 공룡과 손에 칼을 들고 있는 초록색 공룡이 있는 조구만 엔벨롭 커버" loading="lazy" />
                    // `);
                }

                // if( selected.skuA == 'SM-X710NZAAKOO' || selected.skuA == 'SM-X710NZEAKOO'
                // ) {
                //     $secWrap.find('.pt_option__box--acc').hide();
                // } else {
                //     $secWrap.find('.pt_option__box--acc').show();
                // }
            },
            optionAllChangeEnd(buying) {
                const selectOptEtc = buying.state.selectOptionEtc;
                const selected = buying.state.selected;
                let isStickChk = false;

                buyingUtil.updateBtn(buying.$el, selected, selectOptEtc, null);

                // 재고체크
                // const _gCode = [];
                // if(selected.gCodeA.trim() !== '-'){
                //     _gCode.push(selected.gCodeA.trim())
                // }
                // if(selected.gCodeB.trim() !== '-'){
                //     _gCode.push(selected.gCodeB.trim())
                // }
                callApi.soldoutCheck(selected.gCode);

                if (!isOpened) {
                    if (!$('[data-buying-sticky]').hasClass('fixed')) {
                        $('html, body').stop().animate({scrollTop: $('#pt_buying .pt_option').offset().top - _.pxToVw(85, 208)}, 500, function(){
                            if(!isStickChk){
                                $('[data-role-buying-accordian="buyingBenefitBtn"]').trigger('click');
                                isStickChk = true;
                            }
                        });
                    } else {
                        $('[data-role-buying-accordian="buyingBenefitBtn"]').trigger('click');
                    }
                    
                    $('[data-buying-btn]').addClass('active');

                    $secWrap.off('click.deactiveBuy');

                    buyingUtil.btnBuy();
                    buyingUtil.btnPickup();
                    buyingUtil.btnCart();

                    isOpened = true;
                }
            },
            optionEtcChangeEnd(buying, option) {
                const gClub = buying.state.selectOptionEtc.galaxyClub;

                if (gClub == 'Y') {
                    $secWrap.find('[data-gclub-show="N"]').addClass('pt_hide');
                    $secWrap.find('[data-gclub-show="Y"]').removeClass('pt_hide');
                } else {
                    $secWrap.find('[data-gclub-show="N"]').removeClass('pt_hide');
                    $secWrap.find('[data-gclub-show="Y"]').addClass('pt_hide');
                }
            },
            // setColorLabel(buying){
            //     const selected = buying.state.selected;
            //     const colorList = buying.params.pdList.filter( (item) => item.optCdA === selected.optCdA && item.optCdB === selected.optCdB && item.optCdC === selected.optCdC);
            //     colorList.forEach(function(item){
            //         const $colorLabel = buying.$el.find(`#${item.optCdD}`).closest('.pt_option__item').find('[data-buying-label]');
            //         if(item.tagA.trim().toUpperCase() === 'O'){
            //             $colorLabel.show();
            //         } else {
            //             $colorLabel.hide();
            //         }
            //     });
            // },
        }
    });
}
let isGalaxyCmpnFlag = false;
let prgrStatYn = 'N';
const callApi = {
    apiUrl: '/event/galaxycampus/',
    checkGalaxyClub: function (callback) {
        const galCheck = {
            url : `${callApi.apiUrl}xhr/goods/galaxyClubOrderHistoryCheck`
            ,type: 'POST'
            ,done : function(data) {
                if(data.membershipNo != null && data.isGalaxyCmpnYn == 'Y'){
                    if( isGalaxyCmpnFlag ){
                        if( prgrStatYn == 'Y'){
                            callback();
                        }
                    } else {
                        const galMintCheck = {
                            url : `${callApi.apiUrl}xhr/goods/galaxyClubMintitCheck`
                            ,type: 'POST'
                            ,done : function(data) {
                                prgrStatYn = data.prgrStatYn;
                                isGalaxyCmpnFlag = true;
                                if(prgrStatYn == 'Y'){
                                    callback();
                                }
                            }
                        };
                        ajax.call(galMintCheck);
                    }
                }
            },
        };
        ajax.call(galCheck);
    },
    soldoutCheck: function (gCode){
        PT_STATE.service.checkSoldoutMulti(gCode, function(data){
            const objKey = Object.keys(data);
            const objNum = objKey.length;
            let count = 0;
            objKey.forEach(function(key){
                if(Number(data[key]) === 12) count++;
            });
            if(count === objNum){ // 재고있음: 재고결과가 모두 '12'일때
                buyingUtil.soldoutEvt(12);
            } else { // 재고없음
                buyingUtil.soldoutEvt(0);
            }
        });
    },
}

// 바잉툴 스티키 네비
const buyingStickyEvt = {
    scrollEvt: function() {
        $(window).on('scroll.buyingSticky', function() {
            const scrollTop = $(window).scrollTop();
            // const secTarget = _.isMobile() ? $('.sec_sticky') : $('.sec_live');
            const secTarget = _.isMobile() ? $('#buying_slide').offset().top : $('.pt_buying').offset().top - _.pxToVw(83, 0);

            if (scrollTop >= secTarget && scrollTop <= $('.pt_buying').offset().top + $('.pt_buying').outerHeight() - _.pxToVw(84, 224) ) {
                $('[data-buying-sticky]').addClass('fixed');

            } else {
                $('[data-buying-sticky]').removeClass('fixed');

                if ($('[data-buying-sticky]').hasClass('opened') && scrollTop > $('.pt_buying .pt_notice').offset().top) {
                    $('[data-role-buying-accordian="buyingBenefitBtn"]').trigger('click');
                }
                if (!_.isMobile() && $('[data-buying-sticky]').hasClass('opened') && scrollTop < $('.sec_sticky').offset().top) {
                    $('[data-role-buying-accordian="buyingBenefitBtn"]').trigger('click');
                }
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
                        $this.html('<span class="blind">시뮬레이터 닫기</span>');
                        $('[data-buying-sticky]').addClass('opened').append('<div class="pt_sticky__dimm"></div>');
                        $this.attr('data-omni', 'event:galaxycampus:galaxy-tabs9-series:viewmore_sticky_close');
                        // 팝업 열릴때 스크롤 방지
                        noScroll.add();
                    } else {
                        $this.html('<span class="blind">시뮬레이터 열기</span>');
                        $('[data-buying-sticky]').removeClass('opened');
                        $('.pt_sticky__dimm').remove();
                        $this.attr('data-omni', 'event:galaxycampus:galaxy-tabs9-series:viewmore_sticky_open');
                        // 팝업 닫힐때 스크롤 방지 해제
                        noScroll.remove();
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

// 슬라이드 예시
const buyingSlide = {
    wrapper: '#pt_buying',
    target: '#buying_slide',
    imageFadeEffect: true,
    imageData: {
        "src": "../../is/images/buying/slide/",
        "src_zoom": "../../is/images/buying/zoom/",
        "product": {
            // 갤럭시 탭S9 Ultra 그라파이트 Wifi
            "SM-X910NZAAKOO":[  // 256GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_ultra_graphite_1_pc.jpg', imageMo:'gt9_ultra_graphite_1_mo_v1.jpg', imageZoom:'gt9_ultra_graphite_1_pc.jpg', imageMoZoom:'gt9_ultra_graphite_1_mo.jpg', alt:'세로 208.6mm, 가로 326.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_ultra_graphite_2_pc.jpg', imageMo:'gt9_ultra_graphite_2_mo_v1.jpg', imageZoom:'gt9_ultra_graphite_2_pc.jpg', imageMoZoom:'gt9_ultra_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 울트라 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X910NZAEKOO":[  // 512GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_ultra_graphite_1_pc.jpg', imageMo:'gt9_ultra_graphite_1_mo_v1.jpg', imageZoom:'gt9_ultra_graphite_1_pc.jpg', imageMoZoom:'gt9_ultra_graphite_1_mo.jpg', alt:'세로 208.6mm, 가로 326.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_ultra_graphite_2_pc.jpg', imageMo:'gt9_ultra_graphite_2_mo_v1.jpg', imageZoom:'gt9_ultra_graphite_2_pc.jpg', imageMoZoom:'gt9_ultra_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 울트라 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X910NZAIKOO":[  // 1TB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_ultra_graphite_1_pc.jpg', imageMo:'gt9_ultra_graphite_1_mo_v1.jpg', imageZoom:'gt9_ultra_graphite_1_pc.jpg', imageMoZoom:'gt9_ultra_graphite_1_mo.jpg', alt:'세로 208.6mm, 가로 326.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_ultra_graphite_2_pc.jpg', imageMo:'gt9_ultra_graphite_2_mo_v1.jpg', imageZoom:'gt9_ultra_graphite_2_pc.jpg', imageMoZoom:'gt9_ultra_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 울트라 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            // 갤럭시 탭S9 Ultra 그라파이트 5G
            "SM-X916NZAAKOO":[  // 256GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_ultra_graphite_1_pc.jpg', imageMo:'gt9_ultra_graphite_1_mo_v1.jpg', imageZoom:'gt9_ultra_graphite_1_pc.jpg', imageMoZoom:'gt9_ultra_graphite_1_mo.jpg', alt:'세로 208.6mm, 가로 326.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_ultra_graphite_2_pc.jpg', imageMo:'gt9_ultra_graphite_2_mo_v1.jpg', imageZoom:'gt9_ultra_graphite_2_pc.jpg', imageMoZoom:'gt9_ultra_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 울트라 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X916NZAEKOO":[  // 512GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_ultra_graphite_1_pc.jpg', imageMo:'gt9_ultra_graphite_1_mo_v1.jpg', imageZoom:'gt9_ultra_graphite_1_pc.jpg', imageMoZoom:'gt9_ultra_graphite_1_mo.jpg', alt:'세로 208.6mm, 가로 326.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_ultra_graphite_2_pc.jpg', imageMo:'gt9_ultra_graphite_2_mo_v1.jpg', imageZoom:'gt9_ultra_graphite_2_pc.jpg', imageMoZoom:'gt9_ultra_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 울트라 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X916NZAIKOO":[  // 1TB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_ultra_graphite_1_pc.jpg', imageMo:'gt9_ultra_graphite_1_mo_v1.jpg', imageZoom:'gt9_ultra_graphite_1_pc.jpg', imageMoZoom:'gt9_ultra_graphite_1_mo.jpg', alt:'세로 208.6mm, 가로 326.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_ultra_graphite_2_pc.jpg', imageMo:'gt9_ultra_graphite_2_mo_v1.jpg', imageZoom:'gt9_ultra_graphite_2_pc.jpg', imageMoZoom:'gt9_ultra_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 울트라 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            // 갤럭시 탭S9 Ultra 베이지 Wifi
            "SM-X910NZEAKOO":[  // 256GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_ultra_beige_1_pc.jpg', imageMo:'gt9_ultra_beige_1_mo_v1.jpg', imageZoom:'gt9_ultra_beige_1_pc.jpg', imageMoZoom:'gt9_ultra_beige_1_mo.jpg', alt:'세로 208.6mm, 가로 326.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_ultra_beige_2_pc.jpg', imageMo:'gt9_ultra_beige_2_mo_v1.jpg', imageZoom:'gt9_ultra_beige_2_pc.jpg', imageMoZoom:'gt9_ultra_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 울트라 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X910NZEEKOO":[  // 512GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_ultra_beige_1_pc.jpg', imageMo:'gt9_ultra_beige_1_mo_v1.jpg', imageZoom:'gt9_ultra_beige_1_pc.jpg', imageMoZoom:'gt9_ultra_beige_1_mo.jpg', alt:'세로 208.6mm, 가로 326.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_ultra_beige_2_pc.jpg', imageMo:'gt9_ultra_beige_2_mo_v1.jpg', imageZoom:'gt9_ultra_beige_2_pc.jpg', imageMoZoom:'gt9_ultra_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 울트라 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X910NZEIKOO":[  // 1TB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_ultra_beige_1_pc.jpg', imageMo:'gt9_ultra_beige_1_mo_v1.jpg', imageZoom:'gt9_ultra_beige_1_pc.jpg', imageMoZoom:'gt9_ultra_beige_1_mo.jpg', alt:'세로 208.6mm, 가로 326.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_ultra_beige_2_pc.jpg', imageMo:'gt9_ultra_beige_2_mo_v1.jpg', imageZoom:'gt9_ultra_beige_2_pc.jpg', imageMoZoom:'gt9_ultra_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 울트라 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            // 갤럭시 탭S9 Ultra 베이지 5G
            "SM-X916NZEAKOO":[  // 256GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_ultra_beige_1_pc.jpg', imageMo:'gt9_ultra_beige_1_mo_v1.jpg', imageZoom:'gt9_ultra_beige_1_pc.jpg', imageMoZoom:'gt9_ultra_beige_1_mo.jpg', alt:'세로 208.6mm, 가로 326.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_ultra_beige_2_pc.jpg', imageMo:'gt9_ultra_beige_2_mo_v1.jpg', imageZoom:'gt9_ultra_beige_2_pc.jpg', imageMoZoom:'gt9_ultra_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 울트라 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X916NZEEKOO":[  // 512GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_ultra_beige_1_pc.jpg', imageMo:'gt9_ultra_beige_1_mo_v1.jpg', imageZoom:'gt9_ultra_beige_1_pc.jpg', imageMoZoom:'gt9_ultra_beige_1_mo.jpg', alt:'세로 208.6mm, 가로 326.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_ultra_beige_2_pc.jpg', imageMo:'gt9_ultra_beige_2_mo_v1.jpg', imageZoom:'gt9_ultra_beige_2_pc.jpg', imageMoZoom:'gt9_ultra_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 울트라 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X916NZEIKOO":[  // 1TB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_ultra_beige_1_pc.jpg', imageMo:'gt9_ultra_beige_1_mo_v1.jpg', imageZoom:'gt9_ultra_beige_1_pc.jpg', imageMoZoom:'gt9_ultra_beige_1_mo.jpg', alt:'세로 208.6mm, 가로 326.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_ultra_beige_2_pc.jpg', imageMo:'gt9_ultra_beige_2_mo_v1.jpg', imageZoom:'gt9_ultra_beige_2_pc.jpg', imageMoZoom:'gt9_ultra_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 울트라 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            // 갤럭시 탭S9 Plus 그라파이트 Wifi
            "SM-X810NZAAKOO":[  // 256GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_plus_graphite_1_pc.jpg', imageMo:'gt9_plus_graphite_1_mo_v1.jpg', imageZoom:'gt9_plus_graphite_1_pc.jpg', imageMoZoom:'gt9_plus_graphite_1_mo.jpg', alt:'세로 185.4mm, 가로 285.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_plus_graphite_2_pc.jpg', imageMo:'gt9_plus_graphite_2_mo_v1.jpg', imageZoom:'gt9_plus_graphite_2_pc.jpg', imageMoZoom:'gt9_plus_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 플러스 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X810NZAEKOO":[  // 512GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_plus_graphite_1_pc.jpg', imageMo:'gt9_plus_graphite_1_mo_v1.jpg', imageZoom:'gt9_plus_graphite_1_pc.jpg', imageMoZoom:'gt9_plus_graphite_1_mo.jpg', alt:'세로 185.4mm, 가로 285.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_plus_graphite_2_pc.jpg', imageMo:'gt9_plus_graphite_2_mo_v1.jpg', imageZoom:'gt9_plus_graphite_2_pc.jpg', imageMoZoom:'gt9_plus_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 플러스 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            // 갤럭시 탭S9 Plus 그라파이트 5G
            "SM-X816NZAAKOO":[  // 256GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_plus_graphite_1_pc.jpg', imageMo:'gt9_plus_graphite_1_mo_v1.jpg', imageZoom:'gt9_plus_graphite_1_pc.jpg', imageMoZoom:'gt9_plus_graphite_1_mo.jpg', alt:'세로 185.4mm, 가로 285.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_plus_graphite_2_pc.jpg', imageMo:'gt9_plus_graphite_2_mo_v1.jpg', imageZoom:'gt9_plus_graphite_2_pc.jpg', imageMoZoom:'gt9_plus_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 플러스 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X816NZAEKOO":[  // 512GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_plus_graphite_1_pc.jpg', imageMo:'gt9_plus_graphite_1_mo_v1.jpg', imageZoom:'gt9_plus_graphite_1_pc.jpg', imageMoZoom:'gt9_plus_graphite_1_mo.jpg', alt:'세로 185.4mm, 가로 285.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_plus_graphite_2_pc.jpg', imageMo:'gt9_plus_graphite_2_mo_v1.jpg', imageZoom:'gt9_plus_graphite_2_pc.jpg', imageMoZoom:'gt9_plus_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 플러스 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            // 갤럭시 탭S9 Plus 베이지 Wifi
            "SM-X810NZEAKOO":[  // 256GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_plus_beige_1_pc.jpg', imageMo:'gt9_plus_beige_1_mo_v1.jpg', imageZoom:'gt9_plus_beige_1_pc.jpg', imageMoZoom:'gt9_plus_beige_1_mo.jpg', alt:'세로 185.4mm, 가로 285.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_plus_beige_2_pc.jpg', imageMo:'gt9_plus_beige_2_mo.jpg', imageZoom:'gt9_plus_beige_2_pc.jpg', imageMoZoom:'gt9_plus_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 플러스 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X810NZEEKOO":[  // 512GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_plus_beige_1_pc.jpg', imageMo:'gt9_plus_beige_1_mo_v1.jpg', imageZoom:'gt9_plus_beige_1_pc.jpg', imageMoZoom:'gt9_plus_beige_1_mo.jpg', alt:'세로 185.4mm, 가로 285.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_plus_beige_2_pc.jpg', imageMo:'gt9_plus_beige_2_mo.jpg', imageZoom:'gt9_plus_beige_2_pc.jpg', imageMoZoom:'gt9_plus_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 플러스 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            // 갤럭시 탭S9 Plus 베이지 5G
            "SM-X816NZEAKOO":[  // 256GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_plus_beige_1_pc.jpg', imageMo:'gt9_plus_beige_1_mo_v1.jpg', imageZoom:'gt9_plus_beige_1_pc.jpg', imageMoZoom:'gt9_plus_beige_1_mo.jpg', alt:'세로 185.4mm, 가로 285.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_plus_beige_2_pc.jpg', imageMo:'gt9_plus_beige_2_mo.jpg', imageZoom:'gt9_plus_beige_2_pc.jpg', imageMoZoom:'gt9_plus_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 플러스 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X816NZEEKOO":[  // 512GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_plus_beige_1_pc.jpg', imageMo:'gt9_plus_beige_1_mo_v1.jpg', imageZoom:'gt9_plus_beige_1_pc.jpg', imageMoZoom:'gt9_plus_beige_1_mo.jpg', alt:'세로 185.4mm, 가로 285.4mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_plus_beige_2_pc.jpg', imageMo:'gt9_plus_beige_2_mo.jpg', imageZoom:'gt9_plus_beige_2_pc.jpg', imageMoZoom:'gt9_plus_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 플러스 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            // 갤럭시 탭S9 그라파이트 Wifi
            "SM-X710NZAAKOO":[  // 128GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_s9_graphite_1_pc.jpg', imageMo:'gt9_s9_graphite_1_mo_v1.jpg', imageZoom:'gt9_s9_graphite_1_pc.jpg', imageMoZoom:'gt9_s9_graphite_1_mo.jpg', alt:'세로 165.8mm, 가로 254.3mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_s9_graphite_2_pc.jpg', imageMo:'gt9_s9_graphite_2_mo_v1.jpg', imageZoom:'gt9_s9_graphite_2_pc.jpg', imageMoZoom:'gt9_s9_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X710NZAEKOO":[  // 256GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_s9_graphite_1_pc.jpg', imageMo:'gt9_s9_graphite_1_mo_v1.jpg', imageZoom:'gt9_s9_graphite_1_pc.jpg', imageMoZoom:'gt9_s9_graphite_1_mo.jpg', alt:'세로 165.8mm, 가로 254.3mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_s9_graphite_2_pc.jpg', imageMo:'gt9_s9_graphite_2_mo_v1.jpg', imageZoom:'gt9_s9_graphite_2_pc.jpg', imageMoZoom:'gt9_s9_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            // 갤럭시 탭S9 그라파이트 5G
            "SM-X716NZAAKOO":[  // 128GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_s9_graphite_1_pc.jpg', imageMo:'gt9_s9_graphite_1_mo_v1.jpg', imageZoom:'gt9_s9_graphite_1_pc.jpg', imageMoZoom:'gt9_s9_graphite_1_mo.jpg', alt:'세로 165.8mm, 가로 254.3mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_s9_graphite_2_pc.jpg', imageMo:'gt9_s9_graphite_2_mo_v1.jpg', imageZoom:'gt9_s9_graphite_2_pc.jpg', imageMoZoom:'gt9_s9_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X716NZAEKOO":[  // 256GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_s9_graphite_1_pc.jpg', imageMo:'gt9_s9_graphite_1_mo_v1.jpg', imageZoom:'gt9_s9_graphite_1_pc.jpg', imageMoZoom:'gt9_s9_graphite_1_mo.jpg', alt:'세로 165.8mm, 가로 254.3mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_s9_graphite_2_pc.jpg', imageMo:'gt9_s9_graphite_2_mo_v1.jpg', imageZoom:'gt9_s9_graphite_2_pc.jpg', imageMoZoom:'gt9_s9_graphite_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 제품이 있는'},
                {image:'gt9_pod1_graphite_pc.jpg', imageMo:'gt9_pod1_graphite_mo_v1.jpg', imageZoom:'gt9_pod1_graphite_pc.jpg', imageMoZoom:'gt9_pod1_graphite_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            // 갤럭시 탭S9 베이지 Wifi
            "SM-X710NZEAKOO":[  // 128GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_s9_beige_1_pc.jpg', imageMo:'gt9_s9_beige_1_mo_v1.jpg', imageZoom:'gt9_s9_beige_1_pc.jpg', imageMoZoom:'gt9_s9_beige_1_mo.jpg', alt:'세로 165.8mm, 가로 254.3mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_s9_beige_2_pc.jpg', imageMo:'gt9_s9_beige_2_mo_v1.jpg', imageZoom:'gt9_s9_beige_2_pc.jpg', imageMoZoom:'gt9_s9_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X710NZEEKOO":[  // 256GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_s9_beige_1_pc.jpg', imageMo:'gt9_s9_beige_1_mo_v1.jpg', imageZoom:'gt9_s9_beige_1_pc.jpg', imageMoZoom:'gt9_s9_beige_1_mo.jpg', alt:'세로 165.8mm, 가로 254.3mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_s9_beige_2_pc.jpg', imageMo:'gt9_s9_beige_2_mo_v1.jpg', imageZoom:'gt9_s9_beige_2_pc.jpg', imageMoZoom:'gt9_s9_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            // 갤럭시 탭S9 베이지 5G
            "SM-X716NZEAKOO":[  // 128GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_s9_beige_1_pc.jpg', imageMo:'gt9_s9_beige_1_mo_v1.jpg', imageZoom:'gt9_s9_beige_1_pc.jpg', imageMoZoom:'gt9_s9_beige_1_mo.jpg', alt:'세로 165.8mm, 가로 254.3mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_s9_beige_2_pc.jpg', imageMo:'gt9_s9_beige_2_mo_v1.jpg', imageZoom:'gt9_s9_beige_2_pc.jpg', imageMoZoom:'gt9_s9_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            "SM-X716NZEEKOO":[  // 256GB
                {image:'gt9_main_pc_v1.jpg', imageMo:'gt9_main_mo_v1.jpg', imageZoom:'gt9_main_pc_v1.jpg', imageMoZoom:'gt9_main_mo_v1.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 뒤로는 물이 튀기고 있는'},
                {image:'gt9_s9_beige_1_pc.jpg', imageMo:'gt9_s9_beige_1_mo_v1.jpg', imageZoom:'gt9_s9_beige_1_pc.jpg', imageMoZoom:'gt9_s9_beige_1_mo.jpg', alt:'세로 165.8mm, 가로 254.3mm 크기의 갤럭시 탭S9 울트라 제품이 정면 액정화면이 보이게 있는'},
                {image:'gt9_s9_beige_2_pc.jpg', imageMo:'gt9_s9_beige_2_mo_v1.jpg', imageZoom:'gt9_s9_beige_2_pc.jpg', imageMoZoom:'gt9_s9_beige_2_mo.jpg', alt:'S펜이 제품 상단에 붙어있으며, 그 뒤로는 후면 카메라가 보이는 탭S9 제품이 있는'},
                {image:'gt9_pod1_beige_pc.jpg', imageMo:'gt9_pod1_beige_mo_v1.jpg', imageZoom:'gt9_pod1_beige_pc.jpg', imageMoZoom:'gt9_pod1_beige_mo.jpg', alt:'갤럭시 탭S9 시리즈(울트라, 플러스, 기본) 3종이 정면 액정화면이 보이게 겹쳐져 있으며, 울트라 제품의 화면 크기는 14.6 인치, 플러스 제품의 화면 크기는 12.4 inch, 기본 제품의 화면 크기는 11.0 inch 로 표기되어 있는'},
                {image:'gt9_pod7_pc.jpg', imageMo:'gt9_pod7_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 영어로 적힌 문장들이 나열되어 있고, 화면 중간에 AI 기능으로 2단락으로 문장들이 요약된 팝업이 떠있는 모습'},
                {image:'gt9_pod8_pc.jpg', imageMo:'gt9_pod8_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면에 우주복을 입은 사람이 지구 위에 떠 있고, 맞은 편에 똑같이 생긴 사람 2명이 AI 기능으로 복사되어 있는 모습'},
                {image:'gt9_pod9_pc.jpg', imageMo:'gt9_pod9_mo.jpg', imageZoom:'', imageMoZoom:'', chg: 'O', alt:'태블릿 화면 오른쪽에는 녹음된 음성이 나오고 있고, 왼쪽엔 AI 기능이 음성을 자동 번역 해주고 있는 모습'},
                {image:'gt9_pod2_pc_v1.jpg', imageMo:'gt9_pod2_mo_v1.jpg', imageZoom:'gt9_pod2_pc.jpg', imageMoZoom:'gt9_pod2_mo.jpg', chg: 'O', alt:'S9 전 모델 다이나믹 아몰레드 2X 적용. 갤럭시 탭S9 시리즈 3종이 겹쳐져 있으며, 다이나믹 아몰레드 2X 로고가 있는'},
                {image:'gt9_pod3_pc_v2.jpg', imageMo:'gt9_pod3_mo_v1.jpg', imageZoom:'gt9_pod3_pc.jpg', imageMoZoom:'gt9_pod3_mo.jpg', chg: 'O', alt:'비전 부스터로 햇빛 아래에서도 선명한 화면. 산을 배경으로 갤럭시 탭S9 카메라로 담고 있는 모습'},
                {image:'gt9_pod4_pc_v1.jpg', imageMo:'gt9_pod4_mo_v1.jpg', imageZoom:'gt9_pod4_pc.jpg', imageMoZoom:'gt9_pod4_mo.jpg', chg: 'O', alt:'갤럭시 탭 S 시리즈 최초 IP68등급의 방수 방진 기능 획득. 갤럭시 탭S9 앞면과 뒷면이 겹쳐져 있고 방수를 표현하는 물 튀는'},
            ],
            // "EF-NX912PBEGKR":[  // 프라이버시 스크린 ultra
            //     {image:'gt9_ultra_screen_1_pc.jpg', imageMo:'gt9_ultra_screen_1_mo_v1.jpg', imageZoom:'gt9_ultra_screen_1_pc.jpg', imageMoZoom:'gt9_ultra_screen_1_mo.jpg', alt:'45도 기울어져 있는 프라이버시 스크린이 끼워져있는 파란색 배경화면을 가진 갤럭시 탭 S9 울트라'},
            //     {image:'gt9_ultra_screen_2_pc.jpg', imageMo:'gt9_ultra_screen_2_mo_v1.jpg', imageZoom:'gt9_ultra_screen_2_pc.jpg', imageMoZoom:'gt9_ultra_screen_2_mo.jpg', alt:'프라이버시 스크린이 끼워져있는 파란색 배경화면을 가진 갤럭시 탭 S9 울트라 정면'},
            //     {image:'gt9_ultra_screen_3_pc.jpg', imageMo:'gt9_ultra_screen_3_mo_v1.jpg', imageZoom:'gt9_ultra_screen_3_pc.jpg', imageMoZoom:'gt9_ultra_screen_3_mo.jpg', alt:'프라이버시 스크린이 끼워져있는 갤럭시 탭 S9 울트라 후면'},
            // ],
            // "EF-NX812PBEGKR":[  // 프라이버시 스크린 plus
            //     {image:'gt9_plus_screen_1_pc_v1.jpg', imageMo:'gt9_plus_screen_1_mo_v1.jpg', imageZoom:'gt9_plus_screen_1_pc.jpg', imageMoZoom:'gt9_plus_screen_1_mo.jpg', alt:'45도 기울어져 있는 프라이버시 스크린이 끼워져있는 파란색 배경화면을 가진 갤럭시 탭 S9 플러스'},
            //     {image:'gt9_plus_screen_2_pc.jpg', imageMo:'gt9_plus_screen_2_mo_v1.jpg', imageZoom:'gt9_plus_screen_2_pc.jpg', imageMoZoom:'gt9_plus_screen_2_mo.jpg', alt:'프라이버시 스크린이 끼워져있는 파란색 배경화면을 가진 갤럭시 탭 S9 플러스 정면'},
            //     {image:'gt9_plus_screen_3_pc.jpg', imageMo:'gt9_plus_screen_3_mo_v1.jpg', imageZoom:'gt9_plus_screen_3_pc.jpg', imageMoZoom:'gt9_plus_screen_3_mo.jpg', alt:'프라이버시 스크린이 끼워져있는 갤럭시 탭 S9 플러스 후면'},
            // ],
            // "EF-NX712PBEGKR":[  // 프라이버시 스크린
            //     {image:'gt9_s9_screen_1_pc.jpg', imageMo:'gt9_s9_screen_1_mo_v1.jpg', imageZoom:'gt9_s9_screen_1_pc.jpg', imageMoZoom:'gt9_s9_screen_1_mo.jpg', alt:'45도 기울어져 있는 프라이버시 스크린이 끼워져있는 파란색 배경화면을 가진 갤럭시 탭 S9'},
            //     {image:'gt9_s9_screen_2_pc.jpg', imageMo:'gt9_s9_screen_2_mo_v1.jpg', imageZoom:'gt9_s9_screen_2_pc.jpg', imageMoZoom:'gt9_s9_screen_2_mo.jpg', alt:'프라이버시 스크린이 끼워져있는 파란색 배경화면을 가진 갤럭시 탭 S9 정면'},
            //     {image:'gt9_s9_screen_3_pc.jpg', imageMo:'gt9_s9_screen_3_mo_v1.jpg', imageZoom:'gt9_s9_screen_3_pc.jpg', imageMoZoom:'gt9_s9_screen_3_mo.jpg', alt:'프라이버시 스크린이 끼워져있는 갤럭시 탭 S9 후면'},
            // ],
            // "GP-TOX910SBALK":[  // 세서미 스트리트 엔벨롭 커버 ultra
            //     {image:'gt9_ultra_sesame_1_pc.jpg', imageMo:'gt9_ultra_sesame_1_mo.jpg', imageZoom:'gt9_ultra_sesame_1_pc.jpg', imageMoZoom:'gt9_ultra_sesame_1_mo.jpg', alt:'빨간색, 파란색 세서미 스트리트 이미지가 상하단에 있는 세서미 스트리트 엔벨롭 커버 정면'},
            //     {image:'gt9_ultra_sesame_2_pc.jpg', imageMo:'gt9_ultra_sesame_2_mo.jpg', imageZoom:'gt9_ultra_sesame_2_pc.jpg', imageMoZoom:'gt9_ultra_sesame_2_mo.jpg', alt:'45도 기울어져 있으며, 빨간색, 파란색 세서미 스트리트 이미지가 상하단에 있는 세서미 스트리트 엔벨롭 커버'},
            // ],
            // "GP-TOX810SBALK":[  // 세서미 스트리트 엔벨롭 커버 plus
            //     {image:'gt9_plus_sesame_1_pc.jpg', imageMo:'gt9_plus_sesame_1_mo.jpg', imageZoom:'gt9_plus_sesame_1_pc.jpg', imageMoZoom:'gt9_plus_sesame_1_mo.jpg', alt:'빨간색, 파란색 세서미 스트리트 이미지가 상하단에 있는 세서미 스트리트 엔벨롭 커버 정면'},
            //     {image:'gt9_plus_sesame_2_pc.jpg', imageMo:'gt9_plus_sesame_2_mo.jpg', imageZoom:'gt9_plus_sesame_2_pc.jpg', imageMoZoom:'gt9_plus_sesame_2_mo.jpg', alt:'45도 기울어져 있는 빨간색, 파란색 세서미 스트리트 이미지가 상하단에 있는 세서미 스트리트 엔벨롭 커버'},
            // ],
            // "GP-TOX710SBALK":[  // 세서미 스트리트 엔벨롭 커버
            //     {image:'gt9_s9_sesame_1_pc.jpg', imageMo:'gt9_s9_sesame_1_mo.jpg', imageZoom:'gt9_s9_sesame_1_pc.jpg', imageMoZoom:'gt9_s9_sesame_1_mo.jpg', alt:'빨간색, 파란색 세서미 스트리트 이미지가 상하단에 있는 세서미 스트리트 엔벨롭 커버 정면'},
            //     {image:'gt9_s9_sesame_2_pc.jpg', imageMo:'gt9_s9_sesame_2_mo.jpg', imageZoom:'gt9_s9_sesame_2_pc.jpg', imageMoZoom:'gt9_s9_sesame_2_mo.jpg', alt:'45도 기울어져 있는 빨간색, 파란색 세서미 스트리트 이미지가 상하단에 있는 세서미 스트리트 엔벨롭 커버'},
            // ],
            // "GP-TOX910HIALK":[  // 조구만 스튜디오 엔벨롭 커버 ultra
            //     {image:'gt9_ultra_joguman_1_pc.jpg', imageMo:'gt9_ultra_joguman_1_mo.jpg', imageZoom:'gt9_ultra_joguman_1_pc.jpg', imageMoZoom:'gt9_ultra_joguman_1_mo.jpg', alt:'우유상자 안에 초록색 공룡이 있는 조구만 스튜디오 이미지가 있는 엔벨롭 커버 정면'},
            //     {image:'gt9_ultra_joguman_2_pc.jpg', imageMo:'gt9_ultra_joguman_2_mo.jpg', imageZoom:'gt9_ultra_joguman_2_pc.jpg', imageMoZoom:'gt9_ultra_joguman_2_mo.jpg', alt:'45도 기울어진 우유상자 안에 초록색 공룡이 있는 조구만 스튜디오 이미지가 있는 엔벨롭 커버 옆면'},
            // ],
            // "GP-TOX810HIAUK":[  // 조구만 스튜디오 엔벨롭 커버 plus
            //     {image:'gt9_plus_joguman_1_pc.jpg', imageMo:'gt9_plus_joguman_1_mo_v1.jpg', imageZoom:'gt9_plus_joguman_1_pc.jpg', imageMoZoom:'gt9_plus_joguman_1_mo.jpg', alt:'UBHC 문구가 적혀있는 빨간색 사과와 초록색 공룡이 있는 조구만 엔벨롭 커버 정면'},
            //     {image:'gt9_plus_joguman_2_pc.jpg', imageMo:'gt9_plus_joguman_2_mo_v1.jpg', imageZoom:'gt9_plus_joguman_2_pc.jpg', imageMoZoom:'gt9_plus_joguman_2_mo.jpg', alt:'45도 기울어진 UBHC 문구가 적혀있는 빨간색 사과와 초록색 공룡이 있는 조구만 엔벨롭 커버 옆면'},
            // ],
            // "GP-TOX710HIAGK":[  // 조구만 스튜디오 엔벨롭 커버
            //     {image:'gt9_s9_joguman_1_pc.jpg', imageMo:'gt9_s9_joguman_1_mo.jpg', imageZoom:'gt9_s9_joguman_1_pc.jpg', imageMoZoom:'gt9_s9_joguman_1_mo.jpg', alt:'앉아있는 초록색 공룡과 손에 칼을 들고 있는 초록색 공룡이 있는 조구만 엔벨롭 커버 정면'},
            //     {image:'gt9_s9_joguman_2_pc.jpg', imageMo:'gt9_s9_joguman_2_mo.jpg', imageZoom:'gt9_s9_joguman_2_pc.jpg', imageMoZoom:'gt9_s9_joguman_2_mo.jpg', alt:'45도 기울어진 앉아있는 초록색 공룡과 손에 칼을 들고 있는 초록색 공룡이 있는 조구만 엔벨롭 커버 옆면'},
            // ],
        }
    },
    update(buying, sku, etc) {
        const slide = this;
        const imgSrc = slide.imageData.src;
        const productAll = slide.imageData.product;
        let arrImg = [];

        slide.wrapper= buying.el

        Object.keys(productAll).forEach(function(item){
            if(item === sku){
                arrImg = productAll[item];
            }
        });

        // Object.keys(productAll).forEach(function(item){
        //     if(item === skuA){
        //         arrImgA = productAll[skuA];
        //     }
        //     if(item == skuB){
        //         arrImgB = productAll[skuB];
        //     }
        //     arrImg = arrImgA.concat(arrImgB);
        // });

        if(!arrImg.length) arrImg = slide.imageData.product.etc;

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

                if(!!isOnce && idx == 0) return;

                let blindTxt = ''

                if (!!this.blind) {
                    const blind = [... this.blind];

                    blindTxt += '<div class="blind">';

                    blind.forEach(function(item) {
                        blindTxt += `<p>${item}</p>`;
                    });

                    blindTxt += '</div>';
                }

                arrMainList.push(`<li class="swiper-slide ${this.chg === 'O' ? 'pt_white' : ''}">
                                    <div class="img_box">
                                    <img src="${imgSrc}${this.image}" alt="${this.alt}" class="m_hide" loading="lazy" />
                                    <img src="${imgSrc}${this.imageMo}" alt="${this.alt}" class="m_show" loading="lazy" />
                                    </div>
                                    ${!!this.blind? blindTxt : ''}
                                </li>`);
            });

            $mainSwiper.removeAllSlides();
            $mainSwiper.appendSlide(arrMainList);
            $mainSwiper.update();
            $mainSwiper.slideToLoop(0, 0);

            // const realKey = buying.state.realKey;
            // if(!isOnce || realKey === 'optA_1' || realKey === 'optA_2' || realKey === 'optA_3'){
            //     $mainSwiper.slideToLoop(0, 0);
            // } else if(realKey === 'optE_2' || realKey === 'optE_3' || realKey === 'optE_4' || realKey === 'optE_5' || realKey === 'optE_6'){
            //     $mainSwiper.slideToLoop(8, 0);
            // } else {
            //     $mainSwiper.slideToLoop(0, 0);
            // }

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
            autoplay: {
                enabled: false,
                delay: 3000,
                disableOnInteraction: false,
            },
            slidesPerView: 'auto',
            loop: true,
            pagination: {
                el: '[data-buying-pagination]',
                clickable: true,
                bulletElement: 'button'
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
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

                    if($activeSlide.hasClass('pt_white')){
                        $('.swiper-button-prev, .swiper-button-next').addClass('pt_white');
                        $('.pt_prd-slide__control').addClass('pt_white');
                    } else {
                        $('.swiper-button-prev, .swiper-button-next').removeClass('pt_white');
                        $('.pt_prd-slide__control').removeClass('pt_white');
                    }
                }
            }

        });
    }
}


const buyingUtil = {
    btnBuy() {
        $secWrap.off('click.btnBuy').on('click.btnBuy', '[data-role="btnBuy"]', function(e) {
            // e.preventDefault();

            // let $btn = $(this);
            // const gCodeA = $btn.attr('data-gcodea').trim();
            // const gCodeB = $btn.attr('data-gcodeb').trim();
            // let params = [];
            // if(gCodeB === '-' || !gCodeB || gCodeB.length < 3){
            //     if(!!$btn.attr('data-is-pickup')){
            //         params = [{
            //             goodsId: gCodeA,
            //             qty: 1,
            //             pckStrNo: $('#plazaNo-'+$btn.attr('data-gcodea')).text(),
            //             pickupCapaDate: $('#pickupCapaDate-'+$btn.attr('data-gcodea')).text(),
            //             pickupCapaTime: $('#pickupCapaTime-'+$btn.attr('data-gcodea')).text(),
            //             tradeIn: $btn.attr('data-tradeIn') ? $btn.attr('data-tradeIn') : 'N',
            //             galaxyClub: $btn.attr('data-galaxyClub') ? $btn.attr('data-galaxyClub') : 'N',
            //             galaxyClubTpCd: $btn.attr('data-galaxyCd') ? $btn.attr('data-galaxyCd') : null
            //         }];
            //     } else {
            //         params = [{
            //             goodsId: gCodeA,
            //             qty: 1,
            //             tradeIn: $btn.attr('data-tradeIn') ? $btn.attr('data-tradeIn') : 'N',
            //             galaxyClub: $btn.attr('data-galaxyClub') ? $btn.attr('data-galaxyClub') : 'N',
            //             galaxyClubTpCd: $btn.attr('data-galaxyCd') ? $btn.attr('data-galaxyCd') : null
            //         }];
            //     }
            // } else {
            //     if(!!$btn.attr('data-is-pickup')){
            //         params = [
            //             {
            //                 goodsId: gCodeA,
            //                 qty: 1,
            //                 pckStrNo: $('#plazaNo-'+$btn.attr('data-gcodea')).text(),
            //                 pickupCapaDate: $('#pickupCapaDate-'+$btn.attr('data-gcodea')).text(),
            //                 pickupCapaTime: $('#pickupCapaTime-'+$btn.attr('data-gcodea')).text(),
            //                 tradeIn: $btn.attr('data-tradeIn') ? $btn.attr('data-tradeIn') : 'N',
            //                 galaxyClub: $btn.attr('data-galaxyClub') ? $btn.attr('data-galaxyClub') : 'N',
            //                 galaxyClubTpCd: $btn.attr('data-galaxyCd') ? $btn.attr('data-galaxyCd') : null
            //             },
            //             {
            //                 goodsId: gCodeB,
            //                 qty: 1,
            //                 pckStrNo: $('#plazaNo-'+$btn.attr('data-gcodea')).text(),
            //                 pickupCapaDate: $('#pickupCapaDate-'+$btn.attr('data-gcodea')).text(),
            //                 pickupCapaTime: $('#pickupCapaTime-'+$btn.attr('data-gcodea')).text()
            //             }
            //         ];
            //     } else {
            //         params = [
            //             {
            //                 goodsId: gCodeA,
            //                 qty: 1,
            //                 tradeIn: $btn.attr('data-tradeIn') ? $btn.attr('data-tradeIn') : 'N',
            //                 galaxyClub: $btn.attr('data-galaxyClub') ? $btn.attr('data-galaxyClub') : 'N',
            //                 galaxyClubTpCd: $btn.attr('data-galaxyCd') ? $btn.attr('data-galaxyCd') : null
            //             },
            //             {
            //                 goodsId: gCodeB,
            //                 qty: 1,
            //             }
            //         ];
            //     }
            // }
            // if (window.fnBuyDirectByMultiId) {
            //     //NetFunnel_Action({action_id:'b2c_checkout'}, function(ev,ret){
            //         fnBuyDirectByMultiId(params);
            //     //});
            // }
            e.preventDefault();
            let $btn = $(this);
            const params = {
                goodsId: $btn.attr('data-gcode'),
                qty: 1,
            }

            if(!!$btn.attr('data-is-pickup')){
                const pckStrNo = $('#plazaNo-'+$btn.attr('data-gcode')).text();
                if(pckStrNo){
                    params.pckStrNo = pckStrNo;
                    params.pickupCapaDate = $('#pickupCapaDate-'+$btn.attr('data-gcode')).text();
                    params.pickupCapaTime = $('#pickupCapaTime-'+$btn.attr('data-gcode')).text();
                }
            }

            if(!!$btn.attr('data-tradeIn')){
                params.tradeIn = $btn.attr('data-tradeIn') ? $btn.attr('data-tradeIn') : 'N';
            }

            if(!!$btn.attr('data-galaxyCd')){
                params.galaxyClub = $btn.attr('data-galaxyClub') ? $btn.attr('data-galaxyClub') : 'N';
                params.galaxyClubTpCd = $btn.attr('data-galaxyCd') ? $btn.attr('data-galaxyCd') : null;
            }
            // console.info(params);
            if (params.goodsId && window.fnBuyDirectByMultiId) {
                // NetFunnel_Action({action_id:'b2b2c_checkout'}, function(ev,ret){
                    fnBuyDirectByMultiId([params]);
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
                // NetFunnel_Action({action_id:'b2b2c_checkout'}, function(ev,ret){
                    fnCartDirectByMultiId([params], "confirm");
                // });
            }
            // e.preventDefault();
            // let $btn = $(this);
            // const gCodeA = $btn.attr('data-gcodea');
            // const gCodeB = $btn.attr('data-gcodeb');
            // const dComp = $btn.attr('data-comp');

            // if(gCodeB === "-" || !gCodeB || gCodeB.length < 3){
            //     if (window.fnCartDirectByMultiId) {
            //         fnCartDirectByMultiId([{
            //             goodsId: gCodeA,
            //             qty: 1,
            //             compNo: dComp,
            //             tradeIn: $btn.attr('data-tradeIn') ? $btn.attr('data-tradeIn') : 'N'
            //         }], "confirm");
            //     }
            // }else{
            //     if (window.fnCartDirectByMultiId) {
            //         fnCartDirectByMultiId([{
            //             goodsId: gCodeA,
            //             qty: 1,
            //             compNo: dComp,
            //             tradeIn: $btn.attr('data-tradeIn') ? $btn.attr('data-tradeIn') : 'N'
            //         },
            //         {
            //             goodsId: gCodeB,
            //             qty: 1,
            //         }], "confirm");
            //     }
            // }
        });
    },
    soldoutEvt(saleStatCd){
        const tradeInValue = $secWrap.find('[data-opt-etc="tradeIn"] input:checked').val();
        const galaxyClubValue = $secWrap.find('[data-opt-etc="galaxyClub"] input:checked').val();

        const btnDisabled = PT_STATE.service.getBtnDisabled({
            tradeIn: tradeInValue ? tradeInValue : 'N',
            galaxyClub: galaxyClubValue ? galaxyClubValue : 'N',
            soldout: Number(saleStatCd) === 12 ? 'N' : 'Y'
        });

        const $btnBuy = $secWrap.find('[data-role="btnBuy"]');
        const isPickup = $btnBuy.attr('data-is-pickup');

        if(isPickup==="true"){
            $btnBuy.removeClass('pt_btn--disabled');
            $btnBuy.html('구매하기');
            $btnBuy.removeAttr('tabindex');
        } else {
            if(btnDisabled.buy){
                $btnBuy.addClass('pt_btn--disabled');
                $btnBuy.text('일시품절')
                $btnBuy.attr('tabindex', -1);

            } else {
                $btnBuy.removeClass('pt_btn--disabled');
                $btnBuy.html('구매하기');
                $btnBuy.removeAttr('tabindex');
            }
        }

        const $btnCart = $secWrap.find('[data-role="btnCart"]');
        if(btnDisabled.cart){
            $btnCart.addClass('pt_btn--disabled');
        } else {
            if(isPickup!=="true") {
                $btnCart.removeClass('pt_btn--disabled');
            }
        }

        const $btnPickup = $secWrap.find('[data-role="btnPickup"]');
        if(btnDisabled.pickup){
            $btnPickup.addClass('pt_btn--disabled');
        } else {
            $btnPickup.removeClass('pt_btn--disabled');
        }
    },
    btnZoom() {
        let arrImage = {};

        function setData(imageData){
            const src = imageData.src_zoom;
            const product = imageData.product;
            const alt = imageData.alt;
            Object.keys(product).forEach( (sku) => {
                if (!arrImage[sku]) arrImage[sku] = [];
                product[sku].forEach( (item) => {
                    // if (!_.isMobile()) {
                    //     arrImage[sku].push( { src: src + item.imageZoom, width: _.pxToVw(810), height: _.pxToVw(690), alt: item.alt } );
                    // } else {
                    //     arrImage[sku].push( { src: src + item.imageMoZoom, width: _.pxToVw(720), height: _.pxToVw(606), alt: item.alt } );
                    // }

                    if (!_.isMobile()) {
                        arrImage[sku].push( { src: src + item.imageZoom, width: 800, height: 690, alt: item.alt } );
                    } else {
                        arrImage[sku].push( { src: src + item.imageMoZoom, width: 720, height: 606, alt: item.alt } );
                    }
                });
            });
        }

        function open(wrapper, sku) {
            let arrImgData = arrImage[sku];

            if(isOnceZoom){
                arrImgData = arrImage[sku].slice(1);
            }

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
                // doubleTapAction: () => {
                //     console.log('doubleTapAction');
                // }
                // imageClickAction: 'zoom',
                // imageClickAction: (releasePoint, e) => {
                //     console.log('imageClickAction');
                //     console.log(releasePoint);
                //     console.log(e);
                // },
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
                    },
                });
            });
            // lightbox.on('contentResize', ({ content, width, height }) => {
            //     console.log('contentResize');
            // });

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
    btnPickup() {
        $secWrap.off('click.btnPickup').on('click.btnPickup', '[data-role="btnPickup"]', function(e) {
            e.preventDefault();
            let $btn = $(this);
            const params = {
                goodsId: $btn.attr('data-gcode'),
                mdlCode: $btn.attr('data-sku'),
                isEvent: "Y"
            }
            
            if (params.goodsId && window.fnOpenPickUpStorePop) {
                //NetFunnel_Action({action_id:'pickup_popup'}, function(ev,ret){
                    fnOpenPickUpStorePop(params);
                //});
            }

            $secWrap.find('[data-pickup-plazaNm]').attr('id', 'plazaNm-' + params.goodsId);
            $secWrap.find('[data-pickup-plazaNo]').attr('id', 'plazaNo-' + params.goodsId);
            $secWrap.find('[data-pickup-storeAddr]').attr('id', 'storeAddr-' + params.goodsId);
            $secWrap.find('[data-pickup-capaDate]').attr('id', 'pickupCapaDate-' + params.goodsId);
            $secWrap.find('[data-pickup-capaTime]').attr('id', 'pickupCapaTime-' + params.goodsId);
            // e.preventDefault();
            // let $btn = $(this);
            // const params = {
            //     goodsId: $btn.attr('data-gcodea'),
            //     mdlCode: $btn.attr('data-sku'),
            //     isEvent: "Y"
            // }
            // if($btn.attr('data-gcodeb') && $btn.attr('data-gcodeb').trim() !== '-'){
            //     params.optGoodsId = $btn.attr('data-gcodeb');
            //     params.optMdlCode = $btn.attr('data-optSku');
            // }
            // if (params.goodsId && window.fnOpenPickUpStorePop) {
            //     //NetFunnel_Action({action_id:'pickup_popup'}, function(ev,ret){
            //         fnOpenPickUpStorePop(params);
            //     //});
            // }

            // $secWrap.find('[data-pickup-plazaNm]').attr('id', 'plazaNm-' + params.goodsId);
            // $secWrap.find('[data-pickup-plazaNo]').attr('id', 'plazaNo-' + params.goodsId);
            // $secWrap.find('[data-pickup-storeAddr]').attr('id', 'storeAddr-' + params.goodsId);
            // $secWrap.find('[data-pickup-capaDate]').attr('id', 'pickupCapaDate-' + params.goodsId);
            // $secWrap.find('[data-pickup-capaTime]').attr('id', 'pickupCapaTime-' + params.goodsId);
        });
    },
    updateBtn($el, selected, selectOptEtc, omni) {
        if(!selected) return;

        const $sticky = $secWrap.find('.pt_sticky');

        // 구매하기 버튼
        const $btnBuy = $secWrap.find('[data-role=btnBuy]');
        if(!!$btnBuy.length && selected.gCode){
            $btnBuy.attr('data-gcode', selected.gCode);
            // $btnBuy.attr('data-comp', selected.deptCd ? selected.deptCd : 313);
            
            $btnBuy.attr('data-tradeIn', selectOptEtc.tradeIn ? selectOptEtc.tradeIn : 'N');
            $btnBuy.attr('data-galaxyClub', selectOptEtc.galaxyClub ? selectOptEtc.galaxyClub : 'N');
            $btnBuy.attr('data-galaxyCd', selected.galaxyClubCode ? selected.galaxyClubCode : 'CLBT03');
            $btnBuy.each(function(){
                if ($(this).closest('.pt_prd-btn').hasClass('pt_prd-btn--under')) {
                    if(!!omni) $(this).attr('data-omni', `${omni.buy_under}${selected.sku}`);
                } else {
                    if(!!omni) $(this).attr('data-omni', `${omni.buy}${selected.sku}`);
                }
            })
        }
        // if(!!$btnBuy.length && (selected.gCodeA || selected.gCodeB)){
        //     $btnBuy.attr('data-gcodeA', selected.gCodeA);
        //     $btnBuy.attr('data-gcodeB', selected.gCodeB);
        //     $btnBuy.attr('data-case', selected.gCodeB === '-' ? 'none' : 'product');
        //     // $btnBuy.attr('data-comp', selected.deptCd ? selected.deptCd : 313);
            
        //     $btnBuy.attr('data-tradeIn', selectOptEtc.tradeIn ? selectOptEtc.tradeIn : 'N');
        //     $btnBuy.attr('data-galaxyClub', selectOptEtc.galaxyClub ? selectOptEtc.galaxyClub : 'N');
        //     $btnBuy.attr('data-galaxyCd', selected.galaxyClubCode ? selected.galaxyClubCode : 'CLBT03');
        //     $btnBuy.each(function(){
        //         if ($(this).closest('.pt_prd-btn').hasClass('pt_prd-btn--under')) {
        //             if(!!omni) $(this).attr('data-omni', `${omni.buy_under}${selected.skuA}${selected.skuB === '-' ? '' : `_${selected.skuB}`}`);
        //         } else {
        //             if(!!omni) $(this).attr('data-omni', `${omni.buy}${selected.skuA}${selected.skuB === '-' ? '' : `_${selected.skuB}`}`);
        //         }
        //     })
        // }
        // 선물하기 버튼
        const $btnPresent = $secWrap.find('[data-role=btnPresent]');
        if(!!$btnPresent.length && selected.sku) {
            $btnPresent.attr('data-sku', selected.sku);
            // $btnPresent.attr('data-comp', selected.deptCd ? selected.deptCd : 313);
            $btnPresent.each(function(){
                if ($(this).closest('.pt_prd-btn').hasClass('pt_prd-btn--under')) {
                    if(!!omni) $(this).attr('data-omni', `${omni.present_under}${selected.sku}`);
                } else {
                    if(!!omni) $(this).attr('data-omni', `${omni.present}${selected.sku}`);
                }
                // if ($(this).closest('.pt_prd-btn').hasClass('pt_prd-btn--under')) {
                //     if(!!omni) $(this).attr('data-omni', `${omni.present_under}${selected.skuA}${selected.skuB === '-' ? '' : `_${selected.skuB}`}`);
                // } else {
                //     if(!!omni) $(this).attr('data-omni', `${omni.present}${selected.skuA}${selected.skuB === '-' ? '' : `_${selected.skuB}`}`);
                // }
            })
        }
        // 장바구니 버튼
        const $btnCart = $secWrap.find('[data-role="btnCart"]');
        if(!!$btnCart.length && selected.sku) {
            $btnCart.attr('data-gcode', selected.gCode);
            $btnCart.attr('data-comp', selected.deptCd ? selected.deptCd : 313);
            $btnCart.attr('data-tradeIn', selectOptEtc.tradeIn ? selectOptEtc.tradeIn : 'N');
            $btnCart.each(function(){
                if ($(this).closest('.pt_prd-btn').hasClass('pt_prd-btn--under')) {
                    if(!!omni) $(this).attr('data-omni', `${omni.cart_under}${selected.sku}`);
                } else {
                    if(!!omni) $(this).attr('data-omni', `${omni.cart}${selected.sku}`);
                }
            })
        }
        // const $btnCart = $secWrap.find('[data-role="btnCart"]');
        // if(!!$btnCart.length && selected.skuA) {
        //     $btnCart.attr('data-gcodeA', selected.gCodeA);
        //     $btnCart.attr('data-gcodeB', selected.gCodeB);
        //     $btnCart.attr('data-comp', selected.deptCd ? selected.deptCd : 313);
        //     $btnCart.attr('data-tradeIn', selectOptEtc.tradeIn ? selectOptEtc.tradeIn : 'N');
        //     $btnCart.each(function(){
        //         if ($(this).closest('.pt_prd-btn').hasClass('pt_prd-btn--under')) {
        //             if(!!omni) $(this).attr('data-omni', `${omni.cart_under}${selected.skuA}${selected.skuB === '-' ? '' : `_${selected.skuB}`}`);
        //         } else {
        //             if(!!omni) $(this).attr('data-omni', `${omni.cart}${selected.skuA}${selected.skuB === '-' ? '' : `_${selected.skuB}`}`);
        //         }
        //     })
        // }
        // 매장픽업 버튼
        const $btnPickup =  $secWrap.find('[data-role=btnPickup]');
        if(!!$btnPickup.length && selected.gCode) {
            $btnPickup.attr('data-gcode', selected.gCode);
            $btnPickup.attr('data-gname', selected.pdNmApi);
            $btnPickup.attr('data-sku', selected.sku);
            $btnPickup.each(function(){
                if ($(this).closest('.pt_prd-btn').hasClass('pt_prd-btn--under')) {
                    if(!!omni) $(this).attr('data-omni', `${omni.pickup_under}${selected.sku}`);
                } else {
                    if(!!omni) $(this).attr('data-omni', `${omni.pickup}${selected.sku}`);
                }
            })
        }
        // const $btnPickup =  $secWrap.find('[data-role=btnPickup]');
        // if(!!$btnPickup.length && selected.gCodeA) {
        //     $btnPickup.attr('data-gcodeA', selected.gCodeA);
        //     $btnPickup.attr('data-sku', selected.skuA);
        //     $btnPickup.attr('data-gcodeB', selected.gCodeB);
        //     $btnPickup.attr('data-optSku', selected.skuB);
        //     $btnPickup.each(function(){
        //         if ($(this).closest('.pt_prd-btn').hasClass('pt_prd-btn--under')) {
        //             if(!!omni) $(this).attr('data-omni', `${omni.pickup_under}${selected.skuA}${selected.skuB === '-' ? '' : `_${selected.skuB}`}`);
        //         } else {
        //             if(!!omni) $(this).attr('data-omni', `${omni.pickup}${selected.skuA}${selected.skuB === '-' ? '' : `_${selected.skuB}`}`);
        //         }
        //     })
        // }

        // 확대하기 버튼
        const $btnZoom = $el.find('[data-role=btnZoom]');
        if(!!$btnZoom.length && selected.sku) {
            $btnZoom.attr('data-sku', selected.sku);
        }
        // 더 알아보기 버튼
        const $btnPdUrl = $secWrap.find('[data-role="btnPdUrl"]');
        if (!!$btnPdUrl.length && selected.pdUrl) {
            $btnPdUrl.attr('href', selected.pdUrl);
            if(!!omni) $btnPdUrl.attr('data-omni', `${omni.pdUrl}${selected.sku}`);
            $btnPdUrl.attr('title', `${selected.sku} PD 페이지로 이동`);
        }
        // const $btnZoom = $secWrap.find('[data-role=btnZoom]');
        // if(!!$btnZoom.length && selected.skuA) {
        //     $btnZoom.attr('data-sku', selected.skuA);
        // }
        // // 더 알아보기 버튼
        // const $btnPdUrl = $secWrap.find('[data-role="btnPdUrl"]');
        // if (!!$btnPdUrl.length && selected.pdUrl) {
        //     $btnPdUrl.attr('href', selected.pdUrl);
        //     if(!!omni) $btnPdUrl.attr('data-omni', `${omni.pdUrl}${selected.skuA}`);
        //     $btnPdUrl.attr('title', `${selected.skuA} PD 페이지로 이동`);
        // }

        // 쿠폰 다운로드 버튼
        // const $btnCoupon =  $secWrap.find('[data-role=btnCouponPromo]');
        // $btnCoupon.each(function(){
        //     if(!!$btnCoupon.length && selected.bnfD_cpNum && selected.bnfE_cpNum) {
        //         if($(this).data('btntype') === "btnCpnPrd") {
        //             $(this).attr('data-cpnum', selected.bnfD_cpNum ? selected.bnfD_cpNum.trim() : '');
        //         } else if($(this).data('btntype') === "btnCpnApp") {
        //             $(this).attr('data-cpnum', selected.bnfE_cpNum ? selected.bnfE_cpNum.trim() : '');
        //         } else if($(this).data('btntype') === "btnCpnAll") {
        //             $(this).attr('data-cpnum', 
        //             selected.bnfD_cpNum !== '-' && selected.bnfE_cpNum === '-' ? selected.bnfD_cpNum.trim() : 
        //             selected.bnfD_cpNum === '-' && selected.bnfE_cpNum !== '-' ? selected.bnfE_cpNum.trim() : 
        //             selected.bnfD_cpNum !== '-' && selected.bnfE_cpNum !== '-' ? 
        //             selected.bnfD_cpNum.trim() +','+ selected.bnfE_cpNum.trim() : '');
        //         } else {
        //             let cpnNum = `33157, 33158, 33159, 33160, 31351, 31352, 31353, 31354, 31355, 31356, 31357, 31358, 31359, 31360, 31361, 31362, 31363, 31364, 31365, 31366, 33320, 33321, 31369, 31370, 31371, 31372, 31373, 31374`;
        //             $(this).attr('data-cpnum', cpnNum);
        //         }

        //         selected.bnfD_cpNum === '-' && selected.bnfE_cpNum === '-' ? $secWrap.find('[data-btntype="btnCpnAll"]').addClass('pt_hide') : $secWrap.find('[data-btntype="btnCpnAll"]').removeClass('pt_hide');

        //         if(!!omni) {
        //             $sticky.find('[data-btntype=btnCpnAll]').attr('data-omni', `${omni.cpn}${selected.skuA}`);
        //             $sticky.find('[data-btntype=btnCpnPrd]').attr('data-omni', `${omni.pdCpn}${selected.skuA}`);
        //             $sticky.find('[data-btntype=btnCpnApp]').attr('data-omni', `${omni.appCpn}${selected.skuA}`);
        //             $el.find('[data-role=btnCouponPromo]').attr('data-omni', `${omni.cpn_under}${selected.skuA}`);
        //         }
        //         // $btnCoupon.show();
        //     } else {
        //         $btnCoupon.hide();
        //     }
        // })
    },
    pickupEvt(){
        const $btnBuy = $secWrap.find('[data-role=btnBuy]');
        const $cart = $secWrap.find('[data-role="btnCart"]');
        
        // add
        $secWrap.find('[data-pickup-plazaNo]').on('DOMSubtreeModified', function() {
            try{
                if(!!$('[data-pickup-plazaNo]').text()){
                    $secWrap.find('[data-role="pickupItem"]').slideDown();

                    // 구매하기 버튼
                    $btnBuy.attr('data-is-pickup', true);
                    $btnBuy.show().removeClass('pt_btn--disabled');
                    $btnBuy.html('구매하기');
                    $btnBuy.removeAttr('tabindex');

                    // 장바구니 버튼
                    $cart.addClass('pt_btn--disabled');
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
            const gCode = $btnBuy.attr('data-gcode');
            $secWrap.find('[data-pickup-plazaNo]').text('');
            $secWrap.find('[data-pickup-storeAddr]').text('');
            $secWrap.find('[data-pickup-capaDate]').text('');
            $secWrap.find('[data-pickup-capaTime]').text('');
            $secWrap.find('[data-role="pickupDate"]').text('');
            $secWrap.find('[data-role="pickupTime"]').text('');
            $secWrap.find('[data-role="pickupItem"]').slideUp();
            $btnBuy.attr('data-is-pickup', false);
            callApi.soldoutCheck(gCode);
        });
        // $secWrap.on('click', '[data-pickup-close]', function() {
        //     const gCodeA = $btnBuy.attr('data-gcodeA');
        //     const gCodeB = $btnBuy.attr('data-gcodeB');
        //     $secWrap.find('[data-pickup-plazaNo]').text('');
        //     $secWrap.find('[data-pickup-storeAddr]').text('');
        //     $secWrap.find('[data-pickup-capaDate]').text('');
        //     $secWrap.find('[data-pickup-capaTime]').text('');
        //     $secWrap.find('[data-role="pickupDate"]').text('');
        //     $secWrap.find('[data-role="pickupTime"]').text('');
        //     $secWrap.find('[data-role="pickupItem"]').slideUp();
        //     $btnBuy.attr('data-is-pickup', false);
        //     const _gCode = [];
        //     if(!!gCodeA && gCodeA !== '-'){
        //         _gCode.push(gCodeA)
        //     }
        //     if(!!gCodeB && gCodeB !== '-'){
        //         _gCode.push(gCodeB)
        //     }
        //     callApi.soldoutCheck(_gCode);
        // });
    },
    setColorLabel(buying){
        const selected = buying.state.selected;
        const colorList = buying.params.pdList.filter( (item) => item.optCdA === selected.optCdA && item.optCdB === selected.optCdB && item.optCdC === selected.optCdC);
        colorList.forEach(function(item){
            const $colorLabel = buying.$el.find(`#${item.optCdD}`).closest('.pt_option__item').find('[data-buying-label]');
            if(item.tagA.trim().toUpperCase() === 'O'){
                $colorLabel.show();
            } else {
                $colorLabel.hide();
            }
        });
    },
    init() {
        this.btnZoom();
        this.pickupEvt();
    },
}

function openPopup(_self) {
    callApi.checkGalaxyClub(function() {
        const $this = $(_self);
        const $target = $($this.attr('data-target'));
        const checkId = $this.attr('data-check-target');
        const $closeModal = $target.find('[data-check-id="' + checkId + '"]');
        const $lastBtn = $target.find('[data-check-id="' + checkId + '"]:last-child');
        const dimm_id = `dimm_${new Date().getTime()}`;

        // 팝업 열릴때 스크롤 방지
        $('body').css("overflow", "hidden");
        $('body').css("width", "100%");

        //딤드 처리
        $('body').append(`<div id="${dimm_id}" class="dimm"></div>`);
        $(`#${dimm_id}`).css('z-index', + $target.css('z-index') - 1).fadeIn();
        $closeModal.attr('data-dimm', `#${dimm_id}`);

        $target.show().attr('aria-hidden', false).trigger('focus');

        $target.on('keydown', function (e) {
            if ($target.is(':focus') && e.shiftKey && e.keyCode == 9) {
                e.preventDefault();
                $lastBtn.trigger('focus');
            }
        });

        $lastBtn.on('keydown', function (e) {
            if (!e.shiftKey && e.keyCode == 9) {
                e.preventDefault();
                $target.trigger('focus');
            }
        });

        // 모달 닫기
        $closeModal.one('click', function (e) {
            e.preventDefault();
            const $this = $(this);
            const $clubBtn = $($this.attr('data-target'));
            const dimm_id = $this.attr('data-dimm');

            // 팝업 닫힐때 스크롤 방지 해제
            $('body').css("overflow", "");
            $('body').css("width", "");

            $(dimm_id).fadeOut(function () {
                $(this).remove();
            });
            $target.hide().attr('aria-hidden', true);
            $clubBtn.trigger('click');
            $clubBtn.trigger('focus');
        });
    });
}

function isClubCheck() {
    $('.sec_project_wrap').on('change', '[data-check-target]', function(e){
        e.preventDefault();
        openPopup(this);
    })
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

$(document).ready(function(){
    // 갤캠스 Only 태그 적용 호출
    //바잉툴 실행전 비로그인 체크
    const $loginTag = $secWrap.find('[data-login-tag]');

    PT_STATE.service.checkLogin(function(isLogin){
        if(!isLogin){
            // 비로그인 상태
            $loginTag.html(`<div class="pt_tag__price">
                                <a href="https://www.samsungebiz.com/event/galaxycampus/member/introPage/" title="갤캠스 로그인 페이지로 이동">
                                    <img src="//images.samsung.com/kdp/event/galaxycampus/2024/0119_s24/launching/buying/erk_tag_only.png" class="m_hide" alt="갤캠스 Only">
                                    <img src="https://images.samsung.com/kdp/event/galaxycampus/2024/tag_gcs_only_mo_v1.png" class="m_show" alt="갤캠스 Only">
                                </a>
                            </div>`);
        } else {
            // 로그인 상태
        }

        loadBuying();

    });

    function loadBuying(){
        // 기존 사용하던 로직을 해당 함수안으로 이동함 : 로그인 체크 후 바잉툴 로직 실행
        // if (!isLocal) callApi.loginCheck();
        buying();
        buyingStickyEvt.init();
        buyingUtil.init();
        isClubCheck();
        isOnce = true;
        isOnceZoom = true;
        checkUserAgent();
    }
});

// 갤캠스 Only 태그 비적용 호출
// $(document).ready(function(){
//     buying();
//     buyingStickyEvt.init();
//     buyingUtil.init();
//     isClubCheck();
//     isOnce = true;
//     isOnceZoom = true;
//     checkUserAgent();
// });

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