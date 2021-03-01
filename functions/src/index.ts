import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.status(400);
  response.send({nom: "toto"});
});

export const listPersons = functions.https.onRequest(
    async (request, response) => {
      functions.logger.info("List all persons", {structuredData: true});
      const readResult = await admin.firestore()
          .collection("persons")
          .listDocuments();
      const json = await Promise.all(
          readResult.map(async (it) => {
            const doc = await it.get();
            return {
              firstName: doc.get("firstName"),
              lastName: doc.get("lastName"),
            } as Person;
          }));

      response.status(200);
      response.send(json);
    });

type Person = {
  firstName: string;
  lastName: string;
}
