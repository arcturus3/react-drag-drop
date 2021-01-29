import {useState, useEffect, DependencyList, RefCallback} from 'react';
import {addDropItem, removeDropItem} from './manager';

export type DropConfig = {
    deps?: DependencyList,
    payload?: any,
    disabled?: boolean
};

// todo: shares redundant code with useDrag
export const useDrop = (
    config: DropConfig = {}
): RefCallback<HTMLElement> => {
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
        addDropItem(item);
        return () => removeDropItem(item);
    }, [...normalizedConfig.deps, element]);

    return setElement;
};