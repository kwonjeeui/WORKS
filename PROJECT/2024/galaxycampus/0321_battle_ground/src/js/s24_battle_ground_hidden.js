import { PT_STATE, util as _ } from './modules/bs_common';
import { anchor } from './modules/anchor_galcams'; //갤캠스 네비 앵커드 스크롤 이슈 수정
import { sticky } from './modules/sticky_galcams_hidden'; //갤캠스 네비 앵커드 스티키 이슈 수정
import { copy } from './modules/copy';
import { sns } from './modules/sns';


// ------- 갤캠스 프로젝트 기능 start
const s24_battle_ground = {
    gcLgnMemChk() {
        const btnLgnChk = document.querySelector('.pt_lgnchk');
        const btnMemChk = document.querySelector('.pt_memchk');
        const btnAllPass = document.querySelector('.pt_allpass');

        var chkConditions = {
            url : "/event/galaxycampus/xhr/member/getSession",
            type: "POST",
            done : function(data){
                var session = JSON.parse(data);
                // var returnUrl = window.location.pathname;
                
                if (session.mbrNo == 0) { // 로그인 여부 체크
                    btnLgnChk.style.display = "flex";
                    btnMemChk.style.display = "none";
                    btnAllPass.style.display = "none";
                    
                } else if (session.gcsMbrNo == 0) { // 갤캠스 회원 체크
                    btnLgnChk.style.display = "none";
                    btnMemChk.style.display = "flex";
                    btnAllPass.style.display = "none";
                } else {
                    // 로그인+갤캠스 체크 후 처리할 기능
                    btnLgnChk.style.display = "none";
                    btnMemChk.style.display = "none";
                    btnAllPass.style.display = "flex";
                }
            }
        }
    
        ajax.call(chkConditions);

        PT_STATE.$PROJECT.off('click.pt_lgnchk').on('click.pt_lgnchk', '[data-role="btnLgnChk"]', function (e) {
            // 로그인 여부 체크 후 아래 실행
            e.preventDefault();
            alert("로그인 후\n참여 가능합니다.");
            location.href='https://www.samsungebiz.com/event/galaxycampus/member/introPage/?loginType=GCS&returnUrl='+returnUrl;
        });
    
        PT_STATE.$PROJECT.off('click.pt_memchk').on('click.pt_memchk', '[data-role="btnMemChk"]', function (e) {
            // 갤캠스 회원 체크 후 아래 실행
            e.preventDefault();
            alert("갤럭시캠퍼스 회원만 이용 가능합니다");
            location.href='https://www.samsungebiz.com/event/galaxycampus/member/loginDocumentEmailCheck';
        });
    },

    // setSwiper() {
    //     // nav 영역 swiper
    //     const navSwiper = new Swiper ('.swiper-container.pt_nav',{
    //         slidesPerView: 'auto',
    //         allowTouchMove: true,
    //         preloadImages: false,
    //         slidesPerGroup : 1,
    //         lazy: true,
    //         breakpoints: {
    //             769: {
    //                 // allowTouchMove: false,
    //             }
    //         },
    //         on: {
    //             breakpoint: function () {
    //                 var that = this;
    //                 setTimeout(function () {
    //                     that.slideTo(0, 0);
    //                 }, 150);
    //             },
    //             // watchOverflow : true
    //         },
    //     });
    // },

    init() {
        this.gcLgnMemChk();
        // this.setSwiper();
        viewportChange(); // fold 해상도 대응
    }
};
// ------- 갤캠스 프로젝트 기능 e

$(document).ready(function(){
    anchor.click([
        {
            el: '[data-role-anchor="nav_information"]',
            target: '.sec_information_hidden-02',
            speed: 1000,
            scroll: [-86, -180]
        },
        {
            el: '[data-role-anchor="nav_event_01"]',
            target: '.sec_event_01',
            speed: 1000,
            scroll: [-86, -180]
        },
        {
            el: '[data-role-anchor="nav_event_02"]',
            target: '.sec_event_02',
            speed: 1000,
            scroll: [-86, -180]
        },
        {
            el: '[data-role-anchor="nav_challenge"]',
            target: '.sec_challenge',
            speed: 1000,
            scroll: [-86, -180]
        },
        {
            el: '[data-role-anchor="event01_notice01"]',
            target: '.pt_notice_vote',
            speed: 1000,
            scroll: [0, 0]
        },
        {
            el: '[data-role-anchor="event01_notice02"]',
            target: '.pt_notice_comment',
            speed: 1000,
            scroll: [0, 0]
        },
        {
            el: '[data-role-anchor="hidden_noti"]',
            target: '.pt_notice_new_sign',
            speed: 1000,
            scroll: [0, 0]
        },
        {
            el: '[data-role-anchor="notice3"]',
            target: '.pt_notice_early',
            speed: 1000,
            scroll: [0, 0]
        },
    ]);

    anchor.load([
        {
            url: 'section01',
            target: '.sec_information_hidden-02',
            scroll: [-86, 0]
        },
        {
            url: 'section02',
            target: '.sec_event_01',
            scroll: [-86, 0]
        },
        {
            url: 'section03',
            target: '.sec_event_02',
            scroll: [-86, 0]
        },
        {
            url: 'section04',
            target: '.sec_challenge',
            scroll: [-86, 0]
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
    observerbg.observe()

    s24_battle_ground.init(); // 갤캠스 기능 호출 (viewportChange() 포함)
});
