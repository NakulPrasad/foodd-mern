// Basic user profile data
export interface IUserProfile {
    displayName: string;
    id?: number;
    name: string;
    email: string;
    avatarUrl?: string; // URL to user's profile picture (optional)
    bio?: string; // User bio/description (optional)
    location?: string; // User's location (optional)
    website?: string; // Personal website or social media links (optional)
    phoneNumber?: string; // User's phone number (optional)
    dateOfBirth?: string; // User's date of birth (optional)
    joinedDate?: string; // ISO date string of when the user joined (e.g., '2020-05-01')
  }
  
  // User's social media or external links
  export interface IUserSocialLinks {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
    website?: string; // Personal website URL
  }
  
  // User settings or preferences (e.g., notifications, theme)
  export interface IUserSettings {
    theme: 'light' | 'dark'; // Theme preference (optional)
    language: string; // Language preference (e.g., 'en', 'es', etc.)
    notificationsEnabled: boolean; // Whether the user has enabled notifications
    emailNotifications: boolean; // Email-based notifications
    pushNotifications: boolean; // Push notifications (optional)
    privacySettings: {
      showEmail: boolean; // Whether to show the email publicly (optional)
      showPhone: boolean; // Whether to show the phone number publicly (optional)
    };
  }
  
  // For updating user profile
  export interface IUserProfileUpdateRequest {
    name?: string;
    email?: string;
    avatarUrl?: string; // New avatar URL (optional)
    bio?: string; // New bio (optional)
    location?: string; // New location (optional)
    website?: string; // New website or social link (optional)
    phoneNumber?: string; // New phone number (optional)
    dateOfBirth?: string; // New date of birth (optional)
  }
  
  // For handling user avatar upload or update
  export interface IUserAvatar {
    avatarUrl: string; // URL of the avatar image
    avatarFile?: File; // File object if the user is uploading a new avatar (optional)
  }
  
  // User's activity log or recent actions
  export interface IUserActivity {
    action: 'profile-update' | 'login' | 'avatar-change' | 'password-change'; // Type of activity
    timestamp: string; // Timestamp when the action occurred (ISO date string)
    details?: string; // Additional details (optional)
  }
  
  // Represents a connection (e.g., following/friendship) between users
  export interface IUserConnection {
    userId: number; // ID of the user who initiated the connection
    connectedUserId: number; // ID of the user being connected to
    connectionType: 'follow' | 'friend'; // Type of connection (follow or friend)
    createdAt: string; // Date the connection was made (ISO string)
  }
  
  // User's address information
  export interface IUserAddress {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string; // Optional: phone number for shipping contact
  }
  
  // User notification preferences
  export interface IUserNotificationPreferences {
    emailNotifications: boolean; // Whether to receive email notifications
    smsNotifications: boolean; // Whether to receive SMS notifications
    pushNotifications: boolean; // Whether to receive push notifications
    notificationFrequency: 'immediate' | 'daily' | 'weekly'; // How often notifications are received
  }
  
  // Custom fields for user profiles (e.g., personalized interests, hobbies)
  export interface IUserCustomFields {
    [key: string]: string | number | boolean; // Custom fields (dynamic key-value pairs)
  }
  
  // User privacy settings for controlling profile visibility and data sharing
  export interface IUserPrivacySettings {
    showEmail: boolean; // Whether the user wants to display their email publicly
    showPhoneNumber: boolean; // Whether the user wants to display their phone number publicly
    allowSearchEngineIndexing: boolean; // Allow the profile to be indexed by search engines
  }
  