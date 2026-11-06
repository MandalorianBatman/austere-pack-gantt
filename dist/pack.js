(()=>{var J=Object.create;var y=Object.defineProperty;var P=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var j=Object.getPrototypeOf,X=Object.prototype.hasOwnProperty;var g=(a,n)=>()=>{try{return n||a((n={exports:{}}).exports,n),n.exports}catch(r){throw n=0,r}};var B=(a,n,r,o)=>{if(n&&typeof n=="object"||typeof n=="function")for(let t of R(n))!X.call(a,t)&&t!==r&&y(a,t,{get:()=>n[t],enumerable:!(o=P(n,t))||o.enumerable});return a};var d=(a,n,r)=>(r=a!=null?J(j(a)):{},B(n||!a||!a.__esModule?y(r,"default",{value:a,enumerable:!0}):r,a));var G=g((tt,D)=>{var T=globalThis.__austereHost;if(!T)throw new Error("this austere-axi component pack needs the austere-axi runtime on the page");D.exports=T.React});var $=g((et,N)=>{var M=globalThis.__austereHost;if(!M)throw new Error("this austere-axi component pack needs the austere-axi runtime on the page");N.exports=M.zod});var f=g((at,_)=>{var Y=globalThis.__austereHost;if(!Y)throw new Error("this austere-axi component pack needs the austere-axi runtime on the page");_.exports=Y.pack});var w=g((rt,L)=>{var E=globalThis.__austereHost;if(!E)throw new Error("this austere-axi component pack needs the austere-axi runtime on the page");L.exports=E.jsxRuntime});var st=d(G()),p=d($()),x=d(f());var C=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function O(a){let n=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(a??"").trim());if(!n)return null;let[r,o,t]=[Number(n[1]),Number(n[2]),Number(n[3])],i=Date.UTC(r,o-1,t),e=new Date(i);return e.getUTCFullYear()!==r||e.getUTCMonth()!==o-1||e.getUTCDate()!==t?null:i/864e5}var b=a=>new Date(a*864e5);function h(a,n=!1){let r=b(a);return n?C[r.getUTCMonth()]:`${C[r.getUTCMonth()]} ${r.getUTCDate()}`}var A=a=>b(a).getUTCDay()===1,S=a=>b(a).getUTCDate()===1,U=8;function I(a,n){let r=[];for(let e=a;e<=n;e++)r.push(e);let o=[{keep:()=>!0,monthOnly:!1},{keep:e=>(e-a)%2===0,monthOnly:!1},{keep:A,monthOnly:!1},{keep:e=>A(e)&&Math.round(e/7)%2===0,monthOnly:!1},{keep:S,monthOnly:!0}];for(let e of o){let l=r.filter(e.keep);if(l.length&&l.length<=U)return l.map(m=>({day:m,label:h(m,e.monthOnly)}))}let t=r.filter(S),i=Math.ceil(t.length/U)||1;return t.filter((e,l)=>l%i===0).map(e=>({day:e,label:h(e,!0)}))}var K=a=>Math.min(100,Math.max(0,Number(a)||0));function z(a){let n=a.map(e=>{let l=O(e.start),m=String(e.end??"").trim()!=="",k=m?O(e.end):l,u={name:String(e.name??""),owner:String(e.owner??""),progress:K(e.progress),milestone:!m};return l===null?{...u,error:`start "${e.start??""}" is not YYYY-MM-DD`}:k===null?{...u,error:`end "${e.end}" is not YYYY-MM-DD`}:k<l?{...u,error:"ends before it starts"}:{...u,start:l,end:k}}),r=n.filter(e=>!e.error);if(!r.length)return null;let o=Math.min(...r.map(e=>e.start)),t=Math.max(...r.map(e=>e.end)),i=t-o+1;return{first:o,last:t,span:i,ticks:I(o,t),rows:n.map(e=>e.error?e:{...e,left:(e.start-o)/i*100,width:(e.end-e.start+1)/i*100,startLabel:h(e.start),endLabel:h(e.end)})}}var s=d(w()),Q=()=>null,v=(0,x.austereComponent)({name:"GanttTask",group:"Data",props:p.z.object({name:p.z.string(),start:p.z.string(),end:p.z.string().optional(),progress:p.z.number().optional(),owner:p.z.string().optional()}),description:'One bar in a Gantt. start and end are "YYYY-MM-DD" (end inclusive; omit or "" for a one-day milestone). progress is 0-100; owner is a short label.',renderer:Q,slots:null,tagged:!1});function V({props:a}){let n=(Array.isArray(a.tasks)?a.tasks:[]).filter(t=>t&&t.props).map(t=>t.props),r=z(n),o=r?r.rows:n.map(t=>({name:String(t.name??""),owner:String(t.owner??""),error:"no task has valid dates"}));return(0,s.jsxs)("div",{className:"pack-gantt",children:[a.title?(0,s.jsx)("div",{className:"pack-gantt-title",children:a.title}):null,r?(0,s.jsxs)("div",{className:"pack-gantt-row pack-gantt-axis","aria-hidden":"true",children:[(0,s.jsx)("span",{}),(0,s.jsx)("div",{className:"pack-gantt-track",children:r.ticks.map(t=>(0,s.jsx)("span",{style:{left:`${(t.day-r.first+.5)/r.span*100}%`},children:t.label},t.day))})]}):null,o.map((t,i)=>(0,s.jsxs)("div",{className:"pack-gantt-row","data-austere-part":t.name,children:[(0,s.jsxs)("div",{className:"pack-gantt-label",children:[(0,s.jsx)("span",{className:"pack-gantt-name",children:t.name}),t.owner?(0,s.jsx)("span",{className:"pack-gantt-owner",children:t.owner}):null]}),(0,s.jsx)("div",{className:"pack-gantt-track",children:t.error?(0,s.jsx)("span",{className:"pack-gantt-error",children:t.error}):(0,s.jsx)("div",{className:`pack-gantt-bar${t.milestone?" is-milestone":""}${t.progress>=100?" is-done":""}`,style:t.milestone?{left:`${t.left+t.width/2}%`}:{left:`${t.left}%`,width:`${t.width}%`},title:`${t.name}: ${t.milestone?t.startLabel:`${t.startLabel} to ${t.endLabel}`}${t.progress?`, ${Math.round(t.progress)}%`:""}`,children:t.milestone?null:(0,s.jsx)("span",{className:"pack-gantt-fill",style:{width:`${t.progress}%`}})})})]},i))]})}var H=(0,x.austereComponent)({name:"Gantt",group:"Data",props:p.z.object({tasks:p.z.array(v.definition.ref),title:p.z.string().optional()}),description:"Gantt chart: GanttTasks as bars on a shared date axis, in the order given. Each bar is a click target.",renderer:V,example:`plan = Gantt([design, build, review, launch], "Q4 rollout")
design = GanttTask("Design", "2026-11-02", "2026-11-13", 100, "Ada")
build = GanttTask("Build", "2026-11-09", "2026-12-04", 45, "Grace")
review = GanttTask("Security review", "2026-12-01", "2026-12-11", 0, "Linus")
launch = GanttTask("Launch", "2026-12-14")`,stress:`stressPlan = Gantt([typo, backwards, ok, longName], "<img src=x onerror=alert(1)>")
typo = GanttTask("Typo", "next tuesday")
backwards = GanttTask("Time travel", "2026-12-04", "2026-11-01")
ok = GanttTask("One day", "2026-11-03", "2026-11-03", 250)
longName = GanttTask("A task name that keeps going so it has to wrap in the label column on a phone", "2026-11-05", "2026-11-20", 10, "someone-with-a-long-handle")`});var q=`/* Theme variables (--austere-*) keep the chart readable in the dark theme.
   Every class starts with the pack's prefix so it never collides with a page. */
.pack-gantt {
  --pack-gantt-label: clamp(88px, 28%, 200px);
  display: grid;
  gap: 6px;
  min-width: 0;
  font-size: 13px;
}
.pack-gantt-title {
  font-weight: 600;
  font-size: 14px;
}
.pack-gantt-row {
  display: grid;
  grid-template-columns: var(--pack-gantt-label) minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}
.pack-gantt-label {
  display: grid;
  min-width: 0;
  overflow-wrap: anywhere;
}
.pack-gantt-owner {
  font-size: 11.5px;
  color: var(--austere-muted);
}
.pack-gantt-track {
  position: relative;
  height: 22px;
  border-radius: 6px;
  background: var(--austere-surface-2);
}
.pack-gantt-axis .pack-gantt-track {
  height: 16px;
  background: none;
  overflow: visible;
  color: var(--austere-muted);
  font-size: 11px;
}
.pack-gantt-axis .pack-gantt-track span {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  white-space: nowrap;
}
.pack-gantt-bar {
  position: absolute;
  top: 3px;
  bottom: 3px;
  min-width: 6px;
  border-radius: 4px;
  background: var(--austere-accent-bg);
  border: 1px solid var(--austere-accent);
  overflow: hidden;
  box-sizing: border-box;
}
.pack-gantt-fill {
  display: block;
  height: 100%;
  background: var(--austere-accent);
  opacity: 0.55;
}
.pack-gantt-bar.is-done {
  border-color: var(--austere-queued);
  background: var(--austere-queued);
}
.pack-gantt-bar.is-done .pack-gantt-fill {
  background: var(--austere-queued);
  opacity: 1;
}
.pack-gantt-bar.is-milestone {
  min-width: 0;
  width: 12px;
  top: 5px;
  bottom: 5px;
  margin-left: -6px;
  transform: rotate(45deg) scale(0.75);
  border-radius: 2px;
  background: var(--austere-changed);
  border-color: var(--austere-changed);
}
.pack-gantt-error {
  position: absolute;
  inset: 0;
  padding: 0 8px;
  line-height: 22px;
  color: var(--austere-del-strong);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
`;var c={components:[H,v],css:q};var F=d(f());(0,F.registerPack)({name:"austere-pack-gantt",version:"0.1.0",api:1,components:[].concat(c&&c.components?c.components:c),css:c&&c.css});})();
