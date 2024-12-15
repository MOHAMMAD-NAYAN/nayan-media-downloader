const axios = require('axios');

module.exports.ndown = (url) => {
  return new Promise(async (resolve) => {
    try {
      if (
        !url.match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/) &&
        !url.match(/(https|http):\/\/www.instagram.com\/(p|reel|tv|stories)/gi)
      )
        return resolve({
          developer: 'MOHAMMAD NAYAN',
          status: false,
          msg: `Link URL not valid`,
        });

      const data = await axios.get(
        `https://nayan-video-downloader.vercel.app/ndown?url=${url}`
      );
      resolve(data.data);
    } catch (error) {
      resolve({
        developer: 'MOHAMMAD NAYAN',
        status: false,
        msg: 'Something went wrong',
      });
    }
  });
};

module.exports.instagram = (url) => {
  return new Promise(async (resolve) => {
    try {
      const data = await axios.get(
        `https://nayan-video-downloader.vercel.app/instagram?url=${url}`
      );
      resolve(data.data);
    } catch (error) {
      resolve({
        developer: 'MOHAMMAD NAYAN',
        status: false,
        msg: 'Instagram API error',
      });
    }
  });
};

module.exports.tikdown = (url) => {
  return new Promise(async (resolve) => {
    try {
      if (
        !url.match(/https:\/\/vt\.tiktok\.com\/.*/) &&
        !url.match(/https:\/\/vm\.tiktok\.com\/.*/) &&
        !url.match(/https:\/\/www\.tiktok\.com.*/) &&
        !url.match(/https:\/\/m\.tiktok\.com.*/)
      )
        return resolve({
          developer: 'MOHAMMAD NAYAN',
          status: false,
          msg: `Link URL not valid`,
        });

      const data = await axios.get(
        `https://nayan-video-downloader.vercel.app/tikdown?url=${url}`
      );
      resolve(data.data);
    } catch (e) {
      resolve({
        developer: 'MOHAMMAD NAYAN',
        devfb: 'https://www.facebook.com/profile.php?id=100000959749712',
        devwp: 'wa.me/+8801615298449',
        status: false,
        msg: 'TikDown API off🐱',
      });
    }
  });
};

module.exports.ytdown = (url) => {
  return new Promise(async (resolve) => {
    try {
      if (
        !url.match(/https:\/\/(www\.)?youtube\.com\/watch\?v=.*/i) &&
        !url.match(/https:\/\/(www\.)?youtube\.com\/shorts\/.*/i) &&
        !url.match(/https:\/\/(www\.)?youtube\.com\/embed\/.*/i) &&
        !url.match(/https:\/\/(www\.)?youtube\.com\/v\/.*/i) &&
        !url.match(/https:\/\/youtu\.be\/.*/i) &&
        !url.match(/https:\/\/(www\.)?youtube\.com\/playlist\?list=.*/i)
      )
        return resolve({
          developer: 'MOHAMMAD NAYAN',
          status: false,
          msg: `Link URL not valid`,
        });

      const data = await axios.get(
        `https://nayan-video-downloader.vercel.app/ytdown?url=${url}`
      );
      resolve(data.data);
    } catch (error) {
      resolve({
        developer: 'MOHAMMAD NAYAN',
        status: false,
        msg: 'YouTube API error',
      });
    }
  });
};

module.exports.threads = (url) => {
  return new Promise(async (resolve) => {
    try {
      if (!url.match(/^https:\/\/www\.threads\.net\/.*/))
        return resolve({
          developer: 'MOHAMMAD NAYAN',
          status: false,
          msg: `Link URL not valid`,
        });

      const data = await axios.get(
        `https://nayan-video-downloader.vercel.app/threads?url=${url}`
      );
      resolve(data.data);
    } catch (error) {
      resolve({
        developer: 'MOHAMMAD NAYAN',
        status: false,
        msg: 'Threads API error',
      });
    }
  });
};

