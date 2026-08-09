import {Outlet} from 'react-router-dom';
import {PublicHeader} from '../components/header/public-header';
import {ScrollToTop} from '../components/scroll-to-top';

export const PublicLayout = () => {

    let content = (<>
            <ScrollToTop/>
            <PublicHeader/>
            <div className="container">
                <div className="content">
                    <Outlet/>
                </div>
            </div>
        </>
    );

    return (<>{content}</>);
};