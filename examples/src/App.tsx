import React, {useEffect} from 'react';
import {useDragDrop, Drag, Drop, DragView} from 'react-drag-drop';

export const App = () => {
    const state = useDragDrop();

    useEffect(() => {
        // document.body.style.margin = '0';
        document.body.style.height = '100%';
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
    }, []);

    return <>
        <DragView
            //preview={payload => payload.info}
            hoverCursor='grab'
            dragCursor='grabbing'
        />
        <Drag previewChildren payload={{info: 2}}>drag</Drag>
        <br />
        <Drop>drop</Drop>
        <pre>{
            JSON.stringify(state, (k, v) =>
                v === undefined ? 'undefined' : v, 4)
        }</pre>
    </>;
};


















/*import React, {useState, useEffect} from 'react';
import {useDrag} from 'react-drag-drop';
import {useDrop} from 'react-drag-drop';
import {useDragDrop} from 'react-drag-drop';

const App = () => {
    const [payload, setPayload] = useState(0);
    const [hovering, setHovering] = useState(false);
    const dragRef = useDrag<HTMLDivElement>({
        payload: payload,
        deps: [payload]
    });
    const dropRef = useDrop<HTMLDivElement>({
        payload: payload,
        deps: [payload]
    });
    const state = useDragDrop({
        onDragMove: () => {
            setPayload(prev => prev + 1);
        },
        onDragStart: () => {
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'grabbing';
        },
        onDragEnd: () => {
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        }
    });

    useEffect(() => {
        setTimeout(() => {
            setPayload(0);
        }, 5000);
    }, []);

    return (
        <>
            {/*<div style={{height: 200, overflow: 'scroll', marginTop: 300}}>}
                <div
                    ref={dragRef}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    style={{
                        height: 200,
                        transform: state.dragging
                            ? `translate(
                                ${state.displacement!.x}px,
                                ${state.displacement!.y}px
                            )`
                            : undefined,
                        cursor: hovering && !state.dragging ? 'grab' : undefined
                    }}
                >
                    drag
                </div>
                <pre>{JSON.stringify(state, (k, v) => v === undefined ? 'undefined' : v, 4)}</pre>
            {/*</div>}
            <div
                ref={dropRef}
                style={{
                    color: state.hovering
                        ? 'red'
                        : undefined
                }}
            >
                drop
            </div>
            <pre>{JSON.stringify(state, (k, v) => v === undefined ? 'undefined' : v, 4)}</pre>
        </>
    );
};

export default App;*/