import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export const usersSeed: Partial<User>[] = [
  {
    id: 1,
    email: 'user1@example.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    id: 2,
    email: 'user2@example.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'Jane',
    lastName: 'Smith',
  },
  {
    id: 3,
    email: 'user3@example.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'Mike',
    lastName: 'Johnson',
  },
]; 