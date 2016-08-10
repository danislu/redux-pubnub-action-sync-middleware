const actionSet = new Set();

// eslint-disable-next-line
const noActionMiddleware = store => next => action => next(action);

const receiverCombo = onActionRecived => store => result => {
    onActionRecived(store.dispatch);
    return result;
};

// eslint-disable-next-line
const sender = actionSender => store => next => action => {
    actionSender(action);
    next(action);
};

const receiver = actionIterator =>
    store => receiverCombo(actionIterator)(store)(noActionMiddleware(store));

const both = actionIterator => actionSender =>
    store => receiverCombo(actionIterator)(store)(sender(actionSender)(store));

const defaultFilter = action => {
    if (action && action.meta) {
        if (typeof action.meta.noSync === 'undefined') {
            return true;
        }
        return action.meta.noSync;
    }
    
    return true;
};

export default function actionSyncMiddleware(inputOptions) {
    const options = Object.assign({}, {
        // ignore this middleware
        ignore: false,
        // Modus operandum
        // Possible values...
        // sender : sends the dispatched actions to server
        // receiver : recives actions from server and dispatches them
        // both : acts as both sender and reciver
        mode: 'both',
        // A function that takes a function accepting an action as input.
        // Expecting the input function to be called whenever a new action is available.
        // Required in the 'receiver' and 'both' modes
        onActionRecived: () => {
            const error = { message: 'Method required' };
            throw error;
        },
        // A function taking an action, that will be called whenever an action happens
        // Required in the 'sender' and 'both' modes
        sendAction: () => {
            const error = { message: 'Method required' };
            throw error;
        },
        // filter applied before sending actions to server
        sendFilter: defaultFilter,
        // filter applied before dispatching action recived from server
        receiverFilter: defaultFilter,
    }, inputOptions);

    const { ignore, receiverFilter, sendFilter, sendAction, onActionRecived, mode } = options;

    if (ignore) {
        return noActionMiddleware;
    }
    
    const onActionRecivedWrapper = dispatch => onActionRecived(action => {
        if (receiverFilter(action)) {
            actionSet.add(action);
            dispatch(action);
        }
    });

    const actionSender = action => {
        // eslint-disable-next-line
        if (actionSet.has(action)) {
            actionSet.delete(action);
            return;
        }

        if (sendFilter(action)) {
            sendAction(action);
        }
    };

    switch (mode) {
    case 'sender':
        return sender(actionSender);
    case 'receiver':
        return receiver(onActionRecivedWrapper);
    default:
        return both(onActionRecivedWrapper)(actionSender);
    }
}
