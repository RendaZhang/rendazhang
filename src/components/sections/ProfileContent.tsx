import { useEffect, useState, type ReactElement } from 'react';
import { apiClient } from '../../services';
import { LocalizedSection } from '../ui';
import { PROFILE_CONTENT } from '../../content/profileContent';
import { LOGIN_PAGE_PATH, LOADING_TEXT } from '../../constants';
import { useLanguage } from '../providers';

interface UserInfo {
  uid: string;
  email: string | null;
  phone: string | null;
  display_name: string;
  is_active: boolean;
}

export default function ProfileContent(): ReactElement {
  const [user, setUser] = useState<UserInfo | null>(null);
  const { lang } = useLanguage();
  const langKey = lang as 'en' | 'zh';

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      try {
        const res = await apiClient.auth.me();
        setUser(res.user);
      } catch {
        window.location.href = LOGIN_PAGE_PATH;
      }
    };
    fetchUser();
  }, []);

  const texts = PROFILE_CONTENT[langKey];
  const loading = LOADING_TEXT[langKey.toUpperCase() as 'EN' | 'ZH'];

  if (!user) {
    return <div className="c-profile-container">{loading}</div>;
  }

  return (
    <div className="c-profile-container">
      <h1 className="c-profile-title">
        <LocalizedSection
          zhContent={PROFILE_CONTENT.zh.title}
          enContent={PROFILE_CONTENT.en.title}
        />
      </h1>
      <div className="c-profile-row">
        <span className="c-profile-label">
          <LocalizedSection
            zhContent={texts.labels.uid}
            enContent={PROFILE_CONTENT.en.labels.uid}
          />
          :
        </span>
        {user.uid}
      </div>
      <div className="c-profile-row">
        <span className="c-profile-label">
          <LocalizedSection
            zhContent={texts.labels.email}
            enContent={PROFILE_CONTENT.en.labels.email}
          />
          :
        </span>
        {user.email ?? '-'}
      </div>
      <div className="c-profile-row">
        <span className="c-profile-label">
          <LocalizedSection
            zhContent={texts.labels.phone}
            enContent={PROFILE_CONTENT.en.labels.phone}
          />
          :
        </span>
        {user.phone ?? '-'}
      </div>
      <div className="c-profile-row">
        <span className="c-profile-label">
          <LocalizedSection
            zhContent={texts.labels.displayName}
            enContent={PROFILE_CONTENT.en.labels.displayName}
          />
          :
        </span>
        {user.display_name}
      </div>
      <div className="c-profile-row">
        <span className="c-profile-label">
          <LocalizedSection
            zhContent={texts.labels.active}
            enContent={PROFILE_CONTENT.en.labels.active}
          />
          :
        </span>
        {user.is_active ? '✅' : '❌'}
      </div>
    </div>
  );
}
