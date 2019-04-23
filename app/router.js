import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function () {
  this.route('page-scenario', { path: 'scenario/:proposal_id' }, function () {
      // eslint-disable-next-line max-nested-callbacks
      this.route('business', function () {
          this.route('hospital-config', { path: 'hospital/:config_id' });
      });
      this.route('management');
      this.route('reference', function () {
          this.route('hospital');
          this.route('member');
          this.route('sold');
          this.route('decided');
      });
      this.route('decision-review', { path: 'decision' });
  });
  this.route('page-proposal', { path: 'proposals' });
  this.route('page-result', { path: 'result' }, function () {
      this.route('index', { path: '/' });
      this.route('review');
  });
  this.route('oauth-callback');
  this.route('page-overview', { path: 'overview' });
  this.route('page-notice', { path: 'notice/:proposalId' });
  this.route('login');
});

export default Router;
