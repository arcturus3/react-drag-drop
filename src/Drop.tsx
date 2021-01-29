import React from 'react';
import {useDrop, DropConfig} from './useDrop';

type DropProps = DropConfig;

export const Drop: React.FC<DropProps> = props => {
    const ref = useDrop(props);

    return (
        <div
            ref={ref}
            style={{
                display: 'inline-block'
            }}
        >
            {props.children}
        </div>
    );
};