import React, {useEffect, useRef} from 'react';
import {useDragDrop, DragDropConfig} from './useDragDrop';

// todo: should use context or let Drag components subscribe to config to rerender
// on updates to it, but these properties are very unlikely to change in practice
// (plus the new value of hoverCursor will be used after mouse leaves and enters again)
export let globalConfig = {
    hoverCursor: ''
};

export type DragViewProps = Omit<DragDropConfig, 'stateProps'> & {
    preview?: (payload: any) => React.ReactNode,
    hoverCursor?: string,
    dragCursor?: string
};

export const DragView: React.FC<DragViewProps> = props => {
    const originalUserSelect = useRef('');

    const {
        // typescript doesn't error without optional chaining?
        preview = payload => payload?.preview,
        hoverCursor = '',
        dragCursor = '',
        ...config
    } = props;

    const state = useDragDrop({
        ...config,
        onDragStart: (state, prevState) => {
            config.onDragStart?.(state, prevState);
            originalUserSelect.current = document.body.style.userSelect;
            document.body.style.userSelect = 'none';
        },
        onDragEnd: (state, prevState) => {
            config.onDragEnd?.(state, prevState);
            document.body.style.userSelect = originalUserSelect.current;
        }
    });

    useEffect(() => {
        globalConfig = {
            hoverCursor
        };
    }, [hoverCursor]);

    if (!state.dragging)
        return null;

    return (
        <div style={{
            position: 'fixed',
            zIndex: 1,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            cursor: dragCursor
        }}>
            <div style={{
                transform: `translate(
                    ${state.elementPosition!.x}px,
                    ${state.elementPosition!.y}px
                )`
            }}>
                {preview?.(state.dragPayload)}
            </div>
        </div>
    );
};