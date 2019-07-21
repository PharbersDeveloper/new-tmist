import Object from "@ember/object"

export default Object.extend({
    currentProposal: null,
    store: null,
    init( aProposal ) {
        this._super(...arguments)
        this.set("currentProposal", aProposal)
    },
    async getPresetsWithCurrentPeriod( aPeriod ) {
        return aPeriod.last.then( x => { 
                x.presets
        } ).catch(err => {
            return this.currentProposal.then( x => {
                return x.presets
            } )
        } )
    },
    async getBusinessAnswerCount(aPeriod) {
        return this.getPresetsWithCurrentPeriod(aPeriod).then(x => {
            return x.length
        })
    },
    async genBusinessOperatorAnswer(answers, aPeriod) {
        let count = await this.getBusinessAnswerCount(aPeriod)
        return await this.getPresetsWithCurrentPeriod(aPeriod).then(lst => {
            const ids= lst.map(x => x.id)
            console.log(ids.length)
            return Promise.all(ids.map(id => 
                    this.store.findRecord("model/preset", id)))
        }).then(presets=> {
            if (answers.length === count) {
                return presets.map( preset => {
                    return this.store.createRecord("model/answer", {
                        category: "Business",
                        target: preset.hospital,
                        product: preset.product
                    })
                } )
            } else {
                return presets.map( preset => {
                    return this.store.createRecord("model/answer", {
                        category: "Business",
                        target: preset.hospital,
                        product: preset.product
                    })
                } )
            }
        })
    }
})