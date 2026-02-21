
import { GoogleGenAI } from "@google/genai";
import { parseScriptContent, ParsedScriptLine, formatSecondsToTime } from '../utils/time';

const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
    return new GoogleGenAI({ apiKey });
};

export async function adjustTimestamps(script: string, offsetSeconds: number): Promise<string> {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a script-processing assistant. Your task is to adjust timestamps in a given audio script.

You will be given an offset time in seconds and a new script content. You must add this offset to every timestamp (\`mm:ss\`) found in the new script. This includes timestamps at the beginning of lines and the timestamp in the final "clip length mm:ss" line.

Your response MUST be ONLY the modified script content, correctly formatted. Do not add any explanations, greetings, or extra text like "\`\`\`" or "---".

Example:
If the offset is 95 seconds and the new script is:
---
00:10 Hello world
00:15 This is a test
clip length 00:20
---

Your output must be exactly:
01:45 Hello world
01:50 This is a test
clip length 01:55`;
    
    const contents = `The offset is: ${offsetSeconds} seconds.

The new script content is:
---
${script}
---
`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        const text = response.text;
        return text ? text.replace(/`/g, '').replace(/---/g, '').trim() : '';
    } catch (error) {
        console.error("Error calling Gemini API for timestamp adjustment:", error);
        throw new Error("Failed to get response from AI model for timestamp adjustment.");
    }
}


async function findBestMatchWithAI(audioLine: ParsedScriptLine, videoCandidates: ParsedScriptLine[]): Promise<ParsedScriptLine | null> {
    if (videoCandidates.length === 0) return null;
    if (videoCandidates.length === 1) return videoCandidates[0];

    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a content analysis assistant. Your task is to find the most relevant video script line for a given audio script line. The candidates are all from a similar timeframe.

Respond with ONLY the full, exact text of the best matching video script line. Do not add any other words, explanations, or formatting.`;

    const candidateTexts = videoCandidates.map(v => `- "${v.text}"`).join('\n');
    const contents = `Audio script line: "${audioLine.text}"

Which of these video script lines is the most contextually relevant?
${candidateTexts}
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: { systemInstruction }
        });

        const bestMatchText = response.text ? response.text.trim() : '';
        return videoCandidates.find(v => v.text.trim() === bestMatchText) || videoCandidates[0];

    } catch (error) {
        console.error("Error calling Gemini API for best match:", error);
        // Fallback to the closest in time if AI fails
        return videoCandidates.reduce((prev, curr) => 
            Math.abs(curr.timestamp - audioLine.timestamp) < Math.abs(prev.timestamp - audioLine.timestamp) ? curr : prev
        );
    }
}


export async function combineScripts(audioScript: string, videoScript: string): Promise<string> {
    const { lines: audioLines, clipLength: audioClipLength } = parseScriptContent(audioScript);
    const { lines: videoLines } = parseScriptContent(videoScript);

    const combined: { timestamp: number; audio: string; video: string }[] = [];
    const usedVideoIndices = new Set<number>();

    for (const audioLine of audioLines) {
        let bestVideoMatch: ParsedScriptLine | null = null;
        
        // 1. Exact match
        const exactMatchIndex = videoLines.findIndex(v => v.timestamp === audioLine.timestamp && !usedVideoIndices.has(v.timestamp));
        if (exactMatchIndex !== -1) {
            bestVideoMatch = videoLines[exactMatchIndex];
            usedVideoIndices.add(videoLines[exactMatchIndex].timestamp);
        } else {
            // 2. Fuzzy match (+/- 2 seconds)
            const fuzzyCandidates = videoLines.filter((v, index) => 
                !usedVideoIndices.has(v.timestamp) && Math.abs(v.timestamp - audioLine.timestamp) <= 2
            );

            if (fuzzyCandidates.length > 0) {
                bestVideoMatch = await findBestMatchWithAI(audioLine, fuzzyCandidates);
                if(bestVideoMatch) {
                    const originalIndex = videoLines.findIndex(v => v.timestamp === bestVideoMatch!.timestamp && v.text === bestVideoMatch!.text);
                    if(originalIndex !== -1) usedVideoIndices.add(videoLines[originalIndex].timestamp);
                }
            }
        }
        
        combined.push({
            timestamp: audioLine.timestamp,
            audio: audioLine.text,
            video: bestVideoMatch ? bestVideoMatch.text : '(ไม่มี)',
        });
    }

    // Add remaining video lines that were not matched
    videoLines.forEach((videoLine, index) => {
        if (!usedVideoIndices.has(videoLine.timestamp)) {
            combined.push({
                timestamp: videoLine.timestamp,
                audio: '(ไม่มี)',
                video: videoLine.text,
            });
        }
    });

    // Sort everything by timestamp
    combined.sort((a, b) => a.timestamp - b.timestamp);

    // Format the final output
    let result = combined.map(item => 
        `${formatSecondsToTime(item.timestamp)}\naudio : ${item.audio}\nvideo : ${item.video}`
    ).join('\n');
    
    if (audioClipLength) {
        result += `\nclip length ${audioClipLength}`;
    }

    return result;
}

export async function translateToThai(text: string): Promise<string> {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a professional translator and script editor. Your task is to convert English text into a bilingual English-Thai audio script format, sentence by sentence.

Instructions:
1.  Read the input English text.
2.  Break the text down into individual sentences.
3.  For each sentence, output the original English sentence on one line, followed immediately by its Thai translation on the next line.
4.  Ensure that each line contains ONLY ONE language and ONLY ONE sentence.
5.  Do not include timestamps, numbering, bullets, or extra commentary.
6.  The translation should be natural and suitable for a voiceover.

Format Example:
[English Sentence 1]
[Thai Translation 1]
[English Sentence 2]
[Thai Translation 2]

Input Example:
Welcome to our channel. Today we will discuss mindfulness.

Output Example:
Welcome to our channel.
ยินดีต้อนรับสู่ช่องของเรา
Today we will discuss mindfulness.
วันนี้เราจะมาพูดคุยเรื่องการเจริญสติ`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: text,
            config: { systemInstruction }
        });

        return response.text ? response.text.trim() : '';
    } catch (error) {
        console.error("Error calling Gemini API for translation:", error);
        throw new Error("Failed to translate script.");
    }
}

