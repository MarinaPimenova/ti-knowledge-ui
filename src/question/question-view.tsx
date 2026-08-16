import React from 'react';
import { Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { QuestionDetails } from './question.payload.interface';
import './question.scss';

const { Paragraph, Title } = Typography;

interface QuestionViewProps {
    question: QuestionDetails;
    currentUser: string;
    onDelete: (id: number) => void;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
                                                              question,
                                                              currentUser,
                                                              onDelete,
                                                          }) => {
    const isOwner = question.createdBy === currentUser;

    return (
        <Card title="Question Details" className="question-view__card">
            <Descriptions column={1} bordered>
                <Descriptions.Item label="Question">
                    {question.question}
                </Descriptions.Item>

                <Descriptions.Item label="Short Answer">
                    {question.shortAnswer}
                </Descriptions.Item>

                {question.detailedAnswer && (
                    <Descriptions.Item label="Detailed Answer">
                        <Paragraph>{question.detailedAnswer}</Paragraph>
                    </Descriptions.Item>
                )}

                {question.difficultyCode && (
                    <Descriptions.Item label="Difficulty">
                        <Tag color="blue">{question.difficultyCode}</Tag>
                    </Descriptions.Item>
                )}

                <Descriptions.Item label="Tags">
                    <Space wrap>
                        {question.tags.map(tag => (
                            <Tag key={tag.id}>{tag.tag}</Tag>
                        ))}
                    </Space>
                </Descriptions.Item>

                {question.projects.length > 0 && (
                    <Descriptions.Item label="Projects">
                        <Space wrap>
                            {question.projects.map(project => (
                                <Tag color="green" key={project.id}>
                                    {project.name}
                                </Tag>
                            ))}
                        </Space>
                    </Descriptions.Item>
                )}

                {question.resources.length > 0 && (
                    <Descriptions.Item label="Resources">
                        <Space
                            direction="vertical"
                            className="question-view__resources"
                        >
                            {question.resources.map(resource => (
                                <div
                                    key={resource.id ?? resource.url}
                                    className="question-view__resource"
                                >
                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {resource.url}
                                    </a>

                                    {resource.description && (
                                        <div className="question-view__resource-description">
                                            {resource.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Space>
                    </Descriptions.Item>
                )}
            </Descriptions>

            {question.codeExample && (
                <div className="question-view__code">
                    <Title level={5}>Code Example</Title>

                    <div className="question-view__language">
                        {question.codeExample.language}
                    </div>

                    <pre className="question-view__source-code">
                        {question.codeExample.sourceCode}
                    </pre>
                </div>
            )}

            {isOwner && (
                <div className="question-view__actions">
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(question.id)}
                    >
                        Remove Question
                    </Button>
                </div>
            )}
        </Card>
    );
};