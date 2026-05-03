require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gamified_learning');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
    process.exit(1);
  }
};

// Lesson Schema
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String, default: '' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  order: { type: Number, default: 0 },
  contentType: { type: String, enum: ['video', 'text', 'mixed'], default: 'text' },
  videoUrl: { type: String, default: '' },
  duration: { type: Number, default: 0 },
  xpReward: { type: Number, default: 50 },
  pointsReward: { type: Number, default: 10 },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  resources: [{ title: String, url: String, type: String }],
}, { timestamps: true });

const Lesson = mongoose.model('Lesson', lessonSchema);

const mernContent = `<h2>What is MERN Stack?</h2>
<p>The <strong>MERN Stack</strong> is a modern JavaScript-based web development framework consisting of four powerful technologies that work together seamlessly:</p>
<ul>
<li><strong>M</strong>ongoDB - NoSQL Database</li>
<li><strong>E</strong>xpress.js - Backend Web Framework</li>
<li><strong>R</strong>eact - Frontend UI Library</li>
<li><strong>N</strong>ode.js - JavaScript Runtime</li>
</ul>
<p>Together, these technologies enable you to build full-stack web applications using JavaScript across both frontend and backend, creating a unified development experience.</p>

<h2>Full-Stack Architecture</h2>
<p>Understanding how these four components work together is crucial:</p>
<pre><code>CLIENT SIDE (Browser)
  ↓ React Application
  ↓ - User Interface
  ↓ - State Management
  ↓ - Component Logic
       ↓ HTTP/REST API ↓
SERVER SIDE (Node.js)
  ↓ Express Server
  ↓ - API Routes
  ↓ - Middleware
  ↓ - Business Logic
       ↓ Database Queries ↓
DATABASE LAYER
  ↓ MongoDB
  ↓ - Data Storage
  ↓ - Data Retrieval
</code></pre>

<h2>Component Breakdown</h2>

<h3>1. MongoDB - The Database Layer</h3>
<p><strong>What it does:</strong> Stores and retrieves application data</p>
<ul>
<li><strong>Type:</strong> NoSQL database (stores data as JSON-like documents)</li>
<li><strong>Storage:</strong> Data is organized in collections and documents</li>
<li><strong>Flexibility:</strong> Schema-less, allowing flexible data structures</li>
<li><strong>Scalability:</strong> Designed for horizontal scaling</li>
<li><strong>Use Cases:</strong> Storing user profiles, posts, products, comments, etc.</li>
</ul>
<p><strong>Key Benefits:</strong></p>
<ul>
<li>Native JSON support matches JavaScript objects</li>
<li>Easy to scale horizontally</li>
<li>Great for rapid development with flexible schemas</li>
</ul>

<h3>2. Node.js - The Runtime Environment</h3>
<p><strong>What it does:</strong> Allows JavaScript to run on servers</p>
<ul>
<li><strong>Purpose:</strong> Execute JavaScript code outside the browser</li>
<li><strong>Event-Driven:</strong> Non-blocking, asynchronous architecture</li>
<li><strong>Package Management:</strong> NPM (Node Package Manager) for libraries</li>
<li><strong>Performance:</strong> Built on Chrome's V8 engine for fast execution</li>
</ul>
<p><strong>Key Concepts:</strong></p>
<ul>
<li><strong>Asynchronous Programming:</strong> Handle multiple requests without blocking</li>
<li><strong>Callbacks &amp; Promises:</strong> Handle delayed operations</li>
<li><strong>Modules:</strong> Organize code into reusable packages</li>
</ul>

<h3>3. Express.js - The Web Framework</h3>
<p><strong>What it does:</strong> Creates and manages the server and API endpoints</p>
<ul>
<li><strong>Lightweight:</strong> Minimal framework with maximum flexibility</li>
<li><strong>Middleware:</strong> Process requests through a series of functions</li>
<li><strong>Routing:</strong> Define different API endpoints and HTTP methods</li>
<li><strong>Error Handling:</strong> Centralized error management</li>
<li><strong>Static Files:</strong> Serve CSS, JavaScript, images, etc.</li>
</ul>

<h3>4. React - The Frontend Library</h3>
<p><strong>What it does:</strong> Builds interactive user interfaces</p>
<ul>
<li><strong>Component-Based:</strong> Break UI into reusable components</li>
<li><strong>State Management:</strong> Handle dynamic data and user interactions</li>
<li><strong>Virtual DOM:</strong> Efficiently update only changed elements</li>
<li><strong>Hooks:</strong> Modern way to add functionality to components</li>
<li><strong>Unidirectional Data Flow:</strong> Predictable data management</li>
</ul>

<h2>How They Work Together</h2>
<p><strong>Data Flow: From User Action to Database and Back</strong></p>
<ol>
<li><strong>User Interaction</strong> → User clicks a button in React</li>
<li><strong>API Request</strong> → React sends HTTP request to Express server</li>
<li><strong>Server Processing</strong> → Express processes the request, validates data</li>
<li><strong>Database Query</strong> → Express queries MongoDB</li>
<li><strong>Data Response</strong> → MongoDB returns data to Express</li>
<li><strong>API Response</strong> → Express sends JSON response to React</li>
<li><strong>UI Update</strong> → React updates the screen with new data</li>
<li><strong>Display</strong> → User sees the updated content</li>
</ol>

<h2>Why Choose MERN Stack?</h2>
<p><strong>Advantages:</strong></p>
<ul>
<li>✅ Single Language: Use JavaScript everywhere</li>
<li>✅ JSON Throughout: Seamless data format from database to frontend</li>
<li>✅ Active Community: Large ecosystem and abundant resources</li>
<li>✅ Fast Development: Build features quickly with familiar tools</li>
<li>✅ Scalability: All components are designed for scaling</li>
<li>✅ Rich Ecosystem: Thousands of packages available via NPM</li>
</ul>
<p><strong>Considerations:</strong></p>
<ul>
<li>⚠️ Learning Curve: Multiple technologies to master</li>
<li>⚠️ Client-Side Rendering: May impact initial page load</li>
<li>⚠️ State Management: Complex apps need careful state planning</li>
<li>⚠️ Security: JavaScript everywhere means more attack surface</li>
</ul>

<h2>Real-World Example: User Creates a Post</h2>
<p><strong>Frontend (React):</strong></p>
<ul>
<li>User types post content in text area</li>
<li>Clicks "Post" button</li>
<li>React sends <code>POST /api/posts</code> with content</li>
</ul>
<p><strong>Backend (Express):</strong></p>
<ul>
<li>Receives request</li>
<li>Validates content (not empty, no malicious code)</li>
<li>Checks user is authenticated</li>
<li>Calls MongoDB to create new post document</li>
</ul>
<p><strong>Response Journey:</strong></p>
<ul>
<li>MongoDB → Express → React → Screen updates</li>
<li>New post appears in user's feed</li>
<li>XP/Points awarded to user</li>
</ul>

<h2>Prerequisites for Success</h2>
<ul>
<li>JavaScript Fundamentals: Variables, functions, async/await</li>
<li>Understanding of HTTP: GET, POST, PUT, DELETE requests</li>
<li>Basic Database Concepts: Collections, documents, queries</li>
<li>HTML &amp; CSS: For frontend structure and styling</li>
<li>Command Line Basics: Navigate directories, run commands</li>
</ul>

<h2>Next Steps in This Course</h2>
<p>In the following chapters, you'll learn:</p>
<ol>
<li><strong>Node.js &amp; NPM</strong> - Setting up your development environment</li>
<li><strong>Express.js Basics</strong> - Creating your first server</li>
<li><strong>MongoDB &amp; Mongoose</strong> - Database operations</li>
<li><strong>React Fundamentals</strong> - Building interactive interfaces</li>
<li><strong>Connecting the Stack</strong> - Building a complete full-stack app</li>
</ol>

<h2>Key Takeaways</h2>
<ul>
<li>✅ MERN Stack = MongoDB + Express + React + Node.js</li>
<li>✅ Full-stack JavaScript development from database to UI</li>
<li>✅ JSON-based architecture ensures seamless data flow</li>
<li>✅ Each technology handles a specific part of the application</li>
<li>✅ Together they create powerful, scalable web applications</li>
</ul>`;

const updateLesson = async () => {
  try {
    await connectDB();

    // Find the MERN Stack Overview lesson
    const lesson = await Lesson.findOne({
      title: { $regex: 'MERN Stack Overview', $options: 'i' }
    });

    if (!lesson) {
      console.log('❌ Lesson not found');
      console.log('Available lessons:');
      const allLessons = await Lesson.find({}).select('title order');
      console.table(allLessons);
      process.exit(1);
    }

    console.log('📝 Found lesson:', lesson.title);
    console.log('Order:', lesson.order);

    // Update with detailed content
    lesson.content = mernContent;
    lesson.description = 'Understanding the MERN stack ecosystem, how each component works, and how they integrate together for full-stack development.';
    lesson.duration = 25;
    lesson.xpReward = 75;
    lesson.pointsReward = 20;
    lesson.difficulty = 'beginner';

    await lesson.save();

    console.log('✅ Lesson updated successfully!');
    console.log('📊 Updated Details:');
    console.log(`  - Title: ${lesson.title}`);
    console.log(`  - Duration: ${lesson.duration} minutes`);
    console.log(`  - XP Reward: ${lesson.xpReward}`);
    console.log(`  - Content Length: ${lesson.content.length} characters`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateLesson();
