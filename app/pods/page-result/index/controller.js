import Controller from '@ember/controller';
import { computed } from '@ember/object';

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
	})
});
