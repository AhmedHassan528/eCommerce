module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
        jasmine: {},
        clearContext: false
      },
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage/ecommerce'),
        subdir: '.',
        reporters: [{ type: 'html' }, { type: 'text-summary' }]
      },
      reporters: ['progress', 'kjhtml'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      customLaunchers: {
        ChromeHeadlessCI: {
          base: 'ChromeHeadless',
          flags: [
            '--no-sandbox',
            '--disable-gpu',
            '--headless',
            '--disable-dev-shm-usage',
            '--remote-debugging-port=9222'
          ]
        }
      },
      browsers: ['ChromeHeadlessCI'],
      singleRun: true,
      restartOnFileChange: true
    });
  };
  