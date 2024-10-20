import{r as n,j as e}from"./index-B1pHpRNp.js";import{A as h}from"./AppProxyProvider-B3Vse2uB.js";import{a as y,b as x,c as f,d as S,_ as j,e as w,M as g,L as k,O as M,S as v}from"./components-BjFc177o.js";import"./AppProvider-Dc7-XUoz.js";import"./context-BvNBXPIc.js";/**
 * @remix-run/react v2.12.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let a="positions";function L({getKey:t,...l}){let{isSpaMode:c}=y(),o=x(),p=f();S({getKey:t,storageKey:a});let d=n.useMemo(()=>{if(!t)return null;let s=t(o,p);return s!==o.key?s:null},[]);if(c)return null;let m=((s,u)=>{if(!window.history.state||!window.history.state.key){let r=Math.random().toString(32).slice(2);window.history.replaceState({key:r},"")}try{let i=JSON.parse(sessionStorage.getItem(s)||"{}")[u||window.history.state.key];typeof i=="number"&&window.scrollTo(0,i)}catch(r){console.error(r),sessionStorage.removeItem(s)}}).toString();return n.createElement("script",j({},l,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${m})(${JSON.stringify(a)}, ${JSON.stringify(d)})`}}))}function _(){const{apiKey:t}=w();return e.jsxs("html",{children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width,initial-scale=1"}),e.jsx("link",{rel:"preconnect",href:"https://cdn.shopify.com/"}),e.jsx("link",{rel:"stylesheet",href:"https://cdn.shopify.com/static/fonts/inter/v4/styles.css"}),e.jsx(g,{}),e.jsx(k,{})]}),e.jsx("body",{children:e.jsxs(h,{apiKey:t||"",isEmbeddedApp:!0,children:[e.jsx(M,{}),e.jsx(L,{}),e.jsx(v,{})]})})]})}export{_ as default};
