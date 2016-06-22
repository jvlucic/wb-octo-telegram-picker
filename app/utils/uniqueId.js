let idCount = 0;
export default function (id = '') {
  const uniqueId = `${id}-${idCount}`;
  idCount = idCount + 1;
  return uniqueId;
}
