import React from "react";
import { X,AlertCircle } from "lucide-react";
const FormInput = ({ label, error, ...props }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            {...props}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
        />
        {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
            </div>
        )}
    </div>
);

const FormSelect = ({ label, error, children, ...props }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        <select
            {...props}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
        >
            {children}
        </select>
        {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
            </div>
        )}
    </div>
);

const FormTextarea = ({ label, error, ...props }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        <textarea
            {...props}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition resize-none"
        />
        {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
            </div>
        )}
    </div>
);

const SkillInput = ({ value = [], onChange, error }) => {
    const [input, setInput] = React.useState("");

    const addSkill = () => {
        const skill = input.trim();
        if (skill && !value.includes(skill)) {
            onChange([...value, skill]);
            setInput("");
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Skills</label>
            <div className="space-y-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        placeholder="Add a skill (e.g., React, Node.js)"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                    />
                    <button
                        type="button"
                        onClick={addSkill}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition"
                    >
                        Add
                    </button>
                </div>

                {value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {value.map((skill) => (
                            <div
                                key={skill}
                                className="inline-flex items-center gap-2 bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-lg text-sm"
                            >
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => onChange(value.filter(s => s !== skill))}
                                    className="text-indigo-400 hover:text-indigo-200 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
        </div>
    );
};

export { FormInput, FormSelect, FormTextarea, SkillInput }