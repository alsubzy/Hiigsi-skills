export const users = [
    {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@school.com',
        role: 'Admin',
        status: 'Active',
        avatar: 'https://i.pravatar.cc/150?u=1',
        createdDate: new Date().toISOString(),
    },
    {
        id: 'u2',
        name: 'Teacher One',
        email: 'teacher1@school.com',
        role: 'Teacher',
        status: 'Active',
        avatar: 'https://i.pravatar.cc/150?u=2',
        createdDate: new Date().toISOString(),
    },
    {
        id: 'u3',
        name: 'Student One',
        email: 'student1@school.com',
        role: 'Student',
        status: 'Active',
        avatar: 'https://i.pravatar.cc/150?u=3',
        createdDate: new Date().toISOString(),
    },
];

export const academicClasses = [
    { id: 'c1', name: 'Grade 1', level: '1', status: 'Active' as const },
    { id: 'c2', name: 'Grade 2', level: '2', status: 'Active' as const },
    { id: 'c3', name: 'Grade 3', level: '3', status: 'Active' as const },
    { id: 'c4', name: 'Grade 4', level: '4', status: 'Active' as const },
    { id: 'c5', name: 'Grade 5', level: '5', status: 'Active' as const },
    { id: 'c6', name: 'Grade 6', level: '6', status: 'Active' as const },
    { id: 'c7', name: 'Grade 7', level: '7', status: 'Active' as const },
    { id: 'c8', name: 'Grade 8', level: '8', status: 'Active' as const },
    { id: 'c9', name: 'Grade 9', level: '9', status: 'Active' as const },
    { id: 'c10', name: 'Grade 10', level: '10', status: 'Active' as const },
];

export const sections = [
    { id: 's1', name: 'A', classId: 'c1', capacity: 30, status: 'Active' as const },
    { id: 's2', name: 'B', classId: 'c1', capacity: 30, status: 'Active' as const },
    { id: 's3', name: 'A', classId: 'c3', capacity: 30, status: 'Active' as const },
    { id: 's4', name: 'B', classId: 'c3', capacity: 30, status: 'Active' as const },
];

export const subjects = [
    { id: 'sub1', name: 'Mathematics', classId: 'c1', status: 'Active' as const },
    { id: 'sub2', name: 'English', classId: 'c1', status: 'Active' as const },
    { id: 'sub3', name: 'Science', classId: 'c1', status: 'Active' as const },
    { id: 'sub4', name: 'History', classId: 'c1', status: 'Active' as const },
    { id: 'sub5', name: 'Geography', classId: 'c1', status: 'Active' as const },
    { id: 'sub6', name: 'Mathematics', classId: 'c3', status: 'Active' as const },
    { id: 'sub7', name: 'English', classId: 'c3', status: 'Active' as const },
    { id: 'sub8', name: 'Science', classId: 'c3', status: 'Active' as const },
    { id: 'sub9', name: 'Biology', classId: 'c3', status: 'Active' as const },
    { id: 'sub10', name: 'Chemistry', classId: 'c3', status: 'Active' as const },
];

export const calendarEvents = [
    {
        id: 'ev1',
        title: 'School Opening',
        date: new Date('2024-09-01'),
        type: 'event' as const,
        description: 'First day of school',
    },
    {
        id: 'ev2',
        title: 'Mid-term Exams',
        date: new Date('2024-11-15'),
        type: 'exam' as const,
        description: 'Mid-term examination period',
    },
];

export const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

export const timetableData = [
    {
        day: 'Monday',
        '08:00': { subject: 'Mathematics', teacher: 'Teacher One' },
        '09:00': { subject: 'English', teacher: 'Teacher One' },
        '10:00': { subject: 'Science', teacher: 'Teacher One' },
        '11:00': { subject: 'History', teacher: 'Teacher One' },
        '13:00': { subject: 'Geography', teacher: 'Teacher One' },
        '14:00': { subject: 'Art', teacher: 'Teacher One' },
        '15:00': { subject: 'Physical Education', teacher: 'Teacher One' },
    },
    {
        day: 'Tuesday',
        '08:00': { subject: 'English', teacher: 'Teacher One' },
        '09:00': { subject: 'Mathematics', teacher: 'Teacher One' },
        '10:00': { subject: 'Science', teacher: 'Teacher One' },
        '11:00': { subject: 'Geography', teacher: 'Teacher One' },
        '13:00': { subject: 'History', teacher: 'Teacher One' },
        '14:00': { subject: 'Music', teacher: 'Teacher One' },
        '15:00': { subject: 'Physical Education', teacher: 'Teacher One' },
    },
    {
        day: 'Wednesday',
        '08:00': { subject: 'Mathematics', teacher: 'Teacher One' },
        '09:00': { subject: 'Science', teacher: 'Teacher One' },
        '10:00': { subject: 'English', teacher: 'Teacher One' },
        '11:00': { subject: 'Art', teacher: 'Teacher One' },
        '13:00': { subject: 'History', teacher: 'Teacher One' },
        '14:00': { subject: 'Geography', teacher: 'Teacher One' },
        '15:00': { subject: 'Physical Education', teacher: 'Teacher One' },
    },
    {
        day: 'Thursday',
        '08:00': { subject: 'Science', teacher: 'Teacher One' },
        '09:00': { subject: 'Mathematics', teacher: 'Teacher One' },
        '10:00': { subject: 'English', teacher: 'Teacher One' },
        '11:00': { subject: 'History', teacher: 'Teacher One' },
        '13:00': { subject: 'Geography', teacher: 'Teacher One' },
        '14:00': { subject: 'Music', teacher: 'Teacher One' },
        '15:00': { subject: 'Art', teacher: 'Teacher One' },
    },
    {
        day: 'Friday',
        '08:00': { subject: 'English', teacher: 'Teacher One' },
        '09:00': { subject: 'Mathematics', teacher: 'Teacher One' },
        '10:00': { subject: 'Science', teacher: 'Teacher One' },
        '11:00': { subject: 'Geography', teacher: 'Teacher One' },
        '13:00': { subject: 'History', teacher: 'Teacher One' },
        '14:00': { subject: 'Physical Education', teacher: 'Teacher One' },
        '15:00': { subject: 'Art', teacher: 'Teacher One' },
    },
];