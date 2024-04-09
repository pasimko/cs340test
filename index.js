import express from "express";
import mysql from "mysql2/promise";

import https from 'https';
import fs from 'fs';

async function main() {
    console.log("Starting backend!");

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    const query = `
    DROP TABLE IF EXISTS diagnostic;
    CREATE TABLE diagnostic(id INT PRIMARY KEY, text VARCHAR(255) NOT NULL);
    INSERT INTO diagnostic (text) VALUES ("MySQL is working for simkop");
    `
    await connection.execute(query);

    console.log("Test Query Result:", rows);

    // create express server
    const app = express();

    app.get("/", async (req, res) => {
        const dbres = await connection.execute(testQuery);
        res.send(base + JSON.stringify(dbres));
    });

    // listen on port 8000

    if (process.env.IS_PROD === "true") {
        if (typeof process.env.CERT_PATH === 'undefined') {
            throw new Error('CERT_PATH environment variable is not set.');
        }
        const privateKey = fs.readFileSync(path.join(process.env.CERT_PATH, "privkey.pem"), "utf8");
        const certificate = fs.readFileSync(path.join(process.env.CERT_PATH, "fullchain.pem"), "utf8");

        const credentials = { key: privateKey, cert: certificate };

        const httpsServer = https.createServer(credentials, app);

        httpsServer.listen(443, () => {
            console.log('HTTPS server running on port 443');
        });
        // redirect HTTP server
        const httpApp = express();
        httpApp.all('*', (req, res) => res.redirect(['https://', req.get('Host'), req.url].join('')));
        httpApp.listen(80, () => console.log(`HTTP redirect server listening`));
    } else {
        app.listen(8000, () => {
            console.log('HTTP server running on port 80');
        });
    }
}

main().catch(console.error);
