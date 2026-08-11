import React from 'react';
import { Input, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export const PublicDashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-container__header">
                <h2>Knowledge Dashboard</h2>
                <p>Find, review and manage internal technical knowledge</p>
            </div>

            {/* Public Search Bar */}
            <div className="dashboard-container__search">
                <Input
                    size="large"
                    prefix={<SearchOutlined />}
                    placeholder="Search questions and short answers..."
                />
            </div>

            {/* Public Metric Cards */}
            <div className="dashboard-container__metrics">
                <Card title="Projects">
                    <span className="metric-value">4</span>
                </Card>
                <Card title="Questions">
                    <span className="metric-value">37</span>
                </Card>
                <Card title="Knowledge Base">
                    <span className="metric-value">248</span>
                </Card>
            </div>

            {/* Recently Added Questions Section */}
            <div className="dashboard-container__section">
                <div className="dashboard-container__section-header">
                    <h3>Recently Added Questions</h3>
                </div>
                <Card>
                    <div className="question-list">
                        <div className="question-list__item">
                            <h4>What is a Java Record?</h4>
                            <p className="meta-info">Java • A2 • Updated today</p>
                            <p>"A record is a compact syntax for declaring..."</p>
                        </div>
                        <hr />
                        <div className="question-list__item">
                            <h4>Explain OAuth2 Authorization Code Flow</h4>
                            <p className="meta-info">Security • A3 • Updated yesterday</p>
                            <p>"Authorization Code Flow allows..."</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};