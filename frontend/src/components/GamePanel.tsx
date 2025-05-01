import React from 'react';

const GamePanel: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
    return (
        <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #00ffff',
            color: 'white',
            width: '320px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            <h3 style={{ color: '#00ffff', marginBottom: '10px', textAlign: 'center' }}>{title}</h3>
            {children}
        </div>
    );
};

export default GamePanel;