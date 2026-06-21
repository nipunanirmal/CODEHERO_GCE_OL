import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Trash2, Image as ImageIcon, Play, Headphones } from 'lucide-react';
import {
  loadMediaAssets,
  deleteMediaAsset,
  getMediaKindFromType,
  buildMediaSnippetFromAsset,
} from '../../utils/mediaAssets';

const kindIcon = (kind) => {
  if (kind === 'image') return <ImageIcon className="w-4 h-4" />;
  if (kind === 'video') return <Play className="w-4 h-4" />;
  if (kind === 'audio') return <Headphones className="w-4 h-4" />;
  return <ImageIcon className="w-4 h-4" />;
};

const formatSize = (bytes) => {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MediaLibrary = ({ isOpen, onClose, onSelect }) => {
  const [assets, setAssets] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const refreshAssets = () => {
    setAssets(loadMediaAssets());
  };

  useEffect(() => {
    if (isOpen) refreshAssets();
  }, [isOpen]);

  const handleDelete = (id) => {
    if (confirm('ඔබට මෙම media ගොනුව මකා දැමීමට අවශ්‍යද?')) {
      deleteMediaAsset(id);
      refreshAssets();
    }
  };

  const handleCopy = (asset) => {
    navigator.clipboard.writeText(asset.path);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleUse = (asset) => {
    if (onSelect) {
      onSelect(asset);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Media Library</h2>
            <p className="text-sm text-slate-500">කලින් උඩුගත කළ ගොනු නැවත භාවිතා කරන්න</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {assets.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>කිසිඳු media ගොනුවක් උඩුගත කර නැත.</p>
              <p className="text-sm">මාධ්‍ය උඩුගත කරන්න බොත්තම භාවිතා කර ගොනුවක් එකතු කරන්න.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => {
                const kind = getMediaKindFromType(asset.type);
                const isImage = kind === 'image';

                return (
                  <div
                    key={asset.id}
                    className="border border-slate-200 rounded-lg overflow-hidden hover:border-blue-400 transition-colors"
                  >
                    <div className="aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                      {isImage ? (
                        <img
                          src={asset.dataUrl}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                          {kindIcon(kind)}
                          <span className="text-xs mt-1 uppercase">{kind}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex items-start gap-2 mb-2">
                        {kindIcon(kind)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate" title={asset.name}>
                            {asset.name}
                          </p>
                          <p className="text-xs text-slate-500">{formatSize(asset.size)}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 truncate mb-3" title={asset.path}>
                        {asset.path}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUse(asset)}
                          className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
                        >
                          {onSelect ? 'භාවිතා කරන්න' : 'ඇතුළත් කරන්න'}
                        </button>
                        <button
                          onClick={() => handleCopy(asset)}
                          className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                          title="Path පිටපත් කරන්න"
                        >
                          {copiedId === asset.id ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="p-1.5 rounded border border-slate-200 hover:bg-red-50 text-red-500 transition-colors"
                          title="මකන්න"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;
export { buildMediaSnippetFromAsset };
