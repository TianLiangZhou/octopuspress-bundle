"use strict";(self.webpackChunkdashboard=self.webpackChunkdashboard||[]).push([[885],{5403:(C,v,i)=>{i.d(v,{C:()=>g});var d=i(2939),c=i(8748),h=i(6796),f=i(4966);let g=(()=>{var e;class m{constructor(n){this.http=n}upload(n){const s={};return n.forEach(w=>{const F=new FormData;F.append("file",w,w.name);const y=new d.aW("POST",h.UE,F,{responseType:"json",reportProgress:!0}),T=new c.x,_=new c.x;(new Date).getTime(),this.http.request(y).subscribe({next(b){if(b.type===d.dt.UploadProgress){const E=Math.round(100*b.loaded/b.total);T.next(E)}else b instanceof d.Zn&&(_.next(b.body),T.complete())},error(b){_.next(b),T.complete()}}),s[w.name]={response:_,progress:T.asObservable()}}),s}}return(e=m).\u0275fac=function(n){return new(n||e)(f.LFG(d.eN))},e.\u0275prov=f.Yz7({token:e,factory:e.\u0275fac}),m})()},5885:(C,v,i)=>{i.r(v),i.d(v,{UserModule:()=>S});var d=i(6733),c=i(6248),h=i(2939),f=i(3008),g=i(3361),e=i(4966),m=i(9089),Z=i(9913),n=i(3226),s=i(2526);function w(r,l){if(1&r&&(e.TgZ(0,"nb-option",10),e._uU(1),e.qZA()),2&r){const u=l.$implicit;e.Q6J("value",u.value),e.xp6(),e.Oqu(u.label)}}function F(r,l){if(1&r&&e._UZ(0,"img",4),2&r){const u=e.oxw();e.Q6J("src",u.rowData.avatar,e.LSH)}}const y=r=>({author:r});function T(r,l){if(1&r&&(e.TgZ(0,"a",5),e._uU(1),e.qZA()),2&r){const u=l.$implicit,o=l.index,t=e.oxw();e.ekj("ms-0",0==o),e.Q6J("routerLink","/app/content/"+u.type)("queryParams",e.VKq(5,y,t.rowData.id)),e.xp6(),e.Oqu(u.label)}}let _=(()=>{var r;class l{constructor(o,t,a){this.http=o,this.activatedRoute=t,this.configService=a,this.settings={columns:{}},this.batches=[{label:"\u6279\u91cf\u64cd\u4f5c",value:""},{label:"\u5220\u9664",value:"delete"},{label:"\u53d1\u9001\u5bc6\u7801\u91cd\u7f6e\u90ae\u4ef6",value:"reset"}],this.batchMode="",this.roles=[],this.spinner=!1,this.route=t.snapshot}ngOnInit(){this.roles=this.configService.roles(),this.settings=this.buildSettings(),this.source=new f.zV(this.http,{endPoint:c.tg,dataKey:"records",totalKey:"total",pagerPageKey:"page",pagerLimitKey:"limit",filterFieldKey:"#field#"})}buildSettings(){return{selectMode:"multi",actions:{position:"right",add:!1,edit:!1,delete:!0,columnTitle:"\u64cd\u4f5c"},edit:{editButtonContent:'<i class="nb-edit"></i>',saveButtonContent:'<i class="nb-checkmark"></i>',cancelButtonContent:'<i class="nb-close"></i>'},delete:{deleteButtonContent:'<i class="nb-trash"></i>',confirmDelete:!0},pager:{perPage:30},mode:"external",rowClassFunction:()=>"text-break",columns:{account:{title:"\u7528\u6237\u540d",type:"custom",isFilterable:!0,renderComponent:U,componentInitFunction:(o,t)=>{o.value=t.getValue(),o.rowData=t.getRow().getData(),o.postTypeSettings=this.configService.postTypes()}},nickname:{title:"\u663e\u793a\u540d\u79f0",type:"text",isFilterable:!0,valuePrepareFunction:(o,t)=>o==t.getRow().getData().account?"-":o},roles:{title:"\u89d2\u8272",type:"text",isFilterable:!1,valuePrepareFunction:(o,t)=>{if(o.length<1)return"-";let a=[];return o.forEach(p=>{this.roles[p-1]&&a.push(this.roles[p-1].label)}),a.join(",")}},email:{title:"\u90ae\u7bb1",type:"html",isFilterable:!0,valuePrepareFunction:(o,t)=>`<a href="mailto:${o}">${o}</a>`},registeredAt:{title:"\u52a0\u5165\u65f6\u95f4",type:"text",isFilterable:!1}}}}delete(o){let t=o.data;1!=t.id?window.confirm("\u786e\u8ba4\u5220\u9664\u7528\u6237: "+t.account)&&(this.deleteUser([t.id]),this.http.post(c.Ic,{id:t.id}).subscribe(a=>{this.source?.refresh()})):window.alert("\u6b64\u7528\u6237\u4e0d\u80fd\u88ab\u5220\u9664!")}batch(){let o=[];switch(this.source?.getSelectedItems().forEach(t=>{o.push(t.id)}),this.batchMode){case"delete":o.length>0&&window.confirm("\u786e\u8ba4\u5220\u9664\u5df2\u9009\u62e9\u7684\u7528\u6237?")&&this.deleteUser(o);break;case"reset":o.length>0&&window.confirm("\u786e\u8ba4\u7ed9\u5df2\u9009\u62e9\u7684\u7528\u6237\u53d1\u9001\u91cd\u7f6e\u5bc6\u7801\u90ae\u4ef6?")&&this.resetEmail(o)}}deleteUser(o){this.http.post(c.Ic,{id:o},{context:(new h.qT).set(g.a,this)}).subscribe(t=>{this.source?.refresh()})}resetEmail(o){this.http.post(c.mi,{id:o},{context:(new h.qT).set(g.a,this)}).subscribe()}onSpinner(o){this.spinner=o}}return(r=l).\u0275fac=function(o){return new(o||r)(e.Y36(h.eN),e.Y36(m.gz),e.Y36(Z.eB))},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-user"]],decls:15,vars:7,consts:[[1,"d-flex","justify-content-between","align-items-center"],["routerLink","/app/user/new","nbButton","","size","small","status","primary"],["icon","plus-outline"],[1,"mb-2",3,"ngSubmit"],[1,"row"],["name","batchMode",1,"col-auto",3,"ngModel","ngModelChange"],[3,"value",4,"ngFor","ngForOf"],[1,"col-auto","ms-2"],["nbButton","","status","primary","type","submit",3,"disabled","nbSpinner"],[3,"settings","source","delete"],[3,"value"]],template:function(o,t){1&o&&(e.TgZ(0,"nb-card")(1,"nb-card-header",0)(2,"span"),e._uU(3),e.qZA(),e.TgZ(4,"a",1),e._UZ(5,"nb-icon",2),e.qZA()(),e.TgZ(6,"nb-card-body")(7,"form",3),e.NdJ("ngSubmit",function(){return t.batch()}),e.TgZ(8,"div",4)(9,"nb-select",5),e.NdJ("ngModelChange",function(p){return t.batchMode=p}),e.YNc(10,w,2,2,"nb-option",6),e.qZA(),e.TgZ(11,"div",7)(12,"button",8),e._uU(13,"\u5e94\u7528"),e.qZA()()()(),e.TgZ(14,"angular2-smart-table",9),e.NdJ("delete",function(p){return t.delete(p)}),e.qZA()()()),2&o&&(e.xp6(3),e.Oqu(t.route.title),e.xp6(6),e.Q6J("ngModel",t.batchMode),e.xp6(),e.Q6J("ngForOf",t.batches),e.xp6(2),e.Q6J("disabled",!t.batchMode||t.spinner)("nbSpinner",t.spinner),e.xp6(2),e.Q6J("settings",t.settings)("source",t.source))},dependencies:[d.sg,n._Y,n.JJ,n.JL,n.On,n.F,s.Asz,s.yKW,s.ndF,s.DPz,s.Q7R,s.rs,s.q51,s.fMN,m.rH,f.i0],encapsulation:2}),l})(),U=(()=>{var r;class l{constructor(){this.postTypeSettings={},this.links=[]}ngOnInit(){let o=[];for(let t in this.postTypeSettings){let a=this.postTypeSettings[t];a.visibility.showUi&&o.push({label:a.label,type:t})}o&&(this.links=o)}}return(r=l).\u0275fac=function(o){return new(o||r)},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-user-action"]],inputs:{value:"value",rowData:"rowData"},decls:6,vars:6,consts:[[1,"d-flex","flex-row"],["width","50","alt","",3,"src",4,"ngIf"],["queryParamsHandling","merge",3,"routerLink"],["class","mx-2","queryParamsHandling","merge",3,"ms-0","routerLink","queryParams",4,"ngFor","ngForOf"],["width","50","alt","",3,"src"],["queryParamsHandling","merge",1,"mx-2",3,"routerLink","queryParams"]],template:function(o,t){1&o&&(e.TgZ(0,"div",0),e.YNc(1,F,1,1,"img",1),e.TgZ(2,"a",2),e._uU(3),e.qZA()(),e.TgZ(4,"div"),e.YNc(5,T,2,7,"a",3),e.qZA()),2&o&&(e.xp6(),e.Q6J("ngIf",t.rowData.avatar),e.xp6(),e.ekj("ms-2",t.rowData.avatar),e.Q6J("routerLink","/app/user/"+t.rowData.id),e.xp6(),e.Oqu(t.value),e.xp6(2),e.Q6J("ngForOf",t.links))},dependencies:[d.sg,d.O5,m.rH],encapsulation:2}),l})();var b=i(6291),E=i(4014),B=i(9354),M=i(7285);function D(r,l){if(1&r&&(e.TgZ(0,"nb-option",32),e._uU(1),e.qZA()),2&r){const u=l.$implicit;e.Q6J("value",u.value),e.xp6(),e.Oqu(u.label)}}let A=(()=>{var r;class l{constructor(o,t,a,p,O){this.http=o,this.activatedRoute=t,this.router=a,this.ckfinder=p,this.configService=O,this.formGroup=new n.cw({id:new n.NI(0),account:new n.NI("",[n.kI.required]),email:new n.NI("",[n.kI.required,n.kI.email]),nickname:new n.NI(""),url:new n.NI("",[n.kI.pattern("")]),password:new n.NI("",[n.kI.required,n.kI.minLength(6),n.kI.maxLength(32)]),roles:new n.NI([]),avatar:new n.NI(""),meta:new n.cw({})}),this.spinner=!1,this.roles=[{value:"",label:"\u65e0"}],this.controls=[],this.showPassword=!0,this.route=t.snapshot}ngOnDestroy(){this.subscription&&this.subscription.unsubscribe()}ngOnInit(){this.roles.push(...this.configService.roles()),this.subscription=this.ckfinder.onChoose().subscribe(t=>{t.length<1||this.formGroup.controls.avatar.setValue(t[0].url)}),this.metaGroup.addControl("description",new n.NI("")),this.metaGroup.addControl("rich_editing",new n.NI(!1));let o=[];if(this.configService.userMeta().forEach(t=>{t.control&&o.push(t.control)}),o.length>0){let t=(0,E.T)(o);for(let a in t)this.metaGroup.addControl(a,t[a]);this.controls=o}this.activatedRoute.paramMap.subscribe(t=>{if("new"!==this.activatedRoute.snapshot.url[0].path){let a=c.r4;if(t.has("id")){let p=parseInt(t.get("id")||"0",10);if(isNaN(p)||p<1)return void this.router.navigateByUrl("/app/user").then();a=c.G.replace("{id}",p+"")}this.http.get(a).subscribe(p=>{this.buildEditorForm(p)})}})}onSpinner(o){this.spinner=o}onSubmit(o){const t=this.formGroup.getRawValue();let a=c.zA;t.id>0&&(a=c.lt),this.http.post(a,t,{context:(new h.qT).set(g.a,this)}).subscribe(()=>{this.router.navigateByUrl("/app/user").then()})}getInputType(){return this.showPassword?"text":"password"}toggleShowPassword(){this.showPassword=!this.showPassword}get metaGroup(){return this.formGroup.controls.meta}buildEditorForm(o){this.formGroup.controls.password.removeValidators(n.kI.required),this.formGroup.controls.account.disable(),this.formGroup.patchValue({id:o.id,avatar:o.avatar,account:o.account,nickname:o.nickname,email:o.email,url:o.url,password:o.password,roles:o.roles,meta:o.meta})}getBtnName(){return this.formGroup.controls.id.value<1?"\u6dfb\u52a0\u65b0\u7528\u6237":"\u66f4\u65b0"+this.route.title?.replace("\u7f16\u8f91","")}avatar(){this.ckfinder.popup({resourceType:"Images",multi:!1})}}return(r=l).\u0275fac=function(o){return new(o||r)(e.Y36(h.eN),e.Y36(m.gz),e.Y36(m.F0),e.Y36(B.Q),e.Y36(Z.eB))},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-user-new"]],decls:79,vars:14,consts:[[3,"formGroup","ngSubmit"],[1,"mb-3","row"],["for","inputName",1,"label","col-form-label","col-12","col-md-2"],[1,"col-12","col-md-5"],["nbInput","","id","inputName","fullWidth","","status","primary","formControlName","account"],[1,"label","offset-md-2","col-form-label"],["for","inputEmail",1,"label","col-form-label","col-12","col-md-2"],["nbInput","","id","inputEmail","fullWidth","","status","primary","type","email","formControlName","email"],["for","inputNickname",1,"label","col-form-label","col-12","col-md-2"],["nbInput","","id","inputNickname","fullWidth","","status","primary","formControlName","nickname"],["for","inputUrl",1,"label","col-form-label","col-12","col-md-2"],["nbInput","","id","inputUrl","fullWidth","","status","primary","type","url","formControlName","url"],["for","inputPassword",1,"label","col-form-label","col-12","col-md-2"],["nbInput","","id","inputPassword","fullWidth","","status","primary","formControlName","password",3,"type"],["nbSuffix","","nbButton","","ghost","","type","button",3,"click"],["pack","eva",3,"icon"],[1,"label","col-form-label","col-12","col-md-2"],[1,"d-flex","justify-content-between","align-items-center"],["alt","\u5934\u50cf","width","128",3,"src"],["type","button","size","medium","nbButton","",3,"click"],["for","inputRole",1,"label","col-form-label","col-12","col-md-2"],["multiple","","id","inputRole","fullWidth","","formControlName","roles"],[3,"value",4,"ngFor","ngForOf"],[1,"px-0","border-0"],[1,"px-0"],[1,"mb-3","row",3,"formGroup"],["for","inputEditor",1,"label","col-form-label","col-12","col-md-2"],["id","inputEditor","formControlName","rich_editing"],["for","inputDescription",1,"label","col-form-label","col-12","col-md-2"],["id","inputDescription","formControlName","description","fullWidth","","rows","5","nbInput",""],["direction","row",3,"controls","form"],["nbButton","","status","primary","type","submit",3,"disabled","nbSpinner"],[3,"value"]],template:function(o,t){1&o&&(e.TgZ(0,"nb-card")(1,"nb-card-header"),e._uU(2),e.qZA(),e.TgZ(3,"nb-card-body")(4,"form",0),e.NdJ("ngSubmit",function(p){return t.onSubmit(p)}),e.TgZ(5,"div",1)(6,"label",2),e._uU(7,"\u7528\u6237\u540d"),e.qZA(),e.TgZ(8,"div",3),e._UZ(9,"input",4),e.qZA(),e.TgZ(10,"label",5),e._uU(11,"\u7528\u6237\u540d\u5728\u7ad9\u70b9\u767b\u9646\u4e2d\u4f7f\u7528\uff0c\u4e0d\u53ef\u4ee5\u4fee\u6539\u3002"),e.qZA()(),e.TgZ(12,"div",1)(13,"label",6),e._uU(14,"\u90ae\u7bb1"),e.qZA(),e.TgZ(15,"div",3),e._UZ(16,"input",7),e.qZA(),e.TgZ(17,"label",5),e._uU(18,"\u5728\u5fd8\u8bb0\u5bc6\u7801\u7684\u65f6\u5019\u53ef\u4ee5\u901a\u8fc7\u90ae\u7bb1\u627e\u56de\u5bc6\u7801\u3002"),e.qZA()(),e.TgZ(19,"div",1)(20,"label",8),e._uU(21,"\u663e\u793a\u540d\u79f0"),e.qZA(),e.TgZ(22,"div",3),e._UZ(23,"input",9),e.qZA(),e.TgZ(24,"label",5),e._uU(25,"\u663e\u793a\u5728\u7ad9\u70b9\u7684\u4efb\u4f55\u5730\u65b9\u3002"),e.qZA()(),e.TgZ(26,"div",1)(27,"label",10),e._uU(28,"\u7f51\u7ad9\u5730\u5740"),e.qZA(),e.TgZ(29,"div",3),e._UZ(30,"input",11),e.qZA(),e.TgZ(31,"label",5),e._uU(32,"\u4e2a\u4eba\u7f51\u9875\u5730\u5740\u3002"),e.qZA()(),e.TgZ(33,"div",1)(34,"label",12),e._uU(35,"\u5bc6\u7801"),e.qZA(),e.TgZ(36,"div",3)(37,"nb-form-field"),e._UZ(38,"input",13),e.TgZ(39,"button",14),e.NdJ("click",function(){return t.toggleShowPassword()}),e._UZ(40,"nb-icon",15),e.qZA()()(),e.TgZ(41,"label",5),e._uU(42," \u5fc5\u987b\u662f\u6570\u5b57\u5b57\u6bcd\u7ec4\u5408\uff0c\u4e0d\u4fee\u6539\u5bc6\u7801\u4fdd\u6301\u4e3a\u7a7a\u5373\u53ef\u3002 "),e.qZA()(),e.TgZ(43,"div",1)(44,"label",16),e._uU(45,"\u4e2a\u6027\u5934\u50cf"),e.qZA(),e.TgZ(46,"div",3)(47,"div",17),e._UZ(48,"img",18),e.TgZ(49,"button",19),e.NdJ("click",function(){return t.avatar()}),e._uU(50,"\u9009\u62e9\u5934\u50cf"),e.qZA()()(),e.TgZ(51,"label",5),e._uU(52,"\u8bf7\u4f7f\u7528\u76f8\u540c\u6bd4\u4f8b\u6b63\u65b9\u5f62\u56fe\u7247\u3002"),e.qZA()(),e.TgZ(53,"div",1)(54,"label",20),e._uU(55,"\u89d2\u8272"),e.qZA(),e.TgZ(56,"div",3)(57,"nb-select",21),e.YNc(58,D,2,2,"nb-option",22),e.qZA()()(),e.TgZ(59,"nb-card",23)(60,"nb-card-header",24),e._uU(61,"\u5176\u5b83\u8bbe\u7f6e"),e.qZA()(),e.TgZ(62,"div",25)(63,"label",26),e._uU(64,"\u53ef\u89c6\u5316\u7f16\u8f91\u5668"),e.qZA(),e.TgZ(65,"div",3)(66,"nb-checkbox",27),e._uU(67,"\u64b0\u5199\u6587\u7ae0\u65f6\u4e0d\u4f7f\u7528\u53ef\u89c6\u5316\u7f16\u8f91\u5668"),e.qZA()()(),e.TgZ(68,"div",25)(69,"label",28),e._uU(70,"\u4e2a\u4eba\u8bf4\u660e"),e.qZA(),e.TgZ(71,"div",3),e._UZ(72,"textarea",29),e.qZA()(),e._UZ(73,"control-container",30),e.TgZ(74,"div",1),e._UZ(75,"label",16),e.TgZ(76,"div",3)(77,"button",31),e._uU(78),e.qZA()()()()()()),2&o&&(e.xp6(2),e.Oqu(t.route.title),e.xp6(2),e.Q6J("formGroup",t.formGroup),e.xp6(34),e.Q6J("type",t.getInputType()),e.xp6(2),e.Q6J("icon",t.showPassword?"eye-outline":"eye-off-2-outline"),e.uIk("aria-label",t.showPassword?"hide password":"show password"),e.xp6(8),e.Q6J("src",t.formGroup.controls.avatar.value,e.LSH),e.xp6(10),e.Q6J("ngForOf",t.roles),e.xp6(4),e.Q6J("formGroup",t.metaGroup),e.xp6(6),e.Q6J("formGroup",t.metaGroup),e.xp6(5),e.Q6J("controls",t.controls)("form",t.metaGroup),e.xp6(4),e.Q6J("disabled",t.formGroup.invalid||t.spinner)("nbSpinner",t.spinner),e.xp6(),e.hij(" ",t.getBtnName()," "))},dependencies:[d.sg,n._Y,n.Fj,n.JJ,n.JL,n.sg,n.u,s.Asz,s.yKW,s.ndF,s.NTf,s.DPz,s.h8i,s.Q7R,s.rs,s.q51,s.fMN,s.jBG,s.yyc,M._],encapsulation:2}),l})();var N=i(3235),I=i(3507);const P=[{path:"",title:"\u6240\u6709\u7528\u6237",component:_},{path:"new",title:"\u6dfb\u52a0\u65b0\u7528\u6237",pathMatch:"full",component:A},{path:"profile",title:"\u4e2a\u4eba\u8d44\u6599",component:A},{path:":id",title:"\u7f16\u8f91\u7528\u6237",component:A}];let S=(()=>{var r;class l{}return(r=l).\u0275fac=function(o){return new(o||r)},r.\u0275mod=e.oAB({type:r}),r.\u0275inj=e.cJS({imports:[d.ez,b.O,m.Bz.forChild(P),f.Ke,N.s,I.c]}),l})()},3507:(C,v,i)=>{i.d(v,{c:()=>g});var d=i(6733),c=i(2526),h=i(5403),f=i(4966);let g=(()=>{var e;class m{}return(e=m).\u0275fac=function(n){return new(n||e)},e.\u0275mod=f.oAB({type:e}),e.\u0275inj=f.cJS({providers:[h.C],imports:[d.ez,c.T2N,c.DfH,c.COg,c.zyh,c.KdK]}),m})()}}]);