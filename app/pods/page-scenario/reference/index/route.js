import Route from '@ember/routing/route';
import { A } from '@ember/array';
import RSVP, { hash } from 'rsvp';

export default Route.extend({
	model() {
		let totalConfig = this.modelFor('page-scenario.reference'),
			paper = totalConfig.paper,
			seasons = A([]),
			lineColorTm = A(['#57D9A3', '#79E2F2', '#FFE380', '#8777D9 ']);

		return paper.get('salesReports')
			.then(data => {
				// 获取产品salesReport
				let increaseSalesReports = data.sortBy('time'),
					promiseArray = increaseSalesReports.map(ele => {
						return ele.get('productSalesReports');
					});

				seasons = increaseSalesReports.map(ele => {
					return ele.get('formatTime');
				});

				return RSVP.Promise.all(promiseArray);
			}).then(data => {
				// 获取基于周期的数据
				let tmpData = data.map((productSalesReports, index) => {
					let shareData = this.eachArray(productSalesReports, 'share'),
						productNames = this.eachArray(productSalesReports, 'productName');

					return {
						date: seasons[index],
						shareData,
						productNames
					};
				});

				return tmpData;
			}).then(data => {
				// 拼装基于产品的数据
				let lineData = data[0].productNames.map((ele, index) => {
					return {
						name: ele,
						date: seasons,
						// eslint-disable-next-line max-nested-callbacks
						data: data.map(item => item.shareData[index])
					};
				});

				return hash({
					goodsConfigs: totalConfig.goodsConfigs,
					paper,
					lineDataTm: lineData,
					lineColorTm
				});
			});
	},
	eachArray(array, key) {
		return array.map(ele => {
			return ele.get(key);
		});
	}
});
