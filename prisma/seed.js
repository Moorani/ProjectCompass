const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@projectcompass.com' },
    update: {},
    create: {
      email: 'admin@projectcompass.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('Admin user created: admin@projectcompass.com / admin123');

  const categories = [
    { name: 'Web Applications', icon: 'web', description: 'Browser-based apps serving real user needs — CRUD tools, dashboards, and community platforms.' },
    { name: 'Mobile Applications', icon: 'mobile', description: 'Native or cross-platform apps for iOS and Android that solve on-the-go problems.' },
    { name: 'AI / ML Projects', icon: 'ai', description: 'Practical machine learning applications using pre-trained models or simple training pipelines.' },
    { name: 'Systems & Tools', icon: 'systems', description: 'Developer tools, CLI apps, automation scripts, and system-level programs.' },
    { name: 'Data-Driven Projects', icon: 'data', description: 'Apps that collect, process, visualise, or derive insight from structured datasets.' },
    { name: 'Social Impact Projects', icon: 'social', description: 'Solutions targeting education, health, accessibility, or community wellbeing.' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log('6 categories created');

  const webCat = await prisma.category.findUnique({ where: { name: 'Web Applications' } });
  const mobileCat = await prisma.category.findUnique({ where: { name: 'Mobile Applications' } });
  const aiCat = await prisma.category.findUnique({ where: { name: 'AI / ML Projects' } });
  const sysCat = await prisma.category.findUnique({ where: { name: 'Systems & Tools' } });
  const dataCat = await prisma.category.findUnique({ where: { name: 'Data-Driven Projects' } });
  const socialCat = await prisma.category.findUnique({ where: { name: 'Social Impact Projects' } });

  const projects = [
    {
      title: 'Student Budget Tracker',
      description: 'A personal finance tool for students to log expenses, set budgets, and view spending patterns.',
      problem: 'Students often overspend without realising it. This app provides a private, browser-based way to track income and expenses.',
      targetUsers: 'University students managing a monthly allowance or part-time income.',
      difficulty: 'Beginner',
      effort: '3-4 weeks',
      stack: ['React', 'localStorage', 'Chart.js'],
      coreFeatures: ['Add/edit/delete expense entries', 'Categorise spending', 'Monthly budget limits per category', 'Bar chart summary of spending vs budget'],
      notBuild: ['Bank account sync or open banking APIs', 'Multi-currency support', 'Cloud accounts or authentication'],
      extensions: ['Export data as CSV', 'Recurring expenses toggle', 'Dark mode'],
      categoryId: webCat.id,
    },
    {
      title: 'Study Group Finder',
      description: 'A platform where students post or join study groups by subject, university, and schedule.',
      problem: 'Students struggle to find peers to study with, especially in large universities or online programmes.',
      targetUsers: 'University students in the same course or subject area.',
      difficulty: 'Intermediate',
      effort: '5-7 weeks',
      stack: ['Next.js', 'Supabase', 'Tailwind CSS'],
      coreFeatures: ['Post a study group listing', 'Browse and filter by subject or tag', 'Join or leave a group', 'Basic user profile'],
      notBuild: ['Real-time chat or video calls', 'AI matching algorithms', 'Mobile app'],
      extensions: ['Email reminders', 'Ratings system', 'Location-based filtering'],
      categoryId: webCat.id,
    },
    {
      title: 'Campus Lost and Found Portal',
      description: 'A simple web portal where students report lost items and view found items posted by others.',
      problem: 'Campus lost-and-found processes are often undigitised. Items go unclaimed for weeks.',
      targetUsers: 'Students and staff within a specific university campus.',
      difficulty: 'Beginner',
      effort: '2-3 weeks',
      stack: ['HTML/CSS/JS', 'Firebase', 'Cloudinary'],
      coreFeatures: ['Post lost or found item with photo', 'Browse item listings', 'Contact form per listing', 'Mark item as returned'],
      notBuild: ['User authentication', 'In-app messaging', 'Mobile app'],
      extensions: ['Search by category or location', 'Email notifications', 'Moderation panel'],
      categoryId: webCat.id,
    },
    {
      title: 'Habit Streak Tracker',
      description: 'A minimal mobile app for tracking daily habits with streak counts and a weekly heatmap.',
      problem: 'Habit formation is difficult without visibility. Simple streak tracking creates motivation.',
      targetUsers: 'Students wanting to build consistent study or health routines.',
      difficulty: 'Beginner',
      effort: '3-4 weeks',
      stack: ['React Native', 'AsyncStorage', 'Expo'],
      coreFeatures: ['Add custom habits', 'Mark daily completion', 'Streak counter per habit', 'Weekly heatmap calendar view'],
      notBuild: ['Social sharing', 'AI habit suggestions', 'Push notification scheduling'],
      extensions: ['Reminder notifications', 'Habit categories', 'Statistics view'],
      categoryId: mobileCat.id,
    },
    {
      title: 'Lecture Notes Scanner',
      description: 'Mobile app that scans handwritten lecture notes using OCR and organises them by subject.',
      problem: 'Students have piles of handwritten notes with no easy way to search or archive them.',
      targetUsers: 'Students who take handwritten notes and want digital access.',
      difficulty: 'Intermediate',
      effort: '5-6 weeks',
      stack: ['Flutter', 'Firebase Storage', 'Google ML Kit'],
      coreFeatures: ['Capture or upload photo of notes', 'Run OCR to extract text', 'Organise by subject and date', 'Search extracted text'],
      notBuild: ['AI summarisation', 'PDF export with formatting', 'Shared notebooks'],
      extensions: ['Tag extraction', 'Cloud sync', 'Highlight keywords'],
      categoryId: mobileCat.id,
    },
    {
      title: 'Spam SMS Classifier',
      description: 'A web app that classifies text messages as spam or not spam using a trained ML model.',
      problem: 'SMS spam is a common nuisance. A simple classifier demonstrates a complete ML pipeline end-to-end.',
      targetUsers: 'CS students building their first ML web application.',
      difficulty: 'Intermediate',
      effort: '4-5 weeks',
      stack: ['Python', 'scikit-learn', 'Flask', 'React'],
      coreFeatures: ['Text input for message to classify', 'Train Naive Bayes model', 'Display classification result with confidence', 'Show model accuracy metrics'],
      notBuild: ['Real-time SMS integration', 'Custom training UI', 'Production deployment'],
      extensions: ['Confusion matrix visualisation', 'Multiple model comparison', 'Export predictions as CSV'],
      categoryId: aiCat.id,
    },
    {
      title: 'Handwritten Digit Recogniser',
      description: 'A web app where users draw a digit on a canvas and the model predicts which digit it is.',
      problem: 'MNIST is a classic learning dataset. Wrapping it in a web interface makes the project tangible.',
      targetUsers: 'CS students learning neural networks for the first time.',
      difficulty: 'Beginner',
      effort: '3-4 weeks',
      stack: ['Python', 'TensorFlow/Keras', 'Flask', 'Canvas API'],
      coreFeatures: ['Draw digit on HTML5 canvas', 'Send image to Flask backend', 'Run CNN trained on MNIST', 'Display top prediction and confidence'],
      notBuild: ['Multi-digit recognition', 'Custom alphabet sets', 'Mobile app'],
      extensions: ['Probability bar chart for all 10 digits', 'Let user retrain with drawings', 'Upload image file'],
      categoryId: aiCat.id,
    },
    {
      title: 'Movie Recommendation Engine',
      description: 'A collaborative filtering recommendation system built on the MovieLens dataset.',
      problem: 'Students struggle to understand recommender systems. Building one with real data closes that gap.',
      targetUsers: 'Intermediate CS students focused on data science or machine learning.',
      difficulty: 'Advanced',
      effort: '7-9 weeks',
      stack: ['Python', 'Pandas', 'Surprise SVD', 'React', 'FastAPI'],
      coreFeatures: ['Load and pre-process MovieLens dataset', 'Train SVD collaborative filtering model', 'Accept user rating inputs', 'Return personalised recommendations'],
      notBuild: ['Real-time streaming data', 'Deep learning models', 'User accounts or persistence'],
      extensions: ['Hybrid content-based filtering', 'A/B test two models', 'Evaluation metrics dashboard'],
      categoryId: aiCat.id,
    },
    {
      title: 'CLI Task Manager',
      description: 'A command-line tool for managing tasks with priorities, due dates, and completion status.',
      problem: 'Developers often want lightweight task management without opening a browser.',
      targetUsers: 'CS students learning Python and CLI tooling.',
      difficulty: 'Beginner',
      effort: '2-3 weeks',
      stack: ['Python', 'JSON', 'argparse'],
      coreFeatures: ['Add, list, complete, and delete tasks', 'Set priority level', 'Due date field', 'Persist tasks in a local JSON file'],
      notBuild: ['GUI', 'Cloud sync', 'Team collaboration features'],
      extensions: ['Colour-coded output by priority', 'Filter by due date or status', 'Export to Markdown'],
      categoryId: sysCat.id,
    },
    {
      title: 'Log File Analyser',
      description: 'A terminal UI that ingests web server log files and displays traffic summaries and error rates.',
      problem: 'Parsing raw log files manually is time-consuming. A TUI tool makes analysis interactive.',
      targetUsers: 'Students interested in systems programming and backend operations.',
      difficulty: 'Intermediate',
      effort: '4-5 weeks',
      stack: ['Go', 'Regex', 'Bubble Tea TUI'],
      coreFeatures: ['Parse Apache/NGINX common log format', 'Summarise request counts by status code', 'Top requested URLs list', 'Error rate over time'],
      notBuild: ['Real-time log streaming', 'Cloud log integration', 'Alerting system'],
      extensions: ['Filter logs by date range', 'IP geolocation lookup', 'Export report as text'],
      categoryId: sysCat.id,
    },
    {
      title: 'Public Transport Dashboard',
      description: 'An interactive dashboard visualising public transport routes, delays, and usage statistics.',
      problem: 'Open transit data exists but is hard to explore without tooling.',
      targetUsers: 'Data science students practising visualisation and data wrangling.',
      difficulty: 'Intermediate',
      effort: '5-6 weeks',
      stack: ['Python', 'Pandas', 'Dash', 'Plotly', 'GTFS data'],
      coreFeatures: ['Load GTFS static feed', 'Visualise routes on map', 'Show stop-level arrival statistics', 'Filter by route or time of day'],
      notBuild: ['Real-time arrival feeds', 'Fare calculation', 'Mobile app'],
      extensions: ['Heatmap of busiest stops', 'Delay pattern analysis', 'Compare weekday vs weekend'],
      categoryId: dataCat.id,
    },
    {
      title: 'Weather Pattern Explorer',
      description: 'A Flask app exploring historical weather data with interactive visualisations.',
      problem: 'Weather datasets are rich but unfamiliar. This project teaches data cleaning and EDA.',
      targetUsers: 'Beginner data science students doing their first EDA project.',
      difficulty: 'Beginner',
      effort: '3-4 weeks',
      stack: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Open-Meteo API'],
      coreFeatures: ['Fetch historical data from Open-Meteo API', 'Plot temperature and precipitation trends', 'Monthly averages comparison chart', 'Simple anomaly detection'],
      notBuild: ['Weather forecasting model', 'Real-time alerts', 'Mobile notifications'],
      extensions: ['Compare multiple cities', 'Correlation analysis', 'Interactive Plotly charts'],
      categoryId: dataCat.id,
    },
    {
      title: 'Volunteer Matching Platform',
      description: 'A platform connecting local NGOs with volunteers by skill set and availability.',
      problem: 'NGOs lack digital presence to recruit volunteers. Students want to contribute but do not know where.',
      targetUsers: 'Local nonprofits and university students with professional skills.',
      difficulty: 'Intermediate',
      effort: '6-8 weeks',
      stack: ['Django', 'PostgreSQL', 'Bootstrap'],
      coreFeatures: ['NGO posts opportunity with required skills', 'Volunteer registers with profile', 'Filter opportunities by skill and location', 'Apply and status tracking'],
      notBuild: ['Payment integration', 'Real-time chat', 'Mobile app'],
      extensions: ['Volunteer hours log', 'Certificate of participation generation', 'Rating system'],
      categoryId: socialCat.id,
    },
    {
      title: 'Accessible Learning Companion',
      description: 'A reading and comprehension tool for learners with dyslexia or visual impairments.',
      problem: 'Many online learning platforms are inaccessible. Simple features like text-to-speech help a wide audience.',
      targetUsers: 'Students with dyslexia or low vision using web learning resources.',
      difficulty: 'Advanced',
      effort: '8-10 weeks',
      stack: ['React', 'Node.js', 'MongoDB', 'Web Speech API'],
      coreFeatures: ['Text-to-speech for pasted content', 'Adjustable font size and dyslexia-friendly font', 'High-contrast mode toggle', 'Reading speed control'],
      notBuild: ['Screen reader integration', 'Content creation tools', 'AI-generated summaries'],
      extensions: ['Word-by-word highlighting', 'Progress tracker', 'Offline mode via PWA'],
      categoryId: socialCat.id,
    },
  ];

  for (const project of projects) {
    const existing = await prisma.project.findFirst({ where: { title: project.title } });
    if (!existing) {
      await prisma.project.create({ data: project });
    }
  }
  console.log('14 projects created');
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });