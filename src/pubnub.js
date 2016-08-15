import PubNub from 'pubnub';
import Guid from 'guid';
import { parse } from 'query-string';

import actionSyncMiddleware from './actionSyncer';

const channel = 'pubnub-action-syncer';

const pubnubConnection = (options) => {
    const guid = Guid.raw();
    const subscribers = [];

    // eslint-disable-next-line
    const pubnub = new PubNub(options);

    const handleMessage = (message) => {
        const { message: { source, action } } = message;

        if (source === guid) {
            return;
        }

        subscribers.forEach(({ callback }) => {
            callback(action);
        }, this);
    };

    pubnub.addListener({
        status: (statusEvent) => {
            if (statusEvent.category === 'PNConnectedCategory') {
                console.log(`Connected as ${guid}`);
            }
        },
        message: handleMessage,
    });

    pubnub.subscribe({
        channels: [channel],
    });

    const subscribe = (callback) => {
        const token = Guid.raw();
        subscribers.push({ id: token, callback });

        return () => {
            const index = subscribers.findIndex(value => value.id === token);
            const removed = subscribers.splice(index, 1);
            return (removed.length === 1 && removed[0].id === token);
        };
    };

    const publish = (action) => {
        const message = {
            source: guid,
            action,
        };

        pubnub.publish({
            channel,
            message,
        });
    };

    return {
        subscribe,
        publish,
    };
};

export default function pubnubActionSyncer(inputOptions) {
    const options = Object.assign({}, {
        mode: parse(window.location.search).syncMode,
    }, inputOptions);

    const { subscribe, publish } = pubnubConnection(options);

    options.onActionRecived = subscribe;
    options.sendAction = publish;
    
    return actionSyncMiddleware(options);
}
