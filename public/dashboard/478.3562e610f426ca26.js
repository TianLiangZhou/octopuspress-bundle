"use strict";(self.webpackChunkdashboard=self.webpackChunkdashboard||[]).push([[478],{478:(Q,_,p)=>{p.r(_),p.d(_,{TaxonomyModule:()=>B});var h=p(7005),w=p(8150),S=p(549),b=p(4244),g=p(7565),o=p(2133),y=p(642),f=p(9047),x=p(2513),r=p(5193),F=p(1107),C=p(7477),a=p(5137),Z=p(7748);function J(i,s){if(1&i){const t=o.EpF();o.TgZ(0,"div",10)(1,"nb-card")(2,"nb-card-header"),o._uU(3),o.qZA(),o.TgZ(4,"nb-card-body")(5,"form",11),o.NdJ("ngSubmit",function(n){o.CHM(t);const l=o.oxw();return o.KtG(l.onSubmit(n))}),o._UZ(6,"control-container",12)(7,"control-container",12),o.TgZ(8,"div",13),o._UZ(9,"label",14),o.TgZ(10,"button",15),o._uU(11),o.qZA()()()()()()}if(2&i){const t=o.oxw();o.xp6(3),o.hij(" ",t.formGroup.controls.id.value<1?t.taxonomySetting.labels.addNewItem:t.taxonomySetting.labels.editItem," "),o.xp6(2),o.Q6J("formGroup",t.formGroup),o.xp6(1),o.Q6J("controls",t.controls)("form",t.formGroup),o.xp6(1),o.Q6J("controls",t.metaControls)("form",t.metaGroup),o.xp6(3),o.Q6J("disabled",t.formGroup.invalid||t.spinner)("nbSpinner",t.spinner),o.xp6(1),o.hij(" ",t.formGroup.controls.id.value<1?t.taxonomySetting.labels.addNewItem:"\u66f4\u65b0"," ")}}function G(i,s){if(1&i&&(o.TgZ(0,"nb-option",16),o._uU(1),o.qZA()),2&i){const t=s.$implicit;o.Q6J("value",t.value),o.xp6(1),o.Oqu(t.label)}}function D(i,s){if(1&i){const t=o.EpF();o.TgZ(0,"form",1),o.NdJ("ngSubmit",function(n){o.CHM(t);const l=o.oxw();return o.KtG(l.onSubmit(n))}),o._UZ(1,"control-container",2)(2,"control-container",3),o.TgZ(3,"div",4),o._UZ(4,"label",5),o.TgZ(5,"button",6),o._uU(6,"\u66f4\u65b0"),o.qZA()()()}if(2&i){const t=o.oxw();o.Q6J("formGroup",t.formGroup),o.xp6(1),o.Q6J("controls",t.controls)("form",t.formGroup),o.xp6(1),o.Q6J("controls",t.metaControls)("form",t.metaGroup),o.xp6(3),o.Q6J("disabled",t.formGroup.invalid||t.spinner)("nbSpinner",t.spinner)}}function M(i,s){if(1&i&&(o.TgZ(0,"strong",9),o._uU(1),o.qZA()),2&i){const t=o.oxw();o.xp6(1),o.Oqu(t.taxonomy.name)}}function A(i,s){if(1&i&&(o.TgZ(0,"nb-option",10),o._uU(1),o.qZA()),2&i){const t=s.$implicit;o.Q6J("value",t.value),o.xp6(1),o.Oqu(t.label)}}let U=(()=>{class i{constructor(t,e,n,l,c){this.http=t,this.route=e,this.router=n,this.config=l,this.dialog=c,this.taxonomy="",this.settings={},this.spinner=!1,this.controls=[],this.metaControls=[],this.batches=[{label:"\u6279\u91cf\u64cd\u4f5c",value:""},{label:"\u5220\u9664",value:"delete"}],this.batchMode=""}onSpinner(t){this.spinner=t}ngOnInit(){let t=this.config.taxonomies();this.route.paramMap.subscribe(e=>{var n;let l=null!==(n=e.get("taxonomy"))&&void 0!==n?n:"";l&&Object.keys(t).includes(l)?t[l].visibility.showUi&&(this.taxonomy=l,this.buildSetting(t[l])):this.router.navigateByUrl("/404").then()})}onSubmit(t){var e,n;if(null!==(e=this.formGroup)&&void 0!==e&&e.invalid)return;const l=null===(n=this.formGroup)||void 0===n?void 0:n.getRawValue();this.http.post(f.BI.replace("{taxonomy}",this.taxonomy),l,{context:(new y.qT).set(F.a,this)}).subscribe(c=>{var u,v,d,m,T;null===(u=this.source)||void 0===u||u.refresh(),null===(v=this.formGroup)||void 0===v||v.reset(),null===(d=this.formGroup)||void 0===d||d.controls.taxonomy.setValue(this.taxonomy),null===(T=null===(m=this.formGroup)||void 0===m?void 0:m.controls.parent)||void 0===T||T.setValue("")})}delete(t){this.deleteTaxonomy([t.id],"\u786e\u8ba4\u5220\u9664\u7c7b\u76ee: "+t.name+"?")}buildSetting(t){var e;if(!t.visibility.showUi)return;this.settings=this.buildSettings(),this.source=new b.zV(this.http,{endPoint:f.WP.replace("{taxonomy}",this.taxonomy),dataKey:"records",totalKey:"total",pagerPageKey:"page",pagerLimitKey:"limit",filterFieldKey:"#field#"});let n=[];if(t.labels.nameField&&n.push({label:t.labels.nameField,required:!0,id:"name",type:"input",description:t.labels.nameFieldDescription}),t.labels.slugField&&n.push({label:t.labels.slugField,id:"slug",type:"input",value:"",validators:[{key:"pattern",value:"^[a-z0-9]+(?:-[a-z0-9]+)*$"}],description:t.labels.slugFieldDescription}),t.labels.parentField&&t.hierarchical){let u=[{label:"\u65e0",value:""}];n.push({label:t.labels.parentField,id:"parent",required:!1,type:"select",value:"",options:u,description:t.labels.parentFieldDescription}),null===(e=this.source)||void 0===e||e.getAll().then(v=>{v.forEach(d=>{let m=d.name;null!=d.level&&d.level>0&&(m="--".repeat(d.level)+d.name),u.push({label:m,value:d.id})})})}t.labels.descField&&n.push({label:t.labels.descField,id:"description",type:"textarea",value:"",description:t.labels.descFieldDescription,required:!1}),this.formGroup=new r.cw((0,x.T)(n)),this.formGroup.addControl("id",new r.NI(0)),this.formGroup.addControl("taxonomy",new r.NI(this.taxonomy));const l=this.config.taxonomyMeta(this.taxonomy),c=[];l.length>0&&l.forEach(u=>{u.showUi&&u.isUpdated&&u.control&&c.push(u.control)}),this.formGroup.addControl("meta",new r.cw((0,x.T)(c))),this.metaControls=c,this.controls=n,this.taxonomySetting=t}get metaGroup(){var t;return null===(t=this.formGroup)||void 0===t?void 0:t.controls.meta}buildSettings(){return{selectMode:"multi",actions:{position:"right",add:!1,edit:!1,delete:!1,columnTitle:"\u64cd\u4f5c"},pager:{perPage:30},mode:"external",rowClassFunction:()=>"text-break",columns:{name:{title:"\u540d\u79f0",type:b.Jm.Custom,filter:!0,renderComponent:I,onComponentInitFunction:t=>{t.onClick().subscribe(e=>{switch(e.action){case"delete":this.delete(e.taxonomy);break;case"convert":this.convertDialog(e.taxonomy)}})},isSortable:!1},slug:{title:"\u522b\u540d",type:b.Jm.Text,filter:!1,isSortable:!1},description:{title:"\u5185\u5bb9\u63cf\u8ff0",type:b.Jm.Text,filter:!1,isSortable:!1},count:{title:"\u603b\u6570",type:b.Jm.Text,filter:!1}}}}batch(){var t;const e=null===(t=this.source)||void 0===t?void 0:t.getSelectedItems().map(n=>n.id);void 0===e||e.length<1||"delete"!==this.batchMode||this.deleteTaxonomy(e,"\u786e\u8ba4\u5220\u9664\u5df2\u9009\u62e9\u7684\u7c7b\u76ee?")}deleteTaxonomy(t,e){window.confirm(e)&&this.http.post(f.db.replace("{taxonomy}",this.taxonomy),{sets:t}).subscribe(()=>{var n;null===(n=this.source)||void 0===n||n.refresh()})}convertDialog(t){this.dialog.open(N,{context:{taxonomy:t}}).onClose.subscribe(e=>{void 0!==e&&e&&this.convert(t.id,e)})}convert(t,e){this.http.post(f.rI,{id:t,toTaxonomy:e}).subscribe(()=>{var n;null===(n=this.source)||void 0===n||n.refresh()})}}return i.\u0275fac=function(t){return new(t||i)(o.Y36(y.eN),o.Y36(g.gz),o.Y36(g.F0),o.Y36(C.eB),o.Y36(a.Gln))},i.\u0275cmp=o.Xpm({type:i,selectors:[["app-taxonomy"]],decls:12,vars:6,consts:[[1,"row"],["class","col-12 col-md-4",4,"ngIf"],[1,"col-12","col-md-8"],[1,"border-0"],[1,"row","mb-2",3,"ngSubmit"],["name","batchMode",1,"col-auto",3,"ngModel","ngModelChange"],[3,"value",4,"ngFor","ngForOf"],[1,"col-auto"],["nbButton","","status","primary","type","submit",3,"disabled"],[3,"settings","source"],[1,"col-12","col-md-4"],[3,"formGroup","ngSubmit"],[3,"controls","form"],[1,"my-3","d-flex","justify-content-between"],[1,"label","col-form-label"],["type","submit","status","primary","size","small","nbButton","",3,"disabled","nbSpinner"],[3,"value"]],template:function(t,e){1&t&&(o.TgZ(0,"div",0),o.YNc(1,J,12,9,"div",1),o.TgZ(2,"div",2)(3,"nb-card")(4,"nb-card-body",3)(5,"form",4),o.NdJ("ngSubmit",function(){return e.batch()}),o.TgZ(6,"nb-select",5),o.NdJ("ngModelChange",function(l){return e.batchMode=l}),o.YNc(7,G,2,2,"nb-option",6),o.qZA(),o.TgZ(8,"div",7)(9,"button",8),o._uU(10,"\u5e94\u7528"),o.qZA()()(),o._UZ(11,"angular2-smart-table",9),o.qZA()()()()),2&t&&(o.xp6(1),o.Q6J("ngIf",e.controls.length>0),o.xp6(5),o.Q6J("ngModel",e.batchMode),o.xp6(1),o.Q6J("ngForOf",e.batches),o.xp6(2),o.Q6J("disabled",!e.batchMode),o.xp6(2),o.Q6J("settings",e.settings)("source",e.source))},dependencies:[h.sg,h.O5,b.i0,r._Y,r.JJ,r.JL,r.On,r.F,r.sg,a.Asz,a.yKW,a.ndF,a.DPz,a.Q7R,a.rs,a.q51,Z._],encapsulation:2}),i})(),k=(()=>{class i{constructor(t,e,n,l){this.http=t,this.route=e,this.location=n,this.config=l,this.controls=[],this.spinner=!1,this.metaControls=[]}ngOnInit(){this.route.paramMap.subscribe(t=>{let e=parseInt(t.get("id")||"0",10);e<1?this.location.back():this.http.get(f.WN,{params:{id:e}}).subscribe(n=>{let c=this.config.taxonomies()[n.taxonomy];c?this.buildSetting(c,n):this.location.back()},n=>{this.location.back()})})}onSpinner(t){this.spinner=t}buildSetting(t,e){if(!t.visibility.showUi)return void this.location.back();let n=[];if(t.labels.nameField&&n.push({label:t.labels.nameField,required:!0,value:e.name,id:"name",type:"input",description:t.labels.nameFieldDescription}),t.labels.slugField&&n.push({label:t.labels.slugField,id:"slug",type:"input",value:e.slug,validators:[{key:"pattern",value:"^[a-z0-9]+(?:-[a-z0-9]+)*$"}],description:t.labels.slugFieldDescription}),t.labels.parentField&&t.hierarchical){let u=[{label:"\u65e0",value:""}];n.push({label:t.labels.parentField,id:"parent",required:!1,type:"select",value:e.parent||"",options:u,description:t.labels.parentFieldDescription}),this.http.get(f.WP.replace("{taxonomy}",e.taxonomy)).subscribe(v=>{v.records.forEach(d=>{let m=d.name;null!=d.level&&d.level>0&&(m="--".repeat(d.level)+d.name),u.push({label:m,value:d.id})})})}t.labels.descField&&n.push({label:t.labels.descField,id:"description",type:"textarea",value:e.description,description:t.labels.descFieldDescription,required:!1}),this.formGroup=new r.cw((0,x.T)(n)),this.formGroup.addControl("id",new r.NI(e.id)),this.formGroup.addControl("taxonomy",new r.NI(e.taxonomy));const l=this.config.taxonomyMeta(e.taxonomy),c=[];l.length>0&&l.forEach(u=>{u.showUi&&u.isUpdated&&u.control&&c.push(u.control)}),this.formGroup.addControl("meta",new r.cw((0,x.T)(c,e.meta))),this.controls=n,this.metaControls=c,this.taxonomySetting=t}get metaGroup(){var t;return null===(t=this.formGroup)||void 0===t?void 0:t.controls.meta}onSubmit(t){var e,n;if(null!==(e=this.formGroup)&&void 0!==e&&e.invalid)return;const l=null===(n=this.formGroup)||void 0===n?void 0:n.getRawValue();this.http.post(f.xR.replace("{taxonomy}",l.taxonomy),l,{context:(new y.qT).set(F.a,this)}).subscribe(c=>{this.location.back()})}}return i.\u0275fac=function(t){return new(t||i)(o.Y36(y.eN),o.Y36(g.gz),o.Y36(h.S$),o.Y36(C.eB))},i.\u0275cmp=o.Xpm({type:i,selectors:[["app-taxonomy-edit"]],decls:5,vars:2,consts:[[3,"formGroup","ngSubmit",4,"ngIf"],[3,"formGroup","ngSubmit"],["direction","",3,"controls","form"],[3,"controls","form"],[1,"my-3","d-flex","justify-content-between"],[1,"label","col-form-label"],["type","submit","status","primary","size","small","nbButton","",3,"disabled","nbSpinner"]],template:function(t,e){1&t&&(o.TgZ(0,"nb-card")(1,"nb-card-header"),o._uU(2),o.qZA(),o.TgZ(3,"nb-card-body"),o.YNc(4,D,7,7,"form",0),o.qZA()()),2&t&&(o.xp6(2),o.Oqu(e.taxonomySetting?e.taxonomySetting.labels.editItem:""),o.xp6(2),o.Q6J("ngIf",e.formGroup))},dependencies:[h.O5,r._Y,r.JL,r.sg,a.Asz,a.yKW,a.ndF,a.DPz,a.Q7R,Z._],encapsulation:2}),i})(),I=(()=>{class i{constructor(){this.actionClick=new o.vpe}ngOnInit(){null!=this.rowData.level&&this.rowData.level>0&&(this.value="--".repeat(this.rowData.level)+this.value)}onClick(){return this.actionClick}delete(){this.actionClick.next({action:"delete",taxonomy:this.rowData})}convert(){this.actionClick.next({action:"convert",taxonomy:this.rowData})}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=o.Xpm({type:i,selectors:[["app-taxonomy-actions"]],inputs:{value:"value",rowData:"rowData"},decls:6,vars:3,consts:[[1,"py-3","text-break","fs-6"],["title","\u7f16\u8f91","icon","edit-2-outline",1,"ps-0",3,"link"],["title","\u5220\u9664","icon","trash-outline",3,"click"],["title","\u8fc1\u79fb","icon","swap-outline",3,"click"]],template:function(t,e){1&t&&(o.TgZ(0,"div",0),o._uU(1),o.qZA(),o.TgZ(2,"nb-actions"),o._UZ(3,"nb-action",1),o.TgZ(4,"nb-action",2),o.NdJ("click",function(){return e.delete()}),o.qZA(),o.TgZ(5,"nb-action",3),o.NdJ("click",function(){return e.convert()}),o.qZA()()),2&t&&(o.xp6(1),o.hij(" ",e.value," "),o.xp6(2),o.hYB("link","/app/taxonomy/",e.rowData.taxonomy,"/",e.rowData.id,""))},dependencies:[a.Bk3,a.lYD],styles:["[_nghost-%COMP%]   nb-actions[_ngcontent-%COMP%]{visibility:hidden}[_nghost-%COMP%]:hover   nb-actions[_ngcontent-%COMP%]{visibility:visible}"]}),i})(),N=(()=>{class i{constructor(t,e){this.dialogRef=t,this.config=e,this.options=[],this.selectedTaxonomy=""}ngOnInit(){var t;const e=this.config.taxonomies();let n=[{label:"--\u9009\u62e9--",value:""}];for(let l in e){let c=e[l];c.visibility.showUi&&c.slug!=(null===(t=this.taxonomy)||void 0===t?void 0:t.taxonomy)&&n.push({label:c.label,value:c.slug})}this.options=n}convert(){this.dialogRef.close(this.selectedTaxonomy)}}return i.\u0275fac=function(t){return new(t||i)(o.Y36(a.X4l),o.Y36(C.eB))},i.\u0275cmp=o.Xpm({type:i,selectors:[["app-taxonomy-convert-dialog"]],decls:16,vars:4,consts:[["class","fw-bolder text-danger",4,"ngIf"],[1,"mb-3","d-flex","align-items-center"],[1,"label","col-form-label"],[1,"px-2"],["fullWidth","","id","taxonomies",3,"ngModel","ngModelChange"],[3,"value",4,"ngFor","ngForOf"],[1,"d-flex","justify-content-between"],["nbButton","","status","basic",3,"click"],["nbButton","","status","primary",3,"disabled","click"],[1,"fw-bolder","text-danger"],[3,"value"]],template:function(t,e){1&t&&(o.TgZ(0,"nb-card")(1,"nb-card-header"),o.YNc(2,M,2,1,"strong",0),o._uU(3,"--\u6b63\u5728\u8f6c\u6362\u7c7b\u522b "),o.qZA(),o.TgZ(4,"nb-card-body")(5,"div",1)(6,"label",2),o._uU(7,"\u9009\u62e9\u9700\u8981\u8f6c\u6362\u7684\u7c7b\u522b: "),o.qZA(),o.TgZ(8,"div",3)(9,"nb-select",4),o.NdJ("ngModelChange",function(l){return e.selectedTaxonomy=l}),o.YNc(10,A,2,2,"nb-option",5),o.qZA()()()(),o.TgZ(11,"nb-card-footer",6)(12,"button",7),o.NdJ("click",function(){return e.dialogRef.close()}),o._uU(13,"\u53d6\u6d88"),o.qZA(),o.TgZ(14,"button",8),o.NdJ("click",function(){return e.convert()}),o._uU(15,"\u8f6c\u6362"),o.qZA()()()),2&t&&(o.xp6(2),o.Q6J("ngIf",e.taxonomy),o.xp6(7),o.Q6J("ngModel",e.selectedTaxonomy),o.xp6(1),o.Q6J("ngForOf",e.options),o.xp6(4),o.Q6J("disabled",e.selectedTaxonomy.length<1))},dependencies:[h.sg,h.O5,r.JJ,r.On,a.Asz,a.yKW,a.XWE,a.ndF,a.DPz,a.rs,a.q51],encapsulation:2}),i})(),O=[{path:":taxonomy",component:U},{path:":taxonomy/:id",component:k}],B=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=o.oAB({type:i}),i.\u0275inj=o.cJS({imports:[h.ez,g.Bz.forChild(O),b.Ke,w.O,S.s]}),i})()}}]);