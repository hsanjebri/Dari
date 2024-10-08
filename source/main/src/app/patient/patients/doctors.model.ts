// doctors.model.ts
export class Doctors {
  id: number;
  img: string;
  name: string;
  email: string;
  mobile: string;
  department: string;
  yearsOfExperience: string;
  gender: string;
  address: string;

  constructor(doctors: Partial<Doctors> = {}) {
    this.id = doctors.id || this.getRandomID();
    this.img = doctors.img || '';
    this.name = doctors.name || '';
    this.email = doctors.email || '';
    this.mobile = doctors.mobile || '';
    this.department = doctors.department || '';
    this.yearsOfExperience = doctors.yearsOfExperience || '';
    this.gender = doctors.gender || '';
    this.address = doctors.address || '';
  }

  private getRandomID(): number {
    const S4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return parseInt(S4() + S4(), 16);
  }
}
