# 갤캠스 혜택존

## 담당자

- 기획
  - 상원(김상원)
- 제작
  - 소이(박소연), 유미(이주희)

## 일정

- QA
  - 2023-12-29
- 라이브
  - 2023-01-01

## 페이지 경로

- https://www.samsungebiz.com/event/galaxycampus/eventList/galaxy_campus_benefitzone/ (이전버전)
- https://www.samsungebiz.com/event/galaxycampus/galaxy_campus_benefitzone/

## html/css/js 파일 정보

#### (라이브파일 / 연동된 파일 / 버전 설명 등 / 중요페이지 정보 작성)

-
-

## 이미지 경로

- //images.samsung.com/kdp/event/galaxycampus/2024/0101_benefitzone/

## FTP 경로

- images-sec.sftp.upload.akamai.com (EBIZ)
  - /2024/0101_benefitzone

## 이미지명

-

## 이미지 경량화 작업 참고

- img 태그에 사용 시
  1. html : 태그 안에 loading="lazy" 옵션 추가
  ```html
  <img src="./is/images/project_kv_bg_pc.jpg" alt="" loading="lazy" />
  ```
  2. js : 스와이퍼의 이미지는 해당 js에 아래 두 개의 옵션 추가
  ```js
  swiper = new Swiper('.slider', {
      preloadImages: false,
      lazy: true,
  }
  ```
- 백그라운드로 이미지를 넣었을 시
  1. HTML : bg를 사용하는 영역에 .pt_bg-image 추가
  ```html
  <div class="sec_pod pt_bg-image"></div>
  ```
  2. CSS : css에 해당 영역에 &.pt_bg-image.pt_add-bg {} 추가 하여 bg 관련 옵션만 선언 하여 pc/mo 각각 사용
  ```css
  .sec_pod {
    &.pt_bg-image.pt_add-bg {
      /* 백그라운드에 관련된 스타일만, 모바일도 동일한 방식으로 */
    }
  }
  ```
  3. JS : 최상단 html에서 lozad.min.js 스크립트 주석 해제 후 적용
  4. JS : 최상단 js 내에 observerbg 변수관련 함수 주석 해제 후 적용

## SB 및 시안 경로

- SB :
- 시안 :

* pc : https://xd.adobe.com/view/d803c70a-2fa8-485c-bd5a-05b98b987133-8d50/
* mo : https://xd.adobe.com/view/36cbed92-78c1-4d0a-8dba-1b0b2ed3808d-6398/


## 이벤트 번호

## 앵커드
+ 위치 이동 (유의사항)
  - .sec_samsung_card
  - .sec_card_benefit
  - .sec_point
  - .sec_samsungcard_notice01
  - .sec_benefit_notice
  - .sec_membership_notice

## 히스토리 ( 일시, 작업번호, QA URL, 내용, 작업자 순으로 기입)

- PRD (라이브서버)
  - 24/03/26
    - T20240326000001 / 홍성욱, 권제의
    - https://www.samsungebiz.com/event/galaxycampus/display/preview/5078893/
    - KV 날짜 변경, 결제일할인 대상카드 배너 삭제, KV국민카드 & 롯데카드 결제일 할인 및 12개월 무이자할부 추가, 추가된 카드 유의사항 추가
