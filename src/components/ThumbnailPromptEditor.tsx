
import React, { useState, useRef, useEffect } from 'react';
import { ClearIcon, CopyIcon, GenerateIcon, OpenIcon, SaveIcon, ImageIcon, ViewIcon, DownloadIcon, CloseIcon } from './icons';

interface ThumbnailPromptEditorProps {
    content: string;
    onContentChange: (content: string) => void;
    isLoading: boolean;
    onGenerate: () => void;
    onOpen: () => void;
    onSave: () => void;
    onCopy: () => void;
    onClear: () => void;
    onCreateImage: () => void;
    isCreatingImage: boolean;
    generatedImage: string | null;
    onSaveImage: (finalImageData?: string) => void;
    selectedModel: string;
    onModelChange: (model: string) => void;
    caption?: string; // Add caption prop
}

const ThumbnailPromptEditor: React.FC<ThumbnailPromptEditorProps> = ({ 
    content, 
    onContentChange, 
    isLoading,
    onGenerate,
    onOpen,
    onSave,
    onCopy,
    onClear,
    onCreateImage,
    isCreatingImage,
    generatedImage,
    onSaveImage,
    selectedModel,
    onModelChange,
    caption = ""
}) => {
    const editorId = "thumbnail-prompt-editor";
    const label = "YouTube Video Clip Thumbnail Prompt";
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    
    // Canvas logic for saving image with text
    const processImageWithOverlay = (callback: (dataUrl: string) => void) => {
        if (!generatedImage) return;
        if (!showOverlay || !caption) {
            callback(generatedImage);
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = generatedImage;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            if (ctx) {
                // Draw Image
                ctx.drawImage(img, 0, 0);

                // Configure Text
                const fontSize = Math.floor(canvas.height * 0.15); // Dynamic font size
                ctx.font = `bold ${fontSize}px "Roboto", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                // Text positioning
                const x = canvas.width / 2;
                const y = canvas.height - (canvas.height * 0.1);
                const maxWidth = canvas.width * 0.9;

                // Shadow/Outline for readability
                ctx.shadowColor = "black";
                ctx.shadowBlur = fontSize * 0.5;
                ctx.lineWidth = fontSize * 0.05;
                ctx.strokeStyle = 'black';
                ctx.fillStyle = 'white'; // Main text color
                
                // Wrap text if needed (Basic wrapping)
                const words = caption.split(' ');
                let line = '';
                const lines = [];
                
                // First pass check for English vs Thai to adjust font logic if needed (optional)
                // Drawing stroke then fill
                ctx.strokeText(caption, x, y);
                ctx.fillText(caption, x, y);
            }
            callback(canvas.toDataURL('image/png'));
        };
    };

    const handleSaveHighQuality = () => {
        processImageWithOverlay((finalData) => {
            onSaveImage(finalData);
        });
    };

    return (
        <div className="flex flex-col flex-grow w-full">
            <label htmlFor={editorId} className="mb-2 text-lg font-semibold text-gray-300">
                {label}
            </label>
            <div className="flex items-center justify-start gap-2 flex-wrap mb-4">
                <ActionButton onClick={onGenerate} disabled={isLoading || isCreatingImage} icon={isLoading ? <Spinner/> : <GenerateIcon />} text={isLoading ? "Generating..." : "Generate"} />
                <ActionButton onClick={onOpen} disabled={isLoading || isCreatingImage} icon={<OpenIcon />} text="Open" />
                <ActionButton onClick={onSave} disabled={isLoading || isCreatingImage} icon={<SaveIcon />} text="Save" />
                <ActionButton onClick={onCopy} disabled={isLoading || isCreatingImage} icon={<CopyIcon />} text="Copy" />
                <ActionButton onClick={onClear} disabled={isLoading || isCreatingImage} icon={<ClearIcon />} text="Clear" />
            </div>
            <div className="relative w-full mb-6">
                <textarea
                    id={editorId}
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    placeholder="Click 'Generate' to create a detailed AI image generation prompt for your thumbnail..."
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-4 font-mono text-base text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
                    rows={10}
                    spellCheck="false"
                    aria-label={`${label} editor`}
                />
            </div>

             {/* Model Selector and Create Image Button */}
             <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="model-select" className="text-gray-300 font-semibold whitespace-nowrap">Model:</label>
                        <select
                            id="model-select"
                            value={selectedModel}
                            onChange={(e) => onModelChange(e.target.value)}
                            className="bg-gray-700 text-gray-200 rounded px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
<option value="gemini-2.5-flash-image">gemini-2.5-flash-image (Default)</option>
<option value="gemini-3-pro-image-preview">gemini-3-pro-image-preview</option>
<option value="imagen-4.0-generate-001">imagen-4.0-generate-001</option>
<option value="gemini-flash-image-latest">Gemini Flash Image Latest</option>
<option value="gemini-pro-image-latest">Gemini Pro Image Latest</option>
<option value="gemini-flash-latest">gemini-flash-latest</option>
<option value="gemini-flash-lite-latest">gemini-flash-lite-latest</option>
<option value="gemini-3-flash-preview">gemini-3-flash-preview</option>
<option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview</option>
<option value="gemini-3.1-flash-image-preview">Gemini 3.1 Flash Image (High Quality)</option>
                        </select>
                    </div>
                    {/* Overlay Toggle */}
                    {generatedImage && caption && (
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="overlay-toggle" 
                                checked={showOverlay} 
                                onChange={(e) => setShowOverlay(e.target.checked)}
                                className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label htmlFor="overlay-toggle" className="text-gray-300 font-semibold cursor-pointer select-none">
                                Overlay Caption
                            </label>
                        </div>
                    )}
                </div>
                <ActionButton 
                    onClick={onCreateImage} 
                    disabled={isLoading || isCreatingImage || !content.trim()} 
                    icon={isCreatingImage ? <Spinner/> : <ImageIcon />} 
                    text={isCreatingImage ? "Creating Image..." : "Create Image"} 
                />
            </div>


            {/* Image Display Section */}
            {(generatedImage || isCreatingImage) && (
                <div className="w-full flex flex-col items-center p-4 bg-gray-800 border-2 border-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4 self-start">YouTube Video Clip Thumbnail</h3>
                    
                    <div className="relative w-full max-w-[600px] aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center border border-gray-600 group">
                        {isCreatingImage ? (
                             <div className="flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-600 rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-400">Generating AI Image...</p>
                             </div>
                        ) : generatedImage ? (
                            <>
                                <img src={generatedImage} alt="Generated Thumbnail" className="w-full h-full object-contain" />
                                
                                {/* HTML Overlay for Preview */}
                                {showOverlay && caption && (
                                    <div className="absolute inset-0 flex items-end justify-center pb-[5%] pointer-events-none">
                                        <h2 
                                            className="text-white text-center font-bold px-4 leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
                                            style={{ 
                                                fontSize: 'clamp(24px, 5vw, 48px)',
                                                textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                                            }}
                                        >
                                            {caption.split('\n')[0]} {/* Show first line or logic to handle split */}
                                        </h2>
                                    </div>
                                )}
                            </>
                        ) : null}
                    </div>

                    {generatedImage && !isCreatingImage && (
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => setIsPreviewOpen(true)}
                                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                <ViewIcon /> View Full Size
                            </button>
                            <button
                                onClick={handleSaveHighQuality}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                <DownloadIcon /> Save High Quality
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Full Screen Image Preview Modal */}
            {isPreviewOpen && generatedImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 p-4"
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <button 
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition focus:outline-none z-50 p-2 bg-gray-800 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsPreviewOpen(false);
                        }}
                    >
                        <CloseIcon />
                    </button>
                    <div className="relative max-w-full max-h-full">
                         <img 
                            src={generatedImage} 
                            alt="Full Screen Thumbnail" 
                            className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                         {/* HTML Overlay for Modal */}
                         {showOverlay && caption && (
                            <div className="absolute inset-0 flex items-end justify-center pb-[5%] pointer-events-none">
                                <h2 
                                    className="text-white text-center font-bold px-4 leading-tight"
                                    style={{ 
                                        fontSize: '5vw',
                                        textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                                    }}
                                >
                                    {caption.split('\n')[0]}
                                </h2>
                            </div>
                        )}
                    </div>
                </div>
            )}
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

export default ThumbnailPromptEditor;