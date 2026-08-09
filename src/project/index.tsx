import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Card, Space, Typography, Tag } from 'antd';
import {
    SearchOutlined,
    FolderOutlined,
    ArrowLeftOutlined,
    QuestionCircleOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { ROUTE } from '../router/router.enum';
import './project.scss';

const { Text } = Typography;

export interface ProjectRecord {
    id: string;
    projectName: string;
    questionCount: number;
    description?: string;
    updatedAt?: string;
}

// Mock Data - Replace with your API fetch call/service hook
const mockProjects: ProjectRecord[] = [
    {
        id: '1',
        projectName: 'Java Training',
        questionCount: 24,
        description: 'Core concepts, modern features (Records, Sealed Classes), and concurrency fundamentals.',
        updatedAt: 'Updated today',
    },
    {
        id: '2',
        projectName: 'Spring Boot',
        questionCount: 31,
        description: 'Dependency injection, Spring Security, Data JPA, and microservices integration.',
        updatedAt: 'Updated 2 days ago',
    },
    {
        id: '3',
        projectName: 'Architecture',
        questionCount: 18,
        description: 'Design patterns, resilient systems (Circuit Breaker, Bulkhead), and domain-driven design.',
        updatedAt: 'Updated yesterday',
    },
    {
        id: '4',
        projectName: 'DevOps & Infrastructure',
        questionCount: 12,
        description: 'Docker containerization, Kubernetes configurations, and CI/CD pipelines.',
        updatedAt: 'Updated last week',
    },
];

export const Project: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<ProjectRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setProjects(mockProjects);
            setLoading(false);
        }, 300);
    }, []);

    // Filter projects based on search query
    const filteredData = projects.filter((item) => {
        const query = searchText.toLowerCase();
        return (
            item.projectName.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query))
        );
    });

    const totalQuestions = projects.reduce((sum, item) => sum + item.questionCount, 0);

    const columns: ColumnsType<ProjectRecord> = [
        {
            title: 'Project Name',
            dataIndex: 'projectName',
            key: 'projectName',
            width: '40%',
            render: (text: string, record: ProjectRecord) => (
                <div className="project-table__name-cell">
                    <FolderOutlined className="project-table__icon" />
                    <div>
                        <Text strong className="project-table__title">
                            {text}
                        </Text>
                        {record.description && (
                            <p className="project-table__description">{record.description}</p>
                        )}
                    </div>
                </div>
            ),
            sorter: (a, b) => a.projectName.localeCompare(b.projectName),
        },
        {
            title: 'Count of Questions',
            dataIndex: 'questionCount',
            key: 'questionCount',
            width: '30%',
            render: (count: number) => (
                <Tag color="blue" icon={<QuestionCircleOutlined />} className="project-table__tag">
                    {count} {count === 1 ? 'question' : 'questions'}
                </Tag>
            ),
            sorter: (a, b) => a.questionCount - b.questionCount,
        },
        {
            title: 'Action',
            key: 'action',
            width: '30%',
            render: (_, record: ProjectRecord) => (
                <Button
                    type="link"
                    icon={<RightOutlined />}
                    iconPosition="end"
                    onClick={() => navigate(`${ROUTE.QUESTIONS}?project=${encodeURIComponent(record.projectName)}`)}
                    className="project-table__view-btn"
                >
                    View Questions
                </Button>
            ),
        },
    ];

    return (
        <div className="projects-page">
            <Card className="projects-page__card" bordered={false}>
                {/* Header Action Bar */}
                <div className="projects-page__header">
                    <div className="projects-page__title-area">
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(ROUTE.ROOT)}
                            className="projects-page__back-btn"
                        />
                        <div>
                            <h2 className="projects-page__title">All Projects</h2>
                            <p className="projects-page__subtitle">
                                Manage technical projects and view question counts per category.
                            </p>
                        </div>
                    </div>

                    <Space className="projects-page__actions">
                        <Input
                            placeholder="Search projects..."
                            prefix={<SearchOutlined />}
                            allowClear
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="projects-page__search-input"
                        />
                    </Space>
                </div>

                {/* Quick Summary Stat Badges */}
                <div className="projects-page__stats">
                    <div className="projects-page__stat-item">
                        <span className="projects-page__stat-label">Total Projects</span>
                        <span className="projects-page__stat-value">{projects.length}</span>
                    </div>
                    <div className="projects-page__stat-divider" />
                    <div className="projects-page__stat-item">
                        <span className="projects-page__stat-label">Total Questions Assigned</span>
                        <span className="projects-page__stat-value">{totalQuestions}</span>
                    </div>
                </div>

                {/* Table Layout */}
                <Table<ProjectRecord>
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '25', '50'],
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} projects`,
                    }}
                    className="projects-page__table"
                />
            </Card>
        </div>
    );
};