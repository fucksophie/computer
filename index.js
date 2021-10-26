const path = require("path");
const fs = require("fs");

const windowsShortcuts = require("windows-shortcuts");

const startMenu = path.join(process.env.APPDATA, "Microsoft/Windows/Start Menu/Programs");

if(fs.existsSync(startMenu)) {
    const discordStartMenu = path.join(startMenu, "Discord Inc");

    if(fs.existsSync(discordStartMenu)) {
        fs.copyFileSync(path.join(discordStartMenu, "Discord.lnk"), path.join(discordStartMenu, "old_Discord.lnk"))
        
        // This isn't crossplatform.

        console.log("Patching windows shortcut.")

        windowsShortcuts.query(path.join(discordStartMenu, "Discord.lnk"), (err, data) => {
            if(err) throw err;
        
            console.log("Discord directory found at " + data.workingDir);
            console.log(`Previous target: ${data.target} ${data.args}`)

            windowsShortcuts.edit(path.join(discordStartMenu, "Discord.lnk"), {
                target: path.join(data.workingDir, "Discord.exe"),
                args: "--remote-debugging-port=2020"
            }, err => {
                if(err) {
                    console.log("Couldn't patch shortcut!")
                } else {
                    console.clear();
                    console.log("Patched: shortcut.")
                    console.log("Patching index.js")
                    const indexJsPath = path.join(data.workingDir, "modules/discord_desktop_core-1/discord_desktop_core/index.js")
                    if(fs.existsSync(indexJsPath)) {
                        const indexJs = fs.readFileSync(indexJsPath).toString();
                        console.log("Index.js of desktop_core found! Patching.")

                        if(indexJs.includes("// Installed by")) {
                            console.log("index.js seems to be patched already. " + indexJsPath)
                        } else {
                            
                            fs.appendFileSync(indexJsPath, `
                                // Installed by Computer (github.com/yourfriendoss/computer)
                                const { exec } = require('child_process');
                                const prcs = exec("node ${path.resolve("client.js").replace(/\\/g, `\\\\`)}")
								prcs.stdout.pipe(process.stdout)
								prcs.stderr.pipe(process.stderr)
                            `)
                            console.log(path.join(__dirname, "client.js"))
                            console.log("Injected client code! You can restart/start your discord now.")
                        }
                    } else {
                        console.log("Couldn't find index.js at " + indexJsPath)
                    }
                }
            })
        })
        /*
       {
  expanded: {
    target: 'C:\\Users\\pirdi\\AppData\\Local\\Discord\\Update.exe',
    args: '--processStart Discord.exe',
    workingDir: 'C:\\Users\\pirdi\\AppData\\Local\\Discord\\app-1.0.9003',
    icon: 'C:\\Users\\pirdi\\AppData\\Local\\Discord\\app.ico'
  },
  target: 'C:\\Users\\pirdi\\AppData\\Local\\Discord\\Update.exe',
  args: '--processStart Discord.exe',
  workingDir: 'C:\\Users\\pirdi\\AppData\\Local\\Discord\\app-1.0.9003',
  runStyle: 1,
  icon: 'C:\\Users\\pirdi\\AppData\\Local\\Discord\\app.ico',
  iconIndex: '0',
  hotkey: 0,
  desc: 'Discord - https://discord.com'
}*/

    } else {
        console.log("Couldn't find DiscordStartMenu folder. Something is wrong.");
        console.log("-> " + discordStartMenu)
    }
} else {
    console.log("Couldn't find StartMenu folder. Something is wrong.");
    console.log("-> " + startMenu)
}
