const functions = require("firebase-functions");
// const admin = require('firebase-admin');
//const moment = require('moment');
//moment.locale('de');

// admin.initializeApp();
// const database = admin.firestore();
// const countersRef = database.collection('ttn-message');

// let chartData = {};


// function resetData() {
//   chartData.cols = [
//       { "id": "", "label": "Monat", "pattern": "", "type": "string" },
//       { "id": "", "label": "Abfahrten", "pattern": "", "type": "number" }];
//   chartData.rows = [];
//   monthlySum = new Map();
//   for (let i = 0; i < 12; i++) {
//       monthlySum.set(i, 0);
//   }
// }

// function doRespond(statusCode, responseString, response, asJson) {
//   response.statusCode = statusCode;
//   response.setHeader('Access-Control-Allow-Origin', "*");
//   response.setHeader('Access-Control-Allow-Methods', 'GET');
//   if (asJson) {
//       response.setHeader("Content-Type", "application/json");
//   } else {
//       response.setHeader("Content-Type", "text/html");
//   }
//   response.send(responseString);
// }


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

 exports.helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
 });

//  exports.addmessage = functions.https.onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into Firestore using the Firebase Admin SDK.
//   let collection = req.query.collection;
//   if (!collection) {
//       collection = "ttn-message";
//   }

//   const writeResult = database.collection(collection).add({original: original});
  
//   // Send back a message that we've successfully written the message
//   res.json({result: `Message with ID: ${writeResult.id} added.`});
// });
 
//  exports.addmessage = functions.https.onRequest((request, response) => {
//   functions.logger.info("From addmessage!", {structuredData: true});
//   resetData();
//   let queryTime = request.query.timestamp;
//   // Grab the text parameter.
//   const original = request.query.text;

//   let collection = request.query.collection;
//     if (!collection) {
//         collection = "ttn-message";
//     }

//   const countersRef = database.collection(collection);
//   let now = new Date();
//   let start = now.startOf('year').format("YYYY-MM-DD");
//   let end = now.endOf('year').format("YYYY-MM-DD");
//   if (queryTime) {
//       start = (new Date(queryTime)).startOf('year').format("YYYY-MM-DD");
//       end = (new Date(queryTime)).endOf('year').format("YYYY-MM-DD");
//   }

//   let query = countersRef
//   .where('timestamp', '>=', start)
//   .where('timestamp', '<=', end + "T23:59:59")
//   .orderBy("timestamp", "asc").get()
//   .then(snapshot => {
//       if (snapshot.empty) {
//           doRespond(404, "<h1>No matching documents.</h1>", response);
//       }

//       snapshot.forEach(doc => {
//           let data = doc.data();
//           let time = new Date(Date.parse(data.timestamp));
//           let sum = monthlySum.get(time.getMonth());
//           sum = sum + parseInt(data.counter);
//           monthlySum.set(time.getMonth(), sum);
//       });

//       // eslint-disable-next-line promise/always-return
//       for (let i = 0; i < 12; i++) {
//         let date = new Date(new Date().setMonth(i));
//         //const month = date.toLocaleString('de', { month: 'long' });
//         const month = date.format("MMMM");
//         const sum = monthlySum.get(i);
//         let row = (`{"c":[{"v":"${month}","f":null},{"v":${sum},"f":null}]}`);
//         chartData.rows.push(JSON.parse(row));
//       }

//       doRespond(200, JSON.stringify(chartData), response, true);
//   })
//   .catch(err => {
//       doRespond(500, "<h1>Error getting documents</h1>", response);
//   });

//   response.send("Confirmed from Firebase!");


//});