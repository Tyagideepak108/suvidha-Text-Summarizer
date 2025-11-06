const { User, Article, Summary } = require('./models');

async function checkData() {
  try {
    const userCount = await User.count();
    const articleCount = await Article.count();
    const summaryCount = await Summary.count();
    
    console.log('Database Records:');
    console.log(`- Users: ${userCount}`);
    console.log(`- Articles: ${articleCount}`);
    console.log(`- Summaries: ${summaryCount}`);
    
    if (userCount > 0) {
      const users = await User.findAll({ attributes: ['id', 'email', 'createdAt'] });
      console.log('\nUsers:');
      users.forEach(u => console.log(`  ${u.id}. ${u.email} (${u.createdAt})`));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkData();
