import {useState, useEffect, DependencyList, RefCallback} from 'react';
import {addDropItem, removeDropItem} from './manager';

type DropConfig = {
    deps?: DependencyList,
    payload?: any,
    disabled?: boolean
};

export const useDrop = <T extends HTMLElement>(
    config: DropConfig
): RefCallback<T> => {
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
        addDropItem(item);
        return () => removeDropItem(item);
    }, [...config.deps, element]);

    return setElement;
};