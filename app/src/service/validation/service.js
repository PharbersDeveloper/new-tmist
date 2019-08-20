import Service from '@ember/service';
import { A } from '@ember/array';

export default Service.extend({
    validataions: A([]),
    proposal: null,
    answers: A([]),
    oldValue: null,
    createValidatePattern(proposal, validataions) {
        this.validataions = validataions
        this.proposal = proposal
        // this.answers = answers
    },
    setValidateAnswers(answers) {
        answers.then(x => {
            this.set("answers", x)
        })
    },
    actions: {
        runValidate(answer, prop) {
            console.log(answer)
        },
        setOldValue(v) {
            this.set("oldValue", v)
        }
    }
});
