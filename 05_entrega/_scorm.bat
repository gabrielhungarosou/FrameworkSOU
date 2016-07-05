del _scorm\content\_pages\*.html 
del _scorm\content\_pages\*.js

copy ..\04_des~1\02_pro~1\_pages\*.html _scorm\content\_pages
copy ..\04_des~1\02_pro~1\_pages\*.js _scorm\content\_pages

del _scorm\content\_pages\images\*.png
del _scorm\content\_pages\images\*.jpg 
del _scorm\content\_pages\images\*.gif

copy ..\04_des~1\02_pro~1\_pages\images\*.png _scorm\content\_pages\images
copy ..\04_des~1\02_pro~1\_pages\images\*.jpg _scorm\content\_pages\images
copy ..\04_des~1\02_pro~1\_pages\images\*.gif _scorm\content\_pages\images

copy ..\04_des~1\02_pro~1\js\fun\*.js _scorm\content\js\fun
copy ..\04_des~1\02_pro~1\js\lib\*.js _scorm\content\js\lib
copy ..\04_des~1\02_pro~1\js\sco\*.js _scorm\content\js\sco

copy ..\04_des~1\02_pro~1\extras\*.html _scorm\content\extras

copy ..\04_des~1\02_pro~1\loc\*.mp3 _scorm\content\loc
copy ..\04_des~1\02_pro~1\music\*.mp3 _scorm\content\music

copy ..\04_des~1\02_pro~1\styles\font\font\*.eot _scorm\content\styles\font\font
copy ..\04_des~1\02_pro~1\styles\font\font\*.svg _scorm\content\styles\font\font
copy ..\04_des~1\02_pro~1\styles\font\font\*.ttf _scorm\content\styles\font\font
copy ..\04_des~1\02_pro~1\styles\font\font\*.woff _scorm\content\styles\font\font

copy ..\04_des~1\02_pro~1\styles\font\*.css _scorm\content\styles\font

copy ..\04_des~1\02_pro~1\styles\img\menu\*.png _scorm\content\styles\img\menu
copy ..\04_des~1\02_pro~1\styles\img\menu\*.jgp _scorm\content\styles\img\menu
copy ..\04_des~1\02_pro~1\styles\img\menu\*.gif _scorm\content\styles\img\menu

copy ..\04_des~1\02_pro~1\styles\img\exe\*.png _scorm\content\styles\img\exe
copy ..\04_des~1\02_pro~1\styles\img\exe\*.jpg _scorm\content\styles\img\exe
copy ..\04_des~1\02_pro~1\styles\img\exe\*.gif _scorm\content\styles\img\exe

copy ..\04_des~1\02_pro~1\styles\img\*.png _scorm\content\styles\img
copy ..\04_des~1\02_pro~1\styles\img\*.gif _scorm\content\styles\img
copy ..\04_des~1\02_pro~1\styles\img\*.jpg _scorm\content\styles\img

copy ..\04_des~1\02_pro~1\styles\*.css _scorm\content\styles

copy ..\04_des~1\02_pro~1\xml\*.js _scorm\content\xml

copy ..\04_des~1\02_pro~1\*.js _scorm\content
copy ..\04_des~1\02_pro~1\*.html _scorm\content

CScript  _zip.vbs

pause