export default function NFTCard({ permalink, image_url }) {
  return (
    <>
      <div className="shadow-md m-2">
        <a href={permalink} target="_blank" rel="noreferrer">
          <div className="relative m-2 flex-none bg-cover rounded-l">
            {image_url ? <img src={image_url} alt={image_url} /> : <></>}
          </div>
        </a>
      </div>
    </>
  );
}
