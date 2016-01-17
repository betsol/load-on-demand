(function (window, $) {

  'use strict';

  if (!$) {
    console.log('jQuery is required for this script to work');
    return;
  }

  if (window.loadOnDemand) {
    console.log('loadOnDemand already loaded!');
    return;
  }

  window.loadOnDemand = function (options, callback) {

    var defaultOptions = {
      stylesheets: [],
      scripts: {}
    };
    options = $.extend({}, defaultOptions, options);

    // Loading stylesheets if required.
    if (options.stylesheets.length > 0) {
      $.each(options.stylesheets, function (key, url) {
        loadStylesheet(url);
      });
    }

    // Forming complete list of scripts to load.
    var scriptsToLoad = [];
    $.each(options.scripts, function (key, urls) {
      if (window[key]) {
        // No need to load if key is present.
        return;
      }
      $.each(urls, function (_, url) {
        scriptsToLoad.push(url);
      });
    });

    // Starting to actually load scripts.
    loadNextScript();


    function loadNextScript () {
      var url = scriptsToLoad[0];
      loadScript(url, function () {
        // Removing first script from array.
        scriptsToLoad.shift();
        if (0 == scriptsToLoad.length) {
          // All scripts are loaded, firing callback and exiting loop.
          callback();
        } else {
          // Continuing to load other scripts.
          loadNextScript();
        }
      });
    }

  };

  function loadStylesheet (url) {
    var headElement  = document.getElementsByTagName('head')[0];
    var linkElement  = document.createElement('link');
    linkElement.rel  = 'stylesheet';
    linkElement.type = 'text/css';
    linkElement.href = url;
    linkElement.media = 'all';
    headElement.appendChild(linkElement);
  }

  function loadScript (url, callback) {

    var callbackCalled = false;

    var headElement = document.getElementsByTagName('head')[0];
    var scriptElement = document.createElement('script');

    scriptElement.src = url;
    scriptElement.onload = triggerCallback;
    scriptElement.onreadystatechange = function () {
      if ('complete' == this.readyState) {
        triggerCallback();
      }
    };

    headElement.appendChild(scriptElement);

    function triggerCallback () {
      if (callbackCalled) {
        return;
      }
      callbackCalled = true;
      callback();
    }

  }


})(window, jQuery || undefined);
