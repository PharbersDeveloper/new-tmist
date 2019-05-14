import Service from '@ember/service';
import { isEmpty } from '@ember/utils';
import { A } from '@ember/array';

export default Service.extend({
	// 数字验证规则
	numberVerify: /^\d+$/,
	verifyInput(resourceConfRep, businessInputs, resourceConfigManager) {

		let newBusinessInputs = businessInputs,
			representativeInputVisitTimes = A([]),
			representativeVisitTimes = A([]),

			usedSalesTarget = 0,
			usedBudget = 0,
			usedMeetingPlaces = 0,
			usedVisitTime = 0,
			numberVerify = this.get('numberVerify'),
			totalBusinessIndicators = resourceConfigManager.get('managerConfig.totalBusinessIndicators'),
			totalBudgets = resourceConfigManager.get('managerConfig.totalBudgets'),
			totalMeetingPlaces = resourceConfigManager.get('managerConfig.totalMeetingPlaces');

		representativeInputVisitTimes = newBusinessInputs.map(bi => {
			let choosedRep = isEmpty(bi.get('resourceConfig'));

			usedSalesTarget += Number(bi.get('salesTarget'));
			usedBudget += Number(bi.get('budget'));
			usedMeetingPlaces += Number(bi.get('meetingPlaces'));
			usedVisitTime += Number(bi.get('visitTime'));

			return {
				visitTime: Number(bi.get('visitTime')),
				resourceConfigId: choosedRep ? '' : bi.get('resourceConfig.id'),
				representativeId: choosedRep ? '' : bi.get('resourceConfig.representativeConfig.representative.id'),
				resourceConfig: choosedRep ? null : bi.get('resourceConfig')
			};
		});

		representativeVisitTimes = resourceConfRep.map(ele => {
			let perVisitTime = 0;

			representativeInputVisitTimes.forEach(item => {
				if (item.representativeId === '') {
					perVisitTime = 0;
					return;
				}

				if (ele.get('id') === item.resourceConfigId) {
					perVisitTime += item.visitTime;
				}
			});
			return {
				visitTime: perVisitTime,
				representativeId: ele.get('representativeConfig.representative.id'),
				representativeName: ele.get('representativeConfig.representative.name'),
				resourceConfig: ele
			};
		});
		return {
			illegal: !numberVerify.test(usedSalesTarget) || !numberVerify.test(usedBudget) || !numberVerify.test(usedMeetingPlaces) || !numberVerify.test(usedVisitTime),
			zeroVisitTime: newBusinessInputs.filter(ele => ele.get('visitTime') !== '' && Number(ele.get('visitTime')) === 0),
			lowTotalBusinessIndicators: usedSalesTarget < totalBusinessIndicators,
			lowTotalBudgets: usedBudget < totalBudgets,
			lowTotalMeetingPlaces: usedMeetingPlaces < totalMeetingPlaces,
			lowVisitTime: representativeVisitTimes.filter(ele => ele.visitTime < 100),
			overTotalBusinessIndicators: usedSalesTarget > totalBusinessIndicators,
			overTotalBudgets: usedBudget > totalBudgets,
			overTotalMeetingPlaces: usedMeetingPlaces > totalMeetingPlaces,
			overVisitTime: representativeVisitTimes.filter(ele => ele.visitTime > 100),
			blankMeetingPlaces: newBusinessInputs.filter(ele => isEmpty(ele.meetingPlaces)),
			usedSalesTarget,
			usedBudget,
			usedMeetingPlaces
		};
	}
});
