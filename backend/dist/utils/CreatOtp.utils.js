"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOtp = void 0;
const createOtp = (length) => {
    const string = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += string[Math.floor(Math.random() * string.length)];
    }
    return OTP;
};
exports.createOtp = createOtp;
//# sourceMappingURL=CreatOtp.utils.js.map