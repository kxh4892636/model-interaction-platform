// import { print } from '@/fn'

import { exec, spawn } from 'child_process'

// print()

console.log(process.cwd())
process.chdir('d:/dev/water-ewe/')
console.log(process.cwd())
const cp = spawn('d:/dev/water-ewe/quality-wasp.exe')

cp.stdout.on('data', (chunk) => {
  console.log(chunk.toString())
})

cp.stderr.on('data', (chunk) => {
  console.log('error')
  console.log(chunk.toString())
})
