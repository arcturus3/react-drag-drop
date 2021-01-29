import {useState, useEffect, DependencyList} from 'react';
import equal from 'fast-deep-equal';
import {
    initialDragDropState,
    subscribe,
    unsubscribe,
    Subscriber,
    DragDropState
} from './manager';

export type DragDropConfig = Subscriber & {
    deps?: DependencyList,
    stateProps?: (keyof DragDropState)[]
};

export const useDragDrop = (config: DragDropConfig = {}) => {
    const [state, setState] = useState(initialDragDropState);

    const normalizedConfig = {
        ...config,
        stateProps: config.stateProps || <(keyof DragDropState)[]>
            Object.keys(initialDragDropState),
        deps: config.deps || []
    };

    // running effect every render causes major performance problems and effective crash
    // assigning new properties to existing subscriber is inconsistent with useDrag and useDrop
    // which may need to take action when updates are made
    useEffect(() => {
        const subscriber: Subscriber = {
            ...normalizedConfig,
            onAny: (state, prevState) => {
                normalizedConfig.onAny?.(state, prevState);
                const update = normalizedConfig.stateProps
                    .some(key => !equal(state[key], prevState[key]));
                if (update)
                    setState(state);
            }
        };
        subscribe(subscriber);
        return () => unsubscribe(subscriber);
    }, normalizedConfig.deps);

    return state;
};