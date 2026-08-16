import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Form,
    Input,
    Select,
    Space,
    message
} from 'antd';
import {
    MinusCircleOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { ROUTE } from '../router/router.enum';
import {
    createNewQuestion,
    getProjects,
    getTags,
    getQuestionLevels
} from '../services/api.service';

import type {
    CreateQuestionRequest,
    ResourceRequest,
    TagDto,
    ProjectDto,
    QuestionLevelDto
} from './question.payload.interface';

import './question.scss';

const { TextArea } = Input;

interface QuestionFormValues {
    question: string;
    shortAnswer: string;
    detailedAnswer?: string;
    questionLevelId?: number;
    language?: string;
    sourceCode?: string;
    tagIds: number[];
    projectIds: number[];
    resources: ResourceRequest[];
}

const languageOptions = [
    { label: 'Java', value: 'JAVA' },
    { label: 'Kotlin', value: 'KOTLIN' },
    { label: 'SQL', value: 'SQL' },
    { label: 'JavaScript', value: 'JAVASCRIPT' },
    { label: 'TypeScript', value: 'TYPESCRIPT' }
];

export const QuestionCreate: React.FC = () => {
    const [form] = Form.useForm<QuestionFormValues>();
    const [submitting, setSubmitting] = useState(false);

    const [tags, setTags] = useState<TagDto[]>([]);
    const [projects, setProjects] = useState<ProjectDto[]>([]);
    const [questionLevels, setQuestionLevels] = useState<QuestionLevelDto[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoadingOptions(true);

                const [tagsResponse, projectsResponse, levelsResponse] =
                    await Promise.all([
                        getTags(),
                        getProjects(),
                        getQuestionLevels()
                    ]);

                setTags(tagsResponse.data);
                setProjects(projectsResponse.data);
                setQuestionLevels(levelsResponse.data);
            } catch (error) {
                console.error('Failed to load question options:', error);
                message.error('Failed to load question options');
            } finally {
                setLoadingOptions(false);
            }
        };

        loadOptions();
    }, []);

    const handleSubmit = async (values: QuestionFormValues) => {
        const payload: CreateQuestionRequest = {
            question: values.question.trim(),
            shortAnswer: values.shortAnswer.trim(),
            detailedAnswer: values.detailedAnswer?.trim() || undefined,
            questionLevelId: values.questionLevelId,

            codeExample:
                values.language && values.sourceCode?.trim()
                    ? {
                        language: values.language,
                        sourceCode: values.sourceCode.trim()
                    }
                    : undefined,

            tagIds: values.tagIds,
            projectIds: values.projectIds ?? [],
            resources: values.resources ?? []
        };

        try {
            setSubmitting(true);

            await createNewQuestion(payload);

            message.success('Question created successfully');
            navigate(ROUTE.QUESTIONS);
        } catch (error) {
            console.error('Failed to create question:', error);
            message.error('Failed to create question');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="question-create">
            <Card
                title="Create Question"
                className="question-create__card"
            >
                <Form<QuestionFormValues>
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        tagIds: [],
                        projectIds: [],
                        resources: []
                    }}
                >
                    <Form.Item
                        name="question"
                        label="Question"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: 'Question is required'
                            }
                        ]}
                    >
                        <Input placeholder="Enter the question" />
                    </Form.Item>

                    <Form.Item
                        name="shortAnswer"
                        label="Short Answer"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: 'Short answer is required'
                            }
                        ]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Provide a short answer"
                        />
                    </Form.Item>

                    <Form.Item
                        name="detailedAnswer"
                        label="Detailed Answer"
                    >
                        <TextArea
                            rows={6}
                            placeholder="Provide a detailed explanation"
                        />
                    </Form.Item>

                    <Form.Item
                        name="questionLevelId"
                        label="Difficulty"
                    >
                        <Select
                            allowClear
                            loading={loadingOptions}
                            placeholder="Select difficulty"
                            options={questionLevels.map(level => ({
                                label: level.difficultyCode,
                                value: level.questionLevelId
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="tagIds"
                        label="Tags"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value?.length
                                        ? Promise.resolve()
                                        : Promise.reject(
                                            new Error(
                                                'At least one tag is required'
                                            )
                                        )
                            }
                        ]}
                    >
                        <Select
                            mode="multiple"
                            loading={loadingOptions}
                            placeholder="Select at least one tag"
                            options={tags.map(tag => ({
                                label: tag.tag,
                                value: tag.id
                            }))}
                            optionFilterProp="label"
                        />
                    </Form.Item>

                    <Form.Item
                        name="projectIds"
                        label="Projects"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            loading={loadingOptions}
                            placeholder="Select projects"
                            options={projects.map(project => ({
                                label: project.name,
                                value: project.id
                            }))}
                            optionFilterProp="label"
                        />
                    </Form.Item>

                    <Card
                        size="small"
                        title="Code Example"
                        className="question-create__section"
                    >
                        <Form.Item
                            name="language"
                            label="Language"
                        >
                            <Select
                                allowClear
                                placeholder="Select language"
                                options={languageOptions}
                            />
                        </Form.Item>

                        <Form.Item
                            name="sourceCode"
                            label="Source Code"
                        >
                            <TextArea
                                rows={10}
                                placeholder="Enter source code"
                            />
                        </Form.Item>
                    </Card>

                    <Card
                        size="small"
                        title="Resources"
                        className="question-create__section"
                    >
                        <Form.List name="resources">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(field => (
                                        <Space
                                            key={field.key}
                                            align="start"
                                            className="question-create__resource-row"
                                        >
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'url']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'URL is required'
                                                    },
                                                    {
                                                        type: 'url',
                                                        message:
                                                            'Enter a valid URL'
                                                    }
                                                ]}
                                            >
                                                <Input
                                                    placeholder="Resource URL"
                                                    className="question-create__resource-url"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                {...field}
                                                name={[
                                                    field.name,
                                                    'description'
                                                ]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message:
                                                            'Description is required'
                                                    }
                                                ]}
                                            >
                                                <Input
                                                    placeholder="Description"
                                                    className="question-create__resource-description"
                                                />
                                            </Form.Item>

                                            <MinusCircleOutlined
                                                className="question-create__remove-resource"
                                                onClick={() =>
                                                    remove(field.name)
                                                }
                                            />
                                        </Space>
                                    ))}

                                    <Button
                                        type="dashed"
                                        icon={<PlusOutlined />}
                                        onClick={() => add()}
                                    >
                                        Add Resource
                                    </Button>
                                </>
                            )}
                        </Form.List>
                    </Card>

                    <div className="question-create__actions">
                        <Button
                            disabled={submitting}
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitting}
                        >
                            Create Question
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};