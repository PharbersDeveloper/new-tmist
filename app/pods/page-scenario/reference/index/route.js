import Route from '@ember/routing/route';
import { A } from '@ember/array';
import RSVP, { hash } from 'rsvp';

export default Route.extend({
	model() {
		let totalConfig = this.modelFor('page-scenario.reference'),
			paper = totalConfig.paper,
			goodsConfigs = totalConfig.goodsConfigs,
			seasons = A([]),
			tmpData = A([]),
			lineColorTm = A(['#57D9A3', '#79E2F2', '#FFE380', '#8777D9 ']);

		return paper.get('salesReports')
			.then(data => {
				// 获取产品salesReport
				let increaseSalesReports = data.sortBy('time'),
					promiseArray = increaseSalesReports.map(ele => {
						return ele.get('productSalesReports');
					}),
					seasonsPrimary = increaseSalesReports.map(ele => {
						return ele.scenario;
					});

				return hash({
					productSalesReports: RSVP.Promise.all(promiseArray),
					seasons: RSVP.Promise.all(seasonsPrimary)
				});


			}).then(result => {
				let promiseArray = A([]),
					data = result.productSalesReports;

				seasons = result.seasons.map(ele => ele.name);

				// 获取基于周期的数据
				tmpData = data.map((productSalesReports, index) => {
					let shareData = this.eachArray(productSalesReports, 'share'),
						// goodsConfigIds = this.eachArray(productSalesReports, 'goodsConfig.id'),
						goodsConfigIds = productSalesReports.map(ele => ele.get('goodsConfig')),
						productNames = this.eachArray(productSalesReports, 'productName');

					// promiseArray = goodsConfigIds.map(ele => ele.get('go'));
					promiseArray = goodsConfigIds;

					return {
						date: seasons[index],
						shareData,
						goodsConfigIds,
						productNames
					};
				});

				return RSVP.Promise.all(promiseArray);
			}).then(data => {
				let promiseArray = data.map(ele => {
					return ele.get('productConfig');
				});

				return RSVP.Promise.all(promiseArray);
			}).then(data => {

				let promiseArray = data.map(ele => {
					return ele.get('product');
				});

				return RSVP.Promise.all(promiseArray);
			}).then(data => {
				// 拼装基于产品的数据
				let lineData = data.map((gc, index) => {

					return {
						name: data[index].name,
						date: seasons,
						data: tmpData.map(item => item.shareData[index])
					};
				});

				return hash({
					goodsConfigs,
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
