import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Table, Tag, Space, Typography, message } from 'antd';
import { ArrowLeftOutlined, SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { ROUTE } from '../router/router.enum';
import './project-create.scss';

const { Text } = Typography;

export interface AssignableQuestion {
    id: string;
    question: string;
    shortAnswer: string;
    tag: string;
    currentProject?: string;
}

export interface ProjectCreateFormValues {
    projectName: string;
    projectLead: string;
}

// Mock available questions repository
const mockAvailableQuestions: AssignableQuestion[] = [
    {
        id: 'q1',
        question: 'What is a Java Record?',
        shortAnswer: 'Compact syntax for declaring transparent data-carrier classes.',
        tag: 'Java',
        currentProject: 'Unassigned',
    },
    {
        id: 'q2',
        question: 'Explain OAuth2 Authorization Code Flow',
        shortAnswer: 'Allows clients to obtain access tokens securely via authorization code exchange.',
        tag: 'Security',
        currentProject: 'Architecture',
    },
    {
        id: 'q3',
        question: 'Explain the Circuit Breaker pattern',
        shortAnswer: 'Prevents cascading failures by short-circuiting calls to failing remote services.',
        tag: 'Resilience',
        currentProject: 'Spring Boot',
    },
    {
        id: 'q4',
        question: 'What is Virtual Threads in Java 21?',
        shortAnswer: 'Lightweight threads that dramatically reduce the effort of writing high-throughput concurrent applications.',
        tag: 'Java',
        currentProject: 'Unassigned',
    },
];

export const ProjectCreate: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm<ProjectCreateFormValues>();

    const [questions, setQuestions] = useState<AssignableQuestion[]>([]);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setQuestions(mockAvailableQuestions);
            setLoading(false);
        }, 300);
    }, []);

    const filteredQuestions = questions.filter(
        (q) =>
            q.question.toLowerCase().includes(searchText.toLowerCase()) ||
            q.shortAnswer.toLowerCase().includes(searchText.toLowerCase()) ||
            q.tag.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: ColumnsType<AssignableQuestion> = [
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
            width: '35%',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Short Answer',
            dataIndex: 'shortAnswer',
            key: 'shortAnswer',
            width: '40%',
            ellipsis: true,
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
            width: '25%',
            render: (tag: string) => <Tag color="blue">{tag.toUpperCase()}</Tag>,
        },
    ];

    const handleSubmit = (values: ProjectCreateFormValues) => {
        const payload = {
            projectName: values.projectName.trim(),
            projectLead: values.projectLead.trim(),
            assignedQuestionIds: selectedQuestionIds, // Optional: array can be empty
        };

        console.log('Submitting new project:', payload);

        message.success(`Project "${payload.projectName}" created successfully!`);
        navigate(ROUTE.PROJECTS);
    };

    return (
        <div className="project-create-page">
            <Card className="project-create-page__card" bordered={false}>
                {/* Title Header */}
                <div className="project-create-page__header">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(ROUTE.PROJECTS)}
                        className="project-create-page__back-btn"
                    />
                    <div>
                        <h2 className="project-create-page__title">Create Project</h2>
                        <p className="project-create-page__subtitle">
                            Define a new project and optionally assign existing questions to it.
                        </p>
                    </div>
                </div>

                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    {/* Mandatory Form Inputs */}
                    <div className="project-create-page__form-grid">
                        <Form.Item
                            name="projectName"
                            label="Project Name"
                            rules={[{ required: true, message: 'Project Name is mandatory' }]}
                        >
                            <Input placeholder="e.g. Microservices Core Training" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="projectLead"
                            label="Project Lead"
                            rules={[{ required: true, message: 'Project Lead is mandatory' }]}
                        >
                            <Input placeholder="e.g. John Doe" size="large" />
                        </Form.Item>
                    </div>

                    {/* Optional Question Selection Table */}
                    <div className="project-create-page__questions-section">
                        <div className="project-create-page__section-header">
                            <div>
                                <h3 className="project-create-page__section-title">
                                    <QuestionCircleOutlined /> Assign Questions (Optional)
                                </h3>
                                <p className="project-create-page__section-subtitle">
                                    Selected ({selectedQuestionIds.length} question
                                    {selectedQuestionIds.length === 1 ? '' : 's'})
                                </p>
                            </div>
                            <Input
                                placeholder="Filter questions..."
                                prefix={<SearchOutlined />}
                                allowClear
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="project-create-page__search-input"
                            />
                        </div>

                        <Table<AssignableQuestion>
                            columns={columns}
                            dataSource={filteredQuestions}
                            rowKey="id"
                            loading={loading}
                            rowSelection={{
                                selectedRowKeys: selectedQuestionIds,
                                onChange: (keys) => setSelectedQuestionIds(keys),
                            }}
                            pagination={{
                                defaultPageSize: 5,
                                showSizeChanger: true,
                                pageSizeOptions: ['5', '10', '20'],
                            }}
                            className="project-create-page__table"
                        />
                    </div>

                    {/* Form Action Buttons */}
                    <div className="project-create-page__actions">
                        <Space>
                            <Button size="large" onClick={() => navigate(ROUTE.PROJECTS)}>
                                Cancel
                            </Button>
                            <Button type="primary" size="large" htmlType="submit">
                                Create
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    );
};