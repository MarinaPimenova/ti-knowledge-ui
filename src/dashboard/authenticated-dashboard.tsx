import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Card, Modal, Upload, message } from 'antd';
import {
    SearchOutlined,
    RobotOutlined,
    UploadOutlined,
    DownloadOutlined,
    PlusOutlined,
    FileExcelOutlined,
} from '@ant-design/icons';
import { ROUTE } from '../router/router.enum';
import type { UploadFile } from 'antd/es/upload/interface';

export const AuthenticatedDashboard: React.FC = () => {
    const navigate = useNavigate();

    // Import Modal & SSE State
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // AI External SPA Redirect
    const handleAskAI = () => {
        window.location.href = 'https://ai.internal.company.com';
    };

    // File Import Logic
    const handleImportSubmit = () => {
        if (fileList.length === 0) {
            message.error('Please select a file to import.');
            return;
        }

        setIsUploading(true);
        setIsImportModalOpen(false);

        const file = fileList[0];
        const eventSource = new EventSource(`/api/import/progress?fileName=${encodeURIComponent(file.name)}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.status === 'COMPLETED') {
                Modal.success({
                    title: 'Import Completed',
                    content: `File "${file.name}" has been successfully imported.`,
                });
                eventSource.close();
                setIsUploading(false);
                setFileList([]);
            }
        };

        eventSource.onerror = () => {
            message.error('Error occurred during import processing.');
            eventSource.close();
            setIsUploading(false);
        };
    };

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-container__header">
                <h2>Knowledge Dashboard</h2>
                <p>Find, review and manage internal technical knowledge</p>
            </div>

            {/* Search Bar */}
            <div className="dashboard-container__search">
                <Input
                    size="large"
                    prefix={<SearchOutlined />}
                    placeholder="Search questions and short answers..."
                />
                <Button type="primary" size="large">Search</Button>
            </div>

            {/* Actions Toolbar */}
            <div className="dashboard-container__actions">
                <Button icon={<RobotOutlined />} onClick={handleAskAI}>Ask AI</Button>
                <Button icon={<UploadOutlined />} onClick={() => setIsImportModalOpen(true)}>Import</Button>
                <Button icon={<DownloadOutlined />} onClick={() => navigate(ROUTE.EXPORT)}>Export</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(ROUTE.CREATE_QUESTION)}>
                    New Question
                </Button>
            </div>

            {/* Metric Cards */}
            <div className="dashboard-container__metrics">
                <Card title="My Projects">
                    <span className="metric-value">4</span>
                </Card>
                <Card title="My Questions">
                    <span className="metric-value">37</span>
                </Card>
                <Card title="Knowledge Base">
                    <span className="metric-value">248</span>
                </Card>
            </div>

            {/* My Projects Section */}
            <div className="dashboard-container__section">
                <div className="dashboard-container__section-header">
                    <h3>My Projects</h3>
                    <Button type="link" onClick={() => navigate(ROUTE.PROJECTS)}>View all</Button>
                </div>
                <Card>
                    <div className="project-list">
                        <div className="project-list__item">
                            <span>Java Training</span>
                            <span className="project-count">24 questions</span>
                        </div>
                        <div className="project-list__item">
                            <span>Spring Boot</span>
                            <span className="project-count">31 questions</span>
                        </div>
                        <div className="project-list__item">
                            <span>Architecture</span>
                            <span className="project-count">18 questions</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recently Added Questions Section */}
            <div className="dashboard-container__section">
                <div className="dashboard-container__section-header">
                    <h3>Recently Added Questions</h3>
                    <Button type="link" onClick={() => navigate(ROUTE.QUESTIONS)}>View all</Button>
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

            {/* Single File CSV/Excel Import Modal */}
            <Modal
                title="Import Questions"
                open={isImportModalOpen}
                onOk={handleImportSubmit}
                onCancel={() => setIsImportModalOpen(false)}
                confirmLoading={isUploading}
            >
                <Upload
                    maxCount={1}
                    accept=".csv, .xlsx, .xls"
                    beforeUpload={(file) => {
                        const isValidFormat =
                            file.type === 'text/csv' ||
                            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                            file.type === 'application/vnd.ms-excel';
                        if (!isValidFormat) {
                            message.error('Only CSV and Excel files are supported!');
                        }
                        return isValidFormat || Upload.LIST_IGNORE;
                    }}
                    fileList={fileList}
                    onChange={({ fileList }) => setFileList(fileList)}
                >
                    <Button icon={<FileExcelOutlined />}>Select File (CSV or Excel)</Button>
                </Upload>
            </Modal>
        </div>
    );
};