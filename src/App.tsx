
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import ScriptEditor from './components/ScriptEditor';
import CombinedEditor from './components/CombinedEditor';
import EnglishScriptEditor from './components/EnglishScriptEditor';
import EnglishThaiScriptEditor from './components/EnglishThaiScriptEditor';
import EnglishSubtitleEditor from './components/EnglishSubtitleEditor';
import YouTubeChannelNameEditor from './components/YouTubeChannelNameEditor';
import LinkToChannelEditor from './components/LinkToChannelEditor';
import YouTubeDescriptionEditor from './components/YouTubeDescriptionEditor';
import YouTubeTagsEditor from './components/YouTubeTagsEditor';
import TargetGroupEditor from './components/TargetGroupEditor';
import HookEditor from './components/HookEditor';
import TitleEditor from './components/TitleEditor';
import Description5000Editor from './components/Description5000Editor';
import VideoTagsEditor from './components/VideoTagsEditor';
import ThumbnailCaptionEditor from './components/ThumbnailCaptionEditor';
import ThumbnailGuidanceEditor from './components/ThumbnailGuidanceEditor';
import ThumbnailPromptEditor from './components/ThumbnailPromptEditor';
import ConsultingChatEditor from './components/ConsultingChatEditor';
import { findLastClipLengthTime, parseTimeToSeconds, removeLastClipLengthLine, parseScriptContent } from './utils/time';
import { adjustTimestamps, combineScripts, translateToThai, generateEnglishSubtitle, generateYouTubeHook, generateYouTubeTitle, generateVideoDescription, generateVideoTags, generateThumbnailCaption, generateThumbnailPrompt, generateThumbnailImage, generateConsultingResponse } from './services/geminiService';

