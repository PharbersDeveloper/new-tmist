import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	model() {
		let store = this.get('store'),
			managerinput = store.peekAll('managerinput').filter(ele => ele.get('isNew')).get('lastObject'),
			representativeinputs = store.peekAll('representativeinput').filter(ele => ele.get('isNew')),
			businessinputs = store.peekAll('businessinput').filter(ele => ele.get('isNew'));

		return RSVP.hash({
			managerinput,
			businessinputs,
			representativeinputs
		});

	},
	setupController(controller) {
		this._super(...arguments);
		controller.set('groupValue', 0);
	}
});
