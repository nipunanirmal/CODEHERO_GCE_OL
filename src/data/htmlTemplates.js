export const htmlTemplates = [
  {
    id: 'personal-profile',
    name: 'පුද්ගලික පැතිකඩ',
    description: 'සරල පුද්ගලික පැතිකඩ අච්චුව',
    category: 'personal',
    difficulty: 'beginner',
    html: `<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>මගේ පැතිකඩ</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            text-align: center;
            padding: 40px 0;
            color: white;
        }
        .profile-img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 5px solid white;
            margin-bottom: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .tagline {
            font-size: 1.2em;
            opacity: 0.9;
            margin-bottom: 30px;
        }
        .content {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 30px;
            margin: 20px 0;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        }
        .section {
            margin-bottom: 30px;
        }
        h2 {
            color: #4a5568;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .skill {
            background: #667eea;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        .contact-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: #f7fafc;
            border-radius: 8px;
        }
        footer {
            text-align: center;
            padding: 20px;
            color: white;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <img src="https://via.placeholder.com/150" alt="පැතිකඩ රූපය" class="profile-img">
            <h1>ඔබගේ නම</h1>
            <p class="tagline">Web Developer | Student | Creative Thinker</p>
        </header>

        <main>
            <section class="content">
                <div class="section">
                    <h2>මම කවුද</h2>
                    <p>මම තරුණ සහ කාර්යශීලී web developer කෙනෙක්. මම HTML, CSS, සහ JavaScript ඉගෙන ගනිමි. මගේ අරමුණ වන්නේ නිර්මාණාත්මක සහ භාවිතා කිරීමට පහසු වෙබ් අඩවි නිර්මාණය කිරීමයි.</p>
                </div>

                <div class="section">
                    <h2>මගේ කුසලතා</h2>
                    <div class="skills">
                        <span class="skill">HTML5</span>
                        <span class="skill">CSS3</span>
                        <span class="skill">JavaScript</span>
                        <span class="skill">React</span>
                        <span class="skill">Node.js</span>
                        <span class="skill">Git</span>
                    </div>
                </div>

                <div class="section">
                    <h2>අධ්යාපනය</h2>
                    <p><strong>උසස් පෙළ සිසුවෙකු</strong> - ඔබගේ පාසල</p>
                    <p>මම විද්යා සහ ගණිත විෂයන් ඉගෙන ගනිමි. පරිගණක විද්යාව කෙරෙහි මට දැඩි කැමැත්තක් ඇත.</p>
                </div>

                <div class="section">
                    <h2>සම්බන්ධ වන්න</h2>
                    <div class="contact-info">
                        <div class="contact-item">
                            <span>📧</span>
                            <span>your.email@example.com</span>
                        </div>
                        <div class="contact-item">
                            <span>📱</span>
                            <span>077-1234567</span>
                        </div>
                        <div class="contact-item">
                            <span>🌐</span>
                            <span>github.com/yourusername</span>
                        </div>
                        <div class="contact-item">
                            <span>📍</span>
                            <span>ඔබගේ නගරය, ශ්රී ලංකා</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <footer>
            <p>&copy; 2024 ඔබගේ නම. සියලු හිමිකම් ඇවිරිණි.</p>
            <p>HTML සහ CSS භාවිතා කරමින් සාදන ලදී</p>
        </footer>
    </div>
</body>
</html>`
  },
  {
    id: 'recipe-page',
    name: 'කෑම වට්ටෝරු පිටුව',
    description: 'රසමත් කෑම වට්ටෝරු පිටුවක්',
    category: 'lifestyle',
    difficulty: 'beginner',
    html: `<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>රසමත් කිතිරිබත් වට්ටෝරුව</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #ff6b6b, #feca57);
            padding: 40px 20px;
            border-radius: 15px;
            color: white;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }
        .recipe-image {
            width: 100%;
            max-width: 400px;
            height: 300px;
            object-fit: cover;
            border-radius: 15px;
            margin: 20px auto;
            display: block;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .recipe-info {
            background: white;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-item {
            text-align: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #ff6b6b;
        }
        .info-number {
            font-size: 2em;
            font-weight: bold;
            color: #ff6b6b;
        }
        .info-label {
            font-size: 0.9em;
            color: #666;
            margin-top: 5px;
        }
        .section {
            margin: 30px 0;
        }
        h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #ff6b6b;
            font-size: 1.8em;
        }
        .ingredients {
            background: #fff3cd;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #ffc107;
        }
        .ingredients ul {
            list-style: none;
            padding-left: 0;
        }
        .ingredients li {
            padding: 8px 0;
            border-bottom: 1px solid #ffeaa7;
            position: relative;
            padding-left: 25px;
        }
        .ingredients li:before {
            content: "🥘";
            position: absolute;
            left: 0;
        }
        .steps {
            counter-reset: step-counter;
        }
        .step {
            background: white;
            padding: 20px;
            margin: 15px 0;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: relative;
            padding-left: 60px;
        }
        .step:before {
            counter-increment: step-counter;
            content: counter(step-counter);
            position: absolute;
            left: 15px;
            top: 15px;
            background: #ff6b6b;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        .tips {
            background: #d1ecf1;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #17a2b8;
        }
        .tips h3 {
            color: #0c5460;
            margin-bottom: 15px;
        }
        .tips ul {
            list-style: none;
        }
        .tips li {
            padding: 5px 0;
            position: relative;
            padding-left: 25px;
        }
        .tips li:before {
            content: "💡";
            position: absolute;
            left: 0;
        }
        footer {
            text-align: center;
            padding: 30px 20px;
            background: #2c3e50;
            color: white;
            border-radius: 15px;
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🍛 රසමත් කිතිරිබත්</h1>
            <p class="subtitle">සාම්ප්රදායික ශ්රී ලාංකික රසය</p>
        </header>

        <main>
            <img src="https://via.placeholder.com/400x300" alt="කිතිරිබත්" class="recipe-image">

            <div class="recipe-info">
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-number">4-6</div>
                        <div class="info-label">පුද්ගලයින්</div>
                    </div>
                    <div class="info-item">
                        <div class="info-number">45</div>
                        <div class="info-label">විනාඩි</div>
                    </div>
                    <div class="info-item">
                        <div class="info-number">මධ්යම</div>
                        <div class="info-label">අපහසුතාව</div>
                    </div>
                </div>

                <section class="section">
                    <h2>අවශ්ය ද්රව්ය</h2>
                    <div class="ingredients">
                        <ul>
                            <li>සහලින් සාදන ලද කිතිරි - 4 කෝප්ප</li>
                            <li>පොල්කිරි - 2 කෝප්ප</li>
                            <li>රතු ලූණු කුඩු කළ - 1 විශාල ලූණුව</li>
                            <li>සුදු ලූණු කුඩු කළ - 1 මධ්යම ලූණුව</li>
                            <li>රාබු ඇට - 1 කෝප්ප</li>
                            <li>කුරුඳු - 1 අඟල් කැබැල්ල</li>
                            <li>සුදු පලාපිරි - 1 විශාල කරල්</li>
                            <li>එළවළු තෙල් - 3 විශාල හැඳි</li>
                            <li>ලුණු - 2 මධ්යම ලූණු</li>
                            <li>ලූනු කොළ - රසට</li>
                            <li>ලුණු කොළ - සැරට</li>
                            <li>දෙමළ - කුඩා කැබැල්ලක්</li>
                            <li>උණුසුම් ජලය - 3 කෝප්ප</li>
                            <li>ලුණු සහ කර්පූර්ණ්ණා - රසට</li>
                        </ul>
                    </div>
                </section>

                <section class="section">
                    <h2>සාදන ආකාරය</h2>
                    <div class="steps">
                        <div class="step">
                            <p>කිතිරි හොඳින් සේදා ජලය පෙරාගෙන තබන්න. පසුව ඒවා පෙරා ගත් පසු එක එක කෝප්පයකට තබන්න.</p>
                        </div>
                        <div class="step">
                            <p>�ාජනයක තෙල් රත් කරගෙන රාබු, කුරුඳු, සුදු පලාපිරි ඇතුළත් කර රත් කරන්න.</p>
                        </div>
                        <div class="step">
                            <p>රතු ලූණු සහ සුදු ලූණු එකතු කර රත් වන තෙක් කලවන්න.</p>
                        </div>
                        <div class="step">
                            <p>පොල්කිරි එකතු කර හොඳින් මිශ්ර කරන්න. පසුව උණුසුම් ජලය එකතු කරන්න.</p>
                        </div>
                        <div class="step">
                            <p>ජලය උණුසුම් වූ පසු ලුණු සහ ලූනු කොළ එකතු කරන්න.</p>
                        </div>
                        <div class="step">
                            <p>රස පරීක්ෂා කර ලුණු සහ කර්පූර්ණ්ණා එකතු කරන්න. හොඳින් මිශ්ර කරන්න.</p>
                        </div>
                        <div class="step">
                            <p>දෙමළ එකතු කර මද්දෙන්න. පසුව ලූනු කොළ එකතු කර ගිනි අවුරා දමන්න.</p>
                        </div>
                    </div>
                </section>

                <section class="section">
                    <h2>උපදෙස්</h2>
                    <div class="tips">
                        <h3>👨‍🍳 වෘත්තීය උපදෙස්</h3>
                        <ul>
                            <li>කිතිරි එක එක කෝප්පයකට තබන්නේ ඒවා එකිනෙකට ඇලීම වැළැක්වීමටය.</li>
                            <li>පොල්කිරි රත් කිරීමේදී මධ්යම ගින්නක් භාවිතා කරන්න.</li>
                            <li>ඔබට තවත් රසයක් අවශ්ය නම් මිරිස් කුඩු ස්වල්පයක් එකතු කළ හැක.</li>
                            <li>කිතිරිබත් සමඟ ඉරිගු බල්ලන් හෝ මාළු මාළුව පිළිගත හැක.</li>
                        </ul>
                    </div>
                </section>
            </div>
        </main>

        <footer>
            <p>🍽️ සුභ පානයක් වේවා!</p>
            <p>සාදන ලද්දේ ආදරයෙන් ❤️</p>
        </footer>
    </div>
</body>
</html>`
  },
  {
    id: 'portfolio',
    name: 'වෘත්තීය පැතිකඩ',
    description: 'වෘත්තීය පැතිකඩ අච්චුව',
    category: 'professional',
    difficulty: 'intermediate',
    html: `<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>මගේ වෘත්තීය පැතිකඩ</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        :root {
            --primary-color: #2563eb;
            --secondary-color: #1e40af;
            --accent-color: #3b82f6;
            --text-dark: #1f2937;
            --text-light: #6b7280;
            --bg-light: #f9fafb;
            --white: #ffffff;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: var(--text-dark);
            background: var(--bg-light);
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Navigation */
        nav {
            background: var(--white);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--primary-color);
        }
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        .nav-links a {
            text-decoration: none;
            color: var(--text-dark);
            font-weight: 500;
            transition: color 0.3s;
        }
        .nav-links a:hover {
            color: var(--primary-color);
        }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: var(--white);
            padding: 100px 0;
            text-align: center;
        }
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 800;
        }
        .hero p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: var(--white);
            color: var(--primary-color);
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        /* Sections */
        .section {
            padding: 80px 0;
        }
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: var(--text-dark);
        }
        
        /* About Section */
        .about-content {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 3rem;
            align-items: center;
        }
        .about-image {
            width: 100%;
            max-width: 300px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .about-text h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
        }
        
        /* Skills Section */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }
        .skill-card {
            background: var(--white);
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s;
        }
        .skill-card:hover {
            transform: translateY(-5px);
        }
        .skill-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .skill-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        /* Projects Section */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }
        .project-card {
            background: var(--white);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        .project-card:hover {
            transform: translateY(-5px);
        }
        .project-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .project-content {
            padding: 1.5rem;
        }
        .project-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        .project-tech {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        .tech-tag {
            background: var(--accent-color);
            color: var(--white);
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.875rem;
        }
        
        /* Contact Section */
        .contact {
            background: var(--primary-color);
            color: var(--white);
            text-align: center;
        }
        .contact .section-title {
            color: var(--white);
        }
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 3rem;
            margin-top: 2rem;
        }
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        /* Footer */
        footer {
            background: var(--text-dark);
            color: var(--white);
            text-align: center;
            padding: 2rem 0;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            .hero h1 {
                font-size: 2rem;
            }
            .about-content {
                grid-template-columns: 1fr;
                text-align: center;
            }
            .contact-info {
                flex-direction: column;
                gap: 1rem;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="container">
            <div class="nav-container">
                <div class="logo">YourName</div>
                <ul class="nav-links">
                    <li><a href="#home">මුල් පිටුව</a></li>
                    <li><a href="#about">මම කවුද</a></li>
                    <li><a href="#skills">කුසලතා</a></li>
                    <li><a href="#projects">ව්යාපෘති</a></li>
                    <li><a href="#contact">සම්බන්ධ වන්න</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="container">
            <h1>Web Developer & Designer</h1>
            <p>නිර්මාණාත්මක විසඳුම් නිර්මාණය කිරීමට කැමැත්තෙන්</p>
            <a href="#contact" class="btn">මගෙන් සම්බන්ධ වන්න</a>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section">
        <div class="container">
            <h2 class="section-title">මම කවුද</h2>
            <div class="about-content">
                <div>
                    <img src="https://via.placeholder.com/300" alt="පැතිකඩ රූපය" class="about-image">
                </div>
                <div class="about-text">
                    <h3>මම තරුණ Web Developer කෙනෙක්</h3>
                    <p>මම HTML, CSS, JavaScript, සහ React භාවිතා කරමින් නවීන සහ ප්රතිචාරාත්මක වෙබ් අඩවි නිර්මාණය කරමි. මගේ අරමුණ වන්නේ භාවිතා කිරීමට පහසු සහ දෘශ්ය වශයෙන් ආකර්ෂණීය වෙබ් අත්දැකීම් නිර්මාණය කිරීමයි.</p>
                    <p>මම සැම ව්යාපෘතියක් සමඟ නවීනතම තාක්ෂණයන් ඉගෙන ගැනීමට සහ හොඳම පුරුදු භාවිතා කිරීමට කැමැත්තෙන්.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="section">
        <div class="container">
            <h2 class="section-title">මගේ කුසලතා</h2>
            <div class="skills-grid">
                <div class="skill-card">
                    <div class="skill-icon">🌐</div>
                    <h3 class="skill-title">Frontend Development</h3>
                    <p>HTML5, CSS3, JavaScript, React, Vue.js</p>
                </div>
                <div class="skill-card">
                    <div class="skill-icon">⚙️</div>
                    <h3 class="skill-title">Backend Development</h3>
                    <p>Node.js, Express, Python, REST APIs</p>
                </div>
                <div class="skill-card">
                    <div class="skill-icon">🎨</div>
                    <h3 class="skill-title">UI/UX Design</h3>
                    <p>Figma, Adobe XD, Responsive Design</p>
                </div>
                <div class="skill-card">
                    <div class="skill-icon">🗄️</div>
                    <h3 class="skill-title">Database</h3>
                    <p>MongoDB, MySQL, PostgreSQL</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="section">
        <div class="container">
            <h2 class="section-title">මගේ ව්යාපෘති</h2>
            <div class="projects-grid">
                <div class="project-card">
                    <img src="https://via.placeholder.com/350x200" alt="ව්යාපෘතිය 1" class="project-image">
                    <div class="project-content">
                        <h3 class="project-title">E-Commerce Platform</h3>
                        <p>නවීන අලෙවි සැලසුම් සහිත වෙළඳ වෙබ් අඩවියක්</p>
                        <div class="project-tech">
                            <span class="tech-tag">React</span>
                            <span class="tech-tag">Node.js</span>
                            <span class="tech-tag">MongoDB</span>
                        </div>
                    </div>
                </div>
                <div class="project-card">
                    <img src="https://via.placeholder.com/350x200" alt="ව්යාපෘතිය 2" class="project-image">
                    <div class="project-content">
                        <h3 class="project-title">Task Management App</h3>
                        <p>කණ්ඩායම් සහයෝගයෙන් කටයුතු කළමනා කරන යෙදුම</p>
                        <div class="project-tech">
                            <span class="tech-tag">Vue.js</span>
                            <span class="tech-tag">Express</span>
                            <span class="tech-tag">PostgreSQL</span>
                        </div>
                    </div>
                </div>
                <div class="project-card">
                    <img src="https://via.placeholder.com/350x200" alt="ව්යාපෘතිය 3" class="project-image">
                    <div class="project-content">
                        <h3 class="project-title">Weather Dashboard</h3>
                        <p>සජීවී කාලගුණ තොරතුරු පෙන්වන ඩෑෂ්බෝඩ් එකක්</p>
                        <div class="project-tech">
                            <span class="tech-tag">JavaScript</span>
                            <span class="tech-tag">API</span>
                            <span class="tech-tag">Chart.js</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">සම්බන්ධ වන්න</h2>
            <p>ඔබගේ ඊළඟ ව්යාපෘතිය ගැන කතා කිරීමට මම කැමැත්තෙන් සිටිමි</p>
            <div class="contact-info">
                <div class="contact-item">
                    <span>📧</span>
                    <span>your.email@example.com</span>
                </div>
                <div class="contact-item">
                    <span>📱</span>
                    <span>077-1234567</span>
                </div>
                <div class="contact-item">
                    <span>📍</span>
                    <span>කොළඹ, ශ්රී ලංකා</span>
                </div>
            </div>
            <a href="mailto:your.email@example.com" class="btn">ඊමේල් යවන්න</a>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 YourName. සියලු හිමිකම් ඇවිරිණි.</p>
            <p>HTML, CSS, සහ JavaScript භාවිතා කරමින් සාදන ලදී</p>
        </div>
    </footer>
</body>
</html>`
  }
];
