

@REM exe工具地址
set dream_exe="D:\DreamCC\tools\dream_cli\target\release\dream_cli.exe"


@REM 数据模块文件夹
set input_dir=D:\\DreamCC\\configs

@REM 输出文件夹
set output_dir=D:\\DreamCC\\clients\\Client3\\assets\\res\\configs

@REM 定义文件存放文件夹
set code_output_path=D:\\DreamCC\\clients\\Client3\\assets\\src\\games\\configs

@REM %dream_exe% module-export -i %input% -o %output% -m %define%
%dream_exe% excel-to-json -i %input_dir% -o %output_dir% -c %code_output_path% -v 2 -w 1 -x 3 -y 4 -z ,