export async function generateEnglishSubtitle(text: string): Promise<string> {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a subtitle formatting expert. Your task is to format an English script into subtitles where STRICTLY NO single line exceeds 40 characters (including spaces).

Rules:
1. Input is a sequence of sentences.
2. If a line is 40 characters or less (including spaces), keep it as is.
3. If a line is longer than 40 characters (including spaces), split it into multiple lines.
4. SPLITTING STRATEGY:
   - PRIORITY 1: The absolute maximum length for any resulting line is 40 characters (including spaces).
   - PRIORITY 2: Minimize the total number of lines. Fill each line with as many words as possible up to the 40-character limit.
   - PRIORITY 3: Maintain semantic readability (keeping logical phrases together) ONLY if it does not conflict with PRIORITY 1 and does not excessively increase the line count (PRIORITY 2).
5. Output ONLY the formatted lines. Do not add numbers, dashes, or timestamps.

Example Input:
This is a very long line that definitely needs to be split into smaller pieces for the screen because it is too long.

Example Output:
This is a very long line that definitely
needs to be split into smaller pieces
for the screen because it is too long.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: text,
            config: { systemInstruction }
        });

        return response.text ? response.text.trim() : '';
    } catch (error) {
        console.error("Error calling Gemini API for subtitle generation:", error);
        throw new Error("Failed to generate subtitles.");
    }
}

