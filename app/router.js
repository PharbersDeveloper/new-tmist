import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function () {
    this.route('page-scenario', { path: 'scenario' }, function () {
        // eslint-disable-next-line max-nested-callbacks
        this.route('business', function () {
            //   this.route('hospital', { path: 'hospital/:hospital_id' });
            this.route('hospital-config', { path: 'hospital/:config_id' });
        });
        this.route('management');
        this.route('reference');
    });
    this.route('page-proposal', { path: 'proposal' });
});

export default Router;
