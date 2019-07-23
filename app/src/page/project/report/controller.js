import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        toResult() {
            this.transitionToRoute('page.project.result')
        }
    }
});
