export const pascalLevels = [
    // --- PHASE 1: SYNTAX BASICS & OUTPUT (1-5) ---
    {
        id: 'pas-1',
        title: 'මූලික වචන (Keywords)',
        type: 'concept',
        description: 'Pascal වැඩසටහනක මූලික කොටස් හඳුනා ගනිමු.',
        instruction: 'Pseudo Code වචනයට ගැලපෙන Pascal විධානය තෝරන්න.',
        pairs: [
            { real: 'BEGIN', code: 'begin' },
            { real: 'END', code: 'end.' },
            { real: 'INPUT', code: 'readln' },
            { real: 'OUTPUT', code: 'writeln' },
            { real: 'ASSIGN', code: ':=' }
        ],
        explanation: 'Pascal හි වැඩසටහනක් "begin" වලින් පටන් ගෙන "end." (තිතක් සහිතව) අවසන් වේ. Output සඳහා "writeln" ද Input සඳහා "readln" ද භාවිතා කරයි.'
    },
    {
        id: 'pas-2',
        title: 'Hello World',
        type: 'syntax',
        description: 'සරලම Pascal වැඩසටහන.',
        instruction: '"Hello" ලෙස Output කරන වැඩසටහන පෙළගස්වන්න.',
        availableBlocks: [
            { id: 'p1', text: 'program Hello;' },
            { id: 'p2', text: 'begin' },
            { id: 'p3', text: '  writeln(\'Hello\');' },
            { id: 'p4', text: '  readln;' },
            { id: 'p5', text: 'end.' }
        ],
        correctOrder: ['program Hello;', 'begin', '  writeln(\'Hello\');', '  readln;', 'end.'],
        output: 'Hello',
        explanation: 'වැඩසටහනේ නම "program" මගින් දෙන අතර, ප්‍රධාන කොටස "begin ... end." වේ.'
    },
    {
        id: 'pas-3',
        title: 'දත්ත වර්ග (Data Types)',
        type: 'concept',
        description: 'විචල්‍යයන් වර්ග කිරීම.',
        instruction: 'ගැලපෙන Data Type එක තෝරන්න.',
        pairs: [
            { real: '10, 50, -5', code: 'integer' },
            { real: '10.5, 3.14', code: 'real' },
            { real: '"Hello", "A"', code: 'string' },
            { real: 'True, False', code: 'boolean' },
            { real: '\'A\', \'B\'', code: 'char' }
        ],
        explanation: 'Integer = පූර්ණ සංඛ්‍යා, Real = දශම සංඛ්‍යා, String = වචන, Char = තනි අකුර, Boolean = සත්‍ය/අසත්‍ය.'
    },
    {
        id: 'pas-4',
        title: 'විචල්‍යයන් සෑදීම (Var Declaration)',
        type: 'syntax',
        description: 'Variables නිවැරදිව අර්ථ දැක්වීම.',
        instruction: 'age නමින් integer විචල්‍යයක් සාදන අයුරු.',
        availableBlocks: [
            { id: 'v1', text: 'program VarDemo;' },
            { id: 'v2', text: 'var' },
            { id: 'v3', text: '  age: integer;' },
            { id: 'v4', text: 'begin' },
            { id: 'v5', text: '  age := 16;' },
            { id: 'v6', text: 'end.' }
        ],
        correctOrder: ['program VarDemo;', 'var', '  age: integer;', 'begin', '  age := 16;', 'end.'],
        explanation: '"var" යටතේ විචල්‍ය නම සහ වර්ගය (type) දැක්විය යුතුය. (name: type;)'
    },
    {
        id: 'pas-5',
        title: 'ආදානය හා ප්‍රතිදානය (I/O)',
        type: 'syntax',
        description: 'නම ඇතුලත් කර එය ආයුබෝවන් සමග පෙන්වීම.',
        instruction: 'නම ලබාගෙන (Input) පෙන්වන (Output) කේතය සකසන්න.',
        availableBlocks: [
            { id: 'io1', text: 'var name: string;' },
            { id: 'io2', text: 'begin' },
            { id: 'io3', text: '  write(\'Enter Name: \');' },
            { id: 'io4', text: '  readln(name);' },
            { id: 'io5', text: '  writeln(\'Hello \', name);' },
            { id: 'io6', text: 'end.' }
        ],
        correctOrder: ['var name: string;', 'begin', '  write(\'Enter Name: \');', '  readln(name);', '  writeln(\'Hello \', name);', 'end.'],
        output: 'Enter Name: Kamal\nHello Kamal',
        explanation: 'write මගින් කර්සරය එම පේළියේම තබයි. readln මගින් දත්ත ලබාගනී.'
    },

    // --- PHASE 2: CALCULATIONS & VARIABLES (6-10) ---
    {
        id: 'pas-6',
        title: 'එකතු කිරීම (Addition)',
        type: 'syntax',
        description: 'සංඛ්‍යා දෙකක එකතුව සෙවීම.',
        instruction: 'a සහ b එකතු කර sum ට දමන්න.',
        availableBlocks: [
            { id: 'c1', text: 'var a, b, sum: integer;' },
            { id: 'c2', text: 'begin' },
            { id: 'c3', text: '  a := 10; b := 20;' },
            { id: 'c4', text: '  sum := a + b;' },
            { id: 'c5', text: '  writeln(sum);' },
            { id: 'c6', text: 'end.' }
        ],
        correctOrder: ['var a, b, sum: integer;', 'begin', '  a := 10; b := 20;', '  sum := a + b;', '  writeln(sum);', 'end.'],
        output: '30',
        explanation: 'Pascal වල අගයක් ආදේශ කිරීමට ":=" භාවිතා කරයි.'
    },
    {
        id: 'pas-7',
        title: 'මධ්‍යන්‍යය (Average)',
        type: 'syntax',
        description: 'විෂයන් 3ක සාමාන්‍යය සෙවීම.',
        instruction: 'avg විචල්‍යය real විය යුතුය.',
        availableBlocks: [
            { id: 'a1', text: 'var total: integer; avg: real;' },
            { id: 'a2', text: 'begin' },
            { id: 'a3', text: '  total := 250;' },
            { id: 'a4', text: '  avg := total / 3;' },
            { id: 'a5', text: '  writeln(avg:0:2);' },
            { id: 'a6', text: 'end.' }
        ],
        correctOrder: ['var total: integer; avg: real;', 'begin', '  total := 250;', '  avg := total / 3;', '  writeln(avg:0:2);', 'end.'],
        output: '83.33',
        explanation: 'Real සංඛ්‍යා පෙන්වද්දී දශම ස්ථාන ගණන පාලනය කිරීමට ":0:2" වැනි ආකෘතියක් යොදා ගනී.'
    },
    {
        id: 'pas-8',
        title: 'වෘත්තයක වර්ගඵලය (Area)',
        type: 'syntax',
        description: 'Area = pi * r * r සූත්‍රය භාවිතය.',
        instruction: 'r=7 විට වර්ගඵලය සොයන්න (pi=3.14).',
        availableBlocks: [
            { id: 'ar1', text: 'const pi = 3.14;' },
            { id: 'ar2', text: 'var r, area: real;' },
            { id: 'ar3', text: 'begin' },
            { id: 'ar4', text: '  r := 7;' },
            { id: 'ar5', text: '  area := pi * r * r;' },
            { id: 'ar6', text: 'end.' }
        ],
        correctOrder: ['const pi = 3.14;', 'var r, area: real;', 'begin', '  r := 7;', '  area := pi * r * r;', 'end.'],
        explanation: 'නියත අගයන් (Constants) "const" යටතේ අර්ථ දැක්විය හැක. ඒවා වැඩසටහන අතරතුර වෙනස් කළ නොහැක.'
    },
    {
        id: 'pas-9',
        title: 'අගයන් මාරු කිරීම (Swapping)',
        type: 'syntax',
        description: 'Variables දෙකක අගයන් හුවමාරු කිරීම.',
        instruction: 'temp විචල්‍යයක් භාවිතා කරන්න.',
        availableBlocks: [
            { id: 'sw1', text: 'var x, y, temp: integer;' },
            { id: 'sw2', text: 'begin x:=5; y:=10;' },
            { id: 'sw3', text: '  temp := x;' },
            { id: 'sw4', text: '  x := y;' },
            { id: 'sw5', text: '  y := temp;' },
            { id: 'sw6', text: 'end.' }
        ],
        correctOrder: ['var x, y, temp: integer;', 'begin x:=5; y:=10;', '  temp := x;', '  x := y;', '  y := temp;', 'end.'],
        explanation: 'Temp එකට x දමා, x ට y දමා, y ට Temp දැමීමෙන් අගයන් මාරු වේ.'
    },
    {
        id: 'pas-10',
        title: 'මිල ගණනය (Calculation)',
        type: 'syntax',
        description: 'භාණ්ඩයක මිල සහ ප්‍රමාණය අනුව මුළු මුදල.',
        instruction: 'price * qty',
        availableBlocks: [
            { id: 'p1', text: 'var price, total: real;' },
            { id: 'p2', text: '    qty: integer;' },
            { id: 'p3', text: 'begin' },
            { id: 'p4', text: '  price := 120.50; qty := 5;' },
            { id: 'p5', text: '  total := price * qty;' },
            { id: 'p6', text: 'end.' }
        ],
        correctOrder: ['var price, total: real;', '    qty: integer;', 'begin', '  price := 120.50; qty := 5;', '  total := price * qty;', 'end.']
    },

    // --- PHASE 3: SELECTION (IF/ELSE) (11-20) ---
    {
        id: 'pas-11',
        title: 'සරල IF (Simple If)',
        type: 'syntax',
        description: 'ධන සංඛ්‍යාවක් දැයි බැලීම.',
        instruction: 'num > 0 නම් "Positive" ලෙස පෙන්වන්න.',
        availableBlocks: [
            { id: 'if1', text: 'if num > 0 then' },
            { id: 'if2', text: '  writeln(\'Positive\');' }
        ],
        correctOrder: ['if num > 0 then', '  writeln(\'Positive\');'],
        baseTemplate: [
            'program CheckPos;',
            'var num: integer;',
            'begin',
            '  num := 10;',
            '  {{SLOT}}',
            '  {{SLOT}}',
            'end.'
        ],
        explanation: 'IF කොන්දේසිය සත්‍ය නම් පමණක් ඊළඟ පේළිය ක්‍රියාත්මක වේ.'
    },
    {
        id: 'pas-12',
        title: 'IF ... ELSE',
        type: 'syntax',
        description: 'Pass ද Fail ද යන්න තීරණය කිරීම.',
        instruction: 'marks >= 50 නම් Pass, නැතිනම් Fail.',
        availableBlocks: [
            { id: 'ie1', text: 'if marks >= 50 then' },
            { id: 'ie2', text: '  writeln(\'Pass\')' },
            { id: 'ie3', text: 'else' },
            { id: 'ie4', text: '  writeln(\'Fail\');' }
        ],
        correctOrder: ['if marks >= 50 then', '  writeln(\'Pass\')', 'else', '  writeln(\'Fail\');'],
        explanation: 'Pascal හි else යෙදීමට පෙර පේළියේ semicolon (;) නොතිබිය යුතුය.'
    },
    {
        id: 'pas-13',
        title: 'ඔත්තේ / ඉරට්ටේ (Odd/Even)',
        type: 'syntax',
        description: 'Modulus operator භාවිතා කිරීම.',
        instruction: '2න් බෙදූ ඉතිරිය (num mod 2) 0 නම් Even.',
        availableBlocks: [
            { id: 'oe1', text: 'if num mod 2 = 0 then' },
            { id: 'oe2', text: '  writeln(\'Even\')' },
            { id: 'oe3', text: 'else' },
            { id: 'oe4', text: '  writeln(\'Odd\');' }
        ],
        correctOrder: ['if num mod 2 = 0 then', '  writeln(\'Even\')', 'else', '  writeln(\'Odd\');'],
        explanation: '"mod" මගින් බෙදූ පසු ඉතිරිය ලබාදෙයි.'
    },
    {
        id: 'pas-14',
        title: 'විශාලතම අංකය (Max)',
        type: 'syntax',
        description: 'අංක දෙකකින් විශාල එක සෙවීම.',
        instruction: 'a සහ b සසඳා විශාල එක පෙන්වන්න.',
        availableBlocks: [
            { id: 'mx1', text: 'if a > b then' },
            { id: 'mx2', text: '  writeln(a)' },
            { id: 'mx3', text: 'else' },
            { id: 'mx4', text: '  writeln(b);' }
        ],
        correctOrder: ['if a > b then', '  writeln(a)', 'else', '  writeln(b);']
    },
    {
        id: 'pas-15',
        title: 'Multiple Conditions (AND)',
        type: 'syntax',
        description: 'කොන්දේසි දෙකක් පරීක්ෂා කිරීම.',
        instruction: 'වයස 18ට වැඩි සහ ලකුණු 50ට වැඩි නම් "Eligible".',
        availableBlocks: [
            { id: 'ad1', text: 'if (age > 18) and (marks > 50) then' },
            { id: 'ad2', text: '  writeln(\'Eligible\');' }
        ],
        correctOrder: ['if (age > 18) and (marks > 50) then', '  writeln(\'Eligible\');'],
        explanation: 'කොන්දේසි දෙකක් එකවර සත්‍ය විය යුතු නම් "and" භාවිතා කරයි. කොන්දේසි වරහන් තුළ දැමීම අනිවාර්ය වේ.'
    },
    {
        id: 'pas-16',
        title: 'Nested If',
        type: 'syntax',
        description: 'If ඇතුලත තවත් If එකක්.',
        instruction: 'ධන සංඛ්‍යාවක් නම් පරිපූර්ණදැයි බලන්න.',
        availableBlocks: [
            { id: 'ni1', text: 'if num > 0 then' },
            { id: 'ni2', text: '  if num = 100 then' },
            { id: 'ni3', text: '    writeln(\'Perfect\');' }
        ],
        correctOrder: ['if num > 0 then', '  if num = 100 then', '    writeln(\'Perfect\');']
    },
    {
        id: 'pas-17',
        title: 'Leap Year',
        type: 'syntax',
        description: 'අධික අවුරුද්දක් දැයි සෙවීම.',
        instruction: 'අවුරුද්ද 4න් බෙදෙනවානම් Leap Year.',
        availableBlocks: [
            { id: 'ly1', text: 'if year mod 4 = 0 then' },
            { id: 'ly2', text: '  writeln(\'Leap Year\');' }
        ],
        correctOrder: ['if year mod 4 = 0 then', '  writeln(\'Leap Year\');']
    },
    {
        id: 'pas-18',
        title: 'Else If Ladder',
        type: 'syntax',
        description: 'විකල්ප කිහිපයක් (Grades).',
        instruction: '>75 A, >50 B, else C.',
        availableBlocks: [
            { id: 'el1', text: 'if marks > 75 then writeln(\'A\')' },
            { id: 'el2', text: 'else if marks > 50 then writeln(\'B\')' },
            { id: 'el3', text: 'else writeln(\'C\');' }
        ],
        correctOrder: ['if marks > 75 then writeln(\'A\')', 'else if marks > 50 then writeln(\'B\')', 'else writeln(\'C\');']
    },
    {
        id: 'pas-19',
        title: 'Login Check',
        type: 'syntax',
        description: ' මුරපදය පරීක්ෂා කිරීම.',
        instruction: 'Password එක "123" නම් Access.',
        availableBlocks: [
            { id: 'lc1', text: 'if pass = \'123\' then' },
            { id: 'lc2', text: '  writeln(\'Access Granted\')' },
            { id: 'lc3', text: 'else' },
            { id: 'lc4', text: '  writeln(\'Access Denied\');' }
        ],
        correctOrder: ['if pass = \'123\' then', '  writeln(\'Access Granted\')', 'else', '  writeln(\'Access Denied\');']
    },
    {
        id: 'pas-20',
        title: 'Case Statement',
        type: 'syntax',
        description: 'If වෙනුවට Case භාවිතය.',
        instruction: 'දවස 1 නම් Monday, 2 නම් Tuesday.',
        availableBlocks: [
            { id: 'cs1', text: 'case day of' },
            { id: 'cs2', text: '  1: writeln(\'Monday\');' },
            { id: 'cs3', text: '  2: writeln(\'Tuesday\');' },
            { id: 'cs4', text: 'end;' }
        ],
        correctOrder: ['case day of', '  1: writeln(\'Monday\');', '  2: writeln(\'Tuesday\');', 'end;'],
        explanation: 'විකල්ප ගොඩක් ඇති විට Case Statement එක භාවිතය පහසුයි. මෙය "end" එකකින් අවසන් කළ යුතුය.'
    },

    // --- PHASE 4: ITERATION (LOOPS) (21-30) ---
    {
        id: 'pas-21',
        title: 'FOR Loop',
        type: 'syntax',
        description: '1 සිට 5 දක්වා ලියන්න.',
        instruction: 'සරල FOR Loop එකක්.',
        availableBlocks: [
            { id: 'fl1', text: 'for i := 1 to 5 do' },
            { id: 'fl2', text: '  writeln(i);' }
        ],
        correctOrder: ['for i := 1 to 5 do', '  writeln(i);'],
        output: '1\n2\n3\n4\n5',
        explanation: 'FOR Loop එකේදී කවුන්ටර විචල්‍යය (i) ස්වයංක්‍රීයව වැඩි වේ.'
    },
    {
        id: 'pas-22',
        title: 'FOR Loop (Reverse)',
        type: 'syntax',
        description: '5 සිට 1 දක්වා අඩුවන පිළිවෙලට.',
        instruction: 'downto භාවිතය.',
        availableBlocks: [
            { id: 'fr1', text: 'for i := 5 downto 1 do' },
            { id: 'fr2', text: '  writeln(i);' }
        ],
        correctOrder: ['for i := 5 downto 1 do', '  writeln(i);']
    },
    {
        id: 'pas-23',
        title: 'WHILE Loop',
        type: 'syntax',
        description: '5ට අඩු නම් ලූප් කරන්න.',
        instruction: 'x < 5 වන තුරු ලියන්න.',
        availableBlocks: [
            { id: 'wl1', text: 'while x < 5 do' },
            { id: 'wl2', text: 'begin' },
            { id: 'wl3', text: '  writeln(x);' },
            { id: 'wl4', text: '  x := x + 1;' },
            { id: 'wl5', text: 'end;' }
        ],
        correctOrder: ['while x < 5 do', 'begin', '  writeln(x);', '  x := x + 1;', 'end;'],
        explanation: 'WHILE Loop එකේදී කොන්දේසිය සත්‍ය වන තාක් කල් ක්‍රියාත්මක වේ. Begin...End පාවිච්චි කිරීම වැදගත්.'
    },
    {
        id: 'pas-24',
        title: 'REPEAT ... UNTIL',
        type: 'syntax',
        description: 'අවම වශයෙන් එක් වරක්වත් ක්‍රියාත්මක වීම.',
        instruction: 'x 10 වන තුරු එකතු කරන්න.',
        availableBlocks: [
            { id: 'rp1', text: 'repeat' },
            { id: 'rp2', text: '  x := x + 1;' },
            { id: 'rp3', text: 'until x = 10;' }
        ],
        correctOrder: ['repeat', '  x := x + 1;', 'until x = 10;'],
        explanation: 'REPEAT ... UNTIL හි කොන්දේසිය පරීක්ෂා කරන්නේ අවසානයේදියි. එම නිසා අඩුම තරමේ එක් වරක් වත් ලූපය ක්‍රියාත්මක වේ.'
    },
    {
        id: 'pas-25',
        title: 'එකතුව (Summation)',
        type: 'syntax',
        description: '1-10 එකතුව (For Loop).',
        instruction: 'Sum එකතු කරගන්න.',
        availableBlocks: [
            { id: 'sm1', text: 'sum := 0;' },
            { id: 'sm2', text: 'for i := 1 to 10 do' },
            { id: 'sm3', text: '  sum := sum + i;' }
        ],
        correctOrder: ['sum := 0;', 'for i := 1 to 10 do', '  sum := sum + i;']
    },
    {
        id: 'pas-26',
        title: 'ගුණන වගුව (Multiplication)',
        type: 'syntax',
        description: '2 ගුණන වගුව.',
        instruction: '2 * i මුද්‍රණය කරන්න.',
        availableBlocks: [
            { id: 'mt1', text: 'for i := 1 to 12 do' },
            { id: 'mt2', text: '  writeln(2, \' * \', i, \' = \', 2*i);' }
        ],
        correctOrder: ['for i := 1 to 12 do', '  writeln(2, \' * \', i, \' = \', 2*i);']
    },
    {
        id: 'pas-27',
        title: 'Square Numbers',
        type: 'syntax',
        description: 'වර්ග සංඛ්‍යා මුද්‍රණය.',
        instruction: '1 සිට 5 දක්වා වර්ග (Square) සොයන්න.',
        availableBlocks: [
            { id: 'sq1', text: 'for i := 1 to 5 do' },
            { id: 'sq2', text: '  writeln(i * i);' }
        ],
        correctOrder: ['for i := 1 to 5 do', '  writeln(i * i);']
    },
    {
        id: 'pas-28',
        title: 'Input Loop',
        type: 'syntax',
        description: '0 ගහනකම් Input ගන්න.',
        instruction: '0 ආවොත් නවතින්න.',
        availableBlocks: [
            { id: 'il1', text: 'repeat' },
            { id: 'il2', text: '  readln(num);' },
            { id: 'il3', text: 'until num = 0;' }
        ],
        correctOrder: ['repeat', '  readln(num);', 'until num = 0;']
    },
    {
        id: 'pas-29',
        title: 'තරු රටාවක් (Patterns)',
        type: 'syntax',
        description: 'තරු 5ක් ළඟින් ළඟ මුද්‍රණය.',
        instruction: '***** ලෙස පෙන්වන්න.',
        availableBlocks: [
            { id: 'pt1', text: 'for i := 1 to 5 do' },
            { id: 'pt2', text: '  write(\'*\');' }
        ],
        correctOrder: ['for i := 1 to 5 do', '  write(\'*\');'],
        output: '*****',
        explanation: 'write භාවිතා කළ විට පේළිය මාරු නොවේ.'
    },
    {
        id: 'pas-30',
        title: 'Even Numbers Loop',
        type: 'syntax',
        description: 'ඉරට්ටේ සංඛ්‍යා පමණක් ලියන්න.',
        instruction: '1-10 අතර ඉරට්ටේ සංඛ්‍යා.',
        availableBlocks: [
            { id: 'en1', text: 'for i := 1 to 10 do' },
            { id: 'en2', text: '  if i mod 2 = 0 then' },
            { id: 'en3', text: '    writeln(i);' }
        ],
        correctOrder: ['for i := 1 to 10 do', '  if i mod 2 = 0 then', '    writeln(i);']
    }
];
