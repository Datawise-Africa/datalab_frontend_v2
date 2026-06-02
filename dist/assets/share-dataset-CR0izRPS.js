import{f as l,j as s,c as i,X as n,P as d}from"./index-vXA_btNS.js";import{B as h}from"./building-DOKKLYvk.js";/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}]],x=l("clipboard",u);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],p=l("globe",y);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]],m=l("graduation-cap",g);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]],N=l("users",v);function b({company:c,non_profit:r,students:o,public:j}){const e="text-[10px]",a="h-3 w-3",t="flex items-center gap-1 text-gray-500 dark:text-gray-400 border border-[0.8px] border-primary/10 rounded px-1 py-1";return s.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[c?s.jsxs("div",{className:t,children:[s.jsx(h,{className:a})," ",s.jsx("span",{className:e,children:"Company"})," ",s.jsx(i,{className:a+" text-green-500"})]}):s.jsxs("div",{className:t,children:[" ",s.jsx(h,{className:a})," ",s.jsx("span",{className:e,children:"Company"})," ",s.jsx(n,{className:a+" text-red-500"})]}),r?s.jsxs("div",{className:t,children:[s.jsx(N,{className:a})," ",s.jsx("span",{className:e,children:"Non-Profit"})," ",s.jsx(i,{className:a+" text-green-500"})]}):s.jsxs("div",{className:t,children:[s.jsx(N,{className:a})," ",s.jsx("span",{className:e,children:"Non-Profit"})," ",s.jsx(n,{className:a+" text-red-500"})]}),o?s.jsxs("div",{className:t,children:[s.jsx(m,{className:a})," ",s.jsx("span",{className:e,children:"Students"})," ",s.jsx(i,{className:a+" text-green-500"})]}):s.jsxs("div",{className:t,children:[s.jsx(m,{className:a})," ",s.jsx("span",{className:e,children:"Students"})," ",s.jsx(n,{className:a+" text-red-500"})]}),j?s.jsxs("div",{className:t,children:[s.jsx(p,{className:a})," ",s.jsx("span",{className:e,children:"Public"})," ",s.jsx(i,{className:a+" text-green-500"})]}):s.jsxs("div",{className:t,children:[s.jsx(p,{className:a})," ",s.jsx("span",{className:e,children:"Public"})," ",s.jsx(n,{className:a+" text-red-500"})]})]})}async function w(c){const r={title:`Dataset: ${c.title}`,text:`Check out this dataset: ${c.description.slice(0,100)}...`,url:`${window.location.origin}/datasets/${c.id}`};try{navigator.share&&navigator.canShare&&navigator.canShare(r)?(await navigator.share(r),d.success("Dataset shared successfully!",{duration:3e3,position:"top-right",icon:s.jsx(x,{className:"h-4 w-4"})})):(await navigator.clipboard.writeText(r.url),d.success("Dataset link copied to clipboard!",{duration:3e3,position:"top-right",icon:s.jsx(x,{className:"h-4 w-4"})}))}catch(o){console.error("Error sharing dataset:",o),d.error("Failed to share dataset. Please try again.",{duration:3e3,position:"top-right",icon:s.jsx(x,{className:"h-4 w-4"})})}}export{p as G,N as U,m as a,b as g,w as s};
