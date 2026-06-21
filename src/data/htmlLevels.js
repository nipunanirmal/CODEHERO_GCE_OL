export const htmlLevels = [
  {
    id: 'html-1',
    title: 'HTML පදනම',
    description: 'HTML ව්‍යුහය සහ මූලික ටැග්',
    sinhalaTitle: 'HTML පදනම',
    sinhalaDesc: 'HTML ව්‍යුහය සහ මූලික ටැග්',
    type: 'coding',
    starterCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>මගේ පිටුව</title>\n</head>\n<body>\n    <!-- ඔබගේ කේතය මෙතැන ලියන්න -->\n</body>\n</html>',
    solution: '<!DOCTYPE html>\n<html>\n<head>\n    <title>මගේ පිටුව</title>\n</head>\n<body>\n    <h1>සුභ දවසක්!</h1>\n    <p>මෙය මගේ පළමු HTML පිටුවයි.</p>\n</body>\n</html>',
    instructions: {
      sinhala: 'h1 ටැගයක් භාවිතා කර "සුභ දවසක්!" යනුවෙන් මාතෘකාවක් සහ p ටැගයක් භාවිතා කර වාක්‍ය ඛණ්ඩයක් එකතු කරන්න.',
      english: 'Add an h1 tag with "Hello World!" and a p tag with a sentence.'
    },
    hints: [
      'h1 ටැගය ප්‍රධාන මාතෘකා සඳහා යොදා ගනී',
      'p ටැගය වාක්‍ය ඛණ්ඩ සඳහා යොදා ගනී'
    ],
    xp: 10
  },
  {
    id: 'html-2',
    title: 'මාතෘකා සහ පෙළ',
    description: 'h1-h6 ටැග් සහ පෙළ ස්වරූපණ',
    sinhalaTitle: 'මාතෘකා සහ පෙළ',
    sinhalaDesc: 'h1-h6 ටැග් සහ පෙළ ස්වරූපණ',
    type: 'coding',
    starterCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>මාතෘකා</title>\n</head>\n<body>\n    <!-- විවිධ මාතෘකා මට්ටම් එකතු කරන්න -->\n</body>\n</html>',
    solution: '<!DOCTYPE html>\n<html>\n<head>\n    <title>මාතෘකා</title>\n</head>\n<body>\n    <h1>මූලික මාතෘකාව</h1>\n    <h2>උප මාතෘකාව</h2>\n    <h3>කුඩා මාතෘකාව</h3>\n    <p><strong>තද පෙළ</strong> සහ <em>ඇල පෙළ</em></p>\n</body>\n</html>',
    instructions: {
      sinhala: 'h1, h2, h3 මාතෘකා එකතු කරන්න සහ strong සහ em ටැග් භාවිතා කර පෙළ ස්වරූපණය කරන්න.',
      english: 'Add h1, h2, h3 headings and use strong and em tags for text formatting.'
    },
    hints: [
      'h1 වඩාත්ම විශාල මාතෘකාව, h6 කුඩාම මාතෘකාව',
      'strong ටැගය තද පෙළ සඳහා, em ටැගය ඇල පෙළ සඳහා'
    ],
    xp: 15
  },
  {
    id: 'html-3',
    title: 'ලැයිස්තු',
    description: 'Ordered සහ Unordered ලැයිස්තු',
    sinhalaTitle: 'ලැයිස්තු',
    sinhalaDesc: 'Ordered සහ Unordered ලැයිස්තු',
    type: 'coding',
    starterCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>ලැයිස්තු</title>\n</head>\n<body>\n    <!-- විවිධ ලැයිස්තු වර්ග එකතු කරන්න -->\n</body>\n</html>',
    solution: '<!DOCTYPE html>\n<html>\n<head>\n    <title>ලැයිස්තු</title>\n</head>\n<body>\n    <h2>මගේ විෂයන්</h2>\n    <ul>\n        <li>ගණිතය</li>\n        <li>විද්‍යාව</li>\n        <li>ඉතිහාසය</li>\n    </ul>\n    \n    <h2>පිසීමේ පියවර</h2>\n    <ol>\n        <li>පළමුව ද්‍රව්‍ය එකතු කරන්න</li>\n        <li>මිශ්‍ර කරන්න</li>\n        <li>පිසීම අවසන් කරන්න</li>\n    </ol>\n</body>\n</html>',
    instructions: {
      sinhala: 'ul ටැගයක් භාවිතා කර ඔබගේ විෂයන් ලැයිස්තුවක් සහ ol ටැගයක් භාවිතා කර පියවර ලැයිස්තුවක් සාදන්න.',
      english: 'Create an unordered list with ul tag for your subjects and an ordered list with ol tag for steps.'
    },
    hints: [
      'ul ටැගය bullet points සහිත ලැයිස්තු සඳහා',
      'ol ටැගය අංකගත ලැයිස්තු සඳහා',
      'li ටැගය සෑම ලැයිස්තු අයිතමයක් සඳහා'
    ],
    xp: 15
  },
  {
    id: 'html-4',
    title: 'රූප සහ සබැඳි',
    description: 'රූප ඇතුළත් කිරීම සහ සබැඳි සාදයි',
    sinhalaTitle: 'රූප සහ සබැඳි',
    sinhalaDesc: 'රූප ඇතුළත් කිරීම සහ සබැඳි සාදයි',
    type: 'coding',
    starterCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>රූප සහ සබැඳි</title>\n</head>\n<body>\n    <!-- රූපයක් සහ සබැඳියක් එකතු කරන්න -->\n</body>\n</html>',
    solution: '<!DOCTYPE html>\n<html>\n<head>\n    <title>රූප සහ සබැඳි</title>\n</head>\n<body>\n    <h2>මගේ රූපය</h2>\n    <img src="https://via.placeholder.com/300x200" alt="උදාහරණ රූපය" width="300">\n    \n    <p>තව විස්තර සඳහා <a href="https://www.google.com" target="_blank">මෙතැන ක්ලික් කරන්න</a></p>\n</body>\n</html>',
    instructions: {
      sinhala: 'img ටැගයක් භාවිතා කර රූපයක් එකතු කරන්න සහ a ටැගයක් භාවිතා කර සබැඳියක් සාදන්න.',
      english: 'Add an image using img tag and create a link using a tag.'
    },
    hints: [
      'img ටැගයට src සහ alt උපලක්ෂණ අවශ්ය',
      'a ටැගයට href උපලක්ෂණය අවශ්ය',
      'target="_blank" නව ටැබයක සබැඳිය විවෘත කිරීමට'
    ],
    xp: 20
  },
  {
    id: 'html-5',
    title: 'ආකෘති',
    description: 'ආදාන ආකෘති සෑදීම',
    sinhalaTitle: 'ආකෘති',
    sinhalaDesc: 'ආදාන ආකෘති සෑදීම',
    type: 'coding',
    starterCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>සම්බන්ධතා ආකෘතිය</title>\n</head>\n<body>\n    <!-- සම්බන්ධතා ආකෘතියක් සාදන්න -->\n</body>\n</html>',
    solution: '<!DOCTYPE html>\n<html>\n<head>\n    <title>සම්බන්ධතා ආකෘතිය</title>\n</head>\n<body>\n    <h2>අප සමග සම්බන්ධ වන්න</h2>\n    <form>\n        <label for="name">නම:</label><br>\n        <input type="text" id="name" name="name" required><br><br>\n        \n        <label for="email">ඊමේල්:</label><br>\n        <input type="email" id="email" name="email" required><br><br>\n        \n        <label for="message">පණිවිඩය:</label><br>\n        <textarea id="message" name="message" rows="4" cols="50"></textarea><br><br>\n        \n        <input type="submit" value="යවන්න">\n    </form>\n</body>\n</html>',
    instructions: {
      sinhala: 'form ටැගයක් භාවිතා කර සම්බන්ධතා ආකෘතියක් සාදන්න. නම, ඊමේල්, සහ පණිවිඩ ක්ෂේත්‍ර ඇතුළත් කරන්න.',
      english: 'Create a contact form using form tag with name, email, and message fields.'
    },
    hints: [
      'form ටැගය ආදාන ආකෘති සඳහා',
      'label ටැගය ක්ෂේත්‍ර ලේබල් කිරීමට',
      'input type="text" පෙළ ආදානයට, type="email" ඊමේල් සඳහා'
    ],
    xp: 25
  },
  {
    id: 'html-6',
    title: 'වගු',
    description: 'HTML වගු සෑදීම',
    sinhalaTitle: 'වගු',
    sinhalaDesc: 'HTML වගු සෑදීම',
    type: 'coding',
    starterCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>සිසුන්ගේ වගුව</title>\n</head>\n<body>\n    <!-- සිසුන්ගේ තොරතුරු වගුවක් සාදන්න -->\n</body>\n</html>',
    solution: '<!DOCTYPE html>\n<html>\n<head>\n    <title>සිසුන්ගේ වගුව</title>\n</head>\n<body>\n    <h2>සිසුන්ගේ තොරතුරු</h2>\n    <table border="1">\n        <thead>\n            <tr>\n                <th>අංකය</th>\n                <th>නම</th>\n                <th>පන්තිය</th>\n                <th>ලකුණු</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr>\n                <td>1</td>\n                <td>අමාලි</td>\n                <td>11-A</td>\n                <td>85</td>\n            </tr>\n            <tr>\n                <td>2</td>\n                <td>නිමල්</td>\n                <td>11-B</td>\n                <td>92</td>\n            </tr>\n        </tbody>\n    </table>\n</body>\n</html>',
    instructions: {
      sinhala: 'table ටැගයක් භාවිතා කර සිසුන්ගේ තොරතුරු වගුවක් සාදන්න. මාතෘකා පේළියක් සහ දත්ත පේළි 2ක් ඇතුළත් කරන්න.',
      english: 'Create a student information table using table tag with header row and 2 data rows.'
    },
    hints: [
      'table ටැගය වගු සෑදීමට',
      'thead මාතෘකා පේළියට, tbody දත්ත පේළිවලට',
      'tr පේළියක් සඳහා, th මාතෘකා සෛලයක් සඳහා, td දත්ත සෛලයක් සඳහා'
    ],
    xp: 25
  },
  {
    id: 'html-7',
    title: 'Div සහ Span',
    description: 'Div සහ Span ටැග් භාවිතය',
    sinhalaTitle: 'Div සහ Span',
    sinhalaDesc: 'Div සහ Span ටැග් භාවිතය',
    type: 'coding',
    starterCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Div සහ Span</title>\n</head>\n<body>\n    <!-- Div සහ Span ටැග් භාවිතා කරන්න -->\n</body>\n</html>',
    solution: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Div සහ Span</title>\n</head>\n<body>\n    <div style="background-color: lightblue; padding: 20px; margin: 10px;">\n        <h2>මාතෘකා කොටස</h2>\n        <p>මෙය <span style="color: red; font-weight: bold;">වැදගත්</span> තොරතුරු කොටසයි.</p>\n    </div>\n    \n    <div style="background-color: lightgreen; padding: 20px; margin: 10px;">\n        <h2>අන්තර්ගත කොටස</h2>\n        <p>මෙහි <span style="color: blue;">ප්‍රධාන</span> අන්තර්ගතය ඇත.</p>\n    </div>\n</body>\n</html>',
    instructions: {
      sinhala: 'div ටැග් 2ක් භාවිතා කර වෙනස් කොටස් සාදන්න. සෑම div එකකම span ටැග් භාවිතා කර වෙනස් වර්ණයකින් පෙළ පෙන්වන්න.',
      english: 'Use 2 div tags to create different sections. Use span tags in each div to show text in different colors.'
    },
    hints: [
      'div ටැගය block-level element එකකි',
      'span ටැගය inline element එකකි',
      'style උපලක්ෂණය සරල CSS එකතු කිරීමට'
    ],
    xp: 20
  },
  {
    id: 'html-8',
    title: 'Semantic HTML',
    description: 'HTML5 semantic ටැග්',
    sinhalaTitle: 'Semantic HTML',
    sinhalaDesc: 'HTML5 semantic ටැග්',
    type: 'coding',
    starterCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Semantic HTML</title>\n</head>\n<body>\n    <!-- Semantic HTML ව්‍යුහයක් සාදන්න -->\n</body>\n</html>',
    solution: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Semantic HTML</title>\n</head>\n<body>\n    <header>\n        <h1>මගේ වෙබ් අඩවිය</h1>\n        <nav>\n            <ul>\n                <li><a href="#home">මුල් පිටුව</a></li>\n                <li><a href="#about">අප ගැන</a></li>\n                <li><a href="#contact">සම්බන්ධ වන්න</a></li>\n            </ul>\n        </nav>\n    </header>\n    \n    <main>\n        <section>\n            <h2>ප්‍රධාන අන්තර්ගතය</h2>\n            <article>\n                <h3>ලිපිය 1</h3>\n                <p>මෙය පළමු ලිපියේ අන්තර්ගතයයි.</p>\n            </article>\n        </section>\n    </main>\n    \n    <footer>\n        <p>&copy; 2024 මගේ වෙබ් අඩවිය. සියලු හිමිකම් ඇවිරිණි.</p>\n    </footer>\n</body>\n</html>',
    instructions: {
      sinhala: 'header, nav, main, section, article, footer වැනි semantic ටැග් භාවිතා කර ව්‍යුහාත්මක HTML පිටුවක් සාදන්න.',
      english: 'Create a structured HTML page using semantic tags like header, nav, main, section, article, footer.'
    },
    hints: [
      'header පිටුවේ මුල් කොටස සඳහා',
      'nav සබැඳි සඳහා',
      'main ප්‍රධාන අන්තර්ගතය සඳහා',
      'footer පිටුවේ පහළ කොටස සඳහා'
    ],
    xp: 30
  },
  {
    id: 'html-9',
    title: 'මාධ්‍ය අන්තර්ගතය',
    description: 'වීඩියෝ සහ ශ්‍රව්‍ය එකතු කිරීම',
    sinhalaTitle: 'මාධ්‍ය අන්තර්ගතය',
    sinhalaDesc: 'වීඩියෝ සහ ශ්‍රව්‍ය එකතු කිරීම',
    type: 'coding',
    starterCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>මාධ්‍ය අන්තර්ගතය</title>\n</head>\n<body>\n    <!-- වීඩියෝ සහ ශ්‍රව්‍ය එකතු කරන්න -->\n</body>\n</html>',
    solution: '<!DOCTYPE html>\n<html>\n<head>\n    <title>මාධ්‍ය අන්තර්ගතය</title>\n</head>\n<body>\n    <h2>වීඩියෝ</h2>\n    <video width="400" controls>\n        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">\n        ඔබගේ බ්‍රව්සරය video ටැගය සහාය නොදක්වයි.\n    </video>\n    \n    <h2>ශ්‍රව්‍ය</h2>\n    <audio controls>\n        <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">\n        ඔබගේ බ්‍රව්සරය audio ටැගය සහාය නොදක්වයි.\n    </audio>\n</body>\n</html>',
    instructions: {
      sinhala: 'video ටැගයක් සහ audio ටැගයක් භාවිතා කර මාධ්‍ය අන්තර්ගතය එකතු කරන්න.',
      english: 'Add media content using video and audio tags.'
    },
    hints: [
      'video ටැගය වීඩියෝ සඳහා',
      'audio ටැගය ශ්‍රව්‍ය සඳහා',
      'controls උපලක්ෂණය පාලන බොත්තම් පෙන්වීමට'
    ],
    xp: 25
  },
  {
    id: 'html-10',
    title: 'ව්‍යාපෘතිය - පුද්ගලික පැතිකඩ',
    description: 'සම්පූර්ණ පුද්ගලික පැතිකඩක් සාදයි',
    sinhalaTitle: 'ව්‍යාපෘතිය - පුද්ගලික පැතිකඩ',
    sinhalaDesc: 'සම්පූර්ණ පුද්ගලික පැතිකඩක් සාදයි',
    type: 'project',
    starterCode: '<!DOCTYPE html>\n<html lang="si">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>මගේ පැතිකඩ</title>\n</head>\n<body>\n    <!-- මෙහි ඔබගේ පුද්ගලික පැතිකඩ සාදන්න -->\n</body>\n</html>',
    solution: '<!DOCTYPE html>\n<html lang="si">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>මගේ පැතිකඩ</title>\n</head>\n<body>\n    <header style="background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center;">\n        <h1>අමාල් කුමාර</h1>\n        <p>Web Developer | Student</p>\n    </header>\n    \n    <nav style="background: #333; padding: 1rem; text-align: center;">\n        <a href="#about" style="color: white; margin: 0 1rem; text-decoration: none;">මම කවුද</a>\n        <a href="#skills" style="color: white; margin: 0 1rem; text-decoration: none;">කුසලතා</a>\n        <a href="#projects" style="color: white; margin: 0 1rem; text-decoration: none;">ව්යාපෘති</a>\n        <a href="#contact" style="color: white; margin: 0 1rem; text-decoration: none;">සම්බන්ධ වන්න</a>\n    </nav>\n    \n    <main style="max-width: 800px; margin: 2rem auto; padding: 0 1rem;">\n        <section id="about" style="margin-bottom: 2rem;">\n            <h2>මම කවුද</h2>\n            <p>මම තරුණ web developer කෙනෙක්. මම HTML, CSS, සහ JavaScript ඉගෙන ගනිමි. මගේ අරමුණ වන්නේ නිර්මාණාත්මක වෙබ් අඩවි නිර්මාණය කිරීමයි.</p>\n        </section>\n        \n        <section id="skills" style="margin-bottom: 2rem;">\n            <h2>මගේ කුසලතා</h2>\n            <ul>\n                <li>HTML5</li>\n                <li>CSS3</li>\n                <li>JavaScript</li>\n                <li>React</li>\n            </ul>\n        </section>\n        \n        <section id="projects" style="margin-bottom: 2rem;">\n            <h2>මගේ ව්යාපෘති</h2>\n            <div style="border: 1px solid #ddd; padding: 1rem; margin: 1rem 0; border-radius: 5px;">\n                <h3>පොත් සාදන වෙබ් අඩවිය</h3>\n                <p>පාසල් පුස්තකාලය සඳහා වූ වෙබ් අඩවිය</p>\n            </div>\n        </section>\n        \n        <section id="contact">\n            <h2>සම්බන්ධ වන්න</h2>\n            <p>ඊමේල්: amal@example.com</p>\n            <p>දුරකථන: 077-1234567</p>\n        </section>\n    </main>\n    \n    <footer style="background: #333; color: white; text-align: center; padding: 1rem; margin-top: 2rem;">\n        <p>&copy; 2024 අමාල් කුමාර. සියලු හිමිකම් ඇවිරිණි.</p>\n    </footer>\n</body>\n</html>',
    instructions: {
      sinhala: 'සම්පූර්ණ පුද්ගලික පැතිකඩක් සාදන්න. header, nav, main, footer භාවිතා කර මම කවුද, කුසලතා, ව්‍යාපෘති, සහ සම්බන්ධතා කොටස් ඇතුළත් කරන්න.',
      english: 'Create a complete personal portfolio with header, nav, main, footer sections including about, skills, projects, and contact.'
    },
    hints: [
      'semantic HTML ව්‍යුහය භාවිතා කරන්න',
      'inline styles භාවිතා කර පෙනුම වැඩිදියුණු කරන්න',
      'responsive design සඳහා viewport meta tag එකතු කරන්න'
    ],
    xp: 50
  }
];
