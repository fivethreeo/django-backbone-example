set "cmd=%*"
if /I "%cmd%" EQU "" (
  set "cmd=runserver"
)
env\Scripts\python django\manage.py %cmd%