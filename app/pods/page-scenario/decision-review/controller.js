import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { A } from '@ember/array';

export default Controller.extend({
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
