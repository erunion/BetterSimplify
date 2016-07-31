// Plex
// @hostname = app.plex.tv localhost 127.0.0.1

(function () {
  'use strict'

  var lastURL = null
  var lastState = null
  var lastSlug = null

  function readPositionSlider () {
    if ($('.mini-controls-numeric-progress').length) {
      var time = $('.mini-controls-numeric-progress .player-position').text().split(':')
      time = parseInt(time[0], 10) * 60 + parseInt(time[1], 10)

      var duration = $('.mini-controls-numeric-progress .player-duration').text().split(':')
      duration = parseInt(duration[0], 10) * 60 + parseInt(duration[1], 10)

      return {
        max: duration,
        min: 0,
        current: time
      }
    } else {
      return {
        max: 0,
        min: 0,
        current: 0
      }
    }
  }

  /*
  function readVolumeSlider () {
    var matches = $('.mini-controls .player-volume-slider .player-slider-thumb').attr('style').match(/left: (\d{1,})%;/im)
    return (matches[1]) ? matches[1] : 100;
  }
  */

  function clickSlider ($el, pageX) {
    var mousedown = new $.Event('mousedown')
    var mouseup = new $.Event('mouseup')
    mousedown.pageX = pageX
    mouseup.pageX = pageX

    $el.trigger(mousedown).trigger(mouseup)
  }

  var updateSimplifyMetadata = function (simplify) {
    function setCurrentTrack (simplify, $controls) {
      var $poster = $controls.find('.media-poster')
      var title = $poster.attr('data-title') || ''
      var album = $poster.attr('data-parent-title') || ''
      var artist = $poster.attr('data-grandparent-title') || ''
      // var playhead = readPositionSlider()

      var $prevBtn = $controls.find('.previous-btn')
      var $nextBtn = $controls.find('.next-btn')

      var slug = [title, album, artist].join(':')
      if (slug !== lastSlug) {
        lastSlug = slug
        simplify.setCurrentTrack({
          author: artist,
          title: title,
          album: album,
          // length: playhead.max, // Sending this data to Simplify crashes it for some reason. ¯\_(ツ)_/¯
          features: {
            disable_previous_track: $prevBtn.hasClass('disabled'),
            disable_next_track: $nextBtn.hasClass('disabled'),
            disable_track_seeking: true
          }
        })
      }
    }

    function setPlaybackState (simplify, $controls) {
      var state
      if ($controls.length) {
        var $playBtn = $controls.find('.play-btn')

        if ($playBtn.css('display') === 'none') {
          state = Simplify.PLAYBACK_STATE_PLAYING
        } else {
          state = Simplify.PLAYBACK_STATE_PAUSED
        }
      } else {
        state = Simplify.PLAYBACK_STATE_STOPPED
      }

      if (state !== lastState) {
        lastState = state
        simplify.setNewPlaybackState(state)
      }
    }

    function setArtwork (simplify, $controls) {
      var $poster = $controls.find('.media-poster')
      var imageUrl = $poster.attr('data-image-url')

      if (lastURL !== imageUrl) {
        lastURL = imageUrl
        if (imageUrl) {
          imageUrl = imageUrl.replace(/=100/g, '=512')
          simplify.setCurrentArtwork(imageUrl)
        } else {
          simplify.setCurrentArtwork(null)
        }
      }
    }

    var $controls = $('.mini-controls')
    setCurrentTrack(simplify, $controls)
    setPlaybackState(simplify, $controls)
    setArtwork(simplify, $controls)
  }

  // Only run extension when Plex is outermost frame
  if (window.top === window) {
    window.addEventListener('load', function () {
      // Inject jQuery into page
      var body = document.getElementsByTagName('body')[0]
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = '//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js'
      body.appendChild(script)

      var simplify = new Simplify()
      simplify.setCurrentPlayer('Plex')
      setInterval(function () {
        updateSimplifyMetadata(simplify)
      }, 1000)

      // Sending this data to Simplify crashes it for some reason. ¯\_(ツ)_/¯
      /*
      simplify.bindToTrackPositionRequest(function () {
        var playhead = readPositionSlider()
        return playhead.current
      })
      */

      // Sending this data to Simplify crashes it for some reason. ¯\_(ツ)_/¯
      /*
      simplify.bindToVolumeRequest(function () {
        return readVolumeSlider()
      })
      */

      simplify.bind(Simplify.MESSAGE_DID_SELECT_NEXT_TRACK, function () {
        $('.mini-controls .next-btn').click()
      }).bind(Simplify.MESSAGE_DID_SELECT_PREVIOUS_TRACK, function () {
        $('.mini-controls .previous-btn').click()
      }).bind(Simplify.MESSAGE_DID_CHANGE_PLAYBACK_STATE, function () {
        if ($('.mini-controls .play-btn').css('display') === 'none') {
          $('.pause-btn').click()
        } else {
          $('.mini-controls .play-btn').click()
        }
      }).bind(Simplify.MESSAGE_DID_CHANGE_TRACK_POSITION, function (data) {
        var playhead = readPositionSlider()
        var $el = $('.mini-controls .player-seek-bar')
        var pageX = $el.offset().left + $el.width() * (data.amount / playhead.max)
        clickSlider($el, pageX)
      })

      // Sending this data to Simplify crashes it for some reason. ¯\_(ツ)_/¯
      /*
      simplify.bind(Simplify.MESSAGE_DID_CHANGE_VOLUME, function (data) {
        var $el = $('.mini-controls .player-volume-slider')
        var pageX = $el.offset().left + $el.width() * (data.amount / 100)
        clickSlider($el, pageX)
      })
      */

      window.addEventListener('beforeunload', function () {
        simplify.closeCurrentPlayer()
      })
    })
  }
}())
