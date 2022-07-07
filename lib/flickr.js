const API_KEY = process.env.FLICKR_API_KEY;
const USER_ID = process.env.FLICKR_USER_ID;

var Flickr = require("flickr-sdk");

const flickr = new Flickr(API_KEY);

// returns a list of photosets (albums)
// use the photoset id to get the photos in subsequent call
// returns an array of photosets with id and title
// [ { id: '72177720298514138', title: 'Laos' },
// { id: '72177720298510765', title: 'Thailand' }]

export async function getPhotosets() {
  let photosets = [];
  try {
    // call flickr api
    await flickr.photosets
      .getList({ user_id: USER_ID })
      .then((res) => {
        for (let set of res.body.photosets.photoset) {
          let title = set.title._content;
          let id = set.id;
          photosets.push({ id: id, title: title });
        }
      })
      .catch((err) => {
        console.error("unable to get photoset list", err);
      });
  } catch (error) {
    console.error(error);
  }
  return photosets;
}

// get photo_ids for photos in photoset
// takes an object like this
// { id: 123, title: string }
//
// returns an array of all photos
function getAspectRatio(height, width) {
  if (height > width) {
    return { width: 1, height: height / width };
  } else {
    return { height: 1, width: width / height };
  }
}

function constructFlickrUrl(photo_id) {
  const base_url = "https://www.flickr.com/photos/147917629@N04/";
  return `${base_url}/${photo_id}`;
}

export async function getPhotosInPhotoset(photoset) {
  let photos = [];
  try {
    await flickr.photosets
      .getPhotos({
        user_id: USER_ID,
        photoset_id: photoset.id,
        extras: ["url_c"],
      })
      .then((res) => {
        for (let photo of res.body.photoset.photo) {
          const dimensions = getAspectRatio(photo.height_c, photo.width_c);
          const flickr_url = constructFlickrUrl(photo.id);
          photos.push({
            flickr_url: flickr_url,
            src: photo.url_c,
            title: photo.title,
            width: dimensions.width,
            height: dimensions.height,
          });
        }
      })
      .catch((err) => {
        console.error("fail", err);
      });
  } catch (error) {
    console.error(error);
  }
  return photos;
}

export async function getAllPhotos() {
  let photos = [];
  // get all photosets
  try {
    let photosets = [];
    await getPhotosets().then((res) => {
      photosets = res;
    });

    for (let set of photosets) {
      await getPhotosInPhotoset(set).then((res) => {
        photos.push(res);
      });
    }
  } catch (error) {
    console.error(error);
  }
  return photos.flat(3);
}
