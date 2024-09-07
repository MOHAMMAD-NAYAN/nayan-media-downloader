const utils = require('./utils');
const FORMATS = require('./formats');


// Use these to help sort formats, higher index is better.
const audioEncodingRanks = [
  'mp4a',
  'mp3',
  'vorbis',
  'aac',
  'opus',
  'flac',
];
const videoEncodingRanks = [
  'mp4v',
  'avc1',
  'Sorenson H.283',
  'MPEG-4 Visual',
  'VP8',
  'VP9',
  'H.264',
];

const getVideoBitrate = format => format.bitrate || 0;
const getVideoEncodingRank = format =>
  videoEncodingRanks.findIndex(enc => format.codecs && format.codecs.includes(enc));
const getAudioBitrate = format => format.audioBitrate || 0;
const getAudioEncodingRank = format =>
  audioEncodingRanks.findIndex(enc => format.codecs && format.codecs.includes(enc));


/**
 * Sort formats by a list of functions.
 *
 * @param {Object} a
 * @param {Object} b
 * @param {Array.<Function>} sortBy
 * @returns {number}
 */
const sortFormatsBy = (a, b, sortBy) => {
  let res = 0;
  for (let fn of sortBy) {
    res = fn(b) - fn(a);
    if (res !== 0) {
      break;
    }
  }
  return res;
};


const sortFormatsByVideo = (a, b) => sortFormatsBy(a, b, [
  format => parseInt(format.qualityLabel),
  getVideoBitrate,
  getVideoEncodingRank,
]);


const sortFormatsByAudio = (a, b) => sortFormatsBy(a, b, [
  getAudioBitrate,
  getAudioEncodingRank,
]);


/**
 * Sort formats from highest quality to lowest.
 *
 * @param {Object} a
 * @param {Object} b
 * @returns {number}
 */
exports.sortFormats = (a, b) => sortFormatsBy(a, b, [
  // Formats with both video and audio are ranked highest.
  format => +!!format.isHLS,
  format => +!!format.isDashMPD,
  format => +(format.contentLength > 0),
  format => +(format.hasVideo && format.hasAudio),
  format => +format.hasVideo,
  format => parseInt(format.qualityLabel) || 0,
  getVideoBitrate,
  getAudioBitrate,
  getVideoEncodingRank,
  getAudioEncodingRank,
]);


/**
 * Choose a format depending on the given options.
 *
 * @param {Array.<Object>} formats
 * @param {Object} options
 * @returns {Object}
 * @throws {Error} when no format matches the filter/format rules
 */
exports.chooseFormat = (formats, options) => {
  if (typeof options.format === 'object') {
    if (!options.format.url) {
      throw Error('Invalid format given, did you use `ytdl.getInfo()`?');
    }
    return options.format;
  }

  if (options.filter) {
    formats = exports.filterFormats(formats, options.filter);
  }

  // We currently only support HLS-Formats for livestreams
  // So we (now) remove all non-HLS streams
  if (formats.some(fmt => fmt.isHLS)) {
    formats = formats.filter(fmt => fmt.isHLS || !fmt.isLive);
  }

  let format;
  const quality = options.quality || 'highest';
  switch (quality) {
    case 'highest':
      format = formats[0];
      break;

    case 'lowest':
      format = formats[formats.length - 1];
      break;

    case 'highestaudio': {
      formats = exports.filterFormats(formats, 'audio');
      formats.sort(sortFormatsByAudio);
      // Filter for only the best audio format
      const bestAudioFormat = formats[0];
      formats = formats.filter(f => sortFormatsByAudio(bestAudioFormat, f) === 0);
      // Check for the worst video quality for the best audio quality and pick according
      // This does not loose default sorting of video encoding and bitrate
      const worstVideoQuality = formats.map(f => parseInt(f.qualityLabel) || 0).sort((a, b) => a - b)[0];
      format = formats.find(f => (parseInt(f.qualityLabel) || 0) === worstVideoQuality);
      break;
    }

    case 'lowestaudio':
      formats = exports.filterFormats(formats, 'audio');
      formats.sort(sortFormatsByAudio);
      format = formats[formats.length - 1];
      break;

    case 'highestvideo': {
      formats = exports.filterFormats(formats, 'video');
      formats.sort(sortFormatsByVideo);
      // Filter for only the best video format
      const bestVideoFormat = formats[0];
      formats = formats.filter(f => sortFormatsByVideo(bestVideoFormat, f) === 0);
      // Check for the worst audio quality for the best video quality and pick according
      // This does not loose default sorting of audio encoding and bitrate
      const worstAudioQuality = formats.map(f => f.audioBitrate || 0).sort((a, b) => a - b)[0];
      format = formats.find(f => (f.audioBitrate || 0) === worstAudioQuality);
      break;
    }

    case 'lowestvideo':
      formats = exports.filterFormats(formats, 'video');
      formats.sort(sortFormatsByVideo);
      format = formats[formats.length - 1];
      break;

    default:
      format = getFormatByQuality(quality, formats);
      break;
  }

  if (!format) {
    throw Error(`No such format found: ${quality}`);
  }
  return format;
};

