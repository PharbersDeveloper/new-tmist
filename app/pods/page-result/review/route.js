import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { isEmpty } from '@ember/utils';
import { A } from '@ember/array';

export default Route.extend({
	model() {
		const store = this.get('store'),
			pageScenarioModel = this.modelFor('page-scenario'),
			salesConfigs = pageScenarioModel.salesConfigs,
			lastSeasonHospitalSalesReports = pageScenarioModel.lastSeasonHospitalSalesReports,
			// paper = pageScenarioModel.paper,
			scenario = pageScenarioModel.scenario,
			businessinputs = store.peekAll('businessinput');

		let tableData = A([
			{
				hospitalName: '',
				potential: '',
				sales: '',
				representative: '',
				visitTime: '',
				salesTarget: '',
				budget: '',
				meetingPlaces: ''
			}
		]);

		tableData = businessinputs.map(ele => {
			let biHospitalId = ele.get('destConfig.hospitalConfig.hospital.id'),
				potential = 0,
				sales = 0;

			lastSeasonHospitalSalesReports.forEach(item => {
				let dataHosopitalId = item.get('destConfig.hospitalConfig.hospital.id');

				if (dataHosopitalId === biHospitalId) {
					potential = item.potential;
					sales = item.sales;
				}
			});

			return {
				hospitalName: ele.destConfig.get('hospitalConfig.hospital.name'),
				potential: potential,
				sales: sales,
				representative: isEmpty(ele.resourceConfig.get('representativeConfig.representative.name')) ? '-' : ele.resourceConfig.get('representativeConfig.representative.name'),
				visitTime: isEmpty(ele.get('visitTime')) ? '-' : ele.get('visitTime'),
				salesTarget: isEmpty(ele.get('salesTarget')) ? '-' : ele.get('salesTarget'),
				budget: isEmpty(ele.get('budget')) ? '-' : ele.get('budget'),
				meetingPlaces: isEmpty(ele.get('meetingPlaces')) ? '-' : ele.get('meetingPlaces')
			};
		});
		return RSVP.hash({
			tableData,
			salesConfigs,
			managerinput: store.peekAll('managerinput').lastObject,
			businessinputs,
			representativeinputs: store.peekAll('representativeinput'),
			goodsConfigs: store.query('goodsConfig',
				{ 'scenario-id': scenario.id })
		});
	}
});
