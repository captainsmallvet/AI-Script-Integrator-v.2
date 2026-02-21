
import React from 'react';
import { ClearIcon, GenerateIcon, CopyIcon, OpenIcon, SaveIcon } from './icons';

interface EnglishScriptEditorProps {
    content: string;
    onContentChange: (content: string) => void;
    onGenerate: () => void;
    onOpen: () => void;
    onSave: () => void;
    onCopy: () => void;
    onClear: () => void;
}

const EnglishScriptEditor: React.FC<EnglishScriptEditorProps> = ({ 
    content, 
    onContentChange, 
    onGenerate,
    onOpen,
    onSave,
    onCopy,
    onClear
}) => {
    const editorId = "english-script-editor";
    const label = "English audio script no timestamp";

    return (
        <div className="flex flex-col flex-grow w-full">
            <label htmlFor={editorId} className="mb-1 text-lg font-semibold text-gray-300">
                {label}
            </label>
            <p className="text-yellow-400 text-sm mb-4">
                *** เพิ่ม 'ท่อน Hook สำหรับ YouTube Video Clip' เพื่อใช้เป็นบทพูดฉบับสมบูรณ์ ***
            </p>
            <div className="flex items-center justify-start gap-2 flex-wrap mb-4">
                <ActionButton onClick={onGenerate} disabled={false} icon={<GenerateIcon />} text="Generate" />
                <ActionButton onClick={onOpen} disabled={false} icon={<OpenIcon />} text="Open" />
                <ActionButton onClick={onSave} disabled={false} icon={<SaveIcon />} text="Save" />
                <ActionButton onClick={onCopy} disabled={false} icon={<CopyIcon />} text="Copy" />
                <ActionButton onClick={onClear} disabled={false} icon={<ClearIcon />} text="Clear" />
            </div>
            <div className="relative w-full">
                <textarea
                    id={editorId}
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    placeholder="Click 'Generate' to extract text from Audio Script, or open a text file."
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-4 font-mono text-base text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
                    rows={10}
                    spellCheck="false"
                    aria-label={`${label} editor`}
                />
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

export default EnglishScriptEditor;