import Component from "@ember/component"
import { A } from "@ember/array"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"

export default Component.extend( {
	positionalParams: ["project", "period", "hospitals", "products", "resources"],
	facade: service( "service/exam-facade" ),
	store: service(),
	currentName: computed( "products", function() {
		const cur = this.get("products").find( x => x.productType === 0 )
		return cur ? cur.name : ""
	} ),
	didInsertElement() {
		this.facade.startPeriodBusinessExam( this.project, this.period )
	},
	willDestroyElement() {
		this.facade.clearPeriodBusinessExam()
	},
	// 设置一些默认值
	hospitalState: A( [
		{ name: "全部", state: 0 },
		{ name: "待分配", state: 1 },
		{ name: "已分配", state: 2 }
	] )
} )
