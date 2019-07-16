import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';

export default Route.extend({

	model() {
		const pageScenarioModel = this.modelFor('page-scenario'),
			salesConfigs = pageScenarioModel.salesConfigs,
			lastSeasonHospitalSalesReports = pageScenarioModel.lastSeasonHospitalSalesReports;

		let businessModel = this.modelFor('page-scenario.business'),
			managerinput = pageScenarioModel.managerInput,
			representativeinputs = pageScenarioModel.representativeInputs,
			businessinputs = businessModel.businessInputs,
			tableData = A([]);

		tableData = A([
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
		return hash({
			tableData,
			managerinput,
			businessinputs,
			representativeinputs,
			salesConfigs
			// goodsConfigs: pageScenarioModel.goodsConfigs.filter(ele => ele.get('productConfig.productType') === 0)
		});

	},
	setupController(controller) {
		this._super(...arguments);
		controller.set('groupValue', 0);
		controller.set('tmpSr', A([]));
	}
});
