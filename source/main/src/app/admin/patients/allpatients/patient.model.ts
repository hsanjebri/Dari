export class Patient {
  id: number | undefined;
  img: string;
  name: string;
  gender: string;
  date: Date;
  email: string;
  mobile: string;
  address: string;
  role: string; // This should be a type representing the roles
  password: string; // Optional, as it's not always required

  constructor(patient?: Partial<Patient>) {
    this.id = patient?.id ;
    this.img = patient?.img || '';
    this.name = patient?.name || '';
    this.address = patient?.address || '';
    this.gender = patient?.gender || 'male';
    this.date = patient?.date || new Date(); // Default to current date if not provided
    this.email = patient?.email || '';
    this.password = patient?.password || '';
    this.mobile = patient?.mobile || '';
    this.role = patient?.role || ''; // Ensure this matches your role enumeration
  }

  // private getRandomID(): number {
  //   const S4 = () => {
  //     return ((1 + Math.random()) * 0x10000) | 0;
  //   };
  //   return S4() + S4();
  // }
}
