// export/index.tsx
import React, { useState } from 'react';
import { Card, Select, Radio, Button, Modal, message } from 'antd';

export const ExportPage: React.FC = () => {
    const [format, setFormat] = useState<'csv' | 'excel'>('csv');
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);

        const eventSource = new EventSource(`/api/export/process?format=${format}&project=${selectedProject || ''}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.status === 'COMPLETED') {
                Modal.success({
                    title: 'Export Completes',
                    content: 'Your export file is ready for download.',
                });
                eventSource.close();
                setIsExporting(false);
            }
        };

        eventSource.onerror = () => {
            message.error('Export failed to process.');
            eventSource.close();
            setIsExporting(false);
        };
    };

    return (
        <div style={{ maxWidth: '800px', margin: '24px auto' }}>
            <Card title="Export Knowledge Base">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Select or Find project to export
                        </label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="All Projects or select specific..."
                            allowClear
                            onChange={(value) => setSelectedProject(value)}
                            options={[
                                { value: 'java', label: 'Java Training' },
                                { value: 'spring', label: 'Spring Boot' },
                                { value: 'arch', label: 'Architecture' },
                            ]}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Format</label>
                        <Radio.Group value={format} onChange={(e) => setFormat(e.target.value)}>
                            <Radio value="csv">CSV</Radio>
                            <Radio value="excel">Excel (.xlsx)</Radio>
                        </Radio.Group>
                    </div>

                    <Button type="primary" loading={isExporting} onClick={handleExport}>
                        Start Export
                    </Button>
                </div>
            </Card>
        </div>
    );
};