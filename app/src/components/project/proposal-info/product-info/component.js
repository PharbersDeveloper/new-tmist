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

		// new Promise( function ( resolve ) {
		let	tmProdsLines = that.generateLines( "tmProdsLinesContainer","prodLines" ),
			tmProdsLinesCondition = that.generateProdCompLinesCondition( curTreatmentArea,that.periodBase,that.periodStep )

		this.set( "tmProdsLines", tmProdsLines )
		this.set( "tmProdsLinesCondition", tmProdsLinesCondition )
	},
	didReceiveAttrs() {
		this._super( ...arguments )

		let tmpArr = A( [] )

		tmpArr = this.products.map( ele=>ele.treatmentArea )

		this.treatmentAreaArr = Array.from( new Set( tmpArr ) )
		this.set( "curTreatmentArea", this.treatmentAreaArr[0] )
		// window.console.log( this.treatmentAreaArr )
		// this.set( "currentProduct", this.products )

		this.getChart( this.curTreatmentArea )

	},
	actions: {
		changeProductArea( treatmentArea ) {
			this.set( "curTreatmentArea", treatmentArea )
			for ( let index = 0; index < this.products.length; index++ ) {
				if ( this.curTreatmentArea === this.products.objectAt( index ).treatmentArea ) {
					this.set( "currentProduct", index )
					break
				}
			}
			this.set( "tmProdsLinesCondition", this.generateProdCompLinesCondition( treatmentArea,this.periodBase, this.periodStep ) )
		}
	}
} )
