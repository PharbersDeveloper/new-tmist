import Service from '@ember/service';
import { inject as service } from "@ember/service"
import { computed } from "@ember/object"
import businessDelegate from './business-delegate';

export default Service.extend({
    init() {
        this._super(...arguments)
        this.addObserver("currentAnswers", this, this.answersLoaded)
    },
    currentAnswers: null,
    operationAnswers: null,
    store: service(),
    delegate: null,
    startPeriodBusinessExam(aProject, aPeriod) {
        const ids = aPeriod.answers.map(x => x.id)
        Promise.all(ids.map(id => {
            return this.store.find("model/answer", id)
        })).then(answers => {
            this.set("delegate", businessDelegate.create(aProject.proposal))
            this.delegate.set("store",this.store)
            this.set("currentAnswers", answers)
        })
    },
    saveCurrentBussinessInput(aPeriod) {

    },
    resetCurrentBusinessInput(aPeriod) {

    },
    endCurrentBusinessExam() {

    },
    async answersLoaded() {
        if (this.currentAnswers.length === 0) {
            console.log("need create answers")
            console.log(await this.delegate.genBusinessOperatorAnswer(this.currentAnswers))
            // console.log(await this.delegate.getBusinessAnswerCount())
        }
    }
});
