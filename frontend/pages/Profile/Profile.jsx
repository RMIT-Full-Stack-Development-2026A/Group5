import { useState } from 'react';
import ProfileTab from '../../components/ProfileTab/ProfileTab';
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo';
import ProfileHistory from '../../components/ProfileHistory/ProfileHistory';
import ProfileSetting from '../../components/ProfileSetting/ProfileSetting';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('info');

    return (
        <div className="container py-5">
            <div className="row g-4">
                <ProfileTab activeTab={activeTab} setActiveTab={setActiveTab} />
                {activeTab === 'info' && <ProfileInfo />}
                {activeTab === 'history' && <ProfileHistory />}
                {activeTab === 'settings' && <ProfileSetting />}
            </div>
        </div>
    );
}