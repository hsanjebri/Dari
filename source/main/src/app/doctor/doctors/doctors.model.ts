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
  password?:string ;
  constructor(doctors: Partial<Doctors> = {}) {
    this.id = doctors.id || 0;
    this.img = this.getRandomImage(); // Set a random image
    this.name = doctors.name || '';
    this.email = doctors.email || '';
    this.mobile = doctors.mobile || '';
    this.department = doctors.department || '';
    this.yearsOfExperience = doctors.yearsOfExperience || '';
    this.gender = doctors.gender || '';
    this.address = doctors.address || '';
    this.monthlygoal = doctors.monthlygoal || 0;
    this.maxgoal = doctors.maxgoal || 0;
    this.password = doctors.password || '';
  }

  // Method to get a random image path
  private getRandomImage(): string {
    const img = [
      'assets/images/agents/agent1.jpeg',
      'assets/images/agents/agent2.jpeg',
      'assets/images/agents/agent3.jpeg',
      'assets/images/agents/agent4.jpeg'
    ];
    const randomIndex = Math.floor(Math.random() * img.length);
    return img[randomIndex];
  }
}
