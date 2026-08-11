import React from 'react';
import { useAuth } from '../hooks/use-auth';
import { PublicDashboard } from './public-dashboard';
import { AuthenticatedDashboard } from './authenticated-dashboard';
import './dashboard.scss';
import {Spin} from "antd";

export const Dashboard: React.FC = () => {
    const auth = useAuth();

    // If still verifying the cookie with the Gateway, show a loader
    if (auth?.isLoading) {
        return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
    }

    // Now we are 100% sure whether userProfile exists or not
    return auth?.userProfile ? <AuthenticatedDashboard /> : <PublicDashboard />;
};