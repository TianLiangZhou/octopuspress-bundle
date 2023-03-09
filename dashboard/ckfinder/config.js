/*
 Copyright (c) 2007-2019, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or https://ckeditor.com/sales/license/ckfinder
 */

let config = {
  skin: 'jquery-mobile',
  language: 'zh_CN',
};
const jwt = JSON.parse(window.localStorage.getItem('auth_app_token'));
config.connectorPath = '/backend/media/ckfinder/connector';
config.connectorInfo = "token=" + jwt.value.replace(".", "--")
CKFinder.define(config);
