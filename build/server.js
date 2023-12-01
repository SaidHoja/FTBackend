"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectdb_1 = __importDefault(require("./connectdb"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
app.get('/', (req, res) => {
    res.json({ "stuff": "here" });
});
app.get('/login', (req, res) => {
    connectdb_1.default.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + connectdb_1.default.threadId);
    });
    connectdb_1.default.query({
        sql: 'SELECT * FROM ‘user’',
        timeout: 40000, // 40s
    }, function (error, results, fields) {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        console.log(results[0].email);
    });
});
