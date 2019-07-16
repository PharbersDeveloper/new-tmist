'use strict';

module.exports = function (environment) {
	let ENV = {
		modulePrefix: 'new-tmist',
		podModulePrefix: 'new-tmist/pods',
		environment,
		rootURL: '/',
		locationType: 'auto',
		redirectUri: 'http://ntm.pharbers.com',
		host: 'http://oauth.pharbers.com',
		clientId: '5cbd9f94f4ce4352ecb082a0',
		fontawesome: {
			icons: {
				'free-solid-svg-icons': 'all'
			}
		},
		EmberENV: {
			FEATURES: {
				// Here you can enable experimental features on an ember canary build
				// e.g. 'with-controller': true
			},
			EXTEND_PROTOTYPES: {
				// Prevent Ember Data from overriding Date.parse.
				Date: false
			}
		},

		APP: {
			// Here you can pass flags/options to your application instance
			// when it is created
		}
	};

	if (environment === 'development') {
		// ENV.APP.LOG_RESOLVER = true;
		// ENV.APP.LOG_ACTIVE_GENERATION = true;
		// ENV.APP.LOG_TRANSITIONS = true;
		// ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
		// ENV.APP.LOG_VIEW_LOOKUPS = true;
		ENV.redirectUri = 'http://ntm.pharbers.com:8081';
		ENV.host = 'http://192.168.100.174:9096';
	}

	if (environment === 'test') {
		// Testem prefers this...
		ENV.locationType = 'none';

		// keep test console output quieter
		ENV.APP.LOG_ACTIVE_GENERATION = false;
		ENV.APP.LOG_VIEW_LOOKUPS = false;

		ENV.APP.rootElement = '#ember-testing';
		ENV.APP.autoboot = false;
	}

	if (environment === 'production') {
		ENV.redirectUri = 'http://ntm.pharbers.com';
		ENV.host = 'http://oauth.pharbers.com';
		// here you can enable a production-specific feature
	}

	return ENV;
};
