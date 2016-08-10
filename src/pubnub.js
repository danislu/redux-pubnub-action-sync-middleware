import Guid from 'guid';
import { parse } from 'query-string';
import actionSyncMiddleware from './actionSyncer';

const channel = 'pubnub-action-syncer';

const pubnubConnection = (options) => {
    const guid = Guid.raw();
    const subscribers = [];

    // eslint-disable-next-line
    const pubnub = PUBNUB(options);

    pubnub.subscribe({
        channel,
        message: (msg, env, ch) => {
            const { source, action } = msg;

            if (source === guid || ch !== channel) {
                return;
            }

            subscribers.forEach(({ callback }) => {
                callback(action);
            }, this);
        },
        connect: () => {
            // eslint-disable-next-line
            console.log(`Connected as ${guid}`);
        },
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
        publish_key: 'pub-c-118126b2-d33a-4207-91d1-e5565f8ea0a9',
        subscribe_key: 'sub-c-ae2c7998-86d2-11e5-8e17-02ee2ddab7fe',
    }, inputOptions);

    const { publish_key, subscribe_key } = options;
    const { subscribe, publish } = pubnubConnection({ publish_key, subscribe_key });

    options.onActionRecived = subscribe;
    options.sendAction = publish;
    
    return actionSyncMiddleware(options);
}
