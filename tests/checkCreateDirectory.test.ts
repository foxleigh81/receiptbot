import tap from 'tap'
import fs from 'fs'

import checkCreateDirectory from '../src/functions/checkCreateDirectory'

tap.test('Test "checkCreateDirectory()"', t => {

    const TEST_DIR = './test-dir'

    t.before(() => {
        return fs.mkdirSync(TEST_DIR)
    })

    t.test('Directory exists"', t => {
        t.equal(checkCreateDirectory(TEST_DIR), `SERVER: "${TEST_DIR}" already exists, no tasks required.`, 'Directory exists, so do nothing')
        t.end()
    })

    t.test('Directory does not exists"', t => {
        t.equal(checkCreateDirectory(`${TEST_DIR}/subdir`), `SERVER: "${TEST_DIR}/subdir" did not exist and has now been created`)
        t.end()
    })


    t.test('New Directory from previous test now exists"', t => {
        t.equal(checkCreateDirectory(`${TEST_DIR}/subdir`), `SERVER: "${TEST_DIR}/subdir" already exists, no tasks required.`, 'Directory exists, so do nothing')
        t.end()
    })

    t.end()

    t.teardown(() => fs.rmdirSync(TEST_DIR, {recursive: true}))
})
