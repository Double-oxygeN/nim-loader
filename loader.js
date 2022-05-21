import { validate } from 'schema-utils'
import { exec } from 'child_process'
import fs from 'fs'
import tempy from 'tempy'

const optionsSchema = {
  type: 'object',
  properties: {
    flags: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  }
}

export default function(source) {
  const opts = this.getOptions()
  validate(optionsSchema, opts)
  const callback = this.async()
  const logger = this.getLogger('nim-loader')

  const flags = opts.flags || []
  const nimFile = this.resourcePath
  this.addDependency(nimFile)
  const outFile = tempy.file({ extension: 'js' })

  const cmd = ['nim', 'js', `-o:${outFile}`, ...flags, nimFile].join(' ')
  exec(cmd, (error, _stdout, stderr) => {
    if (error) {
      callback(error, nimFile)
      return
    }
    logger.log(stderr)

    fs.readFile(outFile, 'utf-8', function(err, jsSource) {
      if(err) return callback(err)
      callback(null, jsSource)
    })
  })
}
