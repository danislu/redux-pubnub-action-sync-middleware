Middleware for syncing redux actions between app instances via [pubnub](https://www.pubnub.com/).


```js
import { createStore, applyMiddleware } from 'redux';
import createPubnubActionSyncerMiddleware from 'redux-pubnub-action-sync-middleware';
 
const pubnubMiddleware = createPubnubActionSyncerMiddleware({
    publish_key: 'pub-c-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    subscribe_key: 'sub-c-xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
});
const createStoreWithMiddleware = applyMiddleware(pubnubMiddleware)(createStore);
```

```createPubnubActionSyncerMiddleware``` takes an object as parameter;

### IPubnubActionSyncerMiddlewareOptions

#### publish_key / subscribe_key
API keys provided by [pubnub](www.pubnub.com).

#### mode
Possible values ```sender```, ```receiver``` or ```both``` (default)