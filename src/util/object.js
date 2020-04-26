export function keepOnly(obj, props) {
  if (!obj) {
    return obj;
  }
  const newObj = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (props.includes(key)) {
      newObj[key] = value;
    }
  });
  return newObj;
}

export function changed(left, right) {
  return left !== right && (!!left || !!right);
}
