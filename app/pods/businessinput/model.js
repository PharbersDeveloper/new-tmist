import DS from 'ember-data';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { A } from '@ember/array';

export default DS.Model.extend({
	destConfigId: DS.attr('string'),
	resourceConfigId: DS.attr('string'),
	salesTarget: DS.attr('number'),
	budget: DS.attr('number'),
	meetingPlaces: DS.attr('number'),
	visitTime: DS.attr('number'),
	isFinish: computed('salesTarget', 'budget', 'meetingPlaces', 'visitTime', 'resourceConfigId', function () {
		let { salesTarget, budget, meetingPlaces, visitTime, resourceConfigId } =
			this.getProperties('salesTarget', 'budget', 'meetingPlaces', 'visitTime', 'resourceConfigId'),
			tmpArray = A([salesTarget, budget, meetingPlaces, visitTime, resourceConfigId]);

		return tmpArray.every(ele => {
			return !isEmpty(ele);
		});
	})
});
