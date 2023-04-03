"use strict";(self.webpackChunkdashboard=self.webpackChunkdashboard||[]).push([[290],{9290:(I,g,l)=>{l.r(g),l.d(g,{UserModule:()=>N});var h=l(7073),d=l(7147),c=l(898),p=l(5086),b=l(9024),e=l(4565),m=l(1245),v=l(5729),n=l(8665),r=l(2791);function Z(i,s){if(1&i&&(e.TgZ(0,"nb-option",10),e._uU(1),e.qZA()),2&i){const t=s.$implicit;e.Q6J("value",t.value),e.xp6(1),e.Oqu(t.label)}}let w=(()=>{class i{constructor(t,o,u){this.http=t,this.activatedRoute=o,this.configService=u,this.settings={},this.batches=[{label:"\u6279\u91cf\u64cd\u4f5c",value:""},{label:"\u5220\u9664",value:"delete"},{label:"\u53d1\u9001\u5bc6\u7801\u91cd\u7f6e\u90ae\u4ef6",value:"reset"}],this.batchMode="",this.roles=[],this.spinner=!1,this.route=o.snapshot}ngOnInit(){this.roles=this.configService.roles(),this.settings=this.buildSettings(),this.source=new p.zV(this.http,{endPoint:d.tg,dataKey:"records",totalKey:"total",pagerPageKey:"page",pagerLimitKey:"limit",filterFieldKey:"#field#"})}buildSettings(){return{selectMode:"multi",actions:{position:"right",add:!1,edit:!1,delete:!0,columnTitle:"\u64cd\u4f5c"},edit:{editButtonContent:'<i class="nb-edit"></i>',saveButtonContent:'<i class="nb-checkmark"></i>',cancelButtonContent:'<i class="nb-close"></i>'},delete:{deleteButtonContent:'<i class="nb-trash"></i>',confirmDelete:!0},pager:{perPage:30},mode:"external",rowClassFunction:()=>"text-break",columns:{account:{title:"\u7528\u6237\u540d",type:p.Jm.Html,filter:!0,valuePrepareFunction:(t,o)=>`<img width="50" alt="" src="${o.avatar}" />\n            <a href="#/app/user/${o.id}">${t}</a>`},nickname:{title:"\u663e\u793a\u540d\u79f0",type:p.Jm.Text,filter:!0,valuePrepareFunction:(t,o)=>t==o.account?"-":t},roles:{title:"\u89d2\u8272",type:p.Jm.Text,valuePrepareFunction:(t,o)=>{if(t.length<1)return"-";let u=[];return t.forEach(a=>{this.roles[a-1]&&u.push(this.roles[a-1].label)}),u.join(",")}},email:{title:"\u90ae\u7bb1",type:p.Jm.Html,filter:!0,valuePrepareFunction:(t,o)=>`<a href="mailto:${t}">${t}</a>`},registeredAt:{title:"\u52a0\u5165\u65f6\u95f4",type:p.Jm.Text,filter:!1}}}}delete(t){let o=t.data;1!=o.id?window.confirm("\u786e\u8ba4\u5220\u9664\u7528\u6237: "+o.account)&&(this.deleteUser([o.id]),this.http.post(d.Ic,{id:o.id}).subscribe(u=>{var a;null===(a=this.source)||void 0===a||a.refresh()})):window.alert("\u6b64\u7528\u6237\u4e0d\u80fd\u88ab\u5220\u9664!")}batch(){var t;let o=[];switch(null===(t=this.source)||void 0===t||t.getSelectedItems().forEach(u=>{o.push(u.id)}),this.batchMode){case"delete":o.length>0&&window.confirm("\u786e\u8ba4\u5220\u9664\u5df2\u9009\u62e9\u7684\u7528\u6237?")&&this.deleteUser(o);break;case"reset":o.length>0&&window.confirm("\u786e\u8ba4\u7ed9\u5df2\u9009\u62e9\u7684\u7528\u6237\u53d1\u9001\u91cd\u7f6e\u5bc6\u7801\u90ae\u4ef6?")&&this.resetEmail(o)}}deleteUser(t){this.http.post(d.Ic,{id:t},{context:(new c.qT).set(b.a,this)}).subscribe(o=>{var u;null===(u=this.source)||void 0===u||u.refresh()})}resetEmail(t){this.http.post(d.mi,{id:t},{context:(new c.qT).set(b.a,this)}).subscribe()}onSpinner(t){this.spinner=t}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(c.eN),e.Y36(m.gz),e.Y36(v.e))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-user"]],decls:15,vars:7,consts:[[1,"d-flex","justify-content-between","align-items-center"],["routerLink","/app/user/new","nbButton","","size","small","status","primary"],["icon","plus-outline"],[1,"mb-2",3,"ngSubmit"],[1,"row"],["name","batchMode",1,"col",3,"ngModel","ngModelChange"],[3,"value",4,"ngFor","ngForOf"],[1,"col-1","ms-2"],["nbButton","","status","primary","type","submit",3,"disabled","nbSpinner"],[3,"settings","source","delete"],[3,"value"]],template:function(t,o){1&t&&(e.TgZ(0,"nb-card")(1,"nb-card-header",0)(2,"span"),e._uU(3),e.qZA(),e.TgZ(4,"a",1),e._UZ(5,"nb-icon",2),e.qZA()(),e.TgZ(6,"nb-card-body")(7,"form",3),e.NdJ("ngSubmit",function(){return o.batch()}),e.TgZ(8,"div",4)(9,"nb-select",5),e.NdJ("ngModelChange",function(a){return o.batchMode=a}),e.YNc(10,Z,2,2,"nb-option",6),e.qZA(),e.TgZ(11,"div",7)(12,"button",8),e._uU(13,"\u5e94\u7528"),e.qZA()()()(),e.TgZ(14,"angular2-smart-table",9),e.NdJ("delete",function(a){return o.delete(a)}),e.qZA()()()),2&t&&(e.xp6(3),e.Oqu(o.route.title),e.xp6(6),e.Q6J("ngModel",o.batchMode),e.xp6(1),e.Q6J("ngForOf",o.batches),e.xp6(2),e.Q6J("disabled",!o.batchMode||o.spinner)("nbSpinner",o.spinner),e.xp6(2),e.Q6J("settings",o.settings)("source",o.source))},dependencies:[h.sg,n._Y,n.JJ,n.JL,n.On,n.F,r.Asz,r.yKW,r.ndF,r.DPz,r.Q7R,r.rs,r.q51,r.fMN,m.rH,p.i0],encapsulation:2}),i})();var F=l(3911),T=l(1810),A=l(7660);function C(i,s){if(1&i&&(e.TgZ(0,"nb-option",32),e._uU(1),e.qZA()),2&i){const t=s.$implicit;e.Q6J("value",t.value),e.xp6(1),e.Oqu(t.label)}}let f=(()=>{class i{constructor(t,o,u,a,U){this.http=t,this.activatedRoute=o,this.router=u,this.ckfinder=a,this.configService=U,this.formGroup=new n.cw({id:new n.NI(0),account:new n.NI("",[n.kI.required]),email:new n.NI("",[n.kI.required,n.kI.email]),nickname:new n.NI(""),url:new n.NI("",[n.kI.pattern("")]),password:new n.NI("",[n.kI.required,n.kI.minLength(6),n.kI.maxLength(32)]),roles:new n.NI([]),avatar:new n.NI(""),meta:new n.cw({})}),this.spinner=!1,this.roles=[{value:"",label:"\u65e0"}],this.controls=[],this.showPassword=!0,this.route=o.snapshot}ngOnDestroy(){this.subscription&&this.subscription.unsubscribe()}ngOnInit(){this.roles.push(...this.configService.roles()),this.subscription=this.ckfinder.onChoose().subscribe(t=>{t.length<1||this.formGroup.controls.avatar.setValue(t[0].url)}),this.metaGroup.addControl("description",new n.NI("")),this.metaGroup.addControl("rich_editing",new n.NI(!1)),this.activatedRoute.paramMap.subscribe(t=>{if("new"!==this.activatedRoute.snapshot.url[0].path){let o=d.r4;if(t.has("id")){let u=parseInt(t.get("id")||"0",10);if(isNaN(u)||u<1)return void this.router.navigateByUrl("/app/user").then();o=d.G.replace("{id}",u+"")}this.http.get(o).subscribe(u=>{this.buildEditorForm(u)})}})}onSpinner(t){this.spinner=t}onSubmit(t){const o=this.formGroup.getRawValue();let u=d.zA;o.id>0&&(u=d.lt),this.http.post(u,o,{context:(new c.qT).set(b.a,this)}).subscribe(()=>{this.router.navigateByUrl("/app/user").then()})}getInputType(){return this.showPassword?"text":"password"}toggleShowPassword(){this.showPassword=!this.showPassword}get metaGroup(){return this.formGroup.controls.meta}buildEditorForm(t){this.formGroup.controls.password.removeValidators(n.kI.required),this.formGroup.controls.account.disable(),this.formGroup.patchValue({id:t.id,avatar:t.avatar,account:t.account,nickname:t.nickname,email:t.email,url:t.url,password:t.password,roles:t.roles,meta:t.meta})}getBtnName(){var t;return this.formGroup.controls.id.value<1?"\u6dfb\u52a0\u65b0\u7528\u6237":"\u66f4\u65b0"+(null===(t=this.route.title)||void 0===t?void 0:t.replace("\u7f16\u8f91",""))}avatar(){this.ckfinder.popup({resourceType:"Images",multi:!1})}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(c.eN),e.Y36(m.gz),e.Y36(m.F0),e.Y36(T.Q),e.Y36(v.e))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-user-new"]],decls:79,vars:14,consts:[[3,"formGroup","ngSubmit"],[1,"mb-3","row"],["for","inputName",1,"label","col-form-label","col-12","col-md-2"],[1,"col-12","col-md-5"],["nbInput","","id","inputName","fullWidth","","status","primary","formControlName","account"],[1,"label","offset-md-2","col-form-label"],["for","inputEmail",1,"label","col-form-label","col-12","col-md-2"],["nbInput","","id","inputEmail","fullWidth","","status","primary","type","email","formControlName","email"],["for","inputNickname",1,"label","col-form-label","col-12","col-md-2"],["nbInput","","id","inputNickname","fullWidth","","status","primary","formControlName","nickname"],["for","inputUrl",1,"label","col-form-label","col-12","col-md-2"],["nbInput","","id","inputUrl","fullWidth","","status","primary","type","url","formControlName","url"],["for","inputPassword",1,"label","col-form-label","col-12","col-md-2"],["nbInput","","id","inputPassword","fullWidth","","status","primary","formControlName","password",3,"type"],["nbSuffix","","nbButton","","ghost","","type","button",3,"click"],["pack","eva",3,"icon"],[1,"label","col-form-label","col-12","col-md-2"],[1,"d-flex","justify-content-between","align-items-center"],["alt","\u5934\u50cf","width","128",3,"src"],["type","button","size","medium","nbButton","",3,"click"],["for","inputRole",1,"label","col-form-label","col-12","col-md-2"],["multiple","","id","inputRole","fullWidth","","formControlName","roles"],[3,"value",4,"ngFor","ngForOf"],[1,"px-0","border-0"],[1,"px-0"],[1,"mb-3","row",3,"formGroup"],["for","inputEditor",1,"label","col-form-label","col-12","col-md-2"],["id","inputEditor","formControlName","rich_editing"],["for","inputDescription",1,"label","col-form-label","col-12","col-md-2"],["id","inputDescription","formControlName","description","fullWidth","","rows","5","nbInput",""],[3,"controls","form"],["nbButton","","status","primary","type","submit",3,"disabled","nbSpinner"],[3,"value"]],template:function(t,o){1&t&&(e.TgZ(0,"nb-card")(1,"nb-card-header"),e._uU(2),e.qZA(),e.TgZ(3,"nb-card-body")(4,"form",0),e.NdJ("ngSubmit",function(a){return o.onSubmit(a)}),e.TgZ(5,"div",1)(6,"label",2),e._uU(7,"\u7528\u6237\u540d"),e.qZA(),e.TgZ(8,"div",3),e._UZ(9,"input",4),e.qZA(),e.TgZ(10,"label",5),e._uU(11,"\u7528\u6237\u540d\u5728\u7ad9\u70b9\u767b\u9646\u4e2d\u4f7f\u7528\uff0c\u4e0d\u53ef\u4ee5\u4fee\u6539\u3002"),e.qZA()(),e.TgZ(12,"div",1)(13,"label",6),e._uU(14,"\u90ae\u7bb1"),e.qZA(),e.TgZ(15,"div",3),e._UZ(16,"input",7),e.qZA(),e.TgZ(17,"label",5),e._uU(18,"\u5728\u5fd8\u8bb0\u5bc6\u7801\u7684\u65f6\u5019\u53ef\u4ee5\u901a\u8fc7\u90ae\u7bb1\u627e\u56de\u5bc6\u7801\u3002"),e.qZA()(),e.TgZ(19,"div",1)(20,"label",8),e._uU(21,"\u663e\u793a\u540d\u79f0"),e.qZA(),e.TgZ(22,"div",3),e._UZ(23,"input",9),e.qZA(),e.TgZ(24,"label",5),e._uU(25,"\u663e\u793a\u5728\u7ad9\u70b9\u7684\u4efb\u4f55\u5730\u65b9\u3002"),e.qZA()(),e.TgZ(26,"div",1)(27,"label",10),e._uU(28,"\u7f51\u7ad9\u5730\u5740"),e.qZA(),e.TgZ(29,"div",3),e._UZ(30,"input",11),e.qZA(),e.TgZ(31,"label",5),e._uU(32,"\u4e2a\u4eba\u7f51\u9875\u5730\u5740\u3002"),e.qZA()(),e.TgZ(33,"div",1)(34,"label",12),e._uU(35,"\u5bc6\u7801"),e.qZA(),e.TgZ(36,"div",3)(37,"nb-form-field"),e._UZ(38,"input",13),e.TgZ(39,"button",14),e.NdJ("click",function(){return o.toggleShowPassword()}),e._UZ(40,"nb-icon",15),e.qZA()()(),e.TgZ(41,"label",5),e._uU(42," \u5fc5\u987b\u662f\u6570\u5b57\u5b57\u6bcd\u7ec4\u5408\uff0c\u4e0d\u4fee\u6539\u5bc6\u7801\u4fdd\u6301\u4e3a\u7a7a\u5373\u53ef\u3002 "),e.qZA()(),e.TgZ(43,"div",1)(44,"label",16),e._uU(45,"\u4e2a\u6027\u5934\u50cf"),e.qZA(),e.TgZ(46,"div",3)(47,"div",17),e._UZ(48,"img",18),e.TgZ(49,"button",19),e.NdJ("click",function(){return o.avatar()}),e._uU(50,"\u9009\u62e9\u5934\u50cf"),e.qZA()()(),e.TgZ(51,"label",5),e._uU(52,"\u8bf7\u4f7f\u7528\u76f8\u540c\u6bd4\u4f8b\u6b63\u65b9\u5f62\u56fe\u7247\u3002"),e.qZA()(),e.TgZ(53,"div",1)(54,"label",20),e._uU(55,"\u89d2\u8272"),e.qZA(),e.TgZ(56,"div",3)(57,"nb-select",21),e.YNc(58,C,2,2,"nb-option",22),e.qZA()()(),e.TgZ(59,"nb-card",23)(60,"nb-card-header",24),e._uU(61,"\u5176\u5b83\u8bbe\u7f6e"),e.qZA()(),e.TgZ(62,"div",25)(63,"label",26),e._uU(64,"\u53ef\u89c6\u5316\u7f16\u8f91\u5668"),e.qZA(),e.TgZ(65,"div",3)(66,"nb-checkbox",27),e._uU(67,"\u64b0\u5199\u6587\u7ae0\u65f6\u4e0d\u4f7f\u7528\u53ef\u89c6\u5316\u7f16\u8f91\u5668"),e.qZA()()(),e.TgZ(68,"div",25)(69,"label",28),e._uU(70,"\u4e2a\u4eba\u8bf4\u660e"),e.qZA(),e.TgZ(71,"div",3),e._UZ(72,"textarea",29),e.qZA()(),e._UZ(73,"control-container",30),e.TgZ(74,"div",1),e._UZ(75,"label",16),e.TgZ(76,"div",3)(77,"button",31),e._uU(78),e.qZA()()()()()()),2&t&&(e.xp6(2),e.Oqu(o.route.title),e.xp6(2),e.Q6J("formGroup",o.formGroup),e.xp6(34),e.Q6J("type",o.getInputType()),e.xp6(2),e.Q6J("icon",o.showPassword?"eye-outline":"eye-off-2-outline"),e.uIk("aria-label",o.showPassword?"hide password":"show password"),e.xp6(8),e.Q6J("src",o.formGroup.controls.avatar.value,e.LSH),e.xp6(10),e.Q6J("ngForOf",o.roles),e.xp6(4),e.Q6J("formGroup",o.metaGroup),e.xp6(6),e.Q6J("formGroup",o.metaGroup),e.xp6(5),e.Q6J("controls",o.controls)("form",o.metaGroup),e.xp6(4),e.Q6J("disabled",o.formGroup.invalid||o.spinner)("nbSpinner",o.spinner),e.xp6(1),e.hij(" ",o.getBtnName()," "))},dependencies:[h.sg,n._Y,n.Fj,n.JJ,n.JL,n.sg,n.u,r.Asz,r.yKW,r.ndF,r.NTf,r.DPz,r.h8i,r.Q7R,r.rs,r.q51,r.fMN,r.jBG,r.yyc,A._],encapsulation:2}),i})();var y=l(4090),E=l(2521);const B=[{path:"",title:"\u6240\u6709\u7528\u6237",component:w},{path:"new",title:"\u6dfb\u52a0\u65b0\u7528\u6237",pathMatch:"full",component:f},{path:"profile",title:"\u4e2a\u4eba\u8d44\u6599",component:f},{path:":id",title:"\u7f16\u8f91\u7528\u6237",component:f}];let N=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[h.ez,F.O,m.Bz.forChild(B),p.Ke,y.s,E.c]}),i})()}}]);
//# sourceMappingURL=290.9184762e4d22f509.js.map