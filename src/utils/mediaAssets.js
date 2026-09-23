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

// Only well-formed base64 media data URLs are ever put into the preview document.
const SAFE_DATA_URL = /^data:(image|video|audio)\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/i;

export const getMediaAssetMap = () => {
  return new Map(
    loadMediaAssets()
      .filter((asset) => typeof asset?.path === 'string' && SAFE_DATA_URL.test(asset.dataUrl || ''))
      .map((asset) => [asset.path, asset.dataUrl])
  );
};

export const isSupportedMediaFile = (file) =>
  Boolean(file && (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')));

// ---- Upload validation -------------------------------------------------------------
// Files are checked by their real content (magic bytes), not just the name or the
// browser-reported type, so a renamed .exe/.html/.svg cannot get in as an "image".
// SVG is not accepted because it can contain scripts.

const MB = 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 10;
const MAX_SIZE = { image: 2 * MB, video: 3 * MB, audio: 3 * MB };
const MAX_IMAGE_DIMENSION = 8000;

const hasBytes = (bytes, offset, expected) => expected.every((value, i) => bytes[offset + i] === value);
const hasText = (bytes, offset, text) => hasBytes(bytes, offset, [...text].map((c) => c.charCodeAt(0)));

const FORMATS = [
  { mime: 'image/png', exts: ['png'], test: (b) => hasBytes(b, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) },
  { mime: 'image/jpeg', exts: ['jpg', 'jpeg'], test: (b) => hasBytes(b, 0, [0xff, 0xd8, 0xff]) },
  { mime: 'image/gif', exts: ['gif'], test: (b) => hasText(b, 0, 'GIF87a') || hasText(b, 0, 'GIF89a') },
  { mime: 'image/webp', exts: ['webp'], test: (b) => hasText(b, 0, 'RIFF') && hasText(b, 8, 'WEBP') },
  { mime: 'image/bmp', exts: ['bmp'], test: (b) => hasText(b, 0, 'BM') },
  { mime: 'video/mp4', exts: ['mp4', 'm4v'], test: (b) => hasText(b, 4, 'ftyp') },
  { mime: 'video/webm', exts: ['webm'], test: (b) => hasBytes(b, 0, [0x1a, 0x45, 0xdf, 0xa3]) },
  { mime: 'video/ogg', exts: ['ogv'], test: (b) => hasText(b, 0, 'OggS') },
  { mime: 'audio/ogg', exts: ['ogg', 'oga'], test: (b) => hasText(b, 0, 'OggS') },
  { mime: 'audio/wav', exts: ['wav'], test: (b) => hasText(b, 0, 'RIFF') && hasText(b, 8, 'WAVE') },
  {
    mime: 'audio/mpeg',
    exts: ['mp3'],
    test: (b) => hasText(b, 0, 'ID3') || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0),
  },
];

// For <input accept>: the file picker only offers the formats we accept.
export const MEDIA_ACCEPT = FORMATS.flatMap((f) => f.exts.map((e) => `.${e}`)).join(',');

const formatSizeMb = (bytes) => `${(bytes / MB).toFixed(1)} MB`;

const checkImageDecodes = (file) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(
        img.naturalWidth > 0 &&
          img.naturalWidth <= MAX_IMAGE_DIMENSION &&
          img.naturalHeight <= MAX_IMAGE_DIMENSION
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    img.src = url;
  });

// Returns `{ ok: true, mime, kind }` or `{ ok: false, reason }`.
export const validateMediaFile = async (file) => {
  if (!file || !file.size) return { ok: false, reason: 'empty file' };

  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const candidates = FORMATS.filter((f) => f.exts.includes(ext));
  if (!candidates.length) {
    return { ok: false, reason: `.${ext} files are not allowed (allowed: ${MEDIA_ACCEPT.split(',').join(' ')})` };
  }

  let header;
  try {
    header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  } catch {
    return { ok: false, reason: 'could not read the file' };
  }

  const format = candidates.find((f) => f.test(header));
  if (!format) return { ok: false, reason: `the content is not a real .${ext} file` };

  const kind = getMediaKindFromType(format.mime);
  if (file.size > MAX_SIZE[kind]) {
    return { ok: false, reason: `too large (${formatSizeMb(file.size)}, max ${formatSizeMb(MAX_SIZE[kind])})` };
  }

  if (kind === 'image' && !(await checkImageDecodes(file))) {
    return { ok: false, reason: `the image is damaged or larger than ${MAX_IMAGE_DIMENSION}px` };
  }

  return { ok: true, mime: format.mime, kind };
};

const reportRejectedFiles = (rejected) => {
  if (!rejected.length || typeof window === 'undefined') return;
  const lines = rejected.map(({ name, reason }) => `• ${name}: ${reason}`);
  window.alert(`පහත ගොනු උඩුගත කළ නොහැක / These files were not uploaded:\n\n${lines.join('\n')}`);
};

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

// Validates, stores and returns the accepted files. Rejected files are reported to the user.
export const registerMediaFiles = async (files) => {
  const currentAssets = loadMediaAssets();
  const existingPaths = new Set(currentAssets.map((asset) => asset.path));
  const addedAssets = [];
  const rejected = [];

  const list = Array.from(files || []);
  list.slice(MAX_FILES_PER_UPLOAD).forEach((file) =>
    rejected.push({ name: file.name, reason: `only ${MAX_FILES_PER_UPLOAD} files can be uploaded at once` })
  );

  for (const file of list.slice(0, MAX_FILES_PER_UPLOAD)) {
    const check = await validateMediaFile(file);
    if (!check.ok) {
      rejected.push({ name: file.name, reason: check.reason });
      continue;
    }

    let dataUrl;
    try {
      // Store with the verified type rather than whatever the browser guessed from the name.
      const raw = await readFileAsDataUrl(file);
      dataUrl = `data:${check.mime};base64,${raw.slice(raw.indexOf(',') + 1)}`;
    } catch {
      rejected.push({ name: file.name, reason: 'could not read the file' });
      continue;
    }

    const safeName = sanitizeFileName(file.name);
    const basePath = `assets/${safeName}`;
    const path = makeUniqueAssetPath(basePath, existingPaths);

    existingPaths.add(path);
    addedAssets.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: file.name.replace(/[<>"'`&]/g, ''),
      type: check.mime,
      path,
      dataUrl,
      size: file.size,
      updatedAt: new Date().toISOString(),
    });
  }

  if (addedAssets.length) {
    try {
      saveMediaAssets([...currentAssets, ...addedAssets]);
    } catch {
      // localStorage is full (about 5 MB per site).
      addedAssets.forEach((asset) =>
        rejected.push({ name: asset.name, reason: 'storage is full – delete some files in Media Library first' })
      );
      addedAssets.length = 0;
    }
  }

  reportRejectedFiles(rejected);
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
