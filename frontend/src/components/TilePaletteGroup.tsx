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
                <div key={index}>
                    <h4 style={{ textAlign: 'center', margin: '0 0 4px' }}>{palette.label}</h4>
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