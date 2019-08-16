import DS from "ember-data"

export default DS.Model.extend( {
	category: DS.attr( "enum", {
		options: [
			"Hospital",
			"Product",
			"Resource",
			"Sales"
		]} ),
	phase: DS.attr("number"),
	potential: DS.attr( "number", { defaultValue: 0 } ),
	sales: DS.attr( "number", { defaultValue: 0 } ),
	salesQuota: DS.attr( "number", { defaultValue: 0 } ),
	share: DS.attr( "number", { defaultValue: 0 } ),
	hospital: DS.belongsTo( "model/hospital", {defaultValue: null} ),
	product: DS.belongsTo( "model/product", {defaultValue: null} ),
	growth: DS.attr( "number", {defaultValue: 0} ),
	achievements: DS.attr( "number", {defaultValue: 0} )
} )
