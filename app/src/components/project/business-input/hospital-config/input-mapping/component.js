import Component from '@ember/component';
import groupBy from 'ember-group-by';
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"

export default Component.extend({
    positionalParams: ["proposal", "exam"],
    store: service(),
    p: groupBy("proposal.presets", "hospital.id"),
    res: computed( "p", "exam.bs.operationAnswers", function() {
        if (this.p && this.exam.bs.operationAnswers) {
            return this.p.sortBy("value").map(item => {
                const result = item.items.map(preset => {
                    const tmp = this.exam.bs.operationAnswers.find(ans => {
                        const ts = ans.get("target.id") === preset.get("hospital.id")
                        const ps = ans.get("product.id") === preset.get("product.id")
                        return ts && ps
                    })
                    return { preset: preset,  answer: tmp }
                })
                return { hospital: result.firstObject.answer.target, quizs: result }
            })
        } else {
            return []
        }
    })
});
