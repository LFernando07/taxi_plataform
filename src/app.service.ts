import { Injectable } from '@nestjs/common';
import { User } from './user/entities/user.entity';

@Injectable()
export class AppService {
  getHello(user: User): string {
    return `Hello ${user ? user.name : 'World'}! Welcome to the Taxi Reservation System.`;
  }
}
