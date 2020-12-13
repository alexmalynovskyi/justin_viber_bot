import { localize } from './localize.util';

export const messageBuilder = (pck) => {
  let str = 'Інформація за вашу посилку.';
  for (const key in pck) {
    if (pck[key] && key) {
      const localValue = localize[key] || key;
      str += `\n${localValue}: ${pck[key]}`;
    }
  }

  return str;
}
