export const safeGsap = (method, targets, vars, position = null) => {
  console.log('a', targets, targets instanceof Array);
  if (targets instanceof Array) {
    const filteredTargets = targets.filter((e) => e);
    return method(filteredTargets, vars, position);
  } else if (targets !== null) return method(targets, vars, position);
  return null;
};
