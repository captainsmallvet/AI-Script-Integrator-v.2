import React from 'react';
import { ClearIcon, CopyIcon } from './icons';

interface YouTubeChannelNameEditorProps {
    content: string;
    onContentChange: (content: string) => void;
    onCopy: () => void;
    onClear: () => void;
}

const YouTubeChannelNameEditor: React.FC<YouTubeChannelNameEditorProps> = ({ 
    content, 
    onContentChange, 
    onCopy,
    onClear
}) => {
    const editorId = "youtube-channel-name-editor";
    const label = "YouTube Channel Name";

    return (
        <div className="flex flex-col flex-grow w-full">
            <div className="flex items-center justify-between mb-2">
                <label htmlFor={editorId} className="text-lg font-semibold text-gray-300">
                    {label}
                </label>
                <div className="flex items-center gap-2">
                    <ActionButton onClick={onCopy} icon={<CopyIcon />} text="Copy" />
                    <ActionButton onClick={onClear} icon={<ClearIcon />} text="Clear" />
                </div>
            </div>
            <div className="relative w-full">
                <textarea
                    id={editorId}
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-4 font-mono text-base text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none whitespace-nowrap overflow-x-auto"
                    rows={1}
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

export default YouTubeChannelNameEditor;