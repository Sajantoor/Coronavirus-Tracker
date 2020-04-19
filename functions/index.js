const functions = require('firebase-functions');
const config = functions.config()

exports.getGoogleAPI = functions.https.onCall((request, response) => {
 return(config.google_maps.key);
});
