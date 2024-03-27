import { PT_STATE, util as _ } from './modules/bs_common';
import { anchor } from './modules/anchor_galcams'; //갤캠스 네비 앵커드 스크롤 이슈 수정
import { sticky } from './modules/sticky_galcams'; //갤캠스 네비 앵커드 스티키 이슈 수정
import { copy } from './modules/copy';
import { sns } from './modules/sns';


// ------- 갤캠스 프로젝트 기능 start
const ai_recipe = {
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
    setSwiper() {
        // toon 영역 swiper
        const toonSwiper = new Swiper ('.pt_toon.swiper-container',{
            slidesPerView: 'auto',
            allowTouchMove: true,
            preloadImages: false,
            grabCursor: true,    
            loop: true,
            pagination: {
                el: '.swiper-pagination.pt_toon__pagination',
                clickable : true,
            },
            lazy: true,
            breakpoints: {
                769: {
                    // allowTouchMove: false,
                }
            },
            on: {
                breakpoint: function () {
                    var that = this;
                    setTimeout(function () {
                        that.slideTo(0, 0);
                    }, 150);
                },
                // watchOverflow : true
            },
        });
        // 참여방법 영역 swiper
        const howtoSwiper = new Swiper ('.swiper-container.pt_how__con--box',{
            slidesPerView: 'auto',
            allowTouchMove: true,
            preloadImages: false,
            slidesPerGroup : 1,
            pagination: {
                el: '.swiper-pagination.pt_how__pagination',
                clickable : true,
            },
            lazy: true,
            breakpoints: {
                769: {
                    // allowTouchMove: false,
                }
            },
            on: {
                breakpoint: function () {
                    var that = this;
                    setTimeout(function () {
                        that.slideTo(0, 0);
                    }, 150);
                },
                // watchOverflow : true
            },
        });
        // nav 영역 swiper
        const navSlider = new Swiper('.pt_nav', {
            slidesPerView: 'auto',
            allowTouchMove: true,
            preloadImages: false,
            lazy: true,
            breakpoints: {
                769: {
                    slidesPerView: 'auto',
                    allowTouchMove: false,
                }
            },
            on: {
                breakpoint: function() {
                    let stickyMove = function(){
                        let navTab = $(".sec_nav");
                        let _navHeight = navTab.outerHeight();
                        let scrollTop = $(this).scrollTop();
                        let scrollClass =  _.pxToVw(-142, -55);
                        let setNavFixed = ['.sec_ai_toon', '.sec_content', '.sec_chance'];

                        setNavFixed.forEach((fixedClass, index)=>{
                            if(($(fixedClass).offset().top - _navHeight + scrollClass) <= scrollTop){
                                navSlider.slideTo(index);
                                return;
                            }
                        });

                    }
                    $(window).on('scroll.sticky', stickyMove);
                }
            }
        });
    },


    init() {
        this.gcLgnMemChk();
        this.setSwiper();
        viewportChange(); // fold 해상도 대응
    }
};
// ------- 갤캠스 프로젝트 기능 e


// 필요 한 부분만 남기고 제거해서 사용해주세요. 
// 실행소스 참고는 BS스크립트 3버전을 참고해주세요. PROJECT/00_bs_script_v3
$(document).ready(function(){
    anchor.click([
        {
            el: '[data-role-anchor="nav_anc_toon"]',
            target: '.sec_ai_toon',
            scroll: [-52, -100]
        },
        {
            el: '[data-role-anchor="nav_anc_recipe"]',
            target: '.sec_content',
            speed: 1000,
            scroll: [-52, -100]
        },
        {
            el: '[data-role-anchor="nav_anc_chance"]',
            target: '.sec_chance',
            speed: 1000,
            scroll: [-52, -100]
        },
        // toon 영역 각 기능 유의사항 앵커
        {
            el: '[data-role-anchor="ai_fun_01"]',
            target: '.ai_fun_01',
            scroll: [20, 30]
        },
        {
            el: '[data-role-anchor="ai_fun_02"]',
            target: '.ai_fun_02',
            scroll: [20, 30]
        },
        {
            el: '[data-role-anchor="ai_fun_03"]',
            target: '.ai_fun_03',
            scroll: [20, 30]
        },
        {
            el: '[data-role-anchor="ai_fun_04"]',
            target: '.ai_fun_04',
            scroll: [20, 30]
        },
        {
            el: '[data-role-anchor="ai_fun_05"]',
            target: '.ai_fun_05',
            scroll: [20, 30]
        },
    ]);

    anchor.load([
        {
            url: 'event01',
            target: '.sec_ai_toon'
        },
        {
            url: 'event02',
            target: '.sec_content',
            scroll: [0, -50]
        },
        {
            url: 'event03',
            target: '.sec_chance',
            scroll: [0, -50]
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

    ai_recipe.init(); // 갤캠스 기능 호출 (viewportChange() 포함)
});
