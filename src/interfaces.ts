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
export interface UserDetails extends Array<UserDetail> { }{

} 
export interface UserDetail {
  mobileNumber:number
  occupation: string
  areYou: string
  fieldOfStudy: string
}
export interface MaterialColors {
  [key: string]: MaterialColor
}
export interface MaterialColor {
  primary: string;
  secondary: string;
}