export async function generateYouTubeHook(
    channelName: string,
    description: string,
    tags: string,
    targetGroup: string,
    audioScript: string,
    videoScript: string
): Promise<string> {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a world-class YouTube Content Creator expert. You possess high-level skills in growing YouTube channels rapidly, creating viral content, persuasion psychology, social media marketing, social psychology, and have a deep, profound understanding of Theravada Buddhist teachings. You are an expert in YouTube SEO, Algorithm, and AI.

Your Task:
Create the single most effective "Hook" (introductory spoken text) for a new YouTube video.
This hook must:
1. Be highly engaging and persuasive to stop the scroll and retain viewers.
2. Be tailored specifically to the target group and current trends suitable for this niche.
3. Be optimized for the YouTube Algorithm to maximize reach and potential virality.
4. Reflect the essence of the video content and the channel's identity.

Data provided for analysis:
- Channel Name
- Channel Description
- Channel Tags
- Target Group
- Video Content (Audio Script & Video Script)

Output Format Rules:
- Generate the Hook in English (Spoken version).
- Provide a Thai translation immediately following on the next line.
- Do NOT provide multiple options. Provide only the BEST one.
- Do NOT add any explanations, intro, or outro text.
- Format:
[English Hook Sentence(s)]
[Thai Translation]`;

    const contents = `
Channel Name: ${channelName}
Channel Description: ${description}
Channel Tags: ${tags}
Channel Links: ${targetGroup}
Target Group: ${targetGroup}

English Audio Script (Content):
${audioScript}

Video Script (Visuals):
${videoScript}

Generate the best Hook now.
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                temperature: 0.8, // Slightly higher creativity for hooks
            }
        });

        return response.text ? response.text.trim() : '';
    } catch (error) {
        console.error("Error calling Gemini API for hook generation:", error);
        throw new Error("Failed to generate YouTube Hook.");
    }
}

export async function generateYouTubeTitle(
    channelName: string,
    description: string,
    tags: string,
    targetGroup: string,
    audioScript: string,
    videoScript: string,
    hook: string
): Promise<string> {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a world-class YouTube Content Creator expert. You possess high-level skills in growing YouTube channels rapidly, creating viral content, persuasion psychology, social media marketing, social psychology, and have a deep, profound understanding of Theravada Buddhist teachings. You are an expert in YouTube SEO, Algorithm, and AI.

Your Task:
Create the single most effective "Video Title" (Clip Name) for a new YouTube video.
This title must:
1. Be highly engaging (High Click-Through Rate) and attract the target audience immediately.
2. Be optimized for YouTube SEO (Searchable) and the Recommendation Algorithm.
3. Be tailored specifically to the target group and current trends in the Buddhist/Spiritual niche.
4. Accurately reflect the content and the hook.

Data provided for analysis:
- Channel Name
- Channel Description
- Channel Tags
- Target Group
- Video Content (Audio Script & Video Script)
- The Viral Hook (already generated)

Output Format Rules:
- Generate the Title in English.
- Provide a Thai translation immediately following on the next line.
- Do NOT provide multiple options. Provide only the single BEST one.
- Do NOT add quotes, labels (like "Title:"), or extra text.
- Format:
[English Title]
[Thai Translation]`;

    const contents = `
Channel Name: ${channelName}
Channel Description: ${description}
Channel Tags: ${tags}
Target Group: ${targetGroup}
Viral Hook: ${hook}

English Audio Script (Content):
${audioScript}

Video Script (Visuals):
${videoScript}

Generate the best Title now.
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                temperature: 0.7,
            }
        });

        return response.text ? response.text.trim() : '';
    } catch (error) {
        console.error("Error calling Gemini API for title generation:", error);
        throw new Error("Failed to generate YouTube Title.");
    }
}

