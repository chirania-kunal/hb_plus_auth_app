const { beforeUserCreated, beforeUserSignedIn } = require('firebase-functions/v2/identity');
const { HttpsError } = require('firebase-functions/v2/https');

function assertOfficialAccount(event) {
  const email = (event.data.email || '').trim().toLowerCase();
  const isAllowed = /^[^@]+@hbplus\.fit$/.test(email);
  const isVerified = event.data.emailVerified === true;
  if (!isAllowed || !isVerified) {
    throw new HttpsError('permission-denied', 'Access restricted. Please login using your official domain email.');
  }
}

// Server-side enforcement on both account creation and subsequent sign-ins.
exports.restrictSignupToHbplus = beforeUserCreated(assertOfficialAccount);
exports.restrictSignInToHbplus = beforeUserSignedIn(assertOfficialAccount);
