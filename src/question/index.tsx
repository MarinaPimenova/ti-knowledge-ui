import React, { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Input, Button, Card, Space, Tooltip, Typography, message } from 'antd';
import { SearchOutlined, LinkOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { ROUTE } from '../router/router.enum';
import './question.scss';
import type { QuestionRecord } from "./question.payload.interface";
import { getQuestions } from "../services/api.service";

const { Text, Paragraph } = Typography;

export const Question: React.FC = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<QuestionRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    const getQuestionList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getQuestions();
            setQuestions(response.data ?? []);
        } catch (err: any) {
            message.error(err?.message || 'Failed to load questions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void getQuestionList();
    }, [getQuestionList]);

    // Safe filtering handling null/undefined fields
    const filteredData = questions.filter((item) => {
        const query = searchText.toLowerCase();
        return (
            (item.question?.toLowerCase() ?? '').includes(query) ||
            (item.shortAnswer?.toLowerCase() ?? '').includes(query) ||
            (item.tag?.toLowerCase() ?? '').includes(query) ||
            (item.projectName?.toLowerCase() ?? '').includes(query)
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
                    {text || '—'}
                </Text>
            ),
            sorter: (a, b) => (a.question ?? '').localeCompare(b.question ?? ''),
        },
        {
            title: 'Short Answer',
            dataIndex: 'shortAnswer',
            key: 'shortAnswer',
            width: '25%',
            render: (text?: string) =>
                text ? (
                    <Paragraph
                        ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                        className="question-table__short-answer"
                    >
                        {text}
                    </Paragraph>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
            width: '12%',
            render: (tag?: string) =>
                tag ? (
                    <Tag color="blue" key={tag}>
                        {tag.toUpperCase()}
                    </Tag>
                ) : (
                    <Text type="secondary">—</Text>
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
            render: (name?: string) => name || <Text type="secondary">—</Text>,
            sorter: (a, b) => (a.projectName ?? '').localeCompare(b.projectName ?? ''),
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