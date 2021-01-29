# React Drag and Drop

Simple, flexible hooks for drag and drop in React.

## Installation

```sh
npm i react-drag-drop
```

## Example

```tsx
import React from 'react';
import {useDrag, useDrop, useDragDrop} from 'react-drag-drop';

export const App = () => {
    const dragRef = useDrag<HTMLParagraphElement>();
    const dropRef = useDrop<HTMLParagraphElement>();
    const state = useDragDrop();

    const dragStyle = {
        transform: state.dragging
            ? `translate(
                ${state.displacement!.x}px,
                ${state.displacement!.y}px
            )`
            : undefined
    };

    const dropStyle = {
        color: state.hovering ? 'green' : 'red'
    };

    return <>
        <p ref={dragRef} style={dragStyle}>drag</p>
        <p ref={dropRef} style={dropStyle}>drop</p>
    </>;
};
```

## Documentation

### `useDrag<T extends HTMLElement>(config)`

```tsx
import {useDrag} from 'react-drag-drop';
```

Make an drag element.

* `config: DragConfig` (default: `{}`): Configuration for the drag element. Note that if `config` may change when the component using this hook rerenders, `config.deps` should be specified. Additionally, updates to `config` will only be reflected in `DragDropState` once the next drag and drop event occurs.
* `return: RefCallback<T>`: A ref to assign to the element that should be draggable.

### `useDrop<T extends HTMLElement>(config)`

```tsx
import {useDrop} from 'react-drag-drop';
```

Make drop element.

* `config: DropConfig` (default: `{}`): Configuration for the drop element. Note that if `config` may change when the component using this hook rerenders, `config.deps` should be specified. Additionally, updates to `config` will only be reflected in `DragDropState` once the next drag and drop event occurs.
* `return: RefCallback<T>`: A ref to assign to the element that should accept drag elements.

### `useDragDrop(config)`

```tsx
import {useDragDrop} from 'react-drag-drop';
```

Get the drag and drop state and handle events.

* `config: DragDropConfig` (default: `{}`): Configuration for state and event handlers.
* `return: DragDropState`: The drag and drop state, updated according to `config.stateProps` and `requestAnimationFrame`.

### `DragConfig`

Configuration object for drag elements with the following properties.

* `payload?: any` (default: `undefined`): Data describing the drag element.
* `disabled?: boolean` (default: `false`): Whether to allow dragging the element. If set to `false` while dragging the element, this only takes effect once dragging ends normally.
* `deps?: DependencyList` (default: `[]`): Array containing the values of any variables that other properties of `DragConfig` depend upon. Used in the same manner as the `useEffect` dependency list.

### `DropConfig`

Configuration object for drop elements with the following properties.

* `payload?: any` (default: `undefined`): Data describing the drop element.
* `disabled?: boolean` (default: `false`): Whether to allow dropping and hovering on the element.
* `deps?: DependencyList` (default: `[]`): Array containing the values of any variables that other properties of `DropConfig` depend upon. Used in the same manner as the `useEffect` dependency list.

### `DragDropConfig`

Configuration object for state and event handlers with the following properties.

* `onDragStart?: Handler`: Pointer activates on a drag element.
* `onDragMove?: Handler`: Pointer moves after dragging has started.
* `onDragEnd?: Handler`: Pointer deactivates after dragging has started.
* `onHoverStart?: Handler`: Dragging is in progress and pointer moves over a drop element.
* `onHoverEnd?: Handler`: Dragging is in progress and pointer moves off a drop element.
* `onDrop?: Handler`: Dragging is in progress and pointer deactivates over a drop element.
* `onAny?: Handler`: Called on any of the other events in `DragDropConfig`.
* `stateProps?: (keyof DragDropState)[]` (default: array of all `DragDropState` properties): Changes to the `DragDropState` returned by `useDragDrop` will only cause a component to rerender if one of the properties in this array changes. If set, the array should contain all properties of `DragDropState` that are used in the component, and serves as a performance optimization by ignoring those that aren't.
* `deps?: DependencyList` (default: `[]`): Array containing the values of any variables that other properties of `DragDropConfig` depend upon. Used in the same manner as the `useEffect` dependency list.

### `Handler: (state, prevState) => void`

Drag and drop event handler passed to `DragDropConfig`.

* `state: DragDropState`: The drag and drop state after this event occurs. Note that for `onDragEnd` and `onDrop` in particular, this will be the initial state where nothing is being dragged, and `prevState` may be more useful.
* `prevState: DragDropState`: The drag and drop state before this event occurred.

### `DragDropState`

Object containing the following properties.

* `dragging: boolean`: Whether an element is being dragged.
* `hovering: boolean`: Whether the pointer is hovering a droppable element while dragging.
* `dragPayload: any`: Payload of the item being dragged or `undefined` if not dragging.
* `dropPayload: any`: Payload of the item being hovered or `undefined` if not dragging
* `initialPointerPosition: Point | null`: `pointerPosition` when dragging started or `null` if not dragging.
* `pointerPosition: Point | null`: Position of the pointer relative to the viewport or `null` if not dragging. Add `window.scrollX` and `window.scrollY` to get the position relative to the document.
* `initialElementPosition: Point | null`: `elementPosition` when dragging started or `null` if not dragging.
* `elementPosition: Point | null`: `initialElementPosition` plus `displacement` or `null` if not dragging.
* `displacement: Point | null`: Displacement between `initialPointerPosition` and `pointerPosition` or `null` if not dragging.

### `Point`

Object containing the following properties.

* `x: number`: Horizontal coordinate of a position relative to the viewport.
* `y: number`: Vertical coordinate of a position relative to the viewport.

## Alternatives

### [React DnD](https://github.com/react-dnd/react-dnd)

I think React DnD is based on some good ideas, but I found its interface unpleasant to use, and the default HTML5 "backend" for mouse drag and drop comes with some of the limitations of native HTML5 drag and drop. I experienced performance issues with the only [third party backend](https://github.com/zyzo/react-dnd-mouse-backend) I could find. On the other hand, you may want to use React DnD if you need to support drag and drop with external types like files, links, and selected text.

### [React UseGesture](https://github.com/pmndrs/react-use-gesture)

React UseGesture [does not support drag and drop](https://github.com/pmndrs/react-use-gesture/issues/88), but you may want to use it if you only need to support dragging elements and not interacting with drop elements. You could also use it for animating dragging while using this library to handle the drag and drop state.