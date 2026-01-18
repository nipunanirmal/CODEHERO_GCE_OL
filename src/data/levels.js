export const levels = [
    // --- SEQUENCE (SEQ) ---
    {
        id: 'seq-1',
        title: 'රසවත් තේ කෝප්පය',
        category: 'Sequence',
        description: 'තේ කෝප්පයක් සෑදීමේ නිවැරදි පියවර පෙළගස්වන්න.',
        initialNodes: [
            { id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } },
        ],
        availableBlocks: [
            { type: 'process', label: 'වතුර රත් කිරීම', execute: (ctx) => { ctx.logs.push('වතුර රත් විය'); } },
            { type: 'process', label: 'තේ පවුඩර් දැමීම', execute: (ctx) => { ctx.logs.push('තේ පවුඩර් දැමුවා'); } },
            { type: 'io', label: 'සීනි සහ කිරි ගන්න', execute: (ctx) => { ctx.logs.push('සීනි සහ කිරි ගත්තා'); } },
            { type: 'process', label: 'කිරි එකතු කිරීම', execute: (ctx) => { ctx.logs.push('කිරි එකතු කළා'); } },
            { type: 'io', label: 'තේ පිළිගැන්වීම', execute: (ctx) => { ctx.logs.push('තේ පිළිගැන්වුවා'); } },
            { type: 'terminator', label: 'අවසානය', execute: (ctx) => { ctx.finished = true; } }
        ],
        // For simple sequence, we can check if edges connect these specific node labels in order,
        // or just check if valid Start -> Process... -> End path exists.
        // Here we will use a simple list of expected labels in order for the "main path".
        expectedPath: ['ආරම්භය', 'සීනි සහ කිරි ගන්න', 'වතුර රත් කිරීම', 'තේ පවුඩර් දැමීම', 'කිරි එකතු කිරීම', 'තේ පිළිගැන්වීම', 'අවසානය'],
        execution: {
            maxSteps: 10,
            expectedLogs: ['සීනි සහ කිරි ගත්තා', 'වතුර රත් විය', 'තේ පවුඩර් දැමුවා', 'කිරි එකතු කළා', 'තේ පිළිගැන්වුවා']
        }
    },
    {
        id: 'seq-2',
        title: 'පාසල් යාම',
        category: 'Sequence',
        description: 'උදෑසන අවදි වී පාසල් යාමට සූදානම් වීම.',
        initialNodes: [
            { id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } },
        ],
        availableBlocks: [
            { type: 'process', label: 'මුහුණ සේදීම', execute: (ctx) => { ctx.logs.push('මුහුණ සේදුවා'); } },
            { type: 'process', label: 'ඇඳුම් ඇඳීම', execute: (ctx) => { ctx.logs.push('ඇඳුම් ඇඳගත්තා'); } },
            { type: 'process', label: 'ආහාර ගැනීම', execute: (ctx) => { ctx.logs.push('ආහාර ගත්තා'); } },
            { type: 'terminator', label: 'අවසානය', execute: (ctx) => { ctx.finished = true; } }
        ],
        expectedPath: ['ආරම්භය', 'මුහුණ සේදීම', 'ඇඳුම් ඇඳීම', 'ආහාර ගැනීම', 'අවසානය'],
        execution: {
            maxSteps: 10,
            expectedLogs: ['මුහුණ සේදුවා', 'ඇඳුම් ඇඳගත්තා', 'ආහාර ගත්තා']
        }
    },

    // --- SELECTION (SEL) ---
    {
        id: 'sel-1',
        title: 'සමත් / අසමත්',
        category: 'Selection',
        description: 'ලකුණු 50 ට වැඩි නම් "සමත්" ලෙසත්, නැතිනම් "අසමත්" ලෙසත් දත්ත ප්‍රතිදානය කරන්න.',
        initialNodes: [
            { id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } },
        ],
        availableBlocks: [
            { type: 'io', label: 'ලකුණු ඇතුළත් කිරීම', execute: (ctx) => { ctx.marks = 75; ctx.logs.push('ලකුණු: 75'); } },
            { type: 'decision', label: 'ලකුණු > 50?', execute: (ctx) => { return ctx.marks > 50; } },
            { type: 'io', label: 'සමත්', execute: (ctx) => { ctx.logs.push('සමත්'); } },
            { type: 'io', label: 'අසමත්', execute: (ctx) => { ctx.logs.push('අසමත්'); } },
            { type: 'terminator', label: 'අවසානය', execute: (ctx) => { ctx.finished = true; } }
        ],
        requiredConnections: [
            ['ආරම්භය', 'ලකුණු ඇතුළත් කිරීම'],
            ['ලකුණු ඇතුළත් කිරීම', 'ලකුණු > 50?'],
            ['ලකුණු > 50?', 'සමත්', 'yes'],
            ['ලකුණු > 50?', 'අසමත්', 'no'],
            ['සමත්', 'අවසානය'],
            ['අසමත්', 'අවසානය']
        ],
        execution: {
            maxSteps: 10,
            expectedLogs: ['ලකුණු: 75', 'සමත්']
        }
    },
    {
        id: 'sel-2',
        title: 'වැසි දිනය',
        category: 'Selection',
        description: 'වැස්ස තිබේ නම් කුඩයක් ගෙන යන්න.',
        initialNodes: [
            { id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } },
        ],
        availableBlocks: [
            { type: 'decision', label: 'වැස්සද?', execute: (ctx) => { ctx.rain = true; return ctx.rain; } },
            { type: 'process', label: 'කුඩය ගන්න', execute: (ctx) => { ctx.logs.push('කුඩය ගත්තා'); } },
            { type: 'terminator', label: 'අවසානය', execute: (ctx) => { ctx.finished = true; } }
        ],
        requiredConnections: [
            ['ආරම්භය', 'වැස්සද?'],
            ['වැස්සද?', 'කුඩය ගන්න', 'yes'],
            ['වැස්සද?', 'අවසානය', 'no'],
            ['කුඩය ගන්න', 'අවසානය']
        ],
        execution: {
            maxSteps: 10,
            expectedLogs: ['කුඩය ගත්තා']
        }
    },

    // --- ITERATION (ITER) ---
    {
        id: 'iter-1',
        title: '1 සිට 5 ට ගැනිම',
        category: 'Iteration',
        description: '1 සිට 5 දක්වා සංඛ්‍යා ප්‍රතිදානය කරන්න.',
        initialNodes: [
            { id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } },
        ],
        availableBlocks: [
            { type: 'process', label: 'x = 1', execute: (ctx) => { ctx.x = 1; } },
            { type: 'decision', label: 'x <= 5?', execute: (ctx) => { return ctx.x <= 5; } },
            { type: 'io', label: 'Print x', execute: (ctx) => { ctx.logs.push(ctx.x); } },
            { type: 'process', label: 'x = x + 1', execute: (ctx) => { ctx.x = (ctx.x || 0) + 1; } },
            { type: 'terminator', label: 'අවසානය', execute: (ctx) => { ctx.finished = true; } }
        ],
        requiredConnections: [
            ['ආරම්භය', 'x = 1'],
            ['x = 1', 'x <= 5?'],
            ['x <= 5?', 'Print x', 'yes'],
            ['Print x', 'x = x + 1'],
            ['x = x + 1', 'x <= 5?'], // Loop back
            ['x <= 5?', 'අවසානය', 'no']
        ],
        execution: {
            maxSteps: 50,
            expectedLogs: [1, 2, 3, 4, 5]
        }
    },
    // --- ADDITIONAL LEVELS ---
    {
        id: 'seq-3',
        title: 'පැලයක් සිටුවීම',
        category: 'Sequence',
        description: 'පැලයක් සිටුවීමේ පියවර නිවැරදිව පෙළගස්වන්න.',
        initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
        availableBlocks: [
            { type: 'process', label: 'වලක් හෑරීම', execute: (ctx) => { ctx.logs.push('වලක් හෑරුවා'); } },
            { type: 'process', label: 'පැලය සිටුවීම', execute: (ctx) => { ctx.logs.push('පැලය සිටුවුවා'); } },
            { type: 'process', label: 'වතුර දැමීම', execute: (ctx) => { ctx.logs.push('වතුර දැමුවා'); } },
            { type: 'terminator', label: 'අවසානය', execute: (ctx) => { ctx.finished = true; } }
        ],
        expectedPath: ['ආරම්භය', 'වලක් හෑරීම', 'පැලය සිටුවීම', 'වතුර දැමීම', 'අවසානය'],
        execution: {
            maxSteps: 10,
            expectedLogs: ['වලක් හෑරුවා', 'පැලය සිටුවුවා', 'වතුර දැමුවා']
        }
    },
    {
        id: 'seq-4',
        title: 'ඔන්ලයින් භාණ්ඩ මිලදී ගැනීම',
        category: 'Sequence',
        description: 'අන්තර්ජාලයෙන් භාණ්ඩයක් ඇණවුම් කරන පියවර.',
        initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
        availableBlocks: [
            { type: 'io', label: 'භාණ්ඩය තෝරාගැනීම', execute: (ctx) => { ctx.logs.push('භාණ්ඩය තෝරා ගත්තා'); } },
            { type: 'process', label: 'එකතු කිරීම (Cart)', execute: (ctx) => { ctx.logs.push('Cart එකට දැමුවා'); } },
            { type: 'process', label: 'මුදල් ගෙවීම', execute: (ctx) => { ctx.logs.push('මුදල් ගෙවුවා'); } },
            { type: 'terminator', label: 'අවසානය', execute: (ctx) => { ctx.finished = true; } }
        ],
        expectedPath: ['ආරම්භය', 'භාණ්ඩය තෝරාගැනීම', 'එකතු කිරීම (Cart)', 'මුදල් ගෙවීම', 'අවසානය'],
        execution: {
            maxSteps: 10,
            expectedLogs: ['භාණ්ඩය තෝරා ගත්තා', 'Cart එකට දැමුවා', 'මුදල් ගෙවුවා']
        }
    },
    {
        id: 'seq-5',
        title: 'දත් මැදීම',
        category: 'Sequence',
        description: 'දිනපතා දත් මැදීමේ පියවර.',
        initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
        availableBlocks: [
            { type: 'process', label: 'බුරුසුවට ආලේපන දැමීම', execute: (ctx) => { ctx.logs.push('ආලේපන දැමුවා'); } },
            { type: 'process', label: 'දත් මැදීම', execute: (ctx) => { ctx.logs.push('දත් මැද්දා'); } },
            { type: 'process', label: 'කට සේදීම', execute: (ctx) => { ctx.logs.push('කට හේදුවා'); } },
            { type: 'terminator', label: 'අවසානය', execute: (ctx) => { ctx.finished = true; } }
        ],
        expectedPath: ['ආරම්භය', 'බුරුසුවට ආලේපන දැමීම', 'දත් මැදීම', 'කට සේදීම', 'අවසානය'],
        execution: {
            maxSteps: 10,
            expectedLogs: ['ආලේපන දැමුවා', 'දත් මැද්දා', 'කට හේදුවා']
        }
    },
    {
        id: 'sel-3',
        title: 'ඡන්දය දීම',
        category: 'Selection',
        description: 'වයස අවුරුදු 18 ට වැඩි නම් පමණක් ඡන්දය දිය හැක.',
        initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
        availableBlocks: [
            { type: 'io', label: 'වයස ලබාගැනීම', execute: (ctx) => { ctx.age = 20; ctx.logs.push('වයස: 20'); } },
            { type: 'decision', label: 'වයස >= 18?', execute: (ctx) => { return ctx.age >= 18; } },
            { type: 'io', label: 'ඡන්දය දීම', execute: (ctx) => { ctx.logs.push('ඡන්දය දුන්නා'); } },
            { type: 'io', label: 'සුදුසුකම් නොමැත', execute: (ctx) => { ctx.logs.push('සුදුසුකම් දුන්නා'); } },
            { type: 'terminator', label: 'අවසානය', execute: (ctx) => { ctx.finished = true; } }
        ],
        requiredConnections: [
            ['ආරම්භය', 'වයස ලබාගැනීම'],
            ['වයස ලබාගැනීම', 'වයස >= 18?'],
            ['වයස >= 18?', 'ඡන්දය දීම', 'yes'],
            ['වයස >= 18?', 'සුදුසුකම් නොමැත', 'no'],
            ['ඡන්දය දීම', 'අවසානය'],
            ['සුදුසුකම් නොමැත', 'අවසානය']
        ],
        execution: {
            maxSteps: 10,
            expectedLogs: ['වයස: 20', 'ඡන්දය දුන්නා']
        }
    },
    {
        id: 'sel-4',
        title: 'මාර්ග සංඥා',
        category: 'Selection',
        description: 'රතු එළිය දැල්වී ඇත්නම් නවතින්න.',
        initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
        availableBlocks: [
            { type: 'io', label: 'වර්ණය බැලීම', execute: (ctx) => { ctx.color = 'Red'; ctx.logs.push('වර්ණය: රතු'); } },
            { type: 'decision', label: 'රතු පාටද?', execute: (ctx) => { return ctx.color === 'Red'; } },
            { type: 'process', label: 'නවතින්න', execute: (ctx) => { ctx.logs.push('නැවතුනා'); } },
            { type: 'process', label: 'යන්න', execute: (ctx) => { ctx.logs.push('ගියා'); } },
            { type: 'terminator', label: 'අවසානය', execute: (ctx) => { ctx.finished = true; } }
        ],
        requiredConnections: [
            ['ආරම්භය', 'වර්ණය බැලීම'],
            ['වර්ණය බැලීම', 'රතු පාටද?'],
            ['රතු පාටද?', 'නවතින්න', 'yes'],
            ['රතු පාටද?', 'යන්න', 'no'], // Assuming Green/Yellow
            ['නවතින්න', 'අවසානය'],
            ['යන්න', 'අවසානය']
        ],
        execution: {
            maxSteps: 10,
            expectedLogs: ['වර්ණය: රතු', 'නැවතුනා']
        }
    },
    {
        id: 'sel-5',
        title: 'Log In පද්ධතිය',
        category: 'Selection',
        description: 'Password එක නිවැරදි නම් Login වන්න.',
        initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
        availableBlocks: [
            { type: 'io', label: 'Password ලබාගැනීම', execute: (ctx) => { ctx.password = 'correct'; ctx.logs.push('Password ඇතුළත් කළා'); } },
            { type: 'decision', label: 'නිවැරදිද?', execute: (ctx) => { return ctx.password === 'correct'; } },
            { type: 'io', label: 'සාර්ථකයි', execute: (ctx) => { ctx.logs.push('Login සාර්ථකයි'); } },
            { type: 'io', label: 'අසාර්ථකයි', execute: (ctx) => { ctx.logs.push('Login අසාර්ථකයි'); } },
            { type: 'terminator', label: 'අවසානය', execute: (ctx) => { ctx.finished = true; } }
        ],
        requiredConnections: [
            ['ආරම්භය', 'Password ලබාගැනීම'],
            ['Password ලබාගැනීම', 'නිවැරදිද?'],
            ['නිවැරදිද?', 'සාර්ථකයි', 'yes'],
            ['නිවැරදිද?', 'අසාර්ථකයි', 'no'],
            ['සාර්ථකයි', 'අවසානය'],
            ['අසාර්ථකයි', 'අවසානය']
        ],
        execution: {
            maxSteps: 10,
            expectedLogs: ['Password ඇතුළත් කළා', 'Login සාර්ථකයි']
        }
    },
    {
        id: 'iter-2',
        title: 'Countdown (10 to 1)',
        category: 'Iteration',
        description: '10 සිට 1 දක්වා කාලය ගණනය කිරීම.',
        initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
        availableBlocks: [
            { type: 'process', label: 'time = 10', execute: (ctx) => { ctx.time = 10; } },
            { type: 'decision', label: 'time > 0?', execute: (ctx) => { return ctx.time > 0; } },
            { type: 'io', label: 'Print time', execute: (ctx) => { ctx.logs.push(ctx.time); } },
            { type: 'process', label: 'time = time - 1', execute: (ctx) => { ctx.time = (ctx.time || 10) - 1; } },
            { type: 'terminator', label: 'අවසානය', execute: (ctx) => { ctx.finished = true; } }
        ],
        requiredConnections: [
            ['ආරම්භය', 'time = 10'],
            ['time = 10', 'time > 0?'],
            ['time > 0?', 'Print time', 'yes'],
            ['Print time', 'time = time - 1'],
            ['time = time - 1', 'time > 0?'], // Loop
            ['time > 0?', 'අවසානය', 'no']
        ],
        execution: {
            maxSteps: 50,
            expectedLogs: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        }
    },
    {
        id: 'iter-3',
        title: 'එකතු කිරීම (Sum)',
        category: 'Iteration',
        description: '1 සිට 5 දක්වා සංඛ්‍යා වල එකතුව.',
        initialNodes: [{
            id: 'start',
            type: 'terminator',
            data: {
                label: 'ආරම්භය',
                execute: (ctx) => { /* No-op for start */ }
            },
            position: { x: 250, y: 20 }
        }],
        availableBlocks: [
            {
                type: 'process',
                label: 'sum = 0, x = 1',
                execute: (ctx) => { ctx.sum = 0; ctx.x = 1; }
            },
            {
                type: 'decision',
                label: 'x <= 5?',
                execute: (ctx) => { return ctx.x <= 5; }
            },
            {
                type: 'process',
                label: 'sum = sum + x',
                execute: (ctx) => { ctx.sum = (ctx.sum || 0) + ctx.x; }
            },
            {
                type: 'process',
                label: 'x = x + 1',
                execute: (ctx) => { ctx.x = (ctx.x || 0) + 1; }
            },
            {
                type: 'io',
                label: 'Print sum',
                execute: (ctx) => { ctx.logs.push(ctx.sum); }
            },
            {
                type: 'terminator',
                label: 'අවසානය',
                execute: (ctx) => { ctx.finished = true; }
            }
        ],
        // New Flexible Validation Config
        execution: {
            maxSteps: 100, // Prevent infinite loops
            expectedLogs: [15] // Sum of 1+2+3+4+5 = 15
        }
    },
    {
        id: 'iter-4',
        title: 'බාල්දිය පිරවීම',
        category: 'Iteration',
        description: 'බාල්දිය පිරෙන තුරු වතුර එකතු කරන්න (Max 10).',
        initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
        availableBlocks: [
            { type: 'process', label: 'water = 0', execute: (ctx) => { ctx.water = 0; } },
            { type: 'decision', label: 'water < 10?', execute: (ctx) => { return ctx.water < 10; } },
            { type: 'process', label: 'Add Water', execute: (ctx) => { ctx.logs.push('Added water'); } },
            { type: 'process', label: 'water = water + 1', execute: (ctx) => { ctx.water = (ctx.water || 0) + 1; } },
            { type: 'terminator', label: 'අවසානය', execute: (ctx) => { ctx.finished = true; } }
        ],
        requiredConnections: [
            ['ආරම්භය', 'water = 0'],
            ['water = 0', 'water < 10?'],
            ['water < 10?', 'Add Water', 'yes'],
            ['Add Water', 'water = water + 1'],
            ['water = water + 1', 'water < 10?'], // Loop
            ['water < 10?', 'අවසානය', 'no']
        ],
        execution: {
            maxSteps: 50,
            expectedLogs: ['Added water', 'Added water', 'Added water', 'Added water', 'Added water', 'Added water', 'Added water', 'Added water', 'Added water', 'Added water']
        }
    }
];
