"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLoginTokens = void 0;
const TokenServ_services_1 = require("./TokenServ.services");
const generateLoginTokens = async (user, res) => {
    const access_token = await (0, TokenServ_services_1.generateToken)({ userId: user._id }, "1d", process.env.JWT_ACCESS_SECRET);
    const refresh_token = await (0, TokenServ_services_1.generateToken)({ userId: user._id }, "30d", process.env.JWT_REFRESH_SECRET);
    res.cookie("accessToken", access_token, {
        httpOnly: true,
        secure: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        priority: "high",
    });
    res.cookie("refreshToken", refresh_token, {
        httpOnly: true,
        secure: true,
        path: "/api/auth/refresh-token",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        priority: "high",
    });
    return access_token;
};
exports.generateLoginTokens = generateLoginTokens;
//# sourceMappingURL=AuthServ.services.js.map