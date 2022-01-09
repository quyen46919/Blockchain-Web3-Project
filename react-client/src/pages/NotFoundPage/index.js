import React from 'react';
import notFound from 'assets/images/404.png';
import './styles.scss';

function NotFoundPage() {
    return (
        <div className="not-found">
            <img src={notFound} alt="404 not found image" />
        </div>
    );
}

export default NotFoundPage;