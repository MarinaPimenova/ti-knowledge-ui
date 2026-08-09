import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import type { ISupportContactPayload } from './notification.interface';
import { sendEmailToSupport } from '../../services/rest.service';
import './network-error.scss';

export const BaseNetworkError = () => {
    const { code } = useParams();
    const [emailResponse, setEmailResponse] = useState('');

    const sendEmail = async (errorMessage: string | undefined) => {
        const contactPayload: ISupportContactPayload = {
            body: errorMessage! || '',
        };

        try {
            await sendEmailToSupport(contactPayload);
            setEmailResponse('An email was successfully sent.');
        } catch (error: any) {
            setEmailResponse(`${error.message}`);
        }
    };

    return (
        <div className="error__content">
            <div className="error-container">
                <div className="error__msg">{code}</div>
                <Button type="primary" onClick={() => sendEmail(code)} className="mt-2">
                    Contact Support
                </Button>
                <div>
                    <pre>{emailResponse !== '' ? emailResponse : <></>}</pre>
                </div>
            </div>
        </div>
    );
};