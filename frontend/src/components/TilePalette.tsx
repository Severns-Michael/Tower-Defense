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
            console.log('Tileset image loaded');
            console.log('Image dimensions:', image.width, image.height); // Log image dimensions

            const tilesetWidth = image.width;
            const tilesetHeight = image.height;

            const columns = Math.floor(tilesetWidth / tileSize);
            const rows = Math.floor(tilesetHeight / tileSize);

            const totalTiles = rows * columns;
            console.log(`Tileset has ${totalTiles} tiles`);

            setTileCount(totalTiles);
        };

        image.onerror = (error) => {
            console.error('Error loading tileset image', error);
        };
    }, [tileset, tileSize]);

    // Create the tile elements based on the tile count
    const tileArray = Array.from({ length: 64 }, (_, index) => { // Limit to 64 for testing
        const x = (index % tileColumns) * -tileSize;
        const y = Math.floor(index / tileColumns) * -tileSize;

        return (
            <div
                key={index}
                style={{
                    width: tileSize,
                    height: tileSize,
                    backgroundImage: `url(${tileset})`,
                    backgroundPosition: `${x}px ${y}px`,
                    backgroundRepeat: 'no-repeat',
                    cursor: 'pointer',
                    display: 'block',
                }}
                onClick={() => onTileSelect(index)}
            />
        );
    });

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${tileColumns}, ${tileSize}px)`,
                gridAutoRows: `${tileSize}px`,
                overflow: 'auto',  // Allow overflow if necessary
            }}
        >
            {tileArray}
        </div>
    );
};

export default TilePalette;