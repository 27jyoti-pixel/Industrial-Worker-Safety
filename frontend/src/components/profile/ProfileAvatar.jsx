import React from 'react';
import { PROFILE_AVATARS, resolveProfileAvatarId } from './profileAvatarOptions';

const ProfileAvatar = ({ avatarId, role, initials = 'U', className = '' }) => {
  const resolvedId = resolveProfileAvatarId(avatarId, role);
  const avatar = PROFILE_AVATARS.find((item) => item.id === resolvedId);

  if (!avatar?.image) {
    return <span className={`flex h-full w-full items-center justify-center rounded-full bg-[#111] font-semibold text-white ${className}`}>{initials}</span>;
  }

  return <img src={avatar.image} alt={avatar.label} className={`h-full w-full rounded-full object-cover ${className}`} />;
};

export default ProfileAvatar;
