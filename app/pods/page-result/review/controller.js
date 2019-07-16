import Controller from '@ember/controller';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
export default Controller.extend({
	groupValue: 0,
	filterTableData: computed('model.tableData', 'tmpRepName', function () {
		let tableData = this.get('model.tableData'),
			tmpRepName = this.get('tmpRepName'),
			filterTableData = A([]);

		if (isEmpty(tmpRepName)) {
			return tableData;
		}
		filterTableData = tableData.filterBy('representative', tmpRepName);
		return filterTableData;
	})
});
