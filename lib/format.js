export const eur = c => '€ ' + (c / 100).toFixed(c % 100 ? 2 : 0).replace('.', ',') + (c % 100 ? '' : ',-');
export const eur2 = c => '€ ' + (c / 100).toFixed(2).replace('.', ',');
