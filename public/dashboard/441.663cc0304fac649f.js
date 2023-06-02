"use strict";(self.webpackChunkdashboard=self.webpackChunkdashboard||[]).push([[441],{5078:(N,P,a)=>{a.d(P,{A2:()=>C,BC:()=>b,JY:()=>n,JZ:()=>O,K$:()=>d,X0:()=>U,i:()=>E,ir:()=>I,nY:()=>y,tY:()=>F,u:()=>e,zZ:()=>u});const n="/option",d="/role",e="/role/store",b="/role/{id}/update",C="/role/{id}/delete",E="/site/basic",O="/site/basic/save",F="/site/media",I="/site/media/save",U="/site/content",y="/site/content/save",u="/site/general/save"},916:(N,P,a)=>{a.d(P,{C:()=>e});var n=a(5732),T=a(8023),D=a(2324),d=a(4537);let e=(()=>{class b{constructor(E){this.http=E}upload(E){const O={};return E.forEach(F=>{const I=new FormData;I.append("file",F,F.name);const U=new n.aW("POST",D.UE,I,{responseType:"json",reportProgress:!0}),y=new T.x,u=new T.x;(new Date).getTime(),this.http.request(U).subscribe({next(s){if(s.type===n.dt.UploadProgress){const r=Math.round(100*s.loaded/s.total);y.next(r)}else s instanceof n.Zn&&(u.next(s.body),y.complete())},error(s){u.next(s),y.complete()}}),O[F.name]={response:u,progress:y.asObservable()}}),O}}return b.\u0275fac=function(E){return new(E||b)(d.LFG(n.eN))},b.\u0275prov=d.Yz7({token:b,factory:b.\u0275fac}),b})()},161:(N,P,a)=>{a.d(P,{b:()=>v});var n=a(3037),T=a(92),D=a(9598),d=a(5078),e=a(4537),b=a(5732),C=a(9467),E=a(6221),O=a(8692),F=a(7660);function I(p,Z){if(1&p){const i=e.EpF();e.TgZ(0,"angular2-smart-table",8),e.NdJ("create",function(){e.CHM(i);const m=e.oxw(3);return e.KtG(m.create())})("edit",function(m){e.CHM(i);const f=e.oxw(3);return e.KtG(f.edit(m))})("delete",function(m){e.CHM(i);const f=e.oxw(3);return e.KtG(f.delete(m))}),e.qZA()}if(2&p){const i=e.oxw().index,l=e.oxw(2);e.Q6J("settings",l.settings[i])("source",l.source[i])}}function U(p,Z){if(1&p&&(e.TgZ(0,"button",15),e._uU(1),e.qZA()),2&p){const i=e.oxw(2).$implicit;e.xp6(1),e.Oqu(i.form.reset.name)}}function y(p,Z){if(1&p){const i=e.EpF();e.TgZ(0,"form",9),e.NdJ("submit",function(){e.CHM(i);const m=e.oxw(),f=m.index,w=m.$implicit,B=e.oxw(2);return e.KtG(B.submit(f,w.form.submit.link))}),e._UZ(1,"control-container",10),e.TgZ(2,"div",11),e._UZ(3,"label",12),e.TgZ(4,"div")(5,"button",13),e._uU(6),e.qZA(),e.YNc(7,U,2,1,"button",14),e.qZA()()()}if(2&p){const i=e.oxw(),l=i.$implicit,m=i.index,f=e.oxw(2);e.Q6J("ngClass",l.form.class)("formGroup",f.formGroup[m]),e.xp6(1),e.Q6J("direction",l.form.direction)("form",f.formGroup[m])("controls",l.form.controls),e.xp6(1),e.Tol("column"!==l.form.direction?"row":""),e.xp6(1),e.Tol("column"!==l.form.direction?"col-12 col-md-2":""),e.xp6(1),e.Tol("column"!==l.form.direction?"col-12 col-md-10":""),e.xp6(1),e.Q6J("disabled",l.form.submit.valid&&f.formGroup[m].invalid),e.xp6(1),e.Oqu(l.form.submit.name),e.xp6(1),e.Q6J("ngIf",l.form.reset)}}function u(p,Z){if(1&p&&(e.TgZ(0,"nb-tab",7),e.ynx(1,2),e.YNc(2,I,1,2,"angular2-smart-table",4),e.YNc(3,y,8,14,"form",5),e.BQk(),e.qZA()),2&p){const i=Z.$implicit,l=Z.index;e.Q6J("active",0==l)("tabTitle",i.title)("tabIndex",l)("tabId",""+l),e.xp6(1),e.Q6J("ngSwitch",i.container),e.xp6(1),e.Q6J("ngSwitchCase","table"),e.xp6(1),e.Q6J("ngSwitchCase","form")}}function t(p,Z){if(1&p&&(e.TgZ(0,"nb-tabset"),e.YNc(1,u,4,7,"nb-tab",6),e.qZA()),2&p){const i=e.oxw();e.xp6(1),e.Q6J("ngForOf",i.tabs)}}function s(p,Z){if(1&p){const i=e.EpF();e.TgZ(0,"angular2-smart-table",8),e.NdJ("create",function(){e.CHM(i);const m=e.oxw();return e.KtG(m.create())})("edit",function(m){e.CHM(i);const f=e.oxw();return e.KtG(f.edit(m))})("delete",function(m){e.CHM(i);const f=e.oxw();return e.KtG(f.delete(m))}),e.qZA()}if(2&p){const i=e.oxw();e.Q6J("settings",i.settings[0])("source",i.source[0])}}function r(p,Z){if(1&p&&(e.TgZ(0,"button",15),e._uU(1),e.qZA()),2&p){const i=e.oxw(2);e.xp6(1),e.Oqu(i.form.reset.name)}}function g(p,Z){if(1&p){const i=e.EpF();e.TgZ(0,"form",9),e.NdJ("submit",function(){e.CHM(i);const m=e.oxw();return e.KtG(m.submit(0,m.form.submit.link))}),e._UZ(1,"control-container",10),e.TgZ(2,"div",16),e._UZ(3,"label",12),e.TgZ(4,"div")(5,"button",17),e._uU(6),e.qZA(),e.YNc(7,r,2,1,"button",14),e.qZA()()()}if(2&p){const i=e.oxw();e.Q6J("ngClass",i.form.class)("formGroup",i.formGroup[0]),e.xp6(1),e.Q6J("direction",i.form.direction)("form",i.formGroup[0])("controls",i.form.controls),e.xp6(1),e.Tol("column"!==i.form.direction?"row":""),e.xp6(1),e.Tol("column"!==i.form.direction?"col-12 col-md-2":""),e.xp6(1),e.Tol("column"!==i.form.direction?"col-12 col-md-10":""),e.xp6(1),e.Q6J("disabled",i.form.submit.valid&&i.formGroup[0].invalid),e.xp6(1),e.Oqu(i.form.submit.name),e.xp6(1),e.Q6J("ngIf",i.form.reset)}}let v=(()=>{class p{constructor(i,l,m,f){this.http=i,this.toast=l,this.route=m,this.router=f,this.title="",this.container="",this.tabs=[],this.settings=[],this.source=[],this.formGroup=[],this.pluginLink=""}ngOnInit(){this.route.queryParamMap.subscribe(i=>{var l;let m=null!==(l=i.get("page"))&&void 0!==l?l:"";m?(this.pluginLink=m.replace("/backend",""),this.http.get(this.pluginLink).subscribe(f=>{var w;switch(this.title=f.title,this.container=f.container,this.container){case"tabs":this.tabs=f.tabs,this.tabs.forEach((B,J)=>{var S,k;"table"==B.container?(this.source[J]=this.getSource(null===(S=B.table)||void 0===S?void 0:S.source),this.settings[J]=this.getSettings(B.table)):this.formGroup[J]=new T.cw((0,n.T)(null===(k=B.form)||void 0===k?void 0:k.controls))});break;case"form":this.form=f.form,this.formGroup[0]=new T.cw((0,n.T)(null===(w=this.form)||void 0===w?void 0:w.controls));break;case"table":this.table=f.table,this.source[0]=this.getSource(this.table.source),this.settings[0]=this.getSettings(this.table)}})):this.router.navigateByUrl("/404").then()})}create(){}edit(i){}delete(i){}getSettings(i){return{actions:{position:"right",add:i.actions.create,edit:i.actions.edit,delete:i.actions.delete,columnTitle:"\u64cd\u4f5c"},add:{addButtonContent:'<i class="nb-plus"></i>',createButtonContent:'<i class="nb-checkmark"></i>',cancelButtonContent:'<i class="nb-close"></i>'},edit:{editButtonContent:'<i class="nb-edit"></i>',saveButtonContent:'<i class="nb-checkmark"></i>',cancelButtonContent:'<i class="nb-close"></i>'},delete:{deleteButtonContent:'<i class="nb-trash"></i>',confirmDelete:!0},pager:{perPage:30},mode:"external",columns:i.columns}}getSource(i){return new D.zV(this.http,{endPoint:i,dataKey:"records",totalKey:"total",pagerPageKey:"page",pagerLimitKey:"limit",filterFieldKey:"#field#"})}submit(i,l){this.formGroup[i].invalid||((""==l||"#"==l||"/"==l)&&(l=d.zZ),this.http.post(l,this.formGroup[i].getRawValue(),{params:{page:this.pluginLink}}).subscribe(m=>{}))}}return p.\u0275fac=function(i){return new(i||p)(e.Y36(b.eN),e.Y36(C.quB),e.Y36(E.gz),e.Y36(E.F0))},p.\u0275cmp=e.Xpm({type:p,selectors:[["app-plugin-feature"]],decls:10,vars:5,consts:[[1,"row"],[1,"col-12"],[3,"ngSwitch"],[4,"ngSwitchCase"],[3,"settings","source","create","edit","delete",4,"ngSwitchCase"],[3,"ngClass","formGroup","submit",4,"ngSwitchCase"],[3,"active","tabTitle","tabIndex","tabId",4,"ngFor","ngForOf"],[3,"active","tabTitle","tabIndex","tabId"],[3,"settings","source","create","edit","delete"],[3,"ngClass","formGroup","submit"],[3,"direction","form","controls"],[1,""],[1,"label","col-form-label"],["status","primary","size","small","nbButton","","type","submit",3,"disabled"],["status","danger","class","ms-2","size","small","type","reset","nbButton","",4,"ngIf"],["status","danger","size","small","type","reset","nbButton","",1,"ms-2"],[1,"form-group"],["status","primary","size","small","type","submit","nbButton","",3,"disabled"]],template:function(i,l){1&i&&(e.TgZ(0,"div",0)(1,"div",1)(2,"nb-card")(3,"nb-card-header"),e._uU(4),e.qZA(),e.TgZ(5,"nb-card-body"),e.ynx(6,2),e.YNc(7,t,2,1,"nb-tabset",3),e.YNc(8,s,1,2,"angular2-smart-table",4),e.YNc(9,g,8,14,"form",5),e.BQk(),e.qZA()()()()),2&i&&(e.xp6(4),e.Oqu(l.title),e.xp6(2),e.Q6J("ngSwitch",l.container),e.xp6(1),e.Q6J("ngSwitchCase","tabs"),e.xp6(1),e.Q6J("ngSwitchCase","table"),e.xp6(1),e.Q6J("ngSwitchCase","form"))},dependencies:[O.mk,O.sg,O.O5,O.RF,O.n9,T._Y,T.JL,T.sg,C.Asz,C.yKW,C.ndF,C.kyn,C.TR4,C.DPz,D.i0,F._],encapsulation:2}),p})()},2441:(N,P,a)=>{a.r(P),a.d(P,{PluginModule:()=>G});var n=a(8692),T=a(7595),D=a(2521),d=a(5732);const O="/plugin/upload";var y=a(1995),u=a(9024),t=a(4537),s=a(9467),r=a(6221),g=a(1784);function v(c,h){if(1&c&&(t.TgZ(0,"a",17),t._uU(1),t.qZA()),2&c){const o=h.$implicit;t.Q6J("href",o.homepage?o.homepage:"#",t.LSH),t.xp6(1),t.Oqu(o.name)}}function p(c,h){if(1&c){const o=t.EpF();t.TgZ(0,"button",18),t.NdJ("click",function(){t.CHM(o);const M=t.oxw().$implicit,x=t.oxw();return t.KtG(x.upgrade(M.packageName))}),t._UZ(1,"nb-icon",19),t.qZA()}}function Z(c,h){if(1&c&&(t.TgZ(0,"a",21),t._uU(1),t.qZA()),2&c){const o=h.$implicit;t.Q6J("routerLink",o.link)("queryParams",o.query),t.xp6(1),t.hij(" ",o.name||"\u8bbe\u7f6e"," ")}}function i(c,h){if(1&c&&(t.TgZ(0,"nb-card-footer",12),t.YNc(1,Z,2,3,"a",20),t.qZA()),2&c){const o=t.oxw().$implicit;t.xp6(1),t.Q6J("ngForOf",o.actions)}}function l(c,h){if(1&c){const o=t.EpF();t.TgZ(0,"div",8)(1,"nb-card")(2,"nb-card-header"),t._uU(3),t.qZA(),t.TgZ(4,"nb-card-body")(5,"div",9),t._uU(6),t.qZA(),t.TgZ(7,"div",10)(8,"span"),t._uU(9,"\u4f5c\u8005:"),t.qZA(),t.TgZ(10,"span"),t.YNc(11,v,2,2,"a",11),t.qZA()(),t.TgZ(12,"div",10)(13,"span"),t._uU(14,"\u7248\u672c:"),t.qZA(),t.TgZ(15,"span"),t._uU(16),t.qZA()()(),t.TgZ(17,"nb-card-footer",12)(18,"button",13),t.NdJ("click",function(){const x=t.CHM(o).$implicit,A=t.oxw();return t.KtG(A.remove(x.packageName))}),t._uU(19,"\u5220\u9664"),t.qZA(),t.TgZ(20,"div",3)(21,"button",14),t.NdJ("click",function(){const x=t.CHM(o).$implicit,A=t.oxw();return t.KtG(x.enabled?A.inactivate(x.packageName):A.activate(x.packageName))}),t._uU(22),t.qZA(),t.YNc(23,p,2,0,"button",15),t.qZA()(),t.YNc(24,i,2,1,"nb-card-footer",16),t.qZA()()}if(2&c){const o=h.$implicit,_=t.oxw();t.xp6(3),t.hij(" ",o.name," "),t.xp6(3),t.hij(" ",o.description," "),t.xp6(5),t.Q6J("ngForOf",o.authors),t.xp6(5),t.Oqu(o.version),t.xp6(2),t.Q6J("disabled",o.enabled||_.spinner)("nbSpinner",_.spinner),t.xp6(3),t.Q6J("disabled",_.spinner)("nbSpinner",_.spinner)("status",o.enabled?"control":"primary"),t.xp6(1),t.hij(" ",o.enabled?"\u7981\u7528":"\u542f\u7528"," "),t.xp6(1),t.Q6J("ngIf",o.upgradeable),t.xp6(1),t.Q6J("ngIf",o.enabled&&o.actions.length>0)}}function m(c,h){if(1&c){const o=t.EpF();t.TgZ(0,"nb-card")(1,"nb-card-header"),t._uU(2,"\u5728\u7ebf\u4e0b\u8f7d"),t.qZA(),t.TgZ(3,"nb-card-body"),t._UZ(4,"input",22,23),t.qZA(),t.TgZ(6,"nb-card-footer",12)(7,"button",24),t.NdJ("click",function(){const x=t.CHM(o).dialogRef;return t.KtG(x.close())}),t._uU(8,"\u53d6\u6d88"),t.qZA(),t.TgZ(9,"button",25),t.NdJ("click",function(){const x=t.CHM(o).dialogRef,A=t.MAs(5),Y=t.oxw();return t.KtG(Y.openDownload(A.value,x))}),t._uU(10,"\u4e0b\u8f7d"),t.qZA()()()}}const f=function(){return["zip"]};let w=(()=>{class c{constructor(o,_,M,x,A){this.http=o,this.toast=_,this.route=M,this.dialog=x,this.sidebar=A,this.plugins=[],this.title="",this.spinner=!1}onSpinner(o){this.spinner=o}ngAfterViewInit(){(0,y.H)(0).subscribe(o=>{this.sidebar.getSidebarState("menu-sidebar").subscribe(_=>{"compacted"!==_&&this.sidebar.compact("menu-sidebar")})})}ngOnInit(){this.getPlugins(),this.route.data.subscribe(o=>{this.title=o.title})}getPlugins(){this.http.get("/plugin/installed").subscribe(o=>{o.records.length>0&&(this.plugins=o.records)})}inactivate(o){this.http.post("/plugin/{name}/deactivate",{name:o},{context:(new d.qT).set(u.a,this)}).subscribe(_=>{this.getPlugins()})}activate(o){this.http.post("/plugin/{name}/activate",{name:o},{context:(new d.qT).set(u.a,this)}).subscribe(_=>{this.getPlugins()})}upgrade(o){this.http.post("/plugin/{name}/upgrade",{name:o},{context:(new d.qT).set(u.a,this)}).subscribe(_=>{this.getPlugins()})}upload(o){o.length<1?this.toast.danger("\u4e0a\u4f20\u7684\u63d2\u4ef6\u6587\u4ef6\u4e3a\u7a7a","\u4e0a\u4f20\u63d2\u4ef6"):this.http.post(O,{uri:o.pop()}).subscribe(_=>{this.getPlugins()})}openDownload(o,_){/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(o)?this.http.post(O,{uri:o}).subscribe(x=>{_.close(),this.getPlugins()}):this.toast.danger("\u4e0d\u5408\u6cd5\u7684url\u94fe\u63a5","\u5728\u7ebf\u4e0b\u8f7d")}remove(o){this.http.post("/plugin/{name}/down",{name:o},{context:(new d.qT).set(u.a,this)}).subscribe(_=>{this.getPlugins()})}}return c.\u0275fac=function(o){return new(o||c)(t.Y36(d.eN),t.Y36(s.quB),t.Y36(r.gz),t.Y36(s.Gln),t.Y36(s.lzT))},c.\u0275cmp=t.Xpm({type:c,selectors:[["app-plugin-installed"]],decls:13,vars:4,consts:[[1,"row"],[1,"col-12"],[1,"d-flex","justify-content-between","align-items-center"],[1,"d-flex"],["nbButton","","status","danger",1,"me-2",3,"click"],[3,"suffix","status","finish"],["class","col-12 col-md-6 col-lg-4 col-xl-3",4,"ngFor","ngForOf"],["dialogTpl",""],[1,"col-12","col-md-6","col-lg-4","col-xl-3"],[1,"description"],[1,"d-flex","py-3","justify-content-between"],["class","d-inline-block mr-1","target","_blank",3,"href",4,"ngFor","ngForOf"],[1,"d-flex","justify-content-between"],["nbButton","","status","danger",3,"disabled","nbSpinner","click"],["nbButton","",3,"disabled","nbSpinner","status","click"],["class","ms-2","nbButton","","status","control",3,"click",4,"ngIf"],["class","d-flex justify-content-between",4,"ngIf"],["target","_blank",1,"d-inline-block","mr-1",3,"href"],["nbButton","","status","control",1,"ms-2",3,"click"],["icon","sync-outline"],["nbButton","","status","primary",3,"routerLink","queryParams",4,"ngFor","ngForOf"],["nbButton","","status","primary",3,"routerLink","queryParams"],["nbInput","","name","url","type","url","placeholder","\u4e0b\u8f7d\u5730\u5740"],["url",""],["nbButton","","status","basic",3,"click"],["nbButton","","status","primary",3,"click"]],template:function(o,_){if(1&o){const M=t.EpF();t.TgZ(0,"div",0)(1,"div",1)(2,"nb-card")(3,"nb-card-header",2)(4,"span"),t._uU(5,"\u5df2\u5b89\u88c5\u63d2\u4ef6\u5217\u8868"),t.qZA(),t.TgZ(6,"div",3)(7,"button",4),t.NdJ("click",function(){t.CHM(M);const A=t.MAs(12);return t.KtG(_.dialog.open(A))}),t._uU(8,"\u5728\u7ebf\u4e0b\u8f7d"),t.qZA(),t.TgZ(9,"app-upload",5),t.NdJ("finish",function(A){return _.upload(A)}),t.qZA()()()()(),t.YNc(10,l,25,12,"div",6),t.qZA(),t.YNc(11,m,11,0,"ng-template",null,7,t.W1O)}2&o&&(t.xp6(9),t.Q6J("suffix",t.DdM(3,f))("status","primary"),t.xp6(1),t.Q6J("ngForOf",_.plugins))},dependencies:[n.sg,n.O5,r.rH,s.Asz,s.yKW,s.XWE,s.ndF,s.DPz,s.h8i,s.Q7R,s.fMN,g.o],encapsulation:2}),c})();var B=a(5998);function J(c,h){if(1&c&&(t.TgZ(0,"a",9),t._uU(1),t.qZA()),2&c){const o=h.$implicit;t.Q6J("href",o.homepage?o.homepage:"#",t.LSH),t.xp6(1),t.hij(" ",o.name," ")}}function S(c,h){if(1&c){const o=t.EpF();t.TgZ(0,"div",3)(1,"nb-card")(2,"nb-card-header"),t._uU(3),t.qZA(),t.TgZ(4,"nb-card-body")(5,"div",4),t._uU(6),t.qZA(),t.TgZ(7,"div",5)(8,"span"),t._uU(9,"\u4f5c\u8005:"),t.qZA(),t.TgZ(10,"span"),t.YNc(11,J,2,2,"a",6),t.qZA()(),t.TgZ(12,"div",5)(13,"span"),t._uU(14,"\u7248\u672c:"),t.qZA(),t.TgZ(15,"span"),t._uU(16),t.qZA()()(),t.TgZ(17,"nb-card-footer",7)(18,"button",8),t.NdJ("click",function(){const x=t.CHM(o).$implicit,A=t.oxw();return t.KtG(A.setup(x.packageName))}),t._uU(19),t.qZA()()()()}if(2&c){const o=h.$implicit,_=t.oxw();t.xp6(3),t.Oqu(o.name),t.xp6(3),t.hij(" ",o.description," "),t.xp6(5),t.Q6J("ngForOf",o.authors),t.xp6(5),t.Oqu(o.version),t.xp6(2),t.Q6J("disabled",o.installed||_.spinner)("nbSpinner",_.spinner),t.xp6(1),t.Oqu(o.installed?"\u5df2\u5b89\u88c5":"\u5b89\u88c5")}}let k=(()=>{class c{constructor(o,_,M,x,A){this.http=o,this.toast=_,this.route=M,this.sanitizer=x,this.sidebar=A,this.plugins=[],this.title="",this.spinner=!1}onSpinner(o){this.spinner=o}ngAfterViewInit(){(0,y.H)(0).subscribe(o=>{this.sidebar.getSidebarState("menu-sidebar").subscribe(_=>{"compacted"!==_&&this.sidebar.compact("menu-sidebar")})})}ngOnInit(){this.getPlugins(),this.route.data.subscribe(o=>{this.title=o.title})}getPlugins(){this.http.get("/plugin/market").subscribe(o=>{o.records.length>0&&(this.plugins=o.records)})}setup(o){this.http.post("/plugin/{name}/setup",{name:o},{context:(new d.qT).set(u.a,this)}).subscribe(_=>{this.getPlugins()})}}return c.\u0275fac=function(o){return new(o||c)(t.Y36(d.eN),t.Y36(s.quB),t.Y36(r.gz),t.Y36(B.H7),t.Y36(s.lzT))},c.\u0275cmp=t.Xpm({type:c,selectors:[["app-plugin-market"]],decls:6,vars:1,consts:[[1,"row"],[1,"col-12"],["class","col-12 col-md-6 col-lg-4 col-xl-3",4,"ngFor","ngForOf"],[1,"col-12","col-md-6","col-lg-4","col-xl-3"],[1,"description"],[1,"d-flex","py-3","justify-content-between"],["class","d-inline-block mr-1","target","_blank",3,"href",4,"ngFor","ngForOf"],[1,"d-flex","justify-content-end"],["nbButton","","status","primary",3,"disabled","nbSpinner","click"],["target","_blank",1,"d-inline-block","mr-1",3,"href"]],template:function(o,_){1&o&&(t.TgZ(0,"div",0)(1,"div",1)(2,"nb-card")(3,"nb-card-header"),t._uU(4," \u63d2\u4ef6\u5e02\u573a "),t.qZA()()(),t.YNc(5,S,20,7,"div",2),t.qZA()),2&o&&(t.xp6(5),t.Q6J("ngForOf",_.plugins))},dependencies:[n.sg,s.Asz,s.yKW,s.XWE,s.ndF,s.DPz,s.Q7R],encapsulation:2}),c})();var K=a(161),L=a(2047),Q=a(9598);const q=[{path:"market",title:"\u63d2\u4ef6\u5e02\u573a",component:k},{path:"installed",title:"\u5df2\u5b89\u88c5\u63d2\u4ef6",component:w},{path:"feature",component:K.b}];let G=(()=>{class c{}return c.\u0275fac=function(o){return new(o||c)},c.\u0275mod=t.oAB({type:c}),c.\u0275inj=t.cJS({imports:[n.ez,r.Bz.forChild(q),T.O,D.c,s.COg,Q.Ke,L.s]}),c})()},1784:(N,P,a)=>{a.d(P,{o:()=>y});var n=a(4537),T=a(4967),D=a(916),d=a(9467),e=a(8692);const b=["file"];function C(u,t){if(1&u&&(n.TgZ(0,"nb-progress-bar",18),n.ALo(1,"async"),n._uU(2),n.qZA()),2&u){const s=n.oxw().$implicit,r=n.oxw();n.Q6J("status",r.messages[s.name]?"danger":"success")("displayValue",!r.messages[s.name])("value",n.lcZ(1,4,r.progress[s.name].progress)),n.xp6(2),n.hij(" ",r.messages[s.name]," ")}}function E(u,t){if(1&u){const s=n.EpF();n.TgZ(0,"div",13)(1,"nb-icon",19),n.NdJ("click",function(){n.CHM(s);const g=n.oxw().$implicit,v=n.oxw();return n.KtG(v.remove(g))}),n.qZA()()}}function O(u,t){if(1&u&&(n.TgZ(0,"nb-list-item")(1,"div",12)(2,"div",13),n._UZ(3,"nb-icon",14),n.qZA(),n.TgZ(4,"div",15),n._uU(5),n.qZA(),n.TgZ(6,"div",15),n.YNc(7,C,3,6,"nb-progress-bar",16),n.qZA(),n.YNc(8,E,2,0,"div",17),n.qZA()()),2&u){const s=t.$implicit,r=n.oxw();n.xp6(5),n.hij(" ",s.name," "),n.xp6(2),n.Q6J("ngIf",r.progress),n.xp6(1),n.Q6J("ngIf",!r.uploading&&!r.uploadSuccessful)}}function F(u,t){if(1&u&&(n.TgZ(0,"div",20),n._uU(1),n.qZA()),2&u){const s=n.oxw();n.xp6(1),n.hij(" ",s.errorMessage," ")}}function I(u,t){if(1&u){const s=n.EpF();n.TgZ(0,"button",21),n.NdJ("click",function(){n.CHM(s);const g=n.oxw();return n.KtG(g.dialogRef.close())}),n._uU(1,"\u53d6\u6d88"),n.qZA()}}let U=(()=>{class u{constructor(s,r){this.dialogRef=s,this.uploadService=r,this.files=new Set,this.multiple=!1,this.suffix=[],this.canBeClosed=!0,this.primaryButtonText="\u4e0a\u4f20",this.showCancelButton=!0,this.uploading=!1,this.uploadSuccessful=!1,this.messages={},this.errorMessage="",this.results=[]}ngOnInit(){}onFilesAdded(){var s;const r=null===(s=this.file)||void 0===s?void 0:s.nativeElement.files;let g="";for(const v in r){if(isNaN(parseInt(v,10)))continue;let p=r[v];console.log(p);let Z=p.name.split(".");this.suffix.length>0&&!this.suffix.includes(Z[Z.length-1].toLowerCase())?g="\u6b64\u6587\u4ef6\u7c7b\u578b\u4e0d\u652f\u6301\uff0c\u53ea\u652f\u6301: "+this.suffix.join(",")+"\u6587\u4ef6\u683c\u5f0f":this.files.add(p)}this.errorMessage=g}addFiles(){var s;null===(s=this.file)||void 0===s||s.nativeElement.click()}closeDialog(){var s;if(this.uploadSuccessful)return null===(s=this.finish)||void 0===s||s.emit(this.results),this.dialogRef.close();if(this.files.size<1)return void(this.errorMessage="\u9009\u62e9\u9700\u8981\u4e0a\u4f20\u7684\u6587\u4ef6!");this.uploading=!0,this.progress=this.uploadService.upload(this.files);for(const g in this.progress)this.progress[g].progress.subscribe(v=>console.log(v)),this.progress[g].response.subscribe(v=>{v.hasOwnProperty("statusText")?this.messages[g]=v.statusText:v.hasOwnProperty("status")&&"ok"!=v.status?this.messages[g]=v.message:this.results.push(v.filename)});const r=[];for(const g in this.progress)r.push(this.progress[g].progress);this.primaryButtonText="\u5b8c\u6210",this.canBeClosed=!1,this.showCancelButton=!1,(0,T.D)(r).subscribe(g=>{this.canBeClosed=!0,this.uploadSuccessful=!0,this.uploading=!1})}remove(s){this.files.delete(s)}}return u.\u0275fac=function(s){return new(s||u)(n.Y36(d.X4l),n.Y36(D.C))},u.\u0275cmp=n.Xpm({type:u,selectors:[["app-dialog"]],viewQuery:function(s,r){if(1&s&&n.Gf(b,5),2&s){let g;n.iGM(g=n.CRH())&&(r.file=g.first)}},inputs:{multiple:"multiple",suffix:"suffix"},outputs:{finish:"finish"},features:[n._Bn([D.C])],decls:20,vars:7,consts:[[1,"row"],[1,"col-12"],["type","file",2,"display","none",3,"multiple","change"],["file",""],[1,"list-card"],[1,"d-flex","justify-content-between","align-items-center"],["nbButton","","status","primary",3,"disabled","click"],[4,"ngFor","ngForOf"],[1,"actions"],["class","col-12 text-danger py-2",4,"ngIf"],[1,"col-12","d-flex","justify-content-between"],["nbButton","","status","control","class","mr-2",3,"click",4,"ngIf"],[1,"row","flex-grow-1","flex-nowrap"],[1,"col-1"],["status","primary","icon","file"],[1,"col-5"],[3,"status","displayValue","value",4,"ngIf"],["class","col-1",4,"ngIf"],[3,"status","displayValue","value"],["icon","close","status","danger",2,"cursor","pointer",3,"click"],[1,"col-12","text-danger","py-2"],["nbButton","","status","control",1,"mr-2",3,"click"]],template:function(s,r){1&s&&(n.TgZ(0,"div",0)(1,"div",1)(2,"input",2,3),n.NdJ("change",function(){return r.onFilesAdded()}),n.qZA(),n.TgZ(4,"nb-card",4)(5,"nb-card-header",5)(6,"span"),n._uU(7,"\u4e0a\u4f20\u6587\u4ef6"),n.qZA(),n.TgZ(8,"button",6),n.NdJ("click",function(){return r.addFiles()}),n._uU(9,"\u6dfb\u52a0\u6587\u4ef6"),n.qZA()(),n.TgZ(10,"nb-card-body")(11,"nb-list"),n.YNc(12,O,9,3,"nb-list-item",7),n.qZA()(),n.TgZ(13,"nb-card-footer",8)(14,"div",0),n.YNc(15,F,2,1,"div",9),n.TgZ(16,"div",10),n.YNc(17,I,2,0,"button",11),n.TgZ(18,"button",6),n.NdJ("click",function(){return r.closeDialog()}),n._uU(19),n.qZA()()()()()()()),2&s&&(n.xp6(2),n.Q6J("multiple",r.multiple),n.xp6(6),n.Q6J("disabled",r.uploading||r.uploadSuccessful),n.xp6(4),n.Q6J("ngForOf",r.files),n.xp6(3),n.Q6J("ngIf",r.errorMessage.length>0),n.xp6(2),n.Q6J("ngIf",r.showCancelButton),n.xp6(1),n.Q6J("disabled",!r.canBeClosed||r.files.size<1),n.xp6(1),n.Oqu(r.primaryButtonText))},dependencies:[e.sg,e.O5,d.DPz,d.bSZ,d.zP_,d.qBV,d.Asz,d.yKW,d.XWE,d.ndF,d.fMN,e.Ov],styles:["nb-card[_ngcontent-%COMP%]{min-width:290px}.list-card[_ngcontent-%COMP%]   nb-card-header[_ngcontent-%COMP%]{border-bottom:none}.list-card[_ngcontent-%COMP%]   nb-card-footer[_ngcontent-%COMP%]{border-top:none}.list-card[_ngcontent-%COMP%]   nb-card-body[_ngcontent-%COMP%]{padding:0}"]}),u})(),y=(()=>{class u{constructor(s){this.dialog=s,this.multiple=!1,this.text="\u4e0a\u4f20",this.status="primary",this.suffix=[],this.finish=new n.vpe}openUploadDialog(){const s=this.dialog.open(U,{closeOnBackdropClick:!1,closeOnEsc:!1});s.componentRef.instance.multiple=this.multiple,s.componentRef.instance.finish=this.finish,s.componentRef.instance.suffix=this.suffix}}return u.\u0275fac=function(s){return new(s||u)(n.Y36(d.Gln))},u.\u0275cmp=n.Xpm({type:u,selectors:[["app-upload"]],inputs:{multiple:"multiple",text:"text",status:"status",suffix:"suffix"},outputs:{finish:"finish"},decls:2,vars:2,consts:[["type","button","nbButton","",3,"status","click"]],template:function(s,r){1&s&&(n.TgZ(0,"button",0),n.NdJ("click",function(){return r.openUploadDialog()}),n._uU(1),n.qZA()),2&s&&(n.Q6J("status",r.status),n.xp6(1),n.Oqu(r.text))},dependencies:[d.DPz],styles:["[_nghost-%COMP%]{display:block}"]}),u})()},2521:(N,P,a)=>{a.d(P,{c:()=>e});var n=a(8692),T=a(9467),D=a(916),d=a(4537);let e=(()=>{class b{}return b.\u0275fac=function(E){return new(E||b)},b.\u0275mod=d.oAB({type:b}),b.\u0275inj=d.cJS({providers:[D.C],imports:[n.ez,T.T2N,T.DfH,T.COg,T.zyh,T.KdK]}),b})()}}]);