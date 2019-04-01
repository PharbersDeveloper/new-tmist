import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Controller.extend({
	groupValue: 0,
	hospitalData: computed('model', function () {
		let salesReports = this.get('model').sortBy('time'),
			salesReportsCurrent = salesReports.get('lastObject'),
			times = salesReports.map(ele => ele.get('formatTime')),
			currentReport = salesReportsCurrent.get('hospitalSalesReports'),
			historyReport = salesReports.
				filter(ele => ele.get('time') !== salesReportsCurrent.get('time')).
				map(ele => ele.get('hospitalSalesReports'));

		return {
			currentReport,
			times,
			historyReport
		};
	}),
	prodSalesReports: A([
		{ season: '2018年第四季度销售额', value: '82222222' },
		{ season: '2018年第四季度销售指标', value: '82222222' },
		{ season: '2019年第一季度销售额', value: '82222222' },
		{ season: '2019年第一季度销售指标', value: '82222222' }

	])
});
