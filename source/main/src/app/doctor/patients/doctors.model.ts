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
  monthlygoal: number;
  maxgoal: number;

  constructor(doctors: Partial<Doctors> = {}) {
    this.id = doctors.id || 0;
    this.img = doctors.img || 'assets/images/default.jpg'; // Provide a default image path
    this.name = doctors.name || '';
    this.email = doctors.email || '';
    this.mobile = doctors.mobile || '';
    this.department = doctors.department || '';
    this.yearsOfExperience = doctors.yearsOfExperience || '';
    this.gender = doctors.gender || '';
    this.address = doctors.address || '';
    this.monthlygoal = doctors.monthlygoal || 0; // Default value for monthlygoal
    this.maxgoal = doctors.maxgoal || 0; // Default value for maxgoal
  }


}
