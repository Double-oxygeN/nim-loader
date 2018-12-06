import path from 'path'
import loaderUtils from 'loader-utils'
import { execSync } from 'child_process'
import fs from 'fs'

const moduleWrapper = `
\n
export default (typeof exports !== typeof undefined ? exports : {})
`

export default function(source) {
  this.addDependency('nim')
  
  const opts = loaderUtils.getOptions(this) || {}
  const callback = this.async()
  
  const nimFile = this.resourcePath
  const srcDir = path.dirname(nimFile)
  const outDir = path.resolve(srcDir, 'nimcache')
  const outFile = path.resolve(outDir, path.basename(nimFile, '.nim')) + '.js'
  const flags = opts.flags || []

  const cmd = ['nim', 'js', ...flags, nimFile].join(' ')
  const res = execSync(cmd)

  console.log(res)

  fs.readFile(outFile, 'utf-8', function(err, jsSource) {
    if(err) return callback(err)
    callback(null, jsSource /* + moduleWrapper */)
  })
}
