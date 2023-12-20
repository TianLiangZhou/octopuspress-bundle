import 'whatwg-fetch';
(function (root) {
  /**
   * @returns {string}
   */
  root.getTheme = () => {
    let theme = root.cookie.getItem('_theme') || 'System';
    if (theme === 'System') {
      theme = root.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';
    }
    return theme;
  };
  /**
   * @param {string} theme
   */
  root.switchTheme = (theme) => {
    let element = document.getElementsByTagName('html')[0];
    element.classList.add(theme.toLowerCase());
    element.setAttribute('theme', theme.toLowerCase());
  };
  root.cookie = {
    getItem: function (sKey) {
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
        return false;
      }
      let sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!sKey || !this.hasItem(sKey)) {
        return false;
      }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
      const aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (let nIdx = 0; nIdx < aKeys.length; nIdx++) {
        aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
      }
      return aKeys;
    }
  };

  /**
   * @param {HTMLFormElement} form
   * @param {Function | string} callback
   */
  root.commentSubmitListener = (form, callback) => {
    form.addEventListener('submit', (event) => {
      if (event.preventDefault) {
        event.preventDefault();
      }
      root.fetch('/comment', {
          method: 'post',
          body: new FormData(form),
      }).then(response => {
        response.json().then((body) => {
          if (callback) {
            typeof callback === 'string' ? root[callback](body): callback(body);
          }
        }, (error) => {
          if (callback) {
            typeof callback === 'string' ? root[callback](error): callback(error);
          }
        }).catch((error) => {
          if (callback) {
            typeof callback === 'string' ? root[callback](error): callback(error);
          }
        });
      });
      return false;
    }, false);
  };
  /**
   * @param {HTMLFormElement} form
   * @param {Function} callback
   * @param {string} type
   */
  root.formToFetchTransFormer = (form, callback, type = '') => {
    form.addEventListener('submit', (event) => {
      if (event.preventDefault) {
        event.preventDefault();
      }
      const data = new FormData(form);
      const headers = {};
      const json = {};
      if (type === 'application/json') {
        headers['content-type'] = 'application/json';
        for(const item of data) {
          json[item[0]]=item[1];
        }
      }
      window.fetch(form.action, {
        method: form.method,
        body: type === 'application/json' ? JSON.stringify(json) : data,
        headers: headers,
      })
        .then((response) => {
          response.json().then((body) => {
            callback && callback(body)
          }).catch((err) => {
            callback && callback(err)
          });
        })
        .catch((err) => {
          callback && callback(err)
        })
    });
  };

  (() => {
    const path = document.location.pathname;
    if (path === '/login' ||
      path === '/signup' ||
      path === '/forgot-pass' ||
      path === '/reset-pass' ||
      path === '/install'
    ) {
      /**
       * @type {HTMLFormElement}
       */
      const form = document.querySelector('form');
      /**
       *
       * @type {HTMLButtonElement}
       */
      const button = form.querySelector('button');

      /**
       *
       * @type {HTMLDivElement}
       */
      const errorContainer = document.getElementById('errorContainer');

      /**
       *
       * @param {Event} changeEvent
       */
      const changeEvent = function (changeEvent) {
        if (errorContainer) {
          errorContainer.innerText = '';
          errorContainer.classList.add('hidden');
        }
        button.disabled = !form.checkValidity();
      };
      form.addEventListener('change', changeEvent);
      if (path !== '/install') {
        root.formToFetchTransFormer(form, (body) => {
          if (body.message && errorContainer) {
            errorContainer.innerText = body.message;
            errorContainer.classList.remove('hidden');
          }
          if (body.token) {
            window.localStorage.setItem('auth_app_token', JSON.stringify({
              createdAt: new Date().getTime(),
              name:"nb:auth:jwt:token",
              ownerStrategyName:"email",
              value: body.token,
            }));
            document.location.href = body.redirect || '/';
          }
        }, 'application/json');
      }
    }
    let commentForm = document.getElementById('commentForm');
    if (commentForm) {
      root.commentSubmitListener(commentForm, 'commentCallback');
    }
  })();
})(window);
