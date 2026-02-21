import React from 'react';
import { ClearIcon, CopyIcon, OpenIcon, SaveIcon } from './icons';

interface ScriptEditorProps {
    label: string;
    content: string;
    onContentChange: (content: string) => void;
    isLoading: boolean;
    onOpen: () => void;
    onSave: () => void;
    onCopy: () => void;
    onClear: () => void;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ 
    label,
    content, 
    onContentChange, 
    isLoading,
    onOpen,
    onSave,
    onCopy,
    onClear
}) => {
    const editorId = label.replace(/\s+/g, '-').toLowerCase();

    return (
        <div className="flex flex-col flex-grow w-full">
            <label htmlFor={editorId} className="mb-2 text-lg font-semibold text-gray-300">
                {label}
            </label>
            <div className="flex items-center justify-start gap-2 flex-wrap mb-4">
                <ActionButton onClick={onOpen} disabled={isLoading} icon={<OpenIcon />} text="Open" />
                <ActionButton onClick={onSave} disabled={isLoading} icon={<SaveIcon />} text="Save" />
                <ActionButton onClick={onCopy} disabled={isLoading} icon={<CopyIcon />} text="Copy" />
                <ActionButton onClick={onClear} disabled={isLoading} icon={<ClearIcon />} text="Clear" />
            </div>
            <div className="relative flex-grow w-full">
                <textarea
                    id={editorId}
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    placeholder="Open a .txt file or start typing your script here...
Format:
mm:ss message.....
mm:ss message.....
clip length mm:ss"
                    className="w-full h-full bg-gray-800 border-2 border-gray-700 rounded-lg p-4 font-mono text-base text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                    style={{ height: '45vh' }}
                    spellCheck="false"
                    aria-label={`${label} editor`}
                />
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center rounded-lg">
                        <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg font-semibold text-gray-200">AI is adjusting timestamps...</p>
                    </div>
                )}
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


export default ScriptEditor;