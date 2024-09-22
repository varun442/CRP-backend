const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models

const Event = require('./models/Event');
const User = require('./models/User');
const Issue = require('./models/Issue');
const Forum = require('./models/Forum');
const Points = require('./models/Points');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Event.deleteMany();
    await Issue.deleteMany();
    await Forum.deleteMany();
    await Points.deleteMany();

    // Seed Users
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = new User({
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: await bcrypt.hash('password123', 10),
        fullName: `User ${i}`,
        location: {
          address: `${i} Main St`,
          city: 'Anytown',
          state: 'ST',
          zipCode: '12345'
        },
        role: i === 0 ? 'admin' : i < 3 ? 'staff' : 'resident',
        points: Math.floor(Math.random() * 1000)
      });
      users.push(await user.save());
    }

    // Seed Events
    const eventTypes = ['town_hall', 'community_event', 'volunteer_opportunity'];
    const eventStatus = ['upcoming', 'ongoing', 'completed'];
    for (let i = 0; i < 10; i++) {
      const event = new Event({
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        date: new Date(Date.now() + Math.random() * 10000000000),
        location: `Location ${i}`,
        organizer: users[Math.floor(Math.random() * users.length)]._id,
        attendees: users.slice(0, Math.floor(Math.random() * users.length)).map(user => user._id),
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        status: eventStatus[Math.floor(Math.random() * eventStatus.length)],
        maxAttendees: Math.floor(Math.random() * 50) + 10,
        pointsReward: Math.floor(Math.random() * 100)
      });
      await event.save();
    }

    // Seed Issues
    const issueStatus = ['open', 'in_progress', 'resolved'];
    const issuePriority = ['low', 'medium', 'high'];
    for (let i = 0; i < 10; i++) {
      const issue = new Issue({
        title: `Issue ${i}`,
        description: `Description for Issue ${i}`,
        location: `Location ${i}`,
        reporter: users[Math.floor(Math.random() * users.length)]._id,
        status: issueStatus[Math.floor(Math.random() * issueStatus.length)],
        priority: issuePriority[Math.floor(Math.random() * issuePriority.length)],
        volunteers: users.slice(0, Math.floor(Math.random() * users.length)).map(user => user._id),
        pointsReward: Math.floor(Math.random() * 50)
      });
      await issue.save();
    }

    // Seed Forum Posts
    for (let i = 0; i < 10; i++) {
      const forumPost = new Forum({
        title: `Forum Post ${i}`,
        content: `Content for Forum Post ${i}`,
        author: users[Math.floor(Math.random() * users.length)]._id,
        likes: users.slice(0, Math.floor(Math.random() * users.length)).map(user => user._id),
        comments: [
          {
            author: users[Math.floor(Math.random() * users.length)]._id,
            content: `Comment on Post ${i}`,
            likes: users.slice(0, Math.floor(Math.random() * users.length)).map(user => user._id)
          }
        ],
        tags: [`tag${i}`, `category${i}`]
      });
      await forumPost.save();
    }

    // Seed Points Transactions
    const transactionReasons = ['event_attendance', 'volunteer_work', 'forum_participation', 'issue_resolution'];
    for (let i = 0; i < 10; i++) {
      const pointsTransaction = new Points({
        user: users[Math.floor(Math.random() * users.length)]._id,
        amount: Math.floor(Math.random() * 100),
        reason: transactionReasons[Math.floor(Math.random() * transactionReasons.length)],
        description: `Transaction ${i} description`
      });
      await pointsTransaction.save();
    }

    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();