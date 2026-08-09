// question/question-create.tsx
import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '../router/router.enum';

interface QuestionFormValues {
    question: string;
    shortAnswer: string;
    resourceUrl?: string;
    description?: string;
}

export const QuestionCreate: React.FC = () => {
    const [form] = Form.useForm<QuestionFormValues>();
    const navigate = useNavigate();

    const handleSubmit = (values: QuestionFormValues) => {
        // Business Validation: Ensure at least resourceUrl OR description is populated
        if (!values.resourceUrl?.trim() && !values.description?.trim()) {
            message.error('Either Resource URL or Description must be provided.');
            return;
        }

        // Send create request to backend API...
        message.success('Question created successfully!');
        navigate(ROUTE.QUESTIONS);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '24px auto' }}>
            <Card title="Create New Question">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="question"
                        label="Question"
                        rules={[{ required: true, message: 'Question is required' }]}
                    >
                        <Input placeholder="e.g. What is a Java Record?" />
                    </Form.Item>

                    <Form.Item
                        name="shortAnswer"
                        label="Short Answer"
                        rules={[{ required: true, message: 'Short answer is required' }]}
                    >
                        <Input.TextArea rows={2} placeholder="Provide a quick summary..." />
                    </Form.Item>

                    <Form.Item name="resourceUrl" label="Resource URL">
                        <Input placeholder="https://..." />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} placeholder="Detailed explanation or resource notes..." />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <Button onClick={() => navigate(ROUTE.ROOT)}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};