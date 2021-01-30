# React Drag and Drop

Simple, flexible components and hooks for drag and drop in React.

## Installation

```sh
npm i @arcturus3/react-drag-drop
```

## Examples

This library provides both components and hooks for drag and drop. The components encapsulate some common functionality and may be useful in simple cases or in addition to the hooks. If you need more control over drag and drop it should be fairly simple to implement this functionality yourself using the hooks. Following are two similar examples using each.

### Components

```tsx
import React from 'react';
import {Drag, Drop, DragView} from '@arcturus3/react-drag-drop';

export const Components = () => <>
    <DragView onDrop={() => alert('dropped')} />
    <Drag previewChildren>drag</Drag>
    <br />
    <Drop>drop</Drop>
</>;
```

### Hooks

```tsx
import React from 'react';
import {useDrag, useDrop, useDragDrop} from '@arcturus3/react-drag-drop';

export const Hooks = () => {
    const dragRef = useDrag();
    const dropRef = useDrop();
    const state = useDragDrop({
        onDrop: () => alert('dropped')
    });

    const dragStyle = {
        display: 'inline-block',
        transform: state.dragging
            ? `translate(
                ${state.displacement!.x}px,
                ${state.displacement!.y}px
            )`
            : undefined
    };

    return <>
        <span ref={dragRef} style={dragStyle}>drag</span>
        <br />
        <span ref={dropRef}>drop</span>
    </>;
};
```

## Alternatives

### [React DnD](https://github.com/react-dnd/react-dnd)

I think React DnD is based on some good ideas, but I wasn't a fan of its API, and the default HTML5 "backend" for mouse drag and drop comes with some of the limitations of native HTML5 drag and drop. I experienced performance issues with the only [third party backend](https://github.com/zyzo/react-dnd-mouse-backend) I could find. On the other hand, you may want to use React DnD if you need to support drag and drop with external types like files, links, and selected text.

### [React UseGesture](https://github.com/pmndrs/react-use-gesture)

React UseGesture [does not support drag and drop](https://github.com/pmndrs/react-use-gesture/issues/88), but you may want to use it if you only need to support dragging elements and not interacting with drop elements. You could also use it for animating dragging while using this library to handle the drag and drop state.

## Documentation

### `<Drag />`

```tsx
import {Drag} from '@arcturus3/react-drag-drop';
```

A component that wraps its children with a drag element and prevents browser touch actions from interfering with dragging. Use with `<DragView />` to display a drag preview and set the cursor style when hovering. It accepts the following props in addition to children.

* `previewChildren?: boolean` (default: `false`): Whether to use children as the drag preview for `<DragView />`. Setting to `true` modifies `payload` such that the value passed to the `payload` prop is stored in `payload.data` and the children are stored in `payload.preview` for use by `<DragView />`.
* `payload?: any` (default: `undefined`): See `DragConfig`.
* `disabled?: boolean` (default: `false`): See `DragConfig`.
* `deps?: DependencyList` (default: `[]`): See `DragConfig`.

### `<Drop />`

```tsx
import {Drop} from '@arcturus3/react-drag-drop';
```

A component that wraps its children with a drop element. It accepts the following props in addition to children.

* `payload?: any` (default: `undefined`): See `DropConfig`.
* `disabled?: boolean` (default: `false`): See `DropConfig`.
* `deps?: DependencyList` (default: `[]`): See `DropConfig`.

### `<DragView />`

```tsx
import {DragView} from '@arcturus3/react-drag-drop';
```

A component that displays a preview of the element being dragged based on its payload and disables text selection while dragging. It's recommended to render this at the top of the component hierarchy so that it is always mounted. It accepts the following props.

* `preview?: (payload: any) => ReactNode` (default: uses `payload.preview` if defined, which is set automatically if `previewChildren={true}` on `<Drag />` components): Takes a drag payload and returns the preview to render. The preview could be calculated from the payload data or stored directly in the payload.
* `hoverCursor?: string` (default: `''`): The `cursor` style to use while hovering over a `<Drag />` component before dragging starts.
* `dragCursor?: string` (default: `''`): The `cursor` style to use while dragging.
* `onDragStart?: Handler`: See `DragDropConfig`.
* `onDragMove?: Handler`: See `DragDropConfig`.
* `onDragEnd?: Handler`: See `DragDropConfig`.
* `onHoverStart?: Handler`: See `DragDropConfig`.
* `onHoverEnd?: Handler`: See `DragDropConfig`.
* `onDrop?: Handler`: See `DragDropConfig`.
* `onAny?: Handler`: See `DragDropConfig`.
* `deps?: DependencyList` (default: `[]`): See `DragDropConfig`.

### `useDrag<T extends HTMLElement>(config)`

```tsx
import {useDrag} from '@arcturus3/react-drag-drop';
```

Make a drag element.

* `config: DragConfig` (default: `{}`): Configuration for the drag element. Note that if `config` may change when the component using this hook rerenders, `config.deps` should be specified. Additionally, updates to `config` will only be reflected in `DragDropState` once the next drag and drop event occurs.
* `return: RefCallback<T>`: A ref to assign to the element that should be draggable.

### `useDrop<T extends HTMLElement>(config)`

```tsx
import {useDrop} from '@arcturus3/react-drag-drop';
```

Make a drop element.

* `config: DropConfig` (default: `{}`): Configuration for the drop element. Note that if `config` may change when the component using this hook rerenders, `config.deps` should be specified. Additionally, updates to `config` will only be reflected in `DragDropState` once the next drag and drop event occurs.
* `return: RefCallback<T>`: A ref to assign to the element that should accept drag elements.

### `useDragDrop(config)`

```tsx
import {useDragDrop} from '@arcturus3/react-drag-drop';
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