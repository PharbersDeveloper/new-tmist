import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	strategyAnalysisTime: DS.attr('number'),
	adminWorkTime: DS.attr('number'),
	clientManagementTime: DS.attr('number'),
	kpiAnalysisTime: DS.attr('number'),
	teamMeetingTime: DS.attr('number'),
	assistAccessTime: DS.attr('number'),
	abilityCoach: DS.attr('number'),
	totalManagerUsedTime: computed('strategyAnalysisTime', 'adminWorkTime', 'clientManagementTime', 'kpiAnalysisTime', 'teamMeetingTime', function () {
		let { strategyAnalysisTime, adminWorkTime,
			clientManagementTime, kpiAnalysisTime, teamMeetingTime } =
			this.getProperties('strategyAnalysisTime', 'adminWorkTime', 'clientManagementTime', 'kpiAnalysisTime', 'teamMeetingTime');

		return Number(strategyAnalysisTime) +
			Number(adminWorkTime) +
			Number(clientManagementTime) +
			Number(kpiAnalysisTime) +
			Number(teamMeetingTime);
	})
});
