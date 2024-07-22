/*
 Copyright (c) 2007-2024, CKSource Holding sp. z o.o. All rights reserved.
 For licensing, see LICENSE.html or https://ckeditor.com/sales/license/ckfinder
 */

let config = {
  skin: 'jquery-mobile',
  language: 'zh_CN',
};

// Set your configuration options below.

// Examples:
// config.language = 'pl';
// config.skin = 'jquery-mobile';

const jwt = JSON.parse(window.localStorage.getItem('auth_app_token'));
config.connectorPath = '/backend/media/ckfinder/connector';
config.connectorInfo = "token=" + jwt.value.replace(".", "--")
CKFinder.define(config);
