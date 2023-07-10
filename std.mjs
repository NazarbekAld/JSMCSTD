/*
    A standard libary for JSMC.
*/
export const Bukkit = JavaClass.forName("org.bukkit.Bukkit")
const bukkitScheduler = Bukkit.getScheduler();
export const plugin = Bukkit.getPluginManager().getPlugin("JSMC");
const innerLogger = JavaClass.forName("org.slf4j.LoggerFactory").getLogger("JSMC-STD");

/**
 * 
 * Abstract class command.
 * 
 */
export class Command {
    constructor(name) {
        this.name = name;
        this.javaClass = JavaClass.forName("me.nazarxexe.jsmc.js.JSCommand").create(name);
    }
    
    execute(sender, args) {
        throw new Error("Execute method must be implemented.")
    }

    tab(sender, args) {
        throw new Error("TabComplete method must be implemented.")
    }

    register() {
        innerLogger.info("Registering command -> " + this.name);
        this.javaClass.setExecutor({
            execute: this.execute,
            tab: this.tab
        })

        try{
            this.javaClass.register(); // Smh it bypass all block of main thread and crashes without saves 
        }catch(e) {} 

        innerLogger.info("Registered command -> " + this.name);
    }
}

export class Scheduler {
    
    constructor() { throw new Error("Do not construct util.") }

    /**
     * 
     * Runs sync task
     * 
     * @param { function } funcptr - Anon/Function reference 
     */
    static task( funcptr ) {
        let task = bukkitScheduler.runTask(plugin, funcptr)
        return new Task(task)
    };
    /**
     * 
     * Runs task that async
     * 
     * @param { function } funcptr - Anon/Function reference 
     * @returns 
     */
    static taskAsync( funcptr ) {
        let task = bukkitScheduler.runTaskAsynchronously(plugin, funcptr)
        return new Task(task);
    };

    /**
     * 
     * Runs task after specified ticks.
     * 
     * @param { function } funcptr Anon/Function reference 
     * @param { number } after In ticks
     * @returns 
     */
    static taskLater( funcptr, after ) {
        let task = bukkitScheduler.runTaskLater(plugin, funcptr, after)
        return new Task(task);
    };

    /**
     * 
     * Runs task async after specified ticks.
     * 
     * @param { function } funcptr Anon/Function reference 
     * @param { number } after In ticks
     * @returns 
     */
    static taskLaterAsync( funcptr, after ) {
        let task = bukkitScheduler.runTaskLaterAsynchronously(plugin, funcptr, after)
        return new Task(task);
    };

    /**
     * 
     * Runs task every specified tick
     * 
     * @param { function } funcptr Anon/Function reference 
     * @param { number } period In ticks
     * @returns 
     */
    static taskTimer( funcptr, period ) {
        let task = bukkitScheduler.runTaskTimer(plugin, funcptr, 0, period)
        return new Task(task);
    }

    /**
     * 
     * Runs async task every specified tick
     * 
     * @param { function } funcptr Anon/Function reference 
     * @param { number } period In ticks
     * @returns 
     */
    static taskTimerAsync( funcptr, period ) {
        let task = bukkitScheduler.runTaskTimer(plugin, funcptr, 0, period)
        return new Task(task);
    }

}

export class Listener {

    /**
     * 
     * Listen a event
     * 
     * @param {*} loader 
     * @param { string } eventName 
     * @param { function } funcptr 
     */
    static on(loader, eventName, funcptr) {
        innerLogger.info(loader)
        
        JavaClass.forName("me.nazarxexe.jsmc.js.JSEventManager").getInstance().register(loader, eventName, funcptr, "NORMAL");

    }

    /**
     * 
     * Listen a event
     * 
     * @param {*} loader 
     * @param { string } eventName 
     * @param { function } funcptr 
     * @param { string } priority
     */
    static on(loader, eventName, funcptr, priority) {
        
        JavaClass.forName("me.nazarxexe.jsmc.js.JSEventManager").getInstance().register(loader, eventName, funcptr, priority);

    }

}



class Task {

    constructor(javaClass) {
        this.javaClass = javaClass;    
    }

    cancel() {
        this.javaClass.cancel();
    }

    taskID() {
        this.javaClass.getTaskId();
    }

}
