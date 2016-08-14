selfdir = $(readlink -f $0)

cd $selfdir/../backend
npm run set-start-time