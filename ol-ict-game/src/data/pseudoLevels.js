export const pseudoLevels = [
    // --- PHASE 1: CONCEPTS (Matching Real World to Keywords) ---
    {
        id: 'con-1',
        title: 'හැඳින්වීම (Introduction)',
        type: 'concept',
        description: 'පරිගණක භාෂාවේ මූලික වචන හඳුනා ගනිමු.',
        instruction: 'වම් පැත්තේ ඇති ක්‍රියාවට ගැලපෙන Pseudo Code වචනය දකුණු පැත්තෙන් තෝරන්න.',
        pairs: [
            { real: 'ආරම්භය (Start)', code: 'BEGIN' },
            { real: 'අවසානය (End)', code: 'END' },
            { real: 'දත්ත ඇතුලත් කිරීම (Input)', code: 'INPUT' },
            { real: 'ප්‍රතිදානය පෙන්වීම (Output)', code: 'OUTPUT' },
            { real: 'ක්‍රියාවලිය (Process)', code: 'PROCESS' }
        ],
        explanation: 'Programming වලදී අපි භාවිතා කරන ප්‍රධාන වචන කිහිපයක් තිබෙනවා. BEGIN සහ END මගින් වැඩසටහනේ ආරම්භය සහ අවසානය දක්වයි. INPUT මගින් දත්ත ලබාගැනීමත්, OUTPUT මගින් ප්‍රතිඵල පෙන්වීමත් සිදුවේ.'
    },
    {
        id: 'con-2',
        title: 'සරල පියවර (Simple Steps)',
        type: 'sequence',
        description: 'සරල ක්‍රියාවලියක් Pseudo Code මගින් ලියන ආකාරය බලමු.',
        instruction: 'තේ සෑදීමේ පියවරයන් නිවැරදි Pseudo Code ආකෘතියට පෙළගස්වන්න.',
        availableBlocks: [
            { id: '1', text: 'BEGIN' },
            { id: '2', text: 'INPUT Water, Tea, Sugar' },
            { id: '3', text: 'PROCESS Boil Water' },
            { id: '4', text: 'PROCESS Add components' },
            { id: '5', text: 'OUTPUT Hot Tea' },
            { id: '6', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'INPUT Water, Tea, Sugar', 'PROCESS Boil Water', 'PROCESS Add components', 'OUTPUT Hot Tea', 'END'],
        explanation: 'ඕනෑම පරිගණක වැඩසටහනක් ක්‍රියාත්මක වන්නේ පියවරෙන් පියවර (Sequence) අනුපිළිවෙලටයි. මෙහිදී අපි පළමුව අමුද්‍රව්‍ය ලබාගෙන (Input), ඒවා සැකසූ පසු (Process), අවසානයේ තේ එක ලබා දුන්නෙමු (Output).'
    },

    // --- VARIABLES (VAR) ---
    {
        id: 'var-1',
        title: 'විචල්‍යයන් (Variables)',
        type: 'sequence',
        description: 'දත්ත ගබඩා කිරීමට Variables භාවිතා කරන ආකාරය.',
        instruction: 'වයස (Age) විචල්‍යයට අගයක් ආදේශ කරන ආකාරය පෙළගස්වන්න.',
        availableBlocks: [
            { id: 'v1', text: 'BEGIN' },
            { id: 'v2', text: 'age = 16' },
            { id: 'v3', text: 'name = "Kamal"' },
            { id: 'v4', text: 'OUTPUT name, age' },
            { id: 'v5', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'age = 16', 'name = "Kamal"', 'OUTPUT name, age', 'END'],
        explanation: 'Variable එකක් යනු දත්ත ගබඩා කළ හැකි ස්ථානයකි. මෙහිදී අපි `age` සහ `name` යන Variables දෙක සාදා ඒවාට අගයන් ආදේශ (Assign) කළෙමු.'
    },
    {
        id: 'var-2',
        title: 'ගණනය කිරීම් (Calculations)',
        type: 'sequence',
        description: 'විචල්‍යයන් භාවිතා කර ගණනය කිරීම් සිදු කිරීම.',
        instruction: 'වෘත්තයක වර්ගඵලය (Area) සෙවීමේ පියවර පෙළගස්වන්න.',
        availableBlocks: [
            { id: 'c1', text: 'BEGIN' },
            { id: 'c2', text: 'INPUT radius' },
            { id: 'c3', text: 'pi = 3.14' },
            { id: 'c4', text: 'area = pi * radius * radius' },
            { id: 'c5', text: 'OUTPUT area' },
            { id: 'c6', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'INPUT radius', 'pi = 3.14', 'area = pi * radius * radius', 'OUTPUT area', 'END'],
        explanation: 'ගණිතමය ගැටලු විසඳීමේදී විචල්‍යයන් ලොකු සහයක් ලබාදෙයි. `pi` සඳහා 3.14 අගයත්, `radius` සඳහා පරිශීලකයා දෙන අගයත් ගෙන වර්ගඵලය ගණනය කර ඇත.'
    },
    {
        id: 'var-3',
        title: 'Variable Swapping',
        type: 'sequence',
        description: 'විචල්‍යයන් දෙකක අගයන් මාරු කිරීම (Swapping Logic).',
        instruction: 'A සහ B හි අගයන් එකිනෙක මාරු කරන (Swap) පියවර පෙළගස්වන්න. (Temporary variable එකක් භාවිතා කරන්න)',
        availableBlocks: [
            { id: 's1', text: 'BEGIN' },
            { id: 's2', text: 'temp = A' },
            { id: 's3', text: 'A = B' },
            { id: 's4', text: 'B = temp' },
            { id: 's5', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'temp = A', 'A = B', 'B = temp', 'END'],
        explanation: 'Variables දෙකක අගයන් මාරු කිරීමට (Swap), අපට තුන්වන Variable එකක් (Temporary) අවශ්‍ය වේ. පළමුව A ගේ අගය temp හි තබා, පසුව B ගේ අගය A ට දමා, අවසානයේ temp (A ගේ පැරණි අගය) B ට දැමිය යුතුය.'
    },

    // --- SELECTION (IF/ELSE) ---
    {
        id: 'sel-1',
        title: 'තීරණ ගැනීම (Selection - IF)',
        type: 'sequence',
        description: 'යම් කොන්දේසියක් මත තීරණයක් ගැනීම.',
        instruction: 'වයස 18 ට වැඩි නම් "Adult" ලෙස මුද්‍රණය කරන කේතය සකසන්න.',
        availableBlocks: [
            { id: 'if1', text: 'BEGIN' },
            { id: 'if2', text: 'INPUT age' },
            { id: 'if3', text: 'IF age >= 18 THEN' },
            { id: 'if4', text: 'OUTPUT "Adult"' },
            { id: 'if5', text: 'ENDIF' },
            { id: 'if6', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'INPUT age', 'IF age >= 18 THEN', 'OUTPUT "Adult"', 'ENDIF', 'END'],
        explanation: 'IF භාවිතා කරන්නේ යම් කොන්දේසියක් සත්‍ය වූ විට පමණක් යමක් කිරීමටයි. මෙහිදී වයස 18 හෝ ඊට වැඩි නම් පමණක් "Adult" ලෙස මුද්‍රණය වේ.'
    },
    {
        id: 'sel-2',
        title: 'IF ... ELSE',
        type: 'sequence',
        description: 'කොන්දේසිය සත්‍ය හෝ අසත්‍ය වූ විට ක්‍රියාත්මක වන කොටස්.',
        instruction: 'විභාගය සමත් (Pass) ද අසමත් (Fail) ද යන්න සොයන කේතය සකසන්න.',
        availableBlocks: [
            { id: 'ie1', text: 'BEGIN' },
            { id: 'ie2', text: 'INPUT marks' },
            { id: 'ie3', text: 'IF marks >= 50 THEN' },
            { id: 'ie4', text: 'OUTPUT "Pass"' },
            { id: 'ie5', text: 'ELSE' },
            { id: 'ie6', text: 'OUTPUT "Fail"' },
            { id: 'ie7', text: 'ENDIF' },
            { id: 'ie8', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'INPUT marks', 'IF marks >= 50 THEN', 'OUTPUT "Pass"', 'ELSE', 'OUTPUT "Fail"', 'ENDIF', 'END'],
        explanation: 'IF ... ELSE භාවිතා කරන විට, කොන්දේසිය සත්‍ය නම් IF කොටසත්, අසත්‍ය නම් ELSE කොටසත් ක්‍රියාත්මක වේ. (ලකුණු 50 ට වැඩි නම් Pass, නැතිනම් Fail).'
    },
    {
        id: 'sel-3',
        title: ' ඔත්තේ / ඉරට්ටේ (Odd / Even)',
        type: 'sequence',
        description: 'සංඛ්‍යාවක් ඔත්තේ ද ඉරට්ටේ ද යන්න සෙවීම.',
        instruction: 'අංකය 2න් බෙදූ විට ඉතිරිය 0 නම් එය "Even" වේ.',
        availableBlocks: [
            { id: 'oe1', text: 'BEGIN' },
            { id: 'oe2', text: 'INPUT number' },
            { id: 'oe3', text: 'remainder = number MOD 2' },
            { id: 'oe4', text: 'IF remainder == 0 THEN' },
            { id: 'oe5', text: 'OUTPUT "Even"' },
            { id: 'oe6', text: 'ELSE' },
            { id: 'oe7', text: 'OUTPUT "Odd"' },
            { id: 'oe8', text: 'ENDIF' },
            { id: 'oe9', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'INPUT number', 'remainder = number MOD 2', 'IF remainder == 0 THEN', 'OUTPUT "Even"', 'ELSE', 'OUTPUT "Odd"', 'ENDIF', 'END'],
        explanation: 'MOD මගින් බෙදූ පසු ඉතිරිය ලබාදෙයි. ඕනෑම සංඛ්‍යාවක් 2න් බෙදූ විට ඉතිරිය 0 නම් එය ඉරට්ටේ (Even) සංඛ්‍යාවකි.'
    },
    {
        id: 'sel-4',
        title: 'ශ්‍රේණි ක්‍රමය (Nested IF / Else If)',
        type: 'sequence',
        description: 'කොන්දේසි කිහිපයක් පරීක්ෂා කිරීම (A, B, C Grading).',
        instruction: 'ලකුණු 75ට වැඩි නම් A, 50ට වැඩි නම් B, නැතිනම් C.',
        availableBlocks: [
            { id: 'g1', text: 'BEGIN' },
            { id: 'g2', text: 'INPUT marks' },
            { id: 'g3', text: 'IF marks >= 75 THEN' },
            { id: 'g4', text: 'grade = "A"' },
            { id: 'g5', text: 'ELSE IF marks >= 50 THEN' },
            { id: 'g6', text: 'grade = "B"' },
            { id: 'g7', text: 'ELSE' },
            { id: 'g8', text: 'grade = "C"' },
            { id: 'g9', text: 'ENDIF' },
            { id: 'g10', text: 'OUTPUT grade' },
            { id: 'g11', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'INPUT marks', 'IF marks >= 75 THEN', 'grade = "A"', 'ELSE IF marks >= 50 THEN', 'grade = "B"', 'ELSE', 'grade = "C"', 'ENDIF', 'OUTPUT grade', 'END'],
        explanation: 'විකල්ප කිහිපයක් ඇති විට ELSE IF භාවිතා කරයි. පළමු කොන්දේසිය වැරදි නම් පමණක් ඊළඟ ELSE IF පරීක්ෂා කරයි.'
    },

    // --- ITERATION (LOOPS) ---
    {
        id: 'iter-1',
        title: 'පුනරාවර්තන (Loops - Concept)',
        type: 'concept',
        description: 'පුනරාවර්තන වර්ග හඳුනාගනිමු.',
        instruction: 'ලූප වර්ගය සහ එහි භාවිතය ගලපන්න.',
        pairs: [
            { real: 'නිශ්චිත වාර ගණනක් (Fixed Number)', code: 'FOR Loop' },
            { real: 'කොන්දේසිය සත්‍ය වන තුරු (While True)', code: 'WHILE Loop' },
            { real: 'අවම වශයෙන් එක් වරක්වත් (At least once)', code: 'DO-WHILE Loop' }
        ],
        explanation: 'එකම දෙය නැවත නැවත කිරීමට Loops භාවිතා කරයි. වාර ගණන දන්නා විට FOR ද, නොදන්නා විට WHILE ද භාවිතා කරයි.'
    },
    {
        id: 'iter-2',
        title: 'FOR Loop (Counting)',
        type: 'sequence',
        description: '1 සිට 5 දක්වා අංක මුද්‍රණය කිරීම.',
        instruction: 'FOR Loop එකක් භාවිතා කර 1 සිට 5 දක්වා ලියන පියවර පෙළගස්වන්න.',
        availableBlocks: [
            { id: 'f1', text: 'BEGIN' },
            { id: 'f2', text: 'FOR k = 1 TO 5' },
            { id: 'f3', text: 'OUTPUT k' },
            { id: 'f4', text: 'NEXT k' },
            { id: 'f5', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'FOR k = 1 TO 5', 'OUTPUT k', 'NEXT k', 'END'],
        explanation: 'FOR Loop එකක් මගින් k හි අගය 1 සිට 5 දක්වා විචලනය කරමින් එම කොටස 5 වතාවක් ක්‍රියාත්මක කරයි.'
    },
    {
        id: 'iter-3',
        title: 'WHILE Loop (Summation)',
        type: 'sequence',
        description: '1 සිට 5 දක්වා අංක වල එකතුව සෙවීම.',
        instruction: 'WHILE Loop එකක් භාවිතා කරන්න.',
        availableBlocks: [
            { id: 'w1', text: 'BEGIN' },
            { id: 'w2', text: 'sum = 0' },
            { id: 'w3', text: 'n = 1' },
            { id: 'w4', text: 'WHILE n <= 5 DO' },
            { id: 'w5', text: 'sum = sum + n' },
            { id: 'w6', text: 'n = n + 1' },
            { id: 'w7', text: 'ENDWHILE' },
            { id: 'w8', text: 'OUTPUT sum' },
            { id: 'w9', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'sum = 0', 'n = 1', 'WHILE n <= 5 DO', 'sum = sum + n', 'n = n + 1', 'ENDWHILE', 'OUTPUT sum', 'END'],
        explanation: 'WHILE Loop එකේදී කොන්දේසිය (n <= 5) සත්‍ය වන තාක් කල් ලූපය ක්‍රියාත්මක වේ. n හි අගය වැඩි කිරීම (n = n + 1) අනිවාර්ය වේ.'
    },
    {
        id: 'iter-4',
        title: 'DO-WHILE (Validation)',
        type: 'sequence',
        description: 'නිවැරදි Password එක දෙන තුරු නැවත ඇසීම.',
        instruction: 'අවම වශයෙන් එක් වරක්වත් Password එක අසන ආකාරය සකසන්න.',
        availableBlocks: [
            { id: 'd1', text: 'BEGIN' },
            { id: 'd2', text: 'REPEAT' },
            { id: 'd3', text: 'INPUT password' },
            { id: 'd4', text: 'UNTIL password == "123"' },
            { id: 'd5', text: 'OUTPUT "Access Granted"' },
            { id: 'd6', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'REPEAT', 'INPUT password', 'UNTIL password == "123"', 'OUTPUT "Access Granted"', 'END'],
        explanation: 'REPEAT...UNTIL (DO-WHILE) ලූපය අවම වශයෙන් එක් වරක්වත් ක්‍රියාත්මක වේ. මෙහිදී Password නිවැරදි වන තුරු නැවත නැවත අසයි.'
    },

    // --- PHASE 3: FLOWCHART TRANSLATION ---
    {
        id: 'trans-1',
        title: 'ගැලීම් සටහන් (Flowchart Translation)',
        type: 'translation',
        description: 'වම් පස ඇති ගැලීම් සටහනට (Flowchart) ගැලපෙන Pseudo Code එක සකසන්න.',
        instruction: 'ගැලීම් සටහනේ පියවර අනුපිළිවෙලට Pseudo Code මගින් ලියන්න.',
        flowchartNodes: [
            { id: '1', type: 'terminal', data: { label: 'START' }, position: { x: 100, y: 0 } },
            { id: '2', type: 'parallelogram', data: { label: 'INPUT x, y' }, position: { x: 90, y: 80 } },
            { id: '3', type: 'process', data: { label: 'sum = x + y' }, position: { x: 90, y: 160 } },
            { id: '4', type: 'parallelogram', data: { label: 'OUTPUT sum' }, position: { x: 90, y: 240 } },
            { id: '5', type: 'terminal', data: { label: 'STOP' }, position: { x: 100, y: 320 } }
        ],
        flowchartEdges: [
            { id: 'e1-2', source: '1', target: '2', style: { strokeWidth: 2 } },
            { id: 'e2-3', source: '2', target: '3', style: { strokeWidth: 2 } },
            { id: 'e3-4', source: '3', target: '4', style: { strokeWidth: 2 } },
            { id: 'e4-5', source: '4', target: '5', style: { strokeWidth: 2 } }
        ],
        availableBlocks: [
            { id: 't1-1', text: 'BEGIN' },
            { id: 't1-2', text: 'INPUT x, y' },
            { id: 't1-3', text: 'sum = x + y' },
            { id: 't1-4', text: 'OUTPUT sum' },
            { id: 't1-5', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'INPUT x, y', 'sum = x + y', 'OUTPUT sum', 'END'],
        explanation: 'Flowchart එකේ සංකේත Pseudo Code වලට පරිවර්තනය කිරීමේදී, Parallelogram -> INPUT/OUTPUT ද, Rectangle -> Process ද ලෙස ගනු ලැබේ.'
    },
    {
        id: 'trans-2',
        title: 'තීරණ ගැනීමේ සටහන් (Selection Flowchart)',
        type: 'translation',
        description: 'Decision Box (Diamond) සහිත ගැලීම් සටහනක් පරිවර්තනය.',
        instruction: 'Marks > 50 බලා Pass/Fail තීරණය කරන සටහනට කේතය ලියන්න.',
        flowchartNodes: [
            { id: '1', type: 'terminal', data: { label: 'START' }, position: { x: 150, y: 0 } },
            { id: '2', type: 'parallelogram', data: { label: 'INPUT marks' }, position: { x: 140, y: 80 } },
            { id: '3', type: 'diamond', data: { label: 'marks > 50?' }, position: { x: 150, y: 160 } },
            { id: '4', type: 'parallelogram', data: { label: 'Print "Pass"' }, position: { x: 30, y: 280 } },
            { id: '5', type: 'parallelogram', data: { label: 'Print "Fail"' }, position: { x: 270, y: 280 } },
            { id: '6', type: 'terminal', data: { label: 'STOP' }, position: { x: 150, y: 380 } }
        ],
        flowchartEdges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
            { id: 'e3-5', source: '3', target: '5', label: 'No' },
            { id: 'e4-6', source: '4', target: '6' },
            { id: 'e5-6', source: '5', target: '6' }
        ],
        availableBlocks: [
            { id: 't2-1', text: 'BEGIN' },
            { id: 't2-2', text: 'INPUT marks' },
            { id: 't2-3', text: 'IF marks > 50 THEN' },
            { id: 't2-4', text: 'OUTPUT "Pass"' },
            { id: 't2-5', text: 'ELSE' },
            { id: 't2-6', text: 'OUTPUT "Fail"' },
            { id: 't2-7', text: 'ENDIF' },
            { id: 't2-8', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'INPUT marks', 'IF marks > 50 THEN', 'OUTPUT "Pass"', 'ELSE', 'OUTPUT "Fail"', 'ENDIF', 'END'],
        explanation: 'Diamond හැඩයෙන් IF Condition එක නිරූපණය වේ. Yes පාදයේ ඇති දේ IF කොටසටත්, No පාදයේ ඇති දේ ELSE කොටසටත් අයත් වේ.'
    },
    {
        id: 'trans-3',
        title: 'ලූප සටහන් (Loop Flowchart)',
        type: 'translation',
        description: 'WHILE Loop එකක් සහිත ගැලීම් සටහනක් කියවමු.',
        instruction: 'count < 5 වන තුරු count එක මුද්‍රණය කරන (Loop) සටහනට කේතය ලියන්න.',
        flowchartNodes: [
            { id: '1', type: 'terminal', data: { label: 'START' }, position: { x: 150, y: 0 } },
            { id: '2', type: 'process', data: { label: 'count = 0' }, position: { x: 140, y: 80 } },
            { id: '3', type: 'diamond', data: { label: 'count < 5?' }, position: { x: 150, y: 160 } },
            { id: '4', type: 'parallelogram', data: { label: 'Print count' }, position: { x: 140, y: 280 } },
            { id: '5', type: 'process', data: { label: 'count++' }, position: { x: 140, y: 360 } },
            { id: '6', type: 'terminal', data: { label: 'STOP' }, position: { x: 350, y: 185 } }
        ],
        flowchartEdges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4', label: 'Yes' }, // Default handle (Bottom)
            { id: 'e4-5', source: '4', target: '5' },
            { id: 'e5-3', source: '5', target: '3', type: 'smoothstep', label: 'Loop' },
            { id: 'e3-6', source: '3', target: '6', label: 'No', sourceHandle: 'right', type: 'smoothstep' } // Use Right handle
        ],
        availableBlocks: [
            { id: 't3-1', text: 'BEGIN' },
            { id: 't3-2', text: 'count = 0' },
            { id: 't3-3', text: 'WHILE count < 5 DO' },
            { id: 't3-4', text: 'OUTPUT count' },
            { id: 't3-5', text: 'count = count + 1' },
            { id: 't3-6', text: 'ENDWHILE' },
            { id: 't3-7', text: 'END' }
        ],
        correctOrder: ['BEGIN', 'count = 0', 'WHILE count < 5 DO', 'OUTPUT count', 'count = count + 1', 'ENDWHILE', 'END'],
        explanation: 'Loop එකකදී ඊතලය නැවත උඩට (Back to Condition) ගමන් කරයි. එය WHILE Loop එකක් ලෙස හඳුනාගත හැක.'
    }
];
