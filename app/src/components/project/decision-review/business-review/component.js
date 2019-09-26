import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"
import { inject as service } from "@ember/service"
import groupBy from "ember-group-by"
import sortBy from "ember-computed-sortby"
// import RSVP from "rsvp"

export default Component.extend( {
	store: service(),
	positionalParams: ["proposol", "project", "hospitals", "resources", "products", "answers", "period", "reports", "presetsByProject"],
	classNames: ["business-review-wrapper"],
	didInsertElement() {
		const phaseLength = this.project.periods.length

		for ( let i = 0; i < phaseLength - 1; i++ ) {
			const ids = this.project.periods.objectAt( i ).hasMany( "answers" ).ids(),
				hids = ids.map( x => {
					return "`" + `${x}` + "`"
				} ).join( "," )

			this.store.query( "model/answer", { filter: "(id,:in," + "[" + hids + "]" + ")" } ).then( x => {
				this.set( "history" + i, x )
			} )
		}
	},
	curProd: computed( function () {
		return { name: "全部" }
	} ),
	curRes: computed( function () {
		return { name: "全部" }
	} ),
	productList: computed( "products", function () {
		let arr = []

		this.products.filter( p => p.productType === 0 ).sort(
			( a,b )=> a.get( "name" ).localeCompare( b.get( "name" ), "zh" )
		).forEach( x => {
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

		arr.unshift( { name: "未分配" } )
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
		if ( ! this.curPeriod ) {
			return this.answers
		}
		if ( this.curPeriod.phase === this.period.phase ) {
			return this.answers
		} else {
			return this.get( "history" + this.curPeriodIndex )
		}
	} ),
	curPresets: computed( "curPeriodIndex", "reports", "presetsByProject",function() {
		if ( this.curPeriodIndex === 0 ) {
			return this.reports
		} else {
			return this.presetsByProject
		}
	} ),
	filterAnswers: computed( "curAnswers", "curProd", "curRes", function () {
		let result = this.curAnswers.filter( x => x.category === "Business" ).sortBy( "target.name" ),
			arr = []

		if ( this.curProd ) {
			if ( this.curProd.name !== "全部" ) {
				// result = result
				result = result.filter( x => x.get( "product.id" ) === this.curProd.get( "id" ) )
			}
		}

		if ( this.curRes ) {
			if ( this.curRes.name === "未分配" ) {

				result = result.filter( x => !x.resource.get( "id" ) )
			} else if ( this.curRes.name !== "全部" ) {
				// result = result
				result = result.filter( x => x.resource.get( "id" ) === this.curRes.get( "id" ) )
			}
		}

		result.forEach( r => {
			let report = this.curPresets.filter( x => x.get( "hospital.id" ) === r.get( "target.id" ) && x.get( "product.id" ) === r.get( "product.id" ) && x.get( "phase" ) === this.curPeriodIndex ),
				item = {}

			item.hospitalName = r.get( "target.name" )
			item.productName = r.get( "product.name" )
			item.resource = r.get( "resource.name" )
			item.salesTarget = r.get( "salesTarget" )
			item.budget = r.get( "budget" )
			item.visitTime = r.get( "visitTime" )
			item.meetingPlaces = r.get( "meetingPlaces" )
			item.lastSales = report.get( "firstObject.lastSales" )
			item.currentPatientNum = report.get( "firstObject.currentPatientNum" )
			item.currentDurgEntrance = report.get( "firstObject.currentDurgEntrance" )
			item.region = r.get( "target.spaceBelongs" )

			arr.push( item )

		} )

		return A( arr )
	} ),
	fa: groupBy( "filterAnswers", "hospitalName" ),
	sfa: computed( "fa", function() {
		if ( this.fa ) {
			return this.fa.map( item => {
				const ss = item.items.map( x => x.currentPatientNum ),
				 si = item.items.sort( ( left, right ) => {
						const fl = right.currentPatientNum - left.currentPatientNum

						return fl === 0 ? right.lastSales - left.lastSales : fl
					} )

				item["pat"] = ss.reduce( ( accumulator, currentValue ) => accumulator + currentValue )
				item["items"] = si
				return item
			} )
		}
	} ),
	ssfa: sortBy( "sfa", "pat:desc" ),
	sortedAnswers: computed( "ssfa", function() {
		if ( this.ssfa ) {
			let result = []

			this.ssfa.forEach( x => {
				if ( result.length === 0 ) {
					result = x.items
				} else {
					result = result.concat( x.items )
				}
			} )
			return result

		} else {
			return []
		}
	} ),
	reviewColumns: A( [
		{
			label: "所在城市",
			valuePath: "region",
			align: "left"
			// sortable: true,
			// width: 100
		},{
			label: "医院名称",
			valuePath: "hospitalName",
			align: "left",
			// sortable: true,
			width: 300
		},{
			label: "产品名称",
			valuePath: "productName",
			align: "left"
			// sortable: true,
			// width: 100
		},{
			label: "患者数量",
			valuePath: "currentPatientNum",
			align: "right",
			cellComponent: "common/table/format-number-thousands",
			sortable: true
			// width: 100
		},{
			label: "药品准入情况",
			valuePath: "currentDurgEntrance",
			align: "center",
			cellComponent: "common/table/drug-entrance"
			// sortable: true,
			// width: 100
		},{
			label: "代表",
			valuePath: "resource",
			align: "center",
			// sortable: true,
			width: 58
		},{
			label: "销售指标",
			valuePath: "salesTarget",
			align: "right",
			cellComponent: "common/table/format-number-thousands",
			sortable: true
			// width: 110
		},{
			label: "预算费用",
			valuePath: "budget",
			align: "right",
			cellComponent: "common/table/format-number-thousands",
			sortable: true
			// width: 110
		}
	] )
	// sortFlag: 0,
	// actions: {
	// 	sortByPatient() {
	// 		if ( this.sortFlag === 0 ) {
	// 			set( this, "sortFlag", 1 )
	// 		} else if ( this.sortFlag === 1 ) {
	// 			set( this, "sortFlag", 0 )
	// 		}
	// 	}
	// }
} )
