"use strict";(self.webpackChunkdashboard=self.webpackChunkdashboard||[]).push([[592],{5036:(C,g,s)=>{s.d(g,{G:()=>i,Ic:()=>m,lt:()=>d,mi:()=>f,r4:()=>c,tg:()=>t,zA:()=>_});const t="/user",_="/user/store",d="/user/{id}/update",m="/user/delete",i="/user/{id}",c="/user/profile",f="/user/reset/email"},612:(C,g,s)=>{s.d(g,{o:()=>F,s:()=>x});var t=s(3714),_=s(3250),d=s(575),m=s(2787),i=s(9223),c=s(7667),f=s(8934),p=s(24),y=s(7747),D=s(450),M=s(3223);function O(l,b){if(1&l){const r=t.EpF();t.TgZ(0,"form",1),t.NdJ("ngSubmit",function(o){t.CHM(r);const n=t.oxw();return t.KtG(n.onSubmit(o))}),t._UZ(1,"control-container",2)(2,"control-container",3),t.TgZ(3,"div",4),t._UZ(4,"label",5),t.TgZ(5,"button",6),t._uU(6,"\u66f4\u65b0"),t.qZA()()()}if(2&l){const r=t.oxw();t.Q6J("formGroup",r.formGroup),t.xp6(1),t.Q6J("controls",r.controls)("form",r.formGroup),t.xp6(1),t.Q6J("controls",r.metaControls)("form",r.metaGroup),t.xp6(3),t.Q6J("disabled",r.formGroup.invalid||r.spinner)("nbSpinner",r.spinner)}}let x=(()=>{var l;class b{constructor(e,o){this.http=e,this.config=o,this.create=new t.vpe,this.spinner=!1,this.controls=[],this.metaControls=[]}ngOnChanges(e){this.buildForm()}ngOnInit(){}onSpinner(e){this.spinner=e}buildForm(){let e=[];if(this.setting.labels.nameField&&e.push({label:this.setting.labels.nameField,required:!0,id:"name",type:"input",description:this.setting.labels.nameFieldDescription}),this.setting.labels.slugField&&e.push({label:this.setting.labels.slugField,id:"slug",type:"input",value:"",validators:[{key:"pattern",value:"^[a-z0-9]+(?:-[a-z0-9]+)*$"}],description:this.setting.labels.slugFieldDescription}),this.setting.labels.parentField&&this.setting.hierarchical){let a=[{label:"\u65e0",value:""}];e.push({label:this.setting.labels.parentField,id:"parent",required:!1,type:"select",value:"",options:a,description:this.setting.labels.parentFieldDescription}),this.http.get(d.WP.replace("{taxonomy}",this.setting.slug)).subscribe(h=>{h.records.forEach(u=>{let v=u.name;null!=u.level&&u.level>0&&(v="--".repeat(u.level)+u.name),a.push({label:v,value:u.id})})})}this.setting.labels.descField&&e.push({label:this.setting.labels.descField,id:"description",type:"textarea",value:"",description:this.setting.labels.descFieldDescription,required:!1}),this.formGroup=new i.cw((0,m.T)(e)),this.formGroup.addControl("id",new i.NI(0)),this.formGroup.addControl("taxonomy",new i.NI(this.setting.slug));const o=this.config.taxonomyMeta(this.setting.slug),n=[];o.length>0&&o.forEach(a=>{a.showUi&&a.isUpdated&&a.control&&n.push(a.control)}),this.formGroup.addControl("meta",new i.cw((0,m.T)(n))),this.metaControls=n,this.controls=e}onSubmit(e){if(this.formGroup?.invalid)return;const o=this.formGroup?.getRawValue();this.http.post(d.BI.replace("{taxonomy}",this.setting.slug),o,{context:(new _.qT).set(c.a,this)}).subscribe(n=>{this.formGroup?.reset(),this.formGroup?.controls.taxonomy.setValue(this.setting.slug),this.formGroup?.controls.parent?.setValue(""),this.create.emit(n)})}get metaGroup(){return this.formGroup?.controls.meta}}return(l=b).\u0275fac=function(e){return new(e||l)(t.Y36(_.eN),t.Y36(f.eB))},l.\u0275cmp=t.Xpm({type:l,selectors:[["app-taxonomy-create"]],inputs:{setting:"setting"},outputs:{create:"create"},features:[t.TTD],decls:11,vars:9,consts:[[3,"formGroup","ngSubmit"],[3,"controls","form"],[1,"my-3","d-flex","justify-content-between"],[1,"label","col-form-label"],["type","submit","status","primary","size","small","nbButton","",3,"disabled","nbSpinner"]],template:function(e,o){1&e&&(t.TgZ(0,"nb-card")(1,"nb-card-header"),t._uU(2),t.qZA(),t.TgZ(3,"nb-card-body")(4,"form",0),t.NdJ("ngSubmit",function(a){return o.onSubmit(a)}),t._UZ(5,"control-container",1)(6,"control-container",1),t.TgZ(7,"div",2),t._UZ(8,"label",3),t.TgZ(9,"button",4),t._uU(10),t.qZA()()()()()),2&e&&(t.xp6(2),t.hij(" ",o.formGroup.controls.id.value<1?o.setting.labels.addNewItem:o.setting.labels.editItem," "),t.xp6(2),t.Q6J("formGroup",o.formGroup),t.xp6(1),t.Q6J("controls",o.controls)("form",o.formGroup),t.xp6(1),t.Q6J("controls",o.metaControls)("form",o.metaGroup),t.xp6(3),t.Q6J("disabled",o.formGroup.invalid||o.spinner)("nbSpinner",o.spinner),t.xp6(1),t.hij(" ",o.formGroup.controls.id.value<1?o.setting.labels.addNewItem:"\u66f4\u65b0"," "))},dependencies:[i._Y,i.JL,i.sg,p.Asz,p.yKW,p.ndF,p.DPz,p.Q7R,y._],encapsulation:2}),b})(),F=(()=>{var l;class b{constructor(e,o,n,a){this.http=e,this.route=o,this.location=n,this.config=a,this.controls=[],this.spinner=!1,this.metaControls=[]}ngOnInit(){this.route.paramMap.subscribe(e=>{let o=parseInt(e.get("id")||"0",10);o<1?this.location.back():this.http.get(d.WN,{params:{id:o}}).subscribe(n=>{let h=this.config.taxonomies()[n.taxonomy];h?this.buildSetting(h,n):this.location.back()},n=>{this.location.back()})})}onSpinner(e){this.spinner=e}buildSetting(e,o){if(!e.visibility.showUi)return void this.location.back();let n=[];if(e.labels.nameField&&n.push({label:e.labels.nameField,required:!0,value:o.name,id:"name",type:"input",description:e.labels.nameFieldDescription}),e.labels.slugField&&n.push({label:e.labels.slugField,id:"slug",type:"input",value:o.slug,validators:[{key:"pattern",value:"^[a-z0-9]+(?:-[a-z0-9]+)*$"}],description:e.labels.slugFieldDescription}),e.labels.parentField&&e.hierarchical){let u=[{label:"\u65e0",value:""}];n.push({label:e.labels.parentField,id:"parent",required:!1,type:"select",value:o.parent||"",options:u,description:e.labels.parentFieldDescription}),this.http.get(d.WP.replace("{taxonomy}",o.taxonomy)).subscribe(v=>{v.records.forEach(E=>{let T=E.name;null!=E.level&&E.level>0&&(T="--".repeat(E.level)+E.name),u.push({label:T,value:E.id})})})}e.labels.descField&&n.push({label:e.labels.descField,id:"description",type:"textarea",value:o.description,description:e.labels.descFieldDescription,required:!1}),this.formGroup=new i.cw((0,m.T)(n)),this.formGroup.addControl("id",new i.NI(o.id)),this.formGroup.addControl("taxonomy",new i.NI(o.taxonomy));const a=this.config.taxonomyMeta(o.taxonomy),h=[];a.length>0&&a.forEach(u=>{u.showUi&&u.isUpdated&&u.control&&h.push(u.control)}),this.formGroup.addControl("meta",new i.cw((0,m.T)(h,o.meta))),this.controls=n,this.metaControls=h,this.taxonomySetting=e}get metaGroup(){return this.formGroup?.controls.meta}onSubmit(e){if(this.formGroup?.invalid)return;const o=this.formGroup?.getRawValue();this.http.post(d.xR.replace("{taxonomy}",o.taxonomy),o,{context:(new _.qT).set(c.a,this)}).subscribe(n=>{this.location.back()})}}return(l=b).\u0275fac=function(e){return new(e||l)(t.Y36(_.eN),t.Y36(D.gz),t.Y36(M.S$),t.Y36(f.eB))},l.\u0275cmp=t.Xpm({type:l,selectors:[["app-taxonomy-edit"]],decls:5,vars:2,consts:[[3,"formGroup","ngSubmit",4,"ngIf"],[3,"formGroup","ngSubmit"],["direction","",3,"controls","form"],[3,"controls","form"],[1,"my-3","d-flex","justify-content-between"],[1,"label","col-form-label"],["type","submit","status","primary","size","small","nbButton","",3,"disabled","nbSpinner"]],template:function(e,o){1&e&&(t.TgZ(0,"nb-card")(1,"nb-card-header"),t._uU(2),t.qZA(),t.TgZ(3,"nb-card-body"),t.YNc(4,O,7,7,"form",0),t.qZA()()),2&e&&(t.xp6(2),t.Oqu(o.taxonomySetting?o.taxonomySetting.labels.editItem:""),t.xp6(2),t.Q6J("ngIf",o.formGroup))},dependencies:[M.O5,i._Y,i.JL,i.sg,p.Asz,p.yKW,p.ndF,p.DPz,p.Q7R,y._],encapsulation:2}),b})()},8849:(C,g,s)=>{s.d(g,{a:()=>i});var t=s(3223),_=s(5805),d=s(2727),m=s(3714);let i=(()=>{var c;class f{}return(c=f).\u0275fac=function(y){return new(y||c)},c.\u0275mod=m.oAB({type:c}),c.\u0275inj=m.cJS({imports:[t.ez,_.O,d.s]}),f})()}}]);