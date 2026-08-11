import React, { useState, useEffect } from 'react';
import { Table, Tag, Input, Button, Card, Space, Tooltip, Typography } from 'antd';
import { SearchOutlined, LinkOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { ROUTE } from '../router/router.enum';
import './question.scss';
import type {QuestionRecord} from "./question.payload.interface";

const { Text, Paragraph } = Typography;

// Mock Data - Replace with your API fetch call/service hook
const mockQuestions: QuestionRecord[] = [
    {
        id: '1',
        question: 'What is a Java Record?',
        shortAnswer: 'A record is a compact syntax for declaring transparent data-carrier classes.',
        tag: 'Java',
        projectName: 'Java Training',
        resourceUrl: 'https://docs.oracle.com/en/java/javase/17/language/records.html',
        description: 'Records were introduced in Java 14 as a preview and finalized in Java 16. They acquire automatically generated constructor, getters, equals, hashCode, and toString methods.',
    },
    {
        id: '2',
        question: 'Explain OAuth2 Authorization Code Flow',
        shortAnswer: 'Allows clients to obtain access tokens securely via authorization code exchange.',
        tag: 'Security',
        projectName: 'Architecture',
        resourceUrl: 'https://oauth.net/2/grant-types/authorization-code/',
        description: 'Best suited for confidential web applications. Utilizes front-channel user interaction and back-channel token exchange with PKCE enhancement for public clients.',
    },
    {
        id: '3',
        question: 'Explain the Circuit Breaker pattern',
        shortAnswer: 'Prevents cascading failures by short-circuiting calls to failing remote services.',
        tag: 'Resilience',
        projectName: 'Spring Boot',
        resourceUrl: 'https://resilience4j.readme.io/docs/circuitbreaker',
        description: 'Monitors execution metrics and transitions between Closed, Open, and Half-Open states based on failure rate thresholds.',
    },
];

export const Question: React.FC = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<QuestionRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        // Simulating data fetch
        setLoading(true);
        setTimeout(() => {
            setQuestions(mockQuestions);
            setLoading(false);
        }, 300);
    }, []);

    // Filter questions based on search query
    const filteredData = questions.filter((item) => {
        const query = searchText.toLowerCase();
        return (
            item.question.toLowerCase().includes(query) ||
            item.shortAnswer.toLowerCase().includes(query) ||
            item.tag.toLowerCase().includes(query) ||
            item.projectName.toLowerCase().includes(query)
        );
    });

    const columns: ColumnsType<QuestionRecord> = [
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
            width: '22%',
            render: (text: string) => (
                <Text strong className="question-table__title">
                    {text}
                </Text>
            ),
            sorter: (a, b) => a.question.localeCompare(b.question),
        },
        {
            title: 'Short Answer',
            dataIndex: 'shortAnswer',
            key: 'shortAnswer',
            width: '25%',
            render: (text: string) => (
                <Paragraph
                    ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                    className="question-table__short-answer"
                >
                    {text}
                </Paragraph>
            ),
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
            width: '12%',
            render: (tag: string) => (
                <Tag color="blue" key={tag}>
                    {tag.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: 'Java', value: 'Java' },
                { text: 'Security', value: 'Security' },
                { text: 'Resilience', value: 'Resilience' },
            ],
            onFilter: (value, record) => record.tag === value,
        },
        {
            title: 'Project Name',
            dataIndex: 'projectName',
            key: 'projectName',
            width: '15%',
            sorter: (a, b) => a.projectName.localeCompare(b.projectName),
        },
        {
            title: 'Resource URL',
            dataIndex: 'resourceUrl',
            key: 'resourceUrl',
            width: '12%',
            render: (url?: string) =>
                url ? (
                    <Tooltip title={url}>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="question-table__link"
                        >
                            <LinkOutlined /> Resource
                        </a>
                    </Tooltip>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '16%',
            render: (description?: string) =>
                description ? (
                    <Paragraph
                        ellipsis={{ rows: 2, expandable: true, symbol: 'read more' }}
                        className="question-table__description"
                    >
                        {description}
                    </Paragraph>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
    ];

    return (
        <div className="questions-page">
            <Card className="questions-page__card" bordered={false}>
                {/* Header Action Bar */}
                <div className="questions-page__header">
                    <div className="questions-page__title-area">
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(ROUTE.ROOT)}
                            className="questions-page__back-btn"
                        />
                        <div>
                            <h2 className="questions-page__title">All Questions</h2>
                            <p className="questions-page__subtitle">
                                Browse, search, and manage all repository questions across projects.
                            </p>
                        </div>
                    </div>

                    <Space className="questions-page__actions">
                        <Input
                            placeholder="Search questions, tags, or projects..."
                            prefix={<SearchOutlined />}
                            allowClear
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="questions-page__search-input"
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate(ROUTE.CREATE_QUESTION)}
                        >
                            New Question
                        </Button>
                    </Space>
                </div>

                {/* Table Layout */}
                <Table<QuestionRecord>
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '25', '50'],
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} questions`,
                    }}
                    className="questions-page__table"
                />
            </Card>
        </div>
    );
};
