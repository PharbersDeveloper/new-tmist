import Route from '@ember/routing/route';

export default Route.extend({

	model() {
		let proposalId = this.modelFor('page-scenario').proposal.get('id'),
			store = this.get('store'),
			paper = store.peekAll('paper').get('lastObject');


		console.log(proposalId);
		console.log(paper);
		console.log(paper.id);


	}
});
