import { useEffect, useState, type ReactElement } from 'react';
import { apiClient } from '../../services';
import LocalizedSection from '../ui/data-display/LocalizedSection';
import AccountPanel from '../forms/AccountPanel';
import { PROFILE_CONTENT } from '../../content/profileContent';
import { LOGIN_PAGE_PATH, LOADING_TEXT } from '../../constants';

interface UserInfo {
  uid: string;
  email: string | null;
  phone: string | null;
  display_name: string;
  is_active: boolean;
}

export default function ProfileContent(): ReactElement {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      try {
        const res = await apiClient.auth.me();
        setUser(res.user);
      } catch {
        window.location.href = LOGIN_PAGE_PATH;
      }
    };
    void fetchUser();
  }, []);

  const { zh, en } = PROFILE_CONTENT;
  const rows = user
    ? {
        uid: user.uid,
        email: user.email ?? '—',
        phone: user.phone ?? '—',
        displayName: user.display_name,
        active: (
          <LocalizedSection
            zhContent={user.is_active ? zh.active : zh.inactive}
            enContent={user.is_active ? en.active : en.inactive}
          />
        )
      }
    : null;

  return (
    <AccountPanel titleZh={zh.title} titleEn={en.title}>
      {rows ? (
        <dl className="c-account-profile">
          {(Object.keys(rows) as Array<keyof typeof rows>).map((key) => (
            <div key={key} className="c-account-profile-row">
              <dt>
                <LocalizedSection zhContent={zh.labels[key]} enContent={en.labels[key]} />
              </dt>
              <dd>{rows[key]}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p role="status">
          <LocalizedSection zhContent={LOADING_TEXT.ZH} enContent={LOADING_TEXT.EN} />
        </p>
      )}
    </AccountPanel>
  );
}
