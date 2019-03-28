import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { A } from '@ember/array';

export default Route.extend({
	model() {
		/**
		 * should ,but not
		 */
		// let store = this.get('store');

		// return hash({
		// 	businessInputs: store.peekAll('businessinput'),
		// 	destConfigs: store.peekAll('destConfig'),
		// 	goodsConfigs: store.peekAll('goodsConfig')
		// });
		/**
		 * mock data
		 */
		return hash({
			businessInputs: A([]),
			destConfigs: A([
				{ hospitalConfig: { hospital: { name: '安贞医院' }, potential: 3343, sales: 44535 } },
				{ hospitalConfig: { hospital: { name: '中日友好医院' }, potential: 47405, sales: 6818 } },
				{ hospitalConfig: { hospital: { name: '协和医院' }, potential: 45705, sales: 39764 } },
				{ hospitalConfig: { hospital: { name: '首都大学医院' }, potential: 7739, sales: 59561 } },
				{ hospitalConfig: { hospital: { name: '301医院' }, potential: 59945, sales: 32444 } },
				{ hospitalConfig: { hospital: { name: '人民医院' }, potential: 21509, sales: 27 } },
				{ hospitalConfig: { hospital: { name: '肿瘤医院' }, potential: 22370, sales: 43019 } },
				{ hospitalConfig: { hospital: { name: '天坛医院' }, potential: 45122, sales: 20029 } },
				{ hospitalConfig: { hospital: { name: '阜外医院' }, potential: 35467, sales: 37044 } },
				{ hospitalConfig: { hospital: { name: '宣武医院' }, potential: 1973, sales: 12032 } }

			]),
			goodsConfigs: A([])
		});
	}
});
