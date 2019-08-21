(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['ali-oss'],
      __esModule: true,
    };
  }

  define('ali-oss', [], vendorModule);
})();
