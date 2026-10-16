export const environment = {
  // Only needed while the old Firebase service still exists; remove together with it.
  firebaseConfig: {
    apiKey: "AIzaSyAjSwXMWnY0nM40nz3pDCAKAvnoG2LG2bw",
    authDomain: "scalecloud-de.firebaseapp.com",
    databaseURL: "https://scalecloud-de-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "scalecloud-de",
    storageBucket: "scalecloud-de.appspot.com",
    messagingSenderId: "128016775020",
    appId: "1:128016775020:web:bb2b49ad68fb097980e549",
    measurementId: "G-ZRHPQGG8LB"
  },
  oidc: {
    authentikUrl: 'https://auth.scalecloud.de',
    applicationSlug: 'scalecloud',
    clientId: 'scalecloud-website',
    signupUrl: 'https://auth.scalecloud.de/if/flow/signup/',
  },
  production: true,
  appBaseUrl: 'https://www.scalecloud.de',
  apiUrl: 'https://api.scalecloud.de',
  stripePublicKey: ""
};