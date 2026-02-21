
import React, { useRef } from 'react';
import { ClearIcon, CopyIcon, OpenIcon, SaveIcon, SendIcon, GenerateIcon, CombineIcon, AttachIcon, VoiceIcon } from './icons';

interface ConsultingChatEditorProps {
    // Chat History Props
    chatContent: string;
    onChatContentChange: (content: string) => void;
    onChatOpen: () => void;
    onChatSave: () => void;
    onChatCopy: () => void;
    onChatClear: () => void;

    // Prompt Props
    promptContent: string;
    onPromptContentChange: (content: string) => void;
    onPromptOpen: () => void;
    onPromptSave: () => void;
    onPromptCopy: () => void;
    onPromptClear: () => void;
    
    // Action Props
    onSend: () => void;
    isLoading: boolean;
    
    // Attachment Props
    onAttachFile: (name: string, content: string) => void;
    attachedFileName: string | null;
}

const ConsultingChatEditor: React.FC<ConsultingChatEditorProps> = ({ 
    chatContent,
    onChatContentChange,
    onChatOpen,
    onChatSave,
    onChatCopy,
    onChatClear,
    promptContent,
    onPromptContentChange,
    onPromptOpen,
    onPromptSave,
    onPromptCopy,
    onPromptClear,
    onSend,
    isLoading,
    onAttachFile,
    attachedFileName
}) => {
    const chatEditorId = "consulting-chat-history-editor";
    const promptEditorId = "consulting-prompt-editor";
    const promptLabel = "Consulting Prompt";
    const attachFileInputRef = useRef<HTMLInputElement>(null);

    const handleRecommendShortcut = () => {
        onPromptContentChange("ช่วยแนะนำด้วยครับว่าช่วงนี้ควรทำคลิปเรื่องอะไรดี ให้สอดคล้องกับ YouTube Channel ของผม และ Target Group น่าจะสนใจดู เข้ากับกระแสความสนใจของผู้คนในขณะนี้");
    };

    const handleAnalyzeHookShortcut = () => {
        onPromptContentChange(`ช่วยวิเคราะห์ เปรียบเทียบ และให้คะแนนในแง่ต่างๆ รวมถึงคะแนนโดยรวม ของ 'ท่อน Hook สำหรับ YouTube Video Clip' เหล่านี้ด้วยครับ และช่วยแนะนำด้วยครับว่าควรจะเลือกอันไหน หรือควรปรับแต่งอย่างไร เพื่อให้ได้ผลลัพธ์ที่เหมาะสมที่สุด มีประสิทธิภาพมากที่สุด :
1. xxx
2. yyy
3. zzz`);
    };

    const handleAnalyzeTitleShortcut = () => {
        onPromptContentChange(`ช่วยวิเคราะห์ เปรียบเทียบ และให้คะแนนในแง่ต่างๆ รวมถึงคะแนนโดยรวม ของ 'YouTube Video Clip Title (Clip Name)' เหล่านี้ด้วยครับ และช่วยแนะนำด้วยครับว่าควรจะเลือกอันไหน หรือควรปรับแต่งอย่างไร เพื่อให้ได้ผลลัพธ์ที่เหมาะสมที่สุด มีประสิทธิภาพมากที่สุด :
1. xxx
2. yyy
3. zzz`);
    };

    const handleCompareShortcut = () => {
        onPromptContentChange(`ช่วยวิเคราะห์ เปรียบเทียบ และให้คะแนนในแง่ต่างๆ รวมถึงคะแนนโดยรวม ของ 'YouTube Video Clip Thumbnail Caption' เหล่านี้ด้วยครับ และช่วยแนะนำด้วยครับว่าควรจะเลือกอันไหน หรือควรปรับแต่งอย่างไร เพื่อให้ได้ผลลัพธ์ที่เหมาะสมที่สุด มีประสิทธิภาพมากที่สุด :
1. xxx
2. yyy
3. zzz`);
    };

    const handleCreateVoiceoverShortcut = () => {
        onPromptContentChange("ช่วยแปลและเรียบเรียงบทความในไฟล์แนบนี้ จากภาษาในต้นฉบับให้เป็นภาษาอังกฤษ แล้วสร้าง Voiceover Script ให้เหมาะกับการทำคลิปสำหรับ YouTube ​ตามบริบทของ YouTube Channel นี้ รวมถึง Target Group ของช่องนี้ ด้วยครับ โดยเป็นเฉพาะบทพูดล้วนๆ ของคนพูดคนเดียว ไม่มีอย่างอื่นประกอบ (เช่น บรรยายท่าทาง อารมณ์ บรรยากาศ น้ำเสียง) โดยเป็นการเอาข้อมูล เนื้อหาสาระ ความรู้ จากบทความต้นฉบับ มาพูด อธิบาย นำเสนอ ให้ผู้ชมคลิปทาง YouTube​ ฟัง ในรูปแบบ ขั้นตอนการนำเสนอ (ที่อาจมีการปรับปรุง เรียบเรียง จัดลำดับใหม่ หรือเพิ่มเติมข้อความเพื่อเพิ่มความน่าสนใจ หรือเพิ่มความสมบูรณ์ของเนื้อหา) ให้เหมาะสมกับการทำคลิปสำหรับผู้สนใจทาง YouTube​ ด้วยครับ โดยพยายามทำให้คลิปที่ได้มีคุณภาพ น่าสนใจ น่าติดตาม เข้าใจง่าย ไม่วกวน และมีโอกาสเป็น viral ให้มากที่สุด โดยมีคำแนะนำในการสร้างคลิปอยู่ด้านบน แยกส่วนจากส่วน Voiceover Script อย่างชัดเจน");
    };

    const handleAttachClick = () => {
        attachFileInputRef.current?.click();
    };

    const handleAttachFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (text) {
               onAttachFile(file.name, text);
            }
        };
        reader.readAsText(file);
        
        // Reset input to allow selecting same file again if needed
        e.target.value = '';
    };

    return (
        <div className="flex flex-col flex-grow w-full gap-6">
            
            {/* Hidden Input for Attachment */}
            <input 
                type="file" 
                ref={attachFileInputRef} 
                onChange={handleAttachFileChange} 
                className="hidden" 
                accept=".txt" 
            />

            {/* Part 1: Chat History */}
            <div className="flex flex-col w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <label htmlFor={chatEditorId} className="text-lg font-semibold text-gray-300">
                        Chat History
                    </label>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <ActionButton onClick={onChatOpen} disabled={false} icon={<OpenIcon />} text="Open" />
                        <ActionButton onClick={onChatSave} disabled={false} icon={<SaveIcon />} text="Save" />
                        <ActionButton onClick={onChatCopy} disabled={false} icon={<CopyIcon />} text="Copy" />
                        <ActionButton onClick={onChatClear} disabled={false} icon={<ClearIcon />} text="Clear" />
                    </div>
                </div>
                <div className="relative w-full">
                    <textarea
                        id={chatEditorId}
                        value={chatContent}
                        onChange={(e) => onChatContentChange(e.target.value)}
                        placeholder="Chat history will appear here..."
                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-4 font-mono text-base text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
                        rows={10}
                        spellCheck="false"
                        aria-label="Chat History"
                    />
                </div>
            </div>

            {/* Part 2: Consulting Prompt */}
            <div className="flex flex-col w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <label htmlFor={promptEditorId} className="text-lg font-semibold text-gray-300">
                        {promptLabel}
                    </label>
                    <div className="flex items-center gap-2">
                        <ActionButton 
                            onClick={handleAttachClick} 
                            disabled={isLoading} 
                            icon={<AttachIcon />} 
                            text="แนบไฟล์" 
                        />
                        {attachedFileName && (
                            <span className="text-sm text-green-400 bg-gray-800 px-2 py-1 rounded border border-green-600 truncate max-w-[200px]">
                                {attachedFileName}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="relative w-full mb-4">
                    <textarea
                        id={promptEditorId}
                        value={promptContent}
                        onChange={(e) => onPromptContentChange(e.target.value)}
                        placeholder="Enter your prompt to consult with AI..."
                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-4 font-mono text-base text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
                        rows={4}
                        spellCheck="false"
                        aria-label={promptLabel}
                    />
                </div>

                {/* Bottom Controls */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-start gap-2 flex-wrap">
                        <ActionButton onClick={onSend} disabled={isLoading || !promptContent.trim()} icon={isLoading ? <Spinner/> : <SendIcon />} text={isLoading ? "Sending..." : "Send"} />
                        <ActionButton onClick={onPromptOpen} disabled={isLoading} icon={<OpenIcon />} text="Open" />
                        <ActionButton onClick={onPromptSave} disabled={isLoading} icon={<SaveIcon />} text="Save" />
                        <ActionButton onClick={onPromptCopy} disabled={isLoading} icon={<CopyIcon />} text="Copy" />
                        <ActionButton onClick={onPromptClear} disabled={isLoading} icon={<ClearIcon />} text="Clear" />
                    </div>
                    
                    {/* Shortcuts */}
                    <div className="flex items-center justify-start gap-2 flex-wrap pt-2">
                        <ActionButton 
                            onClick={handleRecommendShortcut} 
                            disabled={isLoading} 
                            icon={<GenerateIcon />} 
                            text="แนะนำคลิปใหม่" 
                        />
                        <ActionButton 
                            onClick={handleAnalyzeHookShortcut} 
                            disabled={isLoading} 
                            icon={<CombineIcon />} 
                            text="วิเคราะห์ท่อน Hook" 
                        />
                         <ActionButton 
                            onClick={handleAnalyzeTitleShortcut} 
                            disabled={isLoading} 
                            icon={<CombineIcon />} 
                            text="วิเคราะห์ Clip Name" 
                        />
                        <ActionButton 
                            onClick={handleCompareShortcut} 
                            disabled={isLoading} 
                            icon={<CombineIcon />} 
                            text="วิเคราะห์ Thumbnail Caption" 
                        />
                        <ActionButton 
                            onClick={handleCreateVoiceoverShortcut} 
                            disabled={isLoading} 
                            icon={<VoiceIcon />} 
                            text="Create Voiceover Script" 
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};


interface ActionButtonProps {
    onClick: () => void;
    disabled: boolean;
    icon: React.ReactNode;
    text: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled, icon, text }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
    >
        {icon}
        <span>{text}</span>
    </button>
);

const Spinner = () => (
    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
);

export default ConsultingChatEditor;
