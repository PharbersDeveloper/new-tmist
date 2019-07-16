import Controller from '@ember/controller';
import ENV from 'new-tmist/config/environment';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { computed, observer } from '@ember/object';

export default Controller.extend({
	cookies: service(),
	converse: service('service-converse'),
	serviceStatus: service(),
	testBtn: computed(function () {
		if (ENV.environment === 'development') {
			return true;
		}
		return false;
	}),
	xmppResult: observer('xmppMessage.time', function () {
		let clientId = ENV.clientId,
			accountId = this.get('cookies').read('account_id'),
			proposalId = this.get('model').detailProposal.get('proposal.id'),
			scenarioId = this.get('serviceStatus').get('currentScenarioId'),
			xmppMessage = this.xmppMessage;

		// if (ENV.environment === 'development') {
		if (xmppMessage['type'] === 'calc') {

			if (xmppMessage['client-id'] !== clientId) {
				if (ENV.environment === 'development') {
					window.console.log('client-id error');
				}
				return;
			} else if (xmppMessage['account-id'] !== accountId) {
				if (ENV.environment === 'development') {
					window.console.log('账户 error');
				}
				return;
			} else if (xmppMessage['proposal-id'] !== proposalId) {
				if (ENV.environment === 'development') {
					window.console.log('proposal-id error');
				}
				return;
			} else if (xmppMessage['scenario-id'] !== scenarioId) {
				if (ENV.environment === 'development') {
					window.console.log('关卡 error');
				}
				return;
			}
			if (xmppMessage.status === 'ok') {
				if (ENV.environment === 'development') {
					window.console.log('结果已经返回');
				}
				this.updatePaper(this.store, this.get('serviceStatus').get('currentPaperId'), this);
				return;
			}
			window.console.log('计算错误');

		}
	}),
	updatePaper(store, paperId, context) {
		store.findRecord('paper', paperId, { reload: true })
			.then(() => {
				this.set('loadingForSubmit', false);

				context.transitionToRoute('page-result');
				return null;
			});
	},
	notice: localStorage.getItem('notice') !== 'false',
	neverShow: A(['不在显示']),
	reports: computed('model.detailPaper', function () {
		let paper = this.get('model.detailPaper'),
			inputs = paper.get('paperinputs');

		return inputs.sortBy('time').reverse();
	}),
	actions: {
		checkReport(assessmentReport) {
			this.transitionToRoute('page-report', assessmentReport.id);
		},
		changeDetail(useableProposal, paper) {
			this.set('model.detailProposal', useableProposal);
			this.set('model.detailPaper', paper);
		},
		startDeploy(proposalId) {
			localStorage.setItem('notice', false);
			this.transitionToRoute('page-notice', proposalId);
		},
		reDeploy() {
			let proposalId = this.get('model').detailProposal.get('proposal.id');

			this.set('reDeploy', false);
			// reDeploy 为 1 的时候，代表用户选择`重新部署`
			localStorage.setItem('reDeploy', 1);
			this.transitionToRoute('page-notice', proposalId);
		},
		closeNotice() {
			this.set('notice', false);
		},
		chooseItem(item) {
			if (item.length > 0) {
				localStorage.setItem('notice', false);
			} else {
				localStorage.setItem('notice', true);
			}
		}
	}
});
