import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	representativeId: DS.attr('string'),
	productKnowledgeTraining: DS.attr('number'),
	salesAbilityTraining: DS.attr('number'),
	regionTraining: DS.attr('number'),
	performanceTraining: DS.attr('number'),
	vocationalDevelopment: DS.attr('number'),
	assistAccessTime: DS.attr('number'),
	teamMeeting: DS.attr('number'),
	totalPoint: computed('productKnowledgeTraining', 'salesAbilityTraining', 'regionTraining', 'performanceTraining', 'vocationalDevelopment', function () {
		let { productKnowledgeTraining, salesAbilityTraining,
			regionTraining, performanceTraining, vocationalDevelopment } =
			this.getProperties('productKnowledgeTraining', 'salesAbilityTraining', 'regionTraining', 'performanceTraining', 'vocationalDevelopment');

		return Number(productKnowledgeTraining) +
			Number(salesAbilityTraining) +
			Number(regionTraining) +
			Number(performanceTraining) +
			Number(vocationalDevelopment);
	}),
	abilityCoach: DS.attr('number')
});
