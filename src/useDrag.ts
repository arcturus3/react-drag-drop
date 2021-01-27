import {useState, useEffect, DependencyList, RefCallback} from 'react';
import {addDragItem, removeDragItem} from './manager';

type DragConfig = {
    deps?: DependencyList,
    payload?: any,
    disabled?: boolean
};

export const useDrag = <T extends HTMLElement>(
    config: DragConfig
): RefCallback<T> => {
    // instead of ref to guarantee rerender when element changes for dependency list
    const [element, setElement] = useState<T | null>(null);

    if (!config.deps)
        config.deps = [];
    if (config.disabled === undefined)
        config.disabled = false;

    useEffect(() => {
        if (!element) return;
        const item = {
            element: element,
            payload: config.payload,
            disabled: config.disabled!
        };
        addDragItem(item);
        return () => removeDragItem(item);
    }, [...config.deps, element]);

    return setElement;
};