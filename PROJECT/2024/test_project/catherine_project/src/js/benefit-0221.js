// BS default 모듈
import { PT_STATE, util as _ } from './modules/bs_common';
import { anchor } from './modules/anchor';
import { accordian } from './modules/accordian';
import { tab } from './modules/tab';

$(document).ready(function(){
    anchor.load([
        {
            url: 'test01',
            target: '.sec_anchor'
        },
        {
            url: 'test02',
            target: '.sec_accordian',
            scroll: [0, -50]
        },
    ]);

    accordian.toggle([
        {
            el: '[data-role-accordian="sec_accordian01"]',
            target: '#toggle01'
        },
        {
            el: '[data-role-accordian="sec_accordian02"]',
            target: '#toggle02',
            speed: 0
        },
        {
            el: '[data-role-accordian="sec_accordian03"]',
            target: '#toggle03',
            group: 'group01'
        },
        {
            el: '[data-role-accordian="sec_accordian04"]',
            target: '#toggle04',
            group: 'group01'
        },
        {
            el: '[data-role-accordian="sec_accordian05"]',
            target: '#toggle05',
            openFocus: 'toggle05'
        },
        {
            el: '[data-role-accordian="sec_accordian06"]',
            target: '#toggle06',
            openFocus: 'toggle06',
        },
        {
            el: '[data-role-accordian="sec_accordian07"]',
            target: '#toggle07',
            open: true
        },
        {
            el: '[data-role-accordian="sec_button_test"]',
            target: '#button01'
        }
    ]);

    tab.click([
        {
            el: '[data-role-tab="benefit"]',
            target: '#bnf_contents',
            anc: true
        },
    ]);

    viewportChange(); // fold 해상도 대응
});