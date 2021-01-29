import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Components} from './Components';
import {Hooks} from './Hooks';

export const App = () => (
    <BrowserRouter>
        <Switch>
            <Route path='/components'>
                <Components />
            </Route>
            <Route path='/hooks'>
                <Hooks />
            </Route>
            <Route path='/'>
                <Components />
            </Route>
        </Switch>
    </BrowserRouter>
);