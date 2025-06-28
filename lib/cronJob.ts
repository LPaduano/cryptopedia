import { saveCryptoToDB } from "./saveCryptoToDb";

saveCryptoToDB();
setInterval(saveCryptoToDB, 60 * 1000);
