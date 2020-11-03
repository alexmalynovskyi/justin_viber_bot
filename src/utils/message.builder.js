export const messageBuilder = (pck) => {
  let str = 'Information about you delivery.';
  for (const key in pck) {
    if (key) {
      str += `\n${key}: ${pck[key]}`;
    }
  }

  return str;
}
