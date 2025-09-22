import{p as V}from"./chunk-353BL4L5.DJIoRvFX.js";import{a8 as S,a3 as M,aG as U,_ as d,g as j,s as q,a as H,b as Y,q as Z,p as J,l as _,c as K,D as Q,H as X,N as ee,e as te,y as ae,F as ne}from"./mermaid.core.BFYvPj1V.js";import{p as re}from"./treemap-75Q7IDZK.CHyxmES7.js";import{d as R}from"./arc.B-n0tKnA.js";import{o as ie}from"./ordinal.DdxUlI5_.js";import"./purify.es.Cd42A1hC.js";import"./certifications.9f0375e8.B4Uv7KUm.js";import"./index.CEq_y5-P.js";import"./index.-_oy9bZA.js";import"./logger.BoW92lqO.js";import"./_commonjsHelpers.DJ8JrvF2.js";import"./_baseUniq.BxoM1OSc.js";import"./_basePickBy.CcXDmdU5.js";import"./clone.Ch63VGzN.js";import"./init.PMz61WJK.js";(function(){var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"7f587daaa12957af3a9439f51c5d6fbb4d7b3f42"}})();try{(function(){var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},a=new e.Error().stack;a&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[a]="077b6a9e-485a-4aeb-a122-8a4032478906",e._sentryDebugIdIdentifier="sentry-dbid-077b6a9e-485a-4aeb-a122-8a4032478906")})()}catch{}function oe(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function se(e){return e}function le(){var e=se,a=oe,m=null,o=S(0),u=S(M),w=S(0);function i(t){var n,l=(t=U(t)).length,p,x,h=0,c=new Array(l),r=new Array(l),y=+o.apply(this,arguments),b=Math.min(M,Math.max(-M,u.apply(this,arguments)-y)),g,T=Math.min(Math.abs(b)/l,w.apply(this,arguments)),C=T*(b<0?-1:1),f;for(n=0;n<l;++n)(f=r[c[n]=n]=+e(t[n],n,t))>0&&(h+=f);for(a!=null?c.sort(function(v,D){return a(r[v],r[D])}):m!=null&&c.sort(function(v,D){return m(t[v],t[D])}),n=0,x=h?(b-l*C)/h:0;n<l;++n,y=g)p=c[n],f=r[p],g=y+(f>0?f*x:0)+C,r[p]={data:t[p],index:n,value:f,startAngle:y,endAngle:g,padAngle:T};return r}return i.value=function(t){return arguments.length?(e=typeof t=="function"?t:S(+t),i):e},i.sortValues=function(t){return arguments.length?(a=t,m=null,i):a},i.sort=function(t){return arguments.length?(m=t,a=null,i):m},i.startAngle=function(t){return arguments.length?(o=typeof t=="function"?t:S(+t),i):o},i.endAngle=function(t){return arguments.length?(u=typeof t=="function"?t:S(+t),i):u},i.padAngle=function(t){return arguments.length?(w=typeof t=="function"?t:S(+t),i):w},i}var ce=ne.pie,z={sections:new Map,showData:!1},k=z.sections,F=z.showData,de=structuredClone(ce),ue=d(()=>structuredClone(de),"getConfig"),pe=d(()=>{k=new Map,F=z.showData,ae()},"clear"),fe=d(({label:e,value:a})=>{k.has(e)||(k.set(e,a),_.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),ge=d(()=>k,"getSections"),me=d(e=>{F=e},"setShowData"),he=d(()=>F,"getShowData"),W={getConfig:ue,clear:pe,setDiagramTitle:J,getDiagramTitle:Z,setAccTitle:Y,getAccTitle:H,setAccDescription:q,getAccDescription:j,addSection:fe,getSections:ge,setShowData:me,getShowData:he},ye=d((e,a)=>{V(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),ve={parse:d(async e=>{const a=await re("pie",e);_.debug(a),ye(a,W)},"parse")},Se=d(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),we=Se,xe=d(e=>{const a=[...e.entries()].map(o=>({label:o[0],value:o[1]})).sort((o,u)=>u.value-o.value);return le().value(o=>o.value)(a)},"createPieArcs"),be=d((e,a,m,o)=>{_.debug(`rendering pie chart
`+e);const u=o.db,w=K(),i=Q(u.getConfig(),w.pie),t=40,n=18,l=4,p=450,x=p,h=X(a),c=h.append("g");c.attr("transform","translate("+x/2+","+p/2+")");const{themeVariables:r}=w;let[y]=ee(r.pieOuterStrokeWidth);y??=2;const b=i.textPosition,g=Math.min(x,p)/2-t,T=R().innerRadius(0).outerRadius(g),C=R().innerRadius(g*b).outerRadius(g*b);c.append("circle").attr("cx",0).attr("cy",0).attr("r",g+y/2).attr("class","pieOuterCircle");const f=u.getSections(),v=xe(f),D=[r.pie1,r.pie2,r.pie3,r.pie4,r.pie5,r.pie6,r.pie7,r.pie8,r.pie9,r.pie10,r.pie11,r.pie12],A=ie(D);c.selectAll("mySlices").data(v).enter().append("path").attr("d",T).attr("fill",s=>A(s.data.label)).attr("class","pieCircle");let G=0;f.forEach(s=>{G+=s}),c.selectAll("mySlices").data(v).enter().append("text").text(s=>(s.data.value/G*100).toFixed(0)+"%").attr("transform",s=>"translate("+C.centroid(s)+")").style("text-anchor","middle").attr("class","slice"),c.append("text").text(u.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const I=c.selectAll(".legend").data(A.domain()).enter().append("g").attr("class","legend").attr("transform",(s,$)=>{const E=n+l,O=E*A.domain().length/2,P=12*n,B=$*E-O;return"translate("+P+","+B+")"});I.append("rect").attr("width",n).attr("height",n).style("fill",A).style("stroke",A),I.data(v).append("text").attr("x",n+l).attr("y",n-l).text(s=>{const{label:$,value:E}=s.data;return u.getShowData()?`${$} [${E}]`:$});const L=Math.max(...I.selectAll("text").nodes().map(s=>s?.getBoundingClientRect().width??0)),N=x+t+n+l+L;h.attr("viewBox",`0 0 ${N} ${p}`),te(h,p,N,i.useMaxWidth)},"draw"),De={draw:be},Le={parser:ve,db:W,renderer:De,styles:we};export{Le as diagram};
//# sourceMappingURL=pieDiagram-NIOCPIFQ.CTf9q1Ku.js.map
