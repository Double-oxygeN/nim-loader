import { getOptions } from 'loader-utils'
import { execSync } from 'child_process'
import fs from 'fs'
import tempy from 'tempy'

export default function(source) {
  const opts = getOptions(this) || {}
  const callback = this.async()

  const nimFile = this.resourcePath
  this.addDependency(nimFile)
  const outFile = tempy.file({ extension: 'js' })
  const flags = opts.flags || []

  const cmd = ['nim', 'js', `-o:${outFile}`, ...flags, nimFile].join(' ')
  const res = execSync(cmd)

  console.log(res)

  fs.readFile(outFile, 'utf-8', function(err, jsSource) {
    if(err) return callback(err)
    callback(null, jsSource)
  })
}
