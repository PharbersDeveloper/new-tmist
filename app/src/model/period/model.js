import DS from 'ember-data';

export default DS.Model.extend({
    answers: DS.hasMany("model/answer")
});
