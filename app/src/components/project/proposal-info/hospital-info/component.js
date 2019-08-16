import Component from "@ember/component"
import groupBy from "ember-group-by"
import { computed } from "@ember/object"
import { A } from "@ember/array"

export default Component.extend( {
	positionalParams: ["hospitals", "reports", "proposal"],
	currentHospital: 0,
	regions: groupBy( "hospitals", "position" ),
	table: computed("regions", function(){
		return this.regions.map ( rg => {
			const name = rg.value
			const ct = this.cities.find(x => x.name === name)
			return {
				name: ct.name,
				level: ct.level,
				type: ct.type,
				local: ct.local,
				outter: ct.outter,
				t3: rg.items.filter(x => x.get("level") === "三级").length,
				t2: rg.items.filter(x => x.get("level") === "二级").length,
				t1: rg.items.filter(x => x.get("level") === "一级").length,
				count: rg.items.length
			}
		})
	}),
	cities: A([
		{
			name: "会东市",
			level: "地级市",
			type: "核心城市",
			local: 0.27,
			outter: 0.63
		},
		{
			name: "会南市",
			level: "地级市",
			level: "地级市",
			type: "外围城市",
			local: 0.45,
			outter: 0.55
		},
		{
			name: "会西市",
			level: "地级市",
			level: "地级市",
			type: "外围城市",
			local: 0.58,
			outter: 0.42
		},
	])
} )
