import React from 'react';

export const LogoutIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg
            viewBox="0 0 500 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            {...props}
        >
            {/* Background Soft Backdrop Shape */}
            <path
                d="M100 210C80 130 180 50 280 60C380 70 430 160 410 240C390 320 280 340 180 330C110 320 120 260 100 210Z"
                fill="#EAEFF8"
            />

            {/* Framed Picture on Wall */}
            <rect x="110" y="100" width="60" height="60" rx="4" fill="#BAC6DC" stroke="#A3B2CD" strokeWidth="2" />
            <path d="M120 145L135 125L150 145H120Z" fill="#889BBF" />
            <path d="M140 145L150 132L162 145H140Z" fill="#7185AD" />
            <circle cx="132" cy="118" r="5" fill="#889BBF" />

            {/* Desk Surface */}
            <rect x="50" y="310" width="400" height="12" rx="4" fill="#E2D6C5" />

            {/* Potted Plant */}
            <path d="M75 285L78 310H98L101 285H75Z" fill="#EAE5DC" stroke="#CFC8BD" strokeWidth="2" />
            {/* Plant Leaves */}
            <path d="M82 285C70 270 65 250 82 245C85 260 85 275 82 285Z" fill="#5F8367" />
            <path d="M88 285C88 265 98 250 102 255C100 270 93 280 88 285Z" fill="#4B6952" />
            <path d="M92 285C98 275 110 268 112 275C108 282 100 285 92 285Z" fill="#5F8367" />

            {/* Closed Laptop on Desk */}
            <ellipse cx="205" cy="308" rx="55" ry="5" fill="#9DA9BC" />
            {/* Laptop Base */}
            <path d="M150 305L160 295H250L260 305H150Z" fill="#4A5568" />
            <path d="M145 308C145 305 150 305 155 305H255C260 305 265 305 265 308C265 310 260 310 255 310H155C150 310 145 310 145 308Z" fill="#2D3748" />
            <rect x="195" y="306" width="20" height="2" rx="1" fill="#718096" />

            {/* Closed Notebook Stack */}
            <rect x="275" y="292" width="45" height="13" rx="2" fill="#2B4C7E" />
            <rect x="277" y="290" width="43" height="3" fill="#E2E8F0" />
            <rect x="272" y="300" width="50" height="8" rx="2" fill="#1E293B" />

            {/* Work Bag / Briefcase */}
            <rect x="330" y="235" width="80" height="70" rx="8" fill="#1E2A47" />
            <path d="M330 245H410V250H330V245Z" fill="#162038" />
            {/* Bag Handles */}
            <path d="M350 235V220C350 215 360 215 370 215C380 215 390 215 390 220V235" stroke="#162038" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Bag Strap Details */}
            <rect x="345" y="245" width="8" height="60" rx="2" fill="#162038" />
            <rect x="387" y="245" width="8" height="60" rx="2" fill="#162038" />
        </svg>
    );
};