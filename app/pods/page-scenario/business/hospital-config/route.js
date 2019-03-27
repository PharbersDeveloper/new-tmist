import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	model(params) {
		let dCId = params['config_id'],
			store = this.get('store'),
			scenarios = this.modelFor('page-scenario'),
			managerConf = scenarios.resourceConfManager,
			businessController = this.controllerFor('page-scenario.business'),
			currentController = this.controllerFor('page-scenario.business.hospital-config'),
			businessInputs = store.peekAll('businessinput'),
			businessinput = null;

		/**
		 * 当前的业务决策实例
		 */
		businessInputs.forEach(ele => {
			if (ele.get('destConfigId') === dCId) {
				businessinput = ele;
			}
		});
		/**
		 * 获取总业务指标/总预算/总名额
		 */
		managerConf.get('managerConfig')
			.then(mc => {
				return {
					tbi: mc.get('totalBusinessIndicators'),
					tbg: mc.get('totalBudgets'),
					tmp: mc.get('totalMeetingPlaces')
				};
			}).then(data => {
				currentController.set('totalBusinessIndicators', data.tbi);
				currentController.set('totalBudgets', data.tbg);
				currentController.set('totalMeetingPlaces', data.tmp);
			});
		currentController.set('parentController', businessController);
		currentController.set('businessinput', businessinput);

		return hash({
			managerConf,
			repConf: scenarios.resourceConfRep,
			destConfig: store.findRecord('destConfig', dCId),
			businessinput,
			// businessinput: store.queryRecord('businessinput', { 'dest-config-id': dCId }),
			// hospConfig: this.get('store').findRecord('hospitalConfig', hCId),
			prodConfig: this.get('store').findAll('productConfig')
		});
	}
});
