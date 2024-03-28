# 갤캠스2.0 리뉴얼 이벤트

## 담당자
+ 기획
  - 데미안(한종우), 에밀리(안수희)
+ 제작
  - 유미(이주희), 에런(우해민)


## 일정
+ QA
  - 2024-01-01
+ 라이브
  - 2024-01-01


## 페이지 경로
+ https://www.samsungebiz.com/event/galaxycampus/gcseventhub/


## html/css/js 파일 정보
#### (라이브파일 / 연동된 파일 / 버전 설명 등 / 중요페이지 정보 작성)
-
-


## 이미지 경로
+ //images.samsung.com/kdp/event/galaxycampus/2024/0101_galcams_event/


## FTP 경로
+ images-sec.sftp.upload.akamai.com (EBIZ)
  - /2024/0101_galcams_event


## 이미지명
+ gce\_


## SB 및 시안 경로
+ SB :
  - 24/02/01 : \\121.252.119.19\2023\_갤럭시캠퍼스스토어\@퍼블팀 공유 폴더\03. 이벤트 허브페이지\2024\2월
+ 시안 :
  - 24/00/00 00:00 PC : https://xd.adobe.com/view/cbfe4632-dd52-449b-804f-0c45fbaf5bfc-9ead/


## 이벤트 번호
회원 여부 체크가 필요한 이벤트 번호는 html, js 코드 참고
```html
<a onclick="ajax.call(optionsRaffle1);">
<!-- 1. ajax.call() 안에 함수 명과 -->
```
```js
	var optionsRaffle1 = {
    // 1. 함수명 통일 시키기
		url : "/event/galaxycampus/xhr/member/getSession",
		type: "POST",
		done : function(data){
			var session = JSON.parse(data);
			var returnUrl = window.location.pathname;
			
			if (session.mbrNo == 0) {
				alert("로그인 후\n참여 가능합니다.");
				location.href='https://www.samsungebiz.com/event/galaxycampus/member/introPage/?loginType=GCS&returnUrl='+returnUrl;
			} else if (session.gcsMbrNo == 0) {
				alert("갤럭시캠퍼스 회원만 이용 가능합니다");
				location.href='https://www.samsungebiz.com/event/galaxycampus/member/loginDocumentEmailCheck';
			} else {
				// 2. 이벤트 번호 작성
        fnCallPop8(1515)
			}
		}
	};
```

+ 24/02/29
  - 꿀팁 제보하기: modal.html / optionsModal1 / fnCallPop14(1450)
  - 픽업 구매 후기 인증: modal.html / optionsModal2 / fnCallPop14(1449)
  - 가입 선물 받기: newsignup.html / optionsNewSignUp / fnCallPop8(1513)
  - 래플이벤트1 : raffle.html / optionsRaffle1 / fnCallPop8(1515)
  - 래플이벤트2 : raffle.html / optionsRaffle2 / fnCallPop8(1516)
  - 래플이벤트3 : raffle.html / optionsRaffle3 / fnCallPop8(1517)
  - 래플이벤트4 : raffle.html / optionsRaffle4 / fnCallPop8(1518)
  - 래플이벤트5 : raffle.html / optionsRaffle5 / fnCallPop8(1519)
  - 래플이벤트6 : raffle.html / optionsRaffle6 / fnCallPop8(1520)


## 앵커드
+ 위치 이동 (네비바) 
event.json의 name
  - .sec_gcsfestival
  - .sec_friendrefers
  - .sec_newsignup
  - .sec_raffle

+ 위치 이동 (인트로)
event.json의 name
  - .sec_gcsfestival
  - .sec_friendrefers
  - .sec_newsignup
  - .sec_raffle

+ 위치 이동 (유의사항)
  - .pt_noti_gcsfestival
  - .pt_noti_friendrefers
  - .pt_noti_signup
  - .pt_noti_raffle

