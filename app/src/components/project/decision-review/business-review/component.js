import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"
import { inject as service } from "@ember/service"

export default Component.extend( {
	store: service(),
	positionalParams: ["proposol", "project", "hospitals", "resources", "products", "answers", "period"],
	classNames: ["business-review-wrapper"],
	flag: false,
	curProd: computed( function () {
		return { name: "全部" }
	} ),
	curRes: computed( function () {
		return { name: "全部" }
	} ),
	productList: computed( "products", function () {
		let arr = []

		this.products.forEach( x => {
			arr.push( x )
		} )
		arr.unshift( { name: "全部" } )

		return A( arr )
	} ),
	resourcesList: computed( "resources", function () {
		let arr = []

		this.resources.forEach( x => {
			arr.push( x )
		} )
		arr.unshift( { name: "全部" } )

		return A( arr )
	} ),
	periodsName: computed( "project", function () {
		let name = []

		this.project.periods.forEach( x => {
			name.push( x.name )
		} )
		return A( name )
	} ),
	periodRange: computed( "periodLength", function () {
		return Array( this.periodLength ).fill().map( ( e, i ) => i )
	} ),
	periodLength: computed( "project", function () {
		return this.project.periods.length
	} ),
	curPeriodIndex: computed( "project", function () {
		return this.project.periods.length - 1
	} ),
	curPeriod: computed( "curPeriodIndex", function () {
		return this.project.periods.objectAt( this.curPeriodIndex )
	} ),

	curAnswers: computed( "curPeriod", function () {
		if ( this.curPeriod.phase === this.period.phase ) {
			return this.answers
		} else {
			const ids = this.project.periods.objectAt( this.curPeriodIndex ).hasMany( "answers" ).ids(),
				hids = ids.map( x => {
					return "`" + `${x}` + "`"
				} ).join( "," )

			this.toggleProperty( "flag" )
			return this.store.query( "model/answer", { filter: "(id,:in," + "[" + hids + "]" + ")" } )

			// const condi01 = "(proposalId,:eq,`" + x.id + "`)"
			// const condi02 = "(phase,:eq,-1)"
			// const condi = "(:and," + condi01 + "," + condi02 + ")"
			// return this.store.query("model/answer", { filter: condi})
			// return []
		}
	} ),
	filterAnswers: computed( "curAnswers", "curProd", "curRes", "flag", function () {
		let result = this.curAnswers.filter( x => x.category === "Business" )

		if ( this.curProd ) {
			if ( this.curProd.name !== "全部" ) {
				// result = result
				result = result.filter( x => x.get( "product.id" ) === this.curProd.get( "id" ) )
			}
		}

		if ( this.curRes ) {
			if ( this.curRes.name !== "全部" ) {
				// result = result
				result = result.filter( x => x.resource.get( "id" ) === this.curRes.get( "id" ) )
			}
		}
		return result
	} )
} )
