# card game

## Decisions

I chose to create a reusable hook that uses useReducer for managing the state. This approach should be good enough for a simple application like this. In terms of styling I only made use of styled components for highlighting the winning card for a certain round and for aligning the cards, so that I could finish the app as quickly as possible, since the styling was not a priority.

## Limitations

The current approach works in the context of a component that uses the hook. For a more complex app in which we might want to show the same state in multiple areas of the app we would probably need a more sophisticated approach to state management either based on an external store (e.g Redux based) or using a React context so that we avoid props drilling.

Another limitation would be probably related to the API, which I think could be improved such that it could support an option for handling the logic for equal cards which would enable us to make a single call to the server. In fact, most likely most of the logic could be moved to the server. The alternative would be to not use an API as such state could be kept on the client and no client-server communication would be required. Having all the state on the client and no server at all for this app is the best solution.

Another thing that comes to my mind is error handling. A serious app would show proper messages to the user if for instance the communication with the server fails. However, for that we should first define the UX.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
