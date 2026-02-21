
export interface ParsedScriptLine {
    timestamp: number;
    text: string;
}

/**
 * Parses a time string in "mm:ss" format to total seconds.
 * @param timeStr The time string, e.g., "01:30".
 * @returns The total number of seconds.
 */
export const parseTimeToSeconds = (timeStr: string | null): number => {
    if (!timeStr) return -1;
    // Allow for mm:ss or m:ss formats
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return -1;
    
    const [, minutes, seconds] = match.map(Number);
    if (isNaN(minutes) || isNaN(seconds)) {
        return -1;
    }
    return minutes * 60 + seconds;
};

/**
 * Formats total seconds into a "mm:ss" time string.
 * @param totalSeconds The total number of seconds.
 * @returns A formatted time string, e.g., "01:30".
 */
export const formatSecondsToTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    return `${paddedMinutes}:${paddedSeconds}`;
};

/**
 * Finds the last occurrence of "clip length mm:ss" in a script and returns the time string.
 * @param script The full script content.
 * @returns The time string "mm:ss" or null if not found.
 */
export const findLastClipLengthTime = (script: string): string | null => {
    const lines = script.trim().split('\n');
    const reversedLines = lines.reverse();

    for (const line of reversedLines) {
        const match = line.match(/clip length\s+(\d{1,2}:\d{2})/);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
};


/**
 * Removes the last "clip length mm:ss" line from a script.
 * @param script The script content.
 * @returns The script content without the last clip length line.
 */
export const removeLastClipLengthLine = (script: string): string => {
    const lines = script.trim().split('\n');
    let lastClipLengthIndex = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (/clip length\s+\d{1,2}:\d{2}/.test(lines[i])) {
            lastClipLengthIndex = i;
            break;
        }
    }
    
    if (lastClipLengthIndex !== -1) {
        lines.splice(lastClipLengthIndex, 1);
    }
    
    return lines.join('\n');
};


/**
 * Parses a script string into a structured array of lines and extracts the clip length.
 * @param script The script content.
 * @returns An object containing the parsed lines and the clip length time string.
 */
export const parseScriptContent = (script: string): { lines: ParsedScriptLine[], clipLength: string | null } => {
    const parsedLines: ParsedScriptLine[] = [];
    
    // 1. Find the last clip length using the existing robust helper.
    const clipLength = findLastClipLengthTime(script);

    // 2. Parse the script for timestamps and messages.
    const regex = /^(\d{1,2}:\d{2})\s/gm; // `m` for multiline to match `^` at start of lines
    const matches = [];
    let match;
    while ((match = regex.exec(script)) !== null) {
        matches.push({
            timeStr: match[1],
            index: match.index,
            headerLength: match[0].length,
        });
    }

    for (let i = 0; i < matches.length; i++) {
        const currentMatch = matches[i];
        const nextMatch = matches[i + 1];

        const startIndex = currentMatch.index + currentMatch.headerLength;
        const endIndex = nextMatch ? nextMatch.index : script.length;
        
        const rawText = script.substring(startIndex, endIndex);

        // Filter out any "clip length" lines from the message content block.
        // This prevents metadata from appearing inside the message.
        const textLines = rawText.split('\n');
        const contentLines = textLines.filter(line => !/^\s*clip length\s+\d{1,2}:\d{2}\s*$/.test(line));
        const text = contentLines.join('\n').trim();

        if (text) {
             parsedLines.push({
                timestamp: parseTimeToSeconds(currentMatch.timeStr),
                text: text,
            });
        }
    }

    return { lines: parsedLines, clipLength };
};
