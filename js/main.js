$(document).ready(function() {

     var audio;
     var playlist = [];

     getPlaylist();

     function getPlaylist() {

          $.ajax({
               method: 'get',
               url: './data/data.json',
               success: function(res) {
                    for(var key in res) {
                         $('<li class="song" id="song_'+ res[key].index +'">' + res[key].artist + ' - ' + res[key].title + '</li>').appendTo("ul.playlist");
                    }

                    initAudio(res[0]);
                    playlist = res;
                    playlist[res[0].index].current = true;

                    // console.log(playlist);
               },
               error: function(err) {
                    console.log(err);
               }
          });
     }

     function initAudio(song) {
          $("span.artist").text(song.artist);
          $("span.title").text(song.title);

          $("ul.playlist li").removeClass("current");
          $('li#song_' + song.index).addClass("current");

          audio = new Audio('../music/' + song.filename + '.' + song.extension);
          console.log(parseFloat($("input.volume").val() / 10));
          audio.volume = parseFloat($("input.volume").val() / 10);

          // console.log(audio);
     }

     function stopSong() {
          audio.pause();
          audio.currentTime = 0;

          $("button#pause").addClass("hide");
          $("button#play").removeClass("hide");

          $("span.duration").fadeOut(400);
     }

     function pauseSong() {
          audio.pause();

          $("button#pause").addClass("hide");
          $("button#play").removeClass("hide");
     }

     function playSong() {
          audio.play();

          $("span.duration").fadeIn(400);
          $("button#play").addClass("hide");
          $("button#pause").removeClass("hide");
     }

     function showDuration() {
          $(audio).bind('timeupdate', function() {
               var s = parseInt(audio.currentTime % 60);
               var m = parseInt((audio.currentTime / 60) % 60);

               if(s < 10) {
                    s = '0' + s;
               }

               $("div.duration span").html(m + ":" + s);

               var value = 0;

               if(audio.currentTime > 0) {
                    value = Math.floor((100 / audio.duration) * audio.currentTime);
               }

               $("div.progress").css("width", value + "%");
          });
     }

     $("input.volume").on("change", function() {
          // console.log($(this).val());
          audio.volume = parseFloat($(this).val() / 10);
     });

     $("ul.playlist").on("click", "li", function() {
          // console.log("clicked");

          // $(this).addClass("current");

          console.log(playlist.length);

          if(playlist.length > 0) {
               stopSong();
               initAudio(playlist[$(this).attr("id").replace("song_", '')]);
               playSong();
               showDuration();
          }
     });

     $("button#play").on("click", function() {
          playSong();
          showDuration();
     });

     $("button#pause").on("click", function() {
          pauseSong();
     });

     $("button#stop").on("click", function() {
          stopSong();
     })

     $("button#next").on("click", function() {

          var songIndex = -1;

          var currentSong = playlist.find(function(song) {
               return song.current == true;
          });

          playlist[currentSong.index].current = false;

          songIndex = currentSong.index + 1;

          if(playlist.length <= songIndex) {
               songIndex = 0;
          }

          if(songIndex > -1 && playlist.length > songIndex) {
               var nextSong = playlist.find(function(song) {
                    return song.index == songIndex;
               });

               playlist[songIndex].current = true;

               stopSong();
               initAudio(playlist[songIndex]);
               playSong();
               showDuration();
          }
     });

     $("button#prev").on("click", function() {

          var songIndex = -1;

          var currentSong = playlist.find(function(song) {
               return song.current == true;
          });

          playlist[currentSong.index].current = false;

          songIndex = currentSong.index - 1;

          if(songIndex < 0) {
               songIndex = playlist.length - 1;
          }

          if(songIndex > -1 && playlist.length > songIndex) {

               var nextSong = playlist.find(function(song) {
                    return song.index == songIndex;
               });

               playlist[songIndex].current = true;

               stopSong();
               initAudio(playlist[songIndex]);
               playSong();
               showDuration();
          }
     });
});
