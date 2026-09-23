import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Lock, Globe, X } from 'lucide-react';
import { PREVIEW_SANDBOX, buildSandboxedDocument, createPreviewToken } from './previewSandbox';

// Re-running student scripts on every keystroke would re-fire alert()/prompt() constantly.
const RUN_DELAY_MS = 500;

const BrowserPreview = ({ html, theme = 'dark', fakeUrl = 'localhost/index.html', onConsoleMessage }) => {
  const [reloadKey, setReloadKey] = useState(0);
  const [runHtml, setRunHtml] = useState(html);
  const iframeRef = useRef(null);
  const onConsoleRef = useRef(onConsoleMessage);

  useEffect(() => {
    onConsoleRef.current = onConsoleMessage;
  }, [onConsoleMessage]);

  useEffect(() => {
    const timer = setTimeout(() => setRunHtml(html), RUN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [html]);

  // A fresh token per run: late messages from a previous run are ignored.
  const { token, srcDoc } = useMemo(() => {
    const runToken = `${createPreviewToken()}-${reloadKey}`;
    return { token: runToken, srcDoc: buildSandboxedDocument(runHtml, runToken) };
  }, [runHtml, reloadKey]);

  useEffect(() => {
    onConsoleRef.current?.({ kind: 'reset' });
  }, [token]);

  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data;
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) return;
      if (!data || typeof data !== 'object' || data.__codehero !== token) return;
      if (!['log', 'info', 'warn', 'error', 'clear'].includes(data.kind)) return;
      onConsoleRef.current?.({ kind: data.kind, text: String(data.text ?? '') });
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [token]);

  const pageTitle = useMemo(() => {
    try {
      const doc = new DOMParser().parseFromString(runHtml || '', 'text/html');
      return doc.title?.trim() || 'index.html';
    } catch {
      return 'index.html';
    }
  }, [runHtml]);

  const chrome = theme === 'dark'
    ? {
        shell: 'bg-slate-900 border-slate-700',
        tabActive: 'bg-slate-800 text-white',
        toolbar: 'bg-slate-800 border-slate-700',
        addressBar: 'bg-slate-900 text-slate-300 border-slate-700',
        iconBtn: 'text-slate-400 hover:text-white hover:bg-slate-700'
      }
    : {
        shell: 'bg-slate-100 border-slate-300',
        tabActive: 'bg-white text-slate-800',
        toolbar: 'bg-slate-200 border-slate-300',
        addressBar: 'bg-white text-slate-600 border-slate-300',
        iconBtn: 'text-slate-500 hover:text-slate-800 hover:bg-slate-300'
      };

  return (
    <div className={`flex flex-col h-full min-h-0 border rounded-lg overflow-hidden ${chrome.shell}`}>
      {/* Tab strip */}
      <div className={`flex items-end px-2 pt-2 gap-1 ${chrome.toolbar}`}>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-t-md max-w-[220px] min-w-0 ${chrome.tabActive}`}>
          <Globe className="w-3.5 h-3.5 shrink-0 opacity-70" />
          <span className="text-xs truncate">{pageTitle}</span>
          <X className="w-3.5 h-3.5 shrink-0 opacity-50" />
        </div>
      </div>

      {/* Toolbar row */}
      <div className={`flex items-center gap-2 px-2 py-1.5 border-b ${chrome.toolbar}`}>
        <button disabled className={`p-1 rounded ${chrome.iconBtn} opacity-40 cursor-not-allowed`}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button disabled className={`p-1 rounded ${chrome.iconBtn} opacity-40 cursor-not-allowed`}>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className={`p-1 rounded transition-colors ${chrome.iconBtn}`}
          title="නැවත පූරණය"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <div className={`flex-1 flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs ${chrome.addressBar}`}>
          <Lock className="w-3 h-3 shrink-0 opacity-60" />
          <span className="truncate">{fakeUrl}</span>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0 bg-white">
        <iframe
          ref={iframeRef}
          key={token}
          srcDoc={srcDoc}
          className="w-full h-full border-0"
          title={pageTitle}
          sandbox={PREVIEW_SANDBOX}
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

export default BrowserPreview;
