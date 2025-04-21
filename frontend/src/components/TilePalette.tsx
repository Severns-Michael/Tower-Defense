import React, { useEffect, useState } from 'react';

// TilePalette Component: Displays all available tiles from the tileset
const TilePalette: React.FC<{ onTileSelect: (tileIndex: number) => void, tileset: string, tileSize: number }> = ({ onTileSelect, tileset, tileSize }) => {
    // Assuming you have a method to get the number of tiles in the tileset
    //todo method to get tiles in a tilesheet
    //todo make ui on right side of screen only when level editor is on 3 wide
    
    const tileCount = 100; // Change this based on the number of tiles in your tileset

    const tileArray = Array.from({ length: tileCount }, (_, index) => (
        <div
            key={index}
            style={{
                width: tileSize,
                height: tileSize,
                backgroundImage: `url(${tileset})`,
                backgroundPosition: `0 ${index * -tileSize}px`, // Adjust based on your tileset's layout
                cursor: 'pointer',
                display: 'inline-block',
            }}
            onClick={() => onTileSelect(index)} // Pass the index of the tile
        />
    ));

    return (
        <div style={{ display: 'flex', overflowX: 'scroll' }}>
            {tileArray}
        </div>
    );
};

export default TilePalette;