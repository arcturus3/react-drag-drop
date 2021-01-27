import {useState, useEffect, DependencyList} from 'react';
import equal from 'fast-deep-equal';
import {
    initialDerivedState,
    subscribe,
    unsubscribe,
    Subscriber,
    DerivedState
} from './manager';

type DragDropConfig = Subscriber & {
    deps?: DependencyList,
    stateProps?: (keyof DerivedState)[]
};

export const useDragDrop = (config: DragDropConfig) => {
    const [state, setState] = useState(initialDerivedState);

    if (!config.deps)
        config.deps = [];
    if (!config.stateProps)
        config.stateProps = <(keyof DerivedState)[]>
            Object.keys(initialDerivedState);

    // running effect every render causes major performance problems and effective crash
    // assigning new properties to existing subscriber is inconsistent with useDrag and useDrop
    // which may need to take action when updates are made
    useEffect(() => {
        const subscriber: Subscriber = {
            ...config,
            onAny: (state, prevState) => {
                config.onAny?.(state, prevState);
                const update = config.stateProps!
                    .some(key => !equal(state[key], prevState[key]));
                if (update)
                    setState(state);
            }
        };
        subscribe(subscriber);
        return () => unsubscribe(subscriber);
    }, config.deps);

    return state;
};