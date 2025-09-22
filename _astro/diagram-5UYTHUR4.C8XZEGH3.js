import{p as $}from"./chunk-353BL4L5.DJIoRvFX.js";import{_ as l,s as S,g as B,q as E,p as T,a as D,b as F,D as w,H as _,e as z,y as P,E as W,F as A,l as m}from"./mermaid.core.BFYvPj1V.js";import{p as I}from"./treemap-75Q7IDZK.CHyxmES7.js";import"./purify.es.Cd42A1hC.js";import"./certifications.9f0375e8.B4Uv7KUm.js";import"./index.CEq_y5-P.js";import"./index.-_oy9bZA.js";import"./logger.BoW92lqO.js";import"./_commonjsHelpers.DJ8JrvF2.js";import"./_baseUniq.BxoM1OSc.js";import"./_basePickBy.CcXDmdU5.js";import"./clone.Ch63VGzN.js";(function(){var t=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};t.SENTRY_RELEASE={id:"7f587daaa12957af3a9439f51c5d6fbb4d7b3f42"}})();try{(function(){var t=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},e=new t.Error().stack;e&&(t._sentryDebugIds=t._sentryDebugIds||{},t._sentryDebugIds[e]="131e4145-3048-41e4-91c5-0fd32b5aa9b2",t._sentryDebugIdIdentifier="sentry-dbid-131e4145-3048-41e4-91c5-0fd32b5aa9b2")})()}catch{}var y={packet:[]},v=structuredClone(y),N=A.packet,L=l(()=>{const t=w({...N,...W().packet});return t.showBits&&(t.paddingY+=10),t},"getConfig"),Y=l(()=>v.packet,"getPacket"),R=l(t=>{t.length>0&&v.packet.push(t)},"pushWord"),H=l(()=>{P(),v=structuredClone(y)},"clear"),h={pushWord:R,getPacket:Y,getConfig:L,clear:H,setAccTitle:F,getAccTitle:D,setDiagramTitle:T,getDiagramTitle:E,getAccDescription:B,setAccDescription:S},M=1e4,O=l(t=>{$(t,h);let e=-1,o=[],n=1;const{bitsPerRow:i}=h.getConfig();for(let{start:a,end:r,bits:d,label:g}of t.blocks){if(a!==void 0&&r!==void 0&&r<a)throw new Error(`Packet block ${a} - ${r} is invalid. End must be greater than start.`);if(a??=e+1,a!==e+1)throw new Error(`Packet block ${a} - ${r??a} is not contiguous. It should start from ${e+1}.`);if(d===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(r??=a+(d??1)-1,d??=r-a+1,e=r,m.debug(`Packet block ${a} - ${e} with label ${g}`);o.length<=i+1&&h.getPacket().length<M;){const[c,f]=q({start:a,end:r,bits:d,label:g},n,i);if(o.push(c),c.end+1===n*i&&(h.pushWord(o),o=[],n++),!f)break;({start:a,end:r,bits:d,label:g}=f)}}h.pushWord(o)},"populate"),q=l((t,e,o)=>{if(t.start===void 0)throw new Error("start should have been set during first phase");if(t.end===void 0)throw new Error("end should have been set during first phase");if(t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*o)return[t,void 0];const n=e*o-1,i=e*o;return[{start:t.start,end:n,label:t.label,bits:n-t.start},{start:i,end:t.end,label:t.label,bits:t.end-i}]},"getNextFittingBlock"),G={parse:l(async t=>{const e=await I("packet",t);m.debug(e),O(e)},"parse")},K=l((t,e,o,n)=>{const i=n.db,a=i.getConfig(),{rowHeight:r,paddingY:d,bitWidth:g,bitsPerRow:c}=a,f=i.getPacket(),s=i.getDiagramTitle(),b=r+d,p=b*(f.length+1)-(s?0:r),u=g*c+2,k=_(e);k.attr("viewbox",`0 0 ${u} ${p}`),z(k,p,u,a.useMaxWidth);for(const[x,C]of f.entries())U(k,C,x,a);k.append("text").text(s).attr("x",u/2).attr("y",p-b/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),U=l((t,e,o,{rowHeight:n,paddingX:i,paddingY:a,bitWidth:r,bitsPerRow:d,showBits:g})=>{const c=t.append("g"),f=o*(n+a)+a;for(const s of e){const b=s.start%d*r+1,p=(s.end-s.start+1)*r-i;if(c.append("rect").attr("x",b).attr("y",f).attr("width",p).attr("height",n).attr("class","packetBlock"),c.append("text").attr("x",b+p/2).attr("y",f+n/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(s.label),!g)continue;const u=s.end===s.start,k=f-2;c.append("text").attr("x",b+(u?p/2:0)).attr("y",k).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",u?"middle":"start").text(s.start),u||c.append("text").attr("x",b+p).attr("y",k).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(s.end)}},"drawWord"),X={draw:K},j={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},J=l(({packet:t}={})=>{const e=w(j,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),dt={parser:G,db:h,renderer:X,styles:J};export{dt as diagram};
//# sourceMappingURL=diagram-5UYTHUR4.C8XZEGH3.js.map
