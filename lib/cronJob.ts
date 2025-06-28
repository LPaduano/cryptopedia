import { saveCryptoToDb } from "./saveCryptoToDb";

saveCryptoToDb();
setInterval(saveCryptoToDb, 60 * 1000);
