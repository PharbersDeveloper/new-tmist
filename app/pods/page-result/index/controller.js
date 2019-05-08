import Controller from '@ember/controller';

export default Controller.extend({
	salesGroupValue: 0,
	actions: {
		changeSalesValue(value) {
			this.set('salesGroupValue', value);
			return false;
		}
	}
});
