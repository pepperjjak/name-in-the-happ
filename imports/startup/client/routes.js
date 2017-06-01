/* eslint-disable max-len */
import React from 'react';
import { render } from 'react-dom';
import { Session } from 'meteor/session';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';

// Components
import App from '../../ui/layouts/App';
import About from '../../ui/pages/About';
import Login from '../../ui/pages/Login';
import NotFound from '../../ui/pages/NotFound';
import Signup from '../../ui/pages/Signup';
import Sections from '../../ui/pages/Sections';
// import EditSection from '../../ui/components/sections/EditSection';
// import NewSection from './../../ui/components/sections/NewSection';
// import ViewSection from '../../ui/components/sections/ViewSection';
import Presentations from '../../ui/pages/Presentations';
import WatchPresentation from '../../ui/components/presentations/WatchPresentation';
import Students from '../../ui/pages/Students';
// import NewPresentation from './../../ui/components/presentations/NewPresentation';
// import EditPresentation from './../../ui/components/presentations/EditPresentation';
// import ViewPresentation from './../../ui/components/presentations/ViewPresenation';
//

const onEnterHomePage = (nextState) => {
  Session.set('selectedPresentationId', nextState.params._id);
};

const onEnterPresentationsViewPage = (nextState) => {
  Session.set('selectedPresentationId', nextState.params._id);
};

const onLeavePresentationsViewPage = () => {
  Session.set('selectedPresentationId', undefined);
};

const onEnterSectionsViewPage = (nextState) => {
  Session.set('selectedSectionId', nextState.params._id);
};

const onLeaveSectionsViewPage = () => {
  Session.set('selectedSectionId', undefined);
};

const onEnterStudentsViewPage = (nextState) => {
  Session.set('selectedStudentId', nextState.params._id);
};

const onLeaveStudentsViewPage = () => {
  Session.set('selectedStudentId', undefined);
};

const onAuthChange = (isAuthenticated, currentPagePrivacy) => {
  const isPublicPage = currentPagePrivacy === 'unauth';
  const isPrivatePage = currentPagePrivacy === 'auth';

  // if public page and logged in - let them in
  if (isPublicPage && isAuthenticated) {
    browserHistory.replace('/sections');
  } else if (isPrivatePage && !isAuthenticated) {
    // if private page and not logged in - kick them out
    browserHistory.replace('/');
  }
};

export const globalOnEnter = (nextState) => {
  const lastRoute = nextState.routes[nextState.routes.length - 1];
  Session.set('currentPagePrivacy', lastRoute.privacy);
  // get page title
  // grab text after first `/` in URL
  const path = nextState.location.pathname.split('/')[1];
  // remove all `/` from URL
  let pageTitle = path.replace(/\//g, '').toUpperCase();
  // are we on the home page? then pageTitle is LOGIN
  if (pageTitle.length === 0) pageTitle = 'LOGIN';

  Session.set('pageTitle', pageTitle);
};

export const globalOnChange = (prevState, nextState) => {
  globalOnEnter(nextState);
};

Meteor.startup(() => {
  Session.set('selectedPresentationId', undefined);
  Session.set('selectedSectionId', undefined);
  Session.set('selectedStudentId', undefined);
  Session.set('isNavOpen', false);
  // Session.set('pageTitle', undefined);
  render(
    <Router history={browserHistory} >
      <Route onEnter={globalOnEnter} onChange={globalOnChange}>
        <Route path="/" component={App}>
          <IndexRoute name="login" component={Login} privacy="unauth" onEnter={onEnterHomePage} />
          <Route name="signup" path="/signup" component={Signup} privacy="unauth" />
          <Route name="about" path="/about" component={About} privacy="unauth" />
          <Route name="sections" path="/sections" component={Sections} privacy="auth" />
          <Route name="viewSection" path="/sections/:_id" component={Sections} privacy="auth" onEnter={onEnterSectionsViewPage} onLeave={onLeaveSectionsViewPage} />
          <Route name="presentations" path="/presentations" component={Presentations} privacy="auth" />
          <Route name="viewPresentation" path="/presentations/:_id" component={Presentations} privacy="auth" onEnter={onEnterPresentationsViewPage} onLeave={onLeavePresentationsViewPage} />
          <Route name="students" path="/students" component={Students} privacy="auth" />
          <Route name="viewStudents" path="/students/:_id" component={Students} privacy="auth" onEnter={onEnterStudentsViewPage} onLeave={onLeaveStudentsViewPage} />
          <Route name="watchPresentation" path="/presentations/:_id/watch" component={WatchPresentation} privacy="auth" />
          <Route path="*" component={NotFound} />
        </Route>
    </Route>
  </Router>,
  document.getElementById('react-root'),
  );
});

export default onAuthChange;
