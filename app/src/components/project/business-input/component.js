import Component from "@ember/component"
import { A } from "@ember/array"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"

export default Component.extend( {
	positionalParams: ["project", "period"],
	facade: service("service/exam-facade"),
	currentName: computed( "project", function() {
		this.project.proposal.then( x =>
			x.products.then( y => y.filter( z => z.productType === 0 ) ) )
			.then( f => this.set( "currentName", f.firstObject.name ) )
	} ),
	didInsertElement() {
		this.facade.startPeriodBusinessExam(this.project, this.period)
	},
	// 设置一些默认值
	hospitalState: A( [
		{ name: "全部", state: 0 },
		{ name: "待分配", state: 1 },
		{ name: "已分配", state: 2 }
	] )
} )
