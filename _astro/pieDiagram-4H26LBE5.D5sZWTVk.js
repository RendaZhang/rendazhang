import{a3 as w,a6 as I,b1 as K,g as Q,s as Y,a as ee,b as te,q as ae,p as ne,_ as u,l as R,c as re,E as ie,H as se,M as oe,e as le,y as ce,F as de}from"./mermaid.core.zKbR9nnh.js";import{p as ue}from"./chunk-4BX2VUAB.CAiZUrnK.js";import{p as ge}from"./wardley-L42UT6IY.RrRG8Q79.js";import{d as O}from"./arc.ZvineGzP.js";import{o as pe}from"./ordinal.zkBE5LX0.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},a=new e.Error().stack;a&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[a]="554e22c0-24a6-406d-8f03-5f493e8cef21",e._sentryDebugIdIdentifier="sentry-dbid-554e22c0-24a6-406d-8f03-5f493e8cef21")}catch{}})();function fe(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function he(e){return e}function me(){var e=he,a=fe,f=null,x=w(0),s=w(I),g=w(0);function o(t){var r,l=(t=K(t)).length,p,h,v=0,c=new Array(l),i=new Array(l),y=+x.apply(this,arguments),S=Math.min(I,Math.max(-I,s.apply(this,arguments)-y)),m,C=Math.min(Math.abs(S)/l,g.apply(this,arguments)),T=C*(S<0?-1:1),d;for(r=0;r<l;++r)(d=i[c[r]=r]=+e(t[r],r,t))>0&&(v+=d);for(a!=null?c.sort(function(A,D){return a(i[A],i[D])}):f!=null&&c.sort(function(A,D){return f(t[A],t[D])}),r=0,h=v?(S-l*T)/v:0;r<l;++r,y=m)p=c[r],d=i[p],m=y+(d>0?d*h:0)+T,i[p]={data:t[p],index:r,value:d,startAngle:y,endAngle:m,padAngle:C};return i}return o.value=function(t){return arguments.length?(e=typeof t=="function"?t:w(+t),o):e},o.sortValues=function(t){return arguments.length?(a=t,f=null,o):a},o.sort=function(t){return arguments.length?(f=t,a=null,o):f},o.startAngle=function(t){return arguments.length?(x=typeof t=="function"?t:w(+t),o):x},o.endAngle=function(t){return arguments.length?(s=typeof t=="function"?t:w(+t),o):s},o.padAngle=function(t){return arguments.length?(g=typeof t=="function"?t:w(+t),o):g},o}var ve=de.pie,F={sections:new Map,showData:!1},$=F.sections,W=F.showData,ye=structuredClone(ve),we=u(()=>structuredClone(ye),"getConfig"),xe=u(()=>{$=new Map,W=F.showData,ce()},"clear"),Se=u(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);$.has(e)||($.set(e,a),R.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),Ae=u(()=>$,"getSections"),De=u(e=>{W=e},"setShowData"),Ce=u(()=>W,"getShowData"),P={getConfig:we,clear:xe,setDiagramTitle:ne,getDiagramTitle:ae,setAccTitle:te,getAccTitle:ee,setAccDescription:Y,getAccDescription:Q,addSection:Se,getSections:Ae,setShowData:De,getShowData:Ce},Te=u((e,a)=>{ue(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),$e={parse:u(async e=>{const a=await ge("pie",e);R.debug(a),Te(a,P)},"parse")},be=u(e=>`
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
`,"getStyles"),Ee=be,ke=u(e=>{const a=[...e.values()].reduce((s,g)=>s+g,0),f=[...e.entries()].map(([s,g])=>({label:s,value:g})).filter(s=>s.value/a*100>=1);return me().value(s=>s.value).sort(null)(f)},"createPieArcs"),Me=u((e,a,f,x)=>{R.debug(`rendering pie chart
`+e);const s=x.db,g=re(),o=ie(s.getConfig(),g.pie),t=40,r=18,l=4,p=450,h=p,v=se(a),c=v.append("g");c.attr("transform","translate("+h/2+","+p/2+")");const{themeVariables:i}=g;let[y]=oe(i.pieOuterStrokeWidth);y??=2;const S=o.textPosition,m=Math.min(h,p)/2-t,C=O().innerRadius(0).outerRadius(m),T=O().innerRadius(m*S).outerRadius(m*S);c.append("circle").attr("cx",0).attr("cy",0).attr("r",m+y/2).attr("class","pieOuterCircle");const d=s.getSections(),A=ke(d),D=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let b=0;d.forEach(n=>{b+=n});const _=A.filter(n=>(n.data.value/b*100).toFixed(0)!=="0"),E=pe(D).domain([...d.keys()]);c.selectAll("mySlices").data(_).enter().append("path").attr("d",C).attr("fill",n=>E(n.data.label)).attr("class","pieCircle"),c.selectAll("mySlices").data(_).enter().append("text").text(n=>(n.data.value/b*100).toFixed(0)+"%").attr("transform",n=>"translate("+T.centroid(n)+")").style("text-anchor","middle").attr("class","slice");const V=c.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),z=[...d.entries()].map(([n,M])=>({label:n,value:M})),k=c.selectAll(".legend").data(z).enter().append("g").attr("class","legend").attr("transform",(n,M)=>{const B=r+l,X=B*z.length/2,Z=12*r,J=M*B-X;return"translate("+Z+","+J+")"});k.append("rect").attr("width",r).attr("height",r).style("fill",n=>E(n.label)).style("stroke",n=>E(n.label)),k.append("text").attr("x",r+l).attr("y",r-l).text(n=>s.getShowData()?`${n.label} [${n.value}]`:n.label);const U=Math.max(...k.selectAll("text").nodes().map(n=>n?.getBoundingClientRect().width??0)),j=h+t+r+l+U,G=V.node()?.getBoundingClientRect().width??0,q=h/2-G/2,H=h/2+G/2,L=Math.min(0,q),N=Math.max(j,H)-L;v.attr("viewBox",`${L} 0 ${N} ${p}`),le(v,p,N,o.useMaxWidth)},"draw"),Ie={draw:Me},Le={parser:$e,db:P,renderer:Ie,styles:Ee};export{Le as diagram};
//# sourceMappingURL=pieDiagram-4H26LBE5.D5sZWTVk.js.map
