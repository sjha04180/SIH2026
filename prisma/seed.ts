// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing database records (in reverse dependency order)
  await prisma.verificationLog.deleteMany({});
  await prisma.projectContribution.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.faculty.deleteMany({});
  await prisma.coordinator.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Departments
  const deptCSE = await prisma.department.create({
    data: {
      name: 'Computer Science & Engineering',
      code: 'CSE',
    },
  });

  const deptIT = await prisma.department.create({
    data: {
      name: 'Information Technology',
      code: 'IT',
    },
  });

  console.log('Created Departments.');

  // 2. Create Programs
  const progBTechCSE = await prisma.program.create({
    data: {
      name: 'B.Tech in Computer Science & Engineering',
      code: 'BTECH-CSE',
      departmentId: deptCSE.id,
    },
  });

  const progBTechIT = await prisma.program.create({
    data: {
      name: 'B.Tech in Information Technology',
      code: 'BTECH-IT',
      departmentId: deptIT.id,
    },
  });

  console.log('Created Programs.');

  // 3. Create Users & Role Profiles
  // HOD / Admin User
  const userAdmin = await prisma.user.create({
    data: {
      email: 'hod.cse@sih.edu',
      name: 'Dr. Rajesh Patil',
      passwordHash: 'admin123', // plain for MVP demonstration
      role: 'ADMIN',
    },
  });

  // Faculty User
  const userFaculty = await prisma.user.create({
    data: {
      email: 'alok@sih.edu',
      name: 'Dr. Alok Ranjan',
      passwordHash: 'faculty123',
      role: 'FACULTY',
    },
  });

  const faculty = await prisma.faculty.create({
    data: {
      userId: userFaculty.id,
      department: 'Computer Science & Engineering',
    },
  });

  // Event Coordinator User
  const userCoordinator = await prisma.user.create({
    data: {
      email: 'neha@sih.edu',
      name: 'Prof. Neha Sharma',
      passwordHash: 'coord123',
      role: 'COORDINATOR',
    },
  });

  const coordinator = await prisma.coordinator.create({
    data: {
      userId: userCoordinator.id,
      scope: 'Mumbai Tech SIG / ACM Student Chapter',
    },
  });

  // Students
  // Student 1 (Sachin Jha)
  const userStudent1 = await prisma.user.create({
    data: {
      email: 'sachin@sih.edu',
      name: 'Sachin Jha',
      passwordHash: 'sachin123',
      role: 'STUDENT',
    },
  });

  const student1 = await prisma.student.create({
    data: {
      userId: userStudent1.id,
      rollNumber: '2026CSE001',
      departmentId: deptCSE.id,
      programId: progBTechCSE.id,
      currentSemester: 7,
      batch: '2022-2026',
      cgpa: 9.1,
      sgpa: 9.3,
      attendance: 88.5,
      profileCompletion: 85,
    },
  });

  // Student 2 (Hritik Jha)
  const userStudent2 = await prisma.user.create({
    data: {
      email: 'hritik@sih.edu',
      name: 'Hritik Jha',
      passwordHash: 'hritik123',
      role: 'STUDENT',
    },
  });

  const student2 = await prisma.student.create({
    data: {
      userId: userStudent2.id,
      rollNumber: '2026CSE002',
      departmentId: deptCSE.id,
      programId: progBTechCSE.id,
      currentSemester: 7,
      batch: '2022-2026',
      cgpa: 8.7,
      sgpa: 8.9,
      attendance: 82.0,
      profileCompletion: 80,
    },
  });

  // Student 3 (Yash Gupta)
  const userStudent3 = await prisma.user.create({
    data: {
      email: 'yash@sih.edu',
      name: 'Yash Gupta',
      passwordHash: 'yash123',
      role: 'STUDENT',
    },
  });

  const student3 = await prisma.student.create({
    data: {
      userId: userStudent3.id,
      rollNumber: '2026CSE003',
      departmentId: deptCSE.id,
      programId: progBTechCSE.id,
      currentSemester: 7,
      batch: '2022-2026',
      cgpa: 8.5,
      sgpa: 8.4,
      attendance: 79.5,
      profileCompletion: 78,
    },
  });

  console.log('Created Users & Profiles.');

  // 4. Create Activities
  // Example A - Self Learning (Sachin Jha) - Direct Self-Declared
  const actSelfLearning = await prisma.activity.create({
    data: {
      studentId: student1.id,
      type: 'Self-learning',
      title: 'React.js Learning through YouTube',
      date: new Date('2026-06-15'),
      organiser: 'YouTube',
      role: 'Self-learner',
      description: 'Learned advanced React.js patterns including Server Components, hooks, custom state management and performance tuning.',
      outcome: 'Built a solid foundation in modern React and built 3 small sample apps.',
      evidenceUrl: 'https://youtube.com/playlist?list=PL4cUxeGkcC9gUgrps49qiJ5z1JtOTF87x',
      evidenceType: 'URL',
      verificationRoute: 'SELF_DECLARED',
      status: 'SELF_DECLARED',
    },
  });

  // Example B - Hackathon (Sachin Jha) - Pending Event Coordinator
  const actHackathon1 = await prisma.activity.create({
    data: {
      studentId: student1.id,
      type: 'Hackathon',
      title: 'MumbaiHacks 2026',
      date: new Date('2026-07-20'),
      organiser: 'Mumbai Tech SIG',
      role: 'Team Leader & Backend Lead',
      description: '24-hour hackathon to build a solution for citizen grievance reporting and local authority routing.',
      outcome: 'Won 2nd Runner Up; built a working prototype using Next.js and Prisma.',
      evidenceUrl: '/evidence/mumbaihacks_cert.pdf',
      evidenceType: 'PDF',
      verificationRoute: 'EVENT_COORDINATOR',
      status: 'SUBMITTED',
    },
  });

  // Other students in same hackathon
  await prisma.activity.create({
    data: {
      studentId: student2.id,
      type: 'Hackathon',
      title: 'MumbaiHacks 2026',
      date: new Date('2026-07-20'),
      organiser: 'Mumbai Tech SIG',
      role: 'Frontend Developer',
      description: 'Built interface for grievance dashboard and map visualization.',
      outcome: 'Won 2nd Runner Up.',
      evidenceUrl: '/evidence/mumbaihacks_cert_2.pdf',
      evidenceType: 'PDF',
      verificationRoute: 'EVENT_COORDINATOR',
      status: 'SUBMITTED',
    },
  });

  await prisma.activity.create({
    data: {
      studentId: student3.id,
      type: 'Hackathon',
      title: 'MumbaiHacks 2026',
      date: new Date('2026-07-20'),
      organiser: 'Mumbai Tech SIG',
      role: 'UI Designer',
      description: 'Designed Figma wireframes and dashboard assets.',
      outcome: 'Won 2nd Runner Up.',
      evidenceUrl: '/evidence/mumbaihacks_cert_3.pdf',
      evidenceType: 'PDF',
      verificationRoute: 'EVENT_COORDINATOR',
      status: 'SUBMITTED',
    },
  });

  // Example E - Internship (Sachin Jha) - Verified Faculty
  const actInternship = await prisma.activity.create({
    data: {
      studentId: student1.id,
      type: 'Internship',
      title: 'Software Engineering Intern',
      date: new Date('2026-05-01'),
      organiser: 'Tata Consultancy Services (TCS)',
      role: 'Intern',
      description: 'Worked with the cloud integrations team to refactor internal data ingestion pipelines.',
      outcome: 'Optimized pipelines by 30% and received a Letter of Recommendation.',
      evidenceUrl: '/evidence/tcs_completion.pdf',
      evidenceType: 'PDF',
      verificationRoute: 'FACULTY_TG',
      status: 'VERIFIED',
      reviewerId: faculty.id,
      reviewerName: 'Dr. Alok Ranjan',
      reviewerComment: 'Outstanding internship performance. Letter of Recommendation verified.',
    },
  });

  // Create log for verified internship
  await prisma.verificationLog.create({
    data: {
      activityId: actInternship.id,
      actorId: userFaculty.id,
      actorName: 'Dr. Alok Ranjan',
      action: 'VERIFY',
      previousStatus: 'SUBMITTED',
      newStatus: 'VERIFIED',
      comment: 'Outstanding internship performance. Letter of Recommendation verified.',
      createdAt: new Date('2026-07-10T10:00:00Z'),
    },
  });

  // Example F - Award (Sachin Jha) - Verified Faculty
  const actAward = await prisma.activity.create({
    data: {
      studentId: student1.id,
      type: 'Award',
      title: 'Academic Excellence Award 2025',
      date: new Date('2025-10-10'),
      organiser: 'Institutional Academic Council',
      role: 'Recipient',
      description: 'Awarded for securing top GPA in the CSE department during the 3rd year.',
      outcome: 'Certificate of Merit and Rs. 10,000 cash prize.',
      evidenceUrl: '/evidence/academic_excellence.pdf',
      evidenceType: 'PDF',
      verificationRoute: 'FACULTY_TG',
      status: 'VERIFIED',
      reviewerId: faculty.id,
      reviewerName: 'Dr. Alok Ranjan',
      reviewerComment: 'Verified with departmental records. Congratulations!',
    },
  });

  await prisma.verificationLog.create({
    data: {
      activityId: actAward.id,
      actorId: userFaculty.id,
      actorName: 'Dr. Alok Ranjan',
      action: 'VERIFY',
      previousStatus: 'SUBMITTED',
      newStatus: 'VERIFIED',
      comment: 'Verified with departmental records. Congratulations!',
      createdAt: new Date('2025-10-15T14:30:00Z'),
    },
  });

  // Add some self study for other students
  await prisma.activity.create({
    data: {
      studentId: student2.id,
      type: 'Self-learning',
      title: 'Next.js Routing and API handlers',
      date: new Date('2026-06-25'),
      organiser: 'Next.js Docs',
      role: 'Self-learner',
      description: 'Self-study of App Router architecture, middleware, and route handlers.',
      outcome: 'Successfully implemented routing in personal sandbox projects.',
      evidenceUrl: 'https://nextjs.org/docs',
      evidenceType: 'URL',
      verificationRoute: 'SELF_DECLARED',
      status: 'SELF_DECLARED',
    },
  });

  console.log('Created Activities & Verification Logs.');

  // 5. Create Projects and Individual Contributions (Sachin Jha)
  const projSmartCampus = await prisma.projectContribution.create({
    data: {
      studentId: student1.id,
      projectName: 'Smart Campus Platform',
      projectDesc: 'A centralized campus monitoring and automated booking portal for students and faculty.',
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-04-15'),
      repoUrl: 'https://github.com/sachinjha/smart-campus',
      demoUrl: 'https://smart-campus-demo.edu',
      projectEvidence: '/evidence/smart_campus_report.pdf',
      role: 'Backend Developer',
      contribution: 'Designed REST APIs and PostgreSQL database integration. Managed OAuth2 authentication and automated email triggers.',
      technologies: 'Node.js, Express, PostgreSQL',
      verificationRoute: 'FACULTY_TG',
      status: 'SUBMITTED',
    },
  });

  console.log('Created Projects.');
  console.log('Database Seeding Completed Successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
