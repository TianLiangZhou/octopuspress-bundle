"use strict";(self.webpackChunkdashboard=self.webpackChunkdashboard||[]).push([[290],{290:(Q,v,r)=>{r.r(v),r.d(v,{CommentModule:()=>P});var c=r(3223),t=r(3714),g=r(3250),h=r(3032),u=r(9223),C=r(7667),d=r(450),f=r(8934),s=r(24);const _=function(o,i){return{"fs-6":o,"text-primary":i}},Z=function(){return["./"]},T=function(o){return{status:o}};function M(o,i){if(1&o&&(t.ynx(0),t.TgZ(1,"a",7),t._uU(2),t.qZA(),t.BQk()),2&o){const a=i.$implicit,n=t.oxw();t.xp6(1),t.Tol(t.WLB(5,_,a.value==n.radioFilter.value,a.value==n.radioFilter.value)),t.Q6J("routerLink",t.DdM(8,Z))("queryParams",t.VKq(9,T,a.value)),t.xp6(1),t.Oqu(a.label)}}function y(o,i){if(1&o&&(t.TgZ(0,"nb-option",8),t._uU(1),t.qZA()),2&o){const a=i.$implicit;t.Q6J("value",a.value),t.xp6(1),t.Oqu(a.label)}}function F(o,i){if(1&o){const a=t.EpF();t.TgZ(0,"a",3),t.NdJ("click",function(){const l=t.CHM(a).$implicit,m=t.oxw();return t.KtG(m.click(l.value))}),t._uU(1),t.qZA()}if(2&o){const a=i.$implicit;t.ekj("ps-0",0==i.index),t.Q6J("routerLink",a.link)("queryParams",a.query),t.xp6(1),t.Oqu(a.title)}}function A(o,i){if(1&o&&(t.TgZ(0,"nb-radio",19),t._uU(1),t.qZA()),2&o){const a=i.$implicit;t.Q6J("value",a.value),t.xp6(1),t.Oqu(a.label)}}function q(o,i){if(1&o&&(t.TgZ(0,"div",10)(1,"label",14),t._uU(2,"\u56de\u5e94\u7ed9: "),t.qZA(),t.TgZ(3,"h6",11)(4,"a",20),t._uU(5),t.qZA()()()),2&o){const a=t.oxw();t.xp6(4),t.Q6J("routerLink","/app/content/edit-post/"+a.comment.post.id),t.xp6(1),t.Oqu(a.comment.post.title)}}function J(o,i){if(1&o&&(t.TgZ(0,"a",1),t._uU(1,"\u67e5\u770b\u6587\u7ae0"),t.qZA()),2&o){const a=t.oxw();t.Q6J("routerLink","/app/content/edit-post/"+a.value.id)}}let k=(()=>{var o;class i{constructor(n,e,l){this.http=n,this.activatedRoute=e,this.configService=l,this.radioFilter=new u.NI("all"),this.radios=[],this.settings={columns:{}},this.batches=[{label:"\u6279\u91cf\u64cd\u4f5c",value:""},{label:"\u9a73\u56de",value:"unapproved"},{label:"\u6279\u51c6",value:"approved"},{label:"\u6807\u8bb0\u4e3a\u5783\u573e",value:"spam"},{label:"\u79fb\u81f3\u56de\u6536\u7ad9",value:"trash"}],this.batchMode="",this.spinner=!1,this.route=e.snapshot}ngOnInit(){this.settings=this.buildSettings(),this.activatedRoute.queryParams.subscribe(n=>{let e=Object.assign({status:this.radioFilter.value},n);this.radioFilter.setValue(e.status),this.loadSource(e)})}loadSource(n){let e=new g.LE({fromObject:n});this.http.get("/comment/statistics",{params:e}).subscribe(l=>{this.radios=[{label:`\u5168\u90e8 (${l.all})`,value:"all"},{label:`\u6211\u7684 (${l.my})`,value:"my"},{label:`\u5f85\u5ba1 (${l.unapproved})`,value:"unapproved"},{label:`\u5df2\u6279\u51c6 (${l.approved})`,value:"approved"},{label:`\u5783\u573e (${l.spam})`,value:"spam"},{label:`\u56de\u6536\u7ad9 (${l.trash})`,value:"trash"}]}),this.source=new h.zV(this.http,{endPoint:"/comment?"+e.toString(),dataKey:"records",totalKey:"total",pagerPageKey:"page",pagerLimitKey:"limit",filterFieldKey:"#field#"})}edit(n){}batch(){if(""==this.batchMode)return;const n=[];this.source.getSelectedItems().forEach(e=>{n.push(e.id)}),!(n.length<1)&&this.updateStatus(this.batchMode,n)}updateStatus(n,e){this.http.post("/comment/"+n,{id:e},{context:(new g.qT).set(C.a,this)}).subscribe(()=>{this.loadSource(this.activatedRoute.snapshot.queryParams)})}buildSettings(){return{selectMode:"multi",actions:{position:"right",add:!1,edit:!1,delete:!1,columnTitle:"\u64cd\u4f5c"},pager:{perPage:30},mode:"external",columns:{author:{title:"\u4f5c\u8005",isFilterable:!1},content:{title:"\u8bc4\u8bba",isFilterable:!0,type:"custom",renderComponent:O,componentInitFunction:(n,e)=>{n.value=e.getValue(),n.rowData=e.getRow().getData(),n.onClick().subscribe(l=>{this.updateStatus(l.action,[l.id])})}},post:{title:"\u56de\u590d\u81f3",type:"custom",renderComponent:b,componentInitFunction:b.initComponent,isFilterable:!1},createdAt:{title:"\u8bc4\u8bba\u4e8e",isFilterable:!1}}}}onSpinner(n){this.spinner=n}}return(o=i).\u0275fac=function(n){return new(n||o)(t.Y36(g.eN),t.Y36(d.gz),t.Y36(f.eB))},o.\u0275cmp=t.Xpm({type:o,selectors:[["app-comment"]],decls:12,vars:8,consts:[[4,"ngFor","ngForOf"],[1,"row","mb-2",3,"ngSubmit"],["name","batchMode",1,"col-auto",3,"ngModel","ngModelChange"],[3,"value",4,"ngFor","ngForOf"],[1,"col-auto"],["nbButton","","status","primary","type","submit",3,"disabled","nbSpinner"],[3,"settings","source","edit"],["nbButton","","queryParamsHandling","merge",1,"mx-2","bg-transparent","border-0","ps-0",2,"color","var(--text-basic-color)",3,"routerLink","queryParams"],[3,"value"]],template:function(n,e){1&n&&(t.TgZ(0,"nb-card")(1,"nb-card-header"),t._uU(2),t.qZA(),t.TgZ(3,"nb-card-body"),t.YNc(4,M,3,11,"ng-container",0),t.TgZ(5,"form",1),t.NdJ("ngSubmit",function(){return e.batch()}),t.TgZ(6,"nb-select",2),t.NdJ("ngModelChange",function(m){return e.batchMode=m}),t.YNc(7,y,2,2,"nb-option",3),t.qZA(),t.TgZ(8,"div",4)(9,"button",5),t._uU(10,"\u5e94\u7528"),t.qZA()()(),t.TgZ(11,"angular2-smart-table",6),t.NdJ("edit",function(m){return e.edit(m)}),t.qZA()()()),2&n&&(t.xp6(2),t.Oqu(e.route.title),t.xp6(2),t.Q6J("ngForOf",e.radios),t.xp6(2),t.Q6J("ngModel",e.batchMode),t.xp6(1),t.Q6J("ngForOf",e.batches),t.xp6(2),t.Q6J("disabled",!e.batchMode||e.spinner)("nbSpinner",e.spinner),t.xp6(2),t.Q6J("settings",e.settings)("source",e.source))},dependencies:[c.sg,d.rH,u._Y,u.JJ,u.JL,u.On,u.F,s.Asz,s.yKW,s.ndF,s.DPz,s.Q7R,s.rs,s.q51,h.i0]}),i})(),O=(()=>{var o;class i{constructor(n){this.http=n,this.actionClick=new t.vpe,this.actions=[]}onClick(){return this.actionClick}click(n){return"edit"===n||this.actionClick.emit({action:n,id:this.rowData.id}),!1}ngOnInit(){const e=[];switch(this.rowData.approved){case"approved":e.push({title:"\u9a73\u56de",icon:"slash-outline",value:"unapproved"},{title:"\u7f16\u8f91",icon:"edit-2-outline",value:"edit"},{title:"\u6807\u8bb0\u4e3a\u5783\u573e",icon:"bookmark-outline",value:"spam"},{title:"\u79fb\u81f3\u56de\u6536\u7ad9",icon:"trash-2-outline",value:"trash"});break;case"unapproved":e.push({title:"\u6279\u51c6",icon:"checkmark-circle-outline",value:"approved"},{title:"\u7f16\u8f91",icon:"edit-2-outline",value:"edit"},{title:"\u6807\u8bb0\u4e3a\u5783\u573e",icon:"bookmark-outline",value:"spam"},{title:"\u79fb\u81f3\u56de\u6536\u7ad9",icon:"trash-2-outline",value:"trash"});break;case"spam":e.push({title:"\u4e0d\u662f\u5783\u573e\u8bc4\u8bba",icon:"undo-outline",value:"unapproved"},{title:"\u6c38\u4e45\u5220\u9664",icon:"trash-outline",value:"delete"});break;case"trash":e.push({title:"\u6807\u8bb0\u4e3a\u5783\u573e",icon:"bookmark-outline",value:"spam"},{title:"\u8fd8\u539f",icon:"undo-outline",value:"unapproved"},{title:"\u6c38\u4e45\u5220\u9664",icon:"trash-outline",value:"delete"})}this.actions=e}}return(o=i).\u0275fac=function(n){return new(n||o)(t.Y36(g.eN))},o.\u0275cmp=t.Xpm({type:o,selectors:[["app-comment-actions"]],inputs:{value:"value",rowData:"rowData"},decls:4,vars:2,consts:[[1,"py-3"],["id","actions"],["class","px-2","queryParamsHandling","merge",3,"ps-0","routerLink","queryParams","click",4,"ngFor","ngForOf"],["queryParamsHandling","merge",1,"px-2",3,"routerLink","queryParams","click"]],template:function(n,e){1&n&&(t.TgZ(0,"div",0),t._uU(1),t.qZA(),t.TgZ(2,"div",1),t.YNc(3,F,2,5,"a",2),t.qZA()),2&n&&(t.xp6(1),t.Oqu(e.value),t.xp6(2),t.Q6J("ngForOf",e.actions))},dependencies:[c.sg,d.rH],styles:["[_nghost-%COMP%]   #actions[_ngcontent-%COMP%]{visibility:hidden}[_nghost-%COMP%]:hover   #actions[_ngcontent-%COMP%]{visibility:visible}"]}),i})(),E=(()=>{var o;class i{constructor(n,e,l){this.http=n,this.route=e,this.location=l,this.comment={},this.options=[]}ngOnInit(){this.route.paramMap.subscribe(n=>{let e=parseInt(n.get("id"),10);e>0&&this.http.get("/comment/"+e).subscribe(l=>{this.comment=l,this.options=[{label:"\u6279\u51c6",value:"approved"},{label:"unapproved"===this.comment.approved?"\u5f85\u5ba1":"\u9a73\u56de",value:"unapproved"},{label:"\u6807\u8bb0\u4e3a\u5783\u573e",value:"spam"}],("spam"==this.comment.approved||"trash"==this.comment.approved)&&this.location.back()})})}onSubmit(n){console.log(n.invalid,n.valid),!n.invalid&&this.comment.id&&this.http.post("/comment/{id}/update",this.comment).subscribe(()=>{this.location.back()})}getStatus(n){return this.options.find(e=>e.value==n)?.label}}return(o=i).\u0275fac=function(n){return new(n||o)(t.Y36(g.eN),t.Y36(d.gz),t.Y36(c.S$))},o.\u0275cmp=t.Xpm({type:o,selectors:[["app-comment-edit"]],decls:44,vars:10,consts:[[1,"row",3,"ngSubmit"],["f","ngForm"],[1,"col-9"],[1,"mb-3"],[1,"label","form-label"],["nbInput","","fullWidth","","name","author","status","primary",3,"ngModel","ngModelChange"],["nbInput","","fullWidth","","name","email","type","email","status","primary",3,"ngModel","ngModelChange"],["nbInput","","fullWidth","","name","url","type","url","status","primary",3,"ngModel","ngModelChange"],["nbInput","","fullWidth","","name","content","rows","5","status","primary",3,"ngModel","ngModelChange"],[1,"col-3"],[1,"d-flex","align-items-center"],[1,"ms-2"],["name","approved",3,"ngModel","ngModelChange"],[3,"value",4,"ngFor","ngForOf"],[1,"label"],["class","d-flex align-items-center",4,"ngIf"],[1,"d-flex","justify-content-between"],["href","#"],["nbButton","","status","primary","size","small","type","submit",3,"disabled"],[3,"value"],[3,"routerLink"]],template:function(n,e){if(1&n){const l=t.EpF();t.TgZ(0,"form",0,1),t.NdJ("ngSubmit",function(){t.CHM(l);const p=t.MAs(1);return t.KtG(e.onSubmit(p))}),t.TgZ(2,"div",2)(3,"nb-card")(4,"nb-card-body")(5,"div",3)(6,"label",4),t._uU(7,"\u4f5c\u8005\u663e\u793a\u540d\u79f0:"),t.qZA(),t.TgZ(8,"input",5),t.NdJ("ngModelChange",function(p){return e.comment.author=p}),t.qZA()(),t.TgZ(9,"div",3)(10,"label",4),t._uU(11,"\u4f5c\u8005\u7535\u5b50\u90ae\u7bb1\u5730\u5740:"),t.qZA(),t.TgZ(12,"input",6),t.NdJ("ngModelChange",function(p){return e.comment.email=p}),t.qZA()(),t.TgZ(13,"div",3)(14,"label",4),t._uU(15,"\u4f5c\u8005URL:"),t.qZA(),t.TgZ(16,"input",7),t.NdJ("ngModelChange",function(p){return e.comment.url=p}),t.qZA()(),t.TgZ(17,"div",3)(18,"label",4),t._uU(19,"\u8bc4\u8bba:"),t.qZA(),t.TgZ(20,"textarea",8),t.NdJ("ngModelChange",function(p){return e.comment.content=p}),t.qZA()()()()(),t.TgZ(21,"div",9)(22,"nb-card")(23,"nb-card-header"),t._uU(24,"\u4fdd\u5b58"),t.qZA(),t.TgZ(25,"nb-card-body")(26,"div",10)(27,"label",4),t._uU(28,"\u72b6\u6001: "),t.qZA(),t.TgZ(29,"h6",11),t._uU(30),t.qZA()(),t.TgZ(31,"nb-radio-group",12),t.NdJ("ngModelChange",function(p){return e.comment.approved=p}),t.YNc(32,A,2,2,"nb-radio",13),t.qZA(),t.TgZ(33,"div",10)(34,"label",14),t._uU(35,"\u63d0\u4ea4\u4e8e: "),t.qZA(),t.TgZ(36,"div",11),t._uU(37),t.qZA()(),t.YNc(38,q,6,2,"div",15),t.qZA(),t.TgZ(39,"nb-card-footer",16)(40,"a",17),t._uU(41,"\u79fb\u81f3\u56de\u6536\u7ad9"),t.qZA(),t.TgZ(42,"button",18),t._uU(43,"\u66f4\u65b0"),t.qZA()()()()()}if(2&n){const l=t.MAs(1);t.xp6(8),t.Q6J("ngModel",e.comment.author),t.xp6(4),t.Q6J("ngModel",e.comment.email),t.xp6(4),t.Q6J("ngModel",e.comment.url),t.xp6(4),t.Q6J("ngModel",e.comment.content),t.xp6(10),t.Oqu(e.getStatus(e.comment.approved)),t.xp6(1),t.Q6J("ngModel",e.comment.approved),t.xp6(1),t.Q6J("ngForOf",e.options),t.xp6(5),t.Oqu(e.comment.createdAt),t.xp6(1),t.Q6J("ngIf",e.comment.post),t.xp6(4),t.Q6J("disabled",l.invalid)}},dependencies:[c.sg,c.O5,d.rH,u._Y,u.Fj,u.JJ,u.JL,u.On,u.F,s.Asz,s.yKW,s.XWE,s.ndF,s.DPz,s.h8i,s.r3g,s.MFI],encapsulation:2}),i})(),b=(()=>{var o;class i{constructor(){this.value=null}ngOnInit(){}static initComponent(n,e){n.value=e.getRawValue(),n.rowData=e.getRow().getData()}}return(o=i).\u0275fac=function(n){return new(n||o)},o.\u0275cmp=t.Xpm({type:o,selectors:[["app-comment-post"]],inputs:{value:"value",rowData:"rowData"},decls:1,vars:1,consts:[[3,"routerLink",4,"ngIf"],[3,"routerLink"]],template:function(n,e){1&n&&t.YNc(0,J,2,1,"a",0),2&n&&t.Q6J("ngIf",e.value)},dependencies:[c.O5,d.rH],encapsulation:2}),i})();var S=r(2939);let P=(()=>{var o;class i{}return(o=i).\u0275fac=function(n){return new(n||o)},o.\u0275mod=t.oAB({type:o}),o.\u0275inj=t.cJS({imports:[c.ez,d.Bz.forChild([{path:"",component:k,pathMatch:"full"},{path:":id",title:"\u7f16\u8f91\u8bc4\u8bba",component:E}]),S.O,h.Ke]}),i})()}}]);