/**
 * Gets a format based on quality or array of quality's
 *
 * @param {string|[string]} quality
 * @param {[Object]} formats
 * @returns {Object}
 */
const getFormatByQuality = (quality, formats) => {
  let getFormat = itag => formats.find(format => `${format.itag}` === `${itag}`);
  if (Array.isArray(quality)) {
    return getFormat(quality.find(q => getFormat(q)));
  } else {
    return getFormat(quality);
  }
};


/**
 * @param {Array.<Object>} formats
 * @param {Function} filter
 * @returns {Array.<Object>}
 */
exports.filterFormats = (formats, filter) => {
  let fn;
  switch (filter) {
    case 'videoandaudio':
    case 'audioandvideo':
      fn = format => format.hasVideo && format.hasAudio;
      break;

    case 'video':
      fn = format => format.hasVideo;
      break;

    case 'videoonly':
      fn = format => format.hasVideo && !format.hasAudio;
      break;

    case 'audio':
      fn = format => format.hasAudio;
      break;

    case 'audioonly':
      fn = format => !format.hasVideo && format.hasAudio;
      break;

    default:
      if (typeof filter === 'function') {
        fn = filter;
      } else {
        throw TypeError(`Given filter (${filter}) is not supported`);
      }
  }
  return formats.filter(format => !!format.url && fn(format));const PassThrough = require('stream').PassThrough;
  const getInfo = require('./info');
  const utils = require('./utils');
  const formatUtils = require('./format-utils');
  const urlUtils = require('./url-utils');
  const miniget = require('miniget');
  const m3u8stream = require('m3u8stream');
  const { parseTimestamp } = require('m3u8stream');
  const agent = require('./cache');


  /**
   * @param {string} link
   * @param {!Object} options
   * @returns {ReadableStream}
   */
  const ytdl = (link, options) => {
    const stream = createStream(options);
    ytdl.getInfo(link, options).then(info => {
      downloadFromInfoCallback(stream, info, options);
    }, stream.emit.bind(stream, 'error'));
    return stream;
  };
  module.exports = ytdl;

  ytdl.getBasicInfo = getInfo.getBasicInfo;
  ytdl.getInfo = getInfo.getInfo;
  ytdl.chooseFormat = formatUtils.chooseFormat;
  ytdl.filterFormats = formatUtils.filterFormats;
  ytdl.validateID = urlUtils.validateID;
  ytdl.validateURL = urlUtils.validateURL;
  ytdl.getURLVideoID = urlUtils.getURLVideoID;
  ytdl.getVideoID = urlUtils.getVideoID;
  ytdl.createAgent = agent.createAgent;
  ytdl.createProxyAgent = agent.createProxyAgent;
  ytdl.cache = {
    info: getInfo.cache,
    watch: getInfo.watchPageCache,
  };
  ytdl.version = require('../package.json').version;


  const createStream = options => {
    const stream = new PassThrough({
      highWaterMark: (options && options.highWaterMark) || 1024 * 512,
    });
    stream._destroy = () => { stream.destroyed = true; };
    return stream;
  };


  const pipeAndSetEvents = (req, stream, end) => {
    // Forward events from the request to the stream.
    [
      'abort', 'request', 'response', 'error', 'redirect', 'retry', 'reconnect',
    ].forEach(event => {
      req.prependListener(event, stream.emit.bind(stream, event));
    });
    req.pipe(stream, { end });
  };


  /**
   * Chooses a format to download.
   *
   * @param {stream.Readable} stream
   * @param {Object} info
   * @param {Object} options
   */
  const downloadFromInfoCallback = (stream, info, options) => {
    options = options || {};

    let err = utils.playError(info.player_response);
    if (err) {
      stream.emit('error', err);
      return;
    }

    if (!info.formats.length) {
      stream.emit('error', Error('This video is unavailable'));
      return;
    }

    let format;
    try {
      format = formatUtils.chooseFormat(info.formats, options);
    } catch (e) {
      stream.emit('error', e);
      return;
    }
    stream.emit('info', info, format);
    if (stream.destroyed) { return; }

    let contentLength, downloaded = 0;
    const ondata = chunk => {
      downloaded += chunk.length;
      stream.emit('progress', chunk.length, downloaded, contentLength);
    };

    utils.applyDefaultHeaders(options);
    if (options.IPv6Block) {
      options.requestOptions = Object.assign({}, options.requestOptions, {
        localAddress: utils.getRandomIPv6(options.IPv6Block),
      });
    }
    if (options.agent) {
      if (options.agent.jar) {
        utils.setPropInsensitive(
          options.requestOptions.headers, 'cookie', options.agent.jar.getCookieStringSync('https://www.youtube.com'),
        );
      }
      if (options.agent.localAddress) {
        options.requestOptions.localAddress = options.agent.localAddress;
      }
    }

    // Download the file in chunks, in this case the default is 10MB,
    // anything over this will cause youtube to throttle the download
    const dlChunkSize = typeof options.dlChunkSize === 'number' ? options.dlChunkSize : 1024 * 1024 * 10;
    let req;
    let shouldEnd = true;

    if (format.isHLS || format.isDashMPD) {
      req = m3u8stream(format.url, {
        chunkReadahead: +info.live_chunk_readahead,
        begin: options.begin || (format.isLive && Date.now()),
        liveBuffer: options.liveBuffer,
        requestOptions: options.requestOptions,
        parser: format.isDashMPD ? 'dash-mpd' : 'm3u8',
        id: format.itag,
      });

      req.on('progress', (segment, totalSegments) => {
        stream.emit('progress', segment.size, segment.num, totalSegments);
      });
      pipeAndSetEvents(req, stream, shouldEnd);
    } else {
      const requestOptions = Object.assign({}, options.requestOptions, {
        maxReconnects: 6,
        maxRetries: 3,
        backoff: { inc: 500, max: 10000 },
      });

      let shouldBeChunked = dlChunkSize !== 0 && (!format.hasAudio || !format.hasVideo);

      if (shouldBeChunked) {
        let start = (options.range && options.range.start) || 0;
        let end = start + dlChunkSize;
        const rangeEnd = options.range && options.range.end;

        contentLength = options.range ?
          (rangeEnd ? rangeEnd + 1 : parseInt(format.contentLength)) - start :
          parseInt(format.contentLength);

        const getNextChunk = () => {
          if (stream.destroyed) return;
          if (!rangeEnd && end >= contentLength) end = 0;
          if (rangeEnd && end > rangeEnd) end = rangeEnd;
          shouldEnd = !end || end === rangeEnd;

          requestOptions.headers = Object.assign({}, requestOptions.headers, {
            Range: `bytes=${start}-${end || ''}`,
          });
          req = miniget(format.url, requestOptions);
          req.on('data', ondata);
          req.on('end', () => {
            if (stream.destroyed) return;
            if (end && end !== rangeEnd) {
              start = end + 1;
              end += dlChunkSize;
              getNextChunk();
            }
          });
          pipeAndSetEvents(req, stream, shouldEnd);
        };
        getNextChunk();
      } else {
        // Audio only and video only formats don't support begin
        if (options.begin) {
          format.url += `&begin=${parseTimestamp(options.begin)}`;
        }
        if (options.range && (options.range.start || options.range.end)) {
          requestOptions.headers = Object.assign({}, requestOptions.headers, {
            Range: `bytes=${options.range.start || '0'}-${options.range.end || ''}`,
          });
        }
        req = miniget(format.url, requestOptions);
        req.on('response', res => {
          if (stream.destroyed) return;
          contentLength = contentLength || parseInt(res.headers['content-length']);
        });
        req.on('data', ondata);
        pipeAndSetEvents(req, stream, shouldEnd);
      }
    }

    stream._destroy = () => {
      stream.destroyed = true;
      if (req) {
        req.destroy();
        req.end();
      }
    };
  };


  /*
   * Can be used to download video after its `info` is gotten through
   * `ytdl.getInfo()`. In case the user might want to look at the
   * `info` object before deciding to download.
   *
   * @param {Object} info
   * @param {!Object} options
   * @returns {ReadableStream}
   */
  ytdl.downloadFromInfo = (info, options) => {
    const stream = createStream(options);
    if (!info.full) {
      throw Error('Cannot use `ytdl.downloadFromInfo()` when called with info from `ytdl.getBasicInfo()`');
    }
    setImmediate(() => {
      downloadFromInfoCallback(stream, info, options);
    });
    return stream;
  };
};


/**
 * @param {Object} format
 * @returns {Object}
 */
exports.addFormatMeta = format => {
  format = Object.assign({}, FORMATS[format.itag], format);
  format.hasVideo = !!format.qualityLabel;
  format.hasAudio = !!format.audioBitrate;
  format.container = format.mimeType ?
    format.mimeType.split(';')[0].split('/')[1] : null;
  format.codecs = format.mimeType ?
    utils.between(format.mimeType, 'codecs="', '"') : null;
  format.videoCodec = format.hasVideo && format.codecs ?
    format.codecs.split(', ')[0] : null;
  format.audioCodec = format.hasAudio && format.codecs ?
    format.codecs.split(', ').slice(-1)[0] : null;
  format.isLive = /\bsource[/=]yt_live_broadcast\b/.test(format.url);
  format.isHLS = /\/manifest\/hls_(variant|playlist)\//.test(format.url);
  format.isDashMPD = /\/manifest\/dash\//.test(format.url);
  return format;
};
