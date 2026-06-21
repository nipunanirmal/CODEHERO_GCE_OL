import React, { useState } from 'react';
import {
  Editor,
  Frame,
  Element,
  useEditor,
  useNode,
  Canvas,
} from '@craftjs/core';
import {
  Type,
  Image as ImageIcon,
  Square,
  MousePointer,
  Code,
  Eye,
  Plus,
  Trash2,
  Settings,
  Play,
  Library,
} from 'lucide-react';
import { registerMediaFiles, resolveMediaPathsInHtml, getMediaKindFromType } from '../../utils/mediaAssets';
import { useDragAndDropMedia } from '../../hooks/useDragAndDropMedia';
import MediaLibrary from './MediaLibrary';

/* ──────────────────────────────────────────────
   Craft Components
   ────────────────────────────────────────────── */

const TextComponent = ({ text, fontSize, color, fontWeight, textAlign }) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    isDragging,
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{
        fontSize: `${fontSize}px`,
        color,
        fontWeight,
        textAlign,
        padding: '8px',
        border: '1px dashed #d1d5db',
        borderRadius: '4px',
        minHeight: '24px',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => setProp((props) => (props.text = e.currentTarget.textContent))}
    >
      {text}
    </div>
  );
};

TextComponent.craft = {
  displayName: 'Text',
  props: {
    text: 'ඔබගේ පෙළ මෙතැන ලියන්න',
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'normal',
    textAlign: 'left',
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};

/* ────────────────────────────────────────────── */

const HeadingComponent = ({ text, level, color, textAlign }) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    isDragging,
  } = useNode();
  const Tag = `h${level}`;

  return (
    <Tag
      ref={(ref) => connect(drag(ref))}
      style={{
        color,
        textAlign,
        padding: '8px',
        border: '1px dashed #d1d5db',
        borderRadius: '4px',
        minHeight: '30px',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        margin: 0,
      }}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => setProp((props) => (props.text = e.currentTarget.textContent))}
    >
      {text}
    </Tag>
  );
};

HeadingComponent.craft = {
  displayName: 'Heading',
  props: {
    text: 'මාතෘකාව',
    level: 2,
    color: '#1f2937',
    textAlign: 'left',
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};

/* ────────────────────────────────────────────── */

const ImageComponent = ({ src, alt, width, borderRadius }) => {
  const {
    connectors: { connect, drag },
    isDragging,
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{
        border: '1px dashed #d1d5db',
        padding: '4px',
        borderRadius: '4px',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        display: 'inline-block',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: `${width}%`,
          height: 'auto',
          maxWidth: '100%',
          borderRadius: `${borderRadius}px`,
          display: 'block',
        }}
      />
    </div>
  );
};

ImageComponent.craft = {
  displayName: 'Image',
  props: {
    src: 'https://via.placeholder.com/300x200',
    alt: 'රූපය',
    width: 100,
    borderRadius: 4,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};

/* ────────────────────────────────────────────── */

const VideoComponent = ({ src, width, borderRadius }) => {
  const {
    connectors: { connect, drag },
    isDragging,
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{
        border: '1px dashed #d1d5db',
        padding: '4px',
        borderRadius: '4px',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        display: 'inline-block',
        width: `${width}%`,
      }}
    >
      <video controls style={{ width: '100%', borderRadius: `${borderRadius}px`, display: 'block' }}>
        <source src={src} />
        ඔබගේ බ්‍රව්සරය video ටැගය සහාය නොදක්වයි.
      </video>
    </div>
  );
};

VideoComponent.craft = {
  displayName: 'Video',
  props: {
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    width: 100,
    borderRadius: 4,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};

/* ────────────────────────────────────────────── */

const AudioComponent = ({ src, width }) => {
  const {
    connectors: { connect, drag },
    isDragging,
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{
        border: '1px dashed #d1d5db',
        padding: '8px',
        borderRadius: '4px',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        display: 'inline-block',
        width: `${width}%`,
      }}
    >
      <audio controls style={{ width: '100%' }}>
        <source src={src} />
        ඔබගේ බ්‍රව්සරය audio ටැගය සහාය නොදක්වයි.
      </audio>
    </div>
  );
};

