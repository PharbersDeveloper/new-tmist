import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        toHistory() {
            this.transitionToRoute("page.history")
        }
    }
});
