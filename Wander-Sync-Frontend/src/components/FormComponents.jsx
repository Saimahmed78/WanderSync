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


export { FormInput, FormSelect, FormTextarea}