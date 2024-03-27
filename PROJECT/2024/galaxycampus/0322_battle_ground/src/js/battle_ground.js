import { PT_STATE, util as _ } from './modules/bs_common';
// import { anchor } from './modules/anchor';
import { copy } from './modules/copy';
import { sns } from './modules/sns';
// import { sticky } from './modules/sticky';

// 필요 한 부분만 남기고 제거해서 사용해주세요. 
// 실행소스 참고는 BS스크립트 3버전을 참고해주세요. PROJECT/00_bs_script_v3
$(document).ready(function(){

    // anchor.click([
    //     {
    //         el: '[data-role-anchor="sec_anchor01"]',
    //         target: '.sec_anchor'
    //     },
    //     {
    //         el: '[data-role-anchor="sec_anchor02"]',
    //         target: '.sec_anchor',
    //         speed: 1000,
    //         scroll: [500]
    //     },
    //     {
    //         el: '[data-role-anchor="sec_anchor03"]',
    //         target: '.sec_anchor',
    //         speed: 0,
    //         scroll: [-200, -100]
    //     },
    // ]);

    // anchor.load([
    //     {
    //         url: 'test01',
    //         target: '.sec_anchor'
    //     },
    //     {
    //         url: 'test02',
    //         target: '.sec_accordian',
    //         scroll: [0, -50]
    //     },
    // ]);


    copy.click();
    sns.init();
    // sticky.init();

    /** 백그라운드 이미지에 lozad 적용 시 필요 함수 */
    const observerbg = lozad('.pt_bg-image', {
        loaded: function(el) {
            el.classList.add('pt_add-bg');
        }
    });
    observerbg.observe()

    viewportChange(); // fold 해상도 대응
});