+ 앵커드 (url)
  - /?gcsfestival : .sec_gcsfestival
  - /?friendrefers : .sec_friendrefers
  - /?raffle : .sec_raffle
  - /?newbie : .sec_newsignup


## 히스토리

- 23/12/28

  - T20231228000010 / 에런, 유미
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5073944/
  - 래플이벤트, 신규가입이벤트 제외 모두 삭제
  - 신규가입 이벤트 쿠폰 이미지 변경
  - 래플 상품 및 CTA값, 알트값 변경
  - 래플 디스클라이머 내용 변경
  - 유의사항 내용 수정 및 래플, 신규가입이벤트 제외 모두 삭제
  - 카카오톡 이미지 변경
  - 신규가입혜택 유의사항 보기 가운데 정렬
  - 신규가입혜택 모바일 pagination bullet 제거

  * 24/01/02

  - T20231228000010 / 에런, 유미
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5073944/
  - 갤럭시 탭 S9 FE | FE+ 이벤트 페이지 추가
  - 추가된 이벤트 페이지 인트로 카드 desc 줄바꿈 변경 처리
  - 옴니값, 알트값 수급 및 적용
  - 유의사항 "갤럭시 탭 S9 FE | FE+ 밸런스 게임" 내용 추가
  - 갤럭시 탭 S9 FE | FE+ 이벤트 페이지, 인트로 카드 배경이미지 변경 3트
  - 인트로 카드 desc 문구 수정
  - 날짜 수정 01.04 -> 01.03
  - 모바일 신규 가입 혜택 스와이퍼 드래그 기능 제거
  - 모바일 네비바 justify-content 위치 변경

  * 24/01/10

  - T20240110000007 / 에런, 유미
  - 인트로 영역 - 갤럭시 탭 S9 FE | FE+ 이미지 교체, 텍스트 수정
  - 이벤트01번(갤럭시 탭 S9 FE | FE+) 영역 - 텍스트 수정

  * 24/01/11

  - T20240111000001 / 에런, 유미
  - 인트로 영역 - 갤럭시 탭 S9 FE | FE+ 이미지 교체, 텍스트 수정
  - 이벤트01번(갤럭시 탭 S9 FE | FE+) 영역 - 텍스트 수정, 이미지 교체

  - T20240111000010 / 소이
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5074800/
  - 이벤트01번(갤럭시 탭 S9 FE | FE+) 영역 - 텍스트 수정

  * 24/01/12

  - T20240112000006 / 에런, 유미
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5074811/
  - 이벤트01번(갤럭시 탭 S9 FE | FE+) 영역 - 틴틴팅글 -> 틴틴팅클 수정
  - 유의사항 문구 수정

  * 24/01/17

  - T20240117000005 / 토미, 에런, 유미
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5074963/
  - 이벤트 영역 추가 & 이벤트 넘버 변경
  - 유레카 어시스트 영역 프리뷰어 추가
  - 유레카 영역 문구 및 이미지 삽입
  - 틴틴팅클 템플릿 문구 수정
  - 유레카 어시스트 리뷰어 추가
  - 신규가입 혜택 네이버페이 이미지 변경
  - 유의사항 문구 수정

* 24/01/18

  - T20240118000011 / 에런, 소이
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5075172/
  - 갤럭시 S24 AI 꿀팁 , 갤럭시 S24 매장 픽업 후기 영역 추가
  - 응모하기 버튼 추가로 모달 관련 소스 추가
  - 유의사항 문구 수정
  - 이벤트영역 03, 04 이미지 화질 개선 디자인 수급 및 적용
  - 카드영역 3, 5번 줄바꿈 및 네이버페이 텍스트 수정

* 24/01/18

  - T20240119000019 / 에런, 소이
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5075300/
  - 응모하기 팝업내 문구 수정 및 타이틀 부분 너비 수정

