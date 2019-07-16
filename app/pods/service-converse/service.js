import Service from '@ember/service';
// import ENV from 'new-tmist/config/environment';

const CONVERSE = window.converse;

export default Service.extend({
	initPlugin: false,
	initialize() {
		window.console.log('initialize XMPP');

		CONVERSE.initialize({
			authentication: 'login', // 认证方式，默认为 'login'
			'auto_reconnect': true,
			'bosh_service_url': 'http://123.56.179.133:7070/http-bind/',
			'show_controlbox_by_default': false,
			'auto_login': true,
			jid: 'swang@max.logic',
			password: 'swang',
			// keepalive: true,
			i18n: 'zh',
			// debug: ENV.environment === 'development',
			'auto_join_rooms': [
				{
					jid: '5cbd9f94f4ce4352ecb082a0@conference.max.logic',
					nick: 'ntmClient'
				}],
			// 'view_mode': 'embedded',
			'show_desktop_notifications': false,
			'whitelisted_plugins': ['chat_plugin']
		});
	}
});
