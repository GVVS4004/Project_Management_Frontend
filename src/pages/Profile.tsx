import { useState } from "react";
import { Input, Button, ErrorMessage } from "../components/forms";
import {
  useUserProfile,
  useUpdateProfile,
  useChangePassword,
  useUploadProfileImage,
  useDeleteProfileImage,
} from "../hooks/useUser";
import { validateEmail, validateRequired } from "../utils/validation";
import type {
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../types/auth.types";
import { config } from "../config/env";

const Profile = () => {
  // Fetch user profile
  const { data: user, isLoading, error } = useUserProfile();

  // Mutations
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const uploadImageMutation = useUploadProfileImage();
  const deleteImageMutation = useDeleteProfileImage();

  // Form states
  const [profileForm, setProfileForm] = useState<UpdateProfileRequest>({});
  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [passwordErrors, setPasswordErrors] = useState<{
    [key: string]: string;
  }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Initialize form when user data loads
  useState(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
      });
    }
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error loading profile</div>
      </div>
    );
  }

  if (!user) return null;

  // ========== PROFILE UPDATE HANDLERS ==========
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));

    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateProfileForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (profileForm.email) {
      const emailError = validateEmail(profileForm.email);
      if (emailError) newErrors.email = emailError;
    }

    if (profileForm.username) {
      const usernameError = validateRequired(profileForm.username, "Username");
      if (usernameError) newErrors.username = usernameError;
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) return;

    updateProfileMutation.mutate(profileForm);
  };

  // ========== PASSWORD CHANGE HANDLERS ==========
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));

    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordForm.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    changePasswordMutation.mutate(passwordForm, {
      onSuccess: () => {
        // Clear form on success
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      },
    });
  };

  // ========== IMAGE UPLOAD HANDLERS ==========
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = () => {
    if (!selectedFile) return;

    uploadImageMutation.mutate(selectedFile, {
      onSuccess: () => {
        setSelectedFile(null);
        setPreviewUrl(null);
      },
    });
  };

  const handleImageDelete = () => {
    if (confirm("Are you sure you want to delete your profile image?")) {
      deleteImageMutation.mutate();
    }
  };

  const profileImageUrl = user.id
    ? `${config.api.baseUrl}/media/profile-image/${user.id}`
    : null;

  // ========== RENDER ==========
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      {/* ========== PROFILE HEADER ========== */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

        <div className="flex items-center space-x-6">
          {/* Profile Image */}
          <div className="shrink-0">
            <img
              src={
                previewUrl ||
                profileImageUrl ||
                "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
          </div>

          {/* Image Upload Controls */}
          <div className="flex-1 space-y-3">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
              />
            </div>

            <div className="flex space-x-2">
              {selectedFile && (
                <Button
                  onClick={handleImageUpload}
                  disabled={uploadImageMutation.isPending}
                  size="sm"
                >
                  {uploadImageMutation.isPending
                    ? "Uploading..."
                    : "Upload Image"}
                </Button>
              )}

              {profileImageUrl && !selectedFile && (
                <Button
                  onClick={handleImageDelete}
                  disabled={deleteImageMutation.isPending}
                  variant="danger"
                  size="sm"
                >
                  {deleteImageMutation.isPending
                    ? "Deleting..."
                    : "Delete Image"}
                </Button>
              )}
            </div>

            {uploadImageMutation.isError && (
              <ErrorMessage message="Failed to upload image" />
            )}
            {uploadImageMutation.isSuccess && (
              <p className="text-sm text-green-600">
                Image uploaded successfully!
              </p>
            )}
          </div>
        </div>

        {/* User Info Display */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Username:</span> {user.username}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold">Role:</span> {user.role}
          </div>
          <div>
            <span className="font-semibold">Member since:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* ========== EDIT PROFILE FORM ========== */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={profileForm.firstName || ""}
              onChange={handleProfileChange}
              error={profileErrors.firstName}
            />

            <Input
              label="Last Name"
              name="lastName"
              value={profileForm.lastName || ""}
              onChange={handleProfileChange}
              error={profileErrors.lastName}
            />
          </div>

          <Input
            label="Username"
            name="username"
            value={profileForm.username || ""}
            onChange={handleProfileChange}
            error={profileErrors.username}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={profileForm.email || ""}
            onChange={handleProfileChange}
            error={profileErrors.email}
          />

          {updateProfileMutation.isError && (
            <ErrorMessage message="Failed to update profile" />
          )}

          {updateProfileMutation.isSuccess && (
            <p className="text-sm text-green-600">
              Profile updated successfully!
            </p>
          )}

          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
            fullWidth
          >
            {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </div>

      {/* ========== CHANGE PASSWORD FORM ========== */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            name="oldPassword"
            type="password"
            value={passwordForm.oldPassword}
            onChange={handlePasswordChange}
            error={passwordErrors.oldPassword}
          />

          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            error={passwordErrors.newPassword}
            helperText="Must be at least 6 characters"
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            error={passwordErrors.confirmPassword}
          />

          {changePasswordMutation.isError && (
            <ErrorMessage message="Failed to change password. Check your current password." />
          )}

          {changePasswordMutation.isSuccess && (
            <p className="text-sm text-green-600">
              Password changed successfully!
            </p>
          )}

          <Button
            type="submit"
            disabled={changePasswordMutation.isPending}
            fullWidth
          >
            {changePasswordMutation.isPending
              ? "Changing..."
              : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
