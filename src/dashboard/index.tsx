// dashboard/index.tsx
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
import { useAuth } from '../hooks/use-auth';
import { isNull } from '../services/utils.service';
import { ROUTE } from '../router/router.enum';
import type { UploadFile } from 'antd/es/upload/interface';

export const Dashboard: React.FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const isAuthenticated = !isNull(auth?.userProfile);

    // Import Modal & SSE State
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // AI External SPA Redirect
    const handleAskAI = () => {
        window.location.href = 'https://ai.internal.company.com'; // External SPA link
    };

    // File Import Logic
    const handleImportSubmit = () => {
        if (fileList.length === 0) {
            message.error('Please select a file to import.');
            return;
        }

        setIsUploading(true);
        setIsImportModalOpen(false);

        // Initiate SSE listener for non-blocking upload progress
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
        <div className="dashboard-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '24px' }}>
                <h2>Knowledge Dashboard</h2>
                <p style={{ color: '#666' }}>Find, review and manage internal technical knowledge</p>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
                <Input
                    size="large"
                    prefix={<SearchOutlined />}
                    placeholder="Search questions and short answers..."
                />
                {isAuthenticated && <Button type="primary" size="large">Search</Button>}
            </div>

            {/* Actions Toolbar - Authenticated Only */}
            {isAuthenticated && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <Button icon={<RobotOutlined />} onClick={handleAskAI}>Ask AI</Button>
                    <Button icon={<UploadOutlined />} onClick={() => setIsImportModalOpen(true)}>Import</Button>
                    <Button icon={<DownloadOutlined />} onClick={() => navigate(ROUTE.EXPORT)}>Export</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(ROUTE.CREATE_QUESTION)}>
                        New Question
                    </Button>
                </div>
            )}

            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <Card title={isAuthenticated ? "My Projects" : "Projects"}>
                    <span style={{ fontSize: '28px', fontWeight: 'bold' }}>4</span>
                </Card>
                <Card title={isAuthenticated ? "My Questions" : "Questions"}>
                    <span style={{ fontSize: '28px', fontWeight: 'bold' }}>37</span>
                </Card>
                <Card title="Knowledge Base">
                    <span style={{ fontSize: '28px', fontWeight: 'bold' }}>248</span>
                </Card>
            </div>

            {/* My Projects Section - Authenticated Only */}
            {isAuthenticated && (
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3>My Projects</h3>
                        <Button type="link" onClick={() => navigate(ROUTE.PROJECTS)}>View all</Button>
                    </div>
                    <Card>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Java Training</span>
                                <span style={{ color: '#888' }}>24 questions</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Spring Boot</span>
                                <span style={{ color: '#888' }}>31 questions</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Architecture</span>
                                <span style={{ color: '#888' }}>18 questions</span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Recently Added Questions Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3>Recently Added Questions</h3>
                    {isAuthenticated && (
                        <Button type="link" onClick={() => navigate(ROUTE.QUESTIONS)}>View all</Button>
                    )}
                </div>
                <Card>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <h4>What is a Java Record?</h4>
                            <p style={{ color: '#888', fontSize: '12px', margin: '4px 0' }}>Java • A2 • Updated today</p>
                            <p style={{ color: '#444' }}>"A record is a compact syntax for declaring..."</p>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
                        <div>
                            <h4>Explain OAuth2 Authorization Code Flow</h4>
                            <p style={{ color: '#888', fontSize: '12px', margin: '4px 0' }}>Security • A3 • Updated yesterday</p>
                            <p style={{ color: '#444' }}>"Authorization Code Flow allows..."</p>
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