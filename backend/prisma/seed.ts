import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.teamMember.deleteMany();

  // Create Team Members
  const member1 = await prisma.teamMember.create({
    data: { name: 'Arjun Kumar', email: 'arjun@codefancy.com' },
  });

  const member2 = await prisma.teamMember.create({
    data: { name: 'Priya Singh', email: 'priya@codefancy.com' },
  });

  const member3 = await prisma.teamMember.create({
    data: { name: 'Rajesh Patel', email: 'rajesh@codefancy.com' },
  });

  // Create Clients
  const client1 = await prisma.client.create({
    data: {
      name: 'Tech Startup Inc',
      email: 'contact@techstartup.com',
      phone: '+91-9876543210',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'E-Commerce Solutions',
      email: 'info@ecommerce.com',
      phone: '+91-9123456789',
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: 'Digital Marketing Agency',
      email: 'hello@digitalagency.com',
      phone: '+91-8765432109',
    },
  });

  // Create Projects for Client 1
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete redesign of tech startup website',
      status: 'In Progress',
      clientId: client1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Native iOS app for customer management',
      status: 'Not Started',
      clientId: client1.id,
    },
  });

  // Create Projects for Client 2
  const project3 = await prisma.project.create({
    data: {
      name: 'E-Commerce Platform',
      description: 'Build full e-commerce platform with payment integration',
      status: 'In Progress',
      clientId: client2.id,
    },
  });

  // Create Projects for Client 3
  const project4 = await prisma.project.create({
    data: {
      name: 'SEO Optimization',
      description: 'Complete SEO audit and optimization',
      status: 'Completed',
      clientId: client3.id,
    },
  });

  // Create Tasks for Project 1
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  await prisma.task.create({
    data: {
      title: 'Design Homepage Mockup',
      description: 'Create Figma mockups for homepage',
      status: 'Done',
      priority: 'High',
      dueDate: lastWeek,
      projectId: project1.id,
      assigneeId: member1.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Implement Homepage HTML/CSS',
      description: 'Convert Figma design to responsive HTML/CSS',
      status: 'In Progress',
      priority: 'High',
      dueDate: tomorrow,
      projectId: project1.id,
      assigneeId: member2.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Setup Testing Environment',
      description: 'Configure Jest and E2E tests',
      status: 'Todo',
      priority: 'Medium',
      dueDate: nextWeek,
      projectId: project1.id,
      assigneeId: member3.id,
    },
  });

  // Create Tasks for Project 2
  await prisma.task.create({
    data: {
      title: 'Requirements Gathering',
      description: 'Collect detailed requirements from client',
      status: 'Todo',
      priority: 'High',
      dueDate: tomorrow,
      projectId: project2.id,
      assigneeId: member1.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'App Architecture Design',
      description: 'Design app architecture and database schema',
      status: 'Todo',
      priority: 'High',
      dueDate: nextWeek,
      projectId: project2.id,
      assigneeId: member2.id,
    },
  });

  // Create Tasks for Project 3
  await prisma.task.create({
    data: {
      title: 'Product Database Design',
      description: 'Design product catalog database schema',
      status: 'Done',
      priority: 'High',
      dueDate: lastWeek,
      projectId: project3.id,
      assigneeId: member2.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Payment Gateway Integration',
      description: 'Integrate Stripe or Razorpay',
      status: 'In Progress',
      priority: 'High',
      dueDate: tomorrow,
      projectId: project3.id,
      assigneeId: member3.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'User Authentication',
      description: 'Implement user signup and login',
      status: 'Todo',
      priority: 'Medium',
      dueDate: nextWeek,
      projectId: project3.id,
      assigneeId: member1.id,
    },
  });

  // Tasks for Project 4 (All completed - to show completed project)
  await prisma.task.create({
    data: {
      title: 'Initial SEO Audit',
      description: 'Audit website for SEO issues',
      status: 'Done',
      priority: 'High',
      dueDate: lastWeek,
      projectId: project4.id,
      assigneeId: member2.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Implement SEO Changes',
      description: 'Update metadata, improve site speed',
      status: 'Done',
      priority: 'High',
      dueDate: lastWeek,
      projectId: project4.id,
      assigneeId: member3.id,
    },
  });

  console.log('✅ Seed data created successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });