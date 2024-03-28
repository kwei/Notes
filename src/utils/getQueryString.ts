export function getQueryString(queryList: string[], t: string) {
  const result = queryList.filter(
    (queryString) => queryString.split("=")[0] === t,
  )[0];
  if (result) return result.split("=")[1];
  else return null;
}
