import DS from 'ember-data';

export default DS.Model.extend({
    accountId: DS.attr("string"),
    proposal: DS.belongsTo("model/proposal"),
    current: DS.attr("number"),
    pharse: DS.attr("number"),
    status: DS.attr("number"),
    lastUpdate: DS.attr("number")
});
