import Component from "@ember/component"
import { A } from "@ember/array"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"

export default Component.extend( {
	positionalParams: ["project", "period"],
	facade: service( "service/exam-facade" ),
	store: service(),
	currentName: computed("products", function() {
		const cur = this.products.find( x => x.productType === 0)
		return cur ? cur.name : ""
	} ),
	hospitals: computed("project.proposal", function() {
		const prs = this.project.belongsTo("proposal")
		prs.load().then( x => {
			const ids = x.hasMany("targets").ids()
			const hids = ids.map( x => {
				return "`" + `${x}` + "`"
			} ).join( "," )
			this.store.query("model/hospital", { filter: "(id,:in," + "[" + hids + "]" + ")"} ).then( hids => {
				this.set("hospitals", hids)
			} )
		})
		return []
	}),
	products: computed("project.proposal", function() {
		const prs = this.project.belongsTo("proposal")
		prs.load().then( x => {
			const ids = x.hasMany("products").ids()
			const hids = ids.map( x => {
				return "`" + `${x}` + "`"
			} ).join( "," )
			this.store.query("model/product", { filter: "(id,:in," + "[" + hids + "]" + ")"} ).then( hids => {
				this.set("products", hids)
			} )
		})
		return []
	}),
	resources: computed("project.proposal", function() {
		const prs = this.project.belongsTo("proposal")
		prs.load().then( x => {
			const ids = x.hasMany("resources").ids()
			const hids = ids.map( x => {
				return "`" + `${x}` + "`"
			} ).join( "," )
			this.store.query("model/resource", { filter: "(id,:in," + "[" + hids + "]" + ")"} ).then( hids => {
				this.set("resources", hids)
			} )
		})
		return []
	}),

	didInsertElement() {
		this.facade.startPeriodBusinessExam( this.project, this.period )
	},
	willDestroyElement() {
		this.facade.bs.clearPeriodBusinessExam()
	},
	// 设置一些默认值
	hospitalState: A( [
		{ name: "全部", state: 0 },
		{ name: "待分配", state: 1 },
		{ name: "已分配", state: 2 }
	] )
} )
