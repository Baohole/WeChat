"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const GenToken_utils_1 = require("../utils/GenToken.utils");
const generateToken = async (payload, expiresIn, secret) => {
    let token = await (0, GenToken_utils_1.sign)(payload, expiresIn, secret);
    return token;
};
exports.generateToken = generateToken;
const verifyToken = async (token, secret) => {
    let check = await (0, GenToken_utils_1.verify)(token, secret);
    return check;
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=TokenServ.services.js.map