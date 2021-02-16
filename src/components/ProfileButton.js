import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
const useStyles = makeStyles(theme => ({
    smallAvatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
}));


export function ProfileButton(props) {
    const classes = useStyles();

    if (props.authenticated) {
        return (
            props.profilePicture ? (
                <IconButton onClick={props.handleLogout} id="ib">
                    <ExitToAppIcon src={props.profilePicture} fontSize = "large"/>
                </IconButton>
            ) : (
                <Button onClick={props.handleLogout} color="inherit">
                    Logout
                </Button>
            )
        );
    } else {
        return <> </>;
    }
}