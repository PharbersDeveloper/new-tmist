import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	strategyAnalysisTime: DS.attr('blank-nan'),	// 业务数据策略分析时间
	adminWorkTime: DS.attr('blank-nan'),	//	行政工作时间
	clientManagementTime: DS.attr('blank-nan'),	//	重点目标客户管理时间
	kpiAnalysisTime: DS.attr('blank-nan'),	//	代表及KPI 分析
	teamMeetingTime: DS.attr('blank-nan'),	//	团队例会
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
