import React from 'react';

interface HeaderProps {
    id: string;
    label: string;
    projectName: string;
    onProjectNameChange: (name: string) => void;
    placeholder: string;
}

const Header: React.FC<HeaderProps> = ({
    id,
    label,
    projectName,
    onProjectNameChange,
    placeholder,
}) => {
    return (
        <header className="bg-gray-800 rounded-lg p-4 shadow-md w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 flex-grow">
                    <label htmlFor={id} className="text-lg font-semibold text-gray-300 whitespace-nowrap">
                        {label}:
                    </label>
                    <input
                        id={id}
                        type="text"
                        value={projectName}
                        onChange={(e) => onProjectNameChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;