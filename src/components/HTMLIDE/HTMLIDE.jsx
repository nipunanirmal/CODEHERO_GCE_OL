import React, { useState, useEffect, useRef } from 'react';
import { Code, Eye, Settings, Download, Upload, Play, RotateCcw, Copy, Check, Library } from 'lucide-react';
import { buildMediaSnippet, buildMediaSnippetFromAsset, registerMediaFiles, resolveMediaPathsInHtml } from '../../utils/mediaAssets';
import MediaLibrary from './MediaLibrary';

const HTMLIDE = () => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>මගේ HTML පිටුව</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
        }
        .card {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            margin: 20px 0;
            border-radius: 10px;
            border-left: 4px solid #00ff88;
        }
        button {
            background: #00ff88;
            color: #333;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        }
        button:hover {
            background: #00cc6a;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎓 මගේ වෙබ් අඩවිය</h1>
        
        <div class="card">
            <h2>පිළිගැනීම</h2>
            <p>සාදරයෙන් පිළිගනිමි! මෙය මගේ පළමු HTML වෙබ් පිටුවයි.</p>
            <p>මම HTML, CSS, සහ JavaScript ඉගෙන ගනිමි.</p>
        </div>
        
        <div class="card">
            <h2>මගේ අරමුණු</h2>
            <ul>
                <li>නිර්මාණාත්මක වෙබ් අඩවි නිර්මාණය කිරීම</li>
                <li>භාවිතා කිරීමට පහසු අතුරුමුහුණත් නිර්මාණය කිරීම</li>
                <li>නවීන වෙබ් තාක්ෂණයන් ඉගෙන ගැනීම</li>
            </ul>
        </div>
        
        <div class="card">
            <h2>සම්බන්ධ වන්න</h2>
            <p>ඊමේල්: student@example.com</p>
            <button onclick="alert('ස්තුතියි! ඔබව සම්බන්ධ කර ගනිමි.')">සම්බන්ධ වන්න</button>
        </div>
    </div>
    
    <script>
        // Simple JavaScript example
        document.addEventListener('DOMContentLoaded', function() {
            console.log('පිටුව පූරණය විය!');
        });
    </script>
</body>
</html>`);
  
  const [showPreview, setShowPreview] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('dark');
  const [autoSave, setAutoSave] = useState(true);
  const iframeRef = useRef(null);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(() => {
        localStorage.setItem('html-ide-code', htmlCode);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [htmlCode, autoSave]);

  // Load saved code on mount
  useEffect(() => {
    const savedCode = localStorage.getItem('html-ide-code');
    if (savedCode) {
      setHtmlCode(savedCode);
    }
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([resolveMediaPathsInHtml(htmlCode)], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadCode = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHtmlCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const syncLineNumbersScroll = (event) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = event.target.scrollTop;
    }
  };

  const insertTextAtCursor = (insertText) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      setHtmlCode((current) => `${current}${insertText}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updatedCode = `${htmlCode.slice(0, start)}${insertText}${htmlCode.slice(end)}`;

    setHtmlCode(updatedCode);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
      textarea.focus();
    }, 0);
  };

  const handleMediaUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';

    if (!files.length) return;

    const addedAssets = await registerMediaFiles(files);
    if (!addedAssets.length) return;

    const snippets = addedAssets
      .map((asset) => buildMediaSnippet({ name: asset.name, type: asset.type }, asset.path))
      .filter(Boolean);

    if (snippets.length) {
      insertTextAtCursor(`${snippets.join('\n\n')}\n`);
    }
  };

  const handleMediaLibrarySelect = (asset) => {
    const snippet = buildMediaSnippetFromAsset(asset);
    if (snippet) {
      insertTextAtCursor(`${snippet}\n`);
    }
  };

  const handleEditorKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();

      const textarea = event.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const tabSpaces = '    ';

      const updatedCode = `${htmlCode.slice(0, start)}${tabSpaces}${htmlCode.slice(end)}`;
      setHtmlCode(updatedCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + tabSpaces.length;
      }, 0);
    }
  };

  const handleReset = () => {
    if (confirm('ඔබට විශ්වාසද? ඔබගේ සියලුම කේත මකනු ඇත.')) {
      setHtmlCode(`<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>මගේ HTML පිටුව</title>
</head>
<body>
    <h1>ආයුබෝවන්!</h1>
    <p>මෙතැන ඔබගේ HTML කේතය ලියන්න.</p>
</body>
</html>`);
    }
  };

  const getThemeClasses = () => {
    if (theme === 'dark') {
      return {
        editor: 'bg-slate-900 text-green-400',
        container: 'bg-slate-800 border-slate-700 text-white',
        button: 'bg-slate-700 hover:bg-slate-600 text-white',
        text: 'text-white'
      };
    } else {
      return {
        editor: 'bg-white text-slate-800',
        container: 'bg-white border-slate-200 text-slate-800',
        button: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
        text: 'text-slate-800'
      };
    }
  };

  const themeClasses = getThemeClasses();
  const previewHtml = resolveMediaPathsInHtml(htmlCode);

  return (
    <div className="flex h-full bg-slate-50">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className={`${themeClasses.container} border-b px-4 py-2 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-sm">HTML IDE</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors
                  ${showPreview ? 'bg-blue-600 text-white' : `${themeClasses.container} hover:bg-slate-700`}
                `}
              >
                <Eye className="w-4 h-4" />
                පෙරදසුන
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${themeClasses.button}`}
              >
                <Settings className="w-4 h-4" />
                සැකසුම්
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'පිටපත් කළා' : 'පිටපත් කරන්න'}
            </button>
            
            <button
              onClick={handleDownloadCode}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center gap-1 transition-colors"
            >
              <Download className="w-4 h-4" />
              බාගන්න
            </button>
            
            <label className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm flex items-center gap-1 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              උඩුගත කරන්න
              <input
                type="file"
                accept=".html,.htm"
                onChange={handleUploadCode}
                className="hidden"
              />
            </label>

            <label className="px-3 py-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded text-sm flex items-center gap-1 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              මාධ්‍ය උඩුගත කරන්න
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                multiple
                onChange={handleMediaUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setShowMediaLibrary(true)}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm flex items-center gap-1 transition-colors"
            >
              <Library className="w-4 h-4" />
              Media Library
            </button>
            
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              යළි සකසන්න
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className={`${themeClasses.container} border-b p-4`}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">අකුරු ප්රමාණය</label>
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs">{fontSize}px</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">තේමාව</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className={`w-full px-2 py-1 rounded border ${themeClasses.container}`}
                >
                  <option value="dark">අඳුරු</option>
                  <option value="light">දීප්ත</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">ස්වයං-සුරකිම</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Editor and Preview */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col border-r ${themeClasses.container}`}>
            <div className={`${themeClasses.container} px-4 py-2 text-sm font-medium`}>
              index.html
            </div>
            <div className="flex-1 relative overflow-hidden">
              <div
                ref={lineNumbersRef}
                className={`absolute left-0 top-0 bottom-0 w-12 border-r border-slate-700/40 text-right pr-2 pt-4 select-none pointer-events-none overflow-y-scroll z-20 ${themeClasses.editor}`}
                style={{
                  fontSize: `${Math.max(fontSize - 2, 11)}px`,
                  lineHeight: '1.5',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {htmlCode.split('\n').map((_, i) => (
                  <div key={i} className="h-[1.5em] leading-[1.5]">
                    {i + 1}
                  </div>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                onScroll={syncLineNumbersScroll}
                onKeyDown={handleEditorKeyDown}
                className={`absolute inset-0 z-10 w-full h-full pl-16 pr-4 py-4 font-mono resize-none focus:outline-none ${themeClasses.editor}`}
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
                spellCheck={false}
                placeholder="මෙතැන ඔබගේ HTML කේතය ලියන්න..."
              />
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-1/2 flex flex-col">
              <div className={`${themeClasses.container} px-4 py-2 text-sm font-medium flex items-center justify-between`}>
                <span>පෙරදසුන</span>
                <button
                  onClick={() => {
                    if (iframeRef.current) {
                      iframeRef.current.src = iframeRef.current.src;
                    }
                  }}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  නැවත පූරණය
                </button>
              </div>
              <div className="flex-1 bg-white">
                <iframe
                  ref={iframeRef}
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className={`${themeClasses.container} border-t px-4 py-1 flex items-center justify-between text-xs`}>
          <div className="flex items-center gap-4">
            <span>HTML: {htmlCode.length} අක්ෂර</span>
            <span>පේළි: {htmlCode.split('\n').length}</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-2">
            {autoSave && <span className="text-green-500">● ස්වයං-සුරකිම සක්රියයි</span>}
          </div>
        </div>
      </div>

      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={handleMediaLibrarySelect}
      />
    </div>
  );
};

export default HTMLIDE;
