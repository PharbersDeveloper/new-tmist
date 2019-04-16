import Route from '@ember/routing/route';
import { A } from '@ember/array';
import RSVP, { hash } from 'rsvp';

export default Route.extend({
	model() {
		let store = this.get('store'),
			totalConfig = this.modelFor('page-scenario.reference'),
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
					});

				seasons = increaseSalesReports.map(ele => {
					return ele.get('scenario.name');
				});

				return RSVP.Promise.all(promiseArray);
			}).then(data => {
				let promiseArray = A([]);

				// 获取基于周期的数据
				tmpData = data.map((productSalesReports, index) => {
					let shareData = this.eachArray(productSalesReports, 'share'),
						goodsConfigIds = this.eachArray(productSalesReports, 'goodsConfig.id'),
						productNames = this.eachArray(productSalesReports, 'productName');

					promiseArray = goodsConfigIds.map(ele => store.findRecord('goodsConfig', ele));

					return {
						date: seasons[index],
						shareData,
						goodsConfigIds,
						productNames
					};
				});

				return RSVP.Promise.all(promiseArray);
			}).then(data => {
				// 拼装基于产品的数据
				let lineData = data.map((gc, index) => {

					// let equalGoods = goodsConfigs.filter(currentGc => gc.get('productConfig.product.id') === currentGc.get('productConfig.product.id'));

					return {
						name: tmpData.map(item => item.productNames[index])[0],
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
