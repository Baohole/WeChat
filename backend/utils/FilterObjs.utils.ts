export const filterObj = (obj: Record<string, any>, ...allowedFields: string[]): Record<string, any> => {
  const newObj: Record<string, any> = {};  // Define newObj with a precise type
  Object.keys(obj).forEach((e) => {
    if (allowedFields.includes(e)) newObj[e] = obj[e];
  });
  return newObj;
};