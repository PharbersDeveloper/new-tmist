import Component from '@ember/component';
import { computed } from '@ember/object';
import Table from 'ember-light-table';

export default Component.extend({
	iconSortable: 'sort',
	iconAscending: 'sort-up',
	iconDescending: 'sort-down',
	iconComponent: 'sort-icon',
	sortIcons: computed('iconSortable', 'iconAscending', 'iconDescending', 'iconComponent', function () {
		return this.getProperties(['iconSortable', 'iconAscending', 'iconDescending', 'iconComponent']);
	}).readOnly(),
	sort: '',
	dir: 'asc',
	sortedModel: computed.sort('model', 'sortBy').readOnly(),
	sortBy: computed('dir', 'sort', function () {
		return [`${this.get('sort')}:${this.get('dir')}`];
	}).readOnly(),
	setRows: function (rows, thisInstance) {
		thisInstance.get('table').setRows([]);
		thisInstance.get('table').setRows(rows);
	},
	filterAndSortModel(thisInstance) {
		let model = thisInstance.get('sortedModel');

		thisInstance.get('setRows')(model, thisInstance);
	},
	columns: computed(function () {
		return [{
			label: '医院名称',
			valuePath: 'hospitalName',
			sortable: false,
			width: '150px'
		}, {
			label: '潜力',
			valuePath: 'potential'

		}, {
			label: '上期销售额',
			valuePath: 'sales'
		}, {
			label: '代表',
			valuePath: 'representative',
			sortable: false
		}, {
			label: '分配时间',
			valuePath: 'visitTime'
		}, {
			label: '销售目标设定',
			valuePath: 'salesTarget'
		}, {
			label: '预算费用',
			valuePath: 'budget'
		}, {
			label: '会议名额',
			valuePath: 'meetingPlaces'
		}];
	}),

	table: computed('model', function () {
		let handledData = [];

		this.get('model').forEach(function (d) {
			let temp = {
				hospitalName: '',
				potential: '',
				sales: '',
				representative: '',
				visitTime: '',
				salesTarget: '',
				budget: '',
				meetingPlaces: ''
			};

			temp.hospitalName = d.hospitalName;
			temp.potential = d.potential;
			temp.sales = d.sales;
			temp.representative = d.representative;
			temp.visitTime = d.visitTime;
			temp.salesTarget = d.salesTarget;
			temp.budget = d.budget;
			temp.meetingPlaces = d.meetingPlaces;
			handledData.push(temp);
		});
		return new Table(this.get('columns'), handledData);
	}),
	actions: {
		sortColumn(column) {
			if (column.sortable) {
				this.setProperties({
					dir: column.ascending ? 'asc' : 'desc',
					sort: column.get('valuePath')
				});
				// this.set('sort', column.get('valuePath'));
				this.get('filterAndSortModel')(this);
			}
		},
		onColumnClick(column) {
			if (column.sorted) {
				this.setProperties({
					dir: column.ascending ? 'asc' : 'desc',
					sort: column.get('valuePath')
				});
				// this.set('sort', column.get('valuePath'));
				this.get('filterAndSortModel')(this);
			}
		},
		onAfterResponsiveChange(matches) {
			if (matches.indexOf('jumbo') > -1) {
				this.get('table.expandedRows').setEach('expanded', false);
			}
		},
		onScrolledToBottom() {
			if (this.get('canLoadMore')) {
				this.incrementProperty('page');
				this.get('fetchRecords').perform();
			}
		}
	}

});
