"use strict";(self.webpackChunkdashboard=self.webpackChunkdashboard||[]).push([[980],{7247:(J,y,i)=>{i.d(y,{A2:()=>E,BC:()=>x,JY:()=>n,JZ:()=>C,K$:()=>g,X0:()=>I,i:()=>P,ir:()=>D,nY:()=>U,tY:()=>F,u:()=>e,zZ:()=>_});const n="/option",g="/role",e="/role/store",x="/role/{id}/update",E="/role/{id}/delete",P="/site/basic",C="/site/basic/save",F="/site/media",D="/site/media/save",I="/site/content",U="/site/content/save",_="/site/general/save"},9641:(J,y,i)=>{i.d(y,{C:()=>e});var n=i(3250),Z=i(5992),M=i(1736),g=i(3714);let e=(()=>{var x;class E{constructor(C){this.http=C}upload(C){const F={};return C.forEach(D=>{const I=new FormData;I.append("file",D,D.name);const U=new n.aW("POST",M.UE,I,{responseType:"json",reportProgress:!0}),_=new Z.x,t=new Z.x;(new Date).getTime(),this.http.request(U).subscribe({next(o){if(o.type===n.dt.UploadProgress){const u=Math.round(100*o.loaded/o.total);_.next(u)}else o instanceof n.Zn&&(t.next(o.body),_.complete())},error(o){t.next(o),_.complete()}}),F[D.name]={response:t,progress:_.asObservable()}}),F}}return(x=E).\u0275fac=function(C){return new(C||x)(g.LFG(n.eN))},x.\u0275prov=g.Yz7({token:x,factory:x.\u0275fac}),E})()},9408:(J,y,i)=>{i.d(y,{b:()=>b});var n=i(2787),Z=i(9223),M=i(512),g=i(7247),e=i(3714),x=i(3250),E=i(24),P=i(450),C=i(3223),F=i(7747);function D(m,A){if(1&m){const a=e.EpF();e.TgZ(0,"angular2-smart-table",8),e.NdJ("create",function(){e.CHM(a);const d=e.oxw(3);return e.KtG(d.create())})("edit",function(d){e.CHM(a);const h=e.oxw(3);return e.KtG(h.edit(d))})("delete",function(d){e.CHM(a);const h=e.oxw(3);return e.KtG(h.delete(d))}),e.qZA()}if(2&m){const a=e.oxw().index,l=e.oxw(2);e.Q6J("settings",l.settings[a])("source",l.source[a])}}function I(m,A){if(1&m&&(e.TgZ(0,"button",15),e._uU(1),e.qZA()),2&m){const a=e.oxw(2).$implicit;e.xp6(1),e.Oqu(a.form.reset.name)}}function U(m,A){if(1&m){const a=e.EpF();e.TgZ(0,"form",9),e.NdJ("submit",function(){e.CHM(a);const d=e.oxw(),h=d.index,B=d.$implicit,N=e.oxw(2);return e.KtG(N.submit(h,B.form.submit.link))}),e._UZ(1,"control-container",10),e.TgZ(2,"div",11),e._UZ(3,"label",12),e.TgZ(4,"div")(5,"button",13),e._uU(6),e.qZA(),e.YNc(7,I,2,1,"button",14),e.qZA()()()}if(2&m){const a=e.oxw(),l=a.$implicit,d=a.index,h=e.oxw(2);e.Q6J("ngClass",l.form.class)("formGroup",h.formGroup[d]),e.xp6(1),e.Q6J("direction",l.form.direction)("form",h.formGroup[d])("controls",l.form.controls),e.xp6(1),e.Tol("column"!==l.form.direction?"row":""),e.xp6(1),e.Tol("column"!==l.form.direction?"col-12 col-md-2":""),e.xp6(1),e.Tol("column"!==l.form.direction?"col-12 col-md-10":""),e.xp6(1),e.Q6J("disabled",l.form.submit.valid&&h.formGroup[d].invalid),e.xp6(1),e.Oqu(l.form.submit.name),e.xp6(1),e.Q6J("ngIf",l.form.reset)}}function _(m,A){if(1&m&&(e.TgZ(0,"nb-tab",7),e.ynx(1,2),e.YNc(2,D,1,2,"angular2-smart-table",4),e.YNc(3,U,8,14,"form",5),e.BQk(),e.qZA()),2&m){const a=A.$implicit,l=A.index;e.Q6J("active",0==l)("tabTitle",a.title)("tabIndex",l)("tabId",""+l),e.xp6(1),e.Q6J("ngSwitch",a.container),e.xp6(1),e.Q6J("ngSwitchCase","table"),e.xp6(1),e.Q6J("ngSwitchCase","form")}}function t(m,A){if(1&m&&(e.TgZ(0,"nb-tabset"),e.YNc(1,_,4,7,"nb-tab",6),e.qZA()),2&m){const a=e.oxw();e.xp6(1),e.Q6J("ngForOf",a.tabs)}}function c(m,A){if(1&m){const a=e.EpF();e.TgZ(0,"angular2-smart-table",8),e.NdJ("create",function(){e.CHM(a);const d=e.oxw();return e.KtG(d.create())})("edit",function(d){e.CHM(a);const h=e.oxw();return e.KtG(h.edit(d))})("delete",function(d){e.CHM(a);const h=e.oxw();return e.KtG(h.delete(d))}),e.qZA()}if(2&m){const a=e.oxw();e.Q6J("settings",a.settings[0])("source",a.source[0])}}function o(m,A){if(1&m&&(e.TgZ(0,"button",15),e._uU(1),e.qZA()),2&m){const a=e.oxw(2);e.xp6(1),e.Oqu(a.form.reset.name)}}function u(m,A){if(1&m){const a=e.EpF();e.TgZ(0,"form",9),e.NdJ("submit",function(){e.CHM(a);const d=e.oxw();return e.KtG(d.submit(0,d.form.submit.link))}),e._UZ(1,"control-container",10),e.TgZ(2,"div",16),e._UZ(3,"label",12),e.TgZ(4,"div")(5,"button",17),e._uU(6),e.qZA(),e.YNc(7,o,2,1,"button",14),e.qZA()()()}if(2&m){const a=e.oxw();e.Q6J("ngClass",a.form.class)("formGroup",a.formGroup[0]),e.xp6(1),e.Q6J("direction",a.form.direction)("form",a.formGroup[0])("controls",a.form.controls),e.xp6(1),e.Tol("column"!==a.form.direction?"row":""),e.xp6(1),e.Tol("column"!==a.form.direction?"col-12 col-md-2":""),e.xp6(1),e.Tol("column"!==a.form.direction?"col-12 col-md-10":""),e.xp6(1),e.Q6J("disabled",a.form.submit.valid&&a.formGroup[0].invalid),e.xp6(1),e.Oqu(a.form.submit.name),e.xp6(1),e.Q6J("ngIf",a.form.reset)}}let b=(()=>{var m;class A{constructor(l,d,h,B){this.http=l,this.toast=d,this.route=h,this.router=B,this.title="",this.container="",this.tabs=[],this.settings=[],this.source=[],this.formGroup=[],this.pluginLink=""}ngOnInit(){this.route.queryParamMap.subscribe(l=>{let d=l.get("page")??"";d?(this.pluginLink=d.replace("/backend",""),this.http.get(this.pluginLink).subscribe(h=>{switch(this.title=h.title,this.container=h.container,this.container){case"tabs":this.tabs=h.tabs,this.tabs.forEach((B,N)=>{"table"==B.container?(this.source[N]=this.getSource(B.table?.source),this.settings[N]=this.getSettings(B.table)):this.formGroup[N]=new Z.cw((0,n.T)(B.form?.controls))});break;case"form":this.form=h.form,this.formGroup[0]=new Z.cw((0,n.T)(this.form?.controls));break;case"table":this.table=h.table,this.source[0]=this.getSource(this.table.source),this.settings[0]=this.getSettings(this.table)}})):this.router.navigateByUrl("/404").then()})}create(){}edit(l){}delete(l){}getSettings(l){return{actions:{position:"right",add:l.actions.create,edit:l.actions.edit,delete:l.actions.delete,columnTitle:"\u64cd\u4f5c"},add:{addButtonContent:'<i class="nb-plus"></i>',createButtonContent:'<i class="nb-checkmark"></i>',cancelButtonContent:'<i class="nb-close"></i>'},edit:{editButtonContent:'<i class="nb-edit"></i>',saveButtonContent:'<i class="nb-checkmark"></i>',cancelButtonContent:'<i class="nb-close"></i>'},delete:{deleteButtonContent:'<i class="nb-trash"></i>',confirmDelete:!0},pager:{perPage:30},mode:"external",columns:l.columns}}getSource(l){return new M.zV(this.http,{endPoint:l,dataKey:"records",totalKey:"total",pagerPageKey:"page",pagerLimitKey:"limit",filterFieldKey:"#field#"})}submit(l,d){this.formGroup[l].invalid||((""==d||"#"==d||"/"==d)&&(d=g.zZ),this.http.post(d,this.formGroup[l].getRawValue(),{params:{page:this.pluginLink}}).subscribe(h=>{}))}}return(m=A).\u0275fac=function(l){return new(l||m)(e.Y36(x.eN),e.Y36(E.quB),e.Y36(P.gz),e.Y36(P.F0))},m.\u0275cmp=e.Xpm({type:m,selectors:[["app-plugin-feature"]],decls:10,vars:5,consts:[[1,"row"],[1,"col-12"],[3,"ngSwitch"],[4,"ngSwitchCase"],[3,"settings","source","create","edit","delete",4,"ngSwitchCase"],[3,"ngClass","formGroup","submit",4,"ngSwitchCase"],[3,"active","tabTitle","tabIndex","tabId",4,"ngFor","ngForOf"],[3,"active","tabTitle","tabIndex","tabId"],[3,"settings","source","create","edit","delete"],[3,"ngClass","formGroup","submit"],[3,"direction","form","controls"],[1,""],[1,"label","col-form-label"],["status","primary","size","small","nbButton","","type","submit",3,"disabled"],["status","danger","class","ms-2","size","small","type","reset","nbButton","",4,"ngIf"],["status","danger","size","small","type","reset","nbButton","",1,"ms-2"],[1,"form-group"],["status","primary","size","small","type","submit","nbButton","",3,"disabled"]],template:function(l,d){1&l&&(e.TgZ(0,"div",0)(1,"div",1)(2,"nb-card")(3,"nb-card-header"),e._uU(4),e.qZA(),e.TgZ(5,"nb-card-body"),e.ynx(6,2),e.YNc(7,t,2,1,"nb-tabset",3),e.YNc(8,c,1,2,"angular2-smart-table",4),e.YNc(9,u,8,14,"form",5),e.BQk(),e.qZA()()()()),2&l&&(e.xp6(4),e.Oqu(d.title),e.xp6(2),e.Q6J("ngSwitch",d.container),e.xp6(1),e.Q6J("ngSwitchCase","tabs"),e.xp6(1),e.Q6J("ngSwitchCase","table"),e.xp6(1),e.Q6J("ngSwitchCase","form"))},dependencies:[C.mk,C.sg,C.O5,C.RF,C.n9,Z._Y,Z.JL,Z.sg,E.Asz,E.yKW,E.ndF,E.kyn,E.TR4,E.DPz,M.i0,F._],encapsulation:2}),A})()},980:(J,y,i)=>{i.r(y),i.d(y,{PluginModule:()=>Y});var n=i(3223),Z=i(5805),M=i(8715),g=i(3250);const C="/plugin/upload";var U=i(1297),_=i(7667),t=i(3714),c=i(24),o=i(450),u=i(2034);function b(p,T){if(1&p&&(t.TgZ(0,"a",17),t._uU(1),t.qZA()),2&p){const r=T.$implicit;t.Q6J("href",r.homepage?r.homepage:"#",t.LSH),t.xp6(1),t.Oqu(r.name)}}function m(p,T){if(1&p){const r=t.EpF();t.TgZ(0,"button",18),t.NdJ("click",function(){t.CHM(r);const f=t.oxw().$implicit,v=t.oxw();return t.KtG(v.upgrade(f.packageName))}),t._UZ(1,"nb-icon",19),t.qZA()}}function A(p,T){if(1&p&&(t.TgZ(0,"a",21),t._uU(1),t.qZA()),2&p){const r=T.$implicit;t.Q6J("routerLink",r.link)("queryParams",r.query),t.xp6(1),t.hij(" ",r.name||"\u8bbe\u7f6e"," ")}}function a(p,T){if(1&p&&(t.TgZ(0,"nb-card-footer",12),t.YNc(1,A,2,3,"a",20),t.qZA()),2&p){const r=t.oxw().$implicit;t.xp6(1),t.Q6J("ngForOf",r.actions)}}function l(p,T){if(1&p){const r=t.EpF();t.TgZ(0,"div",8)(1,"nb-card")(2,"nb-card-header"),t._uU(3),t.qZA(),t.TgZ(4,"nb-card-body")(5,"div",9),t._uU(6),t.qZA(),t.TgZ(7,"div",10)(8,"span"),t._uU(9,"\u4f5c\u8005:"),t.qZA(),t.TgZ(10,"span"),t.YNc(11,b,2,2,"a",11),t.qZA()(),t.TgZ(12,"div",10)(13,"span"),t._uU(14,"\u7248\u672c:"),t.qZA(),t.TgZ(15,"span"),t._uU(16),t.qZA()()(),t.TgZ(17,"nb-card-footer",12)(18,"button",13),t.NdJ("click",function(){const v=t.CHM(r).$implicit,O=t.oxw();return t.KtG(O.remove(v.packageName))}),t._uU(19,"\u5220\u9664"),t.qZA(),t.TgZ(20,"div",3)(21,"button",14),t.NdJ("click",function(){const v=t.CHM(r).$implicit,O=t.oxw();return t.KtG(v.enabled?O.inactivate(v.packageName):O.activate(v.packageName))}),t._uU(22),t.qZA(),t.YNc(23,m,2,0,"button",15),t.qZA()(),t.YNc(24,a,2,1,"nb-card-footer",16),t.qZA()()}if(2&p){const r=T.$implicit,s=t.oxw();t.xp6(3),t.hij(" ",r.name," "),t.xp6(3),t.hij(" ",r.description," "),t.xp6(5),t.Q6J("ngForOf",r.authors),t.xp6(5),t.Oqu(r.version),t.xp6(2),t.Q6J("disabled",r.enabled||s.spinner)("nbSpinner",s.spinner),t.xp6(3),t.Q6J("disabled",s.spinner)("nbSpinner",s.spinner)("status",r.enabled?"control":"primary"),t.xp6(1),t.hij(" ",r.enabled?"\u7981\u7528":"\u542f\u7528"," "),t.xp6(1),t.Q6J("ngIf",r.upgradeable),t.xp6(1),t.Q6J("ngIf",r.enabled&&r.actions.length>0)}}function d(p,T){if(1&p){const r=t.EpF();t.TgZ(0,"nb-card")(1,"nb-card-header"),t._uU(2,"\u5728\u7ebf\u4e0b\u8f7d"),t.qZA(),t.TgZ(3,"nb-card-body"),t._UZ(4,"input",22,23),t.qZA(),t.TgZ(6,"nb-card-footer",12)(7,"button",24),t.NdJ("click",function(){const v=t.CHM(r).dialogRef;return t.KtG(v.close())}),t._uU(8,"\u53d6\u6d88"),t.qZA(),t.TgZ(9,"button",25),t.NdJ("click",function(){const v=t.CHM(r).dialogRef,O=t.MAs(5),w=t.oxw();return t.KtG(w.openDownload(O.value,v))}),t._uU(10,"\u4e0b\u8f7d"),t.qZA()()()}}const h=function(){return["zip"]};let B=(()=>{var p;class T{constructor(s,f,v,O,w){this.http=s,this.toast=f,this.route=v,this.dialog=O,this.sidebar=w,this.plugins=[],this.title="",this.spinner=!1}onSpinner(s){this.spinner=s}ngAfterViewInit(){(0,U.H)(0).subscribe(s=>{this.sidebar.getSidebarState("menu-sidebar").subscribe(f=>{"compacted"!==f&&this.sidebar.compact("menu-sidebar")})})}ngOnInit(){this.getPlugins(),this.route.data.subscribe(s=>{this.title=s.title})}getPlugins(){this.http.get("/plugin/installed").subscribe(s=>{s.records.length>0&&(this.plugins=s.records)})}inactivate(s){this.http.post("/plugin/{name}/deactivate",{name:s},{context:(new g.qT).set(_.a,this)}).subscribe(f=>{this.getPlugins()})}activate(s){this.http.post("/plugin/{name}/activate",{name:s},{context:(new g.qT).set(_.a,this)}).subscribe(f=>{this.getPlugins()})}upgrade(s){this.http.post("/plugin/{name}/upgrade",{name:s},{context:(new g.qT).set(_.a,this)}).subscribe(f=>{this.getPlugins()})}upload(s){s.length<1?this.toast.danger("\u4e0a\u4f20\u7684\u63d2\u4ef6\u6587\u4ef6\u4e3a\u7a7a","\u4e0a\u4f20\u63d2\u4ef6"):this.http.post(C,{uri:s.pop()}).subscribe(f=>{this.getPlugins()})}openDownload(s,f){/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(s)?this.http.post(C,{uri:s}).subscribe(O=>{f.close(),this.getPlugins()}):this.toast.danger("\u4e0d\u5408\u6cd5\u7684url\u94fe\u63a5","\u5728\u7ebf\u4e0b\u8f7d")}remove(s){this.http.post("/plugin/{name}/down",{name:s},{context:(new g.qT).set(_.a,this)}).subscribe(f=>{this.getPlugins()})}}return(p=T).\u0275fac=function(s){return new(s||p)(t.Y36(g.eN),t.Y36(c.quB),t.Y36(o.gz),t.Y36(c.Gln),t.Y36(c.lzT))},p.\u0275cmp=t.Xpm({type:p,selectors:[["app-plugin-installed"]],decls:13,vars:4,consts:[[1,"row"],[1,"col-12"],[1,"d-flex","justify-content-between","align-items-center"],[1,"d-flex"],["nbButton","","status","danger",1,"me-2",3,"click"],[3,"suffix","status","finish"],["class","col-12 col-md-6 col-lg-4 col-xl-3",4,"ngFor","ngForOf"],["dialogTpl",""],[1,"col-12","col-md-6","col-lg-4","col-xl-3"],[1,"description"],[1,"d-flex","py-3","justify-content-between"],["class","d-inline-block mr-1","target","_blank",3,"href",4,"ngFor","ngForOf"],[1,"d-flex","justify-content-between"],["nbButton","","status","danger",3,"disabled","nbSpinner","click"],["nbButton","",3,"disabled","nbSpinner","status","click"],["class","ms-2","nbButton","","status","control",3,"click",4,"ngIf"],["class","d-flex justify-content-between",4,"ngIf"],["target","_blank",1,"d-inline-block","mr-1",3,"href"],["nbButton","","status","control",1,"ms-2",3,"click"],["icon","sync-outline"],["nbButton","","status","primary",3,"routerLink","queryParams",4,"ngFor","ngForOf"],["nbButton","","status","primary",3,"routerLink","queryParams"],["nbInput","","name","url","type","url","placeholder","\u4e0b\u8f7d\u5730\u5740"],["url",""],["nbButton","","status","basic",3,"click"],["nbButton","","status","primary",3,"click"]],template:function(s,f){if(1&s){const v=t.EpF();t.TgZ(0,"div",0)(1,"div",1)(2,"nb-card")(3,"nb-card-header",2)(4,"span"),t._uU(5,"\u5df2\u5b89\u88c5\u63d2\u4ef6\u5217\u8868"),t.qZA(),t.TgZ(6,"div",3)(7,"button",4),t.NdJ("click",function(){t.CHM(v);const w=t.MAs(12);return t.KtG(f.dialog.open(w))}),t._uU(8,"\u5728\u7ebf\u4e0b\u8f7d"),t.qZA(),t.TgZ(9,"app-upload",5),t.NdJ("finish",function(w){return f.upload(w)}),t.qZA()()()()(),t.YNc(10,l,25,12,"div",6),t.qZA(),t.YNc(11,d,11,0,"ng-template",null,7,t.W1O)}2&s&&(t.xp6(9),t.Q6J("suffix",t.DdM(3,h))("status","primary"),t.xp6(1),t.Q6J("ngForOf",f.plugins))},dependencies:[n.sg,n.O5,o.rH,c.Asz,c.yKW,c.XWE,c.ndF,c.DPz,c.h8i,c.Q7R,c.fMN,u.o],encapsulation:2}),T})();var N=i(5813);function S(p,T){if(1&p&&(t.TgZ(0,"a",9),t._uU(1),t.qZA()),2&p){const r=T.$implicit;t.Q6J("href",r.homepage?r.homepage:"#",t.LSH),t.xp6(1),t.hij(" ",r.name," ")}}function k(p,T){if(1&p){const r=t.EpF();t.TgZ(0,"div",3)(1,"nb-card")(2,"nb-card-header"),t._uU(3),t.qZA(),t.TgZ(4,"nb-card-body")(5,"div",4),t._uU(6),t.qZA(),t.TgZ(7,"div",5)(8,"span"),t._uU(9,"\u4f5c\u8005:"),t.qZA(),t.TgZ(10,"span"),t.YNc(11,S,2,2,"a",6),t.qZA()(),t.TgZ(12,"div",5)(13,"span"),t._uU(14,"\u7248\u672c:"),t.qZA(),t.TgZ(15,"span"),t._uU(16),t.qZA()()(),t.TgZ(17,"nb-card-footer",7)(18,"button",8),t.NdJ("click",function(){const v=t.CHM(r).$implicit,O=t.oxw();return t.KtG(O.setup(v.packageName))}),t._uU(19),t.qZA()()()()}if(2&p){const r=T.$implicit,s=t.oxw();t.xp6(3),t.Oqu(r.name),t.xp6(3),t.hij(" ",r.description," "),t.xp6(5),t.Q6J("ngForOf",r.authors),t.xp6(5),t.Oqu(r.version),t.xp6(2),t.Q6J("disabled",r.installed||s.spinner)("nbSpinner",s.spinner),t.xp6(1),t.Oqu(r.installed?"\u5df2\u5b89\u88c5":"\u5b89\u88c5")}}let K=(()=>{var p;class T{constructor(s,f,v,O,w){this.http=s,this.toast=f,this.route=v,this.sanitizer=O,this.sidebar=w,this.plugins=[],this.title="",this.spinner=!1}onSpinner(s){this.spinner=s}ngAfterViewInit(){(0,U.H)(0).subscribe(s=>{this.sidebar.getSidebarState("menu-sidebar").subscribe(f=>{"compacted"!==f&&this.sidebar.compact("menu-sidebar")})})}ngOnInit(){this.getPlugins(),this.route.data.subscribe(s=>{this.title=s.title})}getPlugins(){this.http.get("/plugin/market").subscribe(s=>{s.records.length>0&&(this.plugins=s.records)})}setup(s){this.http.post("/plugin/{name}/setup",{name:s},{context:(new g.qT).set(_.a,this)}).subscribe(f=>{this.getPlugins()})}}return(p=T).\u0275fac=function(s){return new(s||p)(t.Y36(g.eN),t.Y36(c.quB),t.Y36(o.gz),t.Y36(N.H7),t.Y36(c.lzT))},p.\u0275cmp=t.Xpm({type:p,selectors:[["app-plugin-market"]],decls:6,vars:1,consts:[[1,"row"],[1,"col-12"],["class","col-12 col-md-6 col-lg-4 col-xl-3",4,"ngFor","ngForOf"],[1,"col-12","col-md-6","col-lg-4","col-xl-3"],[1,"description"],[1,"d-flex","py-3","justify-content-between"],["class","d-inline-block mr-1","target","_blank",3,"href",4,"ngFor","ngForOf"],[1,"d-flex","justify-content-end"],["nbButton","","status","primary",3,"disabled","nbSpinner","click"],["target","_blank",1,"d-inline-block","mr-1",3,"href"]],template:function(s,f){1&s&&(t.TgZ(0,"div",0)(1,"div",1)(2,"nb-card")(3,"nb-card-header"),t._uU(4," \u63d2\u4ef6\u5e02\u573a "),t.qZA()()(),t.YNc(5,k,20,7,"div",2),t.qZA()),2&s&&(t.xp6(5),t.Q6J("ngForOf",f.plugins))},dependencies:[n.sg,c.Asz,c.yKW,c.XWE,c.ndF,c.DPz,c.Q7R],encapsulation:2}),T})();var L=i(9408),Q=i(2727),q=i(512);const G=[{path:"market",title:"\u63d2\u4ef6\u5e02\u573a",component:K},{path:"installed",title:"\u5df2\u5b89\u88c5\u63d2\u4ef6",component:B},{path:"feature",component:L.b}];let Y=(()=>{var p;class T{}return(p=T).\u0275fac=function(s){return new(s||p)},p.\u0275mod=t.oAB({type:p}),p.\u0275inj=t.cJS({imports:[n.ez,o.Bz.forChild(G),Z.O,M.c,c.COg,q.Ke,Q.s]}),T})()},2034:(J,y,i)=>{i.d(y,{o:()=>U});var n=i(3714),Z=i(6548),M=i(9641),g=i(24),e=i(3223);const x=["file"];function E(_,t){if(1&_&&(n.TgZ(0,"nb-progress-bar",18),n.ALo(1,"async"),n._uU(2),n.qZA()),2&_){const c=n.oxw().$implicit,o=n.oxw();n.Q6J("status",o.messages[c.name]?"danger":"success")("displayValue",!o.messages[c.name])("value",n.lcZ(1,4,o.progress[c.name].progress)),n.xp6(2),n.hij(" ",o.messages[c.name]," ")}}function P(_,t){if(1&_){const c=n.EpF();n.TgZ(0,"div",13)(1,"nb-icon",19),n.NdJ("click",function(){n.CHM(c);const u=n.oxw().$implicit,b=n.oxw();return n.KtG(b.remove(u))}),n.qZA()()}}function C(_,t){if(1&_&&(n.TgZ(0,"nb-list-item")(1,"div",12)(2,"div",13),n._UZ(3,"nb-icon",14),n.qZA(),n.TgZ(4,"div",15),n._uU(5),n.qZA(),n.TgZ(6,"div",15),n.YNc(7,E,3,6,"nb-progress-bar",16),n.qZA(),n.YNc(8,P,2,0,"div",17),n.qZA()()),2&_){const c=t.$implicit,o=n.oxw();n.xp6(5),n.hij(" ",c.name," "),n.xp6(2),n.Q6J("ngIf",o.progress),n.xp6(1),n.Q6J("ngIf",!o.uploading&&!o.uploadSuccessful)}}function F(_,t){if(1&_&&(n.TgZ(0,"div",20),n._uU(1),n.qZA()),2&_){const c=n.oxw();n.xp6(1),n.hij(" ",c.errorMessage," ")}}function D(_,t){if(1&_){const c=n.EpF();n.TgZ(0,"button",21),n.NdJ("click",function(){n.CHM(c);const u=n.oxw();return n.KtG(u.dialogRef.close())}),n._uU(1,"\u53d6\u6d88"),n.qZA()}}let I=(()=>{var _;class t{constructor(o,u){this.dialogRef=o,this.uploadService=u,this.files=new Set,this.multiple=!1,this.suffix=[],this.canBeClosed=!0,this.primaryButtonText="\u4e0a\u4f20",this.showCancelButton=!0,this.uploading=!1,this.uploadSuccessful=!1,this.messages={},this.errorMessage="",this.results=[]}ngOnInit(){}onFilesAdded(){const o=this.file?.nativeElement.files;let u="";for(const b in o){if(isNaN(parseInt(b,10)))continue;let m=o[b];console.log(m);let A=m.name.split(".");this.suffix.length>0&&!this.suffix.includes(A[A.length-1].toLowerCase())?u="\u6b64\u6587\u4ef6\u7c7b\u578b\u4e0d\u652f\u6301\uff0c\u53ea\u652f\u6301: "+this.suffix.join(",")+"\u6587\u4ef6\u683c\u5f0f":this.files.add(m)}this.errorMessage=u}addFiles(){this.file?.nativeElement.click()}closeDialog(){if(this.uploadSuccessful)return this.finish?.emit(this.results),this.dialogRef.close();if(this.files.size<1)return void(this.errorMessage="\u9009\u62e9\u9700\u8981\u4e0a\u4f20\u7684\u6587\u4ef6!");this.uploading=!0,this.progress=this.uploadService.upload(this.files);for(const u in this.progress)this.progress[u].progress.subscribe(b=>console.log(b)),this.progress[u].response.subscribe(b=>{b.hasOwnProperty("statusText")?this.messages[u]=b.statusText:b.hasOwnProperty("status")&&"ok"!=b.status?this.messages[u]=b.message:this.results.push(b.filename)});const o=[];for(const u in this.progress)o.push(this.progress[u].progress);this.primaryButtonText="\u5b8c\u6210",this.canBeClosed=!1,this.showCancelButton=!1,(0,Z.D)(o).subscribe(u=>{this.canBeClosed=!0,this.uploadSuccessful=!0,this.uploading=!1})}remove(o){this.files.delete(o)}}return(_=t).\u0275fac=function(o){return new(o||_)(n.Y36(g.X4l),n.Y36(M.C))},_.\u0275cmp=n.Xpm({type:_,selectors:[["app-dialog"]],viewQuery:function(o,u){if(1&o&&n.Gf(x,5),2&o){let b;n.iGM(b=n.CRH())&&(u.file=b.first)}},inputs:{multiple:"multiple",suffix:"suffix"},outputs:{finish:"finish"},features:[n._Bn([M.C])],decls:20,vars:7,consts:[[1,"row"],[1,"col-12"],["type","file",2,"display","none",3,"multiple","change"],["file",""],[1,"list-card"],[1,"d-flex","justify-content-between","align-items-center"],["nbButton","","status","primary",3,"disabled","click"],[4,"ngFor","ngForOf"],[1,"actions"],["class","col-12 text-danger py-2",4,"ngIf"],[1,"col-12","d-flex","justify-content-between"],["nbButton","","status","control","class","mr-2",3,"click",4,"ngIf"],[1,"row","flex-grow-1","flex-nowrap"],[1,"col-1"],["status","primary","icon","file"],[1,"col-5"],[3,"status","displayValue","value",4,"ngIf"],["class","col-1",4,"ngIf"],[3,"status","displayValue","value"],["icon","close","status","danger",2,"cursor","pointer",3,"click"],[1,"col-12","text-danger","py-2"],["nbButton","","status","control",1,"mr-2",3,"click"]],template:function(o,u){1&o&&(n.TgZ(0,"div",0)(1,"div",1)(2,"input",2,3),n.NdJ("change",function(){return u.onFilesAdded()}),n.qZA(),n.TgZ(4,"nb-card",4)(5,"nb-card-header",5)(6,"span"),n._uU(7,"\u4e0a\u4f20\u6587\u4ef6"),n.qZA(),n.TgZ(8,"button",6),n.NdJ("click",function(){return u.addFiles()}),n._uU(9,"\u6dfb\u52a0\u6587\u4ef6"),n.qZA()(),n.TgZ(10,"nb-card-body")(11,"nb-list"),n.YNc(12,C,9,3,"nb-list-item",7),n.qZA()(),n.TgZ(13,"nb-card-footer",8)(14,"div",0),n.YNc(15,F,2,1,"div",9),n.TgZ(16,"div",10),n.YNc(17,D,2,0,"button",11),n.TgZ(18,"button",6),n.NdJ("click",function(){return u.closeDialog()}),n._uU(19),n.qZA()()()()()()()),2&o&&(n.xp6(2),n.Q6J("multiple",u.multiple),n.xp6(6),n.Q6J("disabled",u.uploading||u.uploadSuccessful),n.xp6(4),n.Q6J("ngForOf",u.files),n.xp6(3),n.Q6J("ngIf",u.errorMessage.length>0),n.xp6(2),n.Q6J("ngIf",u.showCancelButton),n.xp6(1),n.Q6J("disabled",!u.canBeClosed||u.files.size<1),n.xp6(1),n.Oqu(u.primaryButtonText))},dependencies:[e.sg,e.O5,g.DPz,g.bSZ,g.zP_,g.qBV,g.Asz,g.yKW,g.XWE,g.ndF,g.fMN,e.Ov],styles:["nb-card[_ngcontent-%COMP%]{min-width:290px}.list-card[_ngcontent-%COMP%]   nb-card-header[_ngcontent-%COMP%]{border-bottom:none}.list-card[_ngcontent-%COMP%]   nb-card-footer[_ngcontent-%COMP%]{border-top:none}.list-card[_ngcontent-%COMP%]   nb-card-body[_ngcontent-%COMP%]{padding:0}"]}),t})(),U=(()=>{var _;class t{constructor(o){this.dialog=o,this.multiple=!1,this.text="\u4e0a\u4f20",this.status="primary",this.suffix=[],this.finish=new n.vpe}openUploadDialog(){const o=this.dialog.open(I,{closeOnBackdropClick:!1,closeOnEsc:!1});o.componentRef.instance.multiple=this.multiple,o.componentRef.instance.finish=this.finish,o.componentRef.instance.suffix=this.suffix}}return(_=t).\u0275fac=function(o){return new(o||_)(n.Y36(g.Gln))},_.\u0275cmp=n.Xpm({type:_,selectors:[["app-upload"]],inputs:{multiple:"multiple",text:"text",status:"status",suffix:"suffix"},outputs:{finish:"finish"},decls:2,vars:2,consts:[["type","button","nbButton","",3,"status","click"]],template:function(o,u){1&o&&(n.TgZ(0,"button",0),n.NdJ("click",function(){return u.openUploadDialog()}),n._uU(1),n.qZA()),2&o&&(n.Q6J("status",u.status),n.xp6(1),n.Oqu(u.text))},dependencies:[g.DPz],styles:["[_nghost-%COMP%]{display:block}"]}),t})()},8715:(J,y,i)=>{i.d(y,{c:()=>e});var n=i(3223),Z=i(24),M=i(9641),g=i(3714);let e=(()=>{var x;class E{}return(x=E).\u0275fac=function(C){return new(C||x)},x.\u0275mod=g.oAB({type:x}),x.\u0275inj=g.cJS({providers:[M.C],imports:[n.ez,Z.T2N,Z.DfH,Z.COg,Z.zyh,Z.KdK]}),E})()}}]);