AudioComponent.craft = {
  displayName: 'Audio',
  props: {
    src: 'https://www.w3schools.com/html/horse.mp3',
    width: 100,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};

/* ────────────────────────────────────────────── */

const ButtonComponent = ({ text, backgroundColor, textColor, borderRadius, padding }) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    isDragging,
  } = useNode();

  return (
    <button
      ref={(ref) => connect(drag(ref))}
      style={{
        backgroundColor,
        color: textColor,
        padding: `${padding}px ${padding * 2}px`,
        border: 'none',
        borderRadius: `${borderRadius}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        fontSize: '16px',
        display: 'inline-block',
      }}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => setProp((props) => (props.text = e.currentTarget.textContent))}
    >
      {text}
    </button>
  );
};

ButtonComponent.craft = {
  displayName: 'Button',
  props: {
    text: 'බොත්තම',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    borderRadius: 6,
    padding: 10,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};

/* ────────────────────────────────────────────── */

const ContainerComponent = ({ backgroundColor, padding, borderRadius, minHeight }) => {
  const {
    connectors: { connect, drag },
    isDragging,
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{
        backgroundColor,
        padding: `${padding}px`,
        borderRadius: `${borderRadius}px`,
        border: '2px dashed #9ca3af',
        minHeight: `${minHeight}px`,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        position: 'relative',
        margin: '8px 0',
      }}
    >
      <Canvas id="container-canvas" style={{ minHeight: '60px' }} />
    </div>
  );
};

ContainerComponent.craft = {
  displayName: 'Container',
  props: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 8,
    minHeight: 100,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
};

/* ──────────────────────────────────────────────
   Sidebar (Palette) — click to add components
   ────────────────────────────────────────────── */

const Sidebar = () => {
  const { actions, query } = useEditor();

  const componentList = [
    { type: TextComponent, icon: <Type className="w-4 h-4" />, label: 'පෙළ' },
    { type: HeadingComponent, icon: <Type className="w-4 h-4" />, label: 'මාතෘකාව' },
    { type: ImageComponent, icon: <ImageIcon className="w-4 h-4" />, label: 'රූපය' },
    { type: VideoComponent, icon: <Play className="w-4 h-4" />, label: 'වීඩියෝ' },
    { type: AudioComponent, icon: <Eye className="w-4 h-4" />, label: 'ශ්‍රව්‍ය' },
    { type: ButtonComponent, icon: <MousePointer className="w-4 h-4" />, label: 'බොත්තම' },
    { type: ContainerComponent, icon: <Square className="w-4 h-4" />, label: 'කන්ටේනරය' },
  ];

  const handleAdd = (componentType) => {
    const rootNodes = query.getNodes();
    const rootNode = Object.values(rootNodes).find(
      (n) => n.data && n.data.name === 'ROOT'
    );
    const parentId = rootNode ? rootNode.id : null;
    if (!parentId) return;

    const props = componentType.craft.props || {};
    const reactElement = React.createElement(componentType, props);
    const nodeTree = query.parseReactElement(reactElement).toNodeTree();
    actions.addNodeTree(nodeTree, parentId);
  };

  return (
    <div className="w-72 bg-white border-r border-slate-200 p-4 overflow-y-auto flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Plus className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-bold">අංග මාලාව</h2>
      </div>

      <div className="space-y-2">
        {componentList.map((component) => (
          <button
            key={component.type.craft.displayName}
            onClick={() => handleAdd(component.type)}
            className="flex items-center gap-2 p-3 w-full bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors text-left"
          >
            {component.icon}
            <span className="text-sm font-medium">{component.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────
   Property Panel — edit selected element props
   ────────────────────────────────────────────── */

const PropertyField = ({ label, children }) => (
  <div className="mb-3">
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    {children}
  </div>
);

const inputClass = 'w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400';

const PropertyPanel = () => {
  const { selected, actions, query } = useEditor((state) => {
    const currentNodeId = state.events.selected;
    if (!currentNodeId) return { selected: null };
    const node = state.nodes[currentNodeId];
    return {
      selected: {
        id: currentNodeId,
        name: node.data.name,
        props: node.data.props,
        displayName: node.related && node.related.component ? node.related.component.craft && node.related.component.craft.displayName : node.data.displayName,
      },
    };
  });

  if (!selected) {
    return (
      <div className="w-72 bg-white border-l border-slate-200 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold">ගුණාංග</h2>
        </div>
        <p className="text-sm text-gray-400 text-center mt-8">අංගයක් තෝරන්න</p>
      </div>
    );
  }

  const { id, props } = selected;
  const setProp = (key, value) => {
    actions.setProp(id, (p) => (p[key] = value));
  };

  const handleMediaUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';

    if (!files.length) return;

    const addedAssets = await registerMediaFiles(files);
    if (addedAssets.length) {
      setProp('src', addedAssets[0].path);
    }
  };

  const renderFields = () => {
    const name = selected.name;
    switch (name) {
      case 'TextComponent':
        return (
          <>
            <PropertyField label="පෙළ">
              <textarea
                value={props.text || ''}
                onChange={(e) => setProp('text', e.target.value)}
                className={inputClass}
                rows={3}
              />
            </PropertyField>
            <PropertyField label="අකුරු ප්‍රමාණය (px)">
              <input type="number" value={props.fontSize || 16} onChange={(e) => setProp('fontSize', parseInt(e.target.value) || 16)} className={inputClass} />
            </PropertyField>
            <PropertyField label="වර්ණ">
              <input type="color" value={props.color || '#1f2937'} onChange={(e) => setProp('color', e.target.value)} className="w-full h-8 border border-gray-300 rounded" />
            </PropertyField>
            <PropertyField label="තද අකුරු">
              <select value={props.fontWeight || 'normal'} onChange={(e) => setProp('fontWeight', e.target.value)} className={inputClass}>
                <option value="normal">සාමාන්‍ය</option>
                <option value="bold">තද</option>
              </select>
            </PropertyField>
            <PropertyField label="පෙළ ගැලපුම">
              <select value={props.textAlign || 'left'} onChange={(e) => setProp('textAlign', e.target.value)} className={inputClass}>
                <option value="left">වම</option>
                <option value="center">මැද</option>
                <option value="right">දකුණ</option>
              </select>
            </PropertyField>
          </>
        );
      case 'HeadingComponent':
        return (
          <>
            <PropertyField label="පෙළ">
              <input type="text" value={props.text || ''} onChange={(e) => setProp('text', e.target.value)} className={inputClass} />
            </PropertyField>
            <PropertyField label="මට්ටම">
              <select value={props.level || 2} onChange={(e) => setProp('level', parseInt(e.target.value) || 2)} className={inputClass}>
                {[1, 2, 3, 4, 5, 6].map((l) => (
                  <option key={l} value={l}>H{l}</option>
                ))}
              </select>
            </PropertyField>
            <PropertyField label="වර්ණ">
              <input type="color" value={props.color || '#1f2937'} onChange={(e) => setProp('color', e.target.value)} className="w-full h-8 border border-gray-300 rounded" />
            </PropertyField>
            <PropertyField label="පෙළ ගැලපුම">
              <select value={props.textAlign || 'left'} onChange={(e) => setProp('textAlign', e.target.value)} className={inputClass}>
                <option value="left">වම</option>
                <option value="center">මැද</option>
                <option value="right">දකුණ</option>
              </select>
            </PropertyField>
          </>
        );
      case 'ImageComponent':
        return (
          <>
            <PropertyField label="රූප URL">
              <input type="text" value={props.src || ''} onChange={(e) => setProp('src', e.target.value)} className={inputClass} />
            </PropertyField>
            <PropertyField label="රූප ගොනුව උඩුගත කරන්න">
              <input type="file" accept="image/*" onChange={handleMediaUpload} className="block w-full text-sm" />
            </PropertyField>
            <PropertyField label="Alt පෙළ">
              <input type="text" value={props.alt || ''} onChange={(e) => setProp('alt', e.target.value)} className={inputClass} />
            </PropertyField>
            <PropertyField label="පළල (%)">
              <input type="number" value={props.width || 100} onChange={(e) => setProp('width', parseInt(e.target.value) || 100)} className={inputClass} />
            </PropertyField>
            <PropertyField label="මැදියාව (px)">
              <input type="number" value={props.borderRadius || 4} onChange={(e) => setProp('borderRadius', parseInt(e.target.value) || 0)} className={inputClass} />
            </PropertyField>
          </>
        );
      case 'VideoComponent':
        return (
          <>
            <PropertyField label="වීඩියෝ URL">
              <input type="text" value={props.src || ''} onChange={(e) => setProp('src', e.target.value)} className={inputClass} />
            </PropertyField>
            <PropertyField label="වීඩියෝ ගොනුව උඩුගත කරන්න">
              <input type="file" accept="video/*" onChange={handleMediaUpload} className="block w-full text-sm" />
            </PropertyField>
            <PropertyField label="පළල (%)">
              <input type="number" value={props.width || 100} onChange={(e) => setProp('width', parseInt(e.target.value) || 100)} className={inputClass} />
            </PropertyField>
            <PropertyField label="මැදියාව (px)">
              <input type="number" value={props.borderRadius || 4} onChange={(e) => setProp('borderRadius', parseInt(e.target.value) || 0)} className={inputClass} />
            </PropertyField>
          </>
        );
      case 'AudioComponent':
        return (
          <>
            <PropertyField label="ශ්‍රව්‍ය URL">
              <input type="text" value={props.src || ''} onChange={(e) => setProp('src', e.target.value)} className={inputClass} />
            </PropertyField>
            <PropertyField label="ශ්‍රව්‍ය ගොනුව උඩුගත කරන්න">
              <input type="file" accept="audio/*" onChange={handleMediaUpload} className="block w-full text-sm" />
            </PropertyField>
            <PropertyField label="පළල (%)">
              <input type="number" value={props.width || 100} onChange={(e) => setProp('width', parseInt(e.target.value) || 100)} className={inputClass} />
            </PropertyField>
          </>
        );
      case 'ButtonComponent':
        return (
          <>
            <PropertyField label="පෙළ">
              <input type="text" value={props.text || ''} onChange={(e) => setProp('text', e.target.value)} className={inputClass} />
            </PropertyField>
            <PropertyField label="පසුබිම වර්ණ">
              <input type="color" value={props.backgroundColor || '#3b82f6'} onChange={(e) => setProp('backgroundColor', e.target.value)} className="w-full h-8 border border-gray-300 rounded" />
            </PropertyField>
            <PropertyField label="අකුරු වර්ණ">
              <input type="color" value={props.textColor || '#ffffff'} onChange={(e) => setProp('textColor', e.target.value)} className="w-full h-8 border border-gray-300 rounded" />
            </PropertyField>
            <PropertyField label="මැදියාව (px)">
              <input type="number" value={props.borderRadius || 6} onChange={(e) => setProp('borderRadius', parseInt(e.target.value) || 0)} className={inputClass} />
            </PropertyField>
            <PropertyField label="ප්‍රමාණය (px)">
              <input type="number" value={props.padding || 10} onChange={(e) => setProp('padding', parseInt(e.target.value) || 0)} className={inputClass} />
            </PropertyField>
          </>
        );
      case 'ContainerComponent':
        return (
          <>
            <PropertyField label="පසුබිම වර්ණ">
              <input type="color" value={props.backgroundColor || '#f9fafb'} onChange={(e) => setProp('backgroundColor', e.target.value)} className="w-full h-8 border border-gray-300 rounded" />
            </PropertyField>
            <PropertyField label="ප්‍රමාණය (px)">
              <input type="number" value={props.padding || 20} onChange={(e) => setProp('padding', parseInt(e.target.value) || 0)} className={inputClass} />
            </PropertyField>
            <PropertyField label="මැදියාව (px)">
              <input type="number" value={props.borderRadius || 8} onChange={(e) => setProp('borderRadius', parseInt(e.target.value) || 0)} className={inputClass} />
            </PropertyField>
            <PropertyField label="අවම උස (px)">
              <input type="number" value={props.minHeight || 100} onChange={(e) => setProp('minHeight', parseInt(e.target.value) || 0)} className={inputClass} />
            </PropertyField>
          </>
        );
      default:
        return <p className="text-sm text-gray-400">මෙම අංගය සඳහා ගුණාංග නොමැත.</p>;
    }
  };

  return (
    <div className="w-72 bg-white border-l border-slate-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold">ගුණාංග</h2>
        </div>
        <button
          onClick={() => actions.delete(selected.id)}
          className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          title="මකන්න"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {renderFields()}
    </div>
  );
};

/* ──────────────────────────────────────────────
   HTML Generation — reads actual editor state
   ────────────────────────────────────────────── */

const generateHTMLFromEditor = (query) => {
  const nodes = query.getNodes();
  const rootNode = Object.values(nodes).find((n) => n.data && n.data.name === 'ROOT');
  if (!rootNode) return '<p>හිස් පිටුව</p>';

  const renderNode = (nodeId) => {
    const node = nodes[nodeId];
    if (!node) return '';
    const { name, props } = node.data;
    const childHTML = (node.data.nodes || [])
      .map((childId) => renderNode(childId))
      .join('\n');

    switch (name) {
      case 'TextComponent':
        return `      <p style="font-size: ${props.fontSize}px; color: ${props.color}; font-weight: ${props.fontWeight}; text-align: ${props.textAlign};">${props.text}</p>`;
      case 'HeadingComponent':
        return `      <h${props.level} style="color: ${props.color}; text-align: ${props.textAlign};">${props.text}</h${props.level}>`;
      case 'ImageComponent':
        return `      <img src="${props.src}" alt="${props.alt}" style="width: ${props.width}%; border-radius: ${props.borderRadius}px;">`;
      case 'VideoComponent':
        return `      <video controls style="width: ${props.width}%; border-radius: ${props.borderRadius}px;">
        <source src="${props.src}">
        ඔබගේ බ්‍රව්සරය video ටැගය සහාය නොදක්වයි.
      </video>`;
      case 'AudioComponent':
        return `      <audio controls style="width: ${props.width}%">
        <source src="${props.src}">
        ඔබගේ බ්‍රව්සරය audio ටැගය සහාය නොදක්වයි.
      </audio>`;
      case 'ButtonComponent':
        return `      <button style="background-color: ${props.backgroundColor}; color: ${props.textColor}; border: none; border-radius: ${props.borderRadius}px; padding: ${props.padding}px ${props.padding * 2}px; cursor: pointer;">${props.text}</button>`;
      case 'ContainerComponent':
        return `      <div style="background-color: ${props.backgroundColor}; padding: ${props.padding}px; border-radius: ${props.borderRadius}px; min-height: ${props.minHeight}px;">\n${childHTML}\n      </div>`;
      case 'ROOT':
        return childHTML;
      default:
        return childHTML;
    }
  };

  const bodyContent = renderNode(rootNode.id);

  return `<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Craft Builder පිටුව</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
${bodyContent}
    </div>
</body>
</html>`;
};

/* ──────────────────────────────────────────────
   Toolbar — generate code, preview, delete
   ────────────────────────────────────────────── */

const Toolbar = ({ onGenerate, onTogglePreview, showPreview }) => {
  const { selected, actions, query } = useEditor((state) => ({
    selected: state.events.selected,
  }));
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const addMediaComponent = (asset) => {
    const rootNodes = query.getNodes();
    const rootNode = Object.values(rootNodes).find((n) => n.data && n.data.name === 'ROOT');
    const parentId = rootNode ? rootNode.id : null;
    if (!parentId) return;

    const kind = getMediaKindFromType(asset.type);
    let componentType = ImageComponent;
    if (kind === 'video') componentType = VideoComponent;
    if (kind === 'audio') componentType = AudioComponent;

    const props = { ...componentType.craft.props, src: asset.path };
    const reactElement = React.createElement(componentType, props);
    const nodeTree = query.parseReactElement(reactElement).toNodeTree();
    actions.addNodeTree(nodeTree, parentId);
  };

  return (
    <>
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Craft.js Visual Builder</h1>
          <p className="text-sm text-slate-600">අංග ඇදගෙන වෙබ් පිටුව ගොඩනඟන්න</p>
        </div>
        <div className="flex items-center gap-2">
          {selected && (
            <button
              onClick={() => actions.delete(selected)}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-1.5 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              මකන්න
            </button>
          )}
          <button
            onClick={() => setShowMediaLibrary(true)}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
          >
            <Library className="w-4 h-4" />
            Media Library
          </button>
          <button
            onClick={onGenerate}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
          >
            <Code className="w-4 h-4" />
            HTML කේතය
          </button>
          <button
            onClick={onTogglePreview}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'සංස්කාරකය' : 'පෙරදසුන'}
          </button>
        </div>
      </div>

      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={addMediaComponent}
      />
    </>
  );
};

/* ──────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────── */

const CanvasDropArea = ({ children }) => {
  const { actions, query } = useEditor();
  const { isDraggingOver, handlers } = useDragAndDropMedia(async (files) => {
    const addedAssets = await registerMediaFiles(files);
    if (!addedAssets.length) return;

    const rootNodes = query.getNodes();
    const rootNode = Object.values(rootNodes).find((n) => n.data && n.data.name === 'ROOT');
    const parentId = rootNode ? rootNode.id : null;
    if (!parentId) return;

    for (const asset of addedAssets) {
      const kind = getMediaKindFromType(asset.type);
      let componentType = ImageComponent;
      if (kind === 'video') componentType = VideoComponent;
      if (kind === 'audio') componentType = AudioComponent;

      const props = { ...componentType.craft.props, src: asset.path };
      const reactElement = React.createElement(componentType, props);
      const nodeTree = query.parseReactElement(reactElement).toNodeTree();
      actions.addNodeTree(nodeTree, parentId);
    }
  });

  return (
    <div className="relative flex-1 overflow-auto p-6" {...handlers}>
      {isDraggingOver && (
        <div className="absolute inset-4 z-30 bg-blue-500/20 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center pointer-events-none">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Upload className="w-5 h-5" />
            <span>මෙහි media ගොනු දමන්න</span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

const CraftVisualBuilder = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [previewHTML, setPreviewHTML] = useState('');

  const handleGenerate = () => {
    // We need to read from the editor — use a hidden component
    setGeneratedCode('__GENERATE__');
  };

  const handleTogglePreview = () => {
    if (!showPreview) {
      setPreviewHTML('__GENERATE__');
    }
    setShowPreview(!showPreview);
  };

  return (
    <Editor
      enabled
      resolver={{
        Canvas,
        TextComponent,
        HeadingComponent,
        ImageComponent,
        VideoComponent,
        AudioComponent,
        ButtonComponent,
        ContainerComponent,
      }}
    >
      <div className="flex h-full bg-slate-50">
        {!showPreview ? (
          <>
            <Sidebar />

            <div className="flex-1 flex flex-col">
              <Toolbar
                onGenerate={handleGenerate}
                onTogglePreview={handleTogglePreview}
                showPreview={showPreview}
              />
              <CanvasDropArea>
                <Frame>
                  <Canvas
                    id="root-canvas"
                    style={{
                      minHeight: '100%',
                      padding: '16px',
                    }}
                  >
                    <Element is={TextComponent} text="ආරම්භ කිරීමට වම්පසින් අංග එකතු කරන්න" fontSize={18} color="#9ca3af" textAlign="center" />
                  </Canvas>
                </Frame>
              </CanvasDropArea>
            </div>

            <PropertyPanel />
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            <Toolbar
              onGenerate={handleGenerate}
              onTogglePreview={handleTogglePreview}
              showPreview={showPreview}
            />
            <div className="flex-1 bg-white">
              <iframe
                srcDoc={previewHTML}
                className="w-full h-full border-0"
                title="Preview"
              />
            </div>
          </div>
        )}

        {/* Hidden helper to access query for HTML generation */}
        <HtmlGeneratorHelper
          generatedCode={generatedCode}
          setGeneratedCode={setGeneratedCode}
          previewHTML={previewHTML}
          setPreviewHTML={setPreviewHTML}
        />
      </div>

      {/* Code Modal */}
      {generatedCode && generatedCode !== '__GENERATE__' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] mx-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">උත්පාදනය කළ HTML කේතය</h3>
              <button
                onClick={() => setGeneratedCode('')}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-auto">
              <pre>{generatedCode}</pre>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedCode);
                alert('කේතය පසුරු විය!');
              }}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
            >
              පිටපත් කරන්න
            </button>
          </div>
        </div>
      )}
    </Editor>
  );
};

/* ──────────────────────────────────────────────
   Hidden helper to access editor query for HTML gen
   ────────────────────────────────────────────── */

const HtmlGeneratorHelper = ({ generatedCode, setGeneratedCode, previewHTML, setPreviewHTML }) => {
  const { query } = useEditor();

  React.useEffect(() => {
    if (generatedCode === '__GENERATE__') {
      const html = generateHTMLFromEditor(query);
      setGeneratedCode(html);
    }
  }, [generatedCode, query, setGeneratedCode]);

  React.useEffect(() => {
    if (previewHTML === '__GENERATE__') {
      const html = generateHTMLFromEditor(query);
      setPreviewHTML(resolveMediaPathsInHtml(html));
    }
  }, [previewHTML, query, setPreviewHTML]);

  return null;
};

export default CraftVisualBuilder;
