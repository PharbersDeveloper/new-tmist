import Route from '@ember/routing/route';
import { htmlSafe } from '@ember/template';
import { isEmpty } from '@ember/utils';
import { A } from '@ember/array';
import rsvp from 'rsvp';

export default Route.extend({
	generateTableBody(seasonData) {
		let totalData = A([]),
			ratesData = A([]),
			reportsLength = 0,
			tmpTableBody = A([]);

		seasonData.forEach((item, i) => {
			// 当前季度下的 one -> many **SalesReports()
			reportsLength = item.get('length');
			// let tmpItemData = key === 'hospital' ? item.sortBy('potential') : item;

			tmpTableBody = item.map(ele => {
				totalData.push(
					[ele.get('sales'), ele.get('salesQuota')]);
				if (seasonData.length - 1 === i) {
					ratesData.push(
						[
							(ele.get('salesGrowth') * 100).toFixed(0) + '%',
							(ele.get('quotaAchievement') * 100).toFixed(0) + '%'
						]);
				}

				return {
					goodsConfig: ele.get('goodsConfig'),
					resourceConfig: ele.get('resourceConfig'),
					destConfig: ele.get('destConfig'),
					potential: ele.get('potential')
				};
			});
		});
		tmpTableBody.map((ele, index) => {
			let seasonNum = totalData.length / reportsLength,
				tmpTableTr = [];

			tmpTableTr.push(ratesData[index]);

			for (let i = 1; i <= seasonNum; i++) {
				tmpTableTr.push(totalData[index + (i - 1) * reportsLength][0]);
			}
			for (let i = 1; i <= seasonNum; i++) {
				tmpTableTr.push(totalData[index + (i - 1) * reportsLength][1]);
			}
			// ele.tableTr = tmpTableTr.flat();
			ele.tableTr = tmpTableTr.reduce((acc, value) => acc.concat(value), []);


			return ele;
		});
		return tmpTableBody;
	},
	generatePromiseArray(reports, key) {
		let promiseArray = A([]);

		promiseArray = reports.map(ele => {
			return ele.get(key);
		});
		return promiseArray;
	},
	seasonQ(seasonText) {
		let season = isEmpty(seasonText) ? '' : seasonText;

		if (season === '') {
			return season;
		}
		season = season.replace('第一季度', 'Q1');
		season = season.replace('第二季度', 'Q2');
		season = season.replace('第三季度', 'Q3');
		season = season.replace('第四季度', 'Q4');

		return season;
	},
	model() {
		let pageScenarioModel = this.modelFor('page-scenario'),
			paper = pageScenarioModel.paper,
			increaseSalesReports = A([]),
			tmpHead = A([]),
			productSalesReports = A([]),
			representativeSalesReports = A([]),
			hospitalSalesReports = A([]),
			tableHead = A([]),
			prodTableBody = A([]),
			repTableBody = A([]),
			hospTableBody = A([]),
			tmpSalesReport = A([]);

		// 拼接 产品销售报告数据
		return paper.get('salesReports')
			.then(data => {
				let promiseArray = A([]);

				increaseSalesReports = data.sortBy('time');
				increaseSalesReports.forEach((ele, index) => {
					if (index < 4) {
						tmpSalesReport.push(ele);
					}
				});
				if (increaseSalesReports.length >= 5) {
					tmpSalesReport.push(increaseSalesReports.get('lastObject'));
				}
				promiseArray = tmpSalesReport.map(ele => {
					return ele.get('scenario');
				});
				return rsvp.Promise.all(promiseArray);
			}).then(data => {
				let promiseArray = A([]),
					seasonQ = '';

				tmpHead = data.map(ele => {
					let name = ele.get('name');

					return name.slice(0, 4) + name.slice(-4);
				});
				seasonQ = this.seasonQ(tmpHead.lastObject);
				tableHead.push(htmlSafe(`销售增长率<br>${seasonQ}`));
				tableHead.push(htmlSafe(`指标达成率<br>${seasonQ}`));
				tmpHead.forEach(ele => {
					seasonQ = this.seasonQ(ele);
					tableHead.push(htmlSafe(`销售额<br>${seasonQ}`));
				});
				tmpHead.forEach(ele => {
					seasonQ = this.seasonQ(ele);
					tableHead.push(htmlSafe(`销售指标<br>${seasonQ}`));
				});

				promiseArray = this.generatePromiseArray(tmpSalesReport, 'productSalesReports');
				return rsvp.Promise.all(promiseArray);
			}).then(data => {
				// data 代表两个时期
				productSalesReports = data[0];

				prodTableBody = this.generateTableBody(data);

				return null;
			}).then(() => {
				//	获取代表销售报告
				let promiseArray = this.generatePromiseArray(tmpSalesReport, 'representativeSalesReports');

				return rsvp.Promise.all(promiseArray);
			}).then(data => {
				//	拼接代表销售报告
				representativeSalesReports = data[0];

				repTableBody = this.generateTableBody(data);
				return null;
			}).then(() => {
				//	获取医院销售报告
				let promiseArray = this.generatePromiseArray(tmpSalesReport, 'hospitalSalesReports');

				return rsvp.Promise.all(promiseArray);
			}).then(data => {
				//	拼接医院销售报告
				hospitalSalesReports = data[0];
				let increasePotential = data.map(ele => {
					return ele.sortBy('potential').reverse();
				});

				hospTableBody = this.generateTableBody(increasePotential, 'hospital');
				return null;
			})
			.then(() => {
				return rsvp.hash({
					// 任一周期下的产品是相同的
					productSalesReports,
					representativeSalesReports,
					hospitalSalesReports,
					tableHead,
					prodTableBody,
					repTableBody,
					hospTableBody
				});
			});
	}
});