export async function generateVideoDescription(
    channelName: string,
    channelDescription: string,
    tags: string,
    targetGroup: string,
    audioScript: string,
    videoScript: string,
    hook: string,
    title: string,
    channelLinks: string
): Promise<string> {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a world-class YouTube Content Creator expert. You possess high-level skills in growing YouTube channels rapidly, creating viral content, persuasion psychology, social media marketing, social psychology, and have a deep, profound understanding of Theravada Buddhist teachings. You are an expert in YouTube SEO, Algorithm, and AI.

Your Task:
Create the single most effective "YouTube Video Clip Description" for a new YouTube video.
This description must:
1. Be highly engaging and persuasive to drive views, watch time, and subscriptions.
2. Be optimized for YouTube SEO to appear in search results and recommendations for the target group.
3. Include keywords naturally and strategically.
4. Provide value to the viewer and encourage them to watch the full video.
5. Incorporate the provided "Link to channel" information appropriately (e.g., in a "Connect with us" or "Subscribe" section).
6. STRICT RULE: The English Description portion must be UNDER 5,000 characters (including spaces).

Data provided for analysis:
- Channel Name, Description, Tags, Links
- Target Group
- Video Content (Audio/Video Scripts)
- Viral Hook & Title

Output Format Rules:
- First Section: The Full English Description (Ready for copy-paste into YouTube).
- Second Section: A full Thai translation of the English description.
- Separate the sections clearly with "--------------------" (Dashes).
- Do NOT add other commentary.

Format:
[English Description Text]
--------------------
[Thai Translation Text]`;

    const contents = `
Channel Name: ${channelName}
Channel Description: ${channelDescription}
Channel Tags: ${tags}
Channel Links: ${channelLinks}
Target Group: ${targetGroup}
Viral Hook: ${hook}
Video Title: ${title}

English Audio Script (Content):
${audioScript}

Video Script (Visuals):
${videoScript}

Generate the best Video Description now.
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                temperature: 0.7,
            }
        });

        return response.text ? response.text.trim() : '';
    } catch (error) {
        console.error("Error calling Gemini API for description generation:", error);
        throw new Error("Failed to generate YouTube Video Description.");
    }
}

export async function generateVideoTags(
    channelName: string,
    channelDescription: string,
    channelTags: string,
    channelLinks: string,
    targetGroup: string,
    audioScript: string,
    videoScript: string,
    hook: string,
    title: string,
    videoDescription: string
): Promise<string> {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a world-class YouTube Content Creator expert. You possess high-level skills in growing YouTube channels rapidly, creating viral content, persuasion psychology, social media marketing, social psychology, and have a deep, profound understanding of Theravada Buddhist teachings. You are an expert in YouTube SEO, Algorithm, and AI.

Your Task:
Create the most effective "YouTube Video Clip Tags" for the new YouTube video.
These tags must:
1. Maximize searchability and relevance for the Target Group.
2. Include a mix of broad (Short-tail) and specific (Long-tail) keywords.
3. Align with current high-volume search trends in this niche.
4. Strategically utilize the ~500 character limit.
5. Sort tags by importance (Most critical tags first).

Data provided for analysis:
- Channel Name, Description, Tags, Links
- Target Group
- Video Content (Audio/Video Scripts)
- Viral Hook, Title, Video Description

Output Format Rules:
- First Section: The English Tags.
  - Comma-separated values (e.g., Buddhism, Theravada, Meditation Guide, ...).
  - Total length approx 500 characters (users can trim the end if needed).
  - Provide slightly more than 500 characters so the user has options to trim.
- Second Section: A Thai translation/explanation of the keywords used (list format).
- Separate the sections clearly with "--------------------" (Dashes).

Format:
[English Tags, Comma Separated]
--------------------
[Thai Translation/Explanation]`;

    const contents = `
Channel Name: ${channelName}
Channel Description: ${channelDescription}
Channel Tags: ${channelTags}
Channel Links: ${channelLinks}
Target Group: ${targetGroup}
Viral Hook: ${hook}
Video Title: ${title}
Video Description: ${videoDescription}

English Audio Script (Content):
${audioScript}

Video Script (Visuals):
${videoScript}

Generate the best Video Tags now.
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                temperature: 0.7,
            }
        });

        return response.text ? response.text.trim() : '';
    } catch (error) {
        console.error("Error calling Gemini API for video tags generation:", error);
        throw new Error("Failed to generate YouTube Video Tags.");
    }
}

