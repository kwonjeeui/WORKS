/**
 * api 호출시 공통적으로 발생하는 처리들을 정리함
 * version : 0.0.1
 * update : 2023-12-21
 */
export const service = (function(){
    'use strict';

    let config = {
        debugMode: false,

        /* 아래 옵션 수정 금지 */
        isLocal: false,
        apiUrl: '/sec/',
        isSamsung: document.domain.includes("samsung.com"),
        isSamsungebiz: document.domain.includes("samsungebiz.com"),
    }

    config.isLocal = !(config.isSamsung || config.isSamsungebiz);

    if(config.isSamsungebiz){
        config.apiUrl = '/event/galaxycampus/';
    }

    function start(funcName, start){
        if(!service.performance[funcName]){
            service.performance[funcName] = {
                start: 0,
                end: 0,
                _cycle: 0,
                _performance: []
            }
        }
        service.performance[funcName].start = start;
    }

    function end(funcName, end){
        service.performance[funcName].end = end;
        service.performance[funcName]._cycle += 1;
        service.performance[funcName]._performance.push(`${(end - service.performance[funcName].start).toFixed(1)}ms`);
    }

    function checkPerformance(funcName, callBack) {
        try {
            if(config.debugMode) start(funcName, performance.now());

            if(callBack) {
                callBack();
            } else {
                console.warn('콜백 함수가 지정되지 않았습니다.');
            }

            if(config.debugMode) end(funcName, performance.now());
        } catch (e) {}
    }

    const $secWrap = $('.sec_project_wrap');

    const service = {
        /*
         * ex) netFunnel = {
         *   buy: 'b2c_promotion',     // string
         *   cart: 'b2c_promotion',    // string
         *   present: 'b2c_promotion', // string
         *   pickup: 'b2c_promotion'   // string
         * }
         */
        initBtnAll(netFunnel) {
            const render = function(){
                service.initBuy(null,(netFunnel && netFunnel.buy) ? netFunnel.buy : null);
                service.initCart(null, (netFunnel && netFunnel.cart) ? netFunnel.cart : null);
                service.initPresent(null, (netFunnel && netFunnel.present) ? netFunnel.present : null);
                service.initPickup(null, (netFunnel && netFunnel.pickup) ? netFunnel.pickup : null);
            }

            checkPerformance('initBtnAll', render);
        },
        initBuy(target, netFunnelId){
            const render = function(){
                if(!target) target='[data-role="btnBuy"]';
                if(!$(target).length) return;

                $secWrap.off(`click.pt_${target}`).on(`click.pt_${target}`, target, function (e) {
                    e.preventDefault();
                    try {
                        const _self = this;
                        const bindRender = function(){
                            const $btnBuy = $(_self);
                            let params = {
                                goodsId: $btnBuy.attr('data-gcode'),
                                qty: 1
                            }

                            params.tradeIn = $btnBuy.attr('data-tradeIn') ? $btnBuy.attr('data-tradeIn') : 'N';
                            params.galaxyTrial = $btnBuy.attr('data-trial') ? $btnBuy.attr('data-trial') : 'N';

                            // 매장픽업
                            const pckStrNo = $('#plazaNo-'+$btnBuy.attr('data-gcode')).text();
                            if(pckStrNo){
                                params.pckStrNo = pckStrNo;
                                params.pickupCapaDate = $('#pickupCapaDate-'+$btnBuy.attr('data-gcode')).text();
                                params.pickupCapaTime = $('#pickupCapaTime-'+$btnBuy.attr('data-gcode')).text();
                            }

                            if($btnBuy.attr('data-galaxyCd')){
                                params.galaxyClub = $btnBuy.attr('data-galaxyClub') ? $btnBuy.attr('data-galaxyClub') : 'N';
                                params.galaxyClubTpCd = $btnBuy.attr('data-galaxyCd');
                            }

                            if(config.isLocal){
                                console.info('[Local:buy]',params);
                            } else {
                                if(netFunnelId){
                                    NetFunnel_Action({action_id:netFunnelId}, function(ev,ret) {
                                        fnBuyDirectByMultiId([params]);
                                    });
                                    if(config.debugMode){
                                        console.info('[debugMode]initBuy',{
                                            'netFunnelId': netFunnelId,
                                            'params': params,
                                        })
                                    }
                                } else {
                                    fnBuyDirectByMultiId([params]);
                                }
                            }
                        }

                        checkPerformance(`_${arguments[0].type}:${target}`, bindRender);
                    } catch (e) {}
                });
            }

            checkPerformance('initBuy', render);
        },
        initCart(target, netFunnelId){
            const render = function() {
                if (!target) target = '[data-role="btnCart"]';
                if (!$(target).length) return;

                $secWrap.off(`click.pt_${target}`).on(`click.pt_${target}`, target, function (e) {
                    e.preventDefault();
                    try {
                        const _self = this;
                        const bindRender = function(){
                            const $btnCart = $(_self);
                            let params = {
                                goodsId: $btnCart.attr('data-gcode'),
                                qty: 1
                            }

                            params.tradeIn = $btnCart.attr('data-tradeIn') ? $btnCart.attr('data-tradeIn') : 'N';

                            if (config.isLocal) {
                                console.info('[Local:cart]', params);
                            } else {
                                if (netFunnelId) {
                                    NetFunnel_Action({action_id: netFunnelId}, function (ev, ret) {
                                        fnCartDirectByMultiId([params]);
                                    });
                                    if(config.debugMode){
                                        console.info('[debugMode]initCart',{
                                            'netFunnelId': netFunnelId,
                                            'params': params,
                                        })
                                    }
                                } else {
                                    fnCartDirectByMultiId([params]);
                                }
                            }
                        }

                        checkPerformance(`_${arguments[0].type}:${target}`, bindRender);
                    } catch (e) {}
                });
            }

            checkPerformance('initCart', render);
        },
        initPresent(target, netFunnelId){
            const render = function() {
                if(!target) target='[data-role="btnPresent"]';
                if(!$(target).length) return;

                $secWrap.off(`click.pt_${target}`).on(`click.pt_${target}`, target, function (e) {
                    e.preventDefault();
                    try {
                        const _self = this;
                        const bindRender = function(){
                            const $btnPresent = $(_self);
                            const sku = $btnPresent.attr('data-sku');
                            if(config.isLocal){
                                console.info('[Local:present]',sku);
                            } else {
                                if(netFunnelId){
                                    NetFunnel_Action({action_id:netFunnelId}, function(ev,ret) {
                                        presentDirect(sku, '_self');
                                    });
                                    if(config.debugMode){
                                        console.info('[debugMode]initPresent',{
                                            'netFunnelId': netFunnelId,
                                            'sku': sku,
                                        })
                                    }
                                } else {
                                    presentDirect(sku, '_self');
                                }
                            }
                        }

                        checkPerformance(`_${arguments[0].type}:${target}`, bindRender);
                    } catch (e) {}
                });
            }

            checkPerformance('initPresent', render);
        },
        initPickup(target, netFunnelId){
            const render = function() {
                if(!target) target='[data-role="btnPickup"]';
                if(!$(target).length) return;

                $secWrap.off(`click.pt_${target}`).on(`click.pt_${target}`, target, function (e) {
                    e.preventDefault();
                    try {
                        const _self = this;
                        const bindRender = function(){
                            const $btnPickup = $(_self);
                            const params = {
                                goodsId: $btnPickup.attr('data-gcode'),
                                goodsNm: $btnPickup.attr('data-gname'),
                                mdlCode: $btnPickup.attr('data-sku'),
                                isEvent: "Y"
                            };

                            if(config.isLocal){
                                console.info('[Local:pickup]',params);
                            } else {
                                if(netFunnelId){
                                    NetFunnel_Action({action_id:netFunnelId}, function(ev,ret) {
                                        fnOpenPickUpStorePop(params);
                                    });
                                    if(config.debugMode){
                                        console.info('[debugMode]initPickup',{
                                            'netFunnelId': netFunnelId,
                                            'params': params,
                                        })
                                    }
                                } else {
                                    fnOpenPickUpStorePop(params);
                                }
                                $secWrap.find('[data-pickup-plazaNm]').attr('id', 'plazaNm-' + params.goodsId);
                                $secWrap.find('[data-pickup-plazaNo]').attr('id', 'plazaNo-' + params.goodsId);
                                $secWrap.find('[data-pickup-storeAddr]').attr('id', 'storeAddr-' + params.goodsId);
                                $secWrap.find('[data-pickup-capaDate]').attr('id', 'pickupCapaDate-' + params.goodsId);
                                $secWrap.find('[data-pickup-capaTime]').attr('id', 'pickupCapaTime-' + params.goodsId);
                            }
                        }

                        checkPerformance(`_${arguments[0].type}:${target}`, bindRender);
                    } catch (e) {}
                });
            }

            checkPerformance('initPickup', render);
        },
        getCommentAvg(gcode, callBack) {
            try {
                let commentAvg = '0.0';
                if(!config.isLocal){
                    const goodsCommentData = fnGoodsCommentData(gcode, 1, 'Y', 1);
                    if(!!goodsCommentData) {
                        commentAvg = goodsCommentData.commentAvg;
                    }
                }
                if(callBack) {
                    callBack(commentAvg);
                } else {
                    console.warn('콜백 함수가 지정되지 않았습니다.');
                }
            } catch (e) {}
        },
        getPrice(params, callBack) {
            try {
                if(config.debugMode) start('_ajax:getPrice', performance.now());
                const api = {
                    url: `${config.apiUrl}xhr/goods/getGoodsTotalPrice`,
                    type: 'POST',
                    contentType : "application/json",
                    data : JSON.stringify(params),
                    done: function(data){
                        try {
                            if(callBack) {
                                callBack(data);
                            } else {
                                console.warn('콜백 함수가 지정되지 않았습니다.');
                            }
                            if(config.debugMode) end('_ajax:getPrice', performance.now());
                        } catch (e) {}
                    }
                }
                if(config.isLocal){
                    console.info('[Local:getPrice]',params,callBack);
                } else {
                    ajax.call(api);
                }

            } catch (e) {}
        },
        /*
         * params = {
         *   tradeIn: 'Y or N', // 옵션 체크 여부 ( Y: 선택, N: 미선택 )
         *   galaxyClub: 'Y or N',
         *   galaxyTrial: 'Y or N',
         *   soldout: 'Y or N',
         * }
         */
        getBtnDisabled(params) {

            if(!params) {
                console.warn('params가 지정되지 않았습니다.');
                return;
            }

            if(config.debugMode) start('getBtnDisabled', performance.now());

            // 버튼 비활성화 정책 (api 지원 여부: true 지원, false 미지원)
            const button = {
                buy: {
                    tradeIn: true,
                    galaxyClub: true,
                    galaxyTrial: true,
                    soldout: false,
                },
                cart: {
                    tradeIn: true,
                    galaxyClub: false,
                    galaxyTrial: false,
                    soldout: false,
                },
                pickup: {
                    tradeIn: true,
                    galaxyClub: true,
                    galaxyTrial: false,
                    soldout: true,
                },
                present: {
                    tradeIn: false,
                    galaxyClub: false,
                    galaxyTrial: false,
                    soldout: false,
                },
            }

            function getUseDisabled(btnType){
                let btnState = {}
                let isDisabled = false;

                if(params.tradeIn) btnState.tradeIn = params.tradeIn.toUpperCase() === 'Y' ? 'Y' : 'N';
                if(params.galaxyClub) btnState.galaxyClub = params.galaxyClub.toUpperCase() === 'Y' ? 'Y' : 'N';
                if(params.galaxyTrial) btnState.galaxyTrial = params.galaxyTrial.toUpperCase() === 'Y' ? 'Y' : 'N';
                if(params.soldout) btnState.soldout = params.soldout.toUpperCase() === 'Y' ? 'Y' : 'N';

                const chkTradeIn = !button[btnType].tradeIn && btnState.tradeIn === 'Y';
                const chkGalaxyClub = !button[btnType].galaxyClub && btnState.galaxyClub === 'Y';
                const chkGalaxyTrial = !button[btnType].galaxyTrial && btnState.galaxyTrial === 'Y';
                const chkSoldout = !button[btnType].soldout && btnState.soldout === 'Y';

                if( chkTradeIn || chkGalaxyClub || chkGalaxyTrial || chkSoldout){
                    isDisabled = true;
                }

                return isDisabled;
            }

            const results = {
                buy: getUseDisabled('buy'),
                cart: getUseDisabled('cart'),
                pickup: getUseDisabled('pickup'),
                present: getUseDisabled('present'),
            }

            if(config.debugMode) end('getBtnDisabled', performance.now());

            // 버튼 비활성화 여부 리턴
            return results;
        },
        checkSoldout(goodsId, callBack) {
            try {
                if(!goodsId) {
                    console.warn('goodsId가 지정되지 않았습니다.');
                    return;
                }
                if(config.debugMode) start('_ajax:checkSoldout', performance.now());
                const api = {
                    url: `${config.apiUrl}xhr/goods/getSaleStatCd`,
                    data: {
                        goodsId: goodsId
                    },
                    done: function(data){
                        try {
                            const saleStatCd = data.saleStatCd;
                            if(callBack) {
                                callBack(saleStatCd);
                            } else {
                                console.warn('콜백 함수가 지정되지 않았습니다.');
                            }
                            if(config.debugMode) end('_ajax:checkSoldout', performance.now());
                        } catch (e) {}
                    }
                }
                if(config.isLocal){
                    console.info('[Local:checkSoldout]',goodsId,callBack);
                } else {
                    ajax.call(api);
                }

            } catch (e) {}
        },
        checkSoldoutMulti(arrGoodsId, callBack){
            try {
                if(!arrGoodsId) {
                    console.warn('arrGoodsId가 지정되지 않았습니다.');
                    return;
                }
                if(config.debugMode) start('_ajax:checkSoldoutMulti', performance.now());
                let results = {};
                let api = {
                    url: `${config.apiUrl}xhr/goods/getSaleStatCdList`,
                    data: {
                        goodsIds: arrGoodsId
                    },
                    done: function (data) {
                        try {
                            if (!!data && 0 < data.saleStatList.length) {
                                let resultList = data.saleStatList;
                                for (let i = 0; i < resultList.length; i++) {
                                    results[resultList[i].goodsId] = resultList[i].goodsSaleStatCd;
                                }
                            }
                            if(callBack) {
                                callBack(results);
                            } else {
                                console.warn('콜백 함수가 지정되지 않았습니다.');
                            }
                            if(config.debugMode) end('_ajax:checkSoldoutMulti', performance.now());
                        } catch (e) {}
                    }
                }
                if(config.isLocal){
                    console.info('[Local:checkSoldoutMulti]',arrGoodsId,callBack);
                } else {
                    ajax.call(api);
                }

            } catch (e) {}
        },
        checkGalaxyClub(callBack) {
            try {
                if(config.debugMode) start('_ajax:checkGalaxyClub', performance.now());
                let isGalaxyCmpnFlag = false;
                let prgrStatYn = 'N';
                const api = {
                    url : `${config.apiUrl}xhr/goods/galaxyClubOrderHistoryCheck`
                    ,type: 'POST'
                    ,done : function(data) {
                        try {
                            if(data.membershipNo != null && data.isGalaxyCmpnYn == 'Y'){
                                if( isGalaxyCmpnFlag ){
                                    if( prgrStatYn == 'Y'){
                                        callBack();
                                    }
                                } else {
                                    const galMintCheck = {
                                        url : `${config.apiUrl}xhr/goods/galaxyClubMintitCheck`
                                        ,type: 'POST'
                                        ,done : function(data) {
                                            prgrStatYn = data.prgrStatYn;
                                            isGalaxyCmpnFlag = true;
                                            if(prgrStatYn == 'Y'){
                                                callBack();
                                            }
                                        }
                                    };
                                    if(!config.isLocal) ajax.call(galMintCheck);
                                }
                            }
                            if(config.debugMode) end('_ajax:checkGalaxyClub', performance.now());
                        } catch (e) {}
                    },
                };
                if(config.isLocal){
                    console.info('[Local:checkGalaxyClub]',callBack);
                } else {
                    ajax.call(api);
                }

            } catch (e) {}
        },
        checkAlarm(goodsId, callBack){
            try {
                if(config.debugMode) start('_ajax:checkAlarm', performance.now());
                const api = {
                    url : `${config.apiUrl}xhr/mypage/interest/insertRestockCheck`,
                    data : {goodsId : goodsId},  // 상품아이디
                    type: "POST",
                    done : function(data){
                        try {
                            if(callBack) {
                                callBack(data);
                            } else {
                                console.warn('콜백 함수가 지정되지 않았습니다.');
                            }
                            if(config.debugMode) end('_ajax:checkAlarm', performance.now());
                        } catch (e) {}
                    }
                }
                if(config.isLocal){
                    console.info('[Local:checkAlarm]',goodsId,callBack);
                } else {
                    ajax.call(api);
                }

            } catch (e) {}
        },
        checkLogin(callBack){
            try {
                if(config.debugMode) start('_ajax:checkLogin', performance.now());
                const api = {
                    url : `${config.apiUrl}xhr/member/getSession`,
                    type: "POST",
                    done : function(data){
                        try {
                            const session = JSON.parse(data);
                            const isLogin = (session.mbrNo == 0);
                            if(callBack) {
                                callBack(isLogin);
                            } else {
                                console.warn('콜백 함수가 지정되지 않았습니다.');
                            }
                            if(config.debugMode) end('_ajax:checkLogin', performance.now());
                        } catch (e) {}
                    }
                };
                if(config.isLocal){
                    console.info('[Local:checkLogin]',callBack);
                } else {
                    ajax.call(api);
                }
            } catch (e) {}
        },
        /**
         * 로그인된 상태의 사용자 이메일 리턴
         * @param {function} callBack 콜백함수
         * @return data 사용자 이메일
         */
        checkEmail(callBack) {
            try {
                if(config.debugMode) start('_ajax:checkEmail', performance.now());
                const api = {
                    url : `${config.apiUrl}xhr/goods/getMemberInfo`,
                    type: "POST",
                    dataType : "json",
                    done : function(data){
                        try{
                            if(callBack) {
                                callBack(data);
                            } else {
                                console.warn('콜백 함수가 지정되지 않았습니다.');
                            }
                            if(config.debugMode) end('_ajax:checkEmail', performance.now());
                        }catch (e) {}
                    }
                };
                if(config.isLocal){
                    console.info('[Local:checkEmail]',callBack);
                } else {
                    ajax.call(api);
                }
            } catch (e) {}
        },
        combineSoldout(jsonData, callBack) {
            const render = function(){
                if(!jsonData) {
                    console.warn('jsonData가 지정되지 않았습니다.');
                    return;
                }
                let arrGoodsId = [];
                jsonData.forEach(function(item){
                    const gCode = item.gcode ? item.gcode : item.gcd;
                    arrGoodsId.push(gCode);
                });
                this.checkSoldout(arrGoodsId, function(results){
                    jsonData.forEach(function(item){
                        const gCode = item.gcode ? item.gcode : item.gcd;
                        item.saleStatCd = results[gCode];
                    });
                    if(callBack) {
                        callBack(jsonData);
                    } else {
                        console.warn('콜백 함수가 지정되지 않았습니다.');
                    }
                });
            }

            checkPerformance('combineSoldout', render);
        },
        messager: {
            data: {
                content: '',
                btnText: '확인',
                okBtnText: '확인',
                cancelBtnText: '취소'
            },
            setAlertData: function (content, btnText, callBack) {
                service.messager.data.content = content;
                service.messager.data.btnText = btnText;
                if (callBack != undefined) {
                    service.messager.data.callBack = callBack;
                } else {
                    delete service.messager.data[callBack];
                }
            },
            alert: function (content, btnText, callBack) {
                try{
                    service.messager.setAlertData(content, btnText, callBack);
                    commonAlert(service.messager.data);
                    openLayer('commonAlert');
                }catch (e) {}
            },
        },
        performance: {},
    }

    if(config.debugMode) {
        start('_onload', 0);
        window.onload = function(){
            end('_onload', performance.now());
        };

        window.PT_STATE_TEST = {};
        window.PT_STATE_TEST.performance = service.performance;
    }

    return service;
})();