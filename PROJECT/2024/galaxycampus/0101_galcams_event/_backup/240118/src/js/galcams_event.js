import { PT_STATE, util as _ } from './modules/bs_common';
// import { anchor } from './modules/anchor';
import { anchor } from './modules/anchor_galcams';
import { sns } from './modules/sns';
import { sticky } from './modules/sticky';
import evtData from "../data/event.json";


// ------- 갤캠스 필수 기능 start
var galcams = {
    /** 갤캠스 : 로그인 체크 삭제 */

    /** 갤캠스 : 기기별 퍼블단 변경 (WEB/APP 다른 디자인일 시 사용) */ 
   isAgent: function() {
       let agent = navigator.userAgent.toLowerCase();
       let localPort1 = window.location.port == '4441';
       let localPort2 = window.location.port == '4442';
       let locationQa = window.location.pathname.indexOf('display/preview/');

       if(agent.indexOf('secapp') != -1) {
           $('html').addClass('isApp');
       } else {
           $('html').addClass('isWeb');
           
       }
       if(window.location.search.indexOf('isApp') != -1 && (localPort1 || localPort2 || locationQa != -1)){
           if($('html').hasClass('isWeb')){
               $('html').removeClass('isWeb');
               $('html').addClass('isApp');
           }
       }else if(window.location.search.indexOf('isWeb') != -1 && (localPort1 || localPort2 || locationQa != -1)){
           if($('html').hasClass('isApp')){
               $('html').removeClass('isApp');
               $('html').addClass('isWeb');
           }
       }
    },

    setModule: function(){
        const eventData = evtData.result;
        const $nav = document.querySelector('.pt_nav');
        const $intro = document.querySelector('.pt_event');
        const $event = document.querySelector('.sec_event-wrap');
        const eventList = eventData.filter(item => item.type==='event');

        const navList = eventData.map((item, index)=>{
            const imgName = 'gce'
            let _navHtml = '';
            let _introHtml = '';
            _navHtml += `
                <li class="swiper-slide pt_nav__item">
                    <a href="javascript:;" class="pt_nav__btn" data-role-anchor="nav_${item.name}" data-omni-type="microsite" data-omni="galaxycampus:eventList:gcseventhub:${item.omni}" title="${item.title} 영역 이동">
                        ${item.navName === 'o' ? item.navTitle : item.title}
                    </a>
                </li>
            `;
            _introHtml += `
                <li class="swiper-slide pt_event__item">
                    <a href="javascript:;" class="pt_event__btn" data-role-anchor="intro-anchor-${item.name}" data-omni-type="microsite" data-omni="galaxycampus:eventList:gcseventhub:${item.omni}" title=" ${item.title} 영역으로 이동">
                        <div class="img_box pt_event__img">
                            <img src="../../is/images/intro/${imgName}_intro_${item.name}_pc${item.imgVer}.jpg" alt="${item.title}" class="m_hide" loading="lazy">
                            <img src="../../is/images/intro/${imgName}_intro_${item.name}_mo${item.imgVer}.jpg" alt="${item.title}" class="m_show" loading="lazy">
                        </div>
                        <p class="pt_event__tag en">Event ${item.id}</p>
                        <div class="pt_event__txt-box ${item.theme === 'white' ? 'pt_event__txt-box--white' : ''}">
                            <p class="pt_event__main">${item.title}</p>
                            <p class="pt_event__desc">${item.desc}</p>
                        </div>
                    </a>
                </li>
            `;
            $nav.insertAdjacentHTML('beforeend', _navHtml);
            $intro.insertAdjacentHTML('beforeend', _introHtml);
        });

        const evtList = eventList.map((item, index)=>{

            let _evtHtml = '';
            _evtHtml += `
                <div class="sec_event sec_${item.name} pt_bg-image">
                    <div class="inner_1440">
                        <p class="blind">${item.alt}</p>
                        <div class="pt_text-box ${item.theme === 'white' ? 'pt_text-box--white' : ''}">
                            <span class="pt_text-box__num en">Event ${item.id}</span>
                            <h3 class="pt_text-box__tit">${item.evtTitle}</h3>
                            <p class="pt_text-box__sub">${item.evtSub}</p>
                            <ul class="pt_info pt_info--${item.name}">
                                <li class="pt_info__list">
                                    <strong class="pt_info__title ${item.theme === 'white' ? 'pt_info__title--white' : ''}">${item.dateName === 'o'? '모집 기간': '이벤트 기간'}</strong>
                                    ${item.evtDate}
                                </li>
                            </ul>
                        </div>
                
                        <a href="${item.evtUrl}" class="btn_common type_round black_bg pt_more__btn ${item.theme === 'white' ? 'pt_more__btn--white' : ''}" title="${item.evtAlt} 페이지 이동" data-omni-type="microsite" data-omni="galaxycampus:eventList:gcseventhub:${item.evtBtnOmni}">${item.evtBtn === 'o'? '더 알아보기': '이벤트 더 알아보기'}</a>
                        <a href="javascript:;" class="btn_common type_anchor ${item.theme === 'white' ? 'type_anchor--white' : ''} black_bg pt_anchor ${item.theme === 'white' ? 'pt_anchor--white' : ''}" data-role-anchor="${item.evtDataRole}" data-omni-type="microsite" data-omni="galaxycampus:eventList:gcseventhub:${item.evtNotiOmni}" title="${item.evtAlt} 유의사항 보러가기">유의사항 보기</a>
                    </div>
                </div>
            `;
            $event.insertAdjacentHTML('beforeend', _evtHtml);

            const eventBg = (device)=>{
                $('.sec_event.sec_'+item.name).css({
                    "background":"url(../../is/images/event/gce_"+item.name+"_bg_"+device+item.evtImgVer+".jpg) no-repeat",
                    "background-position": "center top",
                    "background-size": "cover"
                });
            }

            $(window).on('load', ()=>{
                if(window.innerWidth > 768) {
                    eventBg('pc');
                } else {
                    eventBg('mo');
                }
            })
            $(window).on('resize', ()=>{
                if(window.innerWidth > 768) {
                    eventBg('pc');
                } else {
                    eventBg('mo');
                }
            })
        });
        const recommendNum = eventData.filter(item => item.type==='recommend');
        const newsignupNum = eventData.filter(item => item.type==='newsignup');
        recommendNum.map(item => $('.sec_recommend .pt_title-box__tag').html('Event ' + item.id));
        newsignupNum.map(item => $('.sec_newsignup .pt_title-box__tag').html('Event ' + item.id));
    },
    
    setSwiper: function(){

        const navSlider = new Swiper('.pt_nav-slider', {
            slidesPerView : 'auto', 
            allowTouchMove: true,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            breakpoints: {
                769: {
                    allowTouchMove: false,                
                }
            },
            on: {
                breakpoint: function() {
                    const eventData = evtData.result;
                    const setNavFixed = eventData.map((item, index)=>{
                        return `.sec_${item.name}`;
                    });

                    let stickyMove = function(){
                        let navTab = $(".pt_nav");
                        let _navHeight = navTab.outerHeight();
                        let scrollTop = $(this).scrollTop();
                        let scrollClass =  _.pxToVw(-142, -167);

                        setNavFixed.forEach((fixedClass, index)=>{
                            if(($(fixedClass).offset().top - _navHeight + scrollClass) <= scrollTop){
                                // console.log(fixedClass, index);
                                navSlider.slideTo(index);
                                return;
                            }
                        });

                    }
                    $(window).on('scroll.sticky', stickyMove);
                }
            }
        });

        const raffleSlider = new Swiper('.pt_raffle-slider', {
            slidesPerView: 'auto',
            allowTouchMove: true,
            preloadImages: false,
            lazy: true,            
            pagination: {
                el: '.swiper-pagination',
                clickable : true,
            },
            navigation : {
                nextEl : '.swiper-button-next', 
                prevEl : '.swiper-button-prev', 
            },
        });

        const weeklySlider = new Swiper('.pt_weekly-slider', {
            slidesPerView: 'auto',
            allowTouchMove: true,
            preloadImages: false,
            lazy: true,            
            pagination: {
                el: '.swiper-pagination',
                clickable : true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                769: {
                    slidesPerView: 'auto',
                    allowTouchMove: false,
                    pagination: false,
                }
            }
        });

        // const newsignupSwiper = new Swiper('.swiper-container.pt_newsignup-swiper', {
        //     slidesPerView: 'auto',
        //     allowTouchMove: true,
        //     autoplay : false,
        //     loop: false,
        //     preloadImages: false,
        //     lazy: true,
        //     pagination: false,
        //     // pagination: {
        //     //     el: '.swiper-pagination',
        //     //     clickable : true,
        //     // },
        //     breakpoints: {
        //         769: {
        //             allowTouchMove: false,
        //         }
        //     },
        //     on: {
        //         breakpoint: function() {
        //             var that = this;
        //             setTimeout(function() {
        //                 that.slideTo(0, 0);
        //             }, 150);
        //         }

                
        //     }
        // });

        const introSwiper = new Swiper ('.swiper-container.pt_intro-swiper',{
            slidesPerView: 'auto',
            allowTouchMove: true,
            spaceBetween: 10,
            slidesOffsetAfter: 40,
            slidesOffsetBefore: 40, 
            autoplay : false,
            loop: false,
            preloadImages: false,
            lazy: true,
            watchOverflow : false,
            pagination: {
                el: '.swiper-pagination',
                clickable : true,
            },
            navigation : {
                nextEl : '.swiper-button-next', 
                prevEl : '.swiper-button-prev', 
                navigationDisabledClass : '.swiper-navigation-disabled'
            },
            
            breakpoints: {
                769: {
                    allowTouchMove: false, // 슬라이드 필요없을 때 false
                    spaceBetween: 10,
                    // slidesOffsetAfter: 300,
                    // slidesOffsetBefore: 160,
                    slidesOffsetAfter: 0,
                    slidesOffsetBefore: 0,
                    watchOverflow : true // 슬라이드 필요없을 때 true => pager,navi hide
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

    },

    // 갤캠스 GNB Fixed 오류 수정 23.11.29(에런)
    setStickyHeight: function(){
        const stickyWrap = document.querySelector('.pt_nav-slider');
        const eventHeader = document.getElementById('header__navi');

        // sticky 컴포넌트가 있다면 프로세스 실행
        if (stickyWrap) {
            window.addEventListener('scroll', ()=> {
                const headerHeight = eventHeader.offsetHeight;
                
                if (document.body.classList.contains('scroll-up')) {
                    stickyWrap.style.top = `${headerHeight}px`;
                } else {
                    stickyWrap.style.top = 0;
                }
            });
        }
    },

   init: function() {
        this.setModule();
        this.setSwiper();
        this.setStickyHeight();
        viewportChange(); // fold 해상도 대응
   }
};
// ------- 갤캠스 필수 기능 e


// 필요 한 부분만 남기고 제거해서 사용해주세요. 
// 실행소스 참고는 BS스크립트 3버전을 참고해주세요. PROJECT/00_bs_script_v3
$(document).ready(function(){

    // 네이버 웹툰 쿠키오븐 API 전달 소스 start
    var cookieOvenUrl = new URL(document.location.href);
    var cookieOvenUrlParams = cookieOvenUrl.searchParams;
    if(cookieOvenUrlParams.get('click_key') != null){
        setCookie('click_key', cookieOvenUrlParams.get('click_key'), 1);
    } 
    // 네이버 웹툰 쿠키오븐 API 전달 소스 end

    anchor.click([
        {
            el: '[data-role-anchor="nav_Tabs9FE"]',
            target: '.sec_Tabs9FE',
        },
        {
            el: '[data-role-anchor="nav_assistpreviewer"]',
            target: '.sec_assistpreviewer',
        },
        {
            el: '[data-role-anchor="nav_assistreviewer"]',
            target: '.sec_assistreviewer',
        },
        {
            el: '[data-role-anchor="nav_yearendgift"]',
            target: '.sec_yearendgift',
        },
        {
            el: '[data-role-anchor="nav_exam"]',
            target: '.sec_exam',
        },
        {
            el: '[data-role-anchor="nav_newsignup"]',
            target: '.sec_newsignup',
        },
        {
            el: '[data-role-anchor="nav_recommend"]',
            target: '.sec_recommend',
        },
        {
            el: '[data-role-anchor="nav_raffle"]',
            target: '.sec_raffle',
            // scroll: [62, -110]
        },
       
        //인트로 앵커
        {
            el: '[data-role-anchor="intro-anchor-Tabs9FE"]',
            target: '.sec_Tabs9FE',
        },
        {
            el: '[data-role-anchor="intro-anchor-assistpreviewer"]',
            target: '.sec_assistpreviewer',
        },
        {
            el: '[data-role-anchor="intro-anchor-assistreviewer"]',
            target: '.sec_assistreviewer',
        },
        {
            el: '[data-role-anchor="intro-anchor-yearendgift"]',
            target: '.sec_yearendgift',
        },
        {
            el: '[data-role-anchor="intro-anchor-exam"]',
            target: '.sec_exam',
        },
        {
            el: '[data-role-anchor="intro-anchor-newsignup"]',
            target: '.sec_newsignup',
        },
        {
            el: '[data-role-anchor="intro-anchor-recommend"]',
            target: '.sec_recommend',
        },
        {
            el: '[data-role-anchor="intro-anchor-raffle"]',
            target: '.sec_raffle',
            // scroll: [-0, -105]
        },

        //유의사항 앵커
        {
            el: '[data-role-anchor="noti_Tabs9FE"]',
            target: '.pt_noti_Tabs9FE'
        },
        {
            el: '[data-role-anchor="noti_assistpreviewer"]',
            target: '.pt_noti_assistpreviewer'
        },
        {
            el: '[data-role-anchor="noti_assistreviewer"]',
            target: '.pt_noti_assistreviewer'
        },
        {
            el: '[data-role-anchor="noti_yearendgift"]',
            target: '.pt_noti_yearendgift'
        },
        {
            el: '[data-role-anchor="noti_exam"]',
            target: '.pt_noti_exam',
        },
        {
            el: '[data-role-anchor="noti_newsignup"]',
            target: '.pt_noti_signup'
        },
        {
            el: '[data-role-anchor="noti_highshool"]',
            target: '.pt_noti_high_signup'
        },
        {
            el: '[data-role-anchor="noti_recommend"]',
            target: '.pt_noti_recommend'
        },
        {
            el: '[data-role-anchor="noti_raffle"]',
            target: '.pt_noti_raffle'
        },
    ]);

    anchor.load([
        {
            url: 'Tabs9FE',
            target: '.sec_Tabs9FE',
            scroll: [-0, -100],
        },
        {
            url: 'Tabs9FE-notice',
            target: '.pt_noti_Tabs9FE',
            scroll: [-66, -100]
        },
        {
            url: 'assistpreviewer',
            target: '.sec_assistpreviewer',
            scroll: [-0, -100],
        },
        {
            url: 'assistpreviewer-notice',
            target: '.pt_noti_assistpreviewer',
            scroll: [-66, -100]
        },
        {
            url: 'assistreviewer',
            target: '.sec_assistreviewer',
            scroll: [-0, -100],
        },
        {
            url: 'assistreviewer-notice',
            target: '.pt_noti_assistreviewer',
            scroll: [-66, -100]
        },
        {
            url: 'nationalcollegeentranceexam',
            target: '.sec_exam',
            scroll: [66, 100]
        },
        {
            url: 'nationalcollegeentranceexam-notice',
            target: '.pt_noti_exam',
            scroll: [-20, -100]
        },
        {
            url: 'raffle',
            target: '.sec_raffle',
            scroll: [-0, -100]
        },
        {
            url: 'raffle-notice',
            target: '.pt_noti_raffle',
            scroll: [-20, -100]
        },
        {
            url: 'specialgift',
            target: '.sec_yearendgift',
            scroll: [-0, -100]
        },
        {
            url: 'friends-code',
            target: '.sec_recommend',
            scroll: [-0, -100]
        },
        {
            url: 'friends-code-notice',
            target: '.pt_noti_recommend',
            scroll: [-20, -100]
        },
        {
            url: 'newbie',
            target: '.sec_newsignup',
            scroll: [-0, -100]
        },
        {
            url: 'newbie-gift-notice',
            target: '.pt_noti_signup',
            scroll: [-20, -100]
        },
        {
            url: 'newbie-gift-high-notice',
            target: '.pt_noti_high_signup',
            scroll: [-20, -100]
        }
    ]);

      
  
    sticky.init();
    sns.init();

    // 카운트다운 타이머 설정
    //count.init('#count01', '2023/07/26 23:59:59');

    galcams.init(); // 갤캠스 필수 기능 호출


    /** 백그라운드 이미지에 lozad 적용 시 필요 함수 */
    const observerbg = lozad('.pt_bg-image', {
    loaded: function(el) {
            el.classList.add('pt_add-bg');
        }
    });
    observerbg.observe()
});


 
