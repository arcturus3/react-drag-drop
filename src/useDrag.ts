import {useState, useEffect, DependencyList, RefCallback} from 'react';
import {addDragItem, removeDragItem} from './manager';

// todo: threshold
export type DragConfig = {
    deps?: DependencyList,
    payload?: any,
    disabled?: boolean
};

export const useDrag = (
    config: DragConfig = {}
): RefCallback<HTMLElement> => {
    // instead of ref to guarantee rerender when element changes for dependency list
    const [element, setElement] = useState<HTMLElement | null>(null);

    const normalizedConfig = {
        payload: config.payload,
        disabled: !!config.disabled,
        deps: config.deps || []
    };

    useEffect(() => {
        if (!element) return;
        const item = {
            ...normalizedConfig,
            element
        };
        addDragItem(item);
        return () => removeDragItem(item);
    }, [...normalizedConfig.deps, element]);

    return setElement;
};