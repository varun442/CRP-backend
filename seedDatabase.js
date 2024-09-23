const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

require('dotenv').config();

// Import models
const Event = require('./models/Event');
const User = require('./models/User');
const Issue = require('./models/Issue');
const Forum = require('./models/Forum');
const Recognition = require('./models/Recognition');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  console.log('All collections have been cleared.');
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await clearDatabase();

    // Seed Users
    const users = [];
    const roles = ['admin', 'staff', 'staff', ...Array(47).fill('resident')];
    for (let i = 0; i < 50; i++) {
      const user = new User({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: await bcrypt.hash('password123', 10),
        fullName: faker.person.fullName(),
        location: {
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode()
        },
        role: roles[i],
        points: faker.number.int({ min: 0, max: 500 }),
        gained_points: 0,
        gifted_points: 0,
        available_points: 0
      });
      users.push(await user.save());
    }

    // Seed Events
    const eventTypes = ['town_hall', 'community_event', 'volunteer_opportunity', 'other'];
    const approvalStatus = ['pending', 'approved', 'rejected'];

    for (let i = 0; i < 50; i++) {
      const eventDate = faker.date.between({ from: '2024-09-01', to: '2024-09-01'});
      const eventApprovalStatus = approvalStatus[Math.floor(Math.random() * approvalStatus.length)];
      const eventStatusValue = eventDate < new Date() ? 'completed' : 'upcoming';

      const event = new Event({
        title: faker.company.catchPhrase(),
        description: faker.lorem.paragraph(),
        date: eventDate,
        location: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}`,
        organizer: users[Math.floor(Math.random() * users.length)]._id,
        attendees: users.slice(0, Math.floor(Math.random() * users.length)).map(user => user._id),
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        status: eventStatusValue,
        maxAttendees: faker.number.int({ min: 20, max: 100 }),
        pointsReward: faker.number.int({ min: 50, max: 200 }),
        approvalStatus: eventApprovalStatus,
        rejectionReason: eventApprovalStatus === 'rejected' ? faker.lorem.sentence() : null
      });

      await event.save();
    }

    // Seed Issues
    const issueStatus = ['open', 'in_progress', 'resolved'];
    const issuePriority = ['low', 'medium', 'high'];
    for (let i = 0; i < 10; i++) {
      const issue = new Issue({
        title: faker.lorem.words(3),
        description: faker.lorem.sentences(),
        location: faker.address.streetAddress(),
        reporter: users[Math.floor(Math.random() * users.length)]._id,
        status: issueStatus[Math.floor(Math.random() * issueStatus.length)],
        priority: issuePriority[Math.floor(Math.random() * issuePriority.length)],
        volunteers: users.slice(0, Math.floor(Math.random() * users.length)).map(user => user._id),
        pointsReward: faker.number.int({ min: 10, max: 50 })
      });
      await issue.save();
    }

    // Seed Forum Posts
    for (let i = 0; i < 50; i++) {
      const forumPost = new Forum({
        title: faker.lorem.words(3),
        content: faker.lorem.paragraphs(),
        author: users[Math.floor(Math.random() * users.length)]._id,
        likes: users.slice(0, Math.floor(Math.random() * users.length)).map(user => user._id),
        comments: [
          {
            author: users[Math.floor(Math.random() * users.length)]._id,
            content: faker.lorem.sentence(),
            likes: users.slice(0, Math.floor(Math.random() * users.length)).map(user => user._id)
          }
        ],
        tags: faker.lorem.words(2).split(' ')
      });
      await forumPost.save();
    }

    // Seed Recognition Data
    const recognitionCategories = ['Helpfulness', 'Leadership', 'Innovation', 'Teamwork', 'Community Spirit'];
    
    for (let i = 0; i < 100; i++) {
      const fromUser = users[Math.floor(Math.random() * users.length)];
      let toUser;
      do {
        toUser = users[Math.floor(Math.random() * users.length)];
      } while (toUser._id.equals(fromUser._id));

      const recognition = new Recognition({
        fromUserId: fromUser._id,
        toUserId: toUser._id,
        message: `${fromUser.fullName} recognizes ${toUser.fullName} for their ${faker.lorem.words(3)}.`,
        category: recognitionCategories[Math.floor(Math.random() * recognitionCategories.length)],
        points: faker.number.int({ min: 10, max: 50 }),
        date: faker.date.recent(30)
      });

      await recognition.save();

      // Update the recipient's points
      await User.findByIdAndUpdate(toUser._id, {
        $inc: {
          points: recognition.points,
          gained_points: recognition.points,
          available_points: recognition.points
        }
      });

      // Update the giver's gifted_points
      await User.findByIdAndUpdate(fromUser._id, {
        $inc: { gifted_points: recognition.points }
      });
    }

    console.log('Database seeded successfully with fake realistic data.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();
