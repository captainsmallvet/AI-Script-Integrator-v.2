
import React from 'react';
import { ClearIcon, CopyIcon, OpenIcon, SaveIcon } from './icons';

interface ThumbnailGuidanceEditorProps {
    content: string;
    onContentChange: (content: string) => void;
    onOpen: () => void;
    onSave: () => void;
    onCopy: () => void;
    onClear: () => void;
}

const ThumbnailGuidanceEditor: React.FC<ThumbnailGuidanceEditorProps> = ({ 
    content, 
    onContentChange, 
    onOpen,
    onSave,
    onCopy,
    onClear
}) => {
    const editorId = "thumbnail-guidance-editor";
    const label = "YouTube Video Clip Thumbnail Guidance";

    return (
        <div className="flex flex-col flex-grow w-full">
            <label htmlFor={editorId} className="mb-2 text-lg font-semibold text-gray-300">
                {label}
            </label>
            <div className="flex items-center justify-start gap-2 flex-wrap mb-4">
                <ActionButton onClick={onOpen} icon={<OpenIcon />} text="Open" />
                <ActionButton onClick={onSave} icon={<SaveIcon />} text="Save" />
                <ActionButton onClick={onCopy} icon={<CopyIcon />} text="Copy" />
                <ActionButton onClick={onClear} icon={<ClearIcon />} text="Clear" />
            </div>
            <div className="relative w-full">
                <textarea
                    id={editorId}
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    placeholder="Enter thumbnail guidance details here..."
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-4 font-mono text-base text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
                    rows={5}
                    spellCheck="false"
                    aria-label={`${label} editor`}
                />
            </div>
        </div>
    );
};


interface ActionButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    text: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon, text }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
    >
        {icon}
        <span>{text}</span>
    </button>
);

export default ThumbnailGuidanceEditor;
