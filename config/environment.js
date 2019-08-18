"use strict"

module.exports = function( environment ) {
	let ENV = {
		modulePrefix: "new-tmist",
		podModulePrefix: "new-tmist/src",
		environment,
		rootURL: "/",
		locationType: "auto",
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
		},

		API: {
			Version: ""
		},

		OAuth: {
			Version: "v0",
			ClientId: "5cbd9f94f4ce4352ecb082a0",
			ClientSecret: "5c90db71eeefcc082c0823b2",
			Status: "self",
			Scope: "APP/NTM",
			Host: "",
			RedirectUri: "",
			AuthEndpoint: "page.login",
			RedirectEndpoint: "service.oauth-callback",
			IndexEndpoint: "page.welcome"
		},

		QueryAddress: {
			host: "http://59.110.31.50",
			port: 9202,
			version: "v1.0",
			db: "DL"
		}
	}

	if ( environment === "development" ) {
		ENV.APP.LOG_RESOLVER = true
		ENV.APP.LOG_ACTIVE_GENERATION = true
		ENV.APP.LOG_TRANSITIONS = true
		ENV.APP.LOG_TRANSITIONS_INTERNAL = true
		ENV.APP.LOG_VIEW_LOOKUPS = true

		ENV.OAuth.RedirectUri = "http://ntm.pharbers.com:8081"
		ENV.OAuth.Host = "http://pharbers.com"
		ENV.QueryAddress.host = "http://59.110.31.50"

	}

	if ( environment === "test" ) {
		// Testem prefers this...
		ENV.locationType = "none"

		// keep test console output quieter
		ENV.APP.LOG_ACTIVE_GENERATION = false
		ENV.APP.LOG_VIEW_LOOKUPS = false

		ENV.APP.rootElement = "#ember-testing"
		ENV.APP.autoboot = false
	}

	if ( environment === "production" ) {
		// here you can enable a production-specific feature
		ENV.OAuth.RedirectUri = "http://ntm.pharbers.com"
		ENV.OAuth.Host = "http://oauth.pharbers.com"
		ENV.QueryAddress.host = "http://59.110.31.50"

	}

	return ENV
}
