import React, {useState} from 'react';
import {useDrag, DragConfig} from './useDrag';
import {globalConfig} from './DragView';

type DragProps = DragConfig & {
    previewChildren?: boolean
};

export const Drag: React.FC<DragProps> = props => {
    const [hovering, setHovering] = useState(false);
    const ref = useDrag({
        deps: props.deps,
        disabled: props.disabled,
        payload: props.previewChildren
            ? {
                data: props.payload,
                preview: props.children
            }
            : props.payload
    });

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{
                display: 'inline-block',
                touchAction: 'none',
                cursor: hovering ? globalConfig.hoverCursor : undefined
            }}
        >
            {props.children}
        </div>
    );
};