import Service from '@ember/service';
import { inject as service } from "@ember/service"
import businessDelegate from './business-delegate';

/**
 * copy and swap
 */
export default Service.extend({
    currentAnswers: null,
    operationAnswers: null,
    currentPeriod: null,
    store: service(),
    delegate: null,
    startPeriodBusinessExam(aProject, aPeriod) {
        const ids = aPeriod.answers.map(x => x.id)
        Promise.all(ids.map(id => {
            return this.store.find("model/answer", id)
        })).then(answers => {
            this.set("currentPeriod", aPeriod)
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
    answersLoaded: async function() {
        if (this.currentAnswers !== null && this.currentAnswers.length === 0) {
            let tmp = await this.delegate.genBusinessOperatorAnswer(this.currentAnswers, this.currentPeriod)
            this.set("operationAnswers", tmp)
        } else {
            // TODO: query all current answer and clone every answer
        }
    }.observes("currentAnswers").on("init")
});
