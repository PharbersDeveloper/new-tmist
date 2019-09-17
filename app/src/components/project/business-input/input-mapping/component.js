import Component from "@ember/component"
import groupBy from "ember-group-by"
import { computed } from "@ember/object"
import sortBy from 'ember-computed-sortby'
// import { inject as service } from "@ember/service"
// import { A } from "@ember/array"

export default Component.extend( {
	classNames: "input-mapping",
	// localClassNameBindings: A( ["input-mapping"] ),
	positionalParams: ["project", "presets", "answers", "reports", "curRegion", "presetsByProject", "period"],
	p: groupBy( "presets" , "hospital.id" ),
	regionAns: computed( "curRegion", function() {
		let region = 0

		if ( this.curRegion === 1 ) {
			region = "会东市"
		} else if ( this.curRegion === 2 ) {
			region = "会西市"
		} else if ( this.curRegion === 3 ) {
			region = "会南市"
		}

		if ( region === 0 ) {
			return this.res
		} else {

			// return this.res.filter( a => a.quizs.get( "firstObjetct.answer.target.position" ) === region )
			return this.res.filter( a => a.quizs.get( "firstObject" ).region === region )

			// return this.res.filter( a => a.answer.get( "firstObjetct.target.position" ) === region )
		}

	} ),
	st: computed( "p", function() {
		if ( this.p && this.answers ) {
			return this.p.map( item => { 
				const ss = item.items.map ( x => x.currentPatientNum )
				const si = item.items.sort((left, right) => { 
					const fl = right.currentPatientNum - left.currentPatientNum 
					return fl === 0 ? right.lastSales - left.lastSales : fl
				} )
				item["pat"] = ss.reduce((accumulator, currentValue) => accumulator + currentValue)
				item["items"] = si
				return item
			} )
		}
	} ),
	sst: sortBy("st", "pat:desc"),
	res: computed( "sst", "answers", function() {
		if ( this.sst && this.answers ) {

			return this.sst.map( item => {
				const result = item.items.map( preset => {
					const tmp = this.answers.find( ans => {
						const ts = ans.belongsTo( "target" ).id() === preset.belongsTo( "hospital" ).id(),
							ps = ans.belongsTo( "product" ).id() === preset.belongsTo( "product" ).id(),
							bs = ans.get( "category" ) === "Business"

						// window.console.log( ans.get( "target.position" ) )

						return ts && ps && bs
					} )

					// let report = this.reports.filter( r => r.get( "hospital.id" ) === tmp.get( "target.id" ) && r.get( "product.id" ) === tmp.get( "product.id" ) ).get( "firstObject" )

					// return { preset: preset, answer: tmp , report: report , region: tmp.get( "target.position" )}

					// tmp.set( "resource", preset.resource )

					return { preset: preset, answer: tmp , region: tmp.get( "target.position" ) }
				} )

				return result ? { hospital: result.get( "firstObject.answer.target" ), quizs: result } : {}
			} )
		} else {
			return []
		}
	} )
} )
