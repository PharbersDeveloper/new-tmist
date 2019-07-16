import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
// import ENV from 'new-tmist/config/environment';

export default Route.extend({
	cookies: service(),
	ajax: service(),
	// xmpp: service('service-xmpp'),
	converse: service('serviceConverse'),
	activate() {
		this._super(...arguments);
		let applicationController = this.controllerFor('application');

		// refresh = localStorage.getItem('refresh');
		applicationController.set('testProgress', 0);
		localStorage.removeItem('reDeploy');

		// this.refresh();
		// 如果 refresh 为 undefined 不刷新,并将refresh 设置为1。
		// 在下一页面，
		// if (isEmpty(refresh)) {
		// 	localStorage.setItem('refresh', 1);
		// } else {
		// 	localStorage.removeItem('refresh');
		// 	window.location.reload(true);
		// }
	},
	// init() {
	// 	this._super(...arguments);
	// 	this.get('xmpp').initialize(ENV);
	// 	this.get('xmpp').callBack(this.cFuncBack);
	// 	this.get('xmpp').connect('swang', 'swang');
	// },
	// cFuncBack(message) {
	// 	window.console.info(message);
	// },
	setupController(controller) {
		this._super(...arguments);
		const converse = this.converse,
			CONVERSE = window.converse;

		window.console.log(!controller.get('hasPlugin'));
		if (!controller.get('hasPlugin')) {
			converse.initialize();
			try {
				CONVERSE.plugins.add('chat_plugin', {
					initialize: function () {
						this._converse.log('converse plugin initialize');
						controller.set('hasPlugin', true);
						this._converse.api.listen.on('message', obj => {
							let message = isEmpty(obj.stanza.textContent) ? '{}' : obj.stanza.textContent;

							window.console.log(JSON.parse(message).msg);
							window.console.log(this._converse.api.user.status.get());
							if (!isEmpty(message)) {
								window.console.info(JSON.parse(message));
								controller.set('xmppMessage', JSON.parse(message));
								return JSON.parse(message);
							}
						});
						// this._converse.api.listen.on('disconnected', () => {
						// 	window.console.log('disconnected');
						// 	// converse.initialize();
						// });
						// this._converse.api.listen.on('statusChanged', status => {
						// 	window.console.log('statusChanged');
						// 	window.console.log('status');
						// });
					}
				});
			} catch (error) {
				window.console.warn(error);
			}
		}
	},
	model() {
		let applicationModel = this.modelFor('application'),
			store = this.get('store'),
			cookies = this.get('cookies'),
			useableProposals = A([]),
			accountId = cookies.read('account_id'),
			papers = A([]);

		if (!isEmpty(applicationModel)) {
			return RSVP.hash({
				papers: applicationModel.papers,
				useableProposals: applicationModel.useableProposals,
				detailProposal: applicationModel.detailProposal,
				detailPaper: applicationModel.detailPaper,
				scenario: applicationModel.scenario
			});
		}
		return store.query('useableProposal', {
			'account-id': accountId
		}).then(data => {
			useableProposals = data;
			let promiseArray = A([]);

			promiseArray = useableProposals.map(ele => {
				return ele.get('proposal');
			});
			return RSVP.Promise.all(promiseArray);
		}).then(data => {
			let useableProposalIds = data,
				promiseArray = A([]),
				ajax = this.get('ajax');

			promiseArray = useableProposalIds.map(ele => {
				return ajax.request(`/v0/GeneratePaper?proposal-id=${ele.id}
				&account-id=${cookies.read('account_id')}`, {
					method: 'POST',
					data: {}
				});
			});
			return RSVP.Promise.all(promiseArray);

		}).then(data => {
			data.forEach(ele => {
				store.pushPayload(ele);
			});
			papers = store.peekAll('paper');
			return RSVP.hash({
				results: A([]),
				papers,
				useableProposals,
				detailProposal: useableProposals.get('firstObject'),
				detailPaper: papers.get('firstObject')
			});
		});
	}
});
