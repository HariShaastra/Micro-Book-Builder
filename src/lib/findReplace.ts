/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Escapes characters for safe use in RegExp
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface FindReplaceOptions {
  wholeWord?: boolean;
  matchCase?: boolean;
}

/**
 * Builds a safe RegExp for searching text
 */
export function buildSearchRegex(query: string, options: FindReplaceOptions = {}): RegExp | null {
  if (!query || !query.trim()) return null;

  const escaped = escapeRegExp(query.trim());
  const flags = options.matchCase ? 'g' : 'gi';

  // If whole word is required, enforce word boundaries
  // Use unicode-aware word boundary or \b
  const pattern = options.wholeWord ? `\\b${escaped}\\b` : escaped;

  try {
    return new RegExp(pattern, flags);
  } catch (e) {
    console.error('Invalid search regex', e);
    return null;
  }
}

/**
 * Counts matches in HTML content by inspecting only text nodes (never HTML tags or attributes)
 */
export function countMatchesInHtml(html: string, query: string, options: FindReplaceOptions = {}): number {
  if (!html || !query.trim()) return 0;
  const regex = buildSearchRegex(query, options);
  if (!regex) return 0;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);

    let count = 0;
    let node: Node | null = walker.nextNode();
    while (node) {
      const text = node.textContent || '';
      const matches = text.match(regex);
      if (matches) {
        count += matches.length;
      }
      node = walker.nextNode();
    }
    return count;
  } catch {
    // Fallback if DOMParser fails
    const textOnly = html.replace(/<[^>]*>/g, ' ');
    const matches = textOnly.match(regex);
    return matches ? matches.length : 0;
  }
}

/**
 * Replaces search query in HTML content safely (modifies ONLY text nodes, never HTML tags or attributes)
 */
export function replaceInHtml(
  html: string,
  query: string,
  replacement: string,
  options: FindReplaceOptions & { replaceAll?: boolean; targetIndex?: number } = {}
): { newHtml: string; replacedCount: number } {
  if (!html || !query.trim()) return { newHtml: html, replacedCount: 0 };
  const regex = buildSearchRegex(query, options);
  if (!regex) return { newHtml: html, replacedCount: 0 };

  const replaceAll = options.replaceAll ?? false;
  const targetIndex = options.targetIndex ?? 0;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);

    let currentMatchIndex = 0;
    let replacedCount = 0;

    let node: Node | null = walker.nextNode();
    while (node) {
      const text = node.textContent || '';
      // Reset regex index
      regex.lastIndex = 0;

      if (regex.test(text)) {
        regex.lastIndex = 0;
        let newText = '';
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(text)) !== null) {
          const isTargetMatch = replaceAll || currentMatchIndex === targetIndex;

          newText += text.substring(lastIndex, match.index);
          if (isTargetMatch) {
            newText += replacement;
            replacedCount++;
          } else {
            newText += match[0];
          }

          lastIndex = match.index + match[0].length;
          currentMatchIndex++;

          if (!replaceAll && isTargetMatch) {
            // Replaced the single target match, append rest of current node and exit loop
            newText += text.substring(lastIndex);
            node.textContent = newText;
            return {
              newHtml: doc.body.innerHTML,
              replacedCount
            };
          }
        }

        newText += text.substring(lastIndex);
        node.textContent = newText;
      }

      node = walker.nextNode();
    }

    return {
      newHtml: doc.body.innerHTML,
      replacedCount
    };
  } catch (err) {
    console.error('DOM replace error, falling back', err);
    // Safe text fallback
    return {
      newHtml: html.replace(regex, replacement),
      replacedCount: 1
    };
  }
}