export async function generateThumbnailCaption(
    channelName: string,
    channelDescription: string,
    channelTags: string,
    channelLinks: string,
    targetGroup: string,
    audioScript: string,
    videoScript: string,
    hook: string,
    title: string,
    videoDescription: string,
    videoTags: string
): Promise<string> {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a world-class YouTube Content Creator expert. You possess high-level skills in growing YouTube channels rapidly, creating viral content, persuasion psychology, social media marketing, social psychology, and have a deep, profound understanding of Theravada Buddhist teachings. You are an expert in YouTube SEO, Algorithm, and AI.

Your Task:
Create the single most effective "YouTube Video Clip Thumbnail Caption" (Text Overlay) for the new YouTube video.
This caption must:
1. Be short, punchy, and instantly readable (usually 2-5 words max).
2. Complement the Title (don't just repeat it) to create a "Curiosity Gap".
3. Promise a clear benefit or evoke an emotion (peace, freedom, wisdom).
4. Be optimized to stop the scroll.

Data provided for analysis:
- Channel Name, Description, Tags, Links
- Target Group
- Video Content (Audio/Video Scripts)
- Viral Hook, Title, Video Description, Video Tags

Output Format Rules:
- Generate the English Thumbnail Caption.
- Provide a Thai translation immediately following on the next line.
- Do NOT provide multiple options. Provide only the single BEST one.
- Do NOT add quotes, labels (like "Caption:"), or extra text.
- Format:
[English Caption]
[Thai Translation]`;

    const contents = `
Channel Name: ${channelName}
Channel Description: ${channelDescription}
Channel Tags: ${channelTags}
Channel Links: ${channelLinks}
Target Group: ${targetGroup}
Viral Hook: ${hook}
Video Title: ${title}
Video Description: ${videoDescription}
Video Tags: ${videoTags}

English Audio Script (Content):
${audioScript}

Video Script (Visuals):
${videoScript}

Generate the best Thumbnail Caption now.
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                temperature: 0.7,
            }
        });

        return response.text ? response.text.trim() : '';
    } catch (error) {
        console.error("Error calling Gemini API for thumbnail caption generation:", error);
        throw new Error("Failed to generate Thumbnail Caption.");
    }
}

export async function generateThumbnailPrompt(
    channelName: string,
    channelDescription: string,
    channelTags: string,
    channelLinks: string,
    targetGroup: string,
    audioScript: string,
    videoScript: string,
    hook: string,
    title: string,
    videoDescription: string,
    videoTags: string,
    thumbnailCaption: string,
    thumbnailGuidance: string // Added Guidance
): Promise<string> {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a world-class YouTube Content Creator, a leading AI Artist, and an expert Prompt Engineer.

Core Competencies:
- **YouTube Growth:** Deep expertise in rapidly growing channels, creating viral content, and understanding the YouTube Algorithm/SEO.
- **Psychology:** Mastery of persuasion, social psychology, and marketing to influence viewer behavior.
- **Subject Matter:** Deep, profound understanding of Theravada Buddhist teachings.
- **Art Direction:** Ability to conceptualize stunning, eye-catching imagery that stops the scroll (High CTR).

Your Mission:
Analyze all provided data (Channel Info, Video Content, SEO metadata, and SPECIFICALLY the "Thumbnail Guidance"). Use this analysis to create the single most effective "YouTube Video Clip Thumbnail Prompt" (English) for an AI Image Generator.

Goal:
- The resulting image must catch the eye of the "Target Group" immediately.
- It must maximize CTR (Click-Through Rate) and algorithmic reach.
- It must be aesthetically beautiful, appropriate, and impactful.

Key Requirements for the Prompt:
1.  **Visual Style:** Specify a style that is high-quality, modern, and perfectly suited to the niche (Buddhism/Spirituality) but distinct enough to stand out.
2.  **Text Overlay:** The prompt MUST instruct the AI to include the provided "Thumbnail Caption" as a textual element in the image. This text must be BIG, CLEAR, BOLD, EASY TO READ, and AESTHETICALLY INTEGRATED.
3.  **Aspect Ratio:** You MUST explicitly include the phrase "Aspect Ratio 16:9" in the prompt text.
4.  **Guidance Adherence:** Pay close attention to the "Thumbnail Guidance". If provided, it overrides general assumptions. If any data field is empty, skip it and focus on available data.

Output Format:
- Return ONLY the detailed English prompt.
- Do NOT add introductions or explanations.
`;

    const contents = `
Channel Data:
- Name: ${channelName}
- Description: ${channelDescription}
- Tags: ${channelTags}
- Links: ${channelLinks}
- Target Group: ${targetGroup}

Video Data:
- Hook: ${hook}
- Title: ${title}
- Description: ${videoDescription}
- Tags: ${videoTags}
- Audio Script: ${audioScript}
- Video Script: ${videoScript}

**Thumbnail Specifics:**
- Thumbnail Caption (Must be in image): "${thumbnailCaption}"
- **Thumbnail Guidance (Crucial):** "${thumbnailGuidance}"

Generate the high-performance AI Image Prompt now.
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                temperature: 0.8, // Creative for art prompts
            }
        });

        return response.text ? response.text.trim() : '';
    } catch (error) {
        console.error("Error calling Gemini API for thumbnail prompt generation:", error);
        throw new Error("Failed to generate Thumbnail Prompt.");
    }
}

