// Lets do all database stuff here and just share this global context with the rest of the App
// - so no database code anywhere else in our App
// - every CRUD function the App needs to do is in here, in one place
// - makes debugging etc so much easier
// - all external connections still have to go through /api routes 

import { createContext, useState, useEffect } from 'react'

const GlobalContext = createContext()

export function GlobalContextProvider(props) {
    const [globals, setGlobals] = useState({ hideHamMenu: true, posts: [], users: [], dataLoaded: false, isLoggedIn: false, loggedInUser: null })

    useEffect(() => {
        initData()
    }, [])

  async function initData() {
    // load meetings
    const postsResponse = await fetch('/api/get-posts', {
      method: 'POST',
      body: JSON.stringify({ posts: 'all' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const postsData = await postsResponse.json()

    // load users
    const usersResponse = await fetch('/api/get-user', {
      method: 'POST',
      body: JSON.stringify({ cmd: 'all' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const usersData = await usersResponse.json()
    console.log(usersData)

    setGlobals(prev => {
      const newGlobals = JSON.parse(JSON.stringify(prev))
      newGlobals.posts = postsData.posts || []
      newGlobals.users = usersData.users || []
      newGlobals.dataLoaded = true
      return newGlobals
    })
  }

    async function editGlobalData(command) { // {cmd: someCommand, newVal: 'new text'}
        if (command.cmd == 'hideHamMenu') { // {cmd: 'hideHamMenu', newVal: false} 
            //  WRONG (globals object reference doesn't change) and react only looks at its 'value' aka the reference, so nothing re-renders:
            //    setGlobals((previousGlobals) => { let newGlobals = previousGlobals; newGlobals.hideHamMenu = command.newVal; return newGlobals })
            // Correct, we create a whole new object and this forces a re-render:
            setGlobals((previousGlobals) => {
                const newGlobals = JSON.parse(JSON.stringify(previousGlobals));
                newGlobals.hideHamMenu = command.newVal; return newGlobals
            })
        }
        if (command.cmd == 'addPost') {
            const response = await fetch('/api/new-post', {
                method: 'POST',
                body: JSON.stringify(command.newVal),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json(); // Should check here that it worked OK
            setGlobals((previousGlobals) => {
                const newGlobals = JSON.parse(JSON.stringify(previousGlobals))
                newGlobals.posts.push(command.newVal); return newGlobals
            })
        }
        if (command.cmd === 'updatePost') {
            const response = await fetch('/api/update-post', {
                method: 'POST',
                body: JSON.stringify(command.newVal),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();
            if (data.response === 'success') {
                setGlobals(prev => {
                const newGlobals = JSON.parse(JSON.stringify(prev));
                const index = newGlobals.posts.findIndex(p => p._id === command.newVal._id);
                if (index > -1) {
                    newGlobals.posts[index] = command.newVal; // Replace post with updated version
                }
                return newGlobals;
                });
            }
        }

        if (command.cmd === 'deletePost') {
            const response = await fetch('/api/delete-post', {
            method: 'POST',
            body: JSON.stringify({ _id: command.newVal._id }),
            headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();
            if (data.response === 'success') {
            setGlobals(prev => {
                const newGlobals = JSON.parse(JSON.stringify(prev));
                newGlobals.posts = newGlobals.posts.filter(p => p._id !== command.newVal._id);
                return newGlobals;
            });
            }
        }
        
        if (command.cmd == 'addUser') {
            const response = await fetch('/api/new-user', {
                method: 'POST',
                body: JSON.stringify(command.newVal),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json(); // Should check here that it worked OK
            setGlobals((previousGlobals) => {
                const newGlobal = JSON.parse(JSON.stringify(previousGlobals))
                newGlobal.users.push(command.newVal); return newGlobal
            })
        }
        if (command.cmd === 'loginUser') {
            // command.newVal = { email, password }
            setGlobals(prev => {
                const newGlobals = JSON.parse(JSON.stringify(prev))
                const match = newGlobals.users.find(
                u => u.email === command.newVal.email && u.password === command.newVal.password
                )
                newGlobals.loggedInUser = match || null;
                newGlobals.isLoggedIn =  true;
                return newGlobals
            })
        }

        if (command.cmd === 'logout') {
            setGlobals(prev => {
                const newGlobals = JSON.parse(JSON.stringify(prev))
                newGlobals.loggedInUser = null
                return newGlobals
            })
        }
    }

    const context = {
        updateGlobals: editGlobalData,
        theGlobalObject: globals
    }

    return <GlobalContext.Provider value={context}>
        {props.children}
    </GlobalContext.Provider>
}


export default GlobalContext
