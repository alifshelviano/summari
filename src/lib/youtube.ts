import { YoutubeTranscript } from 'youtube-transcript';
import { VideoMetadata, TranscriptItem } from './types';

/**
 * Extracts a YouTube Video ID from any valid YouTube URL or raw ID.
 */
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If directly passed an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    
    // youtube.com/watch?v=...
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.searchParams.has('v')) {
        return parsed.searchParams.get('v');
      }
      // youtube.com/shorts/...
      const shortsMatch = parsed.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shortsMatch) return shortsMatch[1];

      // youtube.com/embed/...
      const embedMatch = parsed.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch) return embedMatch[1];
    }

    // youtu.be/...
    if (parsed.hostname.includes('youtu.be')) {
      const match = parsed.pathname.match(/^\/([a-zA-Z0-9_-]{11})/);
      if (match) return match[1];
    }
  } catch {
    // Regex fallback
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i;
    const match = trimmed.match(regex);
    if (match) return match[1];
  }

  return null;
}

/**
 * Fetches video metadata using YouTube's oEmbed endpoint (no API key required).
 */
export async function fetchVideoMetadata(videoId: string): Promise<VideoMetadata> {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;

  try {
    const res = await fetch(oEmbedUrl, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      return {
        videoId,
        url: watchUrl,
        title: data.title || `YouTube Video (${videoId})`,
        author: data.author_name || 'YouTube Creator',
        authorUrl: data.author_url,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    }
  } catch (err) {
    console.warn('oEmbed fetch error, using fallback:', err);
  }

  return {
    videoId,
    url: watchUrl,
    title: `YouTube Video (${videoId})`,
    author: 'YouTube Channel',
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}

/**
 * Clean decoded HTML entities from subtitles.
 */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();
}

/**
 * Direct YouTube page scraper fallback for subtitles if the library fails.
 */
async function fetchTranscriptFallback(videoId: string): Promise<TranscriptItem[]> {
  const pageUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const response = await fetch(pageUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'id,en-US,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch video page: ${response.status}`);
  }

  const html = await response.text();
  const splittedHtml = html.split('"captions":');
  if (splittedHtml.length <= 1) {
    throw new Error('No captions track found in video data.');
  }

  const captionsJson = JSON.parse(
    splittedHtml[1].split(',"videoDetails"')[0].replace('\n', '')
  );

  const captionTracks =
    captionsJson?.playerCaptionsTracklistRenderer?.captionTracks;

  if (!captionTracks || captionTracks.length === 0) {
    throw new Error('No caption tracks available for this video.');
  }

  // Prioritize Indonesian or English, or take first
  const preferredTrack =
    captionTracks.find((t: { languageCode: string }) => t.languageCode === 'id') ||
    captionTracks.find((t: { languageCode: string }) => t.languageCode?.startsWith('en')) ||
    captionTracks[0];

  const transcriptResponse = await fetch(preferredTrack.baseUrl);
  if (!transcriptResponse.ok) {
    throw new Error('Failed to download transcript XML.');
  }

  const xmlText = await transcriptResponse.text();

  // Simple regex parser for <text start="12.3" dur="4.5">Text content</text>
  const regex = /<text\s+start="([\d.]+)"(?:\s+dur="([\d.]+)")?[^>]*>(.*?)<\/text>/g;
  const items: TranscriptItem[] = [];
  let match;

  while ((match = regex.exec(xmlText)) !== null) {
    const offset = parseFloat(match[1]);
    const duration = match[2] ? parseFloat(match[2]) : 0;
    const text = decodeHtmlEntities(match[3]);
    if (text) {
      items.push({ text, duration, offset });
    }
  }

  return items;
}

/**
 * Fetches transcript for a YouTube video. Tries package first, falls back to direct scraper.
 */
export async function fetchVideoTranscript(videoId: string): Promise<TranscriptItem[]> {
  // Strategy 1: youtube-transcript package
  try {
    const raw = await YoutubeTranscript.fetchTranscript(videoId);
    if (raw && raw.length > 0) {
      return raw.map((item) => ({
        text: decodeHtmlEntities(item.text),
        duration: item.duration,
        offset: item.offset,
      }));
    }
  } catch (err) {
    console.warn(`Primary transcript fetch failed for ${videoId}:`, (err as Error).message);
  }

  // Strategy 2: Direct scraper fallback
  try {
    const fallbackItems = await fetchTranscriptFallback(videoId);
    if (fallbackItems && fallbackItems.length > 0) {
      return fallbackItems;
    }
  } catch (err) {
    console.warn(`Fallback transcript fetch failed for ${videoId}:`, (err as Error).message);
  }

  throw new Error(
    'Transkrip video tidak ditemukan atau dinonaktifkan oleh pembuat video. Anda dapat menempelkan teks/catatan video secara manual di bawah ini.'
  );
}

/**
 * Formats transcript items into readable text with timestamps.
 */
export function formatTranscriptForPrompt(items: TranscriptItem[], maxWords: number = 8000): string {
  let combined = '';
  let wordCount = 0;

  for (const item of items) {
    const minutes = Math.floor(item.offset / 60000 || item.offset / 60);
    const seconds = Math.floor((item.offset % 60000) / 1000 || item.offset % 60);
    const timeStr = `[${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}]`;
    
    const chunk = `${timeStr} ${item.text}\n`;
    const wordsInChunk = item.text.split(/\s+/).length;

    if (wordCount + wordsInChunk > maxWords) {
      combined += `\n... [Transkrip dipotong untuk mematuhi batas konteks model AI]`;
      break;
    }

    combined += chunk;
    wordCount += wordsInChunk;
  }

  return combined;
}

