// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing database records (in reverse dependency order)
  await prisma.auditLog.deleteMany({});
  await prisma.profileLink.deleteMany({});
  await prisma.studentSkill.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.evidence.deleteMany({});
  await prisma.verificationLog.deleteMany({});
  await prisma.projectContribution.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.activityCategory.deleteMany({});
  await prisma.academicRecord.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.sIG.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.faculty.deleteMany({});
  await prisma.coordinator.deleteMany({});
  await prisma.principal.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.institution.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Institution
  const institution = await prisma.institution.create({
    data: {
      name: 'SIH Institute of Higher Education',
      code: 'SIH-EDU',
    },
  });

  // 2. Create Departments
  const deptCSE = await prisma.department.create({
    data: {
      name: 'Computer Science & Engineering',
      code: 'CSE',
      institutionId: institution.id,
    },
  });

  const deptIT = await prisma.department.create({
    data: {
      name: 'Information Technology',
      code: 'IT',
      institutionId: institution.id,
    },
  });

  console.log('Created Departments.');

  // 3. Create Programs
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

  // 4. Create Activity Categories
  const categories = [
    { name: 'Hackathon', requiresEvidence: true, evidenceClass: 'CERTIFICATE', verificationType: 'EVENT_COORDINATOR', verificationAuthority: 'COORDINATOR' },
    { name: 'Competition', requiresEvidence: true, evidenceClass: 'CERTIFICATE', verificationType: 'EVENT_COORDINATOR', verificationAuthority: 'COORDINATOR' },
    { name: 'Workshop', requiresEvidence: true, evidenceClass: 'CERTIFICATE', verificationType: 'EVENT_COORDINATOR', verificationAuthority: 'COORDINATOR' },
    { name: 'Seminar', requiresEvidence: true, evidenceClass: 'CERTIFICATE', verificationType: 'EVENT_COORDINATOR', verificationAuthority: 'COORDINATOR' },
    { name: 'Club/SIG Participation', requiresEvidence: true, evidenceClass: 'SCREENSHOT', verificationType: 'EVENT_COORDINATOR', verificationAuthority: 'COORDINATOR' },
    { name: 'Project', requiresEvidence: true, evidenceClass: 'SCREENSHOT', verificationType: 'FACULTY_TG', verificationAuthority: 'FACULTY' },
    { name: 'Research', requiresEvidence: true, evidenceClass: 'CERTIFICATE', verificationType: 'FACULTY_TG', verificationAuthority: 'FACULTY' },
    { name: 'Internship', requiresEvidence: true, evidenceClass: 'CERTIFICATE', verificationType: 'FACULTY_TG', verificationAuthority: 'FACULTY' },
    { name: 'Award', requiresEvidence: true, evidenceClass: 'CERTIFICATE', verificationType: 'FACULTY_TG', verificationAuthority: 'FACULTY' },
    { name: 'Certification', requiresEvidence: true, evidenceClass: 'CERTIFICATE', verificationType: 'FACULTY_TG', verificationAuthority: 'FACULTY' },
    { name: 'YouTube Learning', requiresEvidence: false, evidenceClass: 'NONE', verificationType: 'SELF_DECLARED', verificationRequired: false, allowedSelfDeclaration: true, verificationAuthority: 'NONE' },
    { name: 'Self-study', requiresEvidence: false, evidenceClass: 'NONE', verificationType: 'SELF_DECLARED', verificationRequired: false, allowedSelfDeclaration: true, verificationAuthority: 'NONE' },
    { name: 'Personal Practice', requiresEvidence: false, evidenceClass: 'NONE', verificationType: 'SELF_DECLARED', verificationRequired: false, allowedSelfDeclaration: true, verificationAuthority: 'NONE' },
    { name: 'Unhosted Personal Project', requiresEvidence: false, evidenceClass: 'NONE', verificationType: 'SELF_DECLARED', verificationRequired: false, allowedSelfDeclaration: true, verificationAuthority: 'NONE' },
  ];

  const dbCategories: any = {};
  for (const cat of categories) {
    dbCategories[cat.name] = await prisma.activityCategory.create({
      data: cat,
    });
  }
  console.log('Created Activity Categories.');

  // 5. Create Skills
  const skillsList = [
    { name: 'React.js', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Prisma ORM', category: 'Database' },
    { name: 'Python', category: 'Backend' },
    { name: 'Git & GitHub', category: 'Devops' },
    { name: 'UI/UX Figma', category: 'Design' },
  ];

  const dbSkills: any = {};
  for (const sk of skillsList) {
    dbSkills[sk.name] = await prisma.skill.create({
      data: sk,
    });
  }
  console.log('Created Skills.');

  // 6. Create Users & Profiles
  // HOD / Admin User
  const userAdmin = await prisma.user.create({
    data: {
      email: 'hod.cse@sih.edu',
      name: 'Dr. Rajesh Patil',
      passwordHash: 'admin123',
      role: 'ADMIN',
    },
  });

  // Principal User
  const userPrincipal = await prisma.user.create({
    data: {
      email: 'principal@sih.edu',
      name: 'Dr. Shruti Sharma',
      passwordHash: 'principal123',
      role: 'PRINCIPAL',
    },
  });

  const principal = await prisma.principal.create({
    data: {
      userId: userPrincipal.id,
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

  // Create SIG and Event records for Coordinator scope
  const sigAcm = await prisma.sIG.create({
    data: {
      name: 'ACM Student Chapter',
      description: 'Association for Computing Machinery official student body.',
      coordinatorId: coordinator.id,
    },
  });

  const eventHacks = await prisma.event.create({
    data: {
      name: 'MumbaiHacks 2026',
      description: 'Annual hackathon focused on city and civic solutions.',
      date: new Date('2026-07-20'),
      coordinatorId: coordinator.id,
    },
  });

  console.log('Created Core Institutional Profiles.');

  // Create 10 Students
  const studentsData = [
    { name: 'Sachin Jha', email: 'sachin@sih.edu', pass: 'sachin123', roll: '2026CSE001', sem: 7, cgpa: 9.1, sgpa: 9.3, att: 88.5, comp: 85, progId: progBTechCSE.id, deptId: deptCSE.id },
    { name: 'Hritik Jha', email: 'hritik@sih.edu', pass: 'hritik123', roll: '2026CSE002', sem: 7, cgpa: 8.7, sgpa: 8.9, att: 82.0, comp: 80, progId: progBTechCSE.id, deptId: deptCSE.id },
    { name: 'Yash Gupta', email: 'yash@sih.edu', pass: 'yash123', roll: '2026CSE003', sem: 7, cgpa: 8.5, sgpa: 8.4, att: 79.5, comp: 78, progId: progBTechCSE.id, deptId: deptCSE.id },
    { name: 'Divya Sharma', email: 'divya@sih.edu', pass: 'student123', roll: '2026CSE004', sem: 7, cgpa: 9.4, sgpa: 9.6, att: 92.4, comp: 90, progId: progBTechCSE.id, deptId: deptCSE.id },
    { name: 'Ananya Goel', email: 'ananya@sih.edu', pass: 'student123', roll: '2026CSE005', sem: 7, cgpa: 7.9, sgpa: 8.1, att: 75.0, comp: 72, progId: progBTechCSE.id, deptId: deptCSE.id },
    { name: 'Amit Verma', email: 'amit@sih.edu', pass: 'student123', roll: '2026IT001', sem: 7, cgpa: 8.2, sgpa: 8.0, att: 80.5, comp: 75, progId: progBTechIT.id, deptId: deptIT.id },
    { name: 'Priya Iyer', email: 'priya@sih.edu', pass: 'student123', roll: '2026IT002', sem: 5, cgpa: 8.9, sgpa: 9.0, att: 86.4, comp: 82, progId: progBTechIT.id, deptId: deptIT.id },
    { name: 'Rohit Mehta', email: 'rohit@sih.edu', pass: 'student123', roll: '2026IT003', sem: 5, cgpa: 7.4, sgpa: 7.2, att: 70.2, comp: 68, progId: progBTechIT.id, deptId: deptIT.id },
    { name: 'Sneha Rao', email: 'sneha@sih.edu', pass: 'student123', roll: '2026IT004', sem: 5, cgpa: 9.0, sgpa: 9.1, att: 91.0, comp: 84, progId: progBTechIT.id, deptId: deptIT.id },
    { name: 'Rahul Sen', email: 'rahul@sih.edu', pass: 'student123', roll: '2026IT005', sem: 3, cgpa: 8.0, sgpa: 8.2, att: 84.0, comp: 70, progId: progBTechIT.id, deptId: deptIT.id },
  ];

  const dbStudents: any[] = [];
  for (const st of studentsData) {
    const user = await prisma.user.create({
      data: {
        email: st.email,
        name: st.name,
        passwordHash: st.pass,
        role: 'STUDENT',
      },
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        rollNumber: st.roll,
        institutionId: institution.id,
        departmentId: st.deptId,
        programId: st.progId,
        currentSemester: st.sem,
        batch: st.sem >= 7 ? '2022-2026' : st.sem >= 5 ? '2023-2027' : '2024-2028',
        cgpa: st.cgpa,
        sgpa: st.sgpa,
        attendance: st.att,
        profileCompletion: st.comp,
      },
    });

    // Create Academic Records for students
    for (let s = 1; s < st.sem; s++) {
      await prisma.academicRecord.create({
        data: {
          studentId: student.id,
          semester: s,
          sgpa: st.cgpa - 0.2 + (Math.random() * 0.4),
          cgpa: st.cgpa,
          attendance: st.att - 2 + (Math.random() * 4),
          examStatus: 'PASS',
        },
      });
    }

    dbStudents.push({ ...student, user });
  }
  console.log('Created 10 Student Profiles with Academic Records.');

  const studentSachin = dbStudents[0];
  const studentHritik = dbStudents[1];
  const studentYash = dbStudents[2];
  const studentDivya = dbStudents[3];
  const studentAnanya = dbStudents[4];

  // 7. Create Student Profile Links (For Sachin)
  const profileLinks = [
    { platformName: 'LinkedIn', profileUrl: 'https://linkedin.com/in/sachinjha-demo', displayOrder: 1 },
    { platformName: 'GitHub', profileUrl: 'https://github.com/sachinjha-demo', displayOrder: 2 },
    { platformName: 'LeetCode', profileUrl: 'https://leetcode.com/sachinjha-demo', displayOrder: 3 },
    { platformName: 'ORCID', profileUrl: 'https://orcid.org/0009-0001-9988-7766', displayOrder: 4 },
  ];

  for (const pl of profileLinks) {
    await prisma.profileLink.create({
      data: {
        studentId: studentSachin.id,
        ...pl,
      },
    });
  }

  // Create profile links for Hritik
  await prisma.profileLink.create({
    data: {
      studentId: studentHritik.id,
      platformName: 'LinkedIn',
      profileUrl: 'https://linkedin.com/in/hritikjha-demo',
    },
  });
  await prisma.profileLink.create({
    data: {
      studentId: studentHritik.id,
      platformName: 'GitHub',
      profileUrl: 'https://github.com/hritikjha-demo',
    },
  });

  console.log('Created Student Profile Links.');

  // 8. Create Student Skills (Sachin, Hritik)
  await prisma.studentSkill.create({
    data: {
      studentId: studentSachin.id,
      skillId: dbSkills['React.js'].id,
      level: 'Expert',
      status: 'SELF_DECLARED',
    },
  });
  await prisma.studentSkill.create({
    data: {
      studentId: studentSachin.id,
      skillId: dbSkills['Node.js'].id,
      level: 'Intermediate',
      status: 'VERIFIED',
      verifiedBy: 'Dr. Alok Ranjan',
    },
  });
  await prisma.studentSkill.create({
    data: {
      studentId: studentHritik.id,
      skillId: dbSkills['Next.js'].id,
      level: 'Expert',
      status: 'SELF_DECLARED',
    },
  });

  console.log('Created Student Skills.');

  // 9. Create Activities
  // Student A (Sachin Jha) - YouTube React Learning (Self Declared / Unverified)
  const actYouTube = await prisma.activity.create({
    data: {
      studentId: studentSachin.id,
      categoryId: dbCategories['YouTube Learning'].id,
      type: 'YouTube Learning',
      title: 'React.js Complete Tutorial for Beginners',
      date: new Date('2026-06-10'),
      organiser: 'YouTube (Academind)',
      role: 'Self-directed learner',
      description: 'Completed a 30-hour crash course on React components, props, hooks, routing, and context API. Formulated notes and implemented 3 microprojects.',
      outcome: 'Built a local counter, simple calculator, and weather widget application.',
      verificationRoute: 'SELF_DECLARED',
      status: 'SELF_DECLARED',
    },
  });

  await prisma.verificationLog.create({
    data: {
      activityId: actYouTube.id,
      actorId: studentSachin.userId,
      actorName: studentSachin.user.name,
      action: 'SUBMIT',
      previousStatus: 'DRAFT',
      newStatus: 'SELF_DECLARED',
      comment: 'YouTube React tutorial completed. Self-declared successfully.',
    },
  });

  // Student A (Sachin Jha) - Hackathon (EvidenceUploaded, routed to Coordinator, status: VERIFIED)
  const actHackathon1 = await prisma.activity.create({
    data: {
      studentId: studentSachin.id,
      categoryId: dbCategories['Hackathon'].id,
      type: 'Hackathon',
      title: 'MumbaiHacks 2026',
      date: new Date('2026-07-20'),
      organiser: 'Mumbai Tech SIG',
      role: 'Backend/API Developer',
      description: 'Worked in a team of 4 to design a REST API backend utilizing Node.js, Express, and SQLite. Hooked up JWT auth and email alerts.',
      outcome: 'Won 2nd Runner Up; built a fully working prototype.',
      evidenceUrl: '/evidence/mumbaihacks_cert.pdf',
      evidenceType: 'PDF',
      verificationRoute: 'EVENT_COORDINATOR',
      status: 'VERIFIED',
      reviewerId: coordinator.id,
      reviewerName: 'Prof. Neha Sharma',
      reviewerComment: 'Participation confirmed. Outstanding work representing the institution!',
      coordinatorReviewerId: coordinator.id,
    },
  });

  await prisma.verificationLog.create({
    data: {
      activityId: actHackathon1.id,
      actorId: studentSachin.userId,
      actorName: studentSachin.user.name,
      action: 'SUBMIT',
      previousStatus: 'DRAFT',
      newStatus: 'SUBMITTED',
      comment: 'Submitted certificate for review.',
    },
  });

  await prisma.verificationLog.create({
    data: {
      activityId: actHackathon1.id,
      actorId: userCoordinator.id,
      actorName: 'Prof. Neha Sharma',
      action: 'VERIFY',
      previousStatus: 'SUBMITTED',
      newStatus: 'VERIFIED',
      comment: 'Participation confirmed. Outstanding work representing the institution!',
    },
  });

  // Other students in same hackathon (Hritik, Yash) - status: SUBMITTED
  await prisma.activity.create({
    data: {
      studentId: studentHritik.id,
      categoryId: dbCategories['Hackathon'].id,
      type: 'Hackathon',
      title: 'MumbaiHacks 2026',
      date: new Date('2026-07-20'),
      organiser: 'Mumbai Tech SIG',
      role: 'Frontend UI Developer',
      description: 'Implemented the UI designs using React.js and Tailwind CSS. Managed component state and linked up with endpoints.',
      outcome: 'Won 2nd Runner Up.',
      evidenceUrl: '/evidence/mumbaihacks_cert_hritik.pdf',
      evidenceType: 'PDF',
      verificationRoute: 'EVENT_COORDINATOR',
      status: 'SUBMITTED',
    },
  });

  await prisma.activity.create({
    data: {
      studentId: studentYash.id,
      categoryId: dbCategories['Hackathon'].id,
      type: 'Hackathon',
      title: 'MumbaiHacks 2026',
      date: new Date('2026-07-20'),
      organiser: 'Mumbai Tech SIG',
      role: 'Database Lead',
      description: 'Set up schema models and handled querying with pagination and filters.',
      outcome: 'Won 2nd Runner Up.',
      evidenceUrl: '/evidence/mumbaihacks_cert_yash.pdf',
      evidenceType: 'PDF',
      verificationRoute: 'EVENT_COORDINATOR',
      status: 'SUBMITTED',
    },
  });

  // Student B (Hritik Jha) - ACM SIG Workshop (Verified by Coordinator)
  const actWorkshop = await prisma.activity.create({
    data: {
      studentId: studentHritik.id,
      categoryId: dbCategories['Workshop'].id,
      type: 'Workshop',
      title: 'Full Stack Next.js Workshop',
      date: new Date('2026-06-25'),
      organiser: 'ACM Student Chapter',
      role: 'Attendee',
      description: 'Learned App router, Server components, routing, fetch caching, and server actions.',
      outcome: 'Completed 2 sample dashboard implementations.',
      evidenceUrl: '/evidence/acm_nextjs_workshop.pdf',
      evidenceType: 'PDF',
      verificationRoute: 'EVENT_COORDINATOR',
      status: 'VERIFIED',
      reviewerId: coordinator.id,
      reviewerName: 'Prof. Neha Sharma',
      reviewerComment: 'Attendance verified in sign-in register.',
      coordinatorReviewerId: coordinator.id,
    },
  });

  await prisma.verificationLog.create({
    data: {
      activityId: actWorkshop.id,
      actorId: userCoordinator.id,
      actorName: 'Prof. Neha Sharma',
      action: 'VERIFY',
      previousStatus: 'SUBMITTED',
      newStatus: 'VERIFIED',
      comment: 'Attendance verified in sign-in register.',
    },
  });

  // Student C (Yash Gupta) - TCS Internship (Verified by Faculty)
  const actInternship = await prisma.activity.create({
    data: {
      studentId: studentYash.id,
      categoryId: dbCategories['Internship'].id,
      type: 'Internship',
      title: 'TCS Remote Internship',
      date: new Date('2026-05-15'),
      organiser: 'Tata Consultancy Services',
      role: 'Intern',
      description: 'Worked with cloud service teams to catalog microservice APIs and configure swagger docs.',
      outcome: 'API dictionary formatted for 5 services.',
      evidenceUrl: '/evidence/tcs_cert.pdf',
      evidenceType: 'PDF',
      verificationRoute: 'FACULTY_TG',
      status: 'VERIFIED',
      reviewerId: faculty.id,
      reviewerName: 'Dr. Alok Ranjan',
      reviewerComment: 'Internship certificate verified with registrar record.',
      facultyReviewerId: faculty.id,
    },
  });

  // Student D (Divya Sharma) - Academic Excellence Award (Verified by Faculty)
  await prisma.activity.create({
    data: {
      studentId: studentDivya.id,
      categoryId: dbCategories['Award'].id,
      type: 'Award',
      title: 'Academic Excellence Award 2025',
      date: new Date('2025-10-10'),
      organiser: 'Institutional Council',
      role: 'Award Recipient',
      description: 'Secured top SGPA rank in 5th semester (CSE). Cash prize and merit shield.',
      outcome: 'Academic Merit Certificate.',
      evidenceUrl: '/evidence/academic_excellence_divya.pdf',
      evidenceType: 'PDF',
      verificationRoute: 'FACULTY_TG',
      status: 'VERIFIED',
      reviewerId: faculty.id,
      reviewerName: 'Dr. Alok Ranjan',
      reviewerComment: 'Academic records double checked. Outstanding academic consistency!',
      facultyReviewerId: faculty.id,
    },
  });

  // Student E (Ananya Goel) - Self Study python (Self Declared / Unverified)
  await prisma.activity.create({
    data: {
      studentId: studentAnanya.id,
      categoryId: dbCategories['Self-study'].id,
      type: 'Self-study',
      title: 'Python for Data Science Crash Course',
      date: new Date('2026-04-10'),
      organiser: 'Coursera (Self study)',
      role: 'Self-learner',
      description: 'Completed basic syntax, loops, numpy arrays, and basic pandas dataframes.',
      outcome: 'Formulated notebook with simple titanic dataset analysis.',
      verificationRoute: 'SELF_DECLARED',
      status: 'SELF_DECLARED',
    },
  });

  console.log('Created Activities.');

  // 10. Team Project Scenario (Smart Campus Platform)
  // Shared Project entry
  const projectSmart = await prisma.project.create({
    data: {
      name: 'Smart Campus Platform',
      description: 'A comprehensive campus portal tracking attendance registers, scheduling seminar halls, and handling booking slots for laboratories.',
      type: 'TEAM',
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-04-15'),
      repoUrl: 'https://github.com/sachinjha-demo/smart-campus',
      demoUrl: 'https://smart-campus-demo.sih.edu',
      technologies: 'React, Node.js, Express, PostgreSQL, Prisma',
    },
  });

  // Sachins Contribution (Backend developer, Routed to Faculty, Status: SUBMITTED)
  await prisma.projectContribution.create({
    data: {
      studentId: studentSachin.id,
      projectId: projectSmart.id,
      projectName: projectSmart.name,
      projectDesc: projectSmart.description,
      startDate: projectSmart.startDate,
      endDate: projectSmart.endDate,
      repoUrl: projectSmart.repoUrl,
      demoUrl: projectSmart.demoUrl,
      projectEvidence: '/evidence/smart_campus_report.pdf',
      role: 'Backend/API Developer',
      contribution: 'Designed and deployed REST APIs for user verification and lab bookings. Constructed PostgreSQL tables and schemas using Prisma ORM. Integrated SMTP triggers for notifications.',
      technologies: 'Node.js, Express, PostgreSQL, Prisma',
      verificationRoute: 'FACULTY_TG',
      status: 'SUBMITTED',
    },
  });

  // Hritik's Contribution (Frontend, Status: VERIFIED by Faculty)
  const projContHritik = await prisma.projectContribution.create({
    data: {
      studentId: studentHritik.id,
      projectId: projectSmart.id,
      projectName: projectSmart.name,
      projectDesc: projectSmart.description,
      startDate: projectSmart.startDate,
      endDate: projectSmart.endDate,
      repoUrl: projectSmart.repoUrl,
      demoUrl: projectSmart.demoUrl,
      projectEvidence: '/evidence/smart_campus_report.pdf',
      role: 'Frontend Developer',
      contribution: 'Built responsive dashboard interfaces using React.js and Tailwind CSS. Implemented charts for booking statistics and managed Client queries using TanStack Query.',
      technologies: 'React, Tailwind CSS, TanStack Query',
      verificationRoute: 'FACULTY_TG',
      status: 'VERIFIED',
      reviewerId: faculty.id,
      reviewerName: 'Dr. Alok Ranjan',
      reviewerComment: 'Excellent UI layout. Contribution verified by checking Git repository commit details.',
      facultyReviewerId: faculty.id,
    },
  });

  await prisma.verificationLog.create({
    data: {
      contributionId: projContHritik.id,
      actorId: userFaculty.id,
      actorName: 'Dr. Alok Ranjan',
      action: 'VERIFY',
      previousStatus: 'SUBMITTED',
      newStatus: 'VERIFIED',
      comment: 'Excellent UI layout. Contribution verified by checking Git repository commit details.',
    },
  });

  // Yash's Contribution (Database integration, Status: SUBMITTED)
  await prisma.projectContribution.create({
    data: {
      studentId: studentYash.id,
      projectId: projectSmart.id,
      projectName: projectSmart.name,
      projectDesc: projectSmart.description,
      startDate: projectSmart.startDate,
      endDate: projectSmart.endDate,
      repoUrl: projectSmart.repoUrl,
      demoUrl: projectSmart.demoUrl,
      projectEvidence: '/evidence/smart_campus_report.pdf',
      role: 'Database Engineer',
      contribution: 'Designed database indices and query procedures to prevent lookup latencies. Formulated migration plans.',
      technologies: 'PostgreSQL, Prisma ORM',
      verificationRoute: 'FACULTY_TG',
      status: 'SUBMITTED',
    },
  });

  // Divya's Contribution (Documentation & Coordination, Status: VERIFIED)
  const projContDivya = await prisma.projectContribution.create({
    data: {
      studentId: studentDivya.id,
      projectId: projectSmart.id,
      projectName: projectSmart.name,
      projectDesc: projectSmart.description,
      startDate: projectSmart.startDate,
      endDate: projectSmart.endDate,
      repoUrl: projectSmart.repoUrl,
      demoUrl: projectSmart.demoUrl,
      projectEvidence: '/evidence/smart_campus_report.pdf',
      role: 'Documentation & QA Coordinator',
      contribution: 'Wrote comprehensive Swagger docs. Prepared functional system requirements document and designed 15 test scripts.',
      technologies: 'Postman, Swagger, Swagger UI',
      verificationRoute: 'FACULTY_TG',
      status: 'VERIFIED',
      reviewerId: faculty.id,
      reviewerName: 'Dr. Alok Ranjan',
      reviewerComment: 'Documentation is exhaustive and highly structured. Excellent QA ledger.',
      facultyReviewerId: faculty.id,
    },
  });

  await prisma.verificationLog.create({
    data: {
      contributionId: projContDivya.id,
      actorId: userFaculty.id,
      actorName: 'Dr. Alok Ranjan',
      action: 'VERIFY',
      previousStatus: 'SUBMITTED',
      newStatus: 'VERIFIED',
      comment: 'Documentation is exhaustive and highly structured. Excellent QA ledger.',
    },
  });

  console.log('Created Multi-member Team Project & Independent Contributions.');
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
