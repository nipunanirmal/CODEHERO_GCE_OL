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
      { type: 'process', label: 'වතුර රත් කිරීම' },
      { type: 'process', label: 'තේ පවුඩර් දැමීම' },
      { type: 'io', label: 'සීනි සහ කිරි ගන්න' },
      { type: 'process', label: 'කිරි එකතු කිරීම' },
      { type: 'io', label: 'තේ පිළිගැන්වීම' },
      { type: 'terminator', label: 'අවසානය' }
    ],
    // For simple sequence, we can check if edges connect these specific node labels in order,
    // or just check if valid Start -> Process... -> End path exists.
    // Here we will use a simple list of expected labels in order for the "main path".
    expectedPath: ['ආරම්භය', 'සීනි සහ කිරි ගන්න', 'වතුර රත් කිරීම', 'තේ පවුඩර් දැමීම', 'කිරි එකතු කිරීම', 'තේ පිළිගැන්වීම', 'අවසානය']
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
        { type: 'process', label: 'මුහුණ සේදීම' },
        { type: 'process', label: 'ඇඳුම් ඇඳීම' },
        { type: 'process', label: 'ආහාර ගැනීම' },
        { type: 'terminator', label: 'අවසානය' }
    ],
    expectedPath: ['ආරම්භය', 'මුහුණ සේදීම', 'ඇඳුම් ඇඳීම', 'ආහාර ගැනීම', 'අවසානය']
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
      { type: 'io', label: 'ලකුණු ඇතුළත් කිරීම' },
      { type: 'decision', label: 'ලකුණු > 50?' },
      { type: 'io', label: 'සමත්' },
      { type: 'io', label: 'අසමත්' },
      { type: 'terminator', label: 'අවසානය' }
    ],
    // Validation for branching is trickier. We might need a custom validator function.
    // For now, let's assume the game engine looks for specific connections.
    // We can define "requiredConnections" as [SourceLabel, TargetLabel, HandleId/Condition]
    requiredConnections: [
        ['ආරම්භය', 'ලකුණු ඇතුළත් කිරීම'],
        ['ලකුණු ඇතුළත් කිරීම', 'ලකුණු > 50?'],
        ['ලකුණු > 50?', 'සමත්', 'yes'],
        ['ලකුණු > 50?', 'අසමත්', 'no'],
        ['සමත්', 'අවසානය'],
        ['අසමත්', 'අවසානය']
    ]
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
          { type: 'decision', label: 'වැස්සද?' },
          { type: 'process', label: 'කුඩය ගන්න' },
          { type: 'terminator', label: 'අවසානය' }
      ],
      requiredConnections: [
          ['ආරම්භය', 'වැස්සද?'],
          ['වැස්සද?', 'කුඩය ගන්න', 'yes'],
          ['වැස්සද?', 'අවසානය', 'no'],
          ['කුඩය ගන්න', 'අවසානය']
      ]
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
          { type: 'process', label: 'x = 1' },
          { type: 'decision', label: 'x <= 5?' },
          { type: 'io', label: 'Print x' },
          { type: 'process', label: 'x = x + 1' },
          { type: 'terminator', label: 'අවසානය' }
      ],
      requiredConnections: [
          ['ආරම්භය', 'x = 1'],
          ['x = 1', 'x <= 5?'],
          ['x <= 5?', 'Print x', 'yes'],
          ['Print x', 'x = x + 1'],
          ['x = x + 1', 'x <= 5?'], // Loop back
          ['x <= 5?', 'අවසානය', 'no']
      ]
  },
  // --- ADDITIONAL LEVELS ---
  {
      id: 'seq-3',
      title: 'පැලයක් සිටුවීම',
      category: 'Sequence',
      description: 'පැලයක් සිටුවීමේ පියවර නිවැරදිව පෙළගස්වන්න.',
      initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
      availableBlocks: [
          { type: 'process', label: 'වලක් හෑරීම' },
          { type: 'process', label: 'පැලය සිටුවීම' },
          { type: 'process', label: 'වතුර දැමීම' },
          { type: 'terminator', label: 'අවසානය' }
      ],
      expectedPath: ['ආරම්භය', 'වලක් හෑරීම', 'පැලය සිටුවීම', 'වතුර දැමීම', 'අවසානය']
  },
  {
      id: 'seq-4',
      title: 'ඔන්ලයින් භාණ්ඩ මිලදී ගැනීම',
      category: 'Sequence',
      description: 'අන්තර්ජාලයෙන් භාණ්ඩයක් ඇණවුම් කරන පියවර.',
      initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
      availableBlocks: [
          { type: 'io', label: 'භාණ්ඩය තෝරාගැනීම' },
          { type: 'process', label: 'එකතු කිරීම (Cart)' },
          { type: 'process', label: 'මුදල් ගෙවීම' },
          { type: 'terminator', label: 'අවසානය' }
      ],
      expectedPath: ['ආරම්භය', 'භාණ්ඩය තෝරාගැනීම', 'එකතු කිරීම (Cart)', 'මුදල් ගෙවීම', 'අවසානය']
  },
  {
      id: 'seq-5',
      title: 'දත් මැදීම',
      category: 'Sequence',
      description: 'දිනපතා දත් මැදීමේ පියවර.',
      initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
      availableBlocks: [
          { type: 'process', label: 'බුරුසුවට ආලේපන දැමීම' },
          { type: 'process', label: 'දත් මැදීම' },
          { type: 'process', label: 'කට සේදීම' },
          { type: 'terminator', label: 'අවසානය' }
      ],
      expectedPath: ['ආරම්භය', 'බුරුසුවට ආලේපන දැමීම', 'දත් මැදීම', 'කට සේදීම', 'අවසානය']
  },
  {
      id: 'sel-3',
      title: 'ඡන්දය දීම',
      category: 'Selection',
      description: 'වයස අවුරුදු 18 ට වැඩි නම් පමණක් ඡන්දය දිය හැක.',
      initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
      availableBlocks: [
          { type: 'io', label: 'වයස ලබාගැනීම' },
          { type: 'decision', label: 'වයස >= 18?' },
          { type: 'io', label: 'ඡන්දය දීම' },
          { type: 'io', label: 'සුදුසුකම් නොමැත' },
          { type: 'terminator', label: 'අවසානය' }
      ],
      requiredConnections: [
          ['ආරම්භය', 'වයස ලබාගැනීම'],
          ['වයස ලබාගැනීම', 'වයස >= 18?'],
          ['වයස >= 18?', 'ඡන්දය දීම', 'yes'],
          ['වයස >= 18?', 'සුදුසුකම් නොමැත', 'no'],
          ['ඡන්දය දීම', 'අවසානය'],
          ['සුදුසුකම් නොමැත', 'අවසානය']
      ]
  },
  {
      id: 'sel-4',
      title: 'මාර්ග සංඥා',
      category: 'Selection',
      description: 'රතු එළිය දැල්වී ඇත්නම් නවතින්න.',
      initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
      availableBlocks: [
          { type: 'io', label: 'වර්ණය බැලීම' },
          { type: 'decision', label: 'රතු පාටද?' },
          { type: 'process', label: 'නවතින්න' },
          { type: 'process', label: 'යන්න' },
          { type: 'terminator', label: 'අවසානය' }
      ],
      requiredConnections: [
          ['ආරම්භය', 'වර්ණය බැලීම'],
          ['වර්ණය බැලීම', 'රතු පාටද?'],
          ['රතු පාටද?', 'නවතින්න', 'yes'],
          ['රතු පාටද?', 'යන්න', 'no'], // Assuming Green/Yellow
          ['නවතින්න', 'අවසානය'],
          ['යන්න', 'අවසානය']
      ]
  },
  {
      id: 'sel-5',
      title: 'Log In පද්ධතිය',
      category: 'Selection',
      description: 'Password එක නිවැරදි නම් Login වන්න.',
      initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
      availableBlocks: [
          { type: 'io', label: 'Password ලබාගැනීම' },
          { type: 'decision', label: 'නිවැරදිද?' },
          { type: 'io', label: 'සාර්ථකයි' },
          { type: 'io', label: 'අසාර්ථකයි' },
          { type: 'terminator', label: 'අවසානය' }
      ],
      requiredConnections: [
          ['ආරම්භය', 'Password ලබාගැනීම'],
          ['Password ලබාගැනීම', 'නිවැරදිද?'],
          ['නිවැරදිද?', 'සාර්ථකයි', 'yes'],
          ['නිවැරදිද?', 'අසාර්ථකයි', 'no'],
          ['සාර්ථකයි', 'අවසානය'],
          ['අසාර්ථකයි', 'අවසානය']
      ]
  },
  {
      id: 'iter-2',
      title: 'Countdown (10 to 1)',
      category: 'Iteration',
      description: '10 සිට 1 දක්වා කාලය ගණනය කිරීම.',
      initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
      availableBlocks: [
          { type: 'process', label: 'time = 10' },
          { type: 'decision', label: 'time > 0?' },
          { type: 'io', label: 'Print time' },
          { type: 'process', label: 'time = time - 1' },
          { type: 'terminator', label: 'අවසානය' }
      ],
      requiredConnections: [
          ['ආරම්භය', 'time = 10'],
          ['time = 10', 'time > 0?'],
          ['time > 0?', 'Print time', 'yes'],
          ['Print time', 'time = time - 1'],
          ['time = time - 1', 'time > 0?'], // Loop
          ['time > 0?', 'අවසානය', 'no']
      ]
  },
  {
      id: 'iter-3',
      title: 'එකතු කිරීම (Sum)',
      category: 'Iteration',
      description: '1 සිට 5 දක්වා සංඛ්‍යා වල එකතුව.',
      initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
      availableBlocks: [
          { type: 'process', label: 'sum = 0, x = 1' },
          { type: 'decision', label: 'x <= 5?' },
          { type: 'process', label: 'sum = sum + x' },
          { type: 'process', label: 'x = x + 1' },
          { type: 'io', label: 'Print sum' },
          { type: 'terminator', label: 'අවසානය' }
      ],
      requiredConnections: [
          ['ආරම්භය', 'sum = 0, x = 1'],
          ['sum = 0, x = 1', 'x <= 5?'],
          ['x <= 5?', 'sum = sum + x', 'yes'],
          ['sum = sum + x', 'x = x + 1'],
          ['x = x + 1', 'x <= 5?'], // Loop
          ['x <= 5?', 'Print sum', 'no'],
          ['Print sum', 'අවසානය']
      ]
  },
  {
      id: 'iter-4',
      title: 'බාල්දිය පිරවීම',
      category: 'Iteration',
      description: 'බාල්දිය පිරෙන තුරු වතුර එකතු කරන්න (Max 10).',
      initialNodes: [{ id: 'start', type: 'terminator', data: { label: 'ආරම්භය' }, position: { x: 250, y: 20 } }],
      availableBlocks: [
          { type: 'process', label: 'water = 0' },
          { type: 'decision', label: 'water < 10?' },
          { type: 'process', label: 'Add Water' },
          { type: 'process', label: 'water = water + 1' },
          { type: 'terminator', label: 'අවසානය' }
      ],
      requiredConnections: [
          ['ආරම්භය', 'water = 0'],
          ['water = 0', 'water < 10?'],
          ['water < 10?', 'Add Water', 'yes'],
          ['Add Water', 'water = water + 1'],
          ['water = water + 1', 'water < 10?'], // Loop
          ['water < 10?', 'අවසානය', 'no']
      ]
  }
];
