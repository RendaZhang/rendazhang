import{p as V}from"./chunk-353BL4L5.vtGGyJy_.js";import{a8 as S,a3 as M,aG as U,_ as d,g as j,s as q,a as H,b as Y,q as Z,p as J,l as _,c as K,D as Q,H as X,N as ee,e as te,y as ae,F as ne}from"./useMarkdownPipeline.BKkcsd5_.js";import{p as re}from"./treemap-75Q7IDZK.BF4VWla1.js";import{d as R}from"./arc.YaXTs3f7.js";import{o as ie}from"./ordinal.BoVi9mGq.js";import"./certifications.fa7edf7a.BW8oITAp.js";import"./ThemeProvider.Bev9uskO.js";import"./index.CVOHBThD.js";import"./logger.ur0fszTv.js";import"./_baseUniq.CBl0J8Hk.js";import"./_basePickBy.DRdYAfE4.js";import"./clone.C12wBXUr.js";import"./init.DgjLlYS3.js";(function(){var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"14ba032f3980a4b35df923fc61ae12d92d1139d5"}})();try{(function(){var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},a=new e.Error().stack;a&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[a]="3ef3e7c6-a6a7-4dc4-a9c4-07b1c8612aa3",e._sentryDebugIdIdentifier="sentry-dbid-3ef3e7c6-a6a7-4dc4-a9c4-07b1c8612aa3")})()}catch{}function oe(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function se(e){return e}function le(){var e=se,a=oe,m=null,o=S(0),u=S(M),w=S(0);function i(t){var n,l=(t=U(t)).length,p,x,h=0,c=new Array(l),r=new Array(l),y=+o.apply(this,arguments),D=Math.min(M,Math.max(-M,u.apply(this,arguments)-y)),g,T=Math.min(Math.abs(D)/l,w.apply(this,arguments)),C=T*(D<0?-1:1),f;for(n=0;n<l;++n)(f=r[c[n]=n]=+e(t[n],n,t))>0&&(h+=f);for(a!=null?c.sort(function(v,b){return a(r[v],r[b])}):m!=null&&c.sort(function(v,b){return m(t[v],t[b])}),n=0,x=h?(D-l*C)/h:0;n<l;++n,y=g)p=c[n],f=r[p],g=y+(f>0?f*x:0)+C,r[p]={data:t[p],index:n,value:f,startAngle:y,endAngle:g,padAngle:T};return r}return i.value=function(t){return arguments.length?(e=typeof t=="function"?t:S(+t),i):e},i.sortValues=function(t){return arguments.length?(a=t,m=null,i):a},i.sort=function(t){return arguments.length?(m=t,a=null,i):m},i.startAngle=function(t){return arguments.length?(o=typeof t=="function"?t:S(+t),i):o},i.endAngle=function(t){return arguments.length?(u=typeof t=="function"?t:S(+t),i):u},i.padAngle=function(t){return arguments.length?(w=typeof t=="function"?t:S(+t),i):w},i}var ce=ne.pie,z={sections:new Map,showData:!1},k=z.sections,F=z.showData,de=structuredClone(ce),ue=d(()=>structuredClone(de),"getConfig"),pe=d(()=>{k=new Map,F=z.showData,ae()},"clear"),fe=d(({label:e,value:a})=>{k.has(e)||(k.set(e,a),_.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),ge=d(()=>k,"getSections"),me=d(e=>{F=e},"setShowData"),he=d(()=>F,"getShowData"),W={getConfig:ue,clear:pe,setDiagramTitle:J,getDiagramTitle:Z,setAccTitle:Y,getAccTitle:H,setAccDescription:q,getAccDescription:j,addSection:fe,getSections:ge,setShowData:me,getShowData:he},ye=d((e,a)=>{V(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),ve={parse:d(async e=>{const a=await re("pie",e);_.debug(a),ye(a,W)},"parse")},Se=d(e=>`
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
`,"getStyles"),we=Se,xe=d(e=>{const a=[...e.entries()].map(o=>({label:o[0],value:o[1]})).sort((o,u)=>u.value-o.value);return le().value(o=>o.value)(a)},"createPieArcs"),De=d((e,a,m,o)=>{_.debug(`rendering pie chart
`+e);const u=o.db,w=K(),i=Q(u.getConfig(),w.pie),t=40,n=18,l=4,p=450,x=p,h=X(a),c=h.append("g");c.attr("transform","translate("+x/2+","+p/2+")");const{themeVariables:r}=w;let[y]=ee(r.pieOuterStrokeWidth);y??=2;const D=i.textPosition,g=Math.min(x,p)/2-t,T=R().innerRadius(0).outerRadius(g),C=R().innerRadius(g*D).outerRadius(g*D);c.append("circle").attr("cx",0).attr("cy",0).attr("r",g+y/2).attr("class","pieOuterCircle");const f=u.getSections(),v=xe(f),b=[r.pie1,r.pie2,r.pie3,r.pie4,r.pie5,r.pie6,r.pie7,r.pie8,r.pie9,r.pie10,r.pie11,r.pie12],A=ie(b);c.selectAll("mySlices").data(v).enter().append("path").attr("d",T).attr("fill",s=>A(s.data.label)).attr("class","pieCircle");let G=0;f.forEach(s=>{G+=s}),c.selectAll("mySlices").data(v).enter().append("text").text(s=>(s.data.value/G*100).toFixed(0)+"%").attr("transform",s=>"translate("+C.centroid(s)+")").style("text-anchor","middle").attr("class","slice"),c.append("text").text(u.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const I=c.selectAll(".legend").data(A.domain()).enter().append("g").attr("class","legend").attr("transform",(s,$)=>{const E=n+l,O=E*A.domain().length/2,P=12*n,B=$*E-O;return"translate("+P+","+B+")"});I.append("rect").attr("width",n).attr("height",n).style("fill",A).style("stroke",A),I.data(v).append("text").attr("x",n+l).attr("y",n-l).text(s=>{const{label:$,value:E}=s.data;return u.getShowData()?`${$} [${E}]`:$});const L=Math.max(...I.selectAll("text").nodes().map(s=>s?.getBoundingClientRect().width??0)),N=x+t+n+l+L;h.attr("viewBox",`0 0 ${N} ${p}`),te(h,p,N,i.useMaxWidth)},"draw"),be={draw:De},Re={parser:ve,db:W,renderer:be,styles:we};export{Re as diagram};
//# sourceMappingURL=pieDiagram-NIOCPIFQ.DqdRnFkl.js.map
