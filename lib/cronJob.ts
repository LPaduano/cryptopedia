import { saveCryptoToDB } from "./saveCryptoToDB";

saveCryptoToDB();
setInterval(saveCryptoToDB, 60 * 1000);
