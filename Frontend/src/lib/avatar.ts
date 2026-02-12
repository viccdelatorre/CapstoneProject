import { api } from './axios';

// Resolve an avatar value stored on the profile.
// If it's already a public URL (starts with http) return it.
// Otherwise request a signed URL from the backend.
export async function resolveAvatarUrl(avatar: string | null | undefined, expires = 60) {
  if (!avatar) return null;
  const v = avatar.trim();
  if (!v) return null;
  if (v.startsWith('http://') || v.startsWith('https://')) return v;

  // treat as storage path, ask backend for signed url
  try {
    const res = await api.get('/auth/avatar/signed-url', {
      params: { path: v, expires },
    });
    const data = res.data || {};
    return (
      data.signedURL || data.signedUrl || data.signed_url || data.signed || data.url || data.publicUrl || null
    );
  } catch (e) {
    console.error('Failed to resolve avatar signed url', e);
    return null;
  }
}

export default resolveAvatarUrl;
