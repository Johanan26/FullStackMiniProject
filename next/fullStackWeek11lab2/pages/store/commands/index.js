import * as authCommands from './authCommands'
import * as postCommands from './postCommands'
import * as uiCommands from './uiCommands'
import * as profileCommands from './profileCommands'

const commandHandlers = {
    // Auth commands
    loginUser: authCommands.handleLoginUser,
    addUser: authCommands.handleAddUser,
    logout: authCommands.handleLogout,
    
    // Post commands
    addPost: postCommands.handleAddPost,
    updatePost: postCommands.handleUpdatePost,
    deletePost: postCommands.handleDeletePost,
    
    // Profile commands
    updateProfile: profileCommands.handleUpdateProfile,
    
    // UI commands
    hideHamMenu: uiCommands.handleHideHamMenu,
}

// Export profile functions for use in components
export { getUserProfile } from './profileCommands'

/**
 * Execute a command by routing it to the appropriate handler
 * @param {Object} command - { cmd: string, newVal: any }
 * @param {Function} setGlobals - State setter function
 * @returns {Promise<Object>} Result of the command execution
 */
export async function executeCommand(command, setGlobals) {
    const handler = commandHandlers[command.cmd]
    
    if (!handler) {
        console.warn(`Unknown command: ${command.cmd}`)
        return { success: false, error: `Unknown command: ${command.cmd}` }
    }
    
    try {
        return await handler(command, setGlobals)
    } catch (error) {
        console.error(`Error executing command ${command.cmd}:`, error)
        throw error
    }
}

