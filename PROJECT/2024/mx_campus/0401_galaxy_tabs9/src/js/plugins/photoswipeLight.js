/*!
  * PhotoSwipe Lightbox 5.3.8 - https://photoswipe.com
  * (c) 2023 Dmytro Semenov
  */
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t="undefined"!=typeof globalThis?globalThis:t||self).PhotoSwipeLightbox=i()}(this,(function(){"use strict";function t(t,i,s){const h=document.createElement(i);return t&&(h.className=t),s&&s.appendChild(h),h}function i(t,i,s){t.style.width="number"==typeof i?`${i}px`:i,t.style.height="number"==typeof s?`${s}px`:s}const s="idle",h="loading",e="loaded",n="error";function o(t,i,s=document){let h=[];if(t instanceof Element)h=[t];else if(t instanceof NodeList||Array.isArray(t))h=Array.from(t);else{const e="string"==typeof t?t:i;e&&(h=Array.from(s.querySelectorAll(e)))}return h}function r(){return!(!navigator.vendor||!navigator.vendor.match(/apple/i))}class a{constructor(t,i){this.type=t,this.defaultPrevented=!1,i&&Object.assign(this,i)}preventDefault(){this.defaultPrevented=!0}}class c{constructor(i,s){if(this.element=t("pswp__img pswp__img--placeholder",i?"img":"div",s),i){const t=this.element;t.decoding="async",t.alt="",t.src=i,t.setAttribute("role","presentation")}this.element.setAttribute("aria-hidden","true")}setDisplayedSize(t,s){this.element&&("IMG"===this.element.tagName?(i(this.element,250,"auto"),this.element.style.transformOrigin="0 0",this.element.style.transform=function(t,i,s){let h=`translate3d(${t}px,${i||0}px,0)`;return void 0!==s&&(h+=` scale3d(${s},${s},1)`),h}(0,0,t/250)):i(this.element,t,s))}destroy(){this.element?.parentNode&&this.element.remove(),this.element=null}}class l{constructor(t,i,h){this.instance=i,this.data=t,this.index=h,this.element=void 0,this.placeholder=void 0,this.slide=void 0,this.displayedImageWidth=0,this.displayedImageHeight=0,this.width=Number(this.data.w)||Number(this.data.width)||0,this.height=Number(this.data.h)||Number(this.data.height)||0,this.isAttached=!1,this.hasSlide=!1,this.isDecoding=!1,this.state=s,this.data.type?this.type=this.data.type:this.data.src?this.type="image":this.type="html",this.instance.dispatch("contentInit",{content:this})}removePlaceholder(){this.placeholder&&!this.keepPlaceholder()&&setTimeout((()=>{this.placeholder&&(this.placeholder.destroy(),this.placeholder=void 0)}),1e3)}load(i,s){if(this.slide&&this.usePlaceholder())if(this.placeholder){const t=this.placeholder.element;t&&!t.parentElement&&this.slide.container.prepend(t)}else{const t=this.instance.applyFilters("placeholderSrc",!(!this.data.msrc||!this.slide.isFirstSlide)&&this.data.msrc,this);this.placeholder=new c(t,this.slide.container)}this.element&&!s||this.instance.dispatch("contentLoad",{content:this,isLazy:i}).defaultPrevented||(this.isImageContent()?(this.element=t("pswp__img","img"),this.displayedImageWidth&&this.loadImage(i)):(this.element=t("pswp__content","div"),this.element.innerHTML=this.data.html||""),s&&this.slide&&this.slide.updateContentSize(!0))}loadImage(t){if(!this.isImageContent()||!this.element||this.instance.dispatch("contentLoadImage",{content:this,isLazy:t}).defaultPrevented)return;const i=this.element;this.updateSrcsetSizes(),this.data.srcset&&(i.srcset=this.data.srcset),i.src=this.data.src??"",i.alt=this.data.alt??"",this.state=h,i.complete?this.onLoaded():(i.onload=()=>{this.onLoaded()},i.onerror=()=>{this.onError()})}setSlide(t){this.slide=t,this.hasSlide=!0,this.instance=t.pswp}onLoaded(){this.state=e,this.slide&&this.element&&(this.instance.dispatch("loadComplete",{slide:this.slide,content:this}),this.slide.isActive&&this.slide.heavyAppended&&!this.element.parentNode&&(this.append(),this.slide.updateContentSize(!0)),this.state!==e&&this.state!==n||this.removePlaceholder())}onError(){this.state=n,this.slide&&(this.displayError(),this.instance.dispatch("loadComplete",{slide:this.slide,isError:!0,content:this}),this.instance.dispatch("loadError",{slide:this.slide,content:this}))}isLoading(){return this.instance.applyFilters("isContentLoading",this.state===h,this)}isError(){return this.state===n}isImageContent(){return"image"===this.type}setDisplayedSize(t,s){if(this.element&&(this.placeholder&&this.placeholder.setDisplayedSize(t,s),!this.instance.dispatch("contentResize",{content:this,width:t,height:s}).defaultPrevented&&(i(this.element,t,s),this.isImageContent()&&!this.isError()))){const i=!this.displayedImageWidth&&t;this.displayedImageWidth=t,this.displayedImageHeight=s,i?this.loadImage(!1):this.updateSrcsetSizes(),this.slide&&this.instance.dispatch("imageSizeChange",{slide:this.slide,width:t,height:s,content:this})}}isZoomable(){return this.instance.applyFilters("isContentZoomable",this.isImageContent()&&this.state!==n,this)}updateSrcsetSizes(){if(!this.isImageContent()||!this.element||!this.data.srcset)return;const t=this.element,i=this.instance.applyFilters("srcsetSizesWidth",this.displayedImageWidth,this);(!t.dataset.largestUsedSize||i>parseInt(t.dataset.largestUsedSize,10))&&(t.sizes=i+"px",t.dataset.largestUsedSize=String(i))}usePlaceholder(){return this.instance.applyFilters("useContentPlaceholder",this.isImageContent(),this)}lazyLoad(){this.instance.dispatch("contentLazyLoad",{content:this}).defaultPrevented||this.load(!0)}keepPlaceholder(){return this.instance.applyFilters("isKeepingPlaceholder",this.isLoading(),this)}destroy(){this.hasSlide=!1,this.slide=void 0,this.instance.dispatch("contentDestroy",{content:this}).defaultPrevented||(this.remove(),this.placeholder&&(this.placeholder.destroy(),this.placeholder=void 0),this.isImageContent()&&this.element&&(this.element.onload=null,this.element.onerror=null,this.element=void 0))}displayError(){if(this.slide){let i=t("pswp__error-msg","div");i.innerText=this.instance.options?.errorMsg??"",i=this.instance.applyFilters("contentErrorElement",i,this),this.element=t("pswp__content pswp__error-msg-container","div"),this.element.appendChild(i),this.slide.container.innerText="",this.slide.container.appendChild(this.element),this.slide.updateContentSize(!0),this.removePlaceholder()}}append(){if(this.isAttached||!this.element)return;if(this.isAttached=!0,this.state===n)return void this.displayError();if(this.instance.dispatch("contentAppend",{content:this}).defaultPrevented)return;const t="decode"in this.element;this.isImageContent()?t&&this.slide&&(!this.slide.isActive||r())?(this.isDecoding=!0,this.element.decode().catch((()=>{})).finally((()=>{this.isDecoding=!1,this.appendImage()}))):this.appendImage():this.slide&&!this.element.parentNode&&this.slide.container.appendChild(this.element)}activate(){!this.instance.dispatch("contentActivate",{content:this}).defaultPrevented&&this.slide&&(this.isImageContent()&&this.isDecoding&&!r()?this.appendImage():this.isError()&&this.load(!1,!0),this.slide.holderElement&&this.slide.holderElement.setAttribute("aria-hidden","false"))}deactivate(){this.instance.dispatch("contentDeactivate",{content:this}),this.slide&&this.slide.holderElement&&this.slide.holderElement.setAttribute("aria-hidden","true")}remove(){this.isAttached=!1,this.instance.dispatch("contentRemove",{content:this}).defaultPrevented||(this.element&&this.element.parentNode&&this.element.remove(),this.placeholder&&this.placeholder.element&&this.placeholder.element.remove())}appendImage(){this.isAttached&&(this.instance.dispatch("contentAppendImage",{content:this}).defaultPrevented||(this.slide&&this.element&&!this.element.parentNode&&this.slide.container.appendChild(this.element),this.state!==e&&this.state!==n||this.removePlaceholder()))}}function d(t,i,s,h,e){let n=0;if(i.paddingFn)n=i.paddingFn(s,h,e)[t];else if(i.padding)n=i.padding[t];else{const s="padding"+t[0].toUpperCase()+t.slice(1);i[s]&&(n=i[s])}return Number(n)||0}class u{constructor(t,i,s,h){this.pswp=h,this.options=t,this.itemData=i,this.index=s,this.panAreaSize=null,this.elementSize=null,this.fit=1,this.fill=1,this.vFill=1,this.initial=1,this.secondary=1,this.max=1,this.min=1}update(t,i,s){const h={x:t,y:i};this.elementSize=h,this.panAreaSize=s;const e=s.x/h.x,n=s.y/h.y;this.fit=Math.min(1,e<n?e:n),this.fill=Math.min(1,e>n?e:n),this.vFill=Math.min(1,n),this.initial=this.t(),this.secondary=this.i(),this.max=Math.max(this.initial,this.secondary,this.o()),this.min=Math.min(this.fit,this.initial,this.secondary),this.pswp&&this.pswp.dispatch("zoomLevelsUpdate",{zoomLevels:this,slideData:this.itemData})}l(t){const i=t+"ZoomLevel",s=this.options[i];if(s)return"function"==typeof s?s(this):"fill"===s?this.fill:"fit"===s?this.fit:Number(s)}i(){let t=this.l("secondary");return t||(t=Math.min(1,3*this.fit),this.elementSize&&t*this.elementSize.x>4e3&&(t=4e3/this.elementSize.x),t)}t(){return this.l("initial")||this.fit}o(){return this.l("max")||Math.max(1,4*this.fit)}}function p(t,i,s){const h=i.createContentFromData(t,s);let e;const{options:n}=i;if(n){let o;e=new u(n,t,-1),o=i.pswp?i.pswp.viewportSize:function(t,i){if(t.getViewportSizeFn){const s=t.getViewportSizeFn(t,i);if(s)return s}return{x:document.documentElement.clientWidth,y:window.innerHeight}}(n,i);const r=function(t,i,s,h){return{x:i.x-d("left",t,i,s,h)-d("right",t,i,s,h),y:i.y-d("top",t,i,s,h)-d("bottom",t,i,s,h)}}(n,o,t,s);e.update(h.width,h.height,r)}return h.lazyLoad(),e&&h.setDisplayedSize(Math.ceil(h.width*e.initial),Math.ceil(h.height*e.initial)),h}return class extends class extends class{constructor(){this.u={},this.p={},this.pswp=void 0,this.options=void 0}addFilter(t,i,s=100){this.p[t]||(this.p[t]=[]),this.p[t]?.push({fn:i,priority:s}),this.p[t]?.sort(((t,i)=>t.priority-i.priority)),this.pswp?.addFilter(t,i,s)}removeFilter(t,i){this.p[t]&&(this.p[t]=this.p[t].filter((t=>t.fn!==i))),this.pswp&&this.pswp.removeFilter(t,i)}applyFilters(t,...i){return this.p[t]?.forEach((t=>{i[0]=t.fn.apply(this,i)})),i[0]}on(t,i){this.u[t]||(this.u[t]=[]),this.u[t]?.push(i),this.pswp?.on(t,i)}off(t,i){this.u[t]&&(this.u[t]=this.u[t].filter((t=>i!==t))),this.pswp?.off(t,i)}dispatch(t,i){if(this.pswp)return this.pswp.dispatch(t,i);const s=new a(t,i);return this.u[t]?.forEach((t=>{t.call(this,s)})),s}}{getNumItems(){let t=0;const i=this.options?.dataSource;i&&"length"in i?t=i.length:i&&"gallery"in i&&(i.items||(i.items=this.m(i.gallery)),i.items&&(t=i.items.length));const s=this.dispatch("numItems",{dataSource:i,numItems:t});return this.applyFilters("numItems",s.numItems,i)}createContentFromData(t,i){return new l(t,this,i)}getItemData(t){const i=this.options?.dataSource;let s={};Array.isArray(i)?s=i[t]:i&&"gallery"in i&&(i.items||(i.items=this.m(i.gallery)),s=i.items[t]);let h=s;h instanceof Element&&(h=this.g(h));const e=this.dispatch("itemData",{itemData:h||{},index:t});return this.applyFilters("itemData",e.itemData,t)}m(t){return this.options?.children||this.options?.childSelector?o(this.options.children,this.options.childSelector,t)||[]:[t]}g(t){const i={element:t},s="A"===t.tagName?t:t.querySelector("a");if(s){i.src=s.dataset.pswpSrc||s.href,s.dataset.pswpSrcset&&(i.srcset=s.dataset.pswpSrcset),i.width=s.dataset.pswpWidth?parseInt(s.dataset.pswpWidth,10):0,i.height=s.dataset.pswpHeight?parseInt(s.dataset.pswpHeight,10):0,i.w=i.width,i.h=i.height,s.dataset.pswpType&&(i.type=s.dataset.pswpType);const h=t.querySelector("img");h&&(i.msrc=h.currentSrc||h.src,i.alt=h.getAttribute("alt")??""),(s.dataset.pswpCropped||s.dataset.cropped)&&(i.thumbCropped=!0)}return this.applyFilters("domItemData",i,t,s)}lazyLoadData(t,i){return p(t,this,i)}}{constructor(t){super(),this.options=t||{},this.v=0,this.shouldOpen=!1,this._=void 0,this.onThumbnailsClick=this.onThumbnailsClick.bind(this)}init(){o(this.options.gallery,this.options.gallerySelector).forEach((t=>{t.addEventListener("click",this.onThumbnailsClick,!1)}))}onThumbnailsClick(t){if(function(t){return"button"in t&&1===t.button||t.ctrlKey||t.metaKey||t.altKey||t.shiftKey}(t)||window.pswp)return;let i={x:t.clientX,y:t.clientY};i.x||i.y||(i=null);let s=this.getClickedIndex(t);s=this.applyFilters("clickedIndex",s,t,this);const h={gallery:t.currentTarget};s>=0&&(t.preventDefault(),this.loadAndOpen(s,h,i))}getClickedIndex(t){if(this.options.getClickedIndexFn)return this.options.getClickedIndexFn.call(this,t);const i=t.target,s=o(this.options.children,this.options.childSelector,t.currentTarget).findIndex((t=>t===i||t.contains(i)));return-1!==s?s:this.options.children||this.options.childSelector?-1:0}loadAndOpen(t,i,s){return!window.pswp&&(this.options.index=t,this.options.initialPointerPos=s,this.shouldOpen=!0,this.preload(t,i),!0)}preload(t,i){const{options:s}=this;i&&(s.dataSource=i);const h=[],e=typeof s.pswpModule;if("function"==typeof(n=s.pswpModule)&&n.prototype&&n.prototype.goTo)h.push(Promise.resolve(s.pswpModule));else{if("string"===e)throw new Error("pswpModule as string is no longer supported");if("function"!==e)throw new Error("pswpModule is not valid");h.push(s.pswpModule())}var n;"function"==typeof s.openPromise&&h.push(s.openPromise()),!1!==s.preloadFirstSlide&&t>=0&&(this._=function(t,i){const s=i.getItemData(t);if(!i.dispatch("lazyLoadSlide",{index:t,itemData:s}).defaultPrevented)return p(s,i,t)}(t,this));const o=++this.v;Promise.all(h).then((t=>{if(this.shouldOpen){const i=t[0];this.I(i,o)}}))}I(t,i){if(i!==this.v&&this.shouldOpen)return;if(this.shouldOpen=!1,window.pswp)return;const s="object"==typeof t?new t.default(this.options):new t(this.options);this.pswp=s,window.pswp=s,Object.keys(this.u).forEach((t=>{this.u[t]?.forEach((i=>{s.on(t,i)}))})),Object.keys(this.p).forEach((t=>{this.p[t]?.forEach((i=>{s.addFilter(t,i.fn,i.priority)}))})),this._&&(s.contentLoader.addToCache(this._),this._=void 0),s.on("destroy",(()=>{this.pswp=void 0,delete window.pswp})),s.init()}destroy(){this.pswp?.destroy(),this.shouldOpen=!1,this.u={},o(this.options.gallery,this.options.gallerySelector).forEach((t=>{t.removeEventListener("click",this.onThumbnailsClick,!1)}))}}}));