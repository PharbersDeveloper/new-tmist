import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr("string"),
    answers: DS.hasMany("model/answer")
});
