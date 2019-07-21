import Service from '@ember/service';
import { inject as service } from "@ember/service"
import businessDelegate from './business-delegate';

/**
 * copy and swap
 */
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
            let tmp = await this.delegate.genBusinessOperatorAnswer(this.currentAnswers)
            console.log("need create answers")
            console.log(tmp)
            this.set("operationAnswers", tmp)
        } else {
            // TODO: query all current answer and clone every answer
        }
    }
});
