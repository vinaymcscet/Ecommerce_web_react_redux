"use strict";(self.webpackChunkfikfis=self.webpackChunkfikfis||[]).push([[696],{8861:(e,l,n)=>{n.d(l,{A:()=>s});n(5043);var a=n(579);const s=e=>{let{type:l,value:n,varient:s,space:i,handleClick:t}=e;return(0,a.jsx)("div",{children:(0,a.jsx)("button",{type:l,className:`${s} ${i}`,onClick:t,children:n})})}},696:(e,l,n)=>{n.r(l),n.d(l,{default:()=>m});var a=n(5043),s=n(8861),i=n(927),t=n(9651),o=n(3003),r=n(3216),c=n(579);const m=()=>{const[e,l]=(0,a.useState)(!1),[n,m]=(0,a.useState)(!1),[d,h]=(0,a.useState)({fullName:"",email:"",phone:"",deletionReason:""}),[u,p]=(0,a.useState)({}),{user:x}=(0,o.d4)((e=>e.user)),j=(0,o.wA)();(0,r.Zp)();(0,a.useEffect)((()=>{j((0,t.dU)())}),[]);const N=e=>{const{name:l,value:n}=e.target;let a=n;"phone"===l&&/^\d+$/.test(n)&&!n.startsWith("+44")&&(a=`+44${n}`),h({...d,[l]:a})};return(0,c.jsxs)("div",{className:"deleteAccount",children:[(0,c.jsx)("h6",{children:"Delete Account"}),(0,c.jsx)("div",{className:"contactForm",children:(0,c.jsxs)("form",{onSubmit:e=>{e.preventDefault();const l=(()=>{let e={};return d.fullName.trim()||(e.fullName="Full Name is required"),d.email?/\S+@\S+\.\S+/.test(d.email)||(e.email="Email address is invalid"):e.email="Email is required",d.phone.trim()?/^\d{10}$/.test(d.phone)||d.phone.startsWith("+44")||(e.phone="Phone number is invalid, should be 10 digits and start with +44"):e.phone="Phone number is required",d.deletionReason||(e.deletionReason="Deletion reason is required"),n||(e.rememberMe="You must confirm your account deletion"),e})();if(Object.keys(l).length>0)p(l);else{const e={name:d.fullName,email:d.email,mobile:d.phone,reason:d.deletionReason};j((0,t.Vl)(e)),p({}),h({fullName:"",email:"",phone:"",deletionReason:""}),m(!1)}},children:[(0,c.jsxs)("div",{className:"box",children:[(0,c.jsxs)("div",{className:"form-control",children:[(0,c.jsx)("label",{htmlFor:"fullName",children:"Full Name"}),(0,c.jsx)("input",{type:"text",name:"fullName",placeholder:"Full Name",value:d.fullName,onChange:N}),u.fullName&&(0,c.jsx)("p",{className:"error",children:u.fullName})]}),(0,c.jsxs)("div",{className:"form-control",children:[(0,c.jsx)("label",{htmlFor:"email",children:"Email Id"}),(0,c.jsx)("input",{type:"email",name:"email",placeholder:"Email",value:d.email,onChange:N}),u.email&&(0,c.jsx)("p",{className:"error",children:u.email})]})]}),(0,c.jsxs)("div",{className:"box",children:[(0,c.jsxs)("div",{className:"form-control",children:[(0,c.jsx)("label",{htmlFor:"phone",children:"Mobile/Phone Number"}),(0,c.jsx)("input",{type:"text",name:"phone",placeholder:"Enter phone number",value:d.phone,onChange:N}),u.phone&&(0,c.jsx)("p",{className:"error",children:u.phone})]}),(0,c.jsxs)("div",{className:"form-control",children:[(0,c.jsx)("label",{htmlFor:"phone",children:"Deletion Reason"}),(0,c.jsxs)("select",{name:"deletionReason",id:"deletionReason",placeholder:"Select Deletion Reason",value:d.deletionReason,onChange:N,children:[(0,c.jsx)("option",{value:"",children:"Select Deletion Reason"}),i.Z0&&i.Z0.map((e=>(0,c.jsx)(c.Fragment,{children:(0,c.jsx)("option",{value:e.value,children:e.value})})))]}),u.deletionReason&&(0,c.jsx)("p",{className:"error",children:u.deletionReason})]})]}),(0,c.jsx)("div",{className:"box ",children:(0,c.jsxs)("div",{className:"notefrm",children:[(0,c.jsx)("p",{children:"Are you sure you want to delete the account?"}),(0,c.jsx)("p",{children:"Once you delete the account, there is no going back. Please be certain"})]})}),(0,c.jsx)("div",{className:"box",children:(0,c.jsxs)("div",{className:"authentication",children:[(0,c.jsxs)("label",{className:"round",children:[(0,c.jsx)("input",{type:"checkbox",name:"rememberMe",checked:n,onChange:e=>m(e.target.checked)}),(0,c.jsx)("span",{children:"I confirm my account deletion"})]}),u.rememberMe&&(0,c.jsx)("p",{className:"error",children:u.rememberMe})]})}),(0,c.jsx)(s.A,{type:"submit",value:"submit",varient:"explore contact",space:"sp-10"})]})})]})}}}]);
//# sourceMappingURL=696.f0c91ca8.chunk.js.map