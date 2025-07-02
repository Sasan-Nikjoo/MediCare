declare module 'moment-jalaali' {
  import { Moment } from 'moment';
  interface MomentJalaali extends Moment {
    jYear(): number;
    jMonth(): number;
    jDate(): number;
    format(format: string): string;
  }
  function moment(input?: string | Date | Moment, format?: string): MomentJalaali;
  export = moment;
}