module.exports.twitterdown = (url) => {
  return new Promise(async (resolve) => {
    try {
      if (
        !url.match(/https:\/\/twitter\.com\/.*/) &&
        !url.match(/^https:\/\/x\.com\/.*/)
      )
        return resolve({
          developer: 'MOHAMMAD NAYAN',
          status: false,
          msg: `Link URL not valid`,
        });

      const data = await axios.get(
        `https://nayan-video-downloader.vercel.app/twitterdown?url=${url}`
      );
      resolve(data.data);
    } catch (e) {
      resolve({
        developer: 'MOHAMMAD NAYAN',
        devfb: 'https://www.facebook.com/profile.php?id=100000959749712',
        devwp: 'wa.me/+8801615298449',
        status: false,
        msg: 'Twitter API off🐱',
      });
    }
  });
};

module.exports.fbdown2 = (url, Key) => {
  return new Promise(async (resolve) => {
    try {
      if (!url)
        return resolve({
          developer: 'MOHAMMAD NAYAN',
          status: false,
          error: 'Missing URL',
        });

      if (!Key)
        return resolve({
          developer: 'MOHAMMAD NAYAN',
          status: false,
          error: 'Missing key',
        });

      const validKeys = ['Nayan', 'nayan', 'Mohammad Nayan'];
      if (!validKeys.includes(Key))
        return resolve({
          error: 'Key invalid',
          msg: 'Contact owner for key',
          fb: 'https://www.facebook.com/100000959749712',
          wp: 'wa.me/+8801615298449',
        });

      if (
        !url.match(/https:\/\/www\.facebook\.com\/.*/) &&
        !url.match(/https:\/\/web\.facebook\.com\/.*/) &&
        !url.match(/https:\/\/fb\.watch\/.*/) &&
        !url.match(/https:\/\/m\.facebook\.com\/.*/)
      )
        return resolve({
          developer: 'MOHAMMAD NAYAN',
          status: false,
          msg: `Link URL not valid`,
        });

      const data = await axios.get(
        `https://nayan-video-downloader.vercel.app/fbdown2?url=${url}&key=${Key}`
      );
      resolve(data.data);
    } catch (error) {
      resolve({
        developer: 'MOHAMMAD NAYAN',
        status: false,
        msg: 'Facebook API error',
      });
    }
  });
};

module.exports.GDLink = (url) => {
  return new Promise(async (resolve) => {
    try {
      const data = await axios.get(
        `https://nayan-video-downloader.vercel.app/GDLink?url=${url}`
      );
      resolve(data.data);
    } catch (error) {
      resolve({
        developer: 'MOHAMMAD NAYAN',
        status: false,
        msg: 'Google Drive API error',
      });
    }
  });
};

module.exports.pintarest = (url) => {
  return new Promise(async (resolve) => {
    try {
      const data = await axios.get(
        `https://nayan-video-downloader.vercel.app/pintarest?url=${url}`
      );
      resolve(data.data);
    } catch (error) {
      resolve({
        developer: 'MOHAMMAD NAYAN',
        status: false,
        msg: 'Pinterest API error',
      });
    }
  });
};

module.exports.capcut = (url) => {
  return new Promise(async (resolve) => {
    try {
      const data = await axios.get(
        `https://nayan-video-downloader.vercel.app/capcut?url=${url}`
      );
      resolve(data.data);
    } catch (error) {
      resolve({
        developer: 'MOHAMMAD NAYAN',
        status: false,
        msg: 'CapCut API error',
      });
    }
  });
};

module.exports.likee = (url) => {
  return new Promise(async (resolve) => {
    try {
      const data = await axios.get(
        `https://nayan-video-downloader.vercel.app/likee?url=${url}`
      );
      resolve(data.data);
    } catch (error) {
      resolve({
        developer: 'MOHAMMAD NAYAN',
        status: false,
        msg: 'Likee API error',
      });
    }
  });
};

module.exports.alldown = (url) => {
  return new Promise(async (resolve) => {
    try {
      const data = await axios.get(
        `https://nayan-video-downloader.vercel.app/alldown?url=${url}`
      );
      resolve(data.data);
    } catch (error) {
      resolve({
        developer: 'MOHAMMAD NAYAN',
        status: false,
        error: 'Unsupported URL',
        msg: 'Supported platforms: Facebook, TikTok, Twitter, Instagram, YouTube, Pinterest, Google Drive, CapCut',
      });
    }
  });
};
