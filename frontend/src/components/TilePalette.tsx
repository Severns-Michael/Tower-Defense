import React, { useState, useEffect } from 'react';

const TilePalette: React.FC<{
    onTileSelect: (tileIndex: number) => void;
    tileset: string;
    tileSize: number;
    label: string;

}> = ({ label, onTileSelect, tileset, tileSize }) => {
    const [tileCount, setTileCount] = useState<number>(0);
    const [tileColumns, setTileColumns] = useState<number>(1);
    const [tileRows, setTileRows] = useState<number>(1);

    useEffect(() => {
        const image = new Image();
        image.src = tileset;

        image.onload = () => {
            const width = image.width;
            const height = image.height;

            const columns = Math.floor(width / tileSize);
            const rows = Math.floor(height / tileSize);
            const totalTiles = columns * rows;

            setTileColumns(columns);
            setTileRows(rows);
            setTileCount(totalTiles);

            console.log('Image size:', width, height);
            console.log('Tile columns:', columns);
            console.log('Tile rows:', rows);
            console.log(`Tileset has ${totalTiles} tiles`);
        };
    }, [tileset, tileSize]);

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${tileColumns}, ${tileSize}px)`,
                gap: '2px',
                maxHeight: '100vh',
                overflowY: 'auto',
                padding: '4px',
            }}
        >
            {Array.from({ length: tileCount }).map((_, index) => {
                const col = index % tileColumns;
                const row = Math.floor(index / tileColumns);

                return (
                    <div
                        key={`tile-${index}`}
                        onClick={() => onTileSelect(index)}
                        style={{
                            width: tileSize,
                            height: tileSize,
                            backgroundImage: `url(${tileset})`,
                            backgroundPosition: `-${col * tileSize}px -${row * tileSize}px`,
                            backgroundSize: `${tileColumns * tileSize}px ${tileRows * tileSize}px`,
                            imageRendering: 'pixelated',
                            backgroundRepeat: 'no-repeat',
                            border: '1px solid #ccc',
                            boxSizing: 'border-box',
                            cursor: 'pointer',
                        }}
                    />
                );
            })}
        </div>
    );
};

export default TilePalette;