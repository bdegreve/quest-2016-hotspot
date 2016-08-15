#! /bin/sh

selfdir=$(dirname $(readlink -f $0))
destdir=$selfdir/../frontend/app/components/video

if [ -z "$1" ]
  then
    echo "Usage ./prep-video.sh [filename]"
    exit 2
fi

mkdir -p $destdir

# http://superuser.com/questions/715745/converting-video-for-mobile-phone
ffmpeg -y -i "$1" -c:v libx264 -crf 28 -profile:v baseline -c:a aac -strict experimental $destdir/filmpje.mp4

# https://www.reddit.com/r/webm/comments/2rsnlg/how_do_i_convert_to_webm/cnk0ikg
ffmpeg -y -i "$1" -c:v libvpx -qmin 10 -qmax 42 -maxrate 500k -bufsize 1000k -threads 2 -c:a libvorbis $destdir/filmpje.webm