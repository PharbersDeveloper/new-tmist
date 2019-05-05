import Component from '@ember/component';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';

export default Component.extend({
	classNames: ['mb-4', 'bg-white'],
	localClassNames: 'representative',
	showContent: false,
	icon: computed('showContent', function () {
		let showContent = this.get('showContent');

		return showContent ? 'right' : 'down';
	}),
	radarData: computed('representativeId', function () {
		let averageAbilityObject =
			this.get('averageAbility').get('firstObject'),
			representativeId = this.get('representativeId'),
			originalAbility = A([]),
			representativeAbilities = this.get('representativeAbilities'),
			reallyAbility = null;

		if (isEmpty(representativeId)) {
			return [
				{
					value: [0, 0, 0, 0, 0],
					name: '代表本期初始能力'
				},
				{
					value: averageAbilityObject,
					name: '团队平均能力'
				}
			];
		}
		representativeAbilities.forEach(ele => {
			if (ele.get('representative.id') === representativeId) {
				reallyAbility = ele;
			}
		});

		if (isEmpty(reallyAbility)) {
			originalAbility = [0, 0, 0, 0, 0];
		} else {

			originalAbility.push(reallyAbility.get('jobEnthusiasm'));
			originalAbility.push(reallyAbility.get('productKnowledge'));
			originalAbility.push(reallyAbility.get('behaviorValidity'));
			originalAbility.push(reallyAbility.get('regionalManagementAbility'));
			originalAbility.push(reallyAbility.get('salesAbility'));
		}
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
