import React from 'react';
import {useDrag, useDrop, useDragDrop} from 'react-drag-drop';

export const Hooks = () => {
    const dragRef = useDrag();
    const dropRef = useDrop();
    const state = useDragDrop({
        onDrop: () => alert('dropped')
    });

    const dragStyle = {
        display: 'inline-block',
        transform: state.dragging
            ? `translate(
                ${state.displacement!.x}px,
                ${state.displacement!.y}px
            )`
            : undefined
    };

    return <>
        <span ref={dragRef} style={dragStyle}>drag</span>
        <br />
        <span ref={dropRef}>drop</span>
    </>;
};