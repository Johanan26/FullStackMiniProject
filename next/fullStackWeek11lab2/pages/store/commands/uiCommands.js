export function handleHideHamMenu(command, setGlobals) {
    setGlobals((previousGlobals) => {
        const newGlobals = JSON.parse(JSON.stringify(previousGlobals))
        newGlobals.hideHamMenu = command.newVal
        return newGlobals
    })
    return { success: true }
}

