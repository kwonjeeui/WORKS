import buyingData from "../data/data_comp.json";
import { PT_STATE, util as _ } from './modules/bs_common';
import { Buying } from './modules/buying_m_comp';

let isLocal = true;
try{
    isLocal = !(document.domain.includes("samsung.com"));
} catch (e) {}

function addComma(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function soldoutCheck($el, gCode){

    const api = {
        url: '/sec/xhr/goods/getSaleStatCd',
        data: {
            goodsId: gCode.trim()
        },
        done: function(data){
            try{
                const $target = $el.find(`[data-buying-gcode="${gCode}"]`);
                const $btn = $target.find('.pt_btn_buy');

                if (data.saleStatCd == '12'){
                    $target.removeClass('pt_soldout');
                    $btn.html('구매하기');
                } else {
                    $target.addClass('pt_soldout');
                    $btn.html('Sold Out');
                }
            } catch (e) {}
        }
    }

    ajax.call(api);
}

function htmlDraw(buying, omni, isReload){
    const buyingIndex = buying.$el.attr('data-pt-buying-list');

    function returnHtml(data, num) {

        function returnOptHtml(optType) {
            const optArr = data[optType];
            const isColor = optType === 'arrColor';
            let optHtml = '';
            let optBtnHtml = '';
            let optKey = '';
            let btnType = '';

            if(isColor) {
                optKey = 'optCdCo';
                btnType = 'color';
            } else if(optType === 'arrOptA') {
                optKey = 'optCdA';
                btnType = 'optA';
            } else if(optType === 'arrOptB') {
                optKey = 'optCdB';
                btnType = 'optB';
            }

            for (let opt of optArr) {
                const optInfo = opt.split('|');
                let _disabled = '';
                if(!isColor) {
                    data[`${optType}Hide`] && data[`${optType}Hide`].forEach(function(item){
                        if(optInfo[0] === item.split('|')[0]) {
                            _disabled = 'pt_disabled';
                        }
                    });
                }
                optBtnHtml += /* html */`
                    <li class="swiper-slide pt_opt__item ${isColor ? 'pt_opt__item--color' : 'pt_opt__item--btn'} ${_disabled}" data-opt-btn>
                        <input
                            type="radio"
                            name="prd_buying${num}_${data.grp}_${btnType}"
                            id="prd_buying${num}_${data.grp}_${optInfo[0]}"
                            value="${optInfo[0]}"
                            ${isColor
                                ? `data-color-name="${optInfo[1]}"`
                                : ''
                            }
                            ${optInfo[0] === data[optKey]
                                ? 'checked'
                                : ''
                            }
                            autocomplete="off"
                        >
                        <label
                            for="prd_buying${num}_${data.grp}_${optInfo[0]}"
                            ${isColor
                                ? `style="${optInfo[2].indexOf('images.samsung.com') != -1
                                    ? `background-image:url(${optInfo[2]});background-size: 100%;`
                                    : `background-color: ${optInfo[2]}`};"`
                                : ''
                            }
                            data-omni-type="microsite"
                            data-omni=""
                        >
                            ${!isColor
                                ? optInfo[1]
                                : ''
                            }
                        </label>
                        ${isColor
                            ? `<span class="blind">${optInfo[1]}</span>`
                            : ''
                        }
                    </li>
                `
            }

            optHtml = /* html */`
                <div class="pt_opt__slide">
                    <div class="swiper-container" data-buying-option-slider>
                        <ul class="swiper-wrapper pt_opt__list" data-opt-key="${optKey}">
                            ${optBtnHtml}
                        </ul>
                        <div class="swiper-button-prev pt_btn pt_btn--prev"></div>
                        <div class="swiper-button-next pt_btn pt_btn--next"></div>
                    </div>
                </div>
            `;

            return optHtml;
        }

        return  /* html */`
            <div class="pt_buying_item" data-buying-group="${data.grp}" data-buying-category="${data.cat}" data-buying-gcode="${data.gcd}">
                <div class="pt_prd_area">
                    <div class="img_box pt_prd_img">
                        <img src="${data.thm}" alt="${data.sku} 제품" loading="lazy" data-prd-img>
                    </div>
                    <ul class="pt_tag_box">
                        <li class="prd_tag_sale" data-opt-show="tagSale!=-" style="${data.tagSale.trim() === '-' ? 'display:none;': ''}">
                            <p class="tag_txt"><em class="en" data-opt-text="tagSale">${data.tagSale}</em>%<br>할인</p>
                        </li>
                        <li class="prd_tag_a" data-opt-show="tagA!=-" style="${data.tagA.trim() === '-' ? 'display:none;': ''}">
                            <p class="tag_txt">BEST</p>
                        </li>
                        <li class="prd_tag_b" data-opt-show="tagB!=-" style="${data.tagB.trim() === '-' ? 'display:none;': ''}">
                            <p class="tag_txt">쿠폰<br>할인</p>
                        </li>
                        <li class="prd_tag_c" data-opt-show="tagC!=-" style="${data.tagC.trim() === '-' ? 'display:none;': ''}">
                            <p class="tag_txt">베스트<br>상품평</p>
                        </li>
                    </ul>
                    <div class="pt_opt">
                        ${!!data.arrColor && data.arrColor.length > 0 ? returnOptHtml('arrColor') : ''}
                        ${!!data.arrOptA && data.arrOptA.length > 0 ? returnOptHtml('arrOptA') : ''}
                        ${!!data.arrOptB && data.arrOptB.length > 0 ? returnOptHtml('arrOptB') : ''}
                    </div>
                    <p class="pt_prd_name" data-opt-text="pdNm">${data.pdNm}</p>
                    <p class="pt_prd_sku" data-opt-text="sku">${data.sku}</p>
                </div>

                <div class="pt_price_area">
                    <ul class="pt_price_box">
                        <li class="pt_price_base">
                            <span class="pt_price_txt" data-price-txt="1">
                            ${
                                data.pA.trim() === '-'
                                    ? '혜택가'
                                    : '기준가'
                            }
                            </span>
                            <span class="pt_price">
                                <em class="en mono" data-price="1">
                                    ${
                                        data.pA.trim() === '-'
                                        ? data.pB.trim()
                                        : data.pA.trim()
                                    }
                                </em> 원
                            </span>
                        </li>
                        <li class="pt_price_base">
                            <span class="pt_price_txt" data-price-txt="2">
                                ${
                                    data.pC.trim() === '-'
                                        ? '혜택가'
                                        : '쿠폰적용가'
                                }
                            </span>
                            <span class="pt_price">
                                <em class="en mono" data-price="2">
                                    ${
                                        data.pC.trim() === '-'
                                            ? data.pB.trim()
                                            : data.pC.trim()
                                    }
                                </em> 원
                            </span>
                        </li>
                    </ul>

                    <div class="pt_btn_box">
                        <div class="pt_btn_coupon_box" data-opt-show="cpSale!=-" style="${data.cpSale.trim() === '-' ? 'display:none;': ''}">
                            <div class="img_box">
                                <img src="../is/images/buying_comp/gd_cupon_cta_pc.png" class="m_hide" alt="" loading="lazy">
                                <img src="../is/images/buying_comp/gd_cupon_cta_mo.png" class="m_show" alt="" loading="lazy">
                            </div>
                            <a href="javascript:;" class="pt_btn_coupon" data-omni-type="microsite" data-omni="${omni.coupon}${data.sku}" data-role="btnCouponPromo" data-cpNum="${data.cn}" title="${data.sku} 쿠폰 다운받기"><span class="pt_coupon__download-btn"><span data-opt-text="cpSale">${data.cpSale}</span>만원 할인 쿠폰</span></a>
                        </div>

                        <a href="${data.url}" target="_blank" class="btn_common type_round black_bg pt_btn_buy" data-omni-type="microsite" data-omni="${omni.link}${data.sku}" title="${data.sku} 제품 페이지로 이동">구매하기</a>
                    </div>
                </div>
            </div>
        `;
    }

    const listDefault = buying.params.parsedData.listPaging;
    let _html = '';
    listDefault.forEach(prd => {
        _html += returnHtml(prd, buyingIndex);
    });

    const $el = buying.$el;
    if(isReload){
        $el.html(_html);
    } else {
        $el.append(_html);
    }


    if (buyingIndex == 3) {
        // 솔드아웃 체크
        for (let item of listDefault) {
            soldoutCheck($el, item.gcd);
        }
    }


    // 스와이퍼
    setOptionSwiper();
}

function setOptionSwiper() {
    $('[data-buying-option-slider]').each(function() {
        if ($(this).hasClass('swiper-container-initialized')) return;

        const optSwiper = new Swiper(this, {
            allowTouchMove: true,
            slidesPerView: 'auto',
            watchOverflow : true, // 다음슬라이드가 없을때 pager, button 숨김 여부 설정
            threshold: 30,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                init: function() {
                    const $el = $(this.$el);

                    // 다음슬라이드가 있는지 없는지 체크 ("true"면 다음 슬라이드가 없는상태)
                    if(this.isLocked == true){
                        // 다음슬라이드가 없으면 클래스(slide_lockd) 추가
                        $el.closest('.swiper-container').addClass('slide_lockd');
                    }else{
                        $el.closest('.swiper-container').removeClass('slide_lockd');
                    }

                    const _index =  $el.closest('.swiper-container').find('input:checked').closest('[data-opt-btn]').index();
                    this.slideTo(_index, 0);
                }
            }
        });

    });


}

const buyingUtil = {
    updateData($el, selected, omni) {
        if(!selected) return;

        const $targetGroup = $el.find(`[data-buying-group="${selected.grp}"]`)

        const selectPrice1 = selected.pA.trim() === '-' ? selected.pB.trim() : selected.pA.trim();
        const selectPriceTxt1 = selected.pA.trim() === '-' ? '혜택가' : '기준가';
        $targetGroup.find('[data-price="1"]').text(addComma(selectPrice1));
        $targetGroup.find('[data-price-txt="1"]').text(selectPriceTxt1);

        const selectPrice2 = selected.pC.trim() === '-' ? selected.pB.trim() : selected.pC.trim();
        const selectPriceTxt2 = selected.pC.trim() === '-' ? '혜택가' : '쿠폰적용가';
        $targetGroup.find('[data-price="2"]').text(addComma(selectPrice2));
        $targetGroup.find('[data-price-txt="2"]').text(selectPriceTxt2);

        // 선택된 제품 gcode
        if (selected.gcd) {
            $targetGroup.attr('data-buying-gcode', selected.gcd);
        }

        // 제품 썸네일
        const $prdImg = $targetGroup.find('[data-prd-img]');
        if(!!$prdImg.length && selected.gcd){
            $prdImg.attr('src', selected.thm);
            $prdImg.attr('alt', selected.pdNm);
        }

        // 더 알아보기 버튼
        const $btnLink = $targetGroup.find('.pt_btn_buy');
        if(!!$btnLink.length && selected.gcd){
            $btnLink.attr('href', selected.url);
            $btnLink.attr('title', `${selected.sku} 자세히 보기 페이지 새 창으로 열림`);
            $btnLink.attr('data-sku', selected.sku);
            if(!!omni) $btnLink.attr('data-omni', `${omni.link}${selected.sku}`);
        }

        // 쿠폰 다운받기 버튼 (일반쿠폰 + 앱쿠폰)
        const $btnCoupon = $targetGroup.find('[data-role="btnCouponPromo"]');
        if(!!$btnCoupon.length && selected.gcd){
            $btnCoupon.attr('data-cpNum', selected.cn.trim());
            $btnCoupon.attr('title', `${selected.pdNm} 쿠폰 다운받기`);
            if(!!omni) $btnCoupon.attr('data-omni', `${omni.coupon}${selected.sku}`);
        }
    }
}


function init() {

    const omni = {
        list1: {
            link: 'sec:event:bespoke-grandeai:goto_Specialprice_product_buy_',
            coupon: 'sec:event:bespoke-grandeai:button_Download_specialprice_coupon_',
        },
    }

    const prdBuying1 = new Buying('[data-pt-buying-list="1"]', {
        type: 'multi', // single(default), multi, list
        pdList: buyingData.result,
        paging: { // multi, list 전용 옵션
            use: true,
            pcIncrease: 8,
            moIncrease: 8,
        },
        on: {
            init(buying) {
                htmlDraw(buying, omni.list1);
                buying.update();
            },
            clickBtnMore(buying){
                htmlDraw(buying, omni.list1);
                buying.update();
            },
            productChangeEnd(buying) {
                const selected = buying.state.selected;

                buyingUtil.updateData(buying.$el, selected, omni.list1);
            },
        }
    })
}

export const buyingScriptJs = init();
