CKFinder.define([
  'underscore',
  'backbone',
  'jquery',
  'CKFinder/Modules/EditImage/Views/EditImageLayout',
  'CKFinder/Modules/EditImage/Views/ImagePreviewView',
  'CKFinder/Modules/EditImage/Models/EditImageData',
  'CKFinder/Modules/EditImage/Tools/CropTool',
  'CKFinder/Modules/EditImage/Tools',
  'CKFinder/Models/File'
], function (underscore, backbone, jquery, imageLayout, imagePreviewView, imageData, imageCropTool, tools, fileModel) {
  'use strict';
  var caman,
    customLayout = imageLayout.extend({
      name: 'CropImageLayout',
      template: '<div class="ckf-ei-wrapper"><div id="ckf-ei-preview" class="ckf-ei-preview" style="margin-left: 0 !important;"></div></div>',
      regions: {
        preview: '#ckf-ei-preview',
      },
    }),
    toolCollection = tools.extend({
      setupDefault: function (finder, params, caman) {
        this.finder = finder;
        this.Caman = caman;
        this.tool = new imageCropTool({tabindex: 40}, {collection: this});
        this.add({
          title: finder.lang.editImage.crop,
          icon: 'ckf-crop',
          tool: this.tool,
          tabindex: 40,
        });
        this.tool.getView(this.finder)
        this.on('imageData:ready', function () {
          this.tool.trigger('expand');
          var canvas = this.editImageData.get('caman').renderingCanvas,
            t = jquery(canvas).width(),
            n = jquery(canvas).height();
          this.tool.viewModel.set({
            renderWidth: params.width,
            renderHeight: params.height,
            renderX: parseInt((t - params.width) / 2, 10),
            renderY: parseInt((n - params.height) / 2, 10),
          });
          this.tool.cropBox.ui.cropResize.hide();
          this.tool.cropBox.ui.cropInfo.hide();
        });
      },
    });

  function openCrop(finder, params) {
    if (underscore.isUndefined(caman)) {
      var e = CKFinder.require.toUrl(finder.config.caman || 'libs/caman') + '.js?ckfver=596166831';
      CKFinder.require([e], function (e) {
        caman = e || window.Caman, renderCrop(finder, params);
      });
    } else {
      renderCrop(finder, params);
    }
  }

  function renderCrop(finder, params) {
    var tools = new toolCollection();
    tools.setupDefault(finder, params, caman);
    var layout = new customLayout({finder: finder}),
      previewView = new imagePreviewView({finder: finder});
    finder.once('page:show:CropImage', function () {
      layout.preview.show(previewView);
      finder.request('toolbar:reset', {
        name: 'CropImage',
        context: {tools: tools}
      });
      var e = caman(previewView._uiBindings.canvas, imageDataModel.get('imagePreview'), function () {
        finder.request('loader:hide'), imageDataModel.set({
          renderWidth: previewView.ui.canvas.width(),
          renderHeight: previewView.ui.canvas.height()
        });
      });
      imageDataModel.set('caman', e);
    });

    var imageDataModel = new imageData({
      file: params.file,
      imagePreview: finder.request('image:previewUrl', {
        file: params.file,
        maxWidth: 0.8 * window.innerWidth,
        maxHeight: 0.8 * window.innerHeight,
        noCache: !0
      }),
      fullImagePreview: finder.request('image:previewUrl', {
        file: params.file,
        maxWidth: 1000000,
        maxHeight: 1000000,
        noCache: !0
      }),
      cropWidth: params.width,
      cropHeight: params.height,
    });
    tools.setImageData(imageDataModel);


    finder.request('loader:show', {text: finder.lang.editImage.loading}),
      finder.request('command:send', {
        name: 'ImageInfo',
        folder: params.file.get('folder'),
        params: {fileName: params.file.get('name')}
      }).done(function (e) {
        if (e.error && 117 === e.error.number)
          return finder.once('command:error:ImageInfo', function (e) {
            e.cancel();
          }), finder.request('loader:hide'), finder.request('folder:refreshFiles'), void finder.request('dialog:info', {msg: finder.lang.errors.missingFile});
        var t = {
          width: e.width,
          height: e.height,
          size: e.size
        };
        params.file.set('imageInfo', t), tools.setImageInfo(t), finder.util.isWidget() && function (t) {
          var n = !1;
          t.request('isMaximized') || (t.request('maximize'), n = !0);

          function i() {
            n = !1, t.removeListener('minimized', i);
          }

          t.once('minimized', i), t.once('page:destroy:CropImage', function e() {
            n && t.request('minimize');
            t.removeListener('page:destroy:CropImage', e);
            t.removeListener('minimized', i);
          });
        }(finder);
        finder.once('page:create:CropImage', function () {
          finder.request('toolbar:create', {
            name: 'CropImage',
            page: 'CropImage'
          });
        });
        finder.request('page:create', {
          view: layout,
          title: finder.lang.editImage.title,
          name: 'CropImage',
          className: 'ckf-ei-page'
        });
        finder.request('page:show', {name: 'CropImage'})
      });
  }

  return {
    init: (finder) => {
      finder.setHandler('image:crop', function (params) {
        openCrop(finder, params);
      });
      finder.on('toolbar:reset:CropImage', function (e) {
        var confirmButton = new finder.Backbone.Model({
          name: 'Save',
          label: finder.lang.common.ok,
          icon: 'ckf-save',
          alignment: 'secondary',
          alwaysVisible: !0,
          type: 'button',
          action: function () {
            var tools = e.data.tools,
                file = tools.editImageData.get('file'),
                folder = file.get('folder');
            tools.tool.cropView(),
            confirmButton.set('isDisabled', !0);
            var filename = file.get('name');
            filename = filename.substring(0, filename.lastIndexOf('.')) + '-' + tools.editImageData.get('cropWidth')+'x'+tools.editImageData.get('cropHeight') + '.' + file.getExtension();
            finder.request('loader:show', {text: finder.lang.editImage.uploadAction});
            tools.doSave(tools.editImageData.get('fullImagePreview'))
              .then(function (data) {
                finder.request('command:send', {
                  name: 'SaveImage',
                  type: 'post',
                  folder: folder,
                  params: { fileName: filename },
                  post: { content: data },
                  context: {
                    file: file,
                    isFileNameChanged: true
                  },
                }).done(function (e) {
                  finder.request('loader:hide')
                  if (e.error)
                    return finder.once('command:error:SaveImage', function (e) {
                      e.cancel();
                    }), void finder.request('dialog:info', {msg: finder.lang.errors.unknownUploadError});

                  var folder = finder.request('folder:getActive');
                  var file = new fileModel(e.file);
                  file.set('folder', folder), file.set('cid', file.cid);
                  finder.request('page:destroy', {name: 'CropImage'});
                  finder.fire('crop:image:confirm', {file: file})
                  finder.request('closePopup');
                });
              });
          }
        });
        e.data.toolbar.push({
          type: 'text',
          name: 'Filename',
          className: 'ckf-ei-toolbar-filename',
          label: finder.util.escapeHtml(e.data.tools.editImageData.get('file').get('name'))
        }),
        e.data.toolbar.push(confirmButton),
        e.data.toolbar.push({
          name: 'Reset',
          label: finder.lang.common.cancel,
          icon: 'ckf-cancel',
          alignment: 'secondary',
          alwaysVisible: !0,
          isDisabled: !1,
          type: 'button',
          action: function () {
            finder.request('page:destroy', {name: 'CropImage'});
            finder.fire('crop:image:confirm', {file: e.data.tools.editImageData.get('file')})
            finder.request('closePopup');
          }
        });
      });
    }
  }
});
