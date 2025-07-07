export type ClassName = 
  | 'Spinning' | 'Step' | 'Body Con' | 'Box' | 'HIIT' | 'Small Group PT' 
  | 'Spinn' | 'Instructor Decides' | 'Only for the Brave' | '';

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
export type TimeSlot = string;

export interface ClassInfo {
  id: string;
  time: TimeSlot;
  day: Day;
  name: ClassName;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  schedule: ClassInfo[];
}

export const locations: Location[] = [
  {
    id: 'mdantsane',
    name: 'Mdantsane',
    address: 'Mdantsane Shopping Complex, Mdantsane',
    schedule: [
      { id: 'md-mon-1', time: '06:00 - 07:00', day: 'Monday', name: 'Spinning' },
      { id: 'md-mon-2', time: '16:30 - 17:30', day: 'Monday', name: 'Step' },
      { id: 'md-mon-3', time: '17:30 - 18:30', day: 'Monday', name: 'Box' },
      { id: 'md-tue-1', time: '06:00 - 07:00', day: 'Tuesday', name: 'Spinning' },
      { id: 'md-tue-2', time: '16:30 - 17:30', day: 'Tuesday', name: 'Body Con' },
      { id: 'md-tue-3', time: '17:30 - 18:30', day: 'Tuesday', name: 'Spinning' },
      { id: 'md-wed-1', time: '06:00 - 07:00', day: 'Wednesday', name: 'Spinning' },
      { id: 'md-wed-2', time: '16:30 - 17:30', day: 'Wednesday', name: 'Box' },
      { id: 'md-wed-3', time: '17:30 - 18:30', day: 'Wednesday', name: 'Step' },
      { id: 'md-thu-1', time: '06:00 - 07:00', day: 'Thursday', name: 'Spinning' },
      { id: 'md-thu-2', time: '16:30 - 17:30', day: 'Thursday', name: 'Body Con' },
      { id: 'md-thu-3', time: '17:30 - 18:30', day: 'Thursday', name: 'Box' },
      { id: 'md-fri-1', time: '06:00 - 07:00', day: 'Friday', name: 'Spinning' },
      { id: 'md-fri-2', time: '17:30 - 18:30', day: 'Friday', name: 'Spinning' },
    ],
  },
  {
    id: 'quigney',
    name: 'Quigney',
    address: '123 Beachfront Rd, Quigney',
    schedule: [
      { id: 'q-mon-1', time: '05:00 - 06:00', day: 'Monday', name: 'Small Group PT' },
      { id: 'q-mon-2', time: '06:00 - 07:00', day: 'Monday', name: 'Body Con' },
      { id: 'q-mon-3', time: '16:15 - 17:15', day: 'Monday', name: 'HIIT' },
      { id: 'q-mon-4', time: '17:15 - 18:15', day: 'Monday', name: 'Spinning' },
      { id: 'q-tue-1', time: '06:00 - 07:00', day: 'Tuesday', name: 'HIIT' },
      { id: 'q-tue-2', time: '16:15 - 17:15', day: 'Tuesday', name: 'Body Con' },
      { id: 'q-tue-3', time: '17:15 - 18:15', day: 'Tuesday', name: 'Spinning' },
      { id: 'q-wed-1', time: '05:00 - 06:00', day: 'Wednesday', name: 'Small Group PT' },
      { id: 'q-wed-2', time: '06:00 - 07:00', day: 'Wednesday', name: 'Body Con' },
      { id: 'q-wed-3', time: '16:15 - 17:15', day: 'Wednesday', name: 'HIIT' },
      { id: 'q-wed-4', time: '17:15 - 18:15', day: 'Wednesday', name: 'Spinning' },
      { id: 'q-thu-1', time: '06:00 - 07:00', day: 'Thursday', name: 'HIIT' },
      { id: 'q-thu-2', time: '16:15 - 17:15', day: 'Thursday', name: 'Body Con' },
      { id: 'q-thu-3', time: '17:15 - 18:15', day: 'Thursday', name: 'Spinning' },
      { id: 'q-fri-1', time: '05:00 - 06:00', day: 'Friday', name: 'Small Group PT' },
      { id: 'q-fri-2', time: '06:00 - 07:00', day: 'Friday', name: 'Body Con' },
      { id: 'q-fri-3', time: '16:15 - 17:15', day: 'Friday', name: 'HIIT' },
      { id: 'q-fri-4', time: '17:15 - 18:15', day: 'Friday', name: 'Spinning' },
    ],
  },
  {
    id: 'amalinda',
    name: 'Amalinda',
    address: 'Amalinda Main Road, Amalinda',
    schedule: [
      { id: 'a-mon-1', time: '05:00 - 06:00', day: 'Monday', name: 'Small Group PT' },
      { id: 'a-mon-2', time: '07:00 - 08:00', day: 'Monday', name: 'Body Con' },
      { id: 'a-mon-3', time: '08:00 - 09:00', day: 'Monday', name: 'Small Group PT' },
      { id: 'a-mon-4', time: '17:00 - 18:00', day: 'Monday', name: 'Spinn' },
      { id: 'a-mon-5', time: '18:00 - 19:00', day: 'Monday', name: 'Body Con' },
      { id: 'a-tue-1', time: '07:00 - 08:00', day: 'Tuesday', name: 'Spinn' },
      { id: 'a-tue-2', time: '08:00 - 09:00', day: 'Tuesday', name: 'Small Group PT' },
      { id: 'a-tue-3', time: '17:00 - 18:00', day: 'Tuesday', name: 'Step' },
      { id: 'a-tue-4', time: '18:00 - 19:00', day: 'Tuesday', name: 'Box' },
      { id: 'a-wed-1', time: '05:00 - 06:00', day: 'Wednesday', name: 'Small Group PT' },
      { id: 'a-wed-2', time: '07:00 - 08:00', day: 'Wednesday', name: 'HIIT' },
      { id: 'a-wed-3', time: '08:00 - 09:00', day: 'Wednesday', name: 'Small Group PT' },
      { id: 'a-wed-4', time: '17:00 - 18:00', day: 'Wednesday', name: 'Spinn' },
      { id: 'a-wed-5', time: '18:00 - 19:00', day: 'Wednesday', name: 'Body Con' },
      { id: 'a-thu-1', time: '07:00 - 08:00', day: 'Thursday', name: 'Spinn' },
      { id: 'a-thu-2', time: '08:00 - 09:00', day: 'Thursday', name: 'Small Group PT' },
      { id: 'a-thu-3', time: '17:00 - 18:00', day: 'Thursday', name: 'HIIT' },
      { id: 'a-thu-4', time: '18:00 - 19:00', day: 'Thursday', name: 'Box' },
      { id: 'a-fri-1', time: '05:00 - 06:00', day: 'Friday', name: 'Small Group PT' },
      { id: 'a-fri-2', time: '07:00 - 08:00', day: 'Friday', name: 'Body Con' },
      { id: 'a-fri-3', time: '08:00 - 09:00', day: 'Friday', name: 'Small Group PT' },
      { id: 'a-fri-4', time: '17:00 - 18:00', day: 'Friday', name: 'Step' },
      { id: 'a-fri-5', time: '18:00 - 19:00', day: 'Friday', name: 'Instructor Decides' },
    ],
  },
  {
    id: 'oxford',
    name: 'Oxford',
    address: 'Oxford Street, City Center',
    schedule: [
      { id: 'o-mon-1', time: '16:00 - 17:00', day: 'Monday', name: 'Body Con' },
      { id: 'o-mon-2', time: '17:00 - 18:00', day: 'Monday', name: 'Spinning' },
      { id: 'o-mon-3', time: '18:00 - 19:00', day: 'Monday', name: 'Box' },
      { id: 'o-tue-1', time: '16:00 - 17:00', day: 'Tuesday', name: 'HIIT' },
      { id: 'o-tue-2', time: '17:00 - 18:00', day: 'Tuesday', name: 'Spinning' },
      { id: 'o-tue-3', time: '18:00 - 19:00', day: 'Tuesday', name: 'Body Con' },
      { id: 'o-wed-1', time: '16:00 - 17:00', day: 'Wednesday', name: 'Body Con' },
      { id: 'o-wed-2', time: '17:00 - 18:00', day: 'Wednesday', name: 'Spinning' },
      { id: 'o-wed-3', time: '18:00 - 19:00', day: 'Wednesday', name: 'HIIT' },
      { id: 'o-thu-1', time: '16:00 - 17:00', day: 'Thursday', name: 'HIIT' },
      { id: 'o-thu-2', time: '17:00 - 18:00', day: 'Thursday', name: 'Spinning' },
      { id: 'o-thu-3', time: '18:00 - 19:00', day: 'Thursday', name: 'Only for the Brave' },
      { id: 'o-fri-1', time: '16:00 - 17:00', day: 'Friday', name: 'Body Con' },
      { id: 'o-fri-2', time: '17:00 - 18:00', day: 'Friday', name: 'Spinning' },
    ],
  },
];
