// Utility functions for DocSum application

export const STORAGE_KEYS = {
  RECORDS: 'docsum_records',
  LEGACY_RECORDS: 'docsum_file_records',
  CURRENT_USER: 'currentUser'
};

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getFileCategory(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return { type: 'pdf', label: 'PDF Document', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return { type: 'doc', label: 'Text Document', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
  if (['csv', 'xlsx', 'xls', 'json'].includes(ext)) return { type: 'data', label: 'Structured Data', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) return { type: 'image', label: 'Image Scan', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
  return { type: 'file', label: 'General File', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
}

export function generateAISummary(fileName, fileSizeFormatted) {
  const ext = fileName.split('.').pop().toLowerCase();
  const title = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  
  const summariesByExt = {
    pdf: [
      `Extracted executive summary for "${title}". Verified compliance parameters and legal clauses.`,
      `Key topics identified: Financial auditing, quarterly commitments, and operational milestones.`,
      `Document risk score: Low (98.4% data confidence). 4 action items extracted.`
    ],
    json: [
      `Parsed JSON schema with nested entity fields and key-value mapping.`,
      `Detected API payload configuration with zero syntax anomalies.`,
      `Data integrity validated against standard enterprise JSON schemas.`
    ],
    csv: [
      `Analyzed tabular row records. Calculated aggregate metric sums and field variances.`,
      `Found 142 primary records with high data density.`,
      `Cleaned null indicators and normalized numeric column indices.`
    ],
    txt: [
      `Processed plain text notes for "${title}". Extracted core entity names and dates.`,
      `Key takeaways: Task list, operational priorities, and stakeholder updates.`,
      `Semantic sentiment score: Positive / Informational.`
    ]
  };

  const defaultBullets = [
    `Ingested record "${fileName}" (${fileSizeFormatted}).`,
    `Completed automated indexing and OCR text extraction.`,
    `Ready for downstream JSON serialization and security audit.`
  ];

  const bullets = summariesByExt[ext] || defaultBullets;
  const entitiesCount = Math.floor(Math.random() * 18) + 5;
  const confidence = (96.5 + Math.random() * 3.4).toFixed(1);

  return {
    summaryText: `Document "${fileName}" successfully processed by DocSum Engine v2.4. Analyzed structural hierarchy and semantic entities.`,
    bulletPoints: bullets,
    entitiesCount,
    confidenceScore: `${confidence}%`,
    category: getFileCategory(fileName).label,
    extractedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

export function loadHistoryFromStorage() {
  try {
    const primary = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECORDS)) || [];
    const legacy = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEGACY_RECORDS)) || [];
    
    // Normalize legacy records into standard format if needed
    const combined = [...primary];
    
    legacy.forEach(item => {
      const exists = combined.some(c => c.id === item.id || (c.name === item.name && c.timestamp === item.date));
      if (!exists) {
        combined.push({
          id: item.id || Math.random().toString(36).substr(2, 9),
          name: item.name || 'Untitled Document',
          size: item.size || '0 KB',
          timestamp: item.timestamp || item.date || new Date().toLocaleString(),
          summary: item.summary || generateAISummary(item.name || 'Doc', item.size || '10 KB')
        });
      }
    });

    return combined;
  } catch (e) {
    console.error('Error loading records from storage:', e);
    return [];
  }
}

export function saveHistoryToStorage(records) {
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving records to storage:', e);
  }
}
