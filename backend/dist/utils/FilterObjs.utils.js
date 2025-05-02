"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterObj = void 0;
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((e) => {
        if (allowedFields.includes(e))
            newObj[e] = obj[e];
    });
    return newObj;
};
exports.filterObj = filterObj;
//# sourceMappingURL=FilterObjs.utils.js.map