export async function generateThumbnailImage(
    prompt: string,
    model: string
): Promise<string> {
    const ai = getAI();
    
    if (model.includes('imagen')) {
         try {
            const response = await ai.models.generateImages({
                model: model, 
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                    aspectRatio: '16:9',
                },
            });
            const base64EncodeString = response.generatedImages?.[0]?.image?.imageBytes;
            if (!base64EncodeString) {
                throw new Error("No image generated.");
            }
            return `data:image/png;base64,${base64EncodeString}`;
         } catch (error) {
             console.error("Error generating image with Imagen:", error);
             throw new Error("Failed to generate thumbnail image.");
         }
    } else {
        try {
            const config: any = {
                imageConfig: {
                    aspectRatio: "16:9",
                }
            };
            if (model === 'gemini-3-pro-image-preview') {
                 config.imageConfig.imageSize = "1K";
            }

            const response = await ai.models.generateContent({
                model: model,
                contents: {
                    parts: [{ text: prompt }]
                },
                config: config
            });
            
            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    const base64EncodeString = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    return `data:${mimeType};base64,${base64EncodeString}`;
                }
            }
            throw new Error("No image part found in response.");
        } catch (error) {
            console.error("Error generating image with Gemini:", error);
            throw new Error("Failed to generate thumbnail image.");
        }
    }
}

export async function generateConsultingResponse(
    channelName: string,
    channelDescription: string,
    channelTags: string,
    channelLinks: string,
    targetGroup: string,
    audioScript: string,
    videoScript: string,
    hook: string,
    title: string,
    videoDescription: string,
    videoTags: string,
    thumbnailCaption: string,
    thumbnailPrompt: string,
    chatHistory: string,
    currentPrompt: string
): Promise<string> {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a world-class YouTube Content Creator expert. You possess high-level skills in growing YouTube channels rapidly, creating viral content, persuasion psychology, social media marketing, social psychology, and have a deep, profound understanding of Theravada Buddhist teachings. You are an expert in YouTube SEO, Algorithm, and AI. You also have expertise in Art Direction and Prompt Engineering.

Your Task:
Act as a consultant to help the user improve their video. Analyze ALL provided data about the channel and the current video project. Answer the user's specific prompt/question to maximize the video's potential for views, engagement, and algorithmic reach within the target audience.

Data provided for analysis:
- Channel Context (Name, Desc, Tags, Links, Target Group)
- Video Context (Audio/Video Scripts, Hook, Title, Desc, Tags, Thumbnail Caption, Thumbnail Prompt)
- Chat History (Previous conversation context)

Output Format Rules:
- Provide a direct, actionable, and expert response.
- Do not repeat the user's prompt in your answer.
- Maintain a helpful and professional tone.
`;

    const contents = `
Channel Name: ${channelName}
Channel Description: ${channelDescription}
Channel Tags: ${channelTags}
Channel Links: ${channelLinks}
Target Group: ${targetGroup}

Current Video Project Data:
Hook: ${hook}
Title: ${title}
Video Description: ${videoDescription}
Video Tags: ${videoTags}
Thumbnail Caption: ${thumbnailCaption}
Thumbnail Prompt: ${thumbnailPrompt}
English Audio Script: ${audioScript}
Video Script: ${videoScript}

Chat History:
${chatHistory}

Current User Prompt:
${currentPrompt}
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                temperature: 0.7,
            }
        });

        return response.text ? response.text.trim() : '';
    } catch (error) {
        console.error("Error calling Gemini API for consulting response:", error);
        throw new Error("Failed to generate consulting response.");
    }
}
