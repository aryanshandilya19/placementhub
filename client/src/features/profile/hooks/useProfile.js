import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getMeAPI,
  updateProfileAPI,
  uploadAvatarAPI,
  uploadResumeAPI,
  deleteResumeAPI,
} from '../../../api/user.api.js';
import useAuthStore from '../../../store/authStore.js';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const setAuth = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMeAPI();
        setProfile(res.data.user);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('fetchProfile error:', err);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = async (data) => {
    try {
      const res = await updateProfileAPI(data);
      setProfile(res.data.user);
      setAuth(res.data.user, accessToken);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const res = await uploadAvatarAPI(file);
      setProfile((prev) => ({ ...prev, avatar: res.data.avatar }));
      toast.success('Avatar updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  const uploadResume = async (file) => {
    try {
      const res = await uploadResumeAPI(file);
      setProfile((prev) => ({ ...prev, resume: res.data.resume }));
      toast.success('Resume uploaded');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  const deleteResume = async () => {
    try {
      await deleteResumeAPI();
      setProfile((prev) => ({ ...prev, resume: { url: '', publicId: '' } }));
      toast.success('Resume deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return { profile, loading, updateProfile, uploadAvatar, uploadResume, deleteResume };
};