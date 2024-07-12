// import { print } from '@/fn'

import { exec, spawn } from 'child_process'

// print()

console.log(process.cwd())
process.chdir('C:/Users/kxh48/Downloads/ouhe/')
console.log(process.cwd())
const cp = spawn('C:/Users/kxh48/Downloads/ouhe/wuran.exe')

cp.stdout.on('data', (chunk) => {
  console.log(chunk.toString())
})

cp.stderr.on('data', (chunk) => {
  console.log('error')
  console.log(chunk.toString())
})
