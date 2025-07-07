export type ClassName = 
  | 'Spinning' | 'Step' | 'Body Con' | 'Box' | 'HIIT' | 'Small Group PT' 
  | 'Spinn' | 'Instructor Decides' | 'Only for the Brave' | '';

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
export type TimeSlot = string;

export interface ClassInfo {
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
      { time: '06:00 - 07:00', day: 'Monday', name: 'Spinning' },
      { time: '16:30 - 17:30', day: 'Monday', name: 'Step' },
      { time: '17:30 - 18:30', day: 'Monday', name: 'Box' },
      { time: '06:00 - 07:00', day: 'Tuesday', name: 'Spinning' },
      { time: '16:30 - 17:30', day: 'Tuesday', name: 'Body Con' },
      { time: '17:30 - 18:30', day: 'Tuesday', name: 'Spinning' },
      { time: '06:00 - 07:00', day: 'Wednesday', name: 'Spinning' },
      { time: '16:30 - 17:30', day: 'Wednesday', name: 'Box' },
      { time: '17:30 - 18:30', day: 'Wednesday', name: 'Step' },
      { time: '06:00 - 07:00', day: 'Thursday', name: 'Spinning' },
      { time: '16:30 - 17:30', day: 'Thursday', name: 'Body Con' },
      { time: '17:30 - 18:30', day: 'Thursday', name: 'Box' },
      { time: '06:00 - 07:00', day: 'Friday', name: 'Spinning' },
      { time: '17:30 - 18:30', day: 'Friday', name: 'Spinning' },
    ],
  },
  {
    id: 'quigney',
    name: 'Quigney',
    address: '123 Beachfront Rd, Quigney',
    schedule: [
      { time: '05:00 - 06:00', day: 'Monday', name: 'Small Group PT' },
      { time: '06:00 - 07:00', day: 'Monday', name: 'Body Con' },
      { time: '16:15 - 17:15', day: 'Monday', name: 'HIIT' },
      { time: '17:15 - 18:15', day: 'Monday', name: 'Spinning' },
      { time: '06:00 - 07:00', day: 'Tuesday', name: 'HIIT' },
      { time: '16:15 - 17:15', day: 'Tuesday', name: 'Body Con' },
      { time: '17:15 - 18:15', day: 'Tuesday', name: 'Spinning' },
      { time: '05:00 - 06:00', day: 'Wednesday', name: 'Small Group PT' },
      { time: '06:00 - 07:00', day: 'Wednesday', name: 'Body Con' },
      { time: '16:15 - 17:15', day: 'Wednesday', name: 'HIIT' },
      { time: '17:15 - 18:15', day: 'Wednesday', name: 'Spinning' },
      { time: '06:00 - 07:00', day: 'Thursday', name: 'HIIT' },
      { time: '16:15 - 17:15', day: 'Thursday', name: 'Body Con' },
      { time: '17:15 - 18:15', day: 'Thursday', name: 'Spinning' },
      { time: '05:00 - 06:00', day: 'Friday', name: 'Small Group PT' },
      { time: '06:00 - 07:00', day: 'Friday', name: 'Body Con' },
      { time: '16:15 - 17:15', day: 'Friday', name: 'HIIT' },
      { time: '17:15 - 18:15', day: 'Friday', name: 'Spinning' },
    ],
  },
  {
    id: 'amalinda',
    name: 'Amalinda',
    address: 'Amalinda Main Road, Amalinda',
    schedule: [
      { time: '05:00 - 06:00', day: 'Monday', name: 'Small Group PT' },
      { time: '07:00 - 08:00', day: 'Monday', name: 'Body Con' },
      { time: '08:00 - 09:00', day: 'Monday', name: 'Small Group PT' },
      { time: '17:00 - 18:00', day: 'Monday', name: 'Spinn' },
      { time: '18:00 - 19:00', day: 'Monday', name: 'Body Con' },
      { time: '07:00 - 08:00', day: 'Tuesday', name: 'Spinn' },
      { time: '08:00 - 09:00', day: 'Tuesday', name: 'Small Group PT' },
      { time: '17:00 - 18:00', day: 'Tuesday', name: 'Step' },
      { time: '18:00 - 19:00', day: 'Tuesday', name: 'Box' },
      { time: '05:00 - 06:00', day: 'Wednesday', name: 'Small Group PT' },
      { time: '07:00 - 08:00', day: 'Wednesday', name: 'HIIT' },
      { time: '08:00 - 09:00', day: 'Wednesday', name: 'Small Group PT' },
      { time: '17:00 - 18:00', day: 'Wednesday', name: 'Spinn' },
      { time: '18:00 - 19:00', day: 'Wednesday', name: 'Body Con' },
      { time: '07:00 - 08:00', day: 'Thursday', name: 'Spinn' },
      { time: '08:00 - 09:00', day: 'Thursday', name: 'Small Group PT' },
      { time: '17:00 - 18:00', day: 'Thursday', name: 'HIIT' },
      { time: '18:00 - 19:00', day: 'Thursday', name: 'Box' },
      { time: '05:00 - 06:00', day: 'Friday', name: 'Small Group PT' },
      { time: '07:00 - 08:00', day: 'Friday', name: 'Body Con' },
      { time: '08:00 - 09:00', day: 'Friday', name: 'Small Group PT' },
      { time: '17:00 - 18:00', day: 'Friday', name: 'Step' },
      { time: '18:00 - 19:00', day: 'Friday', name: 'Instructor Decides' },
    ],
  },
  {
    id: 'oxford',
    name: 'Oxford',
    address: 'Oxford Street, City Center',
    schedule: [
      { time: '16:00 - 17:00', day: 'Monday', name: 'Body Con' },
      { time: '17:00 - 18:00', day: 'Monday', name: 'Spinning' },
      { time: '18:00 - 19:00', day: 'Monday', name: 'Box' },
      { time: '16:00 - 17:00', day: 'Tuesday', name: 'HIIT' },
      { time: '17:00 - 18:00', day: 'Tuesday', name: 'Spinning' },
      { time: '18:00 - 19:00', day: 'Tuesday', name: 'Body Con' },
      { time: '16:00 - 17:00', day: 'Wednesday', name: 'Body Con' },
      { time: '17:00 - 18:00', day: 'Wednesday', name: 'Spinning' },
      { time: '18:00 - 19:00', day: 'Wednesday', name: 'HIIT' },
      { time: '16:00 - 17:00', day: 'Thursday', name: 'HIIT' },
      { time: '17:00 - 18:00', day: 'Thursday', name: 'Spinning' },
      { time: '18:00 - 19:00', day: 'Thursday', name: 'Only for the Brave' },
      { time: '16:00 - 17:00', day: 'Friday', name: 'Body Con' },
      { time: '17:00 - 18:00', day: 'Friday', name: 'Spinning' },
    ],
  },
];
