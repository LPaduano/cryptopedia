import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://lpaduanosviluppo:fv7boN1wapFyCBva@cluster0.ehsjxlj.mongodb.net/myDatabaseName?retryWrites=true&w=majority";
const options = {};

// Usa una dichiarazione globale sicura per evitare problemi in dev con hot-reload
declare global {
  // For dev only - next.js ricarica a caldo i moduli e dobbiamo evitare più connessioni
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Inizializzazione della variabile clientPromise
const clientPromise: Promise<MongoClient> =
  global._mongoClientPromise ||
  (async () => {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
    return global._mongoClientPromise;
  })();

export default clientPromise;
