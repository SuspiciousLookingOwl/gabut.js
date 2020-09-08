# Gabut.js

Source code for Gabut.js, a Discord bot using Discord.js.

Clone Repository -> `npm install` -> 👌👌👌

- Dev Server: `npm run dev`
- Compile: `npm run compile`
- Run Test: `npm run test`
- Lint Check: `npm run lint:check`
- Attempts Lint Auto-fix: `npm run lint:fix`

---

## Creating New Command

I provided a script to easily create a new command file. You can run:

```
npm run create-command -- command-name "Command Description"
```
to easily create a new command file template inside [src/commands](src/commands) folder.

Then you can edit the copied `index.ts` inside `src/commands/command-name` folder.

The template also includes `.spec.ts` file to get you started with unit testing your command.



---

## Features to be added

- [ ] Check jdoodle credit
- [ ] Execute code from jdoodle API 
- [ ] Display HTML when .html file is sent