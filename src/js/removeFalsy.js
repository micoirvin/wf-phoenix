export const removeFalsy = (arr) => {
  const filtered = arr.filter((e) => {
    if (!e) return false;
    if (e.length <= 0) return false;
    return true;
  });
  console.log(arr, filtered);
  return filtered;
};
