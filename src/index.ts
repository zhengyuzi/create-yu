import fs from 'node:fs'
import process from 'node:process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'
import prompts from 'prompts'
import { green, red, reset } from 'kolorist'
import templates from './templates'

const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ['_'] })

const templateNames = templates.map(f => f.name)

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
}

const cwd = process.cwd()

const defaultTargetDir = 'my-project'

async function init() {
  const argTargetDir = formatTargetDir(argv._[0])
  const argTemplate = argv.template || argv.t

  let targetDir = argTargetDir || defaultTargetDir

  const getProjectName = () => targetDir === '.' ? path.basename(path.resolve()) : targetDir

  try {
    const { template, overwrite, packageName } = await prompts(
      [
        {
          type: argTargetDir ? null : 'text',
          name: 'projectName',
          message: reset('Project name:'),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir
          },
        },
        {
          type: () => !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
          name: 'overwrite',
          message: () =>
            `${targetDir === '.'
              ? 'Current directory'
              : `Target directory "${targetDir}"`
               } is not empty. Remove existing files and continue?`,
        },
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error(`${red('✖')} Operation cancelled`)
            }
            return null
          },
          name: 'overwriteChecker',
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
          name: 'packageName',
          message: reset('Package name:'),
          initial: () => toValidPackageName(getProjectName()),
          validate: dir =>
            isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type: argTemplate && templateNames.includes(argTemplate) ? null : 'select',
          name: 'template',
          message:
              typeof argTemplate === 'string' && !templateNames.includes(argTemplate)
                ? reset(
                  `"${argTemplate}" isn't a valid template. Please choose from below: `,
                )
                : reset('Select a template:'),
          initial: 0,
          choices: templates.map((temp) => {
            const templateColor = temp.color
            return {
              title: templateColor(temp.display || temp.name),
              value: temp,
            }
          }),
        },
      ],
      {
        onCancel: () => {
          throw new Error(`${red('✖')} Operation cancelled`)
        },
      },
    )

    const root = path.join(cwd, targetDir)

    if (overwrite) {
      emptyDir(root)
    }
    else if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true })
    }

    const templateDir = path.resolve(
      fileURLToPath(import.meta.url),
      '../..',
      `template-${template?.name || argTemplate}`,
    )

    const write = (file: string, content?: string) => {
      const targetPath = path.join(root, renameFiles[file] ?? file)
      if (content) {
        fs.writeFileSync(targetPath, content)
      }
      else {
        copy(path.join(templateDir, file), targetPath)
      }
    }

    const files = fs.readdirSync(templateDir)

    for (const file of files.filter(f => f !== 'package.json')) {
      write(file)
    }

    const pkg = JSON.parse(
      fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
    )

    pkg.name = packageName || getProjectName()

    write('package.json', `${JSON.stringify(pkg, null, 2)}\n`)

    // eslint-disable-next-line no-console
    console.log(`${green('√')} Done.`)
  }
  catch (error: any) {
    console.error(error.message)
  }
}

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName)
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-')
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  }
  else {
    fs.copyFileSync(src, dest)
  }
}

init().catch((e) => {
  console.error(e)
})
