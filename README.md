Middleware for syncing redux actions between app instances via [pubnub](https://www.pubnub.com/).

### Code

```js
import { createStore, applyMiddleware } from 'redux';
import createPubnubActionSyncerMiddleware from 'redux-pubnub-action-sync-middleware';
 
const pubnubMiddleware = createPubnubActionSyncerMiddleware({
    publishKey: 'myPublishKey',
    subscribeKey: 'mySubscribeKey',
});
const createStoreWithMiddleware = applyMiddleware(pubnubMiddleware)(createStore);
```

```createPubnubActionSyncerMiddleware``` takes an object parameter as input.

This is were to initialize the pubnub connection ([pubnub docs](https://www.pubnub.com/docs/javascript/api-reference-sdk-v4#init)) 

In addition this object can set additional values for controlling the action syncing;

### mode
Possible values ```'sender'```, ```'receiver'``` or ```'both'``` (default)

#### sender
will only broadcast the actions taken with pubnub, but not apply any actions published by other instances.

#### receiver
will not broadcast actions taken in the instance, but will apply actions publiched by other instances.

#### both
will both broadcast and apply received actions. 

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
