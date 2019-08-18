import Component from "@ember/component"
import GenerateCondition from "new-tmist/mixins/generate-condition"
import GenerateChartConfig from "new-tmist/mixins/generate-chart-config"
import { A } from "@ember/array"

export default Component.extend( GenerateCondition,GenerateChartConfig, {
	positionalParams: ["products"],
	currentProduct: 0,
	curTreatmentArea: "",
	treatmentAreaArr: A( [] ),
	getChart( curTreatmentArea ) {
		const that = this

		new Promise( function ( resolve ) {
			let	tmProdsLines = that.generateLines( "tmProdsLinesContainer","prodLines" ),
				tmProdsLinesCondition = that.generateProdCompLinesCondition( curTreatmentArea,that.periodBase,that.periodStep )

			resolve( {
				tmProdsLines, tmProdsLinesCondition
			} )
		} ).then( data => {
			this.set( "tmProdsLines", data.tmProdsLines )
			this.set( "tmProdsLinesCondition", data.tmProdsLinesCondition )
		} )
	},
	didReceiveAttrs() {
		this._super( ...arguments )

		let tmpArr = A( [] )

		tmpArr = this.products.map( ele=>ele.treatmentArea )

		this.treatmentAreaArr = Array.from( new Set( tmpArr ) )
		this.set( "curTreatmentArea", this.treatmentAreaArr[0] )
		// window.console.log( this.treatmentAreaArr )

		this.getChart( this.curTreatmentArea )

	},
	actions: {
		changeProductArea( treatmentArea ) {
			this.set( "curTreatmentArea", treatmentArea )

			this.set( "tmProdsLinesCondition", this.generateProdCompLinesCondition( treatmentArea,this.periodBase, this.periodStep ) )
		}
	}
} )
