import React from 'react';
import TilePalette from './TilePalette';

interface PaletteConfig {
    label: string;
    tileset: string;
    tileSize: number;
}

const TilePaletteGroup: React.FC<{
    palettes: PaletteConfig[];
    onTileSelect: (tileIndex: number, paletteIndex: number) => void;
}> = ({ palettes, onTileSelect }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {palettes.map((palette, index) => (
                <div
                    key={index}
                    style={{
                        backgroundColor: 'rgba(0, 20, 40, 0.9)',
                        border: '2px solid #00ffff',
                        borderRadius: '12px',
                        padding: '12px',
                        boxShadow: '0 0 12px rgba(0, 255, 255, 0.2)',
                    }}
                >
                    <h4 style={{
                        textAlign: 'center',
                        margin: '0 0 8px',
                        color: '#00ffff',
                        fontSize: '16px',
                        letterSpacing: '1px'
                    }}>
                        {palette.label}
                    </h4>
                    <TilePalette
                        label={palette.label}
                        tileset={palette.tileset}
                        tileSize={palette.tileSize}
                        onTileSelect={(tileIndex) => onTileSelect(tileIndex, index)}
                    />
                </div>
            ))}
        </div>
    );
};

export default TilePaletteGroup;