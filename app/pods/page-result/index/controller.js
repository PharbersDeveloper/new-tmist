import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	groupValue: 0,
	hospitalData: computed('model', function(){
		let salesReports = this.get('model').sortBy('time'),
			salesReportsCurrent = salesReports.get('lastObject'),
			times = salesReports.map(ele => ele.get('time')),
			currentReport = salesReportsCurrent.get('hospitalsalesreports'),
			historyReport = salesReports.
				filter(ele => ele.get('time') !== salesReportsCurrent.get('time')).
				map(ele => ele.get('hospitalsalesreports'));

		return {
			currentReport,
			times,
			historyReport
		};
	})
});
