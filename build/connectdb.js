"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("./dbConfig"));
const mysql2_1 = __importDefault(require("mysql2"));
// Application Setup
exports.default = mysql2_1.default.createConnection({
    host: dbConfig_1.default.HOST,
    user: dbConfig_1.default.USER,
    password: dbConfig_1.default.PASSWORD,
    database: dbConfig_1.default.DB
});
