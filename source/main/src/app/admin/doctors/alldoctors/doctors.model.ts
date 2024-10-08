export class Doctors {
  id: number;
  img: string;
  name: string;
  email: string;
  surface: string;
  adresse: string;  // Address of the property
  typeBien: string;  // Type of the property (e.g., house, apartment)
  location: string; // Location of the property
  mobile: string;
  description: string; // Description of the property
  password?: string; // Optional, as it's not always required
  likes: number;  // Number of likes

  constructor(doctors: Partial<Doctors> = {}) {
    this.id = doctors.id || this.getRandomID();
    this.img = doctors.img || 'assets/images/';
    this.name = doctors.name || '';
    this.email = doctors.email || '';
    this.surface = doctors.surface || '';
    this.adresse = doctors.adresse || '';
    this.typeBien = doctors.typeBien || '';
    this.location = doctors.location || '';
    this.mobile = doctors.mobile || '';
    this.password = doctors.password || '';
    this.description = doctors.description || '';
    this.likes = doctors.likes || 0;  // Set default likes to 0
  }

  // Method to generate a random ID
  private getRandomID(): number {
    const S4 = () => ((1 + Math.random()) * 0x10000) | 0;
    return S4() + S4();
  }
}