const App: React.FC = () => {
    // Unified state
    // --- ระบบจัดการ API Key สำหรับใช้งานส่วนตัว ---
      const [inputKey, setInputKey] = useState<string>('');

        useEffect(() => {
            const savedKey = localStorage.getItem('gemini_api_key');
                if (savedKey) {
                      setInputKey(savedKey);
                            (window as any).process = { env: { API_KEY: savedKey } };
                                } else {
                                      setInputKey('no API key');
                                          }
                                            }, []);

                                              const handleSendKey = () => {
                                                  if (inputKey && inputKey !== 'no API key') {
                                                        localStorage.setItem('gemini_api_key', inputKey);
                                                              alert("บันทึก API Key เรียบร้อยแล้วครับ");
                                                                    window.location.reload(); 
                                                                        }
                                                                          };
    const [projectName, setProjectName] = useState<string>('');
    const [audioScriptContent, setAudioScriptContent] = useState<string>('');
    const [videoScriptContent, setVideoScriptContent] = useState<string>('');
    const [combinedScriptContent, setCombinedScriptContent] = useState<string>('');
    const [englishScriptContent, setEnglishScriptContent] = useState<string>('');
    const [englishThaiScriptContent, setEnglishThaiScriptContent] = useState<string>('');
    const [englishSubtitleContent, setEnglishSubtitleContent] = useState<string>('');
    const [youTubeChannelName, setYouTubeChannelName] = useState<string>('Buddhist Journey to Freedom');
    
    const defaultLinkToChannel = `https://www.youtube.com/@BuddhistJourneyToFreedom
https://www.youtube.com/channel/UCqGeC8whm37-RVLkwZG-1tg`;
    const [linkToChannelContent, setLinkToChannelContent] = useState<string>(defaultLinkToChannel);

    const defaultDescription = `Buddhist Journey to Freedom

Your path to inner peace and wisdom starts here.
Welcome to Buddhist Journey to Freedom, your guide to the timeless wisdom of the Buddha.
On this channel, we explore the core teachings of Theravada Buddhism and the Pali Canon. We believe that true freedom is found by understanding and facing life's challenges with wisdom.
What you'll find here:
Practical Wisdom: Learn how to apply Buddhist principles to find inner peace.
Deeper Insights: Explore key concepts like the Four Noble Truths and the Noble Eightfold Path.
Guided Meditations: Discover simple techniques to train your mind.
In-depth Study: Gain a deeper understanding of the Pali Canon.
Whether you're seeking clarity, purpose, or peace in a chaotic world, this channel is for you. Join our community as we journey together toward the ultimate freedom of mind.
Subscribe now and begin your journey.`;
    const [youTubeDescription, setYouTubeDescription] = useState<string>(defaultDescription);

    const defaultTags = `Buddhist Journey to Freedom,
Buddhist,
Buddha,
Buddhism​,
Theravada,
Hinayana,
Pali Canon,
Tripitaka,
Meditation,
Vipassana,
Insight Meditation​,
Mindfulness​,
Enlightenment,
Awakening,
Meditate,
Spiritual Journey,
Freedom,
Inner Peace,
Buddhist in Thailand,
Mental development,
Theravada Buddhism,
Hinayana Buddhism,
Nirvana,
Noble Truths,
Mindfulness for Beginners,
Spiritual Journey,
Dhamma,
Dharma,
Four Noble Truths,
Noble Eightfold Path,
Sutta,
Sutra,
Buddhist Teachings,
Spiritual Growth,
Mind,
Mind training,
Self Improvement,`;
    const [youTubeTags, setYouTubeTags] = useState<string>(defaultTags);

    const defaultTargetGroup = "ผู้สนใจและผู้ที่น่าจะสนใจคำสอนของพระพุทธศาสนา รวมถึงผู้ที่คิดจะพัฒนาจิตใจ ผู้ที่สนใจการทำสมาธิ ฯลฯ ทั่วโลก โดยเฉพาะผู้ที่เข้าใจภาษาอังกฤษ​ ทั้งในสหรัฐอเมริกา​ แคนาดา​ ในยุโรป เช่น อังกฤษ​ ฝรั่งเศส​ เยอรมัน​ รัสเซีย​ สเปน อิตาลี​ ฟินแลนด์​ นอร์เวย์​ ในเอเชีย​ เช่น เกาหลีใต้ ญี่ปุ่น​ ฮ่องกง​ ไต้หวัน​ มาเลเซีย​ สิงคโปร์​ ฟิลิปปินส์​ อินโดนีเซีย​ อินเดีย​ ศรีลังกา​ รวมถึง ออสเตรเลีย​ นิวซีแลนด์​ ฯลฯ";
    const [targetGroupContent, setTargetGroupContent] = useState<string>(defaultTargetGroup);
    
    const [hookContent, setHookContent] = useState<string>('');
    const [titleContent, setTitleContent] = useState<string>('');
    const [videoDescriptionContent, setVideoDescriptionContent] = useState<string>('');
    const [videoTagsContent, setVideoTagsContent] = useState<string>('');
    const [thumbnailCaptionContent, setThumbnailCaptionContent] = useState<string>('');
    const [thumbnailGuidanceContent, setThumbnailGuidanceContent] = useState<string>('');
    const [thumbnailPromptContent, setThumbnailPromptContent] = useState<string>('');
    
    // Consulting Chat States
    const [chatHistoryContent, setChatHistoryContent] = useState<string>('');
    const [consultingPromptContent, setConsultingPromptContent] = useState<string>('');
    const [isConsultingLoading, setIsConsultingLoading] = useState<boolean>(false);
    
    // Consulting Chat Attachment State
    const [consultingAttachedFileContent, setConsultingAttachedFileContent] = useState<string | null>(null);
    const [consultingAttachedFileName, setConsultingAttachedFileName] = useState<string | null>(null);

    // Image Generation State
    const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
    const [isCreatingImage, setIsCreatingImage] = useState<boolean>(false);
    const [imageModel, setImageModel] = useState<string>('gemini-2.5-flash-image');
    const [textModel, setTextModel] = useState<string>('gemini-2.5-flash');

    // Loading states
    const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
    const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false);
    const [isCombining, setIsCombining] = useState<boolean>(false);
    const [isEnglishThaiLoading, setIsEnglishThaiLoading] = useState<boolean>(false);
    const [isEnglishSubtitleLoading, setIsEnglishSubtitleLoading] = useState<boolean>(false);
    const [isHookLoading, setIsHookLoading] = useState<boolean>(false);
    const [isTitleLoading, setIsTitleLoading] = useState<boolean>(false);
    const [isVideoDescriptionLoading, setIsVideoDescriptionLoading] = useState<boolean>(false);
    const [isVideoTagsLoading, setIsVideoTagsLoading] = useState<boolean>(false);
    const [isThumbnailCaptionLoading, setIsThumbnailCaptionLoading] = useState<boolean>(false);
    const [isThumbnailPromptLoading, setIsThumbnailPromptLoading] = useState<boolean>(false);

    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    // Refs for file inputs (Fallback)
    const audioFileInputRef = useRef<HTMLInputElement>(null);
    const videoFileInputRef = useRef<HTMLInputElement>(null);
    const combinedFileInputRef = useRef<HTMLInputElement>(null);
    const englishFileInputRef = useRef<HTMLInputElement>(null);
    const englishThaiFileInputRef = useRef<HTMLInputElement>(null);
    const englishSubtitleFileInputRef = useRef<HTMLInputElement>(null);
    const linkToChannelFileInputRef = useRef<HTMLInputElement>(null);
    const descriptionFileInputRef = useRef<HTMLInputElement>(null);
    const tagsFileInputRef = useRef<HTMLInputElement>(null);
    const targetGroupFileInputRef = useRef<HTMLInputElement>(null);
    const hookFileInputRef = useRef<HTMLInputElement>(null);
    const titleFileInputRef = useRef<HTMLInputElement>(null);
    const videoDescriptionFileInputRef = useRef<HTMLInputElement>(null);
    const videoTagsFileInputRef = useRef<HTMLInputElement>(null);
    const thumbnailCaptionFileInputRef = useRef<HTMLInputElement>(null);
    const thumbnailGuidanceFileInputRef = useRef<HTMLInputElement>(null);
    const thumbnailPromptFileInputRef = useRef<HTMLInputElement>(null);
    const chatHistoryFileInputRef = useRef<HTMLInputElement>(null);
    const consultingPromptFileInputRef = useRef<HTMLInputElement>(null);

    // Ref for File System Access API (to remember last directory in session)
    const lastHandlerRef = useRef<any>(null);
    // Ref to track if File System Access API is blocked (e.g. by iframe)
    const isFSAccessBlockedRef = useRef<boolean>(false);

    // --- Utility Functions ---
    const showFeedback = (message: string) => {
        setFeedbackMessage(message);
        setTimeout(() => setFeedbackMessage(null), 3000); // Increased duration slightly
    };

    const processLoadedContent = async (
        newContent: string,
        currentContent: string,
        setContent: (content: string) => void,
        setLoading: (loading: boolean) => void,
        shouldMerge: boolean
    ) => {
        if (!shouldMerge || currentContent.trim() === '') {
            setContent(newContent);
            showFeedback('File loaded successfully.');
            return;
        }

        setLoading(true);
        const baseContent = removeLastClipLengthLine(currentContent);

        try {
            const offsetTimeStr = findLastClipLengthTime(currentContent);
            const offsetSeconds = parseTimeToSeconds(offsetTimeStr);

            if (offsetSeconds < 0) {
                showFeedback('Warning: "clip length" not found. Appending raw content.');
                setContent(`${baseContent.trim()}\n${newContent.trim()}`);
            } else {
                const adjustedContent = await adjustTimestamps(newContent, offsetSeconds, textModel);
                setContent(`${baseContent.trim()}\n${adjustedContent.trim()}`);
                showFeedback('File merged and timestamps adjusted.');
            }
        } catch (error) {
            console.error('Error adjusting timestamps:', error);
            showFeedback('AI adjustment failed. Appending raw.');
            setContent(`${baseContent.trim()}\n${newContent.trim()}`);
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showFeedback('File downloaded.');
    };

    // --- Smart Handlers (File System Access API) ---

    const handleSmartOpen = async (
        currentContent: string,
        setContent: (c: string) => void,
        setLoading: (l: boolean) => void,
        fallbackRef: React.RefObject<HTMLInputElement>,
        shouldMerge: boolean = false
    ) => {
        if ('showOpenFilePicker' in window && !isFSAccessBlockedRef.current) {
            try {
                const pickerOptions: any = {
                    id: 'ai-script-integrator', // This ID tells browser to remember the directory across sessions
                    types: [{ description: 'Text Files', accept: { 'text/plain': ['.txt'] } }],
                    multiple: false
                };

                // If we have a previous handle, use it to start in the same directory
                if (lastHandlerRef.current) {
                    pickerOptions.startIn = lastHandlerRef.current;
                }

                // @ts-ignore - showOpenFilePicker is not in standard lib yet
                const [handle] = await window.showOpenFilePicker(pickerOptions);
                
                // Store the handle to use as startIn for next time
                lastHandlerRef.current = handle;

                const file = await handle.getFile();
                const reader = new FileReader();
                reader.onload = (e) => {
                    processLoadedContent(e.target?.result as string, currentContent, setContent, setLoading, shouldMerge);
                };
                reader.readAsText(file);
            } catch (err: any) {
                // Check if the error is a SecurityError related to iframe restrictions
                if (err.name === 'SecurityError' || (err.message && err.message.includes('Cross origin sub frames'))) {
                    console.warn('File System Access API blocked (iframe restriction). Switching to fallback.');
                    if (!isFSAccessBlockedRef.current) {
                        showFeedback('System blocked advanced file picker. Using standard picker.');
                    }
                    isFSAccessBlockedRef.current = true; // Permanently fallback for this session
                    fallbackRef.current?.click();
                } else if (err.name !== 'AbortError') {
                    console.error('File Picker Error:', err);
                    // Fallback to input if error (e.g. not supported or permission denied)
                    fallbackRef.current?.click();
                }
            }
        } else {
            fallbackRef.current?.click();
        }
    };

    const handleSmartSave = async (content: string, filename: string) => {
        if (!content) {
            showFeedback('Nothing to save.');
            return;
        }

        if ('showSaveFilePicker' in window && !isFSAccessBlockedRef.current) {
            try {
                const pickerOptions: any = {
                    id: 'ai-script-integrator', // This ID tells browser to remember the directory across sessions
                    suggestedName: filename,
                    types: [{ description: 'Text Files', accept: { 'text/plain': ['.txt'] } }],
                };

                // If we have a previous handle, use it to start in the same directory
                if (lastHandlerRef.current) {
                    pickerOptions.startIn = lastHandlerRef.current;
                }

                // @ts-ignore - showSaveFilePicker is not in standard lib yet
                const handle = await window.showSaveFilePicker(pickerOptions);

                // Store the handle to use as startIn for next time
                lastHandlerRef.current = handle;

                const writable = await handle.createWritable();
                await writable.write(content);
                await writable.close();
                showFeedback('File saved successfully!');
            } catch (err: any) {
                // Check if the error is a SecurityError related to iframe restrictions
                if (err.name === 'SecurityError' || (err.message && err.message.includes('Cross origin sub frames'))) {
                    console.warn('File System Access API blocked (iframe restriction). Switching to fallback.');
                    if (!isFSAccessBlockedRef.current) {
                        showFeedback('System blocked advanced file saver. Using standard download.');
                    }
                    isFSAccessBlockedRef.current = true; // Permanently fallback for this session
                    downloadFile(content, filename);
                } else if (err.name !== 'AbortError') {
                    console.error('Save Picker Error:', err);
                    downloadFile(content, filename);
                }
            }
        } else {
            downloadFile(content, filename);
        }
    };

    // --- Fallback Input Handler ---
    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        currentContent: string,
        setContent: (content: string) => void,
        setLoading: (loading: boolean) => void,
        shouldMerge: boolean = false
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            processLoadedContent(e.target?.result as string, currentContent, setContent, setLoading, shouldMerge);
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset
    };

    // --- Filename Generators ---
    const getTimestampedFilename = (scriptContent: string, projName: string, type: string) => {
        const formattedProjectName = projName || `UntitledProject`;
        const lastClipLength = findLastClipLengthTime(scriptContent) || '00-00';
        return `${formattedProjectName}_${type}_script_with_timestamp_${lastClipLength.replace(':', '-')}.txt`;
    };
    
    const getCustomFilename = (projName: string, suffix: string) => {
        const formattedProjectName = projName || `UntitledProject`;
        return `${formattedProjectName} ${suffix}.txt`;
    };

    // --- Editor-Specific Handlers ---

    // Audio
    const handleAudioOpen = useCallback(() => handleSmartOpen(audioScriptContent, setAudioScriptContent, setIsAudioLoading, audioFileInputRef, true), [audioScriptContent]);
    const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, audioScriptContent, setAudioScriptContent, setIsAudioLoading, true);
    const handleAudioSave = () => handleSmartSave(audioScriptContent, getTimestampedFilename(audioScriptContent, projectName, 'Audio'));
    const handleAudioCopy = () => { navigator.clipboard.writeText(audioScriptContent); showFeedback('Copied!'); };
    const handleAudioClear = () => { setAudioScriptContent(''); showFeedback('Cleared.'); };

    // Video
    const handleVideoOpen = useCallback(() => handleSmartOpen(videoScriptContent, setVideoScriptContent, setIsVideoLoading, videoFileInputRef, true), [videoScriptContent]);
    const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, videoScriptContent, setVideoScriptContent, setIsVideoLoading, true);
    const handleVideoSave = () => handleSmartSave(videoScriptContent, getTimestampedFilename(videoScriptContent, projectName, 'Video'));
    const handleVideoCopy = () => { navigator.clipboard.writeText(videoScriptContent); showFeedback('Copied!'); };
    const handleVideoClear = () => { setVideoScriptContent(''); showFeedback('Cleared.'); };
    
    // Combined
    const handleCombine = async () => {
        if (!audioScriptContent || !videoScriptContent) {
            showFeedback("Both audio and video scripts are required.");
            return;
        }
        setIsCombining(true);
        try {
            const result = await combineScripts(audioScriptContent, videoScriptContent, textModel);
            setCombinedScriptContent(result);
            showFeedback("Scripts combined!");
        } catch (error) {
            console.error(error);
            showFeedback("Combination failed.");
        } finally {
            setIsCombining(false);
        }
    };
    const handleCombinedOpen = useCallback(() => handleSmartOpen(combinedScriptContent, setCombinedScriptContent, () => {}, combinedFileInputRef, false), [combinedScriptContent]);
    const handleCombinedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, combinedScriptContent, setCombinedScriptContent, () => {}, false);
    const handleCombinedSave = () => handleSmartSave(combinedScriptContent, getTimestampedFilename(combinedScriptContent, projectName, 'Combined'));
    const handleCombinedCopy = () => { navigator.clipboard.writeText(combinedScriptContent); showFeedback('Copied!'); };
    const handleCombinedClear = () => { setCombinedScriptContent(''); showFeedback('Cleared.'); };

    // English No Timestamp
    const handleGenerateEnglish = () => {
        if (!audioScriptContent) { showFeedback("No audio script."); return; }
        const { lines } = parseScriptContent(audioScriptContent);
        if (lines.length === 0) { showFeedback("No content."); return; }
        setEnglishScriptContent(lines.map(l => l.text).join('\n'));
        showFeedback("Generated.");
    };
    const handleEnglishOpen = useCallback(() => handleSmartOpen(englishScriptContent, setEnglishScriptContent, () => {}, englishFileInputRef, false), [englishScriptContent]);
    const handleEnglishFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, englishScriptContent, setEnglishScriptContent, () => {}, false);
    const handleEnglishSave = () => handleSmartSave(englishScriptContent, getCustomFilename(projectName, 'English audio script no timestamp'));
    const handleEnglishCopy = () => { navigator.clipboard.writeText(englishScriptContent); showFeedback('Copied!'); };
    const handleEnglishClear = () => { setEnglishScriptContent(''); showFeedback('Cleared.'); };

    // English - Thai Audio Script
    const handleGenerateEnglishThai = async () => {
        if (!englishScriptContent) { showFeedback("Empty input."); return; }
        setIsEnglishThaiLoading(true);
        try {
            const result = await translateToThai(englishScriptContent, textModel);
            setEnglishThaiScriptContent(result);
            showFeedback("Generated!");
        } catch (e) { showFeedback("Failed."); } finally { setIsEnglishThaiLoading(false); }
    };
    const handleEnglishThaiOpen = useCallback(() => handleSmartOpen(englishThaiScriptContent, setEnglishThaiScriptContent, setIsEnglishThaiLoading, englishThaiFileInputRef, false), [englishThaiScriptContent]);
    const handleEnglishThaiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, englishThaiScriptContent, setEnglishThaiScriptContent, setIsEnglishThaiLoading, false);
    const handleEnglishThaiSave = () => handleSmartSave(englishThaiScriptContent, getCustomFilename(projectName, 'English - Thai audio script'));
    const handleEnglishThaiCopy = () => { navigator.clipboard.writeText(englishThaiScriptContent); showFeedback('Copied!'); };
    const handleEnglishThaiClear = () => { setEnglishThaiScriptContent(''); showFeedback('Cleared.'); };

    // English Subtitle
    const handleGenerateEnglishSubtitle = async () => {
        if (!englishScriptContent) { showFeedback("Empty input."); return; }
        setIsEnglishSubtitleLoading(true);
        try {
            const result = await generateEnglishSubtitle(englishScriptContent, textModel);
            setEnglishSubtitleContent(result);
            showFeedback("Generated!");
        } catch (e) { showFeedback("Failed."); } finally { setIsEnglishSubtitleLoading(false); }
    };
    const handleEnglishSubtitleOpen = useCallback(() => handleSmartOpen(englishSubtitleContent, setEnglishSubtitleContent, setIsEnglishSubtitleLoading, englishSubtitleFileInputRef, false), [englishSubtitleContent]);
    const handleEnglishSubtitleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, englishSubtitleContent, setEnglishSubtitleContent, setIsEnglishSubtitleLoading, false);
    const handleEnglishSubtitleSave = () => handleSmartSave(englishSubtitleContent, getCustomFilename(projectName, 'English Subtitle'));
    const handleEnglishSubtitleCopy = () => { navigator.clipboard.writeText(englishSubtitleContent); showFeedback('Copied!'); };
    const handleEnglishSubtitleClear = () => { setEnglishSubtitleContent(''); showFeedback('Cleared.'); };

    // YouTube Channel Name
    const handleYouTubeChannelNameCopy = () => { navigator.clipboard.writeText(youTubeChannelName); showFeedback('Copied!'); };
    const handleYouTubeChannelNameClear = () => { setYouTubeChannelName(''); showFeedback('Cleared.'); };

    // Link to Channel
    const handleLinkToChannelOpen = useCallback(() => handleSmartOpen(linkToChannelContent, setLinkToChannelContent, () => {}, linkToChannelFileInputRef, false), [linkToChannelContent]);
    const handleLinkToChannelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, linkToChannelContent, setLinkToChannelContent, () => {}, false);
    const handleLinkToChannelSave = () => {
        const channelName = youTubeChannelName.trim() || 'Untitled';
        handleSmartSave(linkToChannelContent, `Link to channel - ${channelName}.txt`);
    };
    const handleLinkToChannelCopy = () => { navigator.clipboard.writeText(linkToChannelContent); showFeedback('Copied!'); };
    const handleLinkToChannelClear = () => { setLinkToChannelContent(''); showFeedback('Cleared.'); };

    // YouTube Channel Description
    const handleYouTubeDescriptionOpen = useCallback(() => handleSmartOpen(youTubeDescription, setYouTubeDescription, () => {}, descriptionFileInputRef, false), [youTubeDescription]);
    const handleYouTubeDescriptionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, youTubeDescription, setYouTubeDescription, () => {}, false);
    const handleYouTubeDescriptionSave = () => {
        const channelName = youTubeChannelName.trim() || 'Untitled';
        handleSmartSave(youTubeDescription, `description - ${channelName}.txt`);
    };
    const handleYouTubeDescriptionCopy = () => { navigator.clipboard.writeText(youTubeDescription); showFeedback('Copied!'); };
    const handleYouTubeDescriptionClear = () => { setYouTubeDescription(''); showFeedback('Cleared.'); };

    // YouTube Channel Tags
    const handleYouTubeTagsOpen = useCallback(() => handleSmartOpen(youTubeTags, setYouTubeTags, () => {}, tagsFileInputRef, false), [youTubeTags]);
    const handleYouTubeTagsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, youTubeTags, setYouTubeTags, () => {}, false);
    const handleYouTubeTagsSave = () => {
        const channelName = youTubeChannelName.trim() || 'Untitled';
        handleSmartSave(youTubeTags, `tags - channel - ${channelName}.txt`);
    };
    const handleYouTubeTagsCopy = () => { navigator.clipboard.writeText(youTubeTags); showFeedback('Copied!'); };
    const handleYouTubeTagsClear = () => { setYouTubeTags(''); showFeedback('Cleared.'); };

    // Target Group
    const handleTargetGroupOpen = useCallback(() => handleSmartOpen(targetGroupContent, setTargetGroupContent, () => {}, targetGroupFileInputRef, false), [targetGroupContent]);
    const handleTargetGroupFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, targetGroupContent, setTargetGroupContent, () => {}, false);
    const handleTargetGroupSave = () => {
        const channelName = youTubeChannelName.trim() || 'Untitled';
        handleSmartSave(targetGroupContent, `Target Group - ${channelName}.txt`);
    };
    const handleTargetGroupCopy = () => { navigator.clipboard.writeText(targetGroupContent); showFeedback('Copied!'); };
    const handleTargetGroupClear = () => { setTargetGroupContent(''); showFeedback('Cleared.'); };

    // YouTube Hook
    const handleGenerateHook = async () => {
        if (!englishScriptContent || !videoScriptContent) { showFeedback("Requires scripts."); return; }
        setIsHookLoading(true);
        try {
            const hook = await generateYouTubeHook(youTubeChannelName, youTubeDescription, youTubeTags, targetGroupContent, englishScriptContent, videoScriptContent, textModel);
            setHookContent(hook);
            showFeedback("Generated!");
        } catch (e) { showFeedback("Failed."); } finally { setIsHookLoading(false); }
    };
    const handleHookOpen = useCallback(() => handleSmartOpen(hookContent, setHookContent, setIsHookLoading, hookFileInputRef, false), [hookContent]);
    const handleHookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, hookContent, setHookContent, setIsHookLoading, false);
    const handleHookSave = () => handleSmartSave(hookContent, getCustomFilename(projectName, 'ท่อน Hook สำหรับ YouTube Video Clip'));
    const handleHookCopy = () => { navigator.clipboard.writeText(hookContent); showFeedback('Copied!'); };
    const handleHookClear = () => { setHookContent(''); showFeedback('Cleared.'); };

    // YouTube Title
    const handleGenerateTitle = async () => {
        if (!englishScriptContent || !videoScriptContent || !hookContent) { showFeedback("Missing info."); return; }
        setIsTitleLoading(true);
        try {
            const title = await generateYouTubeTitle(youTubeChannelName, youTubeDescription, youTubeTags, targetGroupContent, englishScriptContent, videoScriptContent, hookContent, textModel);
            setTitleContent(title);
            showFeedback("Generated!");
        } catch (e) { showFeedback("Failed."); } finally { setIsTitleLoading(false); }
    };
    const handleTitleOpen = useCallback(() => handleSmartOpen(titleContent, setTitleContent, setIsTitleLoading, titleFileInputRef, false), [titleContent]);
    const handleTitleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, titleContent, setTitleContent, setIsTitleLoading, false);
    const handleTitleSave = () => handleSmartSave(titleContent, getCustomFilename(projectName, 'YouTube Video Clip Title (Clip Name)'));
    const handleTitleCopy = () => { navigator.clipboard.writeText(titleContent); showFeedback('Copied!'); };
    const handleTitleClear = () => { setTitleContent(''); showFeedback('Cleared.'); };

    // YouTube Video Description
    const handleGenerateVideoDescription = async () => {
        if (!englishScriptContent || !videoScriptContent || !hookContent || !titleContent) { showFeedback("Missing info."); return; }
        setIsVideoDescriptionLoading(true);
        try {
            const desc = await generateVideoDescription(youTubeChannelName, youTubeDescription, youTubeTags, targetGroupContent, englishScriptContent, videoScriptContent, hookContent, titleContent, linkToChannelContent, textModel);
            setVideoDescriptionContent(desc);
            showFeedback("Generated!");
        } catch (e) { showFeedback("Failed."); } finally { setIsVideoDescriptionLoading(false); }
    };
    const handleVideoDescriptionOpen = useCallback(() => handleSmartOpen(videoDescriptionContent, setVideoDescriptionContent, setIsVideoDescriptionLoading, videoDescriptionFileInputRef, false), [videoDescriptionContent]);
    const handleVideoDescriptionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, videoDescriptionContent, setVideoDescriptionContent, setIsVideoDescriptionLoading, false);
    const handleVideoDescriptionSave = () => handleSmartSave(videoDescriptionContent, getCustomFilename(projectName, 'YouTube Video Clip Description 5,000 charactors​'));
    const handleVideoDescriptionCopy = () => { navigator.clipboard.writeText(videoDescriptionContent); showFeedback('Copied!'); };
    const handleVideoDescriptionClear = () => { setVideoDescriptionContent(''); showFeedback('Cleared.'); };

    // YouTube Video Tags
    const handleGenerateVideoTags = async () => {
        if (!englishScriptContent || !videoScriptContent || !hookContent || !titleContent || !videoDescriptionContent) { showFeedback("Missing info."); return; }
        setIsVideoTagsLoading(true);
        try {
            const tags = await generateVideoTags(youTubeChannelName, youTubeDescription, youTubeTags, linkToChannelContent, targetGroupContent, englishScriptContent, videoScriptContent, hookContent, titleContent, videoDescriptionContent, textModel);
            setVideoTagsContent(tags);
            showFeedback("Generated!");
        } catch (e) { showFeedback("Failed."); } finally { setIsVideoTagsLoading(false); }
    };
    const handleVideoTagsOpen = useCallback(() => handleSmartOpen(videoTagsContent, setVideoTagsContent, setIsVideoTagsLoading, videoTagsFileInputRef, false), [videoTagsContent]);
    const handleVideoTagsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, videoTagsContent, setVideoTagsContent, setIsVideoTagsLoading, false);
    const handleVideoTagsSave = () => handleSmartSave(videoTagsContent, getCustomFilename(projectName, 'YouTube Video Clip Tags 500 charactors'));
    const handleVideoTagsCopy = () => { navigator.clipboard.writeText(videoTagsContent); showFeedback('Copied!'); };
    const handleVideoTagsClear = () => { setVideoTagsContent(''); showFeedback('Cleared.'); };

    // YouTube Thumbnail Caption
    const handleGenerateThumbnailCaption = async () => {
        if (!englishScriptContent || !videoScriptContent || !hookContent || !titleContent || !videoDescriptionContent || !videoTagsContent) { showFeedback("Missing info."); return; }
        setIsThumbnailCaptionLoading(true);
        try {
            const caption = await generateThumbnailCaption(youTubeChannelName, youTubeDescription, youTubeTags, linkToChannelContent, targetGroupContent, englishScriptContent, videoScriptContent, hookContent, titleContent, videoDescriptionContent, videoTagsContent, textModel);
            setThumbnailCaptionContent(caption);
            showFeedback("Generated!");
        } catch (e) { showFeedback("Failed."); } finally { setIsThumbnailCaptionLoading(false); }
    };
    const handleThumbnailCaptionOpen = useCallback(() => handleSmartOpen(thumbnailCaptionContent, setThumbnailCaptionContent, setIsThumbnailCaptionLoading, thumbnailCaptionFileInputRef, false), [thumbnailCaptionContent]);
    const handleThumbnailCaptionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, thumbnailCaptionContent, setThumbnailCaptionContent, setIsThumbnailCaptionLoading, false);
    const handleThumbnailCaptionSave = () => handleSmartSave(thumbnailCaptionContent, getCustomFilename(projectName, 'YouTube Video Clip Thumbnail​ Caption'));
    const handleThumbnailCaptionCopy = () => { navigator.clipboard.writeText(thumbnailCaptionContent); showFeedback('Copied!'); };
    const handleThumbnailCaptionClear = () => { setThumbnailCaptionContent(''); showFeedback('Cleared.'); };

    // YouTube Thumbnail Guidance
    const handleThumbnailGuidanceOpen = useCallback(() => handleSmartOpen(thumbnailGuidanceContent, setThumbnailGuidanceContent, () => {}, thumbnailGuidanceFileInputRef, false), [thumbnailGuidanceContent]);
    const handleThumbnailGuidanceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, thumbnailGuidanceContent, setThumbnailGuidanceContent, () => {}, false);
    const handleThumbnailGuidanceSave = () => handleSmartSave(thumbnailGuidanceContent, getCustomFilename(projectName, 'YouTube Video Clip Thumbnail​ Guidance'));
    const handleThumbnailGuidanceCopy = () => { navigator.clipboard.writeText(thumbnailGuidanceContent); showFeedback('Copied!'); };
    const handleThumbnailGuidanceClear = () => { setThumbnailGuidanceContent(''); showFeedback('Cleared.'); };

    // YouTube Thumbnail Prompt
    const handleGenerateThumbnailPrompt = async () => {
        if (!englishScriptContent || !videoScriptContent || !hookContent || !titleContent || !videoDescriptionContent || !videoTagsContent || !thumbnailCaptionContent) { showFeedback("Missing info."); return; }
        setIsThumbnailPromptLoading(true);
        try {
            // Updated call with thumbnailGuidanceContent
            const prompt = await generateThumbnailPrompt(
                youTubeChannelName, 
                youTubeDescription, 
                youTubeTags, 
                linkToChannelContent, 
                targetGroupContent, 
                englishScriptContent, 
                videoScriptContent, 
                hookContent, 
                titleContent, 
                videoDescriptionContent, 
                videoTagsContent, 
                thumbnailCaptionContent,
                thumbnailGuidanceContent,
                textModel
            );
            setThumbnailPromptContent(prompt);
            showFeedback("Generated!");
        } catch (e) { showFeedback("Failed."); } finally { setIsThumbnailPromptLoading(false); }
    };
    const handleThumbnailPromptOpen = useCallback(() => handleSmartOpen(thumbnailPromptContent, setThumbnailPromptContent, setIsThumbnailPromptLoading, thumbnailPromptFileInputRef, false), [thumbnailPromptContent]);
    const handleThumbnailPromptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, thumbnailPromptContent, setThumbnailPromptContent, setIsThumbnailPromptLoading, false);
    const handleThumbnailPromptSave = () => handleSmartSave(thumbnailPromptContent, getCustomFilename(projectName, 'YouTube Video Clip Thumbnail​ Prompt'));
    const handleThumbnailPromptCopy = () => { navigator.clipboard.writeText(thumbnailPromptContent); showFeedback('Copied!'); };
    const handleThumbnailPromptClear = () => { setThumbnailPromptContent(''); showFeedback('Cleared.'); };

    // Thumbnail Image
    const handleCreateThumbnailImage = async () => {
        if (!thumbnailPromptContent) { showFeedback("No prompt to generate image."); return; }
        setIsCreatingImage(true);
        setThumbnailImage(null);
        try {
            const imageBase64 = await generateThumbnailImage(thumbnailPromptContent, imageModel);
            setThumbnailImage(imageBase64);
            showFeedback("Image Generated!");
        } catch (error) {
            console.error(error);
            showFeedback("Image generation failed.");
        } finally {
            setIsCreatingImage(false);
        }
    };
    
    // Updated to handle both direct blob saving and dataURL saving from the editor (for overlay)
    const handleSaveThumbnailImage = (finalImageData?: string) => {
        const imageToSave = finalImageData || thumbnailImage;
        if (!imageToSave) return;

        const formattedProjectName = projectName || `UntitledProject`;
        const link = document.createElement('a');
        link.href = imageToSave;
        link.download = `${formattedProjectName} YouTube Video Clip Thumbnail.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showFeedback("Image Saved!");
    };

    // Consulting Chat Handlers
    const handleConsultingAttach = (name: string, content: string) => {
        setConsultingAttachedFileName(name);
        setConsultingAttachedFileContent(content);
        showFeedback(`Attached: ${name}`);
    };

    const handleConsultingSend = async () => {
        if (!consultingPromptContent.trim()) {
            showFeedback("Prompt cannot be empty.");
            return;
        }
        setIsConsultingLoading(true);

        // Combine prompt with attached file content (if exists) invisibly for the API
        let finalPromptToSend = consultingPromptContent;
        if (consultingAttachedFileContent) {
            finalPromptToSend = `${consultingPromptContent}\n\n--- Attached File Reference: ${consultingAttachedFileName} ---\n${consultingAttachedFileContent}\n-----------------------------------`;
        }

        try {
            const response = await generateConsultingResponse(
                youTubeChannelName, youTubeDescription, youTubeTags, linkToChannelContent, targetGroupContent,
                audioScriptContent, videoScriptContent, hookContent, titleContent, videoDescriptionContent,
                videoTagsContent, thumbnailCaptionContent, thumbnailPromptContent, chatHistoryContent, finalPromptToSend,
                textModel
            );
            
            // In chat history, we only show the user's visible prompt + attachment indicator
            let displayPrompt = consultingPromptContent;
            if (consultingAttachedFileName) {
                displayPrompt += `\n[แนบไฟล์: ${consultingAttachedFileName}]`;
            }

            const newEntry = `ถาม : ${displayPrompt}\nตอบ : ${response}\n\n`;
            setChatHistoryContent(prev => prev + newEntry);
            setConsultingPromptContent(''); // Clear prompt input after success
            
            // Clear attachment after sending
            setConsultingAttachedFileName(null);
            setConsultingAttachedFileContent(null);
            
            showFeedback("Consultant Responded!");
        } catch (error) {
            console.error(error);
            showFeedback("Failed to get response.");
        } finally {
            setIsConsultingLoading(false);
        }
    };

    const handleChatHistoryOpen = useCallback(() => handleSmartOpen(chatHistoryContent, setChatHistoryContent, () => {}, chatHistoryFileInputRef, false), [chatHistoryContent]);
    const handleChatHistoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, chatHistoryContent, setChatHistoryContent, () => {}, false);
    const handleChatHistorySave = () => handleSmartSave(chatHistoryContent, getCustomFilename(projectName, 'chat history'));
    const handleChatHistoryCopy = () => { navigator.clipboard.writeText(chatHistoryContent); showFeedback('Copied!'); };
    const handleChatHistoryClear = () => { setChatHistoryContent(''); showFeedback('Cleared.'); };

    const handleConsultingPromptOpen = useCallback(() => handleSmartOpen(consultingPromptContent, setConsultingPromptContent, () => {}, consultingPromptFileInputRef, false), [consultingPromptContent]);
    const handleConsultingPromptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, consultingPromptContent, setConsultingPromptContent, () => {}, false);
    const handleConsultingPromptSave = () => handleSmartSave(consultingPromptContent, getCustomFilename(projectName, 'Consulting Prompt'));
    const handleConsultingPromptCopy = () => { navigator.clipboard.writeText(consultingPromptContent); showFeedback('Copied!'); };
    const handleConsultingPromptClear = () => { setConsultingPromptContent(''); showFeedback('Cleared.'); };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col p-4 sm:p-6 lg:p-8">
        {/* API Key Control Panel  */}
              <div className="max-w-8xl mx-auto mt-4 px-4">
                      <div className="p-4 bg-slate-900 border border-emerald-500/20 rounded-2xl shadow-2xl">
                                <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest ml-1">
                                                          API Key Control Panel :
                                                                      </label>
                                                                                  <div className="flex flex-wrap md:flex-nowrap gap-2">
                                                                                                <input
                                                                                                                type="text"
                                                                                                                                value={inputKey}
                                                                                                                                                onChange={(e) => setInputKey(e.target.value)}
                                                                                                                                                                className="w-full flex-1 bg-black/50 border border-slate-700 rounded-xl px-4 py-2 text-sm font-mono text-emerald-400 outline-none focus:border-emerald-500/50 transition-all"
                                                                                                                                                                                placeholder="กรอก API Key ตรงนี้..."
                                                                                                                                                                                              />
                                                                                                                                                                                                            <div className="flex gap-2 w-full md:w-auto">
                                                                                                                                                                                                                            <button onClick={handleSendKey} className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-emerald-900/20">
                                                                                                                                                                                                                                              SEND
                                                                                                                                                                                                                                                              </button>
                                                                                                                                                                                                                                                                              <button onClick={() => { navigator.clipboard.writeText(inputKey); alert("Copy แล้วครับ"); }} className="bg-slate-800 hover:bg-slate-700 text-white text-xs py-2 px-4 rounded-xl transition-all">
                                                                                                                                                                                                                                                                                                COPY
                                                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                                                                                <button onClick={() => { localStorage.removeItem('gemini_api_key'); setInputKey(''); alert("ลบ Key แล้วครับ"); }} className="bg-slate-800 hover:text-red-400 text-white text-xs py-2 px-4 rounded-xl transition-all">
                                                                                                                                                                                                                                                                                                                                                  CLEAR
                                                                                                                                                                                                                                                                                                                                                                  </button>
                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
            <h1 className="text-3xl font-bold text-center text-gray-100 mb-6">
                AI Script Integrator v.2
            </h1>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Header
                    id="projectName"
                    label="Project Name"
                    projectName={projectName}
                    onProjectNameChange={setProjectName}
                    placeholder="e.g., Lecture_Week1_TopicA"
                />
                <div className="flex flex-col">
                    <label htmlFor="textModelSelect" className="block text-sm font-medium text-gray-400 mb-1">
                        Text Reasoning Model (โมเดลประมวลผลข้อความ)
                    </label>
                    <select
                        id="textModelSelect"
                        value={textModel}
                        onChange={(e) => setTextModel(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Default)</option>
                        <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                        <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
                        <option value="gemini-flash-latest">Gemini Flash Latest</option>
                        <option value="gemini-flash-lite-latest">Gemini Flash Lite Latest</option>
                    </select>
                </div>
            </div>

            {/* Hidden Input Fields for Fallback File Loading */}
            <input type="file" ref={audioFileInputRef} className="hidden" accept=".txt" onChange={handleAudioFileChange} />
            <input type="file" ref={videoFileInputRef} className="hidden" accept=".txt" onChange={handleVideoFileChange} />
            <input type="file" ref={combinedFileInputRef} className="hidden" accept=".txt" onChange={handleCombinedFileChange} />
            <input type="file" ref={englishFileInputRef} className="hidden" accept=".txt" onChange={handleEnglishFileChange} />
            <input type="file" ref={englishThaiFileInputRef} className="hidden" accept=".txt" onChange={handleEnglishThaiFileChange} />
            <input type="file" ref={englishSubtitleFileInputRef} className="hidden" accept=".txt" onChange={handleEnglishSubtitleFileChange} />
            <input type="file" ref={linkToChannelFileInputRef} className="hidden" accept=".txt" onChange={handleLinkToChannelFileChange} />
            <input type="file" ref={descriptionFileInputRef} className="hidden" accept=".txt" onChange={handleYouTubeDescriptionFileChange} />
            <input type="file" ref={tagsFileInputRef} className="hidden" accept=".txt" onChange={handleYouTubeTagsFileChange} />
            <input type="file" ref={targetGroupFileInputRef} className="hidden" accept=".txt" onChange={handleTargetGroupFileChange} />
            <input type="file" ref={hookFileInputRef} className="hidden" accept=".txt" onChange={handleHookFileChange} />
            <input type="file" ref={titleFileInputRef} className="hidden" accept=".txt" onChange={handleTitleFileChange} />
            <input type="file" ref={videoDescriptionFileInputRef} className="hidden" accept=".txt" onChange={handleVideoDescriptionFileChange} />
            <input type="file" ref={videoTagsFileInputRef} className="hidden" accept=".txt" onChange={handleVideoTagsFileChange} />
            <input type="file" ref={thumbnailCaptionFileInputRef} className="hidden" accept=".txt" onChange={handleThumbnailCaptionFileChange} />
            <input type="file" ref={thumbnailGuidanceFileInputRef} className="hidden" accept=".txt" onChange={handleThumbnailGuidanceFileChange} />
            <input type="file" ref={thumbnailPromptFileInputRef} className="hidden" accept=".txt" onChange={handleThumbnailPromptFileChange} />
            <input type="file" ref={chatHistoryFileInputRef} className="hidden" accept=".txt" onChange={handleChatHistoryFileChange} />
            <input type="file" ref={consultingPromptFileInputRef} className="hidden" accept=".txt" onChange={handleConsultingPromptFileChange} />


            {/* Feedback Message */}
            {feedbackMessage && (
                <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
                    {feedbackMessage}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 flex-grow mb-8">
                {/* Audio Script Column */}
                <div className="flex-1 flex flex-col">
                    <ScriptEditor
                        label="Audio Script (spoken text) with timestamp"
                        content={audioScriptContent}
                        onContentChange={setAudioScriptContent}
                        isLoading={isAudioLoading}
                        onOpen={handleAudioOpen}
                        onSave={handleAudioSave}
                        onCopy={handleAudioCopy}
                        onClear={handleAudioClear}
                    />
                </div>

                {/* Video Script Column */}
                <div className="flex-1 flex flex-col">
                    <ScriptEditor
                        label="Video Script (on-screen text) with timestamp"
                        content={videoScriptContent}
                        onContentChange={setVideoScriptContent}
                        isLoading={isVideoLoading}
                        onOpen={handleVideoOpen}
                        onSave={handleVideoSave}
                        onCopy={handleVideoCopy}
                        onClear={handleVideoClear}
                    />
                </div>
            </div>

            {/* Combined Script Section */}
            <div className="w-full mb-8">
                 <CombinedEditor
                    content={combinedScriptContent}
                    onContentChange={setCombinedScriptContent}
                    isLoading={isCombining}
                    onCombine={handleCombine}
                    onOpen={handleCombinedOpen}
                    onSave={handleCombinedSave}
                    onCopy={handleCombinedCopy}
                    onClear={handleCombinedClear}
                 />
            </div>

            {/* English Script No Timestamp Section */}
            <div className="w-full mb-8">
                <EnglishScriptEditor
                    content={englishScriptContent}
                    onContentChange={setEnglishScriptContent}
                    onGenerate={handleGenerateEnglish}
                    onOpen={handleEnglishOpen}
                    onSave={handleEnglishSave}
                    onCopy={handleEnglishCopy}
                    onClear={handleEnglishClear}
                />
            </div>

            {/* English - Thai Audio Script Section */}
            <div className="w-full mb-8">
                <EnglishThaiScriptEditor
                    content={englishThaiScriptContent}
                    onContentChange={setEnglishThaiScriptContent}
                    isLoading={isEnglishThaiLoading}
                    onGenerate={handleGenerateEnglishThai}
                    onOpen={handleEnglishThaiOpen}
                    onSave={handleEnglishThaiSave}
                    onCopy={handleEnglishThaiCopy}
                    onClear={handleEnglishThaiClear}
                />
            </div>

            {/* English Subtitle Section */}
             <div className="w-full mb-8">
                <EnglishSubtitleEditor
                    content={englishSubtitleContent}
                    onContentChange={setEnglishSubtitleContent}
                    isLoading={isEnglishSubtitleLoading}
                    onGenerate={handleGenerateEnglishSubtitle}
                    onOpen={handleEnglishSubtitleOpen}
                    onSave={handleEnglishSubtitleSave}
                    onCopy={handleEnglishSubtitleCopy}
                    onClear={handleEnglishSubtitleClear}
                />
            </div>

            {/* YouTube Channel Name Section */}
            <div className="w-full mb-8">
                <YouTubeChannelNameEditor
                    content={youTubeChannelName}
                    onContentChange={setYouTubeChannelName}
                    onCopy={handleYouTubeChannelNameCopy}
                    onClear={handleYouTubeChannelNameClear}
                />
            </div>

            {/* Link to Channel Section */}
            <div className="w-full mb-8">
                <LinkToChannelEditor
                    content={linkToChannelContent}
                    onContentChange={setLinkToChannelContent}
                    onOpen={handleLinkToChannelOpen}
                    onSave={handleLinkToChannelSave}
                    onCopy={handleLinkToChannelCopy}
                    onClear={handleLinkToChannelClear}
                />
            </div>

            {/* YouTube Channel Description Section */}
            <div className="w-full mb-8">
                <YouTubeDescriptionEditor
                    content={youTubeDescription}
                    onContentChange={setYouTubeDescription}
                    onOpen={handleYouTubeDescriptionOpen}
                    onSave={handleYouTubeDescriptionSave}
                    onCopy={handleYouTubeDescriptionCopy}
                    onClear={handleYouTubeDescriptionClear}
                />
            </div>

            {/* YouTube Channel Tags Section */}
            <div className="w-full mb-8">
                <YouTubeTagsEditor
                    content={youTubeTags}
                    onContentChange={setYouTubeTags}
                    onOpen={handleYouTubeTagsOpen}
                    onSave={handleYouTubeTagsSave}
                    onCopy={handleYouTubeTagsCopy}
                    onClear={handleYouTubeTagsClear}
                />
            </div>

            {/* Target Group Section */}
            <div className="w-full mb-8">
                <TargetGroupEditor
                    content={targetGroupContent}
                    onContentChange={setTargetGroupContent}
                    onOpen={handleTargetGroupOpen}
                    onSave={handleTargetGroupSave}
                    onCopy={handleTargetGroupCopy}
                    onClear={handleTargetGroupClear}
                />
            </div>

            {/* Hook Section */}
            <div className="w-full mb-8">
                <HookEditor
                    content={hookContent}
                    onContentChange={setHookContent}
                    isLoading={isHookLoading}
                    onGenerate={handleGenerateHook}
                    onOpen={handleHookOpen}
                    onSave={handleHookSave}
                    onCopy={handleHookCopy}
                    onClear={handleHookClear}
                />
            </div>

            {/* Title Section */}
            <div className="w-full mb-8">
                <TitleEditor
                    content={titleContent}
                    onContentChange={setTitleContent}
                    isLoading={isTitleLoading}
                    onGenerate={handleGenerateTitle}
                    onOpen={handleTitleOpen}
                    onSave={handleTitleSave}
                    onCopy={handleTitleCopy}
                    onClear={handleTitleClear}
                />
            </div>

            {/* Video Description Section */}
            <div className="w-full mb-8">
                <Description5000Editor
                    content={videoDescriptionContent}
                    onContentChange={setVideoDescriptionContent}
                    isLoading={isVideoDescriptionLoading}
                    onGenerate={handleGenerateVideoDescription}
                    onOpen={handleVideoDescriptionOpen}
                    onSave={handleVideoDescriptionSave}
                    onCopy={handleVideoDescriptionCopy}
                    onClear={handleVideoDescriptionClear}
                />
            </div>

            {/* Video Tags Section */}
            <div className="w-full mb-8">
                <VideoTagsEditor
                    content={videoTagsContent}
                    onContentChange={setVideoTagsContent}
                    isLoading={isVideoTagsLoading}
                    onGenerate={handleGenerateVideoTags}
                    onOpen={handleVideoTagsOpen}
                    onSave={handleVideoTagsSave}
                    onCopy={handleVideoTagsCopy}
                    onClear={handleVideoTagsClear}
                />
            </div>

            {/* Thumbnail Caption Section */}
            <div className="w-full mb-8">
                <ThumbnailCaptionEditor
                    content={thumbnailCaptionContent}
                    onContentChange={setThumbnailCaptionContent}
                    isLoading={isThumbnailCaptionLoading}
                    onGenerate={handleGenerateThumbnailCaption}
                    onOpen={handleThumbnailCaptionOpen}
                    onSave={handleThumbnailCaptionSave}
                    onCopy={handleThumbnailCaptionCopy}
                    onClear={handleThumbnailCaptionClear}
                />
            </div>

            {/* Thumbnail Guidance Section */}
            <div className="w-full mb-8">
                <ThumbnailGuidanceEditor
                    content={thumbnailGuidanceContent}
                    onContentChange={setThumbnailGuidanceContent}
                    onOpen={handleThumbnailGuidanceOpen}
                    onSave={handleThumbnailGuidanceSave}
                    onCopy={handleThumbnailGuidanceCopy}
                    onClear={handleThumbnailGuidanceClear}
                />
            </div>

            {/* Thumbnail Prompt Section */}
            <div className="w-full mb-8">
                <ThumbnailPromptEditor
                    content={thumbnailPromptContent}
                    onContentChange={setThumbnailPromptContent}
                    isLoading={isThumbnailPromptLoading}
                    onGenerate={handleGenerateThumbnailPrompt}
                    onOpen={handleThumbnailPromptOpen}
                    onSave={handleThumbnailPromptSave}
                    onCopy={handleThumbnailPromptCopy}
                    onClear={handleThumbnailPromptClear}
                    onCreateImage={handleCreateThumbnailImage}
                    isCreatingImage={isCreatingImage}
                    generatedImage={thumbnailImage}
                    onSaveImage={handleSaveThumbnailImage}
                    selectedModel={imageModel}
                    onModelChange={setImageModel}
                    caption={thumbnailCaptionContent} // Pass caption here
                />
            </div>

            {/* Consulting Chat Section */}
            <div className="w-full mb-8">
                <ConsultingChatEditor 
                    chatContent={chatHistoryContent}
                    onChatContentChange={setChatHistoryContent}
                    onChatOpen={handleChatHistoryOpen}
                    onChatSave={handleChatHistorySave}
                    onChatCopy={handleChatHistoryCopy}
                    onChatClear={handleChatHistoryClear}
                    promptContent={consultingPromptContent}
                    onPromptContentChange={setConsultingPromptContent}
                    onPromptOpen={handleConsultingPromptOpen}
                    onPromptSave={handleConsultingPromptSave}
                    onPromptCopy={handleConsultingPromptCopy}
                    onPromptClear={handleConsultingPromptClear}
                    onSend={handleConsultingSend}
                    isLoading={isConsultingLoading}
                    onAttachFile={handleConsultingAttach}
                    attachedFileName={consultingAttachedFileName}
                />
            </div>

        </div>
    );
};

export default App;
