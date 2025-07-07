export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
export type Specialty = 'Strength' | 'HIIT' | 'Cardio' | 'Boxing' | 'Body Con' | 'Spinning' | 'Step';

export interface Trainer {
    id: string;
    name: string;
    specialties: Specialty[];
    availability: {
        [key in Day]?: string[];
    };
    avatarUrl: string;
}

export interface TrainerLocation {
  id: string;
  name: string;
  address: string;
  trainers: Trainer[];
}


export const trainerLocations: TrainerLocation[] = [
    {
        id: 'mdantsane',
        name: 'Mdantsane',
        address: 'Mdantsane Shopping Complex, Mdantsane',
        trainers: [
            { id: 'md1', name: 'Alex Ray', specialties: ['Strength', 'HIIT'], availability: { 'Monday': ['06:00 - 07:00'], 'Tuesday': ['16:30 - 17:30'] }, avatarUrl: 'https://placehold.co/100x100.png' },
            { id: 'md2', name: 'Jess Taylor', specialties: ['Cardio', 'Boxing'], availability: { 'Wednesday': ['17:30 - 18:30'], 'Friday': ['17:30 - 18:30'] }, avatarUrl: 'https://placehold.co/100x100.png' },
        ],
    },
    {
        id: 'quigney',
        name: 'Quigney',
        address: '123 Beachfront Rd, Quigney',
        trainers: [
            { id: 'q1', name: 'Sam Carter', specialties: ['HIIT', 'Body Con'], availability: { 'Monday': ['05:00 - 06:00', '16:15 - 17:15'], 'Wednesday': ['05:00 - 06:00'] }, avatarUrl: 'https://placehold.co/100x100.png' },
            { id: 'q2', name: 'Chris Lee', specialties: ['Strength', 'Cardio'], availability: { 'Tuesday': ['06:00 - 07:00'], 'Thursday': ['06:00 - 07:00'] }, avatarUrl: 'https://placehold.co/100x100.png' },
        ],
    },
    {
        id: 'amalinda',
        name: 'Amalinda',
        address: 'Amalinda Main Road, Amalinda',
        trainers: [
            { id: 'a1', name: 'Jordan Ben', specialties: ['Spinning', 'Step'], availability: { 'Monday': ['05:00 - 06:00'], 'Friday': ['18:00 - 19:00'] }, avatarUrl: 'https://placehold.co/100x100.png' },
            { id: 'a2', name: 'Taylor Fox', specialties: ['Boxing', 'HIIT'], availability: { 'Tuesday': ['07:00 - 08:00'], 'Wednesday': ['17:00 - 18:00'] }, avatarUrl: 'https://placehold.co/100x100.png' },
            { id: 'a3', name: 'Morgan Ash', specialties: ['Strength', 'Body Con'], availability: { 'Wednesday': ['08:00 - 09:00'], 'Thursday': ['08:00 - 09:00'] }, avatarUrl: 'https://placehold.co/100x100.png' },
        ],
    },
    {
        id: 'oxford',
        name: 'Oxford',
        address: 'Oxford Street, City Center',
        trainers: [
            { id: 'o1', name: 'Casey Shaw', specialties: ['HIIT', 'Strength'], availability: { 'Monday': ['16:00 - 17:00'], 'Wednesday': ['18:00 - 19:00'] }, avatarUrl: 'https://placehold.co/100x100.png' },
            { id: 'o2', name: 'Riley Stone', specialties: ['Cardio', 'Spinning'], availability: { 'Tuesday': ['17:00 - 18:00'], 'Friday': ['17:00 - 18:00'] }, avatarUrl: 'https://placehold.co/100x100.png' },
        ],
    },
];

export const getAvailableDaysForLocation = (locationId: string): Day[] => {
    const location = trainerLocations.find(l => l.id === locationId);
    if (!location) return [];
    const days = new Set<Day>();
    location.trainers.forEach(trainer => {
        Object.keys(trainer.availability).forEach(day => days.add(day as Day));
    });
    const dayOrder: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return Array.from(days).sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
};


export const getAvailableTimesForLocation = (locationId: string): string[] => {
    const location = trainerLocations.find(l => l.id === locationId);
    if (!location) return [];
    const times = new Set<string>();
    location.trainers.forEach(trainer => {
        Object.values(trainer.availability).forEach(daySlots => {
            if(daySlots) {
                daySlots.forEach(slot => times.add(slot));
            }
        });
    });
    return Array.from(times).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
};
