#!/usr/bin/env node

/* eslint-disable */
const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');
const args = process.argv.splice(2) || [];
const exit = process.exit;
let chalk = null;

try{
    chalk = require('chalk');
} catch (e) {
    chalk = {
        red: d => d,
        green: d => d
    }
}


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

const project_path =  path.resolve(process.cwd(), _get_args('--path') || './');
process.chdir(project_path);

const _do_command = (command, args, options, mark) => {
    let {ignore_error, stderr_is_ok} = Object.assign({}, {
        ignore_error: false,
        stderr_is_ok: d => false
    }, mark)
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
            if (!ignore_error){
                success = stderr_is_ok(err.toString());
            }
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
    Usage: jbz-server-build [COMMAND] [Options] [args] 
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
        if(!fs.existsSync(path.resolve(project_path, './package.json'))){
            throw new Error(`Error: package.json file not found in directory - ${project_path} , please cd to i-*-film's root directory.`);
        }
        const options = {
            cmd: {
                cwd: project_path
            }
        };

        if (!args || args.length <= 0){
            await _do_command('yarn', [], options, {
                ignore_error: true
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
                ignore_error: true
            });
        }

        if (_is_exist_flags(['beta', 'all'])){
            await _do_command('npm', ['run', 'smart-build-beta'], options)
        }

        if (_is_exist_flags(['pro', 'all'])){
            await _do_command('npm', ['run', 'smart-build-pro'], options)
        }
    } catch (e) {
        console.log(chalk.red(e.message));
        exit(-1)
    }
})()



/* eslint-enable */
