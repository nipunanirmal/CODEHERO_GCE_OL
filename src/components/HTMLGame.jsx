import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, CheckCircle, Trophy, Lightbulb, Code, Eye, Palette, FileText, Upload, Library } from 'lucide-react';
import { htmlLevels } from '../data/htmlLevels';
import { buildMediaSnippet, buildMediaSnippetFromAsset, registerMediaFiles, resolveMediaPathsInHtml } from '../utils/mediaAssets';
import MediaLibrary from './HTMLIDE/MediaLibrary';

const HTMLGame = ({ xp, addXP, levelIndex, setLevelIndex, completedLevels, setCompletedLevels }) => {
  const [userCode, setUserCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const textareaRef = useRef(null);

  const currentLevel = htmlLevels[levelIndex];

  useEffect(() => {
    if (currentLevel) {
      setUserCode(currentLevel.starterCode);
      setShowHint(false);
      setCurrentHint(0);
      setIsCompleted(false);
      setShowSuccess(false);
    }
  }, [levelIndex, currentLevel]);

  const checkCompletion = () => {
    if (!currentLevel) return false;
    
    // Simple completion check - in a real implementation, this would be more sophisticated
    const userCodeLower = userCode.toLowerCase();
    const solutionLower = currentLevel.solution.toLowerCase();
    
    // Check for key elements based on level type
    if (currentLevel.type === 'coding') {
      // For coding levels, check if essential elements are present
      if (currentLevel.id === 'html-1') {
        return userCodeLower.includes('<h1>') && userCodeLower.includes('</h1>') && 
               userCodeLower.includes('<p>') && userCodeLower.includes('</p>');
      } else if (currentLevel.id === 'html-2') {
        return userCodeLower.includes('<h1>') && userCodeLower.includes('<h2>') && 
               userCodeLower.includes('<h3>') && userCodeLower.includes('<strong>') && 
               userCodeLower.includes('<em>');
      } else if (currentLevel.id === 'html-3') {
        return userCodeLower.includes('<ul>') && userCodeLower.includes('<ol>') && 
               userCodeLower.includes('<li>');
      } else if (currentLevel.id === 'html-4') {
        return userCodeLower.includes('<img') && userCodeLower.includes('<a ') && 
               userCodeLower.includes('href=');
      } else if (currentLevel.id === 'html-5') {
        return userCodeLower.includes('<form>') && userCodeLower.includes('<input') && 
               userCodeLower.includes('type=') && userCodeLower.includes('<label>');
      } else if (currentLevel.id === 'html-6') {
        return userCodeLower.includes('<table>') && userCodeLower.includes('<tr>') && 
               userCodeLower.includes('<th>') && userCodeLower.includes('<td>');
      } else if (currentLevel.id === 'html-7') {
        return userCodeLower.includes('<div') && userCodeLower.includes('<span>');
      } else if (currentLevel.id === 'html-8') {
        return userCodeLower.includes('<header>') && userCodeLower.includes('<nav>') && 
               userCodeLower.includes('<main>') && userCodeLower.includes('<footer>');
      } else if (currentLevel.id === 'html-9') {
        return userCodeLower.includes('<video') || userCodeLower.includes('<audio');
      }
    }
    
    // For project levels, check if it's substantial enough
    if (currentLevel.type === 'project') {
      return userCode.length > 500 && userCodeLower.includes('<header>') && 
             userCodeLower.includes('<main>') && userCodeLower.includes('<footer>');
    }
    
    return false;
  };

  const handleSubmit = () => {
    if (checkCompletion() && !isCompleted) {
      setIsCompleted(true);
      setShowSuccess(true);
      setCompletedLevels(prev => new Set([...prev, currentLevel.id]));
      addXP(currentLevel.xp);
      
      setTimeout(() => {
        setShowSuccess(false);
        if (levelIndex < htmlLevels.length - 1) {
          setLevelIndex(levelIndex + 1);
        }
      }, 2000);
    }
  };

  const insertTextAtCursor = (insertText) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      setUserCode((current) => `${current}${insertText}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updatedCode = `${userCode.slice(0, start)}${insertText}${userCode.slice(end)}`;
    setUserCode(updatedCode);

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

      if (event.shiftKey) {
        const value = userCode;

        // If text is selected, remove one indentation level from each selected line.
        if (start !== end) {
          const selectionStartLine = value.lastIndexOf('\n', start - 1) + 1;
          const selectedText = value.slice(selectionStartLine, end);
          const lines = selectedText.split('\n');

          const unindentedText = lines
            .map((line) => (line.startsWith(tabSpaces) ? line.slice(tabSpaces.length) : line.startsWith('\t') ? line.slice(1) : line))
            .join('\n');

          const updatedCode = `${value.slice(0, selectionStartLine)}${unindentedText}${value.slice(end)}`;
          setUserCode(updatedCode);

          setTimeout(() => {
            textarea.selectionStart = selectionStartLine;
            textarea.selectionEnd = selectionStartLine + unindentedText.length;
          }, 0);
          return;
        }

        // No selection: remove up to one indent level before the cursor on the current line.
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const beforeCursor = value.slice(lineStart, start);
        const removeCount = beforeCursor.startsWith(tabSpaces)
          ? tabSpaces.length
          : beforeCursor.startsWith('\t')
            ? 1
            : 0;

        if (removeCount > 0) {
          const updatedCode = `${value.slice(0, start - removeCount)}${value.slice(end)}`;
          setUserCode(updatedCode);

          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start - removeCount;
          }, 0);
        }

        return;
      }

      const updatedCode = `${userCode.slice(0, start)}${tabSpaces}${userCode.slice(end)}`;
      setUserCode(updatedCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + tabSpaces.length;
      }, 0);
    }
  };

  const handleNextLevel = () => {
    if (levelIndex < htmlLevels.length - 1) {
      setLevelIndex(levelIndex + 1);
    }
  };

  const handlePrevLevel = () => {
    if (levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  };

  const showNextHint = () => {
    if (currentHint < currentLevel.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  const getCompletionPercentage = () => {
    return Math.round((completedLevels.size / htmlLevels.length) * 100);
  };

  const previewHTML = resolveMediaPathsInHtml(userCode);

  if (!currentLevel) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">පාඩම් අවසානය!</h2>
        <p className="text-lg">ඔබ සියලුම HTML පාඩම් සම්පූර්ණ කර ඇත!</p>
        <Trophy className="w-16 h-16 mx-auto mt-4 text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="flex h-full bg-slate-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-2">HTML පාඩම්</h2>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-600">
              {getCompletionPercentage()}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {htmlLevels.map((level, idx) => {
            const isCompleted = completedLevels.has(level.id);
            const isActive = idx === levelIndex;
            
            return (
              <button
                key={level.id}
                onClick={() => setLevelIndex(idx)}
                className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3
                  ${isActive ? 'bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500' : 
                    isCompleted ? 'bg-emerald-50 text-emerald-600' : 
                    'hover:bg-slate-100 text-slate-600'}
                `}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${isCompleted ? 'bg-emerald-500 text-white' : 
                    isActive ? 'bg-emerald-600 text-white' : 
                    'bg-slate-300 text-slate-600'}
                `}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{level.sinhalaTitle}</div>
                  <div className="text-xs opacity-75">{level.type}</div>
                </div>
                {level.type === 'project' && (
                  <FileText className="w-4 h-4 text-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevLevel}
                disabled={levelIndex === 0}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextLevel}
                disabled={levelIndex === htmlLevels.length - 1}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  පාඩම {levelIndex + 1}: {currentLevel.sinhalaTitle}
                </h1>
                <p className="text-slate-600">{currentLevel.sinhalaDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                {currentLevel.xp} XP
              </span>
              {isCompleted && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  සම්පූර්ණයි
                </span>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">උපදෙස්:</h3>
            <p className="text-blue-800">{currentLevel.instructions.sinhala}</p>
          </div>
        </div>

        {/* Editor and Preview */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">HTML කේත සංස්කාරක</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors
                    ${showPreview ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}
                  `}
                >
                  <Eye className="w-4 h-4" />
                  පෙරදසුන
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isCompleted}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded text-sm flex items-center gap-1 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  පරීක්ෂා කරන්න
                </button>
                <label className="px-3 py-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded text-sm flex items-center gap-1 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  මාධ්‍ය
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
              </div>
            </div>
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                onKeyDown={handleEditorKeyDown}
                className="w-full h-full p-4 font-mono text-sm bg-slate-900 text-green-400 resize-none focus:outline-none"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-1/2 border-l border-slate-200 flex flex-col">
              <div className="bg-slate-800 text-white px-4 py-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">පෙරදසුන</span>
              </div>
              <div className="flex-1 bg-white p-4 overflow-auto">
                <iframe
                  srcDoc={previewHTML}
                  className="w-full h-full border-0"
                  title="Preview"
                />
              </div>
            </div>
          )}
        </div>

        {/* Hints Section */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              උපදෙස් {showHint ? 'සඟවන්න' : 'පෙන්වන්න'}
            </button>
            {showHint && currentHint < currentLevel.hints.length - 1 && (
              <button
                onClick={showNextHint}
                className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors"
              >
 ඊළඟ උපදෙස්
              </button>
            )}
          </div>
          {showHint && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800">
                <strong>උපදෙස් {currentHint + 1}:</strong> {currentLevel.hints[currentHint]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center transform scale-100 animate-in">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">ජයයි!</h2>
            <p className="text-slate-600 mb-4">
              ඔබ මෙම පාඩම සම්පූර්ණ කළා! {currentLevel.xp} XP ලබා ගත්තා.
            </p>
            <div className="text-4xl font-bold text-emerald-600 mb-4">+{currentLevel.xp} XP</div>
          </div>
        </div>
      )}

      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={handleMediaLibrarySelect}
      />
    </div>
  );
};

export default HTMLGame;
