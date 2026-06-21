const MEDIA_ASSETS_STORAGE_KEY = 'codehero-media-assets';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sanitizeFileName = (fileName) => {
  const cleaned = fileName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]+/g, '-');

  return cleaned || `asset-${Date.now()}`;
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}`));
    reader.readAsDataURL(file);
  });

export const loadMediaAssets = () => {
  try {
    const raw = localStorage.getItem(MEDIA_ASSETS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveMediaAssets = (assets) => {
  localStorage.setItem(MEDIA_ASSETS_STORAGE_KEY, JSON.stringify(assets));
};

export const getMediaAssetMap = () => {
  return new Map(loadMediaAssets().map((asset) => [asset.path, asset.dataUrl]));
};

export const isSupportedMediaFile = (file) =>
  Boolean(file && (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')));

export const getMediaKind = (file) => {
  if (!file) return null;
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  return null;
};

export const getMediaKindFromType = (type) => {
  if (!type) return null;
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  return null;
};

export const deleteMediaAsset = (id) => {
  const currentAssets = loadMediaAssets();
  const nextAssets = currentAssets.filter((asset) => asset.id !== id);
  saveMediaAssets(nextAssets);
  return nextAssets;
};

const makeUniqueAssetPath = (basePath, existingPaths) => {
  if (!existingPaths.has(basePath)) return basePath;

  const dotIndex = basePath.lastIndexOf('.');
  const name = dotIndex > 0 ? basePath.slice(0, dotIndex) : basePath;
  const extension = dotIndex > 0 ? basePath.slice(dotIndex) : '';

  let counter = 2;
  let candidate = `${name}-${counter}${extension}`;
  while (existingPaths.has(candidate)) {
    counter += 1;
    candidate = `${name}-${counter}${extension}`;
  }

  return candidate;
};

export const registerMediaFiles = async (files) => {
  const currentAssets = loadMediaAssets();
  const existingPaths = new Set(currentAssets.map((asset) => asset.path));
  const addedAssets = [];

  for (const file of files) {
    if (!isSupportedMediaFile(file)) continue;

    const dataUrl = await readFileAsDataUrl(file);
    const safeName = sanitizeFileName(file.name);
    const basePath = `assets/${safeName}`;
    const path = makeUniqueAssetPath(basePath, existingPaths);

    existingPaths.add(path);
    addedAssets.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: file.name,
      type: file.type,
      path,
      dataUrl,
      size: file.size,
      updatedAt: new Date().toISOString(),
    });
  }

  if (addedAssets.length) {
    saveMediaAssets([...currentAssets, ...addedAssets]);
  }

  return addedAssets;
};

export const resolveMediaUrl = (url, assetMap = getMediaAssetMap()) => {
  if (!url) return url;
  return assetMap.get(url) || url;
};

export const resolveMediaPathsInHtml = (html, assetMap = getMediaAssetMap()) => {
  if (!html || assetMap.size === 0) return html;

  let output = html;
  for (const [path, dataUrl] of assetMap.entries()) {
    const escapedPath = escapeRegExp(path);
    output = output.replace(new RegExp(`(src\\s*=\\s*["'])${escapedPath}(["'])`, 'gi'), `$1${dataUrl}$2`);
    output = output.replace(new RegExp(`(poster\\s*=\\s*["'])${escapedPath}(["'])`, 'gi'), `$1${dataUrl}$2`);
  }

  return output;
};

export const buildMediaSnippetFromAsset = (asset) => {
  const kind = getMediaKindFromType(asset.type);
  const altText = asset.name.replace(/\.[^.]+$/, '') || 'media';

  if (kind === 'image') {
    return `<img src="${asset.path}" alt="${altText}" style="max-width: 100%; height: auto;">`;
  }

  if (kind === 'video') {
    return `<video controls style="max-width: 100%; height: auto;">
    <source src="${asset.path}" type="${asset.type}">
    ඔබගේ බ්‍රව්සරය video ටැගය සහාය නොදක්වයි.
</video>`;
  }

  if (kind === 'audio') {
    return `<audio controls>
    <source src="${asset.path}" type="${asset.type}">
    ඔබගේ බ්‍රව්සරය audio ටැගය සහාය නොදක්වයි.
</audio>`;
  }

  return '';
};

export const buildMediaSnippet = (file, assetPath) => {
  const kind = getMediaKind(file);
  const altText = file.name.replace(/\.[^.]+$/, '') || 'media';

  if (kind === 'image') {
    return `<img src="${assetPath}" alt="${altText}" style="max-width: 100%; height: auto;">`;
  }

  if (kind === 'video') {
    return `<video controls style="max-width: 100%; height: auto;">
    <source src="${assetPath}" type="${file.type}">
    ඔබගේ බ්‍රව්සරය video ටැගය සහාය නොදක්වයි.
</video>`;
  }

  if (kind === 'audio') {
    return `<audio controls>
    <source src="${assetPath}" type="${file.type}">
    ඔබගේ බ්‍රව්සරය audio ටැගය සහාය නොදක්වයි.
</audio>`;
  }

  return '';
};
