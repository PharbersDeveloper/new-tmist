import Route from '@ember/routing/route';
import { A } from '@ember/array';
import { hash } from 'rsvp';

export default Route.extend({
	model() {
		let totalConfig = this.modelFor('page-scenario.reference'),
			lineDataTm = A([{
				name: 'dataA',
				date: ['2018年第一季度', '2018年第二季度', '2018年第三季度', '2018年第四季度'],
				data: [320, 332, 301, 334]
			},
			{
				name: 'DataB',
				date: ['2018年第一季度', '2018年第二季度', '2018年第三季度', '2018年第四季度'],
				data: [820, 932, 901, 934]
			},
			{
				name: 'DataC',
				date: ['2018年第一季度', '2018年第二季度', '2018年第三季度', '2018年第四季度'],
				data: [420, 555, 509, 364]
			},
			{
				name: 'DataD',
				date: ['2018年第一季度', '2018年第二季度', '2018年第三季度', '2018年第四季度'],
				data: [470, 439, 117, 769]
			}]),
			lineColorTm = A(['#57D9A3', '#79E2F2', '#FFE380', '#8777D9 ']);

		return hash({
			goodsConfigs: totalConfig.goodsConfigs,
			lineDataTm,
			lineColorTm
		});
	}
});