* 24/01/24

  - T20240122000003 / 소이, 유미
  - [01/25 러닝체인지]
  - 프리뷰어 삭제
  - 회원 여부 체크 - 꿀팁 제보하기 / 매장픽업후기인증 / 0원 래플 전체 / 신규가입

* 24/01/25

  - T20240124000015 / 소이, 유미
  - [01/26 러닝체인지]
  - 리뷰어 삭제
  - 래플 영역 - 나이키 가격 수정(139,900)

* 24/01/30

  - T20240129000007 / 소이, 유미
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5075627/
  - [02/01 러닝체인지]
  - 이벤트 영역 - 틴틴팅클 삭제, 래플 영역 - 래플 이벤트 변경, 유의사항 영역 - 갤럭시 탭 S9 FE | FE+ 삭제

* 24/02/02

  - T20240201000004 / 소이, 유미
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5075992/
  - [02/02 러닝체인지]
  -

* 24/02/07

  - T20240206000003 / 소이
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5076410/
  - 릴스 이벤트 연장으로 텍스트 수정

* 24/02/16

  - T20240214000004 / 아이비
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5076735/
  - 2/19 타겟 갤신페 추가
  - 갤신페+친구추천 내비, 인트로, 이벤트, 유의사항, 앵커드, 앵커드url 추가
  - 이벤트 넘버링
  - 친구추천 이벤트 다섯번째줄 유의사항 문구 수정

* 24/02/20

  - T20240220000005 / 유미
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5076887/
  - Galaxy S24 Series AI 꿀팁 제보 / Galaxy S24 Series 매장 픽업 후기 삭제 (이벤트, 유의사항)

* 24/02/26

  - T20240226000003 / 소이
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5077128/
  - 릴스챌린지,어시스트 프리뷰어 삭제
  - 래플이벤트 상품 및 이벤트번호 변경
  - 래플영역 html 구조 및 css수정
  - 전체적인 기간 수정
  - 갤신페 인트로 이미지 2배 사이즈로 교체

* 24/02/27

  - T20240226000003 / 소이
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5077128/
  - 래플경품 5,6번 순서 변경

* 24/03/06

  - T20240306000004 / 캐리아(유태헌), 캐서린(권제의)
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5077809/
  - 갤캠스 이벤트 허브페이지_0308_S24 AI 레시피 추가

* 24/03/07

  - T20240306000004 / 캐리아(유태헌), 캐서린(권제의)
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5077809/
  - 유의사항 수정
  - url, 옴니값 수정
  - 레시피 배너 이미지 수정

* 24/03/13

  - T20240313000001 / 캐서린(권제의)
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5077991/
  - 대학교 대항전, 친구추천 이벤트 삭제

* 24/03/19

  - T20240318000015 / 캐서린(권제의)
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5078314/
  - 갤캠스ㅣ배그 콜라보 이벤트 추가, 전체 이벤트 넘버 조정

* 24/03/20

  - T20240318000015 / 캐서린(권제의)
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5078314/
  - 유의사항 수정

* 24/03/20

  - T20240320000008 / 아이비(한지은)
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5078721/
  - 배그 기프트카드 관련 유의사항 두줄 수정
  - 배그 기프트카드 관련 유의사항 재수정
  - 배그 구매혜택 두번째 줄 새 문구 추가

* 24/03/22

  - T20240322000007 / 캐서린(권제의)
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5078830/
  - 배그 유의사항 수정

* 24/03/26

  - T20240325000007 / 캐서린(권제의)
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5078848/
  - 삼성월렛 이벤트 추가, 유의사항 추가, 전체 이벤트 넘버 조정

* 24/03/27

  - T20240325000007 / 캐서린(권제의)
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5078848/
  - 유의사항 수정

* 24/03/28

  - T20240328000004 / 캐서린(권제의)
  - https://www.samsungebiz.com/event/galaxycampus/display/preview/5080193/
  - 04/01 러닝체인지 작업 (KV 일정 수정 및 레시피, 래플, 신규가입 이벤트 내용 수정)