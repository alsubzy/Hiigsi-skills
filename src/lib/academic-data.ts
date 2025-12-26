// Academic classes/grades
export const academicClasses = [
  { id: '1', name: 'Grade 1', level: 1 },
  { id: '2', name: 'Grade 2', level: 2 },
  { id: '3', name: 'Grade 3', level: 3 },
  { id: '4', name: 'Grade 4', level: 4 },
  { id: '5', name: 'Grade 5', level: 5 },
  { id: '6', name: 'Grade 6', level: 6 },
  { id: '7', name: 'Grade 7', level: 7 },
  { id: '8', name: 'Grade 8', level: 8 },
  { id: '9', name: 'Grade 9', level: 9 },
  { id: '10', name: 'Grade 10', level: 10 },
  { id: '11', name: 'Grade 11', level: 11 },
  { id: '12', name: 'Grade 12', level: 12 },
];

// Time slots for timetable
export const timeSlots = [
  { id: '1', startTime: '08:00', endTime: '08:45' },
  { id: '2', startTime: '08:45', endTime: '09:30' },
  { id: '3', startTime: '09:30', endTime: '10:15' },
  { id: '4', startTime: '10:15', endTime: '11:00' },
  { id: '5', startTime: '11:15', endTime: '12:00' },
  { id: '6', startTime: '12:00', endTime: '12:45' },
  { id: '7', startTime: '12:45', endTime: '13:30' },
];

// Subjects
export const subjects = [
  { id: '1', name: 'Mathematics', code: 'MATH' },
  { id: '2', name: 'English', code: 'ENG' },
  { id: '3', name: 'Science', code: 'SCI' },
  { id: '4', name: 'History', code: 'HIST' },
  { id: '5', name: 'Geography', code: 'GEOG' },
  { id: '6', name: 'Physics', code: 'PHY' },
  { id: '7', name: 'Chemistry', code: 'CHEM' },
  { id: '8', name: 'Biology', code: 'BIO' },
];

export const allSubjects = [...subjects];

// Announcements
export const announcements = [
  {
    id: '1',
    title: 'School Reopening',
    content: 'School will reopen on January 15th after winter break.',
    date: '2024-01-05',
    author: 'Principal Smith'
  },
  {
    id: '2',
    title: 'Parent-Teacher Meeting',
    content: 'Scheduled for January 20th at 2 PM in the school auditorium.',
    date: '2024-01-10',
    author: 'Vice Principal Johnson'
  }
];

// Conversations
export const conversations = [
  {
    id: '1',
    participants: ['1', '2'],
    messages: [
      { id: '1', sender: '1', content: 'Hello, how are you?', timestamp: '2024-01-15T10:00:00Z' },
      { id: '2', sender: '2', content: 'I\'m doing well, thank you!', timestamp: '2024-01-15T10:05:00Z' }
    ]
  }
];

// Notifications
export const notifications = [
  {
    id: '1',
    title: 'New Assignment',
    message: 'Math homework due tomorrow',
    date: '2024-01-15',
    read: false
  },
  {
    id: '2',
    title: 'Grade Updated',
    message: 'Your Science grade has been updated',
    date: '2024-01-14',
    read: true
  }
];

// Timetable Data
export const timetableData = {
  monday: [
    { time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mr. Johnson' },
    { time: '08:45 - 09:30', subject: 'English', teacher: 'Ms. Smith' },
    // Add more entries as needed
  ],
  tuesday: [
    { time: '08:00 - 08:45', subject: 'Science', teacher: 'Dr. Brown' },
    { time: '08:45 - 09:30', subject: 'History', teacher: 'Mr. Davis' },
    // Add more entries as needed
  ],
  // Add more days as needed
};

// Syllabus Data
export const syllabusData = [
  {
    id: '1',
    subject: 'Mathematics',
    classId: '1',
    chapters: [
      { id: '1', name: 'Introduction to Numbers', status: 'completed' },
      { id: '2', name: 'Basic Operations', status: 'in-progress' },
      { id: '3', name: 'Fractions', status: 'pending' },
    ]
  },
  // Add more subjects as needed
];

// Calendar Events
export const calendarEvents = [
  {
    id: '1',
    title: 'Math Test',
    date: '2024-02-01',
    type: 'exam'
  },
  {
    id: '2',
    title: 'Science Project Due',
    date: '2024-02-05',
    type: 'assignment'
  },
  // Add more events as needed
];

// Sections for each class
export const sections = [
  { id: '1', name: 'A', classId: '1' },
  { id: '2', name: 'B', classId: '1' },
  { id: '3', name: 'A', classId: '2' },
  { id: '4', name: 'B', classId: '2' },
  // Add more sections as needed
];

// Initial attendance data
export const initialAttendance = {
  date: new Date().toISOString().split('T')[0],
  classId: '1',
  sectionId: '1',
  attendance: [
    { studentId: '1', status: 'PRESENT' },
    { studentId: '2', status: 'ABSENT' },
    // Add more attendance records as needed
  ]
};

// Student data
export const students = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    classId: '1',
    sectionId: '1',
    admissionNumber: 'STD-001',
    dateOfBirth: '2015-01-15',
    gender: 'MALE',
    phone: '1234567890',
    address: '123 Main St, City',
    status: 'ACTIVE',
  },
  // Add more students as needed
];

export const initialStudents = [...students];
export const allStudents = [...students];

// User data
export const users = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'ADMIN',
    status: 'ACTIVE',
  },
  {
    id: '2',
    firstName: 'Teacher',
    lastName: 'User',
    email: 'teacher@example.com',
    role: 'TEACHER',
    status: 'ACTIVE',
  },
  // Add more users as needed
];

export const allUsers = [...users];
