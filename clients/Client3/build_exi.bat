

@REM exe工具地址
set dream_exe="D:\DreamCC\tools\dream_cli\target\release\dream_cli.exe"

@REM 工程地址
set project_dir=D:\\DreamCC\\clients\\Client3

@REM 数据模块文件夹
set input_dir=assets\\src\\models

@REM 输出文件夹
set output_dir=assets\\src\\models_exi

@REM 定义文件存放文件夹
set module_define=assets\\src\\games\\ModuleKeys.ts

@REM %dream_exe% module-export -i %input% -o %output% -m %define%
%dream_exe% module-export -i %project_dir%\\%input_dir% -o %project_dir%\\%output_dir% -m %project_dir%\\%module_define%