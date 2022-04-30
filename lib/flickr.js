const API_KEY = process.env.FLICKR_API_KEY;
const USER_ID = process.env.FLICKR_USER_ID;

var Flickr = require("flickr-sdk");

const flickr = new Flickr(API_KEY);

// returns a list of photosets (albums)
// use the photoset id to get the photos in subsequent call
export async function getPhotosets() {
  try {
    let photosets = [];
    flickr.photosets
      .getList({ user_id: USER_ID })
      .then((res) => {
        for (let set of res.body.photosets.photoset) {
          let title = set.title._content;
          let id = set.id;
          photosets.push({ id: id, title: title });
        }
        return photosets;
      })
      .catch((err) => {
        console.error("bonk", err);
      });
  } catch (error) {
    console.error(error);
  }
}

// get photo_ids for photos in photoset
export async function getPhotosInPhotoset(photoset_id) {
  try {
    let photos = [];
    // let set_id = parseInt(photoset_id);
    flickr.photosets
      .getPhotos({
        user_id: USER_ID,
        photoset_id: photoset_id,
        extras: ["url_o"],
      })
      .then((res) => {
        for (let photo of res.body.photoset.photo) {
          photos.push(photo);
        }
        return photos;
      })
      .catch((err) => {
        console.error("fail", err);
      });
  } catch (error) {
    console.error(error);
  }
}
