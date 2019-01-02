#!/usr/bin/env node

/* eslint-disable */
const spawn = require('child_process').spawn;
const path = require('path');
const args = process.argv.splice(2) || [];
const exit = process.exit;

const _is_exist_flags = (flags) => {
    if (typeof flags === 'string'){
        return args.some(_ => _ === flags);
    }
    if (Array.isArray(flags)){
        return args.some(_ => flags.some(__ => _ === __));
    }
    return false;
}

const _get_args = (arg) => {
    if (typeof arg === 'string'){
        return (args.filter(_ => _.indexOf(`${arg}=`) !== -1)[0] || '').split('=')[1] || '';
    }
    if (Array.isArray(arg)){
        return arg.map(__ => (args.filter(_ => _.indexOf(`${__}=`) !== -1)[0] || '').split('=')[1] || '')
    }
    return '';
}

const project_path = _get_args('--path') ? path.resolve(__dirname, _get_args('--path')) : path.resolve(__dirname, './');
process.chdir(project_path);

const _do_command = (command, args, options, mark) => {
    let {no_error} = {
        no_error: true,
        ...mark
    }
    return new Promise((resolve, reject) => {
        let h = spawn(command, args, options, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout, stderr);
            }
        })
        console.log('\n');
        let success = true;
        h.stdout.on('data', function (s) {
            process.stdout.write(`${s.toString()}`);
        });

        h.stderr.on('data', (err) => {
            success = !no_error || false;
            process.stdout.write(`stderr: ${err}`);
        });

        h.stdout.on('end', function () {
            if (success){
                resolve();
            } else {
                reject(new Error(`执行命令 ${command} 失败`));
            }
        });
    })
}

if (_is_exist_flags(['-h'])){
    console.log(`
    Usage: node path/to/build-dist.js [COMMAND] [options] [args] 
    Commands:
      beta         打包测试版本
      pro          打包生产版本
      all          打包双版本
      clear        清除打包文件及依赖包文件
      install      安装依赖包
  
    Options:
    --uninstall    不进行安装依赖包
    
    args:
      path         项目路径
      
    Aliases: 
      -    install
  `)
    exit()
}


(async function run_command() {
    try {
        const options = {
            cmd: {
                cwd: project_path
            }
        };

        if (!args || args.length <= 0){
            await _do_command('yarn', [], options, {
                no_error: false
            });
            exit();
        }

        if (_is_exist_flags(['clear', '-c'])){
            await _do_command('rm', ['-rf', './node_modules'], options)
            await _do_command('rm', ['-rf', './dist_beta'], options)
            await _do_command('rm', ['-rf', './dist_pro'], options)
            exit()
        }

        if (_is_exist_flags(['beta', 'pro', 'install', 'all']) && !_is_exist_flags('--uninstall')){
            await _do_command('yarn', [], options, {
                no_error: false
            });
        }

        if (_is_exist_flags(['beta', 'all'])){
            await _do_command('npm', ['run', 'smart-build-beta'], options)
        }

        if (_is_exist_flags(['pro', 'all'])){
            await _do_command('npm', ['run', 'smart-build-pro'], options)
        }
    } catch (e) {
        console.log(e);
        exit(-1)
    }
})()



/* eslint-enable */
