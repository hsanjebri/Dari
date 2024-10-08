import { formatDate } from '@angular/common';

export class Room {
  id: number;
  prixachat: number; // Corresponds to 'prixAchat' in Spring Boot (use 'number' for BigDecimal)
  dateachat: string; // Corresponds to 'dateAchat' in Spring Boot (formatted as 'yyyy-MM-dd')
  annonce: any; // Adjust the type based on the 'Annonce' entity
  status: string; // Corresponds to 'buyer' in Spring Boot
  buyer: string; // Corresponds to 'buyer' in Spring Boot
  seller: string; // Corresponds to 'seller' in Spring Boot
  expdate: string; // Corresponds to 'dateAchat' in Spring Boot (formatted as 'yyyy-MM-dd')

  constructor(room: Room) {
    {
      this.id = room.id ;
      this.prixachat = room.prixachat || 0;
      this.dateachat = room.dateachat || formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.annonce = room.annonce || null;
      this.buyer = room.buyer || '';
      this.status = room.status || '';
      this.seller = room.seller || '';
      this.expdate = room.expdate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    }
  }


}
