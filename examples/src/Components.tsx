import React from 'react';
import {Drag, Drop, DragView} from '@arcturus3/react-drag-drop';

export const Components = () => <>
    <DragView onDrop={() => alert('dropped')} />
    <Drag previewChildren>drag</Drag>
    <br />
    <Drop>drop</Drop>
</>;