import React from 'react';

interface NextRoundButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

const NextRoundButton: React.FC<NextRoundButtonProps> = ({ onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                bottom: '30px',
                right: '30px',
                padding: '12px 24px',
                backgroundColor: disabled ? '#333' : '#00ffff',
                color: disabled ? '#888' : '#000',
                fontSize: '18px',
                border: 'none',
                borderRadius: '8px',
                boxShadow: disabled ? 'none' : '0 0 10px #00ffff',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
            }}
        >
            ▶ Next Round
        </button>
    );
};

export default NextRoundButton;