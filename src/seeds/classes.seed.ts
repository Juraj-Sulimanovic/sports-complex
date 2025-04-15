import { Class } from '../classes/entities/class.entity';
import { SportType } from '../classes/entities/class.entity';

export const classesSeed: Partial<Class>[] = [
  {
    name: 'Basketball Fundamentals',
    sportType: SportType.BASKETBALL,
    description: 'Learn the basics of basketball including dribbling, shooting, and passing.',
    maxParticipants: 15,
    startTime: '09:00',
    endTime: '10:30',
    weekDays: ['Monday', 'Wednesday'],
  },
  {
    name: 'Advanced Basketball',
    sportType: SportType.BASKETBALL,
    description: 'Advanced techniques and strategies for experienced players.',
    maxParticipants: 12,
    startTime: '17:00',
    endTime: '18:30',
    weekDays: ['Tuesday', 'Thursday'],
  },
  {
    name: 'Football Training',
    sportType: SportType.FOOTBALL,
    description: 'Basic football skills and team play.',
    maxParticipants: 20,
    startTime: '10:00',
    endTime: '11:30',
    weekDays: ['Monday', 'Friday'],
  },
  {
    name: 'Baseball Practice',
    sportType: SportType.BASEBALL,
    description: 'Baseball fundamentals and team practice.',
    maxParticipants: 18,
    startTime: '15:00',
    endTime: '16:30',
    weekDays: ['Wednesday', 'Friday'],
  },
]; 
