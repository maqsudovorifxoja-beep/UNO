import React from 'react';
import { Bot, Shield, Sparkles, Crown, Flame, Rocket, Eye, Gem, User } from 'lucide-react';
import { getAvatarById } from '../utils/avatars';

interface AvatarIconProps {
  avatarId: string;
  size?: number;
  className?: string;
  showBadge?: boolean;
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({
  avatarId,
  size = 20,
  className = '',
  showBadge = true,
}) => {
  const avatar = getAvatarById(avatarId);

  const renderIcon = () => {
    switch (avatar.iconName) {
      case 'bot':
        return <Bot size={size} />;
      case 'ninja':
        return <Shield size={size} />;
      case 'wizard':
        return <Sparkles size={size} />;
      case 'king':
        return <Crown size={size} />;
      case 'lion':
        return <Flame size={size} />;
      case 'alien':
        return <Rocket size={size} />;
      case 'fox':
        return <Eye size={size} />;
      case 'gem':
        return <Gem size={size} />;
      default:
        return <User size={size} />;
    }
  };

  if (!showBadge) {
    return <span className={`${avatar.color} ${className}`}>{renderIcon()}</span>;
  }

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br ${avatar.badgeBg} border-2 ${avatar.borderColor} ${avatar.color} flex items-center justify-center shadow-lg transition-transform ${className}`}
      style={{ width: size * 1.8, height: size * 1.8 }}
    >
      {renderIcon()}
    </div>
  );
};
