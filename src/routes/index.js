import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import New from "../pages/New";
import Users from "../pages/Users";

export default function Routes(){
    return(
        <Switch>
            <Route exact path="/" component={SignIn} />
            <Route exact path="/dashboard" component={Dashboard} isPrivate/>
            <Route exact path="/dashboard/:fit" component={Dashboard} isPrivate/>
            <Route exact path="/users" component={Users} isPrivate/>
            <Route exact path="/new" component={New} isPrivate/>
            <Route exact path="/new/:id" component={New} isPrivate/>
        </Switch>
    )
}