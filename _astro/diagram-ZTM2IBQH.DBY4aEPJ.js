import{p as S}from"./chunk-353BL4L5.DJIoRvFX.js";import{_ as l,s as _,g as O,q as D,p as R,a as k,b as F,H as G,y as P,D as b,E as $,F as z,l as H,K as V}from"./mermaid.core.BFYvPj1V.js";import{p as W}from"./treemap-75Q7IDZK.CHyxmES7.js";import"./purify.es.Cd42A1hC.js";import"./certifications.9f0375e8.B4Uv7KUm.js";import"./index.CEq_y5-P.js";import"./index.-_oy9bZA.js";import"./logger.BoW92lqO.js";import"./_commonjsHelpers.DJ8JrvF2.js";import"./_baseUniq.BxoM1OSc.js";import"./_basePickBy.CcXDmdU5.js";import"./clone.Ch63VGzN.js";(function(){var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"7f587daaa12957af3a9439f51c5d6fbb4d7b3f42"}})();try{(function(){var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="3707af4f-b5e0-4781-9a17-1af2804c48bc",e._sentryDebugIdIdentifier="sentry-dbid-3707af4f-b5e0-4781-9a17-1af2804c48bc")})()}catch{}var h={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},w={axes:[],curves:[],options:h},m=structuredClone(w),B=z.radar,j=l(()=>b({...B,...$().radar}),"getConfig"),C=l(()=>m.axes,"getAxes"),N=l(()=>m.curves,"getCurves"),Y=l(()=>m.options,"getOptions"),q=l(e=>{m.axes=e.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),K=l(e=>{m.curves=e.map(t=>({name:t.name,label:t.label??t.name,entries:U(t.entries)}))},"setCurves"),U=l(e=>{if(e[0].axis==null)return e.map(a=>a.value);const t=C();if(t.length===0)throw new Error("Axes must be populated before curves for reference entries");return t.map(a=>{const r=e.find(n=>n.axis?.$refText===a.name);if(r===void 0)throw new Error("Missing entry for axis "+a.label);return r.value})},"computeCurveEntries"),X=l(e=>{const t=e.reduce((a,r)=>(a[r.name]=r,a),{});m.options={showLegend:t.showLegend?.value??h.showLegend,ticks:t.ticks?.value??h.ticks,max:t.max?.value??h.max,min:t.min?.value??h.min,graticule:t.graticule?.value??h.graticule}},"setOptions"),Z=l(()=>{P(),m=structuredClone(w)},"clear"),v={getAxes:C,getCurves:N,getOptions:Y,setAxes:q,setCurves:K,setOptions:X,getConfig:j,clear:Z,setAccTitle:F,getAccTitle:k,setDiagramTitle:R,getDiagramTitle:D,getAccDescription:O,setAccDescription:_},J=l(e=>{S(e,v);const{axes:t,curves:a,options:r}=e;v.setAxes(t),v.setCurves(a),v.setOptions(r)},"populate"),Q={parse:l(async e=>{const t=await W("radar",e);H.debug(t),J(t)},"parse")},tt=l((e,t,a,r)=>{const n=r.db,o=n.getAxes(),i=n.getCurves(),s=n.getOptions(),c=n.getConfig(),d=n.getDiagramTitle(),u=G(t),p=et(u,c),g=s.max??Math.max(...i.map(y=>Math.max(...y.entries))),x=s.min,f=Math.min(c.width,c.height)/2;at(p,o,f,s.ticks,s.graticule),rt(p,o,f,c),M(p,o,i,x,g,s.graticule,c),L(p,i,s.showLegend,c),p.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-c.height/2-c.marginTop)},"draw"),et=l((e,t)=>{const a=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,n={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return e.attr("viewbox",`0 0 ${a} ${r}`).attr("width",a).attr("height",r),e.append("g").attr("transform",`translate(${n.x}, ${n.y})`)},"drawFrame"),at=l((e,t,a,r,n)=>{if(n==="circle")for(let o=0;o<r;o++){const i=a*(o+1)/r;e.append("circle").attr("r",i).attr("class","radarGraticule")}else if(n==="polygon"){const o=t.length;for(let i=0;i<r;i++){const s=a*(i+1)/r,c=t.map((d,u)=>{const p=2*u*Math.PI/o-Math.PI/2,g=s*Math.cos(p),x=s*Math.sin(p);return`${g},${x}`}).join(" ");e.append("polygon").attr("points",c).attr("class","radarGraticule")}}},"drawGraticule"),rt=l((e,t,a,r)=>{const n=t.length;for(let o=0;o<n;o++){const i=t[o].label,s=2*o*Math.PI/n-Math.PI/2;e.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*Math.cos(s)).attr("y2",a*r.axisScaleFactor*Math.sin(s)).attr("class","radarAxisLine"),e.append("text").text(i).attr("x",a*r.axisLabelFactor*Math.cos(s)).attr("y",a*r.axisLabelFactor*Math.sin(s)).attr("class","radarAxisLabel")}},"drawAxes");function M(e,t,a,r,n,o,i){const s=t.length,c=Math.min(i.width,i.height)/2;a.forEach((d,u)=>{if(d.entries.length!==s)return;const p=d.entries.map((g,x)=>{const f=2*Math.PI*x/s-Math.PI/2,y=A(g,r,n,c),E=y*Math.cos(f),I=y*Math.sin(f);return{x:E,y:I}});o==="circle"?e.append("path").attr("d",T(p,i.curveTension)).attr("class",`radarCurve-${u}`):o==="polygon"&&e.append("polygon").attr("points",p.map(g=>`${g.x},${g.y}`).join(" ")).attr("class",`radarCurve-${u}`)})}l(M,"drawCurves");function A(e,t,a,r){const n=Math.min(Math.max(e,t),a);return r*(n-t)/(a-t)}l(A,"relativeRadius");function T(e,t){const a=e.length;let r=`M${e[0].x},${e[0].y}`;for(let n=0;n<a;n++){const o=e[(n-1+a)%a],i=e[n],s=e[(n+1)%a],c=e[(n+2)%a],d={x:i.x+(s.x-o.x)*t,y:i.y+(s.y-o.y)*t},u={x:s.x-(c.x-i.x)*t,y:s.y-(c.y-i.y)*t};r+=` C${d.x},${d.y} ${u.x},${u.y} ${s.x},${s.y}`}return`${r} Z`}l(T,"closedRoundCurve");function L(e,t,a,r){if(!a)return;const n=(r.width/2+r.marginRight)*3/4,o=-(r.height/2+r.marginTop)*3/4,i=20;t.forEach((s,c)=>{const d=e.append("g").attr("transform",`translate(${n}, ${o+c*i})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${c}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(s.label)})}l(L,"drawLegend");var nt={draw:tt},st=l((e,t)=>{let a="";for(let r=0;r<e.THEME_COLOR_LIMIT;r++){const n=e[`cScale${r}`];a+=`
		.radarCurve-${r} {
			color: ${n};
			fill: ${n};
			fill-opacity: ${t.curveOpacity};
			stroke: ${n};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${n};
			fill-opacity: ${t.curveOpacity};
			stroke: ${n};
		}
		`}return a},"genIndexStyles"),ot=l(e=>{const t=V(),a=$(),r=b(t,a.themeVariables),n=b(r.radar,e);return{themeVariables:r,radarOptions:n}},"buildRadarStyleOptions"),it=l(({radar:e}={})=>{const{themeVariables:t,radarOptions:a}=ot(e);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${a.axisColor};
		stroke-width: ${a.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
		font-size: ${a.axisLabelFontSize}px;
		color: ${a.axisColor};
	}
	.radarGraticule {
		fill: ${a.graticuleColor};
		fill-opacity: ${a.graticuleOpacity};
		stroke: ${a.graticuleColor};
		stroke-width: ${a.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${a.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${st(t,a)}
	`},"styles"),bt={parser:Q,db:v,renderer:nt,styles:it};export{bt as diagram};
//# sourceMappingURL=diagram-ZTM2IBQH.DBY4aEPJ.js.map
