type Point = {
    x: number,
    y: number
};

type DragItem = {
    element: HTMLElement,
    payload: any,
    disabled: boolean
};

type DropItem = {
    element: HTMLElement,
    payload: any,
    disabled: boolean
};

type State = {
    dragging: boolean,
    hovering: boolean,
    // drag item when drag first starts
    // its properties, like payload, may be updated during drag, and it contains a copy of
    // the original drag element which may also be updated (used for initialElementPosition)
    initialDragItem: DragItem | null,
    dragItem: DragItem | null,
    dropItem: DropItem | null,
    initialPointerPosition: Point | null,
    pointerPosition: Point | null
};

export type DerivedState = {
    dragging: boolean,
    hovering: boolean,
    dragPayload: any,
    dropPayload: any,
    initialPointerPosition: Point | null,
    pointerPosition: Point | null,
    initialElementPosition: Point | null,
    elementPosition: Point | null,
    displacement: Point | null
};

type Handler = (state: DerivedState, prevState: DerivedState) => void;

export type Subscriber = {
    onDragStart?: Handler,
    onDragMove?: Handler,
    onDragEnd?: Handler,
    onHoverStart?: Handler,
    onHoverEnd?: Handler,
    onDrop?: Handler,
    onAny?: Handler
};

const initialState: State = {
    dragging: false,
    hovering: false,
    initialDragItem: null,
    dragItem: null,
    dropItem: null,
    initialPointerPosition: null,
    pointerPosition: null
};

const getDerivedState = (state: State): DerivedState => {
    const {
        initialDragItem,
        dragItem,
        dropItem,
        ...rest
    } = state;
    if (!state.dragging) {
        return {
            ...rest,
            dragPayload: undefined,
            dropPayload: undefined,
            initialPointerPosition: null,
            initialElementPosition: null,
            elementPosition: null,
            displacement: null
        };
    }
    const displacement = {
        x: state.pointerPosition!.x - state.initialPointerPosition!.x,
        y: state.pointerPosition!.y - state.initialPointerPosition!.y
    };
    const initialElementPosition = {
        x: initialDragItem!.element.getBoundingClientRect().left,
        y: initialDragItem!.element.getBoundingClientRect().top
    };
    const elementPosition = {
        x: initialElementPosition.x + displacement.x,
        y: initialElementPosition.y + displacement.y
    };
    return {
        ...rest,
        dragPayload: dragItem?.payload,
        dropPayload: dropItem?.payload,
        initialElementPosition,
        elementPosition,
        displacement
    };
};

export const initialDerivedState = getDerivedState(initialState);

// todo?: switch to Redux and use store as observable for events
// to make state management slightly neater

let state: State = initialState;
let prevState: State = initialState;

const dragItems = new Set<DragItem>();

export const addDragItem = (item: DragItem) => {
    dragItems.add(item);
    // state needs to be updated if this element is being dragged
    // since drag items are only added to state when drag starts
    // this means that drag item is not updated if the ref is attached to a different element
    if (item.element === state.dragItem?.element)
        state = {
            ...state,
            dragItem: item
        };
};

export const removeDragItem = (item: DragItem) => {
    dragItems.delete(item);
    // not removed from state so that drag can finish
};

const dropItems = new Set<DropItem>();

export const addDropItem = (item: DropItem) => {
    dropItems.add(item);
    // state is already set to most current drop item on every event
};

export const removeDropItem = (item: DropItem) => {
    dropItems.delete(item);
};

const subscribers = new Set<Subscriber>();

export const subscribe = (subscriber: Subscriber) => {
    subscribers.add(subscriber);
};

export const unsubscribe = (subscriber: Subscriber) => {
    subscribers.delete(subscriber);
};

const publish = (type: keyof Subscriber) => {
    subscribers.forEach(subscriber => {
        subscriber[type]?.(getDerivedState(state), getDerivedState(prevState));
        if (type !== 'onAny')
            subscriber.onAny?.(getDerivedState(state), getDerivedState(prevState));
    });
};

// elementsFromPoint ensures topmost element is selected and elements scrolled out of view are not
// todo?: type inference fails for return type (always null)
const getTargetedDragItem = (point: Point): DragItem | null => {
    let result: DragItem | null = null;
    const elements = document.elementsFromPoint(point.x, point.y);
    elements.forEach(element => {
        dragItems.forEach(item => {
            if (result) return;
            if (item.element === element && !item.disabled)
                result = item;
        });
    });
    return result;
};

// todo: shares redundant code with getTargetedDragItem
const getTargetedDropItem = (point: Point): DragItem | null => {
    let result: DropItem | null = null;
    const elements = document.elementsFromPoint(point.x, point.y);
    elements.forEach(element => {
        dropItems.forEach(item => {
            if (result) return;
            if (item.element === element && !item.disabled)
                result = item;
        });
    });
    return result;
};

const handlePointerDown = (event: PointerEvent) => {
    const point = {
        x: event.clientX,
        y: event.clientY
    };
    const dragItem = getTargetedDragItem(point);
    if (!dragItem) return;
    const dropItem = getTargetedDropItem(point);
    prevState = state;
    state = {
        ...state,
        dragging: true,
        hovering: !!dropItem,
        initialDragItem: {
            ...dragItem,
            element: <HTMLElement>dragItem.element.cloneNode()
        },
        dragItem: dragItem,
        dropItem: dropItem,
        initialPointerPosition: point,
        pointerPosition: point
    };
    publish('onDragStart');
    if (state.hovering)
        publish('onHoverStart');
};

const handlePointerMove = (event: PointerEvent) => {
    if (!state.dragging) return;
    const point = {
        x: event.clientX,
        y: event.clientY
    };
    const dropItem = getTargetedDropItem(point);
    prevState = state;
    state = {
        ...state,
        hovering: !!dropItem,
        dropItem: dropItem,
        pointerPosition: point
    };
    publish('onDragMove');
    if (!prevState.hovering && state.hovering)
        publish('onHoverStart');
    if (prevState.hovering && !state.hovering)
        publish('onHoverEnd');
};

// todo: shares redundant code with handlePointerMove
const handleScroll = () => {
    if (!state.dragging) return;
    const dropItem = getTargetedDropItem(state.pointerPosition!);
    prevState = state;
    state = {
        ...state,
        hovering: !!dropItem,
        dropItem: dropItem
    };
    if (!prevState.hovering && state.hovering)
        publish('onHoverStart');
    if (prevState.hovering && !state.hovering)
        publish('onHoverEnd');
};

const handlePointerUp = () => {
    if (!state.dragging) return;
    const dropItem = getTargetedDropItem(state.pointerPosition!);
    prevState = {
        ...state,
        hovering: !!dropItem,
        dropItem: dropItem
    };
    state = initialState;
    publish('onDragEnd');
    if (prevState.hovering) {
        publish('onHoverEnd');
        publish('onDrop');
    }
};

const runOnFrame = (fn: (arg: any) => any) => {
    let frameId: number | undefined = undefined;
    return (arg: any) => {
        if (frameId !== undefined)
            cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => fn(arg));
    };
};

// item payloads and other config are not updated between drag and drop events
// use a global state manager for this

// todo?: dom layout changes will not fire appropriate events like hover start and end

window.addEventListener('pointerdown', handlePointerDown);
window.addEventListener('pointermove', runOnFrame(handlePointerMove));
window.addEventListener('scroll', runOnFrame(handleScroll));
window.addEventListener('pointerup', handlePointerUp);