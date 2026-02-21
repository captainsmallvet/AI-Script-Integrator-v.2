
import React from 'react';
import { ClearIcon, GenerateIcon, CopyIcon, OpenIcon, SaveIcon } from './icons';

interface EnglishThaiScriptEditorProps {
    content: string;
    onContentChange: (content: string) => void;
    isLoading: boolean;
    onGenerate: () => void;
    onOpen: () => void;
    onSave: () => void;
    onCopy: () => void;
    onClear: () => void;
}

const EnglishThaiScriptEditor: React.FC<EnglishThaiScriptEditorProps> = ({ 
    content, 
    onContentChange,
    isLoading,
    onGenerate,
    onOpen,
    onSave,
    onCopy,
    onClear
}) => {
    const editorId = "english-thai-script-editor";
    const label = "English - Thai audio script";

    return (
        <div className="flex flex-col flex-grow w-full">
            <label htmlFor={editorId} className="mb-2 text-lg font-semibold text-gray-300">
                {label}
            </label>
            <div className="flex items-center justify-start gap-2 flex-wrap mb-4">
                <ActionButton onClick={onGenerate} disabled={isLoading} icon={isLoading ? <Spinner/> : <GenerateIcon />} text={isLoading ? "Generating..." : "Generate"} />
                <ActionButton onClick={onOpen} disabled={isLoading} icon={<OpenIcon />} text="Open" />
                <ActionButton onClick={onSave} disabled={isLoading} icon={<SaveIcon />} text="Save" />
                <ActionButton onClick={onCopy} disabled={isLoading} icon={<CopyIcon />} text="Copy" />
                <ActionButton onClick={onClear} disabled={isLoading} icon={<ClearIcon />} text="Clear" />
            </div>
            <div className="relative w-full">
                <textarea
                    id={editorId}
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    placeholder="Click 'Generate' to translate the English script above into an English-Thai format, or open a .txt file."
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

const Spinner = () => (
    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
);

export default EnglishThaiScriptEditor;
