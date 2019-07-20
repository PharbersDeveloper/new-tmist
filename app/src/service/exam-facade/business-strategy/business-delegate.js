import Object from "@ember/object"

export default Object.extend({
    currentProposal: null,
    store: null,
    init( aProposal ) {
        this._super(...arguments)
        this.set("currentProposal", aProposal)
    },
    async getBusinessAnswerCount() {
        return this.currentProposal.then(x => {
            return x.targets.length
        })
    },
    async genBusinessOperatorAnswer(answers) {
        return this.currentProposal.then(x => {
            if (answers.length === this.getBusinessAnswerCount()) {
                // answers.map(answer => )
                return null
            } else {
                const ids= x.targets.map(x => x.id)
                return Promise.all(ids.map(id => 
                    this.store.findRecord("model/hospital", id)))
                    .then(hospitals => {
                        return hospitals.map(hospital => {
                            this.store.createRecord("model/answer", {
                                category: "Business",
                                target: hospital
                            })
                        })
                    })
            }
        })
    }
})