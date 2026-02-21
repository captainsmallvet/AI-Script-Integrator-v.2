
import React from 'react';
import { ClearIcon, CopyIcon, GenerateIcon, OpenIcon, SaveIcon } from './icons';

interface ThumbnailCaptionEditorProps {
    content: string;
    onContentChange: (content: string) => void;
    isLoading: boolean;
    onGenerate: () => void;
    onOpen: () => void;
    onSave: () => void;
    onCopy: () => void;
    onClear: () => void;
}

const ThumbnailCaptionEditor: React.FC<ThumbnailCaptionEditorProps> = ({ 
    content, 
    onContentChange, 
    isLoading,
    onGenerate,
    onOpen,
    onSave,
    onCopy,
    onClear
}) => {
    const editorId = "thumbnail-caption-editor";
    const label = "YouTube Video Clip Thumbnail Caption";

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
                    placeholder="Click 'Generate' to create a catchy thumbnail caption..."
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-4 font-mono text-base text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
                    rows={4}
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

export default ThumbnailCaptionEditor;
