"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connect = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URL);
        console.log('Database connect success!');
    }
    catch (err) {
        console.log('Database connect failed!');
    }
};
exports.connect = connect;
//# sourceMappingURL=database.js.map