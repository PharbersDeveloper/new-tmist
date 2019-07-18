import DS from "ember-data"

export default DS.Model.extend( {
	name: DS.attr( "string" ),
	general: DS.attr( "string" ),
	avatar: DS.attr( "string" ),
	productCategory: DS.attr( "string" ),
	medicareCategory: DS.attr( "string" ),
	producer: DS.attr( "string" ),
	safety: DS.attr("string"),
	effectiveness: DS.attr("string"),
	convenience: DS.attr("string"),
	productType: DS.attr("string"),
	priceType: DS.attr("string"),
	price: DS.attr("number"),
	cost: DS.attr("number"),
	launchDate: DS.attr("number"),
	treatmentArea: DS.attr("string"),
	feature: DS.attr("string"),
	targetDepartment: DS.attr("string"),
	feature: DS.attr("string"),
	targetDepartment: DS.attr("string"),
	patentDescribe: DS.attr("string"),
	costEffective: DS.attr("string"),
	lifeCycle: DS.attr("string")
} )
