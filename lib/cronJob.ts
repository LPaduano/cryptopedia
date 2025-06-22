import { saveCryptoToDB } from "./saveCryptoToDB.js";

saveCryptoToDB();
setInterval(saveCryptoToDB, 60 * 1000);
