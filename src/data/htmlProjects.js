export const htmlProjects = [
  {
    id: 'project-1',
    title: 'පුද්ගලික පැතිකඩ',
    description: 'ඔබගේම පුද්ගලික පැතිකඩ සාදන්න',
    difficulty: 'පහළ',
    estimatedTime: '2-3 පැය',
    category: 'personal',
    objectives: [
      'HTML මූලික ව්යුහය ඉගෙන ගන්න',
      'හෙඩිං, පැරාග්රාෆ්, සහ සෙක්ෂන් භාවිතා කරන්න',
      'රූප සහ සබැඳි එකතු කරන්න',
      'සරල CSS ස්ටයිලිං යොදන්න'
    ],
    steps: [
      {
        title: 'මූලික HTML ව්යුහය සාදන්න',
        description: 'DOCTYPE, html, head, සහ body ටැග් භාවිතා කරන්න',
        code: `<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>මගේ පැතිකඩ</title>
</head>
<body>
    <!-- මෙතැන ඔබගේ අන්තර්ගතය -->
</body>
</html>`
      },
      {
        title: 'හෙඩර් සහ නේවිගේෂන් එකතු කරන්න',
        description: 'header සහ nav ටැග් භාවිතා කරන්න',
        code: `<header>
    <h1>මගේ නම</h1>
    <nav>
        <ul>
            <li><a href="#about">මම කවුද</a></li>
            <li><a href="#skills">කුසලතා</a></li>
            <li><a href="#contact">සම්බන්ධ වන්න</a></li>
        </ul>
    </nav>
</header>`
      },
      {
        title: 'ප්රධාන අන්තර්ගතය එකතු කරන්න',
        description: 'main, section, සහ article ටැග් භාවිතා කරන්න',
        code: `<main>
    <section id="about">
        <h2>මම කවුද</h2>
        <p>මම තරුණ web developer කෙනෙක්...</p>
    </section>
    
    <section id="skills">
        <h2>මගේ කුසලතා</h2>
        <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
        </ul>
    </section>
</main>`
      },
      {
        title: 'සම්බන්ධතා තොරතුරු එකතු කරන්න',
        description: 'contact section සහ footer එකතු කරන්න',
        code: `<section id="contact">
    <h2>සම්බන්ධ වන්න</h2>
    <p>ඊමේල්: your.email@example.com</p>
    <p>දුරකථන: 077-1234567</p>
</section>

<footer>
    <p>&copy; 2024 මගේ නම. සියලු හිමිකම් ඇවිරිණි.</p>
</footer>`
      },
      {
        title: 'CSS ස්ටයිලිං එකතු කරන්න',
        description: 'පෙනුම වැඩිදියුණු කිරීමට CSS එකතු කරන්න',
        code: `<style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }
    header {
        text-align: center;
        padding: 40px 0;
    }
    nav ul {
        list-style: none;
        padding: 0;
    }
    nav li {
        display: inline;
        margin: 0 15px;
    }
    nav a {
        color: white;
        text-decoration: none;
    }
    section {
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        margin: 20px 0;
        border-radius: 10px;
    }
</style>`
      }
    ],
    finalCode: `<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>මගේ පැතිකඩ</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        header {
            text-align: center;
            padding: 40px 0;
        }
        h1 {
            font-size: 3em;
            margin-bottom: 10px;
        }
        nav ul {
            list-style: none;
            padding: 0;
        }
        nav li {
            display: inline;
            margin: 0 15px;
        }
        nav a {
            color: white;
            text-decoration: none;
            font-weight: bold;
        }
        section {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            margin: 20px 0;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h2 {
            color: #ffd700;
            margin-bottom: 20px;
        }
        ul {
            line-height: 1.8;
        }
        footer {
            text-align: center;
            padding: 20px;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>ඔබගේ නම</h1>
            <nav>
                <ul>
                    <li><a href="#about">මම කවුද</a></li>
                    <li><a href="#skills">කුසලතා</a></li>
                    <li><a href="#contact">සම්බන්ධ වන්න</a></li>
                </ul>
            </nav>
        </header>

        <main>
            <section id="about">
                <h2>මම කවුද</h2>
                <p>මම තරුණ web developer කෙනෙක්. මම HTML, CSS, සහ JavaScript ඉගෙන ගනිමි. මගේ අරමුණ වන්නේ නිර්මාණාත්මක වෙබ් අඩවි නිර්මාණය කිරීමයි.</p>
            </section>
            
            <section id="skills">
                <h2>මගේ කුසලතා</h2>
                <ul>
                    <li>HTML5</li>
                    <li>CSS3</li>
                    <li>JavaScript</li>
                    <li>Responsive Design</li>
                </ul>
            </section>
            
            <section id="contact">
                <h2>සම්බන්ධ වන්න</h2>
                <p>📧 ඊමේල්: your.email@example.com</p>
                <p>📱 දුරකථන: 077-1234567</p>
                <p>📍 පිහිටීම: ඔබගේ නගරය, ශ්රී ලංකා</p>
            </section>
        </main>
        
        <footer>
            <p>&copy; 2024 ඔබගේ නම. සියලු හිමිකම් ඇවිරිණි.</p>
            <p>HTML සහ CSS භාවිතා කරමින් සාදන ලදී ❤️</p>
        </footer>
    </div>
</body>
</html>`,
    tips: [
      'සැම විටම semantic HTML ටැග් භාවිතා කරන්න (header, nav, main, section, footer)',
      'viewport meta tag එකතු කරන්න mobile devices සඳහා',
      'CSS වලින් පෙනුම වැඩිදියුණු කළ හැක',
      'රූප සඳහා alt text එකතු කරන්න accessibility සඳහා'
    ]
  },
  {
    id: 'project-2',
    title: 'කෑම වට්ටෝරු පිටුව',
    description: 'ඔබගේ ප්රියතම කෑම වට්ටෝරුවක් පෙන්වන පිටුවක් සාදන්න',
    difficulty: 'මධ්යම',
    estimatedTime: '3-4 පැය',
    category: 'lifestyle',
    objectives: [
      'Tables සහ forms භාවිතා කරන්න',
      'Images සහ lists නිවැරදිව භාවිතා කරන්න',
      'CSS flexbox හෝ grid layout භාවිතා කරන්න',
      'Responsive design යොදන්න'
    ],
    steps: [
      {
        title: 'කෑම වට්ටෝරුවේ ව්යුහය සාදන්න',
        description: 'Header, hero image, සහ content sections සාදන්න',
        code: `<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>කිතිරිබත් වට්ටෝරුව</title>
</head>
<body>
    <header>
        <h1>රසමත් කිතිරිබත්</h1>
    </header>
    <main>
        <!-- මෙතැන අන්තර්ගතය -->
    </main>
</body>
</html>`
      },
      {
        title: 'කෑම වට්ටෝරුවේ තොරතුරු එකතු කරන්න',
        description: 'Time, servings, difficulty වැනි තොරතුරු',
        code: `<section class="recipe-info">
    <div class="info-grid">
        <div class="info-item">
            <span class="info-number">45</span>
            <span class="info-label">විනාඩි</span>
        </div>
        <div class="info-item">
            <span class="info-number">4-6</span>
            <span class="info-label">පුද්ගලයින්</span>
        </div>
        <div class="info-item">
            <span class="info-number">මධ්යම</span>
            <span class="info-label">අපහසුතාව</span>
        </div>
    </div>
</section>`
      },
      {
        title: 'අවශ්ය ද්රව්ය ලැයිස්තුව සාදන්න',
        description: 'Ingredients list සාදන්න',
        code: `<section class="ingredients">
    <h2>අවශ්ය ද්රව්ය</h2>
    <ul>
        <li>සහලින් සාදන ලද කිතිරි - 4 කෝප්ප</li>
        <li>පොල්කිරි - 2 කෝප්ප</li>
        <li>රතු ලූණු - 1 විශාල ලූණුව</li>
        <li>රාබු ඇට - 1 කෝප්ප</li>
        <li>කුරුඳු - කුඩා කැබැල්ලක්</li>
    </ul>
</section>`
      },
      {
        title: 'සාදන ආකාරය එකතු කරන්න',
        description: 'Step-by-step instructions',
        code: `<section class="instructions">
    <h2>සාදන ආකාරය</h2>
    <ol>
        <li>කිතිරි හොඳින් සේදා පෙරාගෙන තබන්න</li>
        <li>රාබු, කුරුඳු, සුදු පලාපිරි රත් කරන්න</li>
        <li>රතු ලූණු සහ සුදු ලූණු එකතු කර රත් කරන්න</li>
        <li>පොල්කිරි එකතු කර හොඳින් මිශ්ර කරන්න</li>
    </ol>
</section>`
      },
      {
        title: 'Tips සහ styling එකතු කරන්න',
        description: 'Professional styling සහ tips',
        code: `<section class="tips">
    <h2>උපදෙස්</h2>
    <ul>
        <li>කිතිරි එක එක කෝප්පයකට තබන්න</li>
        <li>මධ්යම ගින්නක් භාවිතා කරන්න</li>
        <li>රස පරීක්ෂා කරන්න</li>
    </ul>
</section>`
      }
    ],
    tips: [
      'Food photography සඳහා උසස් තත්ත්වයේ රූප භාවිතා කරන්න',
      'Lists සඳහා semantic ටැග් (ul, ol, li) භාවිතා කරන්න',
      'CSS Grid හෝ Flexbox භාවිතා කර responsive layout සඳහා',
      'Accessibility සඳහා proper heading hierarchy භාවිතා කරන්න'
    ]
  },
  {
    id: 'project-3',
    title: 'ව්යාපෘති දර්ශකය',
    description: 'ඔබගේ ව්යාපෘති පෙන්වන දර්ශක පිටුවක්',
    difficulty: 'උසස්',
    estimatedTime: '4-5 පැය',
    category: 'professional',
    objectives: [
      'Advanced CSS layouts භාවිතා කරන්න',
      'JavaScript interactivity එකතු කරන්න',
      'Modal windows සහ filters සාදන්න',
      'Professional portfolio design කරන්න'
    ],
    steps: [
      {
        title: 'Portfolio structure සාදන්න',
        description: 'Navigation, hero, projects, contact sections',
        code: `<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>මගේ ව්යාපෘති</title>
</head>
<body>
    <nav>
        <!-- Navigation -->
    </nav>
    <header>
        <!-- Hero section -->
    </header>
    <main>
        <section id="projects">
            <!-- Projects grid -->
        </section>
    </main>
</body>
</html>`
      },
      {
        title: 'Project cards සාදන්න',
        description: 'Individual project cards සාදන්න',
        code: `<div class="projects-grid">
    <div class="project-card" data-category="web">
        <img src="project1.jpg" alt="Project 1">
        <div class="project-content">
            <h3>E-Commerce Site</h3>
            <p>Modern online shopping platform</p>
            <div class="project-tech">
                <span class="tech-tag">React</span>
                <span class="tech-tag">Node.js</span>
            </div>
        </div>
    </div>
</div>`
      },
      {
        title: 'Filter functionality එකතු කරන්න',
        description: 'JavaScript filtering system',
        code: `<div class="filter-buttons">
    <button class="filter-btn active" data-filter="all">සියල්ල</button>
    <button class="filter-btn" data-filter="web">Web</button>
    <button class="filter-btn" data-filter="mobile">Mobile</button>
</div>

<script>
// Filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});
</script>`
      },
      {
        title: 'Modal සාදන්න',
        description: 'Project details modal',
        code: `<!-- Modal -->
<div id="projectModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2 id="modalTitle">Project Title</h2>
        <img id="modalImage" src="" alt="">
        <p id="modalDescription">Project description</p>
        <div id="modalTech"></div>
    </div>
</div>

<script>
// Modal functionality
const modal = document.getElementById('projectModal');
const modalBtns = document.querySelectorAll('.project-card');
const closeBtn = document.querySelector('.close');

modalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Populate modal with project data
        modal.style.display = 'block';
    });
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});
</script>`
      },
      {
        title: 'Advanced styling එකතු කරන්න',
        description: 'Professional CSS with animations',
        code: `<style>
/* Advanced animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.project-card {
    animation: fadeInUp 0.6s ease-out;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

/* Modal styles */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
}

.modal-content {
    background-color: white;
    margin: 10% auto;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 600px;
    animation: fadeInUp 0.3s ease-out;
}
</style>`
      }
    ],
    tips: [
      'CSS animations භාවිතා කරන්න smooth transitions සඳහා',
      'JavaScript event listeners භාවිතා කරන්න interactivity සඳහා',
      'Responsive design සෑම උපාංගයකට සරිලන පරිදි',
      'Performance සඳහා optimized images සහ minified CSS භාවිතා කරන්න'
    ]
  }
];
