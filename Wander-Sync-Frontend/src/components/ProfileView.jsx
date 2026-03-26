import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { FormInput, FormSelect, FormTextarea } from "../components/FormComponents"
import * as z from 'zod';
import {
  Mail, User , Globe,
  Save, Camera
} from 'lucide-react';
import apiClient from '../../services/apiClient';


// --- ZOD SCHEMAS ---


const identitySchema = z.object({
  name: z.string().min(2, "Name is required"),
  username: z.string().regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores").min(3),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional().or(z.literal(""))
});

const preferencesSchema = z.object({
  phone: z.string().min(10, "Phone number is too short"),
  timezone: z.string(),
  dateFormat: z.enum(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"])
});


// --- REUSABLE COMPONENT ---
const EditableSection = ({ title, icon: IconComponent, children, isDirty, isSubmitting, onSubmit, onCancel }) => (
  <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50 flex items-center gap-3">
      {IconComponent && <IconComponent className="w-5 h-5 text-indigo-500" />}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
    {isDirty && (
      <div className="bg-gray-700/30 px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !isDirty}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    )}
  </div>
);


const IdentitySection = ({ user, onUpdate }) => {
  const { register, handleSubmit, formState: { errors, isDirty, isSubmitting }, reset } = useForm({
    resolver: zodResolver(identitySchema),
    mode: "onChange",
    defaultValues: {
      name: user?.identity?.name || user?.name || "",
      username: user?.identity?.username || user?.username || "",
      bio: user?.identity?.bio || user?.bio || ""
    }
  });

 const onSubmit = async (data) => {
    try {
      const response = await apiClient.updateIdentity(data);
      // If apiClient returns the raw response object, log it:
      console.log("Response Status in Updating Profile:", response); 
      toast.success(response.message)
      await onUpdate();
    } catch (error) {
      // Check if the error has a response attached (common in Axios)
      if (error.response) {
        console.error("Server Error Data:", error.response.data);
      }
      console.error("Failed to update identity", error);
    }
}

  return (
    <EditableSection
      title="Public Identity"
      icon={User}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={() => reset()}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Display Name"
            placeholder="Your full name"
            error={errors.name?.message}
            {...register("name")}
          />
          <FormInput
            label="Username"
            placeholder="username_123"
            error={errors.username?.message}
            {...register("username")}
          />
        </div>
        <FormTextarea
          label="Bio"
          placeholder="Tell us about yourself (max 160 characters)"
          rows={3}
          error={errors.bio?.message}
          {...register("bio")}
        />
      </div>
    </EditableSection>
  );
};



const PreferencesSection = ({ user, onUpdate }) => {
  const { register, handleSubmit, formState: { errors, isDirty, isSubmitting }, reset } = useForm({
    resolver: zodResolver(preferencesSchema),
    mode: "onChange",
    defaultValues: {
      phone: user?.preferences?.phone || user?.phone || "",
      timezone: user?.preferences?.timezone || user?.timezone || "PKT",
      dateFormat: user?.preferences?.dateFormat || user?.dateFormat || "DD/MM/YYYY"
    }
  });

  const onSubmit = async (data) => {

    await apiClient.updatePreferences(data);

    await onUpdate();
    reset(data);

  };

  return (
    <EditableSection
      title="Contact & Preferences"
      icon={Globe}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={() => reset()}
    >
      <div className="space-y-5">
        <FormInput
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          disabled
          value={user?.email || ""}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none opacity-60 cursor-not-allowed"
        />

        <FormInput
          label="Phone Number"
          placeholder="+92 300 0000000"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormSelect label="Timezone" error={errors.timezone?.message} {...register("timezone")}>
            <option value="PKT">Pakistan (GMT+5)</option>
            <option value="GMT">London (GMT+0)</option>
            <option value="EST">New York (EST)</option>
            <option value="PST">Los Angeles (PST)</option>
          </FormSelect>

          <FormSelect label="Date Format" error={errors.dateFormat?.message} {...register("dateFormat")}>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </FormSelect>
        </div>
      </div>
    </EditableSection>
  );
};


// --- MAIN PAGE COMPONENT ---
export default function ProfileSettings() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await apiClient.getMe();
      console.log("Response in Profile Page loading", response)
      toast.success("Profile loaded successfully");
      const userData = response.user || response.data || response;

      console.log("Data fetched:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user profile", error);
      toast.error(error.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);



  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Profile Card - Left */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col items-center text-center h-fit">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-gray-700 bg-indigo-600 flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                {user?.identity?.name ? user.identity.name.substring(0, 2).toUpperCase() : "ME"}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user?.identity?.name || "User"}</h2>
            <p className="text-indigo-400 text-sm mb-3">@{user?.identity?.username || "username"}</p>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{user?.identity?.bio || "No bio set"}</p>
            <div className="w-full pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500 mb-2">Member since 2024</p>
            </div>
          </div>

          {/* Info Cards - Right */}
          <div className="md:col-span-2 space-y-4">
         

            {/* Contact Card */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" />
                Contact
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-white font-medium">{user?.preferences?.phone || "Not set"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Sections */}
        <div className="space-y-6">
          <IdentitySection user={user} onUpdate={fetchUserData} />
          <PreferencesSection user={user} onUpdate={fetchUserData} />
        </div>
      </div>
    </div>
  );
}