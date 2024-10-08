import { formatDate } from '@angular/common';
export class visite {
  id: number;
  img: string;
  name: string;
  email: string;
  date: string;
  time: string;
  mobile: string;
  constructor(appointment: visite) {
    {
      this.id = appointment.id || this.getRandomID();
      this.img = appointment.img || 'assets/images/user/user1.jpg';
      this.name = appointment.name || '';
      this.email = appointment.email || '';
      this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.time = appointment.time || '';
      this.mobile = appointment.mobile || '';
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
