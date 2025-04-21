import React, { useState, useEffect } from 'react';

const TilePalette: React.FC<{ onTileSelect: (tileIndex: number) => void, tileset: string, tileSize: number, tileColumns: number }> = ({
                                                                                                                                          onTileSelect,
                                                                                                                                          tileset,
                                                                                                                                          tileSize,
                                                                                                                                          tileColumns
                                                                                                                                      }) => {
    const [tileCount, setTileCount] = useState<number>(0);

    // Dynamically calculate the number of tiles in the tileset image
    useEffect(() => {
        const image = new Image();
        image.src = tileset;

        image.onload = () => {
            const tilesetWidth = image.width;
            const tilesetHeight = image.height;

            // Assuming tiles are arranged in a grid with the same width and height
            const columns = Math.floor(tilesetWidth / tileSize);
            const rows = Math.floor(tilesetHeight / tileSize);
            setTileCount(rows * columns);
        };
    }, [tileset, tileSize]);

    // Create the tile elements based on the tile count
    const tileArray = Array.from({ length: tileCount }, (_, index) => (
        <div
            key={index}
            style={{
                width: tileSize,
                height: tileSize,
                backgroundImage: `url(${tileset})`,
                backgroundPosition: `-${(index % tileColumns) * tileSize}px -${Math.floor(index / tileColumns) * tileSize}px`,
                cursor: 'pointer',
                display: 'inline-block',
                border: '1px solid transparent', // Default border
                transition: 'border 0.2s ease',
            }}
            onClick={() => onTileSelect(index)} // Pass the index of the tile
            onMouseEnter={(e) => {
                e.currentTarget.style.border = '2px solid #fff'; // Highlight the tile on hover
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid transparent'; // Remove highlight
            }}
        />
    ));

    return (
        <div style={{ display: 'flex', overflowX: 'scroll', marginTop: '10px' }}>
            {tileArray}
        </div>
    );
};

export default TilePalette;