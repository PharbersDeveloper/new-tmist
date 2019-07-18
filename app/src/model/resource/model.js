import DS from "ember-data"

export default DS.Model.extend( {
	name: DS.attr( "string" ),
	gender: DS.attr( "number" ),
	avatar: DS.belongsTo( "model/image" ),
	age: DS.attr("number"),
    education: DS.attr("string"),
    professional: DS.attr("string"),
    advantage: DS.attr("string"),
    evaluation: DS.attr("string"),
    experience: DS.attr("string"),
    totalTime: DS.attr("number"),
    entryTime: DS.attr("number")
} )
