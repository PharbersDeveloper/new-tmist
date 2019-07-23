import Route from '@ember/routing/route';

export default Route.extend({
    model() {
        const project = this.modelFor( "page.project" )
        
        return project
    }
});
