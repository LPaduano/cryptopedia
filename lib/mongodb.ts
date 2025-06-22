import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://lpaduanosviluppo:fv7boN1wapFyCBva@cluster0.ehsjxlj.mongodb.net/myDatabaseName?retryWrites=true&w=majority";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!(global as any)._mongoClientPromise) {
  client = new MongoClient(uri, options);
  (global as any)._mongoClientPromise = client.connect();
}
clientPromise = (global as any)._mongoClientPromise;

export default clientPromise;
