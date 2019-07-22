import Component from "@ember/component"
import groupBy from "ember-group-by"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"

export default Component.extend({
    positionalParams: ["project", "exam"],
    store: service(),
    didInsertElement() {
        debugger
        const proposal = this.project.belongsTo("proposal")
        proposal.load().then(p => {
            const pts = p.hasMany("presets")
            const ids = pts.ids()
            const fid = ids.map ( x => {
                return "`" + `${x}` + "`"
            }).join(",")
            this.store.query("model/preset", { filter: "(id,:in,"+ "[" + fid + "]" + ")"}).then( presets => {
                this.set("presets", presets)
            })
        })
    },
    willDestroyElement() {
        this.reopen({
            p: null
        })
    },
    presets: null,
    p: groupBy("presets", "hospital.id"),
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
