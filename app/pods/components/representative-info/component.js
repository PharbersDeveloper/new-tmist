import Component from '@ember/component';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
	classNames: ['mb-4', 'bg-white'],
	localClassNames: 'representative',
	showContent: true,
	icon: computed('showContent', function () {
		let showContent = this.get('showContent');

		return showContent ? 'down' : 'right';
	}),
	radarData: computed('representative', function () {
		let averageAbilityObject =
			this.get('averageAbility').get('firstObject'),
			originalAbility = A([]),
			representativeConfig = this.get('representative').get('representativeConfig');

		originalAbility.push(representativeConfig.get('jobEnthusiasm'));
		originalAbility.push(representativeConfig.get('productKnowledge'));
		originalAbility.push(representativeConfig.get('behaviorValidity'));
		originalAbility.push(representativeConfig.get('regionalManagementAbility'));
		originalAbility.push(representativeConfig.get('salesAbility'));

		return [
			{
				value: originalAbility,
				name: '代表本期初始能力'
			},
			averageAbilityObject
		];
	}),
	actions: {
		showContent() {
			this.toggleProperty('showContent');
		}
	}
});
