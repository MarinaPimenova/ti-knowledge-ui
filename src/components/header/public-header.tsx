import { Logo } from './assets/ti-logo.svg';
import { login } from '../../utils/user-util';
import './header.scss';

export const PublicHeader = () => {
    return (
        <header className="header" data-testid="header">
            <div className="nav">
                <div className="flex align-center">
                    <div className="header_logo" data-testid="rwdex-logo">
                        <Logo />
                    </div>
                </div>
                {login}
            </div>
        </header>
    );
};