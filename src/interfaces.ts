export interface Drug {
  id: number;
  tradename: string;
  activeingredient: string;
  price: string;
  company: string;
  group: string;
  pamphlet: string;
  dosage: string;
  composition: string;
}
export interface MaterialColors {
  [key: string]: MaterialColor
}
export interface MaterialColor {
  primary: string;
  secondary: string;
}