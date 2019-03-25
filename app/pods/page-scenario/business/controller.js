import Controller from '@ember/controller';

export default Controller.extend({
	init() {
		this._super(...arguments);
		this.set('hospitalState', [
			{ name: '全部', state: 0 },
			{ name: '未分配', state: 1 }
		]);
	},

	actions: {
		goToHospital(id) {
			this.transitionToRoute('page-scenario.business.hospital-config', id);
		}
	}
});
