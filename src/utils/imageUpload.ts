import { supabase } from '../lib/supabase';

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validates image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB까지 업로드 가능합니다.`,
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: '지원하지 않는 파일 형식입니다. JPG, PNG, WEBP 파일만 업로드 가능합니다.',
    };
  }

  return { valid: true };
}

/**
 * Uploads avatar image to Supabase Storage
 * @param userId - The user's ID
 * @param file - The image file to upload
 * @returns Promise with the public URL of the uploaded image
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error! };
    }

    // Generate unique filename with timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: '이미지 업로드에 실패했습니다.' };
    }

    // Get public URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);

    return { success: true, url: data.publicUrl };
  } catch (error) {
    console.error('Upload avatar error:', error);
    return { success: false, error: '이미지 업로드 중 오류가 발생했습니다.' };
  }
}

/**
 * Deletes an avatar from Supabase Storage
 * @param avatarUrl - The public URL of the avatar to delete
 * @returns Promise indicating success or failure
 */
export async function deleteAvatar(
  avatarUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract file path from URL
    const url = new URL(avatarUrl);
    const pathParts = url.pathname.split('/avatars/');
    if (pathParts.length < 2) {
      return { success: false, error: '잘못된 이미지 URL입니다.' };
    }
    const filePath = pathParts[1];

    // Delete file from storage
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return { success: false, error: '이미지 삭제에 실패했습니다.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete avatar error:', error);
    return { success: false, error: '이미지 삭제 중 오류가 발생했습니다.' };
  }
}

/**
 * Updates user's avatar URL in the database
 * @param userId - The user's ID
 * @param avatarUrl - The new avatar URL (or null to remove)
 * @returns Promise indicating success or failure
 */
export async function updateAvatarUrl(
  userId: string,
  avatarUrl: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId);

    if (error) {
      console.error('Update avatar URL error:', error);
      return { success: false, error: '프로필 업데이트에 실패했습니다.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Update avatar URL error:', error);
    return { success: false, error: '프로필 업데이트 중 오류가 발생했습니다.' };
  }
}

/**
 * Complete avatar upload process: upload file and update profile
 * @param userId - The user's ID
 * @param file - The image file to upload
 * @param oldAvatarUrl - The previous avatar URL to delete (optional)
 * @returns Promise with the new avatar URL
 */
export async function uploadAndSetAvatar(
  userId: string,
  file: File,
  oldAvatarUrl?: string | null
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    // Upload new avatar
    const uploadResult = await uploadAvatar(userId, file);
    if (!uploadResult.success) {
      return uploadResult;
    }

    // Update profile with new avatar URL
    const updateResult = await updateAvatarUrl(userId, uploadResult.url);
    if (!updateResult.success) {
      // Rollback: delete uploaded file
      await deleteAvatar(uploadResult.url);
      return { success: false, error: updateResult.error! };
    }

    // Delete old avatar if exists
    if (oldAvatarUrl) {
      await deleteAvatar(oldAvatarUrl);
    }

    return { success: true, url: uploadResult.url };
  } catch (error) {
    console.error('Upload and set avatar error:', error);
    return { success: false, error: '아바타 업로드 중 오류가 발생했습니다.' };
  }
}

/**
 * Removes avatar: deletes file and updates profile
 * @param userId - The user's ID
 * @param avatarUrl - The avatar URL to delete
 * @returns Promise indicating success or failure
 */
export async function removeAvatar(
  userId: string,
  avatarUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update profile to remove avatar URL
    const updateResult = await updateAvatarUrl(userId, null);
    if (!updateResult.success) {
      return updateResult;
    }

    // Delete file from storage
    await deleteAvatar(avatarUrl);

    return { success: true };
  } catch (error) {
    console.error('Remove avatar error:', error);
    return { success: false, error: '아바타 삭제 중 오류가 발생했습니다.' };
  }
}
