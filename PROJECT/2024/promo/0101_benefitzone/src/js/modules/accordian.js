import { PT_STATE, util as _} from './bs_common';

export const accordian = {
    /**
     * 토글 버튼 클릭 시 페이지 내 data-target show/hide
     * @param {object} params {'target': str, 'speed': num, 'group': str, 'openFocus': str, 'open': boolean}
     * @desc target : 해당 타켓
     * @desc speed : 토글 속도
     * @desc group : 그룹 지정시 동일한 그룹명 지정
     * @desc openFocus : 토글 오픈 후 컨텐츠 타켓
     * @desc open : 페이지 로드 후 컨텐츠 오픈 유무
     */
    toggle(params) {
        _.setEventState('clickToggle', params);

        const data = {
            opt: {
                // speed: 0,
                openFocus: false,
                open: false,
            },
            params: _.getEventState('clickToggle')
        };

        //토글 열기
        PT_STATE.$PROJECT.off('click.toggleAcc').on('click.toggleAcc', '[data-role-accordian]', function (e) {
            e.preventDefault();
            const $this = $(this);
            const { target, speed = data.opt.speed, openFocus = data.opt.openFocus, group } = _.findItem(data.params, 'el', `[data-role-accordian="${$this.attr('data-role-accordian')}"]`);

            if (group && !$this.hasClass('active')) {
                const arr = Object.values(data.params).filter(item => item.group === group);

                arr.forEach(item => {
                    $(item.el).removeClass('active');
                    $(item.target).stop().slideUp(speed);
                });
            }
            
            $this.toggleClass('active');
            if ($this.hasClass('active')){
                $this.text('유의사항 닫기');
                $this.attr('title', '유의사항 닫기');
            } else {
                $this.text('유의사항 열기');
                $this.attr('title', '유의사항 열기');
            }
            $this.hasClass('active') ? $(target).stop().slideDown(speed) : $(target).stop().slideUp(speed);
            // 240226 토글시 포커스 이동 안하도록 요청받아서 주석처리함 - erica
            // $('html, body').stop().animate({ scrollTop: $(target).is(':visible') && openFocus ? $(target).offset().top : $this.offset().top }, 500);
        });

        //토글 닫기
        PT_STATE.$PROJECT.off('click.closeAcc').on('click.closeAcc', '[data-role-accordianClose]', function (e) {
            e.preventDefault();
            const $this = $(this);
            const target = $this.attr('data-role-accordianClose');
            $(`[data-role-accordian="${target}"]`).click().focus();
        });

        //토글 컨탠츠 hide 처리
        PT_STATE.$PROJECT.find('[data-role-accordian]').each(function () {
            const $this = $(this);
            const { target, open = data.opt.open} = _.findItem(data.params, 'el', `[data-role-accordian="${$this.attr('data-role-accordian')}"]`);

            open ? $this.addClass('active') : $(target).hide();
        });
    },
};