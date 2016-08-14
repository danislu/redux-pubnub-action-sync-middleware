Middleware for syncing redux actions between app instances via [pubnub](https://www.pubnub.com/).

### Code

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

## The parameter object

### publish_key / subscribe_key
API keys provided by [pubnub](www.pubnub.com).

### mode
Possible values ```'sender'```, ```'receiver'``` or ```'both'``` (default)

#### default value
```js
'both'
```

### sendFilter

Function taking an action and retuning a boolean value.
The action will be sendt to the server if the function returns a 
truethy value.

#### default value
```js
(action) => true
```

### receiverFilter

Function taking an action and retuning a boolean value.
The action will be applied dispatched to the store if the function returns a 
truethy value.

#### default value
```js
(action) => true
```

### Query parameter
If mode is not set in code (see above) it can be set by query parameter. Use ```syncMode=sender```, ```syncMode=receiver``` or ```syncMode=both``` to control the syncing direction.

eg. 
```
http://myapp?syncMode=sender
``` 
