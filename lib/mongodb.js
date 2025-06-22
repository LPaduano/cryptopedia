import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://lpaduanosviluppo:fv7boN1wapFyCBva@cluster0.ehsjxlj.mongodb.net/myDatabaseName?retryWrites=true&w=majority";
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
