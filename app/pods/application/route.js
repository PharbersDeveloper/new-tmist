import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	cookies: service(),
	model() {
		let cookies = this.get('cookies'),
			scenarios = this.get('store').query('scenario',
				{
					'porposal-id': '5c7ce8b1421aa9907926eb71'
				});

		cookies.write('token', '46fa418a3ec8ec32cd8662a589f3b403');

		return scenarios.then(data => {
			/**
			 * 应该获取到最新的，但是最新的没有数据
			 * 最新的scenario会在做完“题目”，生成报告后更新 Alex留
			 */
			return data.sortBy('phase').get('lastObject');
		});
	}
});
