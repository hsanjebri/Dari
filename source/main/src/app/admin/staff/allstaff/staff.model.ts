import { formatDate } from '@angular/common';

export class Staff {
  id: number | undefined;
  name: string;
  agence: string; // Added to match 'agence' in Spring Boot
  date: string; // Attribute for date
  address: string;
  description: string; // Added to match 'description' in Spring Boot
  prix: number; // Added to match 'prix' in Spring Boot
  type: string; // Added to match 'type' in Spring Boot
  email: string; // Added email attribute

  constructor(staff: Partial<Staff> = {}) {
    this.id = staff.id ;
    this.name = staff.name || '';
    this.agence = staff.agence || ''; // Initialize agence
    this.date = formatDate(staff.date || new Date(), 'yyyy-MM-dd', 'en'); // Format date
    this.address = staff.address || '';
    this.description = staff.description || ''; // Initialize description
    this.prix = staff.prix || 0; // Initialize prix
    this.type = staff.type || ''; // Initialize type
    this.email = staff.email || ''; // Initialize email